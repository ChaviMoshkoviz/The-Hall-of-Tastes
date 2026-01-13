


// --- 1. פונקציית ניווט (מוגדרת כעת ברמה גלובלית) ---
function openNewsArticle() {
    const articleURL = "cart.html";
    const windowName = "_self";
    const newsWindow = window.open(articleURL, windowName);

    if (newsWindow) {
        console.log("נווט לעמוד cart.html באותו חלון.");
    } else {
        alert("אירעה שגיאה בניווט לעמוד cart.html.");
    }
}


let carts = []; 
loadCartFromLocalStorage(); // קריאה ראשונית לטעינת העגלה עם טעינת הסקריפט
// --- 2. לטעון את נתוני עגלת הקניות שנשמרו ב-localStorage
function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('shoppingCart');
    if (storedCart) {
        carts = JSON.parse(storedCart);
      
    }
}

// --- 4. שמירת עגלת הקניות ל-Local Storage (פונקציה גלובלית) ---
function saveCartToLocalStorage() {
    const cartString = JSON.stringify(carts);
    localStorage.setItem('shoppingCart', cartString);
  
}

// --- 5. הוספת פריט לעגלה (פונקציה גלובלית) ---
function addToCart(product) {
    const existingProductIndex = carts.findIndex(item => item.name == product.name);

    if (existingProductIndex != -1) { 
        carts[existingProductIndex].quantity++;
        console.log(`Increased quantity for ${product.name}. New quantity: ${carts[existingProductIndex].quantity}`);
    } else {
        product.quantity = 1;
        carts.push(product);
        console.log(`Added new product to cart: ${product.name}`);
    }
    saveCartToLocalStorage();
}

// --- 6. הקטנת כמות או הסרת פריט מהעגלה (פונקציה גלובלית) ---
function decreaseQuantityOrRemoveItem(index) {
    if (index >= 0 && index < carts.length) {
        if (carts[index].quantity > 1) {
            carts[index].quantity--;
        } else {
            carts.splice(index, 1);
        }
        saveCartToLocalStorage();
    } else {
        console.warn(`Attempted to remove item with invalid index: ${index}`);
    }
}

// --- 7. פונקציה המציגה את פריטי העגלה ב-HTML (פונקציה גלובלית) ---
// זו הפונקציה שהייתה מוגדרת בתוך ה-if הקודם וכעת היא נגישה מכל מקום
function displayCartItems() {
    const cartItemsContainer = document.querySelector('#cart-items-container');
    const cartTotalPriceElement = document.querySelector('#cart-total-price');

    cartItemsContainer.innerHTML = ''; // נקה את הקונטיינר לפני ההצגה מחדש

    if (carts.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">סל הקניות ריק. אנא הוסף פריטים מהתפריט!</p>';
        cartTotalPriceElement.textContent = '₪0';
        return;
    }

    let total = 0;

    carts.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');

        itemElement.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>${item.desc}</p>
                <span class="cart-item-price">${item.price.toFixed(2)}₪</span>
                <div class="item-quantity">
                    <span>כמות: ${item.quantity}</span>
                </div>
            </div>
            <button class="btn-remove" data-index="${index}"><i class="fas fa-trash-alt"></i> הסר</button>
        `;
        cartItemsContainer.appendChild(itemElement);

        total += item.price * item.quantity;
    });

    cartTotalPriceElement.textContent = `₪${total.toFixed(2)}`;

    document.querySelectorAll('.btn-remove').forEach(button => {
        button.addEventListener('click', function() {
            const indexToRemove = parseInt(this.dataset.index);
            decreaseQuantityOrRemoveItem(indexToRemove);
            displayCartItems(); // רענן את התצוגה לאחר שינוי
        });
    });
}


document.addEventListener('DOMContentLoaded', function() {
    // --- לוגיקה ספציפית לדף התפריט (menu.html) ---
    if (window.location.pathname.includes('menu.html')) {
        const orderButtons = document.querySelectorAll('.btn-order');
        orderButtons.forEach(button => {
            button.addEventListener('click', function () {
                const item = this.closest('.menu-item');
                const name = item.querySelector('h4').textContent;
                const desc = item.querySelector('p').textContent;
                const priceText = item.querySelector('.price').textContent;
                const price = parseFloat(priceText.replace('₪', '').trim());
                const img = item.querySelector('img').getAttribute('src');
                addToCart({ name, desc, price, img });
            });
        });
        console.log("Menu page elements initialized.");
    }

    // --- לוגיקה ספציפית לדף עגלת הקניות (cart.html) ---
    // נכנס לבלוק הזה רק אם אנחנו בדף עגלת הקניות
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems(); // קורא לפונקציה רק בדף עגלת הקניות
        const btnCheckout = document.querySelector('.btn-checkout'); // שינוי ל-querySelector כי יש רק כפתור אחד כזה בדרך כלל

        if (btnCheckout) { // ודא שהכפתור קיים לפני הוספת ה-event listener
            btnCheckout.addEventListener('click', () => {
                carts.splice(0, carts.length); // מנקה את העגלה
                localStorage.setItem('shoppingCart', JSON.stringify(carts)); // מעדכן את localStorage
                displayCartItems(); 
            });
        }
    }
});
