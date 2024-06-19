
const facilityButton = document.getElementById('facility-btn');
const serviceButton = document.getElementById('service-btn');
const cartButton = document.querySelector('.cart-btn');
const submitButton = document.getElementsByClassName('submit')[0];
const closeButton = document.getElementsByClassName('close-btn')[0];
const productDetail = document.querySelector('.product-detail');
const productDetailClose = productDetail.querySelector('.detail .close-btn');
const cartTotal = document.querySelector('.cart .cart-count');
const cartAddingButton = document.querySelector('button#cart-adding');
// const cartDetails = document.querySelector('.cart-details');

let productsInCart = [];


let requestBody = {
    page: 0,
    size: 3,
    data: {
        type: "facility"
    }
};

facilityButton.addEventListener('click', () => {
    getProducts(requestBody);
})

serviceButton.addEventListener('click', () => {
    requestBody.data.type = "service";
    getProducts(requestBody);
})

cartButton.addEventListener('click', () => {
    renderCart();
    togglePopup(document.getElementsByClassName('total-popup')[0]);
})

submitButton.addEventListener('click', () => {
    togglePopup(document.getElementsByClassName('cart-submit')[0]);
})

closeButton.addEventListener('click', () => {
    // togglePopup(document.getElementsByClassName('total-popup')[0]);
    togglePopup(document.getElementsByClassName('cart-submit')[0]);
})

function checkProductExists(productName) {
    return productsInCart.some(function(product) {
      return product.name === productName;
    });
}


function togglePopup(element) {
    element.classList.toggle('active');
    // document.getElementsByClassName('cart-submit')[0].classList.toggle('active');
}

function clickOutsideListener(element) {
    document.addEventListener('click', function(event) {
      if (!element.contains(event.target)) {
        element.classList.remove('active');
      }
    });
  }



function getProducts(requestBody) {
    fetch('http://10.63.161.172:3000/api/get-product', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
})
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else if (response.status === 500) {
            alert('Internal Server Error, refresh the page')
        }
    })
    .then(data => {
        const productContainer = document.getElementsByClassName('products');
        const products = data.data.items.slice(0, requestBody.size);

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');

            const productImageElement = document.createElement('div');
            productImageElement.classList.add('product-image');
            productImageElement.style.background = `url(${product.image})`;

            const productDescriptionElement = document.createElement('div');
            productDescriptionElement.classList.add('product-description');

            const nameElement = document.createElement('div');
            nameElement.classList.add('name');
            nameElement.textContent = product.name;

            const priceElement = document.createElement('div');
            priceElement.classList.add('price');
            priceElement.textContent = `$${product.price}`;

            productDescriptionElement.appendChild(nameElement);
            productDescriptionElement.appendChild(priceElement);

            productElement.appendChild(productImageElement);
            productElement.appendChild(productDescriptionElement);

            productContainer[0].appendChild(productElement);
        });
        var productsList = document.querySelectorAll('.products .product');
        console.log(productsList);
        productsList.forEach(product => {
            product.addEventListener('click', () => {
                // document.querySelector('.product-detail .img').style.background = `url(${product.querySelector('.product .product-image').style.background})`;
                document.querySelector('.product-detail .img').setAttribute('style', `background-image: ${product.querySelector('.product .product-image').style.background}`);
                console.log(product.querySelector('.product-description .name').innerHTML);
                productDetail.querySelector('.detail #product-name').innerHTML = product.querySelector('.product-description .name').innerHTML;
                productDetail.querySelector('.detail #product-price').innerHTML = product.querySelector('.product-description .price').innerHTML;
                togglePopup(productDetail);
            })
        })
        
        productDetailClose.addEventListener('click', () => {
            togglePopup(productDetail);
        })
    })
    .catch(error => console.error(error));
}


cartAddingButton.addEventListener('click', () => {
    cartTotal.innerHTML = parseInt(cartTotal.innerHTML) + 1;
    const productName = productDetail.querySelector('.detail #product-name').innerHTML;
    const productPrice = productDetail.querySelector('.detail #product-price').innerHTML;
    if (!checkProductExists(productName)) {
        console.log(productName + ' ' + productPrice);
        productsInCart.push({name: productName, price: productPrice, count: 1});
        console.log(productsInCart);
        
    } else {
        const product = productsInCart.find(product => product.name === productName);
        product.count += 1;
        // productsInCart.count += 1
    }
    
    // console.log(productName + ' ' + productPrice);
    console.log(cartTotal.innerHTML);
})

function renderCart() {
    let cartTable = document.querySelector('.cart-details');
    let total = 0;
    productsInCart.forEach(product => {
        const newRow = document.createElement('tr');
        const productName = document.createElement('td');
        productName.textContent = product.name + ' x' + product.count;
        const productPrice = document.createElement('td');
        productPrice.textContent = product.price;
        newRow.appendChild(productName);
        newRow.appendChild(productPrice);
        total += Number(product.price.replace("$", "")) * product.count;
        cartTable.appendChild(newRow);
    })
    document.querySelector('.total .total-desc').textContent = `Total: $${total}`
    
}


// cartButton.addEventListener('click', () => {
    
// })

