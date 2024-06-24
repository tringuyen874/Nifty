document.addEventListener('DOMContentLoaded', function(e) {
    let productsInCart = []

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    console.log(orderId);
    document.getElementById('order-id').textContent = orderId;
    let total = 0;

    let requestBody = {
        page: 0,
        size: 10,
        data: {
            orderId: orderId
        }
    }

    fetch('http://10.63.161.172:3001/api/get-order', {
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
            return getProducts(requestBody);
        }
    })
    .then(data => {
        console.log(data);
        productsInCart = data.data.items[0].products;
        cartTable = document.getElementById('cart-table');
        productsInCart.forEach(product => {
            const newRow = document.createElement('tr');
            const productName = document.createElement('td');
            productName.textContent = product.productName;
            const productCount = document.createElement('td');
            productCount.textContent = product.quanlity;
            const productPrice = document.createElement('td');
            productPrice.textContent = product.price;
            newRow.appendChild(productName);
            newRow.appendChild(productCount);
            newRow.appendChild(productPrice);
            total += Number(product.price.replace('$', '')) * product.quanlity;
            cartTable.appendChild(newRow);
        })
        document.getElementById('total-price').textContent = total;
    })
    .catch(error => console.error(error));
})