//variables



const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDom = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

//cart

let cart = [];


let buttonDOM = [];


class Products {
    async getProducts() {
        try {
            let result = await fetch("product.json");
            let data = await result.json();
            let products = data.items;
            products = products.map(item => {
                const { title, price } = item.fields;
                const id = item.sys.id;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image }
            }
            )
            return products;
        } catch (error) {
            console.log(error)
        }
    }
}
class UI {
    displayproducts(productt) {
        let result = "";
        productt.forEach(product => {
            result += `
            <article class="product">
            <div class="img-container">
                <img src=${product.image} alt="room1" class="product-img">
                    <button class="bag-btn" data-id= ${product.id}>
                        <i class="fas fa-shopping-cart"></i>
            add to bag
        </button>
    </div>
                <h3>${product.title}</h3>
                <h4>$ ${product.price}</h4>
            </article>
            `
        });
        productsDOM.innerHTML = result;
    }
    getbagbtn() {
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonDOM = buttons;
        // console.log(button)
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.innerHTML = "in cart";
                button.disabled = true;
            }
            button.addEventListener("click", event => {
                event.target.innerHTML = "in cart";
                event.target.disabled = true;
                let cartitem = { ...Storage.settingitem(id), amount: 1 };
                cart = [...cart, cartitem];
                Storage.savecart(cartitem);
                this.savecart(cart);
                this.createcartitem(cartitem);
                this.showcart();
                // this.hidecart();
            })
        }
        )
    }
    savecart(cart) {
        let temptotal = 0;
        let tempamount = 0;
        cart.map(item => {
            temptotal += item.price * item.amount;
            tempamount += item.amount;
        })
        cartTotal.innerText = parseFloat(temptotal.toFixed(2));
        cartItems.innerText = tempamount;
        console.log(cartTotal, cartItems)
    }
    createcartitem(item) {
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
        <img src=${item.image} alt="product1">
                    <!-- end of cart item -->
                    <div>
                        <h4>${item.title}</h4>
                        <h5>$ ${item.price}</h5>
                        <span class="remove-item" data-id=${item.id}>remove</span>
                    </div>
                    <div>
                        <i class="fas fa-chevron-up" data-id=${item.id} ></i>
                        <p class="item-amount">${item.amount}</p>
                        <i class="fas fa-chevron-down" data-id=${item.id}></i>
                    </div> `;
        cartContent.appendChild(div);
    }
    showcart(){
        cartOverlay.classList.add('transparentBcg');
        cartDom.classList.add("showCart");
    }
    // setupapp(){
    //     closeCartBtn.addEventListener("click",this.hidecart());
    //     console.log(closeCartBtn);
    // }

    hidecart(){
        cartOverlay.classList.remove('transparentBcg');
        cartDom.classList.remove("showCart");
    }
 
}

class Storage {
    static saveproducts(prod) {
        localStorage.setItem("products", JSON.stringify(prod));
    }
    static settingitem(id) {
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find(product => product.id === id);
        // let products = localStorage.setItem("products",(item => item.id === id))
    }
    static savecart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart
        ))
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();

    const products = new Products();
    // ui.setupapp();

    // get all products
    products.getProducts().then(product => {
        ui.displayproducts(product);
        Storage.saveproducts(product);
    }).then(() => {
        ui.getbagbtn();
    })
        ;
})