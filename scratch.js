const readline = require('readline');

// Configuration de l'interface de lecture du terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

let currentAccount = null; // Stockera l'adresse et le token en cours

async function getDomain() {
    const domainRes = await fetch('https://api.mail.tm/domains');
    const domainData = await domainRes.json();
    return domainData['hydra:member'][0].domain;
}

async function createAccount() {
    try {
        const domain = await getDomain();
        const randomId = Date.now();
        const address = `dev_${randomId}@${domain}`;
        const password = `Password123!${randomId}`;

        // Création du compte
        const createRes = await fetch('https://api.mail.tm/accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address, password })
        });

        if (!createRes.ok) throw new Error("Erreur lors de la création.");

        // Récupération du token
        const tokenRes = await fetch('https://api.mail.tm/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address, password })
        });
        const tokenData = await tokenRes.json();

        currentAccount = {
            address,
            token: tokenData.token
        };

        console.log(`\n[SUCCÈS] Boîte créée : ${address}\n`);
    } catch (error) {
        console.error("\n[ERREUR]", error.message, "\n");
    }
}

async function checkEmails() {
    if (!currentAccount) {
        console.log("\n[ATTENTION] Aucune adresse active. Veuillez d'abord créer un compte (Option 1).\n");
        return;
    }

    try {
        console.log(`\nVérification des e-mails pour : ${currentAccount.address}...`);

        const messagesRes = await fetch('https://api.mail.tm/messages', {
            headers: { 'Authorization': `Bearer ${currentAccount.token}` }
        });
        const messagesData = await messagesRes.json();
        const messages = messagesData['hydra:member'];

        if (messages.length === 0) {
            console.log("-> Aucun e-mail reçu pour l'instant.\n");
            return;
        }

        console.log(`-> ${messages.length} e-mail(s) trouvé(s) !\n`);

        // Afficher les derniers messages
        for (const msg of messages) {
            const detailRes = await fetch(`https://api.mail.tm/messages/${msg.id}`, {
                headers: { 'Authorization': `Bearer ${currentAccount.token}` }
            });
            const details = await detailRes.json();

            console.log("-----------------------------------------");
            console.log(`De       : ${details.from.address}`);
            console.log(`Sujet    : ${details.subject}`);
            console.log(`Contenu  : ${details.text || details.html}`);
            console.log("-----------------------------------------\n");
        }
    } catch (error) {
        console.error("\n[ERREUR lors du fetch]", error.message, "\n");
    }
}

async function mainMenu() {
    console.log("=== GESTIONNAIRE D'EMAILS JETABLES ===");
    if (currentAccount) {
        console.log(`Adresse actuelle : ${currentAccount.address}`);
    } else {
        console.log(`Adresse actuelle : Aucune`);
    }
    console.log("1. Créer une nouvelle adresse e-mail");
    console.log("2. Fetch / Vérifier les e-mails reçus");
    console.log("3. Quitter");

    const choice = await question("\nVotre choix : ");

    switch (choice.trim()) {
        case '1':
            await createAccount();
            break;
        case '2':
            await checkEmails();
            break;
        case '3':
            console.log("Fermeture...");
            rl.close();
            return;
        default:
            console.log("\nOption invalide, réessayez.\n");
    }

    // Relancer le menu après chaque action
    mainMenu();
}

// Démarrage du script
mainMenu();