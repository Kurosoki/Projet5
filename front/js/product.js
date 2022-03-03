document.addEventListener("DOMContentLoaded", function (event) {

    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {

        const url = new URL(window.location.href);

        let productId = url.searchParams.get("id");

        let product = await GetProduct(productId);

        DisplayProduct(product);

        BtnClick(product);
    }

    main();

    //-------------------fonction recup l'ID du produit api-------------------//
    //--------------------------------------------------------//

    function GetProduct(productId) {
        return fetch("http://localhost:3000/api/products/" + productId)
            .then(function (response) {
                return response.json();
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    //-----fonction affiche un produit et ses détails dans la page produit------//
    //--------------------------------------------------------//
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
        parentDescription.innerText = product.description;
        parentQuantity.innerText = product.quantity;


        // Création de notre balise image avec les attributs.
        const productImg = document.createElement("img");
        productImg.setAttribute("src", product.imageUrl);
        productImg.setAttribute("alt", product.altTxt);
        // Push après notre balise à la fin de la liste.
        parentImg[0].appendChild(productImg);

        //* Création des choix couleur-------------------------------------------------
        let SelecteurCouleur = document.getElementById("colors")
        let options = product.colors
        options.forEach(function (element) {
            SelecteurCouleur.appendChild(new Option(element, element));
        })

    }

    class ProductClass {
        constructor(id, name, color, qty) {
            this.id = id;
            this.name = name;
            this.color = color;
            this.qty = qty;
        }
    }

    function BtnClick(product) {

        let colorChoosen = "";
        let qtyChoosen = "";
        let qty = "";
        let BtnPanier = document.getElementById("addToCart")

        let colorSelection = document.getElementById("colors")
        colorSelection.addEventListener("change", function (e) {
            colorChoosen = e.target.value;
        })

        let qtySelection = document.getElementById("quantity")
        qtySelection.addEventListener("change", function (e) {
            qty = e.target.value;
        })

        BtnPanier.addEventListener("click", function () {

            let ProductLocalStorage = [];
            let oldQty = 0;

            for (let i = 0; i < localStorage.length; i++) {
                ProductLocalStorage[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));

                if (product._id === ProductLocalStorage[i].id && colorChoosen === ProductLocalStorage[i].color) {
                    oldQty = ProductLocalStorage[i].qty;
                }

            }

            qtyChoosen = parseInt(oldQty) + parseInt(qty);

            let productChoosen = new ProductClass(
                product._id,
                product.name,
                colorChoosen,
                qtyChoosen
            );

            if (colorChoosen != "" && qty >= 1 && qty <= 100) {
                localStorage.setItem(
                    product.name + " " + colorChoosen,
                    JSON.stringify(productChoosen)
                );
            } else {
                alert("tu t'est tromper ma caille");
            }
        });
    }

});