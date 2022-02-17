document.addEventListener("DOMContentLoaded", function (event) {

    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {

        let products = await GetProducts();

        for (let product of products) {
            AfficheAccueil(product)
        }

    }

    main();

    //-------------------fonction recup produit api-------------------//
    //--------------------------------------------------------//
    async function GetProducts() {

        return fetch("http://localhost:3000/api/products")
            .then(function (response) {
                return response.json();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    //-------------------fonction affiche nos produits-------------------//
    //--------------------------------------------------------//
    function AfficheAccueil(product) {

        let Domitems = document.getElementById("items");

        Domitems.insertAdjacentHTML(
            "beforeend",
            `
            <a href="./product.html?id=${product._id}">
                <article>
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                    <h3 class="productName">${product.name}</h3>
                    <p class="productDescription">${product.description}</p>
                </article>
            </a>
            `
        );


    }


});