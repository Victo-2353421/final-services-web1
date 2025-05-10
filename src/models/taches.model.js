import db from '../config/db.js';

/**
 * Crée une tâche dans la BD selon l'id d'un utilisateur
 * @param {number} utilisateur_id L'id de l'utilisateur dans la bd
 * @param {string} titre titre de la tâche
 * @param {string} description description
 * @param {string} date_debut date de début
 * @param {string} date_echeance date d'échéance
 * @param {boolean} complete si la tâche est complété
 * @returns l'objet de la tâche créée
 */
async function bdAjouterTache(utilisateur_id, titre, description, date_debut, date_echeance, complete){
    try {
        const requete = `
            INSERT INTO "taches" ("utilisateur_id", "titre", "description", "date_debut", "date_echeance", "complete")
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING "id", "utilisateur_id", "titre", "description", "date_debut", "date_echeance", "complete";
        `;
        const insertResult = await db.query(requete, [utilisateur_id, titre, description, date_debut, date_echeance, complete]);

        return insertResult.rows[0].id;
    } catch (erreur) {
        console.error("Erreur SQL : ", erreur);
        throw erreur;
    }
}

/**
 * Retourne les détails d'une tâche dans la BD selon l'id de l'utilisateur.
 * @param {number} idUtilisateur id de l'utilisateur
 * @param {number} id L'id de la tâche dans la bd
 * @returns l'objet de la tâche, ou null si aucune tâche n'est trouvée
 */
async function bdDetailTache(idUtilisateur, id){
    try {
        const requete =`
            SELECT "id", "titre", "description", "date_debut", "date_echeance", "complete"
            FROM "taches"
            WHERE "utilisateur_id" = $1 AND "id" = $2
        `;
        const resultat = await db.query(requete, [idUtilisateur, id]);

        if(!resultat.rows[0]) return null;
        let retour = resultat.rows[0];

        const requete2 =`
            SELECT "id", "titre", "complete"
            FROM "sous_taches"
            WHERE "tache_id" = $1
        `;
        const resultat2 = await db.query(requete2, [id]);

        retour.sous_taches = resultat2.rows;

        return retour;
    } catch (erreur) {
        console.error("Erreur SQL : ", erreur);
        throw erreur;
    }
}

/**
 * Supprime une tâche dans la BD selon l'id de l'utilisateur.
 * @param {string} idUtilisateur id de l'utilisateur
 * @param {number} id L'id de la tâche dans la BD.
 * @returns l'objet de la tâche supprimée, ou null si aucune tâche n'est trouvée
 */
async function bdSupprimerTache(idUtilisateur, id){
    try {
        const requete = `
            SELECT id FROM "taches"
            WHERE "taches"."utilisateur_id" = $1
            AND   "taches"."id" = $2
        `;
        const resultat1 = await db.query(requete, [idUtilisateur, id]);

        if(!resultat1.rowCount) return null;

        const requete2 =`
            DELETE FROM "sous_taches"
            WHERE "sous_taches"."tache_id" = $1
            RETURNING "id", "tache_id", "titre", "complete";
        `;
        const resultat2 = await db.query(requete2, [resultat1.rows[0].id]);
        
        const requete3 =`
            DELETE FROM "taches"
            WHERE "taches"."utilisateur_id" = $1
            AND   "taches"."id" = $2
            RETURNING "id", "titre", "description", "date_debut", "date_echeance", "complete"
        `;
        const resultat3 = await db.query(requete3, [idUtilisateur, id]);

        let retour = resultat3.rows[0];
        retour.sous_taches = resultat2.rows;

        console.log(retour);

        return retour;
    } catch (erreur) {
        console.error("Erreur SQL : ", erreur);
        throw erreur;
    }
}

/**
 * Retourne la liste des tâches d'un utilisateur dans la BD.
 * @param {string} utilisateur_id utilisateur_id de l'utilisateur
 * @param {boolean} toutes true pour tout retourner, false pour retourner celles qui ne sont pas complétées
 */
async function bdListerTaches(utilisateur_id, toutes){
    try {
        let requete =`
            SELECT "id", "titre", "description", "date_debut", "date_echeance", "complete"
            FROM "taches"
            WHERE "utilisateur_id" = $1 ${toutes ? "" : ' AND "complete" = false'}
            ORDER BY "titre" DESC, "id"
        `;

        const resultat = await db.query(requete, [utilisateur_id]);

        if(!resultat.rowCount)return [];
        let retour = resultat.rows;
        for (let i = 0; i < retour.length; i++) {
            console.log(retour[i]);
            const requete2 =`
                SELECT "id", "titre", "complete"
                FROM "sous_taches"
                WHERE "tache_id" = $1
            `;

            const resultat2 = await db.query(requete2, [retour[i].id]);
            console.log(retour[i].id);
            console.log(resultat2.rows);
            
            retour[i].sous_taches = resultat2.rows;
        }

        return retour;
    } catch (erreur) {
        console.error("Erreur SQL : ", erreur);
        throw erreur;
    }
}

/**
 * Modifie une tâche dans la BD selon l'id de la tâche
 * @param {number} id L'id de la tâche dans la bd
 * @param {string} titre titre de la tâche
 * @param {string} description description
 * @param {string} date_debut date de début
 * @param {string} date_echeance date d'échéance
 * @param {boolean} complete si la tâche est complété
 * @returns l'objet de la tâche modifiée
 */
async function bdModifierTache(id, titre, description, date_debut, date_echeance, complete){
    try {
        const requete = `
            UPDATE "taches"
            SET "titre" = $2, "description" = $3, "date_debut" = $4, "date_echeance" = $5, "complete" = $6
            WHERE "id" = $1 RETURNING "id", "utilisateur_id", "titre", "description", "date_debut", "date_echeance", "complete";
        `;
        const insertResult = await db.query(requete, [id, titre, description, date_debut, date_echeance, complete]);

        return insertResult.rows[0];
    } catch (erreur) {
        console.error("Erreur SQL : ", erreur);
        throw erreur;
    }
}


export {
    bdAjouterTache, bdDetailTache, bdListerTaches, bdSupprimerTache, bdModifierTache
}