import { bdValidationCle } from "../models/utilisateur.model.js";

const authentification = (req, res, next) => {

    // Vérifier si la clé API est présente dans l'entête
    if(!req.headers.authorization) {
        return res.status(401).json({ message: "Vous devez fournir une clé api" });
    }

    // Récupérer la clé API qui est dans l'entête au format "cle_api XXXXXXXX"
    const cleApi = req.headers.authorization.split(' ')[1];
    // Vérifier si la clé API est valide
    bdValidationCle(cleApi)
    .then(resultat => {
        if(!resultat) {
            return res.status(401).json({ message: "Clé API invalide" });
        } else {
            // La clé API est valide, on continue le traitement avec la fonction next()
            next();
        }
    })
    .catch(erreur => {
        console.log(erreur);
        return res.status(500).json({ message: "Erreur lors de la validation de la clé api" })
    });    
}

export default authentification;