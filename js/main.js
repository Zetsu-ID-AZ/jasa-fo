// =====================================================
// CONFIGURATION - Edit nilai di sini untuk mengubah data
// =====================================================
const CONFIG = {
    whatsappNumber: '6285921632214',
    seaBankAccount: {
        bank: 'SeaBank Indonesia',
        number: '901234567890',
        name: 'ZET ID OFFICIAL'
    },
    danaNumber: '085921632214',
    packages: ['starter', 'business', 'enterprise']
};

// =====================================================
// INITIALIZATION
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    initShippingOptions();
    initScrollAnimations();
    initNavigationHighlight();
});

// Set default shipping selection
function initShippingOptions() {
    CONFIG.packages.forEach(pkg => {
        const defaultOpt = document.querySelector(`#shipping-${pkg}-group .radio-option[data-ship="angin"]`);
        if(defaultOpt) {
            defaultOpt.classList.add('selected');
            const radio = defaultOpt.querySelector('input');
            if(radio) radio.checked = true;
        }
    });

    // Click handlers for radio options
    document.querySelectorAll('.radio-option').forEach(opt => {
        opt.addEventListener('click', function(e) {
            e.stopPropagation();
            const pkg = this.dataset.pkg;
            const container = document.querySelector(`#shipping-${pkg}-group`);
            if(container) container.querySelectorAll('.radio-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            const radio = this.querySelector('input');
            if(radio) radio.checked = true;
        });
    });
}

// =====================================================
// MOBILE MENU FUNCTIONS
// =====================================================
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebarNav');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('active');
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebarNav');
    const overlay = document.getElementById('sidebarOverlay');
    if(sidebar) sidebar.classList.remove('mobile-open');
    if(overlay) overlay.classList.remove('active');
}

// =====================================================
// PAYMENT MODAL FUNCTIONS
// =====================================================
const paymentModal = document.getElementById('paymentModal');

function closePaymentModal() {
    if(paymentModal) paymentModal.style.display = 'none';
}

function getSelectedShipping(packageName) {
    const selected = document.querySelector(`#shipping-${packageName}-group .radio-option.selected`);
    return selected ? selected.dataset.ship : 'angin';
}

function showSeaBankPayment(packageName, price) {
    const shipMethod = getSelectedShipping(packageName);
    const shipText = shipMethod === 'angin' ? 'RESI ANGIN (Tanpa kirim paket)' : 'RESI MANUAL (Kirim paket kosong ke CO)';
    
    const modalTitle = document.getElementById('paymentModalTitle');
    const modalBody = document.getElementById('paymentModalBody');
    
    if(modalTitle) modalTitle.innerHTML = `💰 Pembayaran Paket ${packageName.toUpperCase()}`;
    if(modalBody) {
        modalBody.innerHTML = `
            <div class="bank-detail">
                <strong>🏦 SeaBank - Transfer Bank</strong><br/><br/>
                Nama Bank: <strong>${CONFIG.seaBankAccount.bank}</strong><br/>
                No. Rekening: <strong>${CONFIG.seaBankAccount.number}</strong><br/>
                Nama Penerima: <strong>${CONFIG.seaBankAccount.name}</strong><br/>
                <button class="copy-btn" onclick="copyToClipboard('${CONFIG.seaBankAccount.number}')">Salin No Rekening</button>
            </div>
            <p style="margin-top: 1.25rem;"><strong>Detail Pesanan:</strong><br/>
            Paket: ${packageName.toUpperCase()} (Rp ${price})<br/>
            Metode Kirim: ${shipText}<br/>
            Total: <strong>Rp ${price}</strong></p>
            <p style="margin-top: 1.25rem;">📌 <strong>Instruksi:</strong><br/>
            1. Transfer sesuai total ke rekening SeaBank di atas.<br/>
            2. Screenshot bukti transfer.<br/>
            3. Kirim bukti transfer ke WhatsApp admin.<br/>
            4. Proses FO akan dimulai setelah konfirmasi.</p>
            <button class="btn-primary" style="margin-top: 1.5rem; width:100%;" onclick="confirmPayment()">✅ Konfirmasi via WhatsApp</button>
        `;
    }
    if(paymentModal) paymentModal.style.display = 'flex';
}

