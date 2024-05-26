document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("formm");
    const newdiv = document.getElementById("newBox");
    newdiv.style.display = "none";

    form.addEventListener("keydown", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            console.log("Enter key pressed.");
            showNewDiv();
        }
    });

    function showNewDiv() {
        console.log("showNewDiv function called.");
        const formData = new FormData(document.getElementById('formm'));
        fetch('/search', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Response received:", data);
            const newBox = document.getElementById('newBox');
            const searchBox = document.getElementById('searchBox');
            newBox.innerHTML = '';
            const availableHeight = window.innerHeight; // Get the available height of the window
            const divHeight = 40; 
            const maxProducts = Math.floor(availableHeight / divHeight); // Calculate the maximum number of products to display
            const productsToShow = data.slice(0, maxProducts); // Slice the data array to get only the products to display
            if (productsToShow.length > 0) {
                productsToShow.forEach((item) => {
                    const productDiv = document.createElement('div');
                    productDiv.id = `product`; 
                    productDiv.innerHTML = `<a href="${item.url}">${item.product_type} </a>`;
                    newBox.appendChild(productDiv); 
                });
            } else {
                newBox.innerHTML = '<p>No specific products found for the given description.</p>';
            }
            newBox.style.display = 'block';
            searchBox.style.display = 'none';
            console.log("newBox is now visible, searchBox is hidden.");
            console.log("Available Height:", availableHeight);
console.log("Div Height:", divHeight);
console.log("Max Products:", maxProducts);
console.log("Products to Show:", productsToShow);

        })
        .catch(error => console.error('Error:', error));
        return false;
    }
});
