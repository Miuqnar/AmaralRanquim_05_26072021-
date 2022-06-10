// recupere la copie de produit
let cart = JSON.parse(localStorage.getItem('addCart'));

// affichage des produits au panier 
showProduct()
function showProduct() {
    let totalPrice  = document.querySelector('.prixTotal');
    // console.log(cart)
    
    let calcule = 0;

    for (let product in cart) {
        //calcule du prixt total des produits
        calcule = calcule + cart[product].prix;

        let cartName = document.createElement('p');
        document.querySelector('.cartName').appendChild(cartName);
        cartName.textContent = cart[product].nom;
        
        let cartLenses = document.createElement('p');
        document.querySelector('.cartLenses').appendChild(cartLenses);
        cartLenses.textContent   = cart[product].option;

        let cartQuantity = document.createElement('p');
        document.querySelector('.cartQuantity').appendChild(cartQuantity);
        cartQuantity.textContent   = cart[product].quantite;

        let cartPrice = document.createElement('p');
        document.querySelector('.cartPrice').appendChild(cartPrice);
        cartPrice.textContent   = new Intl.NumberFormat('fr-FR', {
            style: "currency",
            currency: "EUR"
        }).format(cart[product].prix / 100);

        let deleteArticle = document.createElement('p');
        document.querySelector('.deleteArticle').appendChild(deleteArticle);
        deleteArticle.innerHTML = `<i class="fas fa-trash-alt"></i>`;
        deleteArticle.classList.add('paragraphIcon');
        
        // remover chaque porduit du panier 
        deleteArticle.addEventListener("click", (index) => {
            cart.splice(index, 1);
            localStorage.setItem("addCart", JSON.stringify(cart));
            window.location.reload();
            
        })
    }
    
    localStorage.setItem("calcule", calcule)
    totalPrice.textContent = new Intl.NumberFormat('fr-FR', {
        style: "currency",
        currency: "EUR"
    }).format(calcule / 100);
    
}


//fonction pour afficher le message d'erreur
function printError(elemId, indexMsg) {
    document.getElementById(elemId).innerHTML = indexMsg;
}

let valid = document.querySelector("#valid");
valid.addEventListener("click", sendInfos);

// envoie des données au serveur 
function sendInfos() {

    // contruction d'un object contact avant d'un envoyer les infos au serveur  
    let contact = {
        firstName: document.getElementById('nom').value,
        lastName: document.getElementById('prenom').value,
        address: document.getElementById('adresse').value,
        city: document.getElementById('ville').value,
        email: document.getElementById('email').value,
        codePostal: document.getElementById('codePostal').value
    };

    let products = [];

    for (let c = 0; c < products.length; c++) {
        products.push(cart[c].id);
    }

    // declarion de la variable erreur
    let formErr = false;

    // Validation du nom 
    if (contact.firstName == "") {
        printError("nomErr", "Veuillez entrer votre nom");
        formErr = true;
    } else {
        let nomRegex = new RegExp('^[a-zA-Z\s]+$', 'g')
        if (nomRegex.test(contact.firstName) === false) {
            printError("nomErr", "Veuillez entrer un nom valide");
            formErr = true;
        } else {
            printError("nomErr", "");
        }
    }
    // Validation du prenom 
    if (contact.lastName == "") {
        printError("prenomErr", "Veuillez entrer votre prenom");
        formErr = true;
    } else {
        let prenomRegex = new RegExp('^[a-zA-Z\s]+$', 'g');
        if (prenomRegex.test(contact.lastName) === false) {
            printError("prenomErr", "Veuillez entrer un prenom valide");
            formErr = true;
        } else {
            printError("prenomErr", "");
        }
    }

    // Validation adresse 
    if (contact.address == "") {
        printError("adresseErr", "Veuillez entrer votre adresse");
        formErr = true;
    } else {
        // Expression régulière pour la validation de la 
        let adresseRegex = new RegExp('^[a-zA-Z 0-9]+$', 'g');
        if (adresseRegex.test(contact.address) === false) {
            printError("adresseErr", "Veuillez entrer une adresse valide");
            formErr = true;
        } else {
            printError("adresseErr", "");
        }
    }

    // Validation ville
    if (contact.city == "") {
        printError("villeErr", "Veuillez entrer le nom de votre ville");
        formErr = true;
    } else {
        // Expression régulière pour la validation de la ville
        let villeRegex = new RegExp('^[a-zA-Z-]+$', 'g');
        if (villeRegex.test(contact.city) === false) {
            printError("villeErr", "Veuillez entrer une ville valide");
            formErr = true;
        } else {
            printError("villeErr", "");
        }
    }

    // Validation email
    if (contact.email == "") {
        printError("emailErr", "Veuillez entrer votre email");
        formErr = true;
    } else {
        // Expression régulière pour la validation des e-mails
        let emailRegex = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g');
        if (emailRegex.test(contact.email) === false) {
            printError("emailErr", "Veuillez entrer un email valide");
            formErr = true;
        } else {
            printError("emailErr", "");
        }
    }

    // Validation du code postal  
    if (contact.codePostal == "") {
        printError("codePostalErr", "Veuillez entrer votre code postal");
        formErr = true;
    } else {
        // Expression régulière pour la validation des code postal
        let codePostalRegex = new RegExp('^[0-9]{5}$', 'g');
        if (codePostalRegex.test(contact.codePostal) === false) {
            printError("codePostalErr", "Veuillez entrer un code postal valide");
            formErr = true;
        } else {
            printError("codePostalErr", "");
        }
    }
    if (formErr) {
        return false;
    }
    //Vérification du panier s'il contien au moins une article// sinon il empeche la redirection 
    let verifyCart = localStorage.getItem("addCart");
    let openAndCloseModal   = document.querySelector(".popAddProductContainer_popAddProduct");
    if (verifyCart == null) {
        // alert("veuillez ajouter une article dans votre panier");
        openAndCloseModal.textContent = "veuillez ajouter une article dans votre panier";
        openAndCloseModal.classList.add('show');
        setTimeout(() => {
            openAndCloseModal.classList.remove('show');
        }, 5000)
        return false
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
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            localStorage.setItem("orderId", data.orderId);
            // effacer les produits dans le panier une fois validé et avoir le message de confirmation vers la page quatre
            if (data.orderId) {
                localStorage.removeItem('addCart');
                window.location.href = "confirm.html?orderID=" + data.orderId;
            }
        })
}
