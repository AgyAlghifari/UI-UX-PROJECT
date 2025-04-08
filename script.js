document.addEventListener('DOMContentLoaded', function() {
    // ======== INISIALISASI SEMUA FITUR ========
    initSmoothScrolling();
    initActiveMenuTracking();
    initFallingBooks();
    initSlideshow();
    initScrollReveal();
    
    // ======== FUNGSI SMOOTH SCROLLING ========
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }
    
    // ======== FUNGSI ACTIVE MENU TRACKING ========
    function initActiveMenuTracking() {
        const sections = document.querySelectorAll('section, header');
        const menuItems = document.querySelectorAll('.menu a');
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            menuItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href').slice(1) === current) {
                    item.classList.add('active');
                    // Tambahkan efek bounce kecil saat menu menjadi aktif
                    item.style.animation = 'menuActivate 0.5s ease';
                    setTimeout(() => {
                        item.style.animation = '';
                    }, 500);
                }
            });
        });
        
        // Set active menu awal berdasarkan hash URL
        const currentHash = window.location.hash || '#beranda';
        menuItems.forEach(link => {
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update active menu saat hash URL berubah
        window.addEventListener('hashchange', function() {
            const currentHash = window.location.hash;
            menuItems.forEach(link => {
                if (link.getAttribute('href') === currentHash) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        });
    }
    
    // ======== FUNGSI BUKU BERJATUHAN ========
    function initFallingBooks() {
        // Buat container untuk buku yang berjatuhan
        const booksContainer = document.createElement('div');
        booksContainer.className = 'falling-books-container';
        document.body.appendChild(booksContainer);
        
        // Data untuk buku
        const bookData = [
            { 
                title: 'Willy Anak Sekolah', 
                color: 'book-1',
                cover: 'img/Saili.png' 
            },
            { 
                title: 'Untitled', 
                color: 'book-2',
                cover: 'img/Willy Anak Sekolah.png' 
            },
            { 
                title: 'Willy Anak Sekolah', 
                color: 'book-3',
                cover: 'img/Rindu yang tak tahu cara pamit.png' 
            },
            { 
                title: 'Mencari Jejak Masa Muda', 
                color: 'book-4',
                cover: 'img/Mencari Jejak Masa Muda.png' 
            },
            { 
                title: 'Optimize Financial & Marketing', 
                color: 'book-5',
                cover: 'img/Kehidupan.png' 
            }
        ];
        
        // Buat beberapa buku berjatuhan
        const numberOfBooks = 15;
        const books = [];
        
        for (let i = 0; i < numberOfBooks; i++) {
            createFallingBook(booksContainer, bookData, books);
        }
        
        // Mulai animasi secara bertahap
        books.forEach((book, index) => {
            setTimeout(() => {
                startFallingAnimation(book);
            }, index * 600); // Mulai animasi setiap 600ms
        });
        
        // Buat fungsi untuk membuat buku baru setelah interval tertentu
        setInterval(() => {
            if (books.length < 25) { // Batasi jumlah buku maksimal
                const newBook = createFallingBook(booksContainer, bookData, books);
                startFallingAnimation(newBook);
            }
        }, 3000); // Buat buku baru setiap 3 detik
        
        // Fungsi untuk membuat buku yang berjatuhan
        function createFallingBook(container, bookData, booksArray) {
            // Buat elemen buku
            const book = document.createElement('div');
            
            // Pilih data buku secara acak
            const randomBookData = bookData[Math.floor(Math.random() * bookData.length)];
            
            // Set properti buku
            book.className = `book ${randomBookData.color}`;
            
            // Tambahkan judul buku
            const bookTitle = document.createElement('div');
            bookTitle.className = 'book-title';
            bookTitle.textContent = randomBookData.title;
            book.appendChild(bookTitle);
            
            // Tambahkan cover jika ada
            if (randomBookData.cover) {
                const bookCover = document.createElement('div');
                bookCover.className = 'book-cover';
                bookCover.style.backgroundImage = `url(${randomBookData.cover})`;
                book.appendChild(bookCover);
            }
            
            // Posisi awal acak (horizontal)
            const randomX = Math.random() * (window.innerWidth - 100);
            book.style.left = `${randomX}px`;
            
            // Ukuran acak
            const randomSize = 0.8 + Math.random() * 0.5; // Antara 0.8 dan 1.3
            book.style.transform = `scale(${randomSize})`;
            
            // Tambahkan ke container
            container.appendChild(book);
            
            // Tambahkan ke array buku
            booksArray.push(book);
            
            // Kembalikan referensi buku
            return book;
        }
        
        // Fungsi untuk memulai animasi jatuh
        function startFallingAnimation(book) {
            // Durasi acak
            const duration = 8 + Math.random() * 10; // Antara 8 dan 18 detik
            
            // Set animasi
            book.style.animation = `falling ${duration}s linear forwards`;
            
            // Hapus buku setelah animasi selesai
            book.addEventListener('animationend', function() {
                if (book.parentNode) {
                    book.parentNode.removeChild(book);
                    
                    // Hapus dari array
                    const index = books.indexOf(book);
                    if (index > -1) {
                        books.splice(index, 1);
                    }
                }
            });
        }
        
        // Setup drag-and-drop
        let isDragging = false;
        let currentBook = null;
        let initialX, initialY, initialMouseX, initialMouseY;
        
        document.addEventListener('mousedown', function(e) {
            // Cek apakah target adalah buku
            if (e.target.classList.contains('book') || e.target.parentNode.classList.contains('book')) {
                isDragging = true;
                
                // Dapatkan referensi buku
                currentBook = e.target.classList.contains('book') ? e.target : e.target.parentNode;
                
                // Hentikan animasi
                currentBook.style.animation = 'none';
                
                // Dapatkan posisi awal
                const rect = currentBook.getBoundingClientRect();
                initialX = rect.left;
                initialY = rect.top;
                initialMouseX = e.clientX;
                initialMouseY = e.clientY;
                
                // Ubah style saat dragging
                currentBook.style.zIndex = 1000;
                currentBook.style.transition = 'none';
                
                // Prevent default untuk menghindari perilaku drag default
                e.preventDefault();
            }
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isDragging && currentBook) {
                // Hitung pergeseran
                const dx = e.clientX - initialMouseX;
                const dy = e.clientY - initialMouseY;
                
                // Terapkan pergeseran
                currentBook.style.left = `${initialX + dx}px`;
                currentBook.style.top = `${initialY + dy}px`;
                
                // Rotate sedikit saat digeser
                const rotation = dx * 0.2; // Rotasi proporsional dengan pergeseran horizontal
                currentBook.style.transform = `rotate(${rotation}deg) scale(1.1)`;
                
                e.preventDefault();
            }
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging && currentBook) {
                // Reset zIndex dan transisi
                currentBook.style.zIndex = 101;
                currentBook.style.transition = 'transform 0.3s ease';
                
                // Reset transform dengan halus
                setTimeout(() => {
                    currentBook.style.transform = 'rotate(0deg) scale(1)';
                }, 50);
                
                // Mulai animasi jatuh lagi dengan delay
                setTimeout(() => {
                    startFallingAnimation(currentBook);
                }, 1000);
                
                // Reset status dragging
                isDragging = false;
                currentBook = null;
            }
        });
        
        // Sentuh dukungan untuk perangkat mobile
        document.addEventListener('touchstart', function(e) {
            if (e.target.classList.contains('book') || e.target.parentNode.classList.contains('book')) {
                isDragging = true;
                
                // Dapatkan referensi buku
                currentBook = e.target.classList.contains('book') ? e.target : e.target.parentNode;
                
                // Hentikan animasi
                currentBook.style.animation = 'none';
                
                // Dapatkan posisi awal
                const rect = currentBook.getBoundingClientRect();
                initialX = rect.left;
                initialY = rect.top;
                initialMouseX = e.touches[0].clientX;
                initialMouseY = e.touches[0].clientY;
                
                // Ubah style saat dragging
                currentBook.style.zIndex = 1000;
                currentBook.style.transition = 'none';
                
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('touchmove', function(e) {
            if (isDragging && currentBook) {
                // Hitung pergeseran
                const dx = e.touches[0].clientX - initialMouseX;
                const dy = e.touches[0].clientY - initialMouseY;
                
                // Terapkan pergeseran
                currentBook.style.left = `${initialX + dx}px`;
                currentBook.style.top = `${initialY + dy}px`;
                
                // Rotate sedikit saat digeser
                const rotation = dx * 0.2;
                currentBook.style.transform = `rotate(${rotation}deg) scale(1.1)`;
                
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('touchend', function() {
            if (isDragging && currentBook) {
                // Reset zIndex dan transisi
                currentBook.style.zIndex = 101;
                currentBook.style.transition = 'transform 0.3s ease';
                
                // Reset transform dengan halus
                setTimeout(() => {
                    currentBook.style.transform = 'rotate(0deg) scale(1)';
                }, 50);
                
                // Mulai animasi jatuh lagi dengan delay
                setTimeout(() => {
                    startFallingAnimation(currentBook);
                }, 1000);
                
                // Reset status dragging
                isDragging = false;
                currentBook = null;
            }
        });
    }
    
    // ======== FUNGSI SLIDESHOW ========
    function initSlideshow() {
        // Data untuk slideshow
        const slideshowData = [
            {
                image: 'img/Mencari Jejak Masa Muda.png',
                title: 'Mencari Jejak Masa Muda',
                description: 'Refleksi mendalam tentang berbagai aspek kehidupan masa lalu.',
                isBestSeller: true
            },
            {
                image: 'img/Kehidupan.png',
                title: 'Puisi Kehidupan',
                description: 'Sebuah perjalanan melintasi waktu yang mengungkap misteri masa lalu',
                isBestSeller: true
            },
            {
                image: 'img/Saili.png',
                title: 'Saili',
                description: 'Saili adalah tentang perjalanan, harapan, dan makna di balik setiap langkah. Sebuah kisah yang mengajarkan bahwa dalam pencarian, selalu ada pelajaran berharga yang menunggu untuk ditemukan.',
                isBestSeller: false
            },
            {
                image: 'img/Keseharian Mahasiswa.png',
                title: 'Keseharian Mahasiswa',
                description: 'Tentang keluh kesah dan keseruan saat menjadi mahasiswa',
                isBestSeller: true
            },
            {
                image: 'img/Mencari Jejak Masa Muda.png',
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
    }
    
    // ======== FUNGSI SCROLL REVEAL ========
    function initScrollReveal() {
        // Tambahkan style awal untuk animasi
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes menuActivate {
                0% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
                100% { transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
        
        // Animasi item saat scroll
        window.addEventListener('scroll', function() {
            const bookItems = document.querySelectorAll('.book-item');
            const achievementItems = document.querySelectorAll('.achievement-item');
            
            // Animasi untuk book items
            bookItems.forEach((item, index) => {
                const itemPosition = item.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;
                
                if (itemPosition < screenPosition) {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
            
            // Animasi untuk achievement items
            achievementItems.forEach((item, index) => {
                const itemPosition = item.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;
                
                if (itemPosition < screenPosition) {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 200);
                }
            });
        });
        
        // Trigger scroll event saat halaman dimuat
        setTimeout(() => {
            window.dispatchEvent(new Event('scroll'));
        }, 500);
    }
});