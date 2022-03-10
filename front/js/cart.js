document.addEventListener("DOMContentLoaded", function (event) {

    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {


        let ApiArray = [];

        let localStorageArray = getLocalStorageProduct();

        for (let i = 0; i < localStorageArray.length; i++) {
            ApiArray.push(await GetApi(localStorageArray[i]));
        }

        let AllProducts = ConcatArray(localStorageArray, ApiArray);

        DisplayProduct(AllProducts);

        DisplayTotalPrice(AllProducts);

        Listen(AllProducts);
    }

    main();

    //----------Parcourez chaque élément du stockage local et affichez les noms(index) ----------//
    //--------------------------------------------------------//

    function getLocalStorageProduct() {

        let getLocalStorageArray = [];

        for (let i = 0; i < localStorage.length; i++) {
            getLocalStorageArray[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));
        }

        return getLocalStorageArray;
    }

    function GetApi(localStorageArray) {

        return fetch("http://localhost:3000/api/products/" + localStorageArray.id)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }

            })
            .catch(function (error) {
                console.log(error);
            })
    }

    //-------------------Rassembler dans la variable tous les élements de nos produits-------------------//
    //---------------Ce qui vient du localstorage + APi-----------------------------------------//
    function ConcatArray(localStorageArray, ApiArray) {

        let AllProducts = [];

        for (let i = 0; i < localStorageArray.length; i++) {

            let ObjectProduct = {
                altTxt: ApiArray[i].altTxt,
                colors: localStorageArray[i].color,
                description: ApiArray[i].description,
                imageUrl: ApiArray[i].imageUrl,
                name: ApiArray[i].name,
                price: ApiArray[i].price,
                _id: localStorageArray[i].id,
                qty: localStorageArray[i].qty
            }

            AllProducts.push(ObjectProduct);
        }

        return AllProducts;
    }

    //-----Affiche les éléments d'un produit------------------//
    //--------------------------------------------------------//

    function DisplayProduct(AllProducts) {

        for (product of AllProducts) {

            const domCreation = document.getElementById("cart__items");

            domCreation.insertAdjacentHTML(
                "beforeend",
                `
                <article class="cart__item" data-id="${product._id}" data-color="${product.colors}">
                <div class="cart__item__img">
                  <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${product.colors}</p>
                    <p>${product.price}</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.qty}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>
                `
            );
        }
    }

    function DisplayTotalPrice(AllProducts) {

        let totalPrice = 0;
        let totalQty = 0;

        for (product of AllProducts) {
            totalPrice += parseInt(product.qty * product.price);
            totalQty += parseInt(product.qty);
        }

        const DtotalQty = document.getElementById("totalQuantity");
        const DtotalPrice = document.getElementById("totalPrice");

        DtotalPrice.innerText = totalPrice;
        DtotalQty.innerText = totalQty;
    }

    function Listen(AllProducts) {
        // Fonction si changement dans notre input quantity.
        ecoutequantity(AllProducts);
        // Fonction si on veux supprimer un éléments de la liste.
        ecoutedeleteProduct(AllProducts);
    }
    function ecoutequantity() {
        // On stock notre <input>.
        let qtyInput = document.querySelectorAll(".itemQuantity");
        // ForEach sur notre Input.
        qtyInput.forEach(function (input) {
            // On écoute notre input.
            input.addEventListener("input", function (inputevent) {
                // On Stock notre nouvel valeur.
                let inputQty = inputevent.target.value;
            });
        });
    }

    function ecoutedeleteProduct(AllProducts) {

        let qtyinput = document.querySelectorAll(".deleteItem");

        qtyinput.forEach(function (input) {
            input.addEventListener("click", function (inputevent) {
                console.log(inputevent)

                const productName = input.closest("div.cart__item__content")


                //productName = product.name + " " + colorChoosen,  

            })
        })




    }
});