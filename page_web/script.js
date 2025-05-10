const urlApi = "http://127.0.0.1:3030";

let formCompte = document.getElementById("form-compte");

let prenomInput = document.getElementById("prenom");
let nomInput = document.getElementById("nom");
let courrielInput = document.getElementById("courriel");
let mdpInput = document.getElementById("mdp");

let formCle = document.getElementById("form-cle");

let courrielCleInput = document.getElementById("courriel-cle");
let mdpCleInput = document.getElementById("mdp-cle");
let nouvelleCleInput = document.getElementById("nouvelle-cle");


formCompte.addEventListener("submit", (e) => {
    e.preventDefault();
    fetch(urlApi + "/api/utilisateur/inscription", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            "prenom": prenomInput.value,
            "nom": nomInput.value,
            "courriel": courrielInput.value,
            "password": mdpInput.value
        })
    })
    .then(reponse => {
        reponse.json()
        .then(json =>{
            if(reponse.ok){
                alert("Succes : \n" + JSON.stringify(json, null, ' '));
            }
            else {
                alert("Erreur : \n" + JSON.stringify(json, null, ' '));
            }
        })
        .catch(erreur =>{
            console.log(erreur);
        });
    })
    .catch(error => console.error(error));
});

formCle.addEventListener("submit", (e) => {
    e.preventDefault();
    fetch(urlApi + `/api/utilisateur/cle`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            "courriel": courrielCleInput.value,
            "password": mdpCleInput.value,
            "regenerer": nouvelleCleInput.checked
        })
    })
    .then(reponse => {
        reponse.json()
        .then(json =>{
            if(reponse.ok){
                alert("Succes : \n" + JSON.stringify(json, null, ' '));
            }
            else {
                alert("Erreur : \n" + JSON.stringify(json, null, ' '));
            }
        })
        .catch(erreur =>{
            console.log(erreur);
        });
    })
    .catch(error => console.error(error));
});

/*

let listeTaches = document.getElementById("liste-principal");

function obtenirCleApi(){
    return document.getElementById("input-cle-api").value;
}
    
function obtenirToutAfficherTaches(){
    return document.getElementById("input-tout-afficher").checked;
}
async function modifierStatutTache(id, statut){
    fetch(urlApi + "/api/tache/statut", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "cle_api " + obtenirCleApi()
        },
        body: `{
            "id": ${id},
            "complete": ${statut}
        }`
    })
    .then(reponse => reponse.json())
    .then(data => {
        listerTaches();
    })
    .catch(error => console.error(error));
}

async function modifierStatutSousTache(id, statut){
    fetch(urlApi + "/api/sous-tache/statut", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "cle_api " + obtenirCleApi()
        },
        body: `{
            "id": ${id},
            "complete": ${statut}
        }`
    })
    .then(reponse => reponse.json())
    .then(data => {
        listerTaches();
    })
    .catch(error => console.error(error));
}

async function listerTaches(){
    fetch(urlApi + `/api/liste${obtenirToutAfficherTaches() ? "?toutes=true" : ""}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "cle_api " + obtenirCleApi()
        }
    })
    .then(response => response.json())
    .then(data => {
        listeTaches.innerHTML = "";

        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            
            let tacheHTML = `
                <div>${element.titre}
                    <button class="bouton-statut-tache" onclick="modifierStatutTache(${element.id}, ${!element.complete})">
                        ${element.complete ? "✅" : "❌"}
                    </button>
                </div>
                <div>${element.description}</div>
                <div>${element.date_debut}</div>
                <div>${element.date_echeance}</div>
                <ul>
            `;
            for (let j = 0; j < data[i].sous_taches.length; j++){
                const element2 = data[i].sous_taches[j];
                tacheHTML += `
                    <li class="sous-tache">
                        <div>${element2.titre}
                            <button class="bouton-statut-sous-tache" onclick="modifierStatutSousTache(${element2.id}, ${!element2.complete})">
                                ${element2.complete ? "✅" : "❌"}
                            </button>
                        </div>
                    </li>
                `;
            }
            tacheHTML += `</ul>`;
            
            let tache = document.createElement("li");
            tache.innerHTML = tacheHTML;
            tache.className = "tache";
            listeTaches.appendChild(tache);
        }
    })
    .catch(error => console.error(error));
}
*/
