
const facilityButton = document.getElementById('facility-btn');
const serviceButton = document.getElementById('service-btn');
const cartButton = document.getElementById('cart-btn');
const submitButton = document.getElementsByClassName('submit')[0];
const closeButton = document.getElementsByClassName('close-btn')[0];

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
    togglePopup(document.getElementsByClassName('total-popup')[0]);
})

submitButton.addEventListener('click', () => {
    togglePopup(document.getElementsByClassName('cart-submit')[0]);
})

closeButton.addEventListener('click', () => {
    // togglePopup(document.getElementsByClassName('total-popup')[0]);
    togglePopup(document.getElementsByClassName('cart-submit')[0]);
})

function togglePopup(element) {
    element.toggle('active');
    // document.getElementsByClassName('cart-submit')[0].classList.toggle('active');
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
    })
    .catch(error => console.error(error));
}

// cartButton.addEventListener('click', () => {
    
// })

