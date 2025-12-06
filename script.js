// ============================================
// VARIÁVEIS GLOBAIS
// ============================================

const whatsappNumber = "5534997917016";
const whatsappMessage = "Olá! Gostaria de agendar um atendimento na estética Dayane Marley.";

// ============================================
// MENU MOBILE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle) {
        // Alterna classe e atualiza atributo aria-expanded para acessibilidade
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            const expanded = nav.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', expanded);
        });

        // Permite abrir/fechar com Enter ou Espaço (acessibilidade teclado)
        menuToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                menuToggle.click();
            }
        });
    }

    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
        });
    });
});

// ============================================
// WHATSAPP BUTTONS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const whatsappButtons = document.querySelectorAll('.btn-whatsapp-hero, .btn-whatsapp-contato');
    
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openWhatsApp();
        });
    });
});

function openWhatsApp() {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.servico-card, .depoimento-card, .contato-card, .sobre-card');
    cards.forEach(card => {
        observer.observe(card);
    });
});

// ============================================
// SMOOTH SCROLL PARA LINKS DE NAVEGAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// ============================================
// HEADER SHADOW ON SCROLL
// ============================================

window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 10) {
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// ============================================
// LAZY LOADING DE IMAGENS
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ============================================
// CARROSSEL SOBRE (CORRIGIDO COM INDICADORES DINÂMICOS)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const carouselTrack = document.querySelector('.carousel-track');
    if (!carouselTrack) return;
    
    const slides = Array.from(carouselTrack.children);
    const nextButton = document.querySelector('.carousel-btn-next');
    const prevButton = document.querySelector('.carousel-btn-prev');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    // Calcula quantos slides mostrar por vez
    function getSlidesPerView() {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 992) return 2;
        return 3;
    }
    
    // Calcula o número de indicadores necessários
    function getTotalIndicators() {
        const slidesPerView = getSlidesPerView();
        // Número de grupos possíveis = totalSlides - slidesPerView + 1
        // Mas não pode ser menor que 1
        return Math.max(1, totalSlides - slidesPerView + 1);
    }
    
    // Cria ou atualiza os indicadores
    function updateIndicators() {
        const totalIndicators = getTotalIndicators();
        const currentIndicators = indicatorsContainer.querySelectorAll('.indicator');
        
        // Remove indicadores antigos se não forem mais necessários
        if (currentIndicators.length > totalIndicators) {
            for (let i = totalIndicators; i < currentIndicators.length; i++) {
                currentIndicators[i].remove();
            }
        }
        
        // Adiciona novos indicadores se necessário
        for (let i = currentIndicators.length; i < totalIndicators; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'indicator';
            indicator.setAttribute('data-slide', i);
            indicator.setAttribute('aria-label', `Ir para slide ${i + 1}`);
            
            if (i === 0) {
                indicator.classList.add('active');
            }
            
            indicator.addEventListener('click', () => {
                goToSlide(i);
            });
            
            indicatorsContainer.appendChild(indicator);
        }
        
        // Atualiza a classe active
        const indicators = indicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((indicator, i) => {
            if (i === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // Atualiza o carrossel
    function updateCarousel() {
        const slidesPerView = getSlidesPerView();
        const maxIndex = Math.max(0, totalSlides - slidesPerView);
        
        // Ajusta o currentIndex se necessário
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
        
        const slideWidth = slides[0].offsetWidth + 20; // + gap
        const translateX = -currentIndex * slideWidth;
        carouselTrack.style.transform = `translateX(${translateX}px)`;
        
        updateIndicators();
    }
    
    // Move para um slide específico
    function goToSlide(index) {
        const slidesPerView = getSlidesPerView();
        const maxIndex = Math.max(0, totalSlides - slidesPerView);
        
        if (index < 0) {
            currentIndex = maxIndex;
        } else if (index > maxIndex) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        
        updateCarousel();
    }
    
    // Event listeners
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
        });
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
        });
    }
    
    // Redimensionamento da janela
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateIndicators();
            updateCarousel();
        }, 250);
    });
    
    // Inicializa
    updateIndicators();
    updateCarousel();

    // Touch / Drag support for mobile and pointer devices
    let isDragging = false;
    let startPosition = 0;
    const threshold = 50; // mínimo em px para considerar swipe

    const getSlideWidth = () => slides[0].offsetWidth + 20; // usado no drag

    // --- Touch events (mobile) ---
    carouselTrack.addEventListener('touchstart', touchStart, { passive: true });
    carouselTrack.addEventListener('touchmove', touchMove, { passive: true });
    carouselTrack.addEventListener('touchend', touchEnd);

    function touchStart(e) {
        if (!e.touches || e.touches.length === 0) return;
        startPosition = e.touches[0].clientX;
        isDragging = true;
        carouselTrack.style.transition = 'none';
        carouselTrack.classList.add('dragging');
    }

    function touchMove(e) {
        if (!isDragging || !e.touches || e.touches.length === 0) return;
        const currentPosition = e.touches[0].clientX;
        const diff = currentPosition - startPosition;
        const base = -currentIndex * getSlideWidth();
        carouselTrack.style.transform = `translateX(${base + diff}px)`;
    }

    function touchEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        carouselTrack.style.transition = 'transform 0.5s ease-in-out';
        carouselTrack.classList.remove('dragging');
        const endX = (e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientX) || startPosition;
        const diff = endX - startPosition;
        if (Math.abs(diff) > threshold) {
            if (diff < 0) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex - 1);
            }
        } else {
            updateCarousel();
        }
    }

    // --- Pointer events (mouse / stylus) ---
    carouselTrack.addEventListener('pointerdown', pointerDown);
    window.addEventListener('pointerup', pointerUp);
    carouselTrack.addEventListener('pointermove', pointerMove);
    carouselTrack.addEventListener('pointerleave', pointerLeave);

    function pointerDown(e) {
        // apenas botão esquerdo do mouse
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        startPosition = e.clientX;
        isDragging = true;
        try { carouselTrack.setPointerCapture(e.pointerId); } catch (err) {}
        carouselTrack.style.transition = 'none';
        carouselTrack.classList.add('dragging');
    }

    function pointerMove(e) {
        if (!isDragging) return;
        const currentPosition = e.clientX;
        const diff = currentPosition - startPosition;
        const base = -currentIndex * getSlideWidth();
        carouselTrack.style.transform = `translateX(${base + diff}px)`;
    }

    function pointerUp(e) {
        if (!isDragging) return;
        isDragging = false;
        try { carouselTrack.releasePointerCapture(e.pointerId); } catch (err) {}
        carouselTrack.style.transition = 'transform 0.5s ease-in-out';
        carouselTrack.classList.remove('dragging');
        const endX = e.clientX || startPosition;
        const diff = endX - startPosition;
        if (Math.abs(diff) > threshold) {
            if (diff < 0) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex - 1);
            }
        } else {
            updateCarousel();
        }
    }

    function pointerLeave(e) {
        if (!isDragging) return;
        pointerUp(e);
    }
});

