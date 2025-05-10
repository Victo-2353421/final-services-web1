import { 
    bdValidationCle, bdAjouterUtilisateur, bdConnecterUtilisateur, bdGenererCleAPI, bdObtenirCleAPI
} from "../models/utilisateur.model.js";

const ajouterUtilisateur = async (req, res) => {
    try {
        const champs = req.body || {};
        const champs_invalides = [];

        if (typeof champs.nom !== 'string' || champs.nom.length < 2)
            champs_invalides.push("nom");
        if (typeof champs.prenom !== 'string' || champs.prenom.length < 2)
            champs_invalides.push("prenom");
        if (typeof champs.courriel !== 'string' || champs.courriel.length < 6)
            champs_invalides.push("courriel");
        if (typeof champs.password !== 'string' || champs.password.length < 8)
            champs_invalides.push("password");

        if (champs_invalides.length) {
            return res.status(400).send({
                "erreur": "format des donnees invalide",
                "champs_invalides" : champs_invalides
            });
        }

        const cle_api = await bdAjouterUtilisateur(
            champs.nom,
            champs.prenom,
            champs.courriel,
            champs.password
        );

        if (!cle_api) {
            return res.status(409).send({
                "erreur": "echec de l'ajout de l'utilisateur. le courriel doit être unique"
            });
        }

        return res.status(201).send({ "cle_api":cle_api });

    } catch (erreur) {
        console.error("Erreur lors de l'ajout d'utilisateur :", erreur);
        return res.status(500).send({"erreur": "erreur serveur"});
    }
};

const obtenirCle = async (req, res) => {
    try {
        let champs = req.body;
        if(!champs) champs = {};
        const champs_invalides = [];

        if (typeof champs.courriel !== 'string') champs_invalides.push("courriel");
        if (typeof champs.password !== 'string') champs_invalides.push("password");

        if (champs_invalides.length) {
            return res.status(400).send({
                "erreur": "format des donnees invalide",
                "champs_invalides": champs_invalides
            });
        }

        // Authentification
        const idUtilisateur = await bdConnecterUtilisateur(champs.courriel, champs.password);
        if (!idUtilisateur) {
            return res.status(401).send({ "erreur": "authentification invalide" });
        }

        // (Re)génération de la clé d'API
        if (champs.regenerer === true) {
            const nouvelleCle = await bdGenererCleAPI(idUtilisateur);
            if (!nouvelleCle) {
                return res.status(404).send({ "erreur": "echec de la generation de la cle api" });
            }
            return res.status(200).send({ "cle_api": nouvelleCle });
        }

        // Obtention de la clé d'API existante
        const cle = await bdObtenirCleAPI(idUtilisateur);
        if (!cle) {
            return res.status(404).send({ "erreur": "echec de l'obtention de la cle api" });
        }

        return res.status(200).send({ "cle_api": cle });

    } catch (erreur) {
        console.error("Erreur:", erreur);
        return res.status(500).send({ "erreur": "erreur serveur" });
    }
};

export {
    ajouterUtilisateur, obtenirCle,
};