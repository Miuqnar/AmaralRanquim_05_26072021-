
// Variable global pour l'ajoutPanier
let produit;
let panier = [];

let panierStoreRecupere = localStorage.getItem('panierStore');
if(panierStoreRecupere != null){
    panier = JSON.parse(panierStoreRecupere);
}

// Envoie d'une requête du type get avec fetch , (recupererProduits)///page d'acceuil // vers la page produit detaille 
function recupererProduits() {
    let boxProduits = $('#all_photos');
    fetch("http://localhost:3000/api/cameras")

    // Rcuperation de la requête (recuperer une promise en formatn JSON)
     .then(function(response){
         return response.json();
     })
     // Recuperer une prommesse data
     .then(function(data){
         console.log(data);
         for(let i = 0; i < data.length; i++){
             boxProduits.append(`
                 <div class="col-md text-center">
                     <div class="card border-0 ">
                         <img src="${data[i].imageUrl}" alt="camera photo" height=200>
                         <div class="card-body ">
                             <div class="d-flex align-items-center justify-content-between textPrix">
                                 <span>${data[i].name}</span>
                                 <span>${data[i].price/100}<strong class="px-1">€</strong></span>
                             </div>
                             <button type="button" class="btn btn-outline-none">
                                 <a class="btn btn-outline-warning border-0" href="produit.html?id=${data[i]._id}"><i class="fas fa-arrow-right"></i>En savoir plus<i class="fas fa-arrow-left"></i></a>
                             </button>
                         </div>
                     </div>
                 </div>
             `)
         }
     })
     .catch(function(err){
         console.log(err)
     });
 }
 // redirection
 function set_product_id(id) {
     localStorage.setItem("product_id",id);
     window.location = "produit.html";
 }

// Envoie d'une requête du type get avec fetch , (recupererProduit) // page deux /produit
function recupererProduit() {
    let params = new URLSearchParams(window.location.search);
    let product_id = params.get("id");

    if (product_id) {
        // console.log(' ')
    } else {
        window.location.replace("index.html");
    }
    let boxProduit = $('#product_detail');

    fetch("http://localhost:3000/api/cameras/" + product_id)
        .then(function (response) {
            return response.json();
        })
        // Recuperer une prommesse data
        .then(function (data) {
            // recupere les données data avec la variable(global) produit 
            produit = data;
            let lenses = ''
            for (let i = 0; i < data.lenses.length; i++) {
                lenses = lenses + ` <option value="${data.lenses[i]}">${data.lenses[i]}</option> `
            }
            let info = `
                <div class="row row-cols-sm">
                    <div class="col">
                        <img class="img-produit" src="${data.imageUrl}" alt="camera photo" id="photo">
                    </div>
                    <aside class="col-md-5 p-3">
                        <div class="card">
                            <div class="card-body">
                                <h2 class="text-center">${data.name}</h2>
                                <p>${data.description}</p>
                                <select id="options" class="form-select">
                                    <option value="Lentilles">Lentilles</option>
                                    ${lenses}
                                    <option value=""></option>
                                </select>
                                <span class="pt-4">${data.price/100}</span><strong class="px-1">€</strong></span>
                                <div class="text-center" id="clickPanier">
                                    <button type="button" class="btn btn-warning border-0 btn-lg"  onclick="ajoutPanier()"><span ><i class="fas fa-arrow-right"></i>Ajouter au panier<i class="fas fa-arrow-left"></i></span></button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>`; 

            boxProduit.append(info);

        })
        .catch(function (err) {
            console.log(err)
        });    
}
// ajout au panier(localstorage) en utilisant la variable global panier(tableaux)
function ajoutPanier() {
    panier.push({
        id: produit._id,
        nom: produit.name,
        prix:produit.price,
        option: document.getElementById('options').value,
    });
    // convertion d'un object en chaîne de caractère 
    localStorage.setItem("panierStore", JSON.stringify(panier));
    alert('produit ajouté');
}

// affichage des produits au panier //page trois
function affichePanier(){
    // declaration de la variable pour le calcul du prix total
    let calcule = 0;
    //parcourir le tableaux pour l'affichage des produits
    for(let a = 0; a < panier.length; a++){
        //calcule du prixt total des produits
        calcule = calcule + panier[a].prix;
        //affichage du panier 
        document.getElementById('containerPanier').insertAdjacentHTML("beforeend", `
            <div class="row">
                <div class="col-5 text-start" id="product_id_name">
                    <p>${panier[a].nom}</p>
                </div>
                <div class="col-3 text-end" id="product_id_lentille">
                    <p>${panier[a].option}</p>
                </div>
                <div class="col-3 text-end" id="product_id_prix">
                    <p>${panier[a].prix / 100}€</p>
                </div>
                <div class="col-1">
                    <span type="button" onclick="removeArticle(${a})" class="supp-btn"><i class="fas fa-trash-alt"></i></span>
                <div>
            </div>
        `);
    }
    // Affichage du prix total des produits 
    document.getElementById('containerPanier').insertAdjacentHTML("beforeend", `
        <div class="row pt-3 border-top">
            <div class="col-8 text-start" id="product_id_name">
                <p>Montant total</p>
            </div>
            <div class="col-4 text-end" id="product_id_total">
                <p>${calcule / 100} €</p>
            </div>
        </div>
    `);
    //Ajouter la valeur total dans localSotrage
    localStorage.setItem("calcule", `${calcule /100} €`);
}

