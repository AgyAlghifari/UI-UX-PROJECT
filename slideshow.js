console.log("Slideshow loaded");
document.addEventListener('DOMContentLoaded', function() {
    // Data untuk slideshow (ganti dengan karya best seller atau iklan Anda)
    const slideshowData = [
        {
            image: 'd:\Senandika Web\img\foto 1.jpg',
            title: 'Senandika',
            description: 'Portofolio Penulis Profesional',
            isBestSeller: true
        },
        {
            image: 'book1.png',
            title: 'Puisi Kehidupan',
            description: 'Kumpulan puisi tentang makna hidup yang menginspirasi',
            isBestSeller: true
        },
        {
            image: 'book2.png',
            title: 'Untitled',
            description: 'Benda yang tak ingin punya judul',
            isBestSeller: false
        },
        {
            image: 'book3.png',
            title: 'Willy Anak Sekolah',
            description: 'Kisah perjuangan anak remaja',
            isBestSeller: true
        },
        {
            image: 'book4.png',
            title: 'Mencari Jejak Masa Muda',
            description: 'Memoir tentang nostalgia perjalanan hidup',
            isBestSeller: false
        }
    ];
    
    // Cari elemen container untuk slideshow
    const headerImageContainer = document.querySelector('.right-content');
    
    // Hapus gambar statis yang ada
    headerImageContainer.innerHTML = '';
    
    // Buat container slideshow
    const slideshowContainer = document.createElement('div');
    slideshowContainer.className = 'slideshow-container';
    headerImageContainer.appendChild(slideshowContainer);
    
    // Buat dots container
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slideshow-dots';
    slideshowContainer.appendChild(dotsContainer);
    
    // Tambahkan slides berdasarkan data
    slideshowData.forEach((slide, index) => {
        // Buat slide
        const slideElement = document.createElement('div');
        slideElement.className = `slide${index === 0 ? ' active' : ''}`;
        slideElement.style.backgroundImage = `url(${slide.image})`;
        
        // Tambahkan badge best seller jika perlu
        if (slide.isBestSeller) {
            const bestSellerBadge = document.createElement('div');
            bestSellerBadge.className = 'best-seller-badge';
            bestSellerBadge.textContent = 'BEST SELLER';
            slideElement.appendChild(bestSellerBadge);
        }
        
        // Tambahkan caption
        const caption = document.createElement('div');
        caption.className = 'slide-caption';
        
        const title = document.createElement('h3');
        title.textContent = slide.title;
        caption.appendChild(title);
        
        const description = document.createElement('p');
        description.textContent = slide.description;
        caption.appendChild(description);
        
        slideElement.appendChild(caption);
        slideshowContainer.appendChild(slideElement);
        
        // Tambahkan dot untuk navigasi
        const dot = document.createElement('div');
        dot.className = `dot${index === 0 ? ' active' : ''}`;
        dot.dataset.index = index;
        dotsContainer.appendChild(dot);
        
        // Event listener untuk dot
        dot.addEventListener('click', function() {
            currentSlide = parseInt(this.dataset.index);
            showSlide(currentSlide);
        });
    });
    
    // Variabel untuk melacak slide aktif
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    // Fungsi untuk menunjukkan slide tertentu
    function showSlide(n) {
        // Sembunyikan semua slide
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Nonaktifkan semua dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Aktifkan slide dan dot yang dipilih
        slides[n].classList.add('active');
        dots[n].classList.add('active');
    }
    
    // Fungsi untuk pindah ke slide berikutnya
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Set interval untuk pindah slide otomatis
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Hentikan interval ketika kursor di atas slideshow, lanjutkan ketika keluar
    slideshowContainer.addEventListener('mouseenter', function() {
        clearInterval(slideInterval);
    });
    
    slideshowContainer.addEventListener('mouseleave', function() {
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    // Fungsi untuk swipe pada perangkat mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    slideshowContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slideshowContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        // Swipe kiri (next slide)
        if (touchEndX < touchStartX - 50) {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        // Swipe kanan (previous slide)
        if (touchEndX > touchStartX + 50) {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }
    }
    
    // Fungsi untuk memuat gambar dengan preload
    function preloadImages() {
        slideshowData.forEach(slide => {
            const img = new Image();
            img.src = slide.image;
        });
    }
    
    // Preload gambar
    preloadImages();
});