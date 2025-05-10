import { 
    bdValidationCle, bdAjouterUtilisateur, bdConnecterUtilisateur, bdGenererCleAPI, bdObtenirCleAPI
} from "../models/utilisateur.model.js";
import {
    bdAjouterTache, bdDetailTache, bdListerTaches, bdSupprimerTache, bdModifierTache
} from "../models/taches.model.js";
import {
    bdAjouterSousTache, bdModifierSousTache, bdModifierStatutSousTache, bdSupprimerSousTache
} from "../models/sous_taches.model.js";


/// Sous-tâches

const ajouterSousTache = async(req, res)=>{
    try {
        let champs = req.body;
        if(!champs) champs = {};
        const champs_invalides = [];

        if (typeof champs.id       !== 'number')
            champs_invalides.push("id");
        if (typeof champs.titre    !== 'string' || champs.titre.length > 100)
            champs_invalides.push("titre");
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

        const resultat = await bdAjouterSousTache(
            champs.id,
            champs.titre,
            champs.complete
        );

        return res.status(201).send({
            "id": resultat.id,
            "tache_id": resultat.tache_id,
            "titre": resultat.titre,
            "complete": resultat.complete,
        });

    } catch (erreur){
        console.log("Erreur lors de l'ajout de tâche : ", erreur);
        return res.status(500).send({"erreur": "erreur serveur"});
    }
};
const modifierSousTache = async(req, res)=>{
    try {
        let champs = req.body;
        if(!champs) champs = {};
        const champs_invalides = [];

        if (typeof champs.id       !== 'number')
            champs_invalides.push("id");
        if (typeof champs.titre    !== 'string' || champs.titre.length > 100)
            champs_invalides.push("titre");
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
        
        const resultat = await bdModifierSousTache(
            champs.id,
            idUtilisateur,
            champs.titre,
            champs.complete
        );

        if(!resultat) return res.status(404).send({"erreur":"sous-tache inexistante"});

        return res.status(201).send({
            "id": resultat.id,
            "tache_id": resultat.tache_id,
            "titre": resultat.titre,
            "complete": resultat.complete,
        });

    } catch (erreur){
        console.log("Erreur lors de l'ajout de tâche : ", erreur);
        return res.status(500).send({"erreur": "erreur serveur"});
    }
};
const modifierStatutSousTache = async(req, res)=>{
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
        
        const resultat = await bdModifierStatutSousTache(
            champs.id,
            idUtilisateur,
            champs.complete
        );

        if(!resultat) return res.status(404).send({"erreur":"sous-tache inexistante"});

        return res.status(201).send({
            "id": resultat.id,
            "tache_id": resultat.tache_id,
            "titre": resultat.titre,
            "complete": resultat.complete,
        });

    } catch (erreur){
        console.log("Erreur lors de l'ajout de tâche : ", erreur);
        return res.status(500).send({"erreur": "erreur serveur"});
    }
};
const supprimerSousTache = async(req, res)=>{
    try {
        let champs = req.body;
        if(!champs) champs = {};
        const champs_invalides = [];

        if (typeof champs.id       !== 'number')
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
        
        const resultat = await bdSupprimerSousTache(
            champs.id,
            idUtilisateur,
        );

        if(!resultat) return res.status(404).send({"erreur":"sous-tache inexistante"});

        return res.status(201).send({
            "id": resultat.id,
            "tache_id": resultat.tache_id,
            "titre": resultat.titre,
            "complete": resultat.complete,
        });

    } catch (erreur){
        console.log("Erreur lors de l'ajout de tâche : ", erreur);
        return res.status(500).send({"erreur": "erreur serveur"});
    }
};

export {
    ajouterSousTache, modifierSousTache, modifierStatutSousTache, supprimerSousTache
};