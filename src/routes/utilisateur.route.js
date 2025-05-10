import express from 'express';
import {
    ajouterUtilisateur, obtenirCle,
} from '../controllers/utilisateur.controller.js';

const router = express.Router();

/// Utilisateur

//Ajouter utilisateur
router.post('/inscription', (req, res) => {
    ajouterUtilisateur(req, res);
});

//Obtenir/regénérer la clé API de l'utilisateur
router.post('/cle', (req, res) => {
    obtenirCle(req, res);
});

export default router;
