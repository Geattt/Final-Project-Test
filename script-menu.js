let modal = document.getElementById('myModal')
let containers = document.getElementById('contain')
let modalc = document.getElementById('myCalorieModal')
let submitBtn = document.getElementById('submit')
let calorieText = document.querySelector('.calorieText')

// Load the flag from the cookie
let calorieInfoProvided = getCookie('calorieInfoProvided');
let calorieValue = getCookie('calorieValue');

// Function to set a cookie
function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
}

// Function to get the value of a cookie by name
function getCookie(name) {
    let nameEQ = name + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}


submitBtn.addEventListener('click',()=>{
    let BMR = 0;
    let gender = document.querySelector('input[name="gender"]:checked').value;
    let age = document.getElementById("age").value;
    let height = document.getElementById("height").value;
    let weight = document.getElementById("weight").value;
    let activity = document.getElementById("activity").value;
    document.getElementById("myCalorieModal").style.display = "none";

    if(gender == 1){
        BMR = 66.5 + (13.75 * weight) + (5.003 * height) - (6.75 * age)
    }
    else{
        BMR = 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age)
    }
    //Calculate the activity
    if(activity == 1){
        BMR *= 1.2
    }
    else if(activity == 2){
        BMR *= 1.375
    }
    else if(activity == 3){
        BMR *= 1.55
    }
    else if(activity == 4){
        BMR *= 1.725
    }
    else{
        BMR *= 1.9
    }
    BMR = BMR.toFixed(0);
    calorieText.innerText = 'Calorie Needed:' + BMR;
    // Set the flag in the cookie to indicate that calorie info has been provided
    setCookie('calorieInfoProvided', true, 365);
    setCookie('calorieValue', BMR, 365);
})
function myCalorie(){
    document.getElementById("myCalorieModal").style.display = "block";
}

calorieText.addEventListener('click',()=>{
    myCalorie();
})

// Check the flag to decide whether to show the calorie modal
if (!calorieInfoProvided) {
    myCalorie();
} else{
    // Display the calorie value from the cookie
    calorieText.innerText = 'Calorie Needed: ' + calorieValue;
}
document.getElementById('myBtn').addEventListener('click', function() {
    modal.style.display = 'block';
    document.body.style.overflowY = 'hidden';
});

document.getElementById('closeModalBtn').addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflowY = 'scroll';
});

window.onclick=function(event){
    if(event.target == modal){
        modal.style.display = 'none';
        document.body.style.overflowY = 'scroll';
    }
}

//Code for cart items

let cart = document.getElementById('cart-items')

let products = null;
// get data from file json
fetch('product.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();
})

//show datas product in list 
function addDataToHTML() {
    // Remove existing menu items from HTML
    let menuContainer = document.querySelector('.listProduct');
    menuContainer.innerHTML = '';

    // Add new product data
    if (products != null) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');

            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <div class="column">
                    <span class="text-container">
                        <span>${product.name}</span>
                    </span>   
                    <span class="description">
                        <span>${product.description1}</span>
                        <span>${product.description2}</span>
                        <span>${product.description3}</span>
                    </span>
                    <button class="addButton" onclick="addCart(${product.id})">Add To Cart</button>
                </div>
                
                <div class="popup" onclick="togglePopup(this)">
                    <span class="calorie">
                        <script src="https://cdn.lordicon.com/lordicon.js"></script>
                        <lord-icon
                            src="https://cdn.lordicon.com/kndkiwmf.json"
                            trigger="hover"
                            colors="primary:#ffffff,secondary:#e88c30"
                            style="width:50px;height:50px">
                        </lord-icon>
                    </span> 
                    <span class="popuptext">${product.calorie}</span>
                </div>
                <span class="price">$${product.price}</span>
            `;
            menuContainer.appendChild(newProduct);
        });
    }
}
//use cookie so the cart doesn't get lost on refresh page
function togglePopup(element) {
    let popup = element.querySelector('.popuptext');
    popup.classList.toggle('show');
}

let listCart = [];
function checkCart(){
    var cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('listCart='));
    if(cookieValue){
        listCart = JSON.parse(cookieValue.split('=')[1]);
    }else{
        listCart = [];
    }
}
checkCart();
function addCart($idProduct){
    let productsCopy = JSON.parse(JSON.stringify(products));
    //// If this product is not in the cart
    if(!listCart[$idProduct]) 
    {
        listCart[$idProduct] = productsCopy.filter(product => product.id == $idProduct)[0];
        listCart[$idProduct].quantity = 1;
    }else{
        //If this product is already in the cart.
        //I just increased the quantity
        listCart[$idProduct].quantity++;
    }
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";

    addCartToHTML();
}
addCartToHTML();
function addCartToHTML() {
    // clear data default
    let listCartHTML = document.querySelector('.cart-items');
    listCartHTML.innerHTML = '';

    let totalHTML = document.querySelector('.totalQuantity');
    let totalQuantity = 0;

    // if has product in Cart
    if (listCart) {
        listCart.forEach(product => {
            if (product) {
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML =
                    `<img style="width:70px;height:70px" src="${product.image}">
                    <div class="content">
                        <div class="name-cart">${product.name}</div>
                        <div class="price-cart">$${product.price} / 1 product</div>
                    </div>
                    <div class="quantity-cart">
                        <button onclick="changeQuantity(${product.id}, '-')">-</button>
                        <span class="value-cart">${product.quantity}</span>
                        <button onclick="changeQuantity(${product.id}, '+')">+</button>
                    </div>`;

                // Append the quantity-cart div to the rightmost of the newCart element
                newCart.appendChild(document.createElement('div')).classList.add('quantity-cart');

                listCartHTML.appendChild(newCart);
                totalQuantity = totalQuantity + product.quantity;
            }
        });
    }
    totalHTML.innerText = totalQuantity;
}

function changeQuantity($idProduct, $type){
    switch ($type) {
        case '+':
            listCart[$idProduct].quantity++;
            break;
        case '-':
            listCart[$idProduct].quantity--;

            // if quantity <= 0 then remove product in cart
            if(listCart[$idProduct].quantity <= 0){
                delete listCart[$idProduct];
            }
            break;
    
        default:
            break;
    }
    // save new data in cookie
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
    // reload html view cart
    addCartToHTML();
}

