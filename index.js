import express from 'express';
import routerTaches from './src/routes/taches.route.js';
import routerUtilisateur from './src/routes/utilisateur.route.js';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import morgan from 'morgan';
import authentification from './src/middlewares/authentification.middleware.js';

// Le fichier qui contient la documentation au format JSON, ajustez selon votre projet
import fs from 'fs';
const swaggerDocument = JSON.parse(fs.readFileSync('./src/config/documentation.json', 'utf8'));
// Options le l'interface, changez le titre "PokemonsAPI" pour le nom de votre projet 
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Application liste de tâches"
};

// Créer une application express
const app = express();

// Importer les middlewares
app.use(cors());
app.use(express.json());
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        res.status(400).send({ "erreur": "JSON invalide" });
    } else {
        next();
    }
});
var accessLogStream = fs.createWriteStream('./access.log', { flags: 'a' });
app.use(morgan('dev', {stream:accessLogStream, skip: function (req, res) { return res.statusCode === 500 }}));


// La route à utiliser pour accéder à la documentation.
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// Routes en rapport la géstion des utilisateurs.
app.use('/api/utilisateur', routerUtilisateur);

// Millieugiciel vérifiant la clé d'API.
app.use(authentification)

// Routes principales de l'API ici.
app.use('/api/', routerTaches);


// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
