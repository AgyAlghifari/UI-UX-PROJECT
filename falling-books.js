// Tambahkan container untuk buku-buku yang berjatuhan
document.addEventListener('DOMContentLoaded', function() {
    // Buat container untuk buku yang berjatuhan
    const booksContainer = document.createElement('div');
    booksContainer.className = 'falling-books-container';
    document.body.appendChild(booksContainer);
    
    // Data untuk buku
    const bookData = [
        { 
            title: 'Puisi Kehidupan', 
            color: 'book-1',
            cover: 'book1.png' 
        },
        { 
            title: 'Untitled', 
            color: 'book-2',
            cover: 'book2.png' 
        },
        { 
            title: 'Willy Anak Sekolah', 
            color: 'book-3',
            cover: 'book3.png' 
        },
        { 
            title: 'Mencari Jejak Masa Muda', 
            color: 'book-4',
            cover: 'book4.png' 
        },
        { 
            title: 'Optimize Financial & Marketing', 
            color: 'book-5',
            cover: '' 
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
});

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

// Buat buku bisa digeser dengan mouse
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