// remover chaque porduit du panier 
function removeArticle(index){
    //supprimer le produit
    panier.splice(index, 1);
    localStorage.setItem("panierStore", JSON.stringify(panier));
    //actualiser la page une fois la suppression d'un produits
    window.location.reload();
}

//fonction pour afficher le message d'erreur
function printError(elemId, indexMsg) {
    document.getElementById(elemId).innerHTML = indexMsg;
}

// envoie des données au serveur 
function formButton(){
    // contruction d'un object contact avant d'un envoyer les infs au serveur  
    let contact = {
        firstName: document.getElementById('nom').value,
        lastName : document.getElementById('prenom').value,
        address: document.getElementById('adresse').value,
        city: document.getElementById('ville').value,
        email: document.getElementById('email').value,
        codePostal: document.getElementById('codePostal').value
    };
    // declaration d'un variable products (tableau ) et parcourir les elements du tableau 
    let products = [];

    for(let c = 0; c < panier.length; c++){
        products.push(panier[c].id);
    }
    // declarion de la variable erreur
    let formErr = false;
    
    // Validation du nom 
    if(contact.firstName == "") {
        printError("nomErr", "Veuillez entrer votre nom");
        formErr = true;
    } else {
        let nomRegex = new RegExp('^[a-zA-Z\s]+$', 'g')               
        if(nomRegex.test(contact.firstName) === false) {
            printError("nomErr", "Veuillez entrer un nom valide");
            formErr = true;
        } else {
            printError("nomErr", "");
        }
    }
    // Validation du prenom 
    if(contact.lastName == "") {
        printError("prenomErr", "Veuillez entrer votre prenom");
        formErr = true;
    } else {
        let prenomRegex = new RegExp('^[a-zA-Z\s]+$', 'g');             
        if(prenomRegex.test(contact.lastName) === false) {
            printError("prenomErr", "Veuillez entrer un prenom valide");
            formErr = true;
        } else {
            printError("prenomErr", "");
        }
    }

    // Validation adresse 
    if(contact.address == "") {
        printError("adresseErr", "Veuillez entrer votre adresse");
        formErr = true;
    } else {
        // Expression régulière pour la validation de la 
        let adresseRegex = new RegExp('^[a-zA-Z0-9-]+$', 'g');             
        if(adresseRegex.test(contact.address) === false) {
            printError("adresseErr", "Veuillez entrer une adresse valide");
            formErr = true;
        } else {
            printError("adresseErr", "");
        }
    }

    // Validation ville
    if(contact.city == "") {
        printError("villeErr", "Veuillez entrer le nom de votre ville");
        formErr = true;
    } else {
        // Expression régulière pour la validation de la ville
        let villeRegex = new RegExp('^[a-zA-Z-]+$', 'g');             
        if(villeRegex.test(contact.city) === false) {
            printError("villeErr", "Veuillez entrer une ville valide");
            formErr = true;
        } else {
            printError("villeErr", "");
        }
    }

    // Validation email
    if(contact.email == "") {
        printError("emailErr", "Veuillez entrer votre email");
        formErr = true;
    } else {
        // Expression régulière pour la validation des e-mails
        let emailRegex = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g');
        if(emailRegex.test(contact.email) === false) {
            printError("emailErr", "Veuillez entrer un email valide");
            formErr = true;
        } else{
            printError("emailErr", "");
        }
    }

    // Validation du code postal  
    if(contact.codePostal == "") {
        printError("codePostalErr", "Veuillez entrer votre code postal");
        formErr = true;
    } else {
        // Expression régulière pour la validation des code postal
        let codePostalRegex = new RegExp('^[0-9]{5}$', 'g');             
        if(codePostalRegex.test(contact.codePostal) === false) {
            printError("codePostalErr", "Veuillez entrer un code postal valide");
            formErr = true;
        } else {
            printError("codePostalErr", "");
        }
    }

    if(formErr){
        return false;
    }
    // envoie d'un requete poste 
    fetch("http://localhost:3000/api/cameras/order", {
        method: 'POST',
        body: JSON.stringify({
            contact,
            products
        }),
        headers: {
            'content-type': 'application/json',
        }
    })
    // recupere une reponse 
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        localStorage.setItem("orderId", data.orderId);
        // effacer les produits dans le panier une fois validé et avoir le message de confirmation vers la page quatre
        if(data.orderId){
            localStorage.removeItem('panierStore');
            window.location.href = "confirmation.html?orderID=" + data.orderId;
        }
    })
}

function confirmComande(){
    let prixTatal = document.querySelector(".totalPrrice");
    let codeCommend = document.querySelector(".codeCommend");

    //recupere la valeur total dans localSotrage
    prixTatal.innerHTML = localStorage.getItem('calcule');
    codeCommend.innerHTML = localStorage.getItem('orderId');

    //effacer les valeur dans localStorage une fois la confirmation
    localStorage.clear();
}    
