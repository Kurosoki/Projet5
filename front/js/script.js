
document.addEventListener("DOMContentLoaded", function (event) {


    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {
        // On Appel notre fonction qui va nous retourné nos produits de l'API
        let products = await GetProducts();
        for (let article of products) {
            // Affichage des articles dans products
            displayProducts(article);
        }
    }

    main();

    //-------------------Fonction d'intérrogation de notre api avec product-------------------//
    //-----------------------------------------------------------------------------------------//
    async function GetProducts() {
        return fetch("http://localhost:3000/api/products")
            .then(function (response) {
                return response.json();
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    //-------------------Fonction d'affichage du produit-------------------//
    //---------------------------------------------------------------------//
    function displayProducts(products) {

        // Récupération du parent.
        const Dom = document.getElementById("items");

        // On insert dans le html.
        Dom.insertAdjacentHTML(
            "beforeend",
            `<a href="./product.html?id=${products._id}">
            <article>
                <img src="${products.imageUrl}" alt="${products.altTxt}">
                <h3 class="productName">${products.name}</h3>
                <p class="productDescription">${products.description}</p>
                </article>
        </a>`
        );
    }

});
