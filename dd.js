let cart = JSON.parse(localStorage.getItem('ART_SHOP_CART')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateCartCounter();
    if (document.getElementById('cart-list')) {
        renderCart();
    }
});

// وظيفة الإضافة (كما هي في كودك السابق مع تحسين بسيط)
function addToCart(product) {
    const existing = cart.find(item => item.image === product.image);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push(product);
    }
    syncCart();
    showPopup(`تمت إضافة "${product.name}" للسلة`);
}

// وظيفة رسم صفحة السلة
function renderCart() {
    const list = document.getElementById('cart-list');
    const footer = document.getElementById('cart-footer-box');
    const empty = document.getElementById('empty-container');
    const totalDisplay = document.getElementById('grand-total');

    list.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        empty.innerHTML = '<div class="empty-msg">سلتك فارغة تماماً.. اختر لوحتك الأولى الآن!</div>';
        footer.style.display = 'none';
        return;
    }

    footer.style.display = 'block';
    empty.innerHTML = '';

    cart.forEach((item, index) => {
        const price = parseInt(item.price.replace(/[^0-9]/g, ''));
        total += price * item.quantity;

        list.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p>${item.price}</p>
                </div>
                <div class="qty-controls">
                    <button onclick="changeQty(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQty(${index}, 1)">+</button>
                </div>
                <i class="fas fa-trash delete-btn" onclick="removeItem(${index})"></i>
            </div>
        `;
    });

    totalDisplay.innerText = total.toLocaleString();
}

// تعديل الكمية
window.changeQty = (index, delta) => {
    if (cart[index].quantity + delta > 0) {
        cart[index].quantity += delta;
    } else {
        cart.splice(index, 1);
    }
    syncCart();
    renderCart();
};

// حذف عنصر
window.removeItem = (index) => {
    cart.splice(index, 1);
    syncCart();
    renderCart();
};

// إرسال للواتساب
window.sendToWhatsApp = () => {
    let msg = "طلب جديد من متجر بيرفكت:\n\n";
    let total = 0;
    cart.forEach(item => {
        msg += `- ${item.name} | العدد: ${item.quantity}\n`;
        total += parseInt(item.price.replace(/[^0-9]/g, '')) * item.quantity;
    });
    msg += `\nالإجمالي: ${total}$\nيرجى تأكيد الطلب.`;
    
    const phone = "249123456789"; // ضع رقمك هنا
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
};

function syncCart() {
    localStorage.setItem('ART_SHOP_CART', JSON.stringify(cart));
    updateCartCounter();
}

function updateCartCounter() {
    const count = document.getElementById('cart-count');
    if (count) count.innerText = cart.reduce((s, i) => s + i.quantity, 0);
}

function showPopup(msg) {
    const p = document.createElement('div');
    p.className = 'cart-popup show';
    p.innerText = msg;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 2500);
}