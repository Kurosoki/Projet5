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




    //---------------------Fonction de validation------------------------//

    //Récupération de l'input dans le html
    let prenom = document.getElementById("firstName");
    let nom = document.getElementById("lastName");
    let address = document.getElementById("address");
    let ville = document.getElementById("city");
    let myEmail = document.getElementById("email");
    let btnCommander = document.getElementById("order");


    // ***************** Validation Prénom *****************

    //Ecoute du changement de l'input Prénom 
    // prenom.addEventListener('change', function () {
    //     validePrenom(this)
    // });

    // const validePrenom = function (prenom) {

    // }






    // ***************** Validation Email *****************

    //Ecoute du changement de l'input email
    myEmail.addEventListener('change', function () {
        valideEmail(this)
    });

    //Création de la regex pour validation de l'email
    const valideEmail = function (adressEmail) {

        let emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
        let testEmail = emailRegex.test(adressEmail.value);
        console.log(adressEmail);

        ///Récupération de la balise P
        let message = adressEmail.nextElementSibling;

        //Message de validation ou d'erreur lors de la saisie de l'email
        if (testEmail) {
            message.innerHTML = 'Email Valide';
            return true;
        } else {
            message.innerHTML = 'Email Invalide';
            return false;
        }  //console.log(testEmail);

    };

    // ***************** Soumission du Formulaire *****************

    //Ecoute de la soumission du form
    btnCommander.addEventListener('submit', function (e) {
        e.preventDefault();
        if (valideEmail(adressEmail)) {
            console.log('email valideS');

        }
        else {
            console.log('email non valideS');
        }


    });
});