// ============================================
// MELHORIAS PARA O CARROSSEL
// ============================================

// Preload de imagens do carrossel para evitar flicker
function preloadCarouselImages() {
    const carouselImages = document.querySelectorAll('.sobre-card-image img');
    carouselImages.forEach(img => {
        if (!img.complete) {
            img.classList.add('loading');
            img.addEventListener('load', function() {
                this.classList.remove('loading');
            });
            // Fallback caso a imagem falhe ao carregar
            img.addEventListener('error', function() {
                this.classList.remove('loading');
                console.warn('Imagem do carrossel não carregou:', this.src);
            });
        }
    });
}

// Keyboard navigation para o carrossel
document.addEventListener('keydown', function(e) {
    const carousel = document.querySelector('.sobre-carousel');
    if (!carousel) return;
    
    // Verifica se o carrossel está visível na tela
    const carouselRect = carousel.getBoundingClientRect();
    if (carouselRect.top < window.innerHeight && carouselRect.bottom > 0) {
        if (e.key === 'ArrowLeft') {
            document.querySelector('.carousel-btn-prev')?.click();
        } else if (e.key === 'ArrowRight') {
            document.querySelector('.carousel-btn-next')?.click();
        }
    }
});

// Inicializa as melhorias quando o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    preloadCarouselImages();
});

// ============================================
// CONSOLE LOG
// ============================================

console.log('Dayane Marley - Site carregado com sucesso!');
