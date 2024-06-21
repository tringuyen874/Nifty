
const facilityButton = document.getElementById('facility-btn');
const serviceButton = document.getElementById('service-btn');
const cartButton = document.querySelector('.cart-btn');
const submitButton = document.querySelector('.submit');
const closeButton = document.getElementsByClassName('close-btn')[0];
const productDetail = document.querySelector('.product-detail');
const productDetailClose = productDetail.querySelector('.detail .close-btn');
const cartTotal = document.querySelector('.cart .cart-count');
const cartAddingButton = document.querySelector('button#cart-adding');
const cartTable = document.querySelector('.cart-details');
const pagingButton = document.querySelector('.pagination');
const previousBtn = document.getElementById('previous-btn');
const nextBtn = document.getElementById('next-btn');
const orderLink = document.getElementById('order-link');

let productsInCart = [];
let orderId = '';

let requestBody = {
    page: 0,
    size: 9,
    data: {
        type: "service"
    }
};

facilityButton.addEventListener('click', () => {
    requestBody.data.type = "facility";
    serviceButton.classList.remove('active');
    facilityButton.classList.add('active');
    getProducts(requestBody);
})

serviceButton.addEventListener('click', () => {
    requestBody.data.type = "service";
    console.log("serviceButton clicked")
    facilityButton.classList.remove('active');
    serviceButton.classList.add('active');
    console.log(requestBody);
    getProducts(requestBody);
})

cartButton.addEventListener('click', () => {
    renderCart();
    togglePopup(document.getElementsByClassName('total-popup')[0]);
    clickOutsideListener(document.getElementsByClassName('total-popup')[0]);
})

submitButton.addEventListener('click', () => {
    submitOrder(productsInCart);
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
      if (!element.contains(event.target) && event.target !== cartButton) {
        console.log('event.target is not cart', event.target)
        console.log(element)
        element.classList.remove('active');
        // cartTable.classList.remove('active');
      } else {
        console.log('event.target is cart', event.target)
      }
    });
}



function getProducts(requestBody) {
    if(requestBody.page === 0) {
        previousBtn.style.visibility = 'hidden';
    }
    fetch('http://10.63.161.172:3001/api/get-product', {
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
            // alert('Internal Server Error, refresh the page')
            return getProducts(requestBody);
        }
    })
    .then(data => {
        const productContainer = document.getElementsByClassName('products');
        const products = data.data.items.slice(0, requestBody.size);
        productContainer[0].innerHTML = '';

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');

            const productImageElement = document.createElement('div');
            productImageElement.classList.add('product-image');
            productImageElement.style.background = `url(${product.image})`;

            const productDetailsElement = document.createElement('div');
            productDetailsElement.classList.add('product-details');

            const nameElement = document.createElement('div');
            nameElement.classList.add('name');
            nameElement.textContent = product.name;


            const priceElement = document.createElement('div');
            priceElement.classList.add('price');
            priceElement.textContent = `$${product.price}`;

            const descriptionElement = document.createElement('div');
            descriptionElement.classList.add('description');
            descriptionElement.textContent = product.description;
            descriptionElement.style.display = 'none';

            const idElement = document.createElement('div');
            idElement.classList.add('productId');
            idElement.textContent = product.id;
            idElement.style.display = 'none';

            productDetailsElement.appendChild(nameElement);
            productDetailsElement.appendChild(priceElement);
            productDetailsElement.appendChild(descriptionElement);
            productDetailsElement.appendChild(idElement);

            productElement.appendChild(productImageElement);
            productElement.appendChild(productDetailsElement);

            productContainer[0].appendChild(productElement);
        });
        var productsList = document.querySelectorAll('.products .product');
        console.log(productsList);
        productsList.forEach(product => {
            product.addEventListener('click', () => {
                document.querySelector('.product-detail .img').setAttribute('style', `background-image: ${product.querySelector('.product .product-image').style.background}`);
                console.log(product.querySelector('.product-details .name').innerHTML);
                productDetail.querySelector('.detail #product-name').innerHTML = product.querySelector('.product-details .name').innerHTML;
                productDetail.querySelector('.detail #product-price').innerHTML = product.querySelector('.product-details .price').innerHTML;
                productDetail.querySelector('.detail #product-description').innerHTML = product.querySelector('.product-details .description').textContent;
                productDetail.querySelector('.detail #product-id').textContent = product.querySelector('.product-details .productId').textContent;
                productDetail.querySelector('.detail #product-id').style.display = 'none';
                togglePopup(productDetail);
            })
        })
        
        productDetailClose.addEventListener('click', () => {
            togglePopup(productDetail);
        })
    })
    .catch(error => console.error(error));
}

