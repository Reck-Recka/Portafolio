// ==================== CURSOR PERSONALIZADO ====================
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 100);
});

// Agrandar cursor en hover de elementos interactivos
const interactiveElements = document.querySelectorAll('a, button, input, .card, .tech-icon');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursorFollower.style.transform = 'scale(1.5)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
    });
});

// ==================== HEADER SCROLL ====================
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ==================== SMOOTH SCROLL PARA LINKS DE NAVEGACIÓN ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== EFECTO DE CAPAS 3D AL HACER SCROLL (ESTILO APPLE/GOOGLE) ====================
class LayeredScrollEffect {
    constructor() {
        this.sections = document.querySelectorAll('.parallax-section');
        this.currentSection = 0;
        this.isScrolling = false;
        this.lastScrollTop = 0;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        // Inicializar posiciones
        this.update();
    }
    
    handleScroll() {
        if (!this.isScrolling) {
            window.requestAnimationFrame(() => {
                this.update();
                this.isScrolling = false;
            });
            this.isScrolling = true;
        }
    }
    
    update() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        this.sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionHeight = rect.height;
            const sectionBottom = rect.bottom;
            
            // Calcular el progreso de scroll de la sección
            const scrollProgress = (windowHeight - sectionTop) / (windowHeight + sectionHeight);
            
            // EFECTO DE DESPEGUE Y SUPERPOSICIÓN 3D
            if (sectionTop < 0 && sectionBottom > 0) {
                // La sección está siendo cubierta por la siguiente
                const coverProgress = Math.abs(sectionTop) / windowHeight;
                
                // Escala progresiva (se hace más pequeña)
                const scale = Math.max(0.80, 1 - coverProgress * 0.20);
                
                // Profundidad Z (se aleja)
                const translateZ = Math.min(-150, coverProgress * -250);
                
                // Rotación en X (efecto de despegue)
                const rotateX = Math.min(15, coverProgress * 20);
                
                // Brillo (se oscurece)
                const brightness = Math.max(0.5, 1 - coverProgress * 0.5);
                
                // Blur de profundidad de campo
                const blur = Math.min(5, coverProgress * 8);
                
                section.style.transform = `
                    scale(${scale}) 
                    translateZ(${translateZ}px) 
                    rotateX(${rotateX}deg)
                `;
                section.style.filter = `brightness(${brightness}) blur(${blur}px)`;
                section.style.borderRadius = `${Math.min(30, coverProgress * 40)}px`;
                section.classList.add('scaling');
                
                // Aplicar transformación al contenido interno para efecto parallax
                const content = section.children;
                Array.from(content).forEach((child, childIndex) => {
                    const depth = (childIndex + 1) * 10;
                    child.style.transform = `translateZ(${depth - coverProgress * depth * 2}px)`;
                });
                
            } else if (sectionTop >= 0) {
                // La sección está por entrar o es visible
                section.style.transform = 'scale(1) translateZ(0) rotateX(0deg)';
                section.style.filter = 'brightness(1) blur(0px)';
                section.style.borderRadius = '0px';
                section.classList.remove('scaling');
                
                // Reset de transformaciones del contenido
                const content = section.children;
                Array.from(content).forEach(child => {
                    child.style.transform = 'translateZ(0)';
                });
                
            } else if (sectionBottom <= 0) {
                // La sección ya pasó completamente
                section.style.opacity = '0';
                section.style.pointerEvents = 'none';
            } else {
                section.style.opacity = '1';
                section.style.pointerEvents = 'auto';
            }
            
            // Animar el fondo de la sección con parallax vertical
            const bg = section.querySelector('.section-bg, .parallax-bg');
            if (bg && scrollProgress >= -0.2 && scrollProgress <= 1.2) {
                const bgOffset = (scrollProgress - 0.5) * 150;
                const bgScale = 1.1 + (Math.abs(scrollProgress - 0.5) * 0.1);
                bg.style.transform = `translate3d(0, ${bgOffset}px, -50px) scale(${bgScale})`;
            }
        });
        
        this.lastScrollTop = scrollTop;
    }
}

// Inicializar efecto de capas
const layeredScroll = new LayeredScrollEffect();

// ==================== EFECTO 3D DINÁMICO EN TÍTULOS ====================
const sectionTitles = document.querySelectorAll('.section-title');
const titleUnderlines = document.querySelectorAll('.title-underline');

