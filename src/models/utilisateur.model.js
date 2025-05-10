import db from '../config/db.js';
import bcrypt from 'bcrypt';

const costFactor = 10;

function hasherMotDePasseUtilisateur(mdp) {
    return bcrypt.hash(mdp, costFactor);
}


/**
 * Retourne l'id de l'utilisateur selon sa cle_api
 * @param {string} cle_api cle_api de l'utilisateur
 * @returns {Promise<number|null>} L'id de l'utilisateur, ou null si non trouvée
 */
async function bdValidationCle(cle_api) {
    try {
        const requete = 'SELECT "id" FROM "utilisateurs" WHERE "cle_api" = $1';
        const resultat = await db.query(requete, [cle_api]);

        if (!resultat.rowCount) return 0;
        else return resultat.rows[0].id;
    } catch (erreur) {
        console.error(`Erreur SQL lors de l'obtention de la clé API : ${erreur}`);
        throw erreur;
    }
}

/**
 * Génère une clé d'API à être utiliser dans la base de données.
 * La chance de collision est près d'impossible.
 * Inspiré de https://stackoverflow.com/a/1349426
 * @returns 
 */
function creerCleApi() {
    const longueur         = 30;
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    var resultat           = '';
    for ( var i = 0; i < longueur; i++ ) {
        resultat += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return resultat;
}

/**
 * Ajoute un utilisateur dans la BD et retourne sa cle_api
 * @param {string} nom 
 * @param {string} prenom 
 * @param {string} courriel 
 * @param {string} password 
 * @returns {Promise<string|number>} 0 en cas d'échec (courriel déjà utilisé), sinon la cle_api
 */
async function bdAjouterUtilisateur(nom, prenom, courriel, password) {
    try {
        const hash = await hasherMotDePasseUtilisateur(password);

        // Vérification si le courriel existe déjà
        const requeteVerif = 'SELECT EXISTS (SELECT 1 FROM utilisateurs WHERE courriel = $1);';
        const verifResult = await db.query(requeteVerif, [courriel]);
        const existe = verifResult.rows[0].exists;
        if (existe) return 0;

        // Insertion de l'utilisateur
        const cle_api = creerCleApi();
        const requeteInsert = `
            INSERT INTO "utilisateurs" ("nom", "prenom", "courriel", "cle_api", "password")
            VALUES ($1, $2, $3, $4, $5) RETURNING cle_api;
        `;
        const insertResult = await db.query(requeteInsert, [nom, prenom, courriel, cle_api, hash]);

        return insertResult.rows[0].cle_api;
    } catch (erreur) {
        console.error("Erreur SQL : ", erreur);
        throw erreur;
    }
}


/**
 * Vérifie l'authentification d'un utilisateur
 * @param {string} courriel Courriel de l'utilisateur
 * @param {string} password Mot de passe en clair
 * @returns {Promise<number>} 0 si échec, sinon l'id de l'utilisateur
 */
async function bdConnecterUtilisateur(courriel, password) {
    try {
        const requete = 'SELECT "id", "password" FROM "utilisateurs" WHERE "courriel" = $1';
        const resultat = await db.query(requete, [courriel]);

        if (resultat.rowCount === 0) return 0; // Aucun utilisateur avec ce courriel

        const utilisateur = resultat.rows[0];
        const correspond = await bcrypt.compare(password, utilisateur.password);

        if (!correspond) return 0; // Mot de passe invalide

        return utilisateur.id;
    } catch (erreur) {
        console.error(`Erreur SQL : ${erreur}`);
        throw erreur;
    }
}

/**
 * (Re)génère la clé API d'un utilisateur
 * @param {string} id id de l'utilisateur dans la BD
 * @returns La nouvelle cle_api, ou null si l'utilisateur n'existe pas
 */
async function bdGenererCleAPI(id) {
    const cle = creerCleApi();
    try {
        const requete = 'UPDATE "utilisateurs" SET "cle_api" = $1 WHERE "id" = $2 RETURNING cle_api';
        const resultat = await db.query(requete, [cle, id]);

        if (resultat.rowCount === 0) return null;

        return resultat.rows[0].cle_api;
    } catch (erreur) {
        console.error(`Erreur SQL : ${erreur}`);
        throw erreur;
    }
}

/**
 * Retourne la `cle_api` selon l'id de l'utilisateur
 * @param {number} id ID de l'utilisateur dans la BD
 * @returns {Promise<string|null>} La cle_api, ou null si non trouvée
 */
async function bdObtenirCleAPI(id) {
    try {
        const requete = 'SELECT "cle_api" FROM "utilisateurs" WHERE "id" = $1';
        const resultat = await db.query(requete, [id]);

        if (resultat.rowCount === 0) return null;

        return resultat.rows[0].cle_api;
    } catch (erreur) {
        console.error(`Erreur SQL lors de l'obtention de la clé API : ${erreur}`);
        throw erreur;
    }
}


export {
    bdValidationCle, bdAjouterUtilisateur, bdConnecterUtilisateur, bdGenererCleAPI, bdObtenirCleAPI
};