function showDanaPayment(packageName, price) {
    const shipMethod = getSelectedShipping(packageName);
    const shipText = shipMethod === 'angin' ? 'RESI ANGIN (Tanpa kirim paket)' : 'RESI MANUAL (Kirim paket kosong ke CO)';
    
    const modalTitle = document.getElementById('paymentModalTitle');
    const modalBody = document.getElementById('paymentModalBody');
    
    if(modalTitle) modalTitle.innerHTML = `💰 Pembayaran via DANA`;
    if(modalBody) {
        modalBody.innerHTML = `
            <div class="bank-detail" style="text-align: center;">
                <strong>📱 DANA - Scan QR Code</strong><br/>
                <div style="background: white; padding: 1.25rem; border-radius: 18px; display: inline-block; margin: 1.25rem 0;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DANA-${CONFIG.danaNumber}-ZETID" alt="QR Code DANA" style="width: 180px; height: 180px; border-radius: 10px;">
                </div>
                <p>atau kirim ke <strong>No. DANA: ${CONFIG.danaNumber}</strong></p>
                <button class="copy-btn" onclick="copyToClipboard('${CONFIG.danaNumber}')">Salin No DANA</button>
            </div>
            <p style="margin-top: 1.25rem;"><strong>Detail Pesanan:</strong><br/>
            Paket: ${packageName.toUpperCase()} (Rp ${price})<br/>
            Metode Kirim: ${shipText}<br/>
            Total: <strong>Rp ${price}</strong></p>
            <p style="margin-top: 1.25rem;">📌 <strong>Instruksi:</strong><br/>
            1. Scan QR DANA atau kirim ke No DANA di atas.<br/>
            2. Screenshot bukti pembayaran.<br/>
            3. Kirim bukti ke WhatsApp admin.<br/>
            4. Proses FO akan dimulai.</p>
            <button class="btn-primary" style="margin-top: 1.5rem; width:100%;" onclick="confirmPayment()">✅ Konfirmasi via WhatsApp</button>
        `;
    }
    if(paymentModal) paymentModal.style.display = 'flex';
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Nomor berhasil disalin: ' + text);
    }).catch(() => {
        alert('Gagal menyalin. Silakan salin manual: ' + text);
    });
}

function confirmPayment() {
    const message = 'Halo ZET ID, saya sudah melakukan pembayaran. Mohon konfirmasi dan proses FO saya. Terima kasih.';
    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    closePaymentModal();
}

// =====================================================
// NAVIGATION & SCROLL FUNCTIONS
// =====================================================
function scrollToPricing() { 
    const hargaSection = document.getElementById('harga');
    if(hargaSection) hargaSection.scrollIntoView({ behavior: 'smooth' });
}
function scrollToHow() { 
    const caraSection = document.getElementById('cara');
    if(caraSection) caraSection.scrollIntoView({ behavior: 'smooth' });
}
function scrollToContact() { 
    const kontakSection = document.getElementById('kontak');
    if(kontakSection) kontakSection.scrollIntoView({ behavior: 'smooth' });
}

function openWhatsApp() {
    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent('Halo ZET ID, saya ingin konsultasi tentang jasa FO')}`, '_blank');
}

// Active nav highlight on scroll
function initNavigationHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');

    if(sections.length === 0 || navItems.length === 0) return;

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if(scrollPosition >= sectionTop - 200 && scrollPosition < sectionTop + sectionHeight - 100) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if(href === '#' + current) item.classList.add('active');
        });
    });
}

// =====================================================
// SCROLL ANIMATIONS (Intersection Observer)
// =====================================================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .pricing-card, .step-item, .testimonial-card')
        .forEach(el => observer.observe(el));
}

// Close modal on outside click
window.onclick = function(e) {
    if(e.target === paymentModal) closePaymentModal();
};