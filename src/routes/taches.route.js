import express from 'express';
import {
    listerTaches, detailTache, ajouterTache, modifierTache, modifierStatutTache, supprimerTache,
} from '../controllers/taches.controller.js';
import {
    ajouterSousTache, modifierSousTache, modifierStatutSousTache, supprimerSousTache
} from '../controllers/sous_taches.controller.js';

const router = express.Router();


/// Tâches mères

//Afficher une liste paginée de tous les tâches
router.get('/liste', (req, res) => {
    listerTaches(req, res);
});

//Afficher une tâche selon son ID
router.get('/detail/:id', (req, res) =>{
    detailTache(req, res);
});

//Ajouter une tâche
router.post('/tache', (req, res) => {
    ajouterTache(req, res);
});

//Modifier une tâche
router.put('/tache', (req, res) => {
    modifierTache(req, res);
});

//Modifier une tâche
router.put('/tache/statut', (req, res) => {
    modifierStatutTache(req, res);
});

//Supprimer une tâche
router.delete('/tache', (req, res) => {
    supprimerTache(req, res);
});


/// Sous-tâches

//Ajouter une sous-tâche
router.post('/sous-tache', (req, res) => {
    ajouterSousTache(req, res);
});

//Modifier une sous-tâche
router.put('/sous-tache', (req, res) => {
    modifierSousTache(req, res);
});

//Modifier une sous-tâche
router.put('/sous-tache/statut', (req, res) => {
    modifierStatutSousTache(req, res);
});

//Supprimer une sous-tâche
router.delete('/sous-tache', (req, res) => {
    supprimerSousTache(req, res);
});

export default router;