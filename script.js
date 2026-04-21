// مصفوفة العربة: تحاول قراءة البيانات القديمة أو تبدأ بمصفوفة فارغة
let cart = JSON.parse(localStorage.getItem('ART_SHOP_CART')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // تحديث العداد عند تحميل الصفحة لأول مرة
    updateCartCounter();

    // استهداف جميع أزرار الشراء في الصفحة
    const addButtons = document.querySelectorAll('.item button');

    addButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const productElement = btn.closest('.item'); // استخدام closest لضمان الوصول للعنصر الأب الصحيح
            
            const product = {
                name: productElement.querySelector('.name')?.innerText || "لوحة فنية",
                price: productElement.querySelector('.price').innerText,
                image: productElement.querySelector('img').src,
                quantity: 1
            };

            addToCart(product);
        });
    });
});

// وظيفة الإضافة للعربة
function addToCart(product) {
    const existingProduct = cart.find(item => item.image === product.image);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem('ART_SHOP_CART', JSON.stringify(cart));
    
    // تحديث العداد المرئي
    updateCartCounter();
    
    // إظهار رسالة نجاح
    showPopup(`تمت إضافة "${product.name}" إلى العربة!`);
    
    // إضافة تأثير نبض لأيقونة السلة
    animateCartIcon();
}

// وظيفة تحديث رقم العداد فوق أيقونة السلة
function updateCartCounter() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.innerText = totalItems;
    }
}

// وظيفة لإضافة حركة خفيفة لأيقونة السلة عند الشراء
function animateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon-container');
    cartIcon.classList.add('bump');
    setTimeout(() => cartIcon.classList.remove('bump'), 300);
}

// وظيفة إظهار رسالة منبثقة (Popup)
function showPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'cart-popup';
    popup.innerText = message;
    document.body.appendChild(popup);

    setTimeout(() => popup.classList.add('show'), 100);

    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 500);
    }, 3000);
}