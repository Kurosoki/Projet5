document.addEventListener("DOMContentLoaded", function (event) {

    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {


        let ApiArray = [];

        let localStorageArray = getLocalStorageProduct();

        // on a tous nos produit du localstorage 
        // on fait appel à notre fonction qui va chercher dans notre api 1 information
        // cette info c'est id de notre produit qui se trouve dans localstoragearray 
        for (let i = 0; i < localStorageArray.length; i++) {
            ApiArray.push(await GetApi(localStorageArray[i]));
        }

        let AllProducts = ConcatArray(localStorageArray, ApiArray);

        DisplayProduct(AllProducts);

        DisplayTotalPrice(AllProducts);

        Listen(AllProducts);

        Validation();
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
    function ecoutequantity(AllProducts) {
        // On stock notre <input>.
        let qtyInput = document.querySelectorAll(".itemQuantity");
        // ForEach sur notre Input.
        qtyInput.forEach(function (input) {
            // On écoute notre input.
            input.addEventListener("change", function (inputevent) {
                // On Stock notre nouvel valeur.
                let inputQty = inputevent.target.value;


                const Name = input
                    .closest("div.cart__item__content")
                    .querySelector("div.cart__item__content__description > h2").innerText;

                const Color = input
                    .closest("div.cart__item__content")
                    .querySelector("div.cart__item__content__description > p").innerText;

                let productName = Name + " " + Color;

                let localstorageKey = JSON.parse(localStorage.getItem(productName));
                localstorageKey.qty = inputQty;
                localStorage.setItem(productName, JSON.stringify(localstorageKey));

                const result = AllProducts.find(x => x.name === localstorageKey.name && x.colors === localstorageKey.color);

                result.qty = inputQty;

                DisplayTotalPrice(AllProducts);

            });
        });
    }

    function ecoutedeleteProduct(AllProducts) {

        let qtyinput = document.querySelectorAll(".deleteItem");

        qtyinput.forEach(function (input) {
            input.addEventListener("click", function (inputevent) {

                const Name = input
                    .closest("div.cart__item__content")
                    .querySelector("div.cart__item__content__description > h2").innerText;

                const Color = input
                    .closest("div.cart__item__content")
                    .querySelector("div.cart__item__content__description > p").innerText;

                productName = Name + " " + Color;

                let localstorageKey = JSON.parse(localStorage.getItem(productName));

                localStorage.removeItem(productName);

                input.closest("div.cart__item__content").parentNode.remove();

                const result = AllProducts.find(AllProduct => AllProduct.name === localstorageKey.name && AllProduct.colors === localstorageKey.color);

                AllProducts = AllProducts.filter(product => product !== result);

                ecoutequantity(AllProducts);

                DisplayTotalPrice(AllProducts);
            })
        })
    }


    //---------------------Validation formulaire REGEX------------------------//
    //------------------------------------------------------------------//

    function ValidationRegex(form) {

        // Initialisation de nos variables de test.
        const stringRegex = /^[a-zA-Z-\s]+$/;
        const emailRegex = /^\w+([.-]?\w+)@\w+([.-]?\w+).(.\w{2,3})+$/;
        const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/;

        let control = true;

        if (form.firstName.value.match(stringRegex)) {
            document.getElementById("firstNameErrorMsg").innerText = " ";
        } else {
            document.getElementById("firstNameErrorMsg").innerText = "Prénom Invalide";
            control = false;
        }

        if (form.lastName.value.match(stringRegex)) {
            document.getElementById("lastNameErrorMsg").innerText = " ";
        } else {
            document.getElementById("lastNameErrorMsg").innerText = "Nom Invalide";
            control = false;
        }

        if (form.address.value.match(addressRegex)) {
            document.getElementById("addressErrorMsg").innerText = " ";
        } else {
            document.getElementById("addressErrorMsg").innerText = "Address Invalide";
            control = false;
        }

        if (form.city.value.match(stringRegex)) {
            document.getElementById("cityErrorMsg").innerText = " ";
        } else {
            document.getElementById("cityErrorMsg").innerText = "Ville Invalide";
            control = false;
        }

        if (form.email.value.match(emailRegex)) {
            document.getElementById("emailErrorMsg").innerText = " ";
        } else {
            document.getElementById("emailErrorMsg").innerText = "Email Invalide";
            control = false;
        }

        if (control) {
            return true;
        } else {
            return false;
        }
    }


    //---------------------Fonction de validation------------------------//
    function Validation() {

        let btnCommander = document.getElementById("order");

        btnCommander.addEventListener('click', function (event) {

            let form = document.querySelector(".cart__order__form");
            event.preventDefault();

            if (localStorage.length !== 0) {
                console.log('Panier ok');
                if (ValidationRegex(form)) {

                    let formInfo = {
                        firstName: form.firstName.value,
                        lastName: form.lastName.value,
                        address: form.address.value,
                        city: form.city.value,
                        email: form.email.value,
                    };

                    let product = [];

                    for (let i = 0; i < localStorage.length; i++) {
                        product[i] = JSON.parse(localStorage.getItem(localStorage.key(i))).id;
                    }

                    let order = {
                        contact: formInfo,
                        products: product,
                    };

                    const options = {
                        method: "POST",
                        body: JSON.stringify(order),
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                    };

                    fetch("http://localhost:3000/api/products/order/", options)
                        .then((response) => response.json())
                        .then(function (data) {
                            window.location.href = "confirmation.html?id=" + data.orderId;
                        })
                        .catch(function (error) {
                            alert("Error fetch order" + error.message);
                        })
                } else {
                    event.preventDefault();
                    console.log("Le formulaire est mal remplis.");
                }
            } else {
                event.preventDefault();
                console.log("Votre panier est vide.");
            }



        });
    }

});