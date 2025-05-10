import {
    bdValidationCle, bdAjouterUtilisateur, bdConnecterUtilisateur, bdGenererCleAPI, bdObtenirCleAPI
} from "../models/utilisateur.model.js";
import {
    bdAjouterTache, bdDetailTache, bdListerTaches, bdSupprimerTache, bdModifierTache
} from "../models/taches.model.js";

const regexDate = /^\d{4}-\d{2}-\d{2}$/;

/// Tâches

const listerTaches = async(req, res)=>{
    try {
        const champs = req.query || {};
        let toutes = (champs.toutes);

        const idUtilisateur = await bdValidationCle(req.headers.authorization.split(' ')[1]);
        if(!idUtilisateur)
            return res.status(401).send({ "erreur": "cle d'api invalide" });

        const detail = await bdListerTaches(idUtilisateur, toutes === "true");

        if(!detail) return res.status(404).send({"erreur": "aucune taches trouvees"});

        return res.status(200).send(detail);

    } catch (erreur){
        console.log("Erreur lors du listage des tâches : ", erreur);
        return res.status(500).send({"erreur": "erreur serveur"});
    }
};
const detailTache = async(req, res)=>{
    try {
        let id = Number(req.params.id);

        if (!id) {
            return res.status(400).send({
                erreur: "id invalide"
            });
        }

        const idUtilisateur = await bdValidationCle(req.headers.authorization.split(' ')[1]);
        if(!idUtilisateur)
            return res.status(401).send({ "erreur": "cle d'api invalide" });

        const detail = await bdDetailTache(idUtilisateur, id);

        if(!detail) return res.status(404).send({"erreur": "tache inexistante"});

        return res.status(200).send(detail);

    } catch (erreur){
        console.log("Erreur lors de l'ajout de tache : ", erreur);
        return res.status(500).send({"erreur": "erreur serveur"});
    }
};
const ajouterTache = async(req, res)=>{
    try {
        let champs = req.body;
        if(!champs) champs = {};
        const champs_invalides = [];

        if (typeof champs.titre         !== 'string' || champs.titre.length > 100)
            champs_invalides.push("titre");
        if (typeof champs.description   !== 'string' || champs.titre.length > 500)
            champs_invalides.push("description");
        if (typeof champs.date_debut    !== 'string' || !regexDate.test(champs.date_debut)) // SÉCURITÉ ICI NON IMPLÉMENTÉ
            champs_invalides.push("date_debut");
        if (typeof champs.date_echeance !== 'string' || !regexDate.test(champs.date_echeance))
            champs_invalides.push("date_echeance");
        if (typeof champs.complete      !== 'boolean')
            champs_invalides.push("complete");

        if (champs_invalides.length) {
            return res.status(400).send({
                erreur: "format des donnees invalide",
                champs_invalides: champs_invalides
            });
        }

        const idUtilisateur = await bdValidationCle(req.headers.authorization.split(' ')[1]);
        if(!idUtilisateur)
            return res.status(401).send({ "erreur": "cle d'api invalide" });

        const id = await bdAjouterTache(
            idUtilisateur,
            champs.titre,
            champs.description,
            champs.date_debut,
            champs.date_echeance,
            champs.complete
        );

        return res.status(201).send({
            "id": id,
            "utilisateur_id": idUtilisateur,
            "titre": champs.titre,
            "description": champs.description,
            "date_debut": champs.date_debut,
            "date_echeance": champs.date_echeance,
            "complete": champs.complete
        });

    } catch (erreur){
        console.log("Erreur lors de l'ajout de tâche : ", erreur);
        return res.status(500).send({"erreur": "erreur serveur"});
    }
};
const modifierTache = async(req, res)=>{
    try {
        let champs = req.body;
        if(!champs) champs = {};
        const champs_invalides = [];

        if (typeof champs.id            !== 'number')
            champs_invalides.push("id");
        if (typeof champs.titre         !== 'string' || champs.titre.length > 100)
            champs_invalides.push("titre");
        if (typeof champs.description   !== 'string' || champs.titre.length > 500)
            champs_invalides.push("description");
        if (typeof champs.date_debut    !== 'string' || !regexDate.test(champs.date_debut)) // SÉCURITÉ ICI NON IMPLÉMENTÉ
            champs_invalides.push("date_debut");
        if (typeof champs.date_echeance !== 'string' || !regexDate.test(champs.date_echeance))
            champs_invalides.push("date_echeance");
        if (typeof champs.complete      !== 'boolean')
            champs_invalides.push("complete");

        if (champs_invalides.length) {
            return res.status(400).send({
                erreur: "format des donnees invalide",
                champs_invalides: champs_invalides
            });
        }

        const idUtilisateur = await bdValidationCle(req.headers.authorization.split(' ')[1]);
        if(!idUtilisateur)
            return res.status(401).send({ "erreur": "cle d'api invalide" });

        const detail = await bdDetailTache(idUtilisateur, champs.id);
        if(!detail) return res.status(404).send({"erreur": "tache inexistante"});

        let update = await bdModifierTache(
            champs.id,
            champs.titre,
            champs.description,
            champs.date_debut,
            champs.date_echeance,
            champs.complete,
        );

        return res.status(200).send(update);

    } catch (erreur){
        console.log("Erreur lors de l'ajout de tache : ", erreur);
        return res.status(500).send({"erreur": "erreur serveur"});
    }
};
const modifierStatutTache = async(req, res)=>{
    try {
        let champs = req.body;
        if(!champs) champs = {};
        const champs_invalides = [];

        if (typeof champs.id       !== 'number')
            champs_invalides.push("id");
        if (typeof champs.complete !== 'boolean')
            champs_invalides.push("complete");

        if (champs_invalides.length) {
            return res.status(400).send({
                erreur: "format des donnees invalide",
                champs_invalides: champs_invalides
            });
        }

        const idUtilisateur = await bdValidationCle(req.headers.authorization.split(' ')[1]);
        if(!idUtilisateur)
            return res.status(401).send({ "erreur": "cle d'api invalide" });

        const detail = await bdDetailTache(idUtilisateur, champs.id);
        if(!detail) return res.status(404).send({"erreur": "tache inexistante"});

        let update = await bdModifierTache(
            detail.id,
            detail.titre,
            detail.description,
            detail.date_debut,
            detail.date_echeance,
            champs.complete,
        );

        return res.status(200).send(update);

    } catch (erreur){
        console.log("Erreur lors de l'ajout de tache : ", erreur);
        return res.status(500).send({"erreur": "erreur serveur"});
    }
};
const supprimerTache = async(req, res)=>{
    try {
        let champs = req.body;
        if(!champs) champs = {};
        const champs_invalides = [];

        if (typeof champs.id      !== 'number')
            champs_invalides.push("id");

        if (champs_invalides.length) {
            return res.status(400).send({
                erreur: "format des donnees invalide",
                champs_invalides: champs_invalides
            });
        }

        const idUtilisateur = await bdValidationCle(req.headers.authorization.split(' ')[1]);
        if(!idUtilisateur)
            return res.status(401).send({ "erreur": "cle d'api invalide" });

        const detail = await bdSupprimerTache(idUtilisateur, champs.id);

        if(!detail) return res.status(404).send({"erreur": "tache inexistante"});

        return res.status(200).send(detail);

    } catch (erreur){
        console.log("Erreur lors de l'ajout de tache : ", erreur);
        return res.status(500).send({"erreur": "erreur serveur"});
    }
};

export {
    listerTaches, detailTache, ajouterTache, modifierTache, modifierStatutTache, supprimerTache
};