import db from '../config/db.js';

/**
 * Crée une sous-tâche dans la BD selon l'id d'un utilisateur et l'id d'une tâche mère
 * @param {number} tache_id L'id de la tâche mère
 * @param {string} titre titre de la sous-tâche
 * @param {boolean} complete si la sous-tâche est complétée
 * @returns l'objet de la sous-tâche créée
 */
async function bdAjouterSousTache(tache_id, titre, complete){
    try {
        const requete = `
            INSERT INTO "sous_taches" ("tache_id", "titre", "complete")
            VALUES ($1, $2, $3) RETURNING "id", "tache_id", "titre", "complete";
        `;
        const insertResult = await db.query(requete, [tache_id, titre, complete]);

        return insertResult.rows[0];
    } catch (erreur) {
        console.error("Erreur SQL : ", erreur);
        throw erreur;
    }
}

/**
 * Modifie une sous-tâche dans la BD selon son id et l'id de l'utilisateur
 * @param {number} id L'id de la sous-tâche
 * @param {number} utilisateur_id L'id de l'utilisateur
 * @param {string} titre titre de la sous-tâche
 * @param {boolean} complete si la sous-tâche est complétée
 * @returns l'objet de la sous-tâche modifiée
 */
async function bdModifierSousTache(id, utilisateur_id, titre, complete){
    try {
        const requete = `
            UPDATE "sous_taches"
            SET "titre" = $3, "complete" = $4
            FROM "taches"
            WHERE "taches"."id" = "sous_taches"."tache_id"
            AND   "sous_taches"."id" = $1
            AND   "taches"."utilisateur_id" = $2
            RETURNING "sous_taches"."id", "sous_taches"."tache_id", "sous_taches"."titre", "sous_taches"."complete";
        `;
        const resultat = await db.query(requete, [id, utilisateur_id, titre, complete]);

        return resultat.rows[0];
    } catch (erreur) {
        console.error("Erreur SQL : ", erreur);
        throw erreur;
    }
}

/**
 * Modifie le statut d'une sous-tâche dans la BD selon son id et l'id de l'utilisateur
 * @param {number} id L'id de la sous-tâche
 * @param {number} utilisateur_id L'id de l'utilisateur
 * @param {boolean} complete si la sous-tâche est complétée
 * @returns l'objet de la sous-tâche modifiée
 */
async function bdModifierStatutSousTache(id, utilisateur_id, complete){
    try {
        const requete = `
            UPDATE "sous_taches"
            SET "complete" = $3
            FROM "taches"
            WHERE "taches"."id" = "sous_taches"."tache_id"
            AND   "sous_taches"."id" = $1
            AND   "taches"."utilisateur_id" = $2
            RETURNING "sous_taches"."id", "sous_taches"."tache_id", "sous_taches"."titre", "sous_taches"."complete";
        `;
        const resultat = await db.query(requete, [id, utilisateur_id, complete]);

        return resultat.rows[0];
    } catch (erreur) {
        console.error("Erreur SQL : ", erreur);
        throw erreur;
    }
}


/**
 * Supprime une sous-tâche dans la BD selon son id et l'id de l'utilisateur
 * @param {number} id L'id de la sous-tâche
 * @param {number} utilisateur_id L'id de l'utilisateur
 * @returns l'objet de la sous-tâche supprimée
 */
async function bdSupprimerSousTache(id, utilisateur_id){
    try {
        const requete = `
            DELETE FROM "sous_taches"
            USING "taches"
            WHERE "sous_taches"."id" = $1
            AND   "taches"."utilisateur_id" = $2
            RETURNING "sous_taches"."id", "sous_taches"."tache_id", "sous_taches"."titre", "sous_taches"."complete";
        `;
        const resultat = await db.query(requete, [id, utilisateur_id]);

        return resultat.rows[0];
    } catch (erreur) {
        console.error("Erreur SQL : ", erreur);
        throw erreur;
    }
}


export {
    bdAjouterSousTache, bdModifierSousTache, bdModifierStatutSousTache, bdSupprimerSousTache
}
