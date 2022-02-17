document.addEventListener("DOMContentLoaded", function (event) {

    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {

        const url = new URL(window.location.href);

        let productId = url.searchParams.get("id");

        let product = await GetProduct(productId);

        DisplayProduct(product);

    }

    main();

    function GetProduct(productId) {
        return fetch("http://localhost:3000/api/products/" + productId)
            .then(function (response) {
                return response.json();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function DisplayProduct(product) {
        console.log(product)
        const title = document.getElementsByTagName("title")[0];
        const parentImg = document.getElementsByClassName("item__img");
        const parentName = document.getElementById("title");
        const parentPrice = document.getElementById("price");
        const parentDescription = document.getElementById("description");
        const parentQuantity = document.getElementById("quantity");

        title.innerHTML = product.name;
        parentName.innerText = product.name;
        parentPrice.innerText = product.price;

    }

});