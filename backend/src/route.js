const express = require('express');
const { toNodeHandler } = require("better-auth/node");
const router = express.Router();
const databseProvider = require("./databaseProvider");
const { auth } = require("./auth.js");
const { fromNodeHeaders } = require("better-auth/node");

// Route gérée par Better Auth
router.all('/api/auth/*path', toNodeHandler(auth));


function ValidateSession(req, res, next) {
    auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
    }).then((session) => {
        if (!session) {
            return res.status(401).json({ error: "Non autorisé - Veuillez vous connecter" });
        }
        req.session = session;
        next();
    }).catch((error) => {
        console.error("Erreur lors de la validation de la session :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    });
}


router.get("/api/tasks", ValidateSession, async (req, res) => {
    try {
        // ✅ On récupère le userId directement depuis req.session (mis en cache par le middleware)
        const userId = req.session.user.id;
        const tasks = await databseProvider.getTasksByUser(userId);
        
        res.json({
            status: 200,
            message: "Succès",
            userId: userId,
            tasks: tasks
        });
    } catch (err) {
        console.error("Erreur lors de la récupération des tâches :", err);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

router.get("/organization/invite/:id", ValidateSession, async (req, res) => {
    const id = req.params.id;
    console.log("Session:", req.session.user.email);
    console.log("Invitation ID:", req.params.id);
    if (!id) {
        return res.status(400).json({
            error: "ID manquant."
        });
    }

    const data = await auth.api.acceptInvitation({
        body: {
            invitationId: id,
        },
        headers: fromNodeHeaders(req.headers),
    });

    return res.json(data);
});
router.put("/api/tasks/:id", ValidateSession, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, priority, status } = req.body;
        const userId = req.session.user.id;

        // ← vérifications
        if (!id) {
            return res.status(400).json({ error: "L'id est obligatoire" });
        }
        if (!title || !title.trim()) {
            return res.status(400).json({ error: "Le titre est obligatoire" });
        }

        const updatedTask = await databseProvider.updateTask(
            id,
            userId,
            title.trim(),
            description ?? null,
            category ?? null,
            priority ?? 'medium',
            status ?? 'todo',
        );

        if (!updatedTask) {
            return res.status(404).json({ error: "Tâche introuvable" });
        }

        res.json({
            message: "Tâche mise à jour avec succès",
            task: updatedTask
        });

    } catch (err) {
        console.error("Erreur lors de la mise à jour de la tâche :", err);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});
router.post("/api/tasks", ValidateSession, async (req, res) => {
    try {
        const { title, description, category, priority, status } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ error: "Le titre est obligatoire" });
        }

        const userId = req.session.user.id;

        const newTask = await databseProvider.createTask(
            userId,
            title.trim(),
            description ?? null,
            category ?? null,      // ← ajout
            priority ?? 'medium',  // ← ajout
            status ?? 'todo',      // ← ajout
        );
        console.log("Nouvelle tâche créée :", newTask);
        res.status(201).json({
            message: "Tâche créée avec succès",
            task: newTask
        });

    } catch (err) {
        console.error("Erreur lors de la création de la tâche :", err);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

router.delete("/api/tasks/:taskId", ValidateSession, async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const userId = req.session.user.id; // ✅ Correction ici aussi
        
        const deleted = await databseProvider.deleteTask(taskId, userId);
        if (deleted) {
            res.json({
                status: 200,
                message: "Tâche supprimée avec succès"
            });
        } else {
            res.status(404).json({ error: "Tâche non trouvée ou non autorisée" });
        }
    } catch (err) {
        console.error("Erreur lors de la suppression de la tâche :", err);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});
router.use((req,res)=>{
    res.status(404).json({
        error : "Page non trouvez"
    })
})



module.exports = { router };