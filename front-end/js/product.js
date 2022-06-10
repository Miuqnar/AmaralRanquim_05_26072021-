// // Envoie d'une requête du type get avec fetch , (recupererProduit) // page deux /produit
const params     = new URLSearchParams(window.location.search);
const id_product = params.get("id_product");
let productTo;


product()
async function product() {
   
    const url = `http://localhost:3000/api/cameras/${id_product}`;

    const response = await fetch(url)
    const article = await response.json()
    productTo = article; 
    let allLenses = document.querySelector(".description_selectOptions");
    let lenses = article.lenses;

    for(let i = 0; i < lenses.length; i++){
       let option = document.createElement("option"); 
       option.innerHTML = lenses[i];
       allLenses.appendChild(option);
    }

    let getItemImg = document.querySelector(".getItem_image");
    getItemImg.src = article.imageUrl;

    let getNameProduct = document.querySelector(".nameProduct");
    getNameProduct.innerHTML = article.name;

    let getPriceProduct = document.querySelector(".priceProduct");
    getPriceProduct.innerHTML = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(article.price / 100); 
}

// ajouter le produit au panier 
addProductToCart()
function addProductToCart(){

    let cart                = [];
    let addToCart           = document.querySelector("#addToCart");
    let recoverLocalStorage = localStorage.getItem("addCart");
    let displayQuatity      = document.querySelector("#quantity");
    let openAndCloseModal   = document.querySelector(".popAddProductContainer_popAddProduct");
    

    if(recoverLocalStorage != null){
        cart = JSON.parse(recoverLocalStorage)
    }

    // creer un nouveau produit et ajouter au local storage
    addToCart.addEventListener("click", () => {
        // cartNumbers()
        let choiceQuantity = displayQuatity.value;

        cart.push({
            id: productTo._id,
            nom: productTo.name,
            prix: productTo.price * choiceQuantity,
            option: document.querySelector(".description_selectOptions").value,
            quantite: parseInt(choiceQuantity)
        });
        console.log(typeof parseInt(cart));
    

        // ajouter au localStorage
        localStorage.setItem("addCart", JSON.stringify(cart));


        // notification du produit ajouté
        openAndCloseModal.textContent = "Produit ajouté au panier";
        openAndCloseModal.classList.add('show');
        setTimeout(() => {
            openAndCloseModal.classList.remove('show');
        }, 2000)
    })
 
}

// function onLoadCart(){
//     let loadCartNumbers = localStorage.getItem("cartNumbers");
//     if(loadCartNumbers){
//         shopIcon.textContent = loadCartNumbers;
//     }
// }
// function cartNumbers(){
//     let addCartNumbers = localStorage.getItem("cartNumbers");
//     addCartNumbers = parseInt(addCartNumbers)
//     shopIcon.textContent = addCartNumbers + 1;
//     if(addCartNumbers){
//         localStorage.setItem("cartNumbers", addCartNumbers + 1)
//     }else{
//         localStorage.setItem("cartNumbers", 1)
//         shopIcon.textContent = 1;
//     }
// }
// onLoadCart()