document.addEventListener('DOMContentLoaded', getProducts(requestBody));

cartAddingButton.addEventListener('click', () => {
    cartTotal.innerHTML = parseInt(cartTotal.innerHTML) + 1;
    const productName = productDetail.querySelector('.detail #product-name').innerHTML;
    const productPrice = productDetail.querySelector('.detail #product-price').innerHTML;
    const productId = productDetail.querySelector('.detail #product-id').textContent;
    if (!checkProductExists(productName)) {
        console.log(productName + ' ' + productPrice);
        productsInCart.push({productId: productId, productName: productName, quanlity: 1, price: productPrice});
        console.log(productsInCart);
    } else {
        const product = productsInCart.find(product => product.productName === productName);
        product.quanlity += 1;
    }
    console.log(cartTotal.innerHTML);
})

function renderCart() {
    let cartTable = document.querySelector('.cart-details');
    let total = 0;

    cartTable.innerHTML = '';
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

let paginationLinks = document.querySelectorAll(".pagination .page");
let currentPage = document.querySelector(".pagination .active");
const totalPages = paginationLinks.length;
paginationLinks.forEach((paginationLinks) => {
    paginationLinks.addEventListener('click', function(event)  {
        event.preventDefault();
        requestBody.page = paginationLinks.innerHTML - 1;
        paginationLinks.classList.add('active');
        currentPage.classList.remove('active');
        currentPage = paginationLinks;
        console.log(currentPage);
        console.log(requestBody);
        if (requestBody.page > 0) {
            previousBtn.style.visibility = '';
        }
        if (requestBody.page == totalPages) {
            previousBtn.style.visibility = 'hidden';
        }
        if (requestBody.page == 0) {
            previousBtn.style.visibility = 'hidden';
        }
        getProducts(requestBody);

    })
})


nextBtn.addEventListener('click', function(event) {
    event.preventDefault();
    if (currentPage.innerHTML == 3) {
        console.log(currentPage.innerHTML + '')
        paginationLinks.forEach(page => {
            page.innerHTML = parseInt(page.innerHTML) + 3;
        })
        firstPage = document.getElementById('first-page');
        firstPage.classList.add('active');
        currentPage.classList.remove('active');
        currentPage = firstPage;
        
        requestBody.page += 1;
        getProducts(requestBody);
    } 
})

let orderRequestBody = {
    items: [{
        products: productsInCart
        }
    ]
}

function submitOrder(productsInCart) {
    fetch('http://10.63.161.172:3001/api/insert-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderRequestBody)
    })
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else if (response.status === 500) {
            // alert('Internal Server Error, refresh the page')
            return submitOrder(productsInCart);
        }
    })
    .then(data => {
        orderId = data.items[0].orderId;
        console.log(data)
        console.log(orderId);
    })
    .catch(error => console.error(error));
}

orderLink.addEventListener('click', function(event) {
    event.preventDefault();
    orderDetailUrl = `http://127.0.0.1:3000/Nifty/mini-project/cart-details.html?orderId=${orderId}`;
    window.location.href = orderDetailUrl;
    submitOrder(productsInCart);
})


