const { Pool } = require('pg');
require('dotenv').config(
    
);

const database = new Pool({
  connectionString: process.env.DATABASE_URL,
});
async function getTasksByUser(userId) {
    try {
        const query = "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC";
        const result = await database.query(query, [userId]);
        return result.rows; // Renvoie la liste des tâches
    } catch (error) {
        console.error("Erreur SQL lors de la récupération des tâches :", error);
        throw error;
    }
}
async function createTask(userId, title, description, category, priority, status) {
    const query = `
        INSERT INTO tasks (title, description, user_id, category, priority, status) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *;
    `;
    const values = [
        title,
        description || null,
        userId,
        category || null,
        priority || 'medium',
        status || 'todo',
    ];
    const result = await database.query(query, values);
    return result.rows[0];
}
async function updateTask(id, userId, title, description, category, priority, status) {
    const query = `
        UPDATE tasks 
        SET title = $1, description = $2, category = $3, priority = $4, status = $5
        WHERE id = $6 AND user_id = $7
        RETURNING *;
    `;
    const values = [title, description, category, priority, status, id, userId];
    const result = await database.query(query, values);
    return result.rows[0] ?? null;
}

async function deleteTask(taskId, userId) {
    const query = `
        DELETE FROM tasks 
        WHERE id = $1 AND user_id = $2 
        RETURNING *;
    `;
    const result = await database.query(query, [taskId, userId]);
    return result.rowCount > 0; // Renvoie true si la tâche a bien été supprimée, false sinon
}
module.exports = { updateTask,database, getTasksByUser, createTask, deleteTask };