sectionTitles.forEach((title, index) => {
    // Añadir atributo data-text para el efecto de sombra 3D
    title.setAttribute('data-text', title.textContent);
    
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Activar efecto 3D cuando el título es visible
                setTimeout(() => {
                    entry.target.classList.add('active-3d');
                    if (titleUnderlines[index]) {
                        titleUnderlines[index].classList.add('active-3d');
                    }
                    
                    // Animación de letras individuales
                    const text = entry.target.textContent;
                    entry.target.innerHTML = text.split('').map((char, i) => 
                        `<span style="
                            display: inline-block; 
                            animation: letterPop 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.05}s both;
                            transform-style: preserve-3d;
                        ">${char === ' ' ? '&nbsp;' : char}</span>`
                    ).join('');
                }, 200);
            }
        });
    }, { 
        threshold: 0.5,
        rootMargin: '-100px'
    });
    
    titleObserver.observe(title);
});

// Añadir animación de letras
const letterPopStyle = document.createElement('style');
letterPopStyle.textContent = `
    @keyframes letterPop {
        from {
            opacity: 0;
            transform: translateZ(-100px) rotateY(90deg);
        }
        to {
            opacity: 1;
            transform: translateZ(0) rotateY(0deg);
        }
    }
`;
document.head.appendChild(letterPopStyle);

// ==================== PARALLAX MEJORADO CON PROFUNDIDAD 3D ====================
let lastScrollY = 0;
let scrollDirection = 'down';

window.addEventListener('scroll', () => {
    const currentScrollY = window.pageYOffset;
    scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
    lastScrollY = currentScrollY;
    
    const scrolled = window.pageYOffset;
    
    // Parallax para elementos con data-speed
    const parallaxElements = document.querySelectorAll('[data-speed]');
    
    parallaxElements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-speed'));
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrolled;
        
        // Solo aplicar parallax cuando el elemento está cerca del viewport
        if (rect.top < window.innerHeight + 200 && rect.bottom > -200) {
            const yPos = -(scrolled - elementTop) * speed;
            
            // Añadir rotación sutil para más profundidad 3D
            const rotateX = (rect.top - window.innerHeight / 2) / window.innerHeight * 3;
            const rotateY = scrollDirection === 'down' ? -2 : 2;
            
            element.style.transform = `
                translate3d(0, ${yPos}px, 0) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
            `;
        }
    });
});

// ==================== EFECTO DE TRANSICIÓN SUAVE ENTRE SECCIONES ====================
const sections = document.querySelectorAll('.parallax-section');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('entering');
            
            // Añadir animación al contenido interno con delay escalonado
            const content = entry.target.querySelectorAll('.hero-content, .about-content, .cards-container, .contact-container, .tech-grid, .card');
            content.forEach((element, index) => {
                element.style.animation = `fadeInScale 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.1}s both`;
                element.style.transformStyle = 'preserve-3d';
            });
        } else {
            entry.target.classList.remove('entering');
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '-80px'
});

sections.forEach(section => sectionObserver.observe(section));

// ==================== ANIMACIONES AL SCROLL (REVEAL) ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observar elementos con clases de reveal
const revealElements = document.querySelectorAll('.reveal-text, .reveal-up, .reveal-left, .reveal-right');
revealElements.forEach(el => observer.observe(el));

// ==================== EFECTO TILT 3D EN CARDS ====================
const cards = document.querySelectorAll('[data-tilt]');

cards.forEach(card => {
    card.addEventListener('mousemove', handleTilt);
    card.addEventListener('mouseleave', resetTilt);
});

function handleTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
}

function resetTilt(e) {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
}

// ==================== ANIMACIÓN DE ICONOS TECH ====================
const techIcons = document.querySelectorAll('.tech-icon');

techIcons.forEach((icon, index) => {
    // Animación de entrada escalonada
    icon.style.animationDelay = `${index * 0.1}s`;
    
    // Observar para animar al entrar en viewport
    const iconObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInScale 0.6s ease-out ${index * 0.05}s both`;
            }
        });
    }, { threshold: 0.5 });
    
    iconObserver.observe(icon);
});

// Añadir keyframes dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0) rotate(-180deg);
        }
        to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
        }
    }
`;
document.head.appendChild(style);

// ==================== PARTÍCULAS INTERACTIVAS ====================
const particles = document.querySelector('.particles');

// Hacer que las partículas sigan al ratón ligeramente
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
    
    if (particles) {
        particles.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
});

// ==================== ANIMACIÓN DEL TÍTULO HERO ====================
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const titleLines = heroTitle.querySelectorAll('.title-line');
    titleLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            line.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, 200 + (index * 200));
    });
}

// ==================== PARALLAX MEJORADO PARA SECCIONES ====================
class ParallaxSection {
    constructor(element) {
        this.element = element;
        this.speed = 0.5;
        this.offset = 0;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.update());
        this.update();
    }
    
    update() {
        const rect = this.element.getBoundingClientRect();
        const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        
        if (scrollPercent >= 0 && scrollPercent <= 1) {
            this.offset = (scrollPercent - 0.5) * 100 * this.speed;
            
            const bg = this.element.querySelector('.section-bg, .parallax-bg');
            if (bg) {
                bg.style.transform = `translateY(${this.offset}px)`;
            }
        }
    }
}

// Inicializar parallax para todas las secciones
const parallaxSections = document.querySelectorAll('.parallax-section');
parallaxSections.forEach(section => new ParallaxSection(section));

// ==================== EFECTO GLOW EN CARDS ====================
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.left = x + 'px';
            glow.style.top = y + 'px';
        }
    });
});

// ==================== INDICADOR DE PROGRESO DE SCROLL ====================
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--color-green), var(--color-secondary));
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
};

createScrollProgress();

// ==================== ANIMACIÓN DE NÚMEROS (Counter) ====================
const animateCounters = () => {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counterObserver.observe(counter);
    });
};

animateCounters();

// ==================== FUNCIÓN DE REDIRECCIÓN A LINKEDIN ====================
function redirectToLinkedIn(event) {
    event.preventDefault();
    
    // Validar que los campos tengan contenido
    const form = event.target;
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'var(--color-accent)';
            setTimeout(() => {
                input.style.borderColor = 'rgba(0, 255, 136, 0.2)';
            }, 2000);
        }
    });
    
    if (isValid) {
        // Crear modal de confirmación personalizado
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: rgba(26, 26, 46, 0.95);
            backdrop-filter: blur(20px);
            border: 2px solid var(--color-green);
            border-radius: 20px;
            padding: 3rem;
            z-index: 10001;
            text-align: center;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 255, 136, 0.2);
        `;
        
        modal.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">✓</div>
            <h3 style="color: var(--color-green); margin-bottom: 1rem; font-size: 1.5rem;">¡Gracias por tu interés!</h3>
            <p style="color: var(--color-whitelight); margin-bottom: 2rem;">Te redirigimos a LinkedIn en breve...</p>
            <div class="loading-bar" style="width: 100%; height: 4px; background: rgba(0, 255, 136, 0.2); border-radius: 2px; overflow: hidden;">
                <div style="width: 0%; height: 100%; background: var(--color-green); animation: loadBar 2s ease-out forwards;"></div>
            </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        
        // Añadir animación de carga
        const loadBarStyle = document.createElement('style');
        loadBarStyle.textContent = `
            @keyframes loadBar {
                to { width: 100%; }
            }
        `;
        document.head.appendChild(loadBarStyle);
        
        // Animar entrada
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            modal.style.opacity = '1';
            modal.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        // Redireccionar después de 2 segundos
        setTimeout(() => {
            window.open('https://www.linkedin.com/in/david-pérez-sillero-2b39602bb', '_blank');
            
            // Animar salida
            modal.style.opacity = '0';
            modal.style.transform = 'translate(-50%, -50%) scale(0.9)';
            overlay.style.opacity = '0';
            
            setTimeout(() => {
                document.body.removeChild(modal);
                document.body.removeChild(overlay);
                form.reset();
            }, 300);
        }, 2000);
    }
}

// ==================== PERFORMANCE OPTIMIZATION ====================
// Usar requestAnimationFrame para animaciones suaves
let ticking = false;

function onScroll() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Aquí van las funciones de scroll que ya tenemos
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll, { passive: true });

// ==================== LAZY LOADING PARA IMÁGENES ====================
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));

// ==================== INICIALIZACIÓN ====================
console.log('%c🚀 Portafolio Parallax cargado correctamente', 'color: #00ff88; font-size: 16px; font-weight: bold;');
console.log('%c✨ Desarrollado por David Pérez', 'color: #00d4ff; font-size: 12px;');

// Prevenir errores si algún elemento no existe
window.addEventListener('error', (e) => {
    console.warn('Error capturado:', e.message);
}, true);
