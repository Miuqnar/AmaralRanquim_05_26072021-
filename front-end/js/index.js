// Envoie d'une requête du type get avec fetch , (recupererProduits)///page d'acceuil //

function produits() {
    fetch('http://localhost:3000/api/cameras')
    .then(res => res.json())
    
    .then(articles => {
        for(let i = 0; i < articles.length; i++){
            let containerCard = document.createElement('div');
            document.querySelector('.all_products').appendChild(containerCard)
            containerCard.classList.add('cardBody')

            let cardBody_image = document.createElement('div');
            containerCard.appendChild(cardBody_image);
            cardBody_image.classList.add('cardBody_image')
            
            let pct_image = document.createElement('img');
            pct_image.classList.add('imge');
            pct_image.src = articles[i].imageUrl;
            cardBody_image.appendChild(pct_image);

            let pct_infos = document.createElement('div')
            containerCard.appendChild(pct_infos);
            pct_infos.classList.add('cardBody_pct_infos')

            let pct_name = document.createElement('span');
            pct_name.innerHTML = articles[i].name;
            pct_infos.appendChild(pct_name);

            let pct_price = document.createElement('span');
            pct_price.innerHTML = new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
                }).format(articles[i].price / 100);
            pct_infos.appendChild(pct_price);

            let buttonContainer = document.createElement('div');
            containerCard.appendChild(buttonContainer);
            buttonContainer.classList.add('cardBody_buttonContainer')

            let buttonItem = document.createElement('button');
            buttonContainer.appendChild(buttonItem);
            buttonItem.classList.add('cardBody_buttonContainer-buttonItem')

            let buttonLink = document.createElement('a');
            buttonLink.href = `product.html?id_product=${articles[i]._id}`;
            buttonLink.textContent = 'Savoir plus';
            buttonItem.appendChild(buttonLink);
            buttonLink.classList.add('cardBody_buttonContainer-buttonItem_buttonLink');
                
        }
    })
    .catch(err => console.log(err));
}
produits();
