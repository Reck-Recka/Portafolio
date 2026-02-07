/* ======================================================
   PORTAFOLIO — script.js
   Estable, performante, responsive
====================================================== */

(() => {
    'use strict';

    /* --------------------------------------------------
       ENTORNO
    -------------------------------------------------- */
    const ENV = {
        isMobile: window.innerWidth <= 768,
        finePointer: matchMedia('(pointer: fine)').matches,
        reduceMotion: matchMedia('(prefers-reduced-motion: reduce)').matches
    };

    // Update on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ENV.isMobile = window.innerWidth <= 768;
        }, 200);
    });

    /* --------------------------------------------------
       UTILIDADES
    -------------------------------------------------- */
    const lerp = (a, b, t) => a + (b - a) * t;
    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

    /* --------------------------------------------------
       ESTADO GLOBAL
    -------------------------------------------------- */
    const state = {
        scrollY: window.scrollY,
        mouseX: window.innerWidth / 2,
        mouseY: window.innerHeight / 2,
        cursorX: window.innerWidth / 2,
        cursorY: window.innerHeight / 2,
        followerX: window.innerWidth / 2,
        followerY: window.innerHeight / 2,
        rafId: null,
        isRunning: false
    };

    /* --------------------------------------------------
       SCROLL LISTENER
    -------------------------------------------------- */
    window.addEventListener('scroll', () => {
        state.scrollY = window.scrollY;
        startLoop();
    }, { passive: true });

    /* --------------------------------------------------
       CURSOR PERSONALIZADO (solo desktop + pointer fine)
    -------------------------------------------------- */
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const useCursor = !ENV.isMobile && ENV.finePointer && !ENV.reduceMotion && cursor && follower;

    if (useCursor) {
        document.addEventListener('mousemove', e => {
            state.mouseX = e.clientX;
            state.mouseY = e.clientY;
            cursor.style.opacity = '1';
            follower.style.opacity = '1';
            startLoop();
        }, { passive: true });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            follower.style.opacity = '0';
        });

        // Hover effect on interactive elements
        const interactives = document.querySelectorAll('a, button, input[type="submit"], input[type="reset"], .card, .tech-icon, .social-link');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '14px';
                cursor.style.height = '14px';
                follower.style.width = '50px';
                follower.style.height = '50px';
                follower.style.borderColor = 'rgba(59, 130, 246, 0.6)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '8px';
                cursor.style.height = '8px';
                follower.style.width = '36px';
                follower.style.height = '36px';
                follower.style.borderColor = 'rgba(59, 130, 246, 0.4)';
            });
        });
    }

    /* --------------------------------------------------
       HEADER SCROLL
    -------------------------------------------------- */
    const header = document.getElementById('header');

    function updateHeader() {
        if (!header) return;
        header.classList.toggle('scrolled', state.scrollY > 60);
    }

    /* --------------------------------------------------
       MOBILE MENU
    -------------------------------------------------- */
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navOverlay = document.getElementById('navOverlay');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('open');
            menuToggle.classList.toggle('open', isOpen);
            navOverlay?.classList.toggle('visible', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        navOverlay?.addEventListener('click', closeMenu);

        // Close menu on nav link click
        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    function closeMenu() {
        nav?.classList.remove('open');
        menuToggle?.classList.remove('open');
        navOverlay?.classList.remove('visible');
        document.body.style.overflow = '';
    }

    /* --------------------------------------------------
       ACTIVE NAV LINK
    -------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollPos = state.scrollY + window.innerHeight * 0.4;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }

    /* --------------------------------------------------
       SCROLL PROGRESS
    -------------------------------------------------- */
    const progress = document.querySelector('.scroll-progress');

    function updateProgress() {
        if (!progress) return;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (max <= 0) return;
        progress.style.width = `${(state.scrollY / max) * 100}%`;
    }

    /* --------------------------------------------------
       REVEAL ANIMATIONS (IntersectionObserver)
    -------------------------------------------------- */
    if (!ENV.reduceMotion) {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-text, .card').forEach(el => {
            revealObserver.observe(el);
        });

        // Tech icons with staggered delay
        const techObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const icons = entry.target.querySelectorAll('.tech-icon');
                    icons.forEach((icon, i) => {
                        setTimeout(() => icon.classList.add('active'), i * 80);
                    });
                    techObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.tech-icons, .tech-footer').forEach(container => {
            techObserver.observe(container);
        });
    } else {
        // If reduced motion, show everything immediately
        document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-text, .card, .tech-icon').forEach(el => {
            el.classList.add('active');
        });
    }

    /* --------------------------------------------------
       CONTACT FORM → LinkedIn redirect
    -------------------------------------------------- */
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            window.open('https://www.linkedin.com/in/david-pérez-sillero-2b39602bb', '_blank');
        });
    }

    /* --------------------------------------------------
       MAIN ANIMATION LOOP (RAF)
    -------------------------------------------------- */
    function startLoop() {
        if (state.isRunning) return;
        state.isRunning = true;
        loop();
    }

    function loop() {
        updateHeader();
        updateProgress();
        updateActiveNav();

        // Smooth cursor
        if (useCursor) {
            state.cursorX = state.mouseX;
            state.cursorY = state.mouseY;
            state.followerX = lerp(state.followerX, state.mouseX, 0.12);
            state.followerY = lerp(state.followerY, state.mouseY, 0.12);

            cursor.style.left = `${state.cursorX}px`;
            cursor.style.top = `${state.cursorY}px`;
            follower.style.left = `${state.followerX}px`;
            follower.style.top = `${state.followerY}px`;

            // Keep running while follower is catching up
            const dx = Math.abs(state.followerX - state.mouseX);
            const dy = Math.abs(state.followerY - state.mouseY);

            if (dx > 0.5 || dy > 0.5) {
                state.rafId = requestAnimationFrame(loop);
                return;
            }
        }

        state.isRunning = false;
    }

    /* --------------------------------------------------
       SMOOTH SCROLL for hash links (Safari fallback)
    -------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* --------------------------------------------------
       INIT
    -------------------------------------------------- */
    updateHeader();
    updateProgress();
    startLoop();

    console.log('%c✔ Portfolio JS loaded', 'color:#3b82f6;font-weight:bold');

 /*--------------------------------------------------
        Año Footer
    -------------------------------------------------- */
    document.getElementById("year").textContent = new Date().getFullYear();

    /*--------------------------------------------------
        API
    -------------------------------------------------- */
    const token = "TU_HUGGINGFACE_API_KEY_AQUI"; // CAMBIA ESTO
    const model = "gpt-j-6B"; // o similar disponible gratis

    const input = document.getElementById("chat-input");
    const msgs  = document.getElementById("messages");

    input.addEventListener("keydown", async (e) => {
        if (e.key === "Enter" && input.value.trim()) {
        const userText = input.value;
        appendMessage("user", userText);

        input.value = "";
        appendMessage("bot", "…pensando…");

        const response = await fetch(
            `https://api.huggingface.co/models/${model}`,
            {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: userText })
            }
        );

        const data = await response.json();
        const botText = data.generated_text || "No hay respuesta…";

        // quita el mensaje de “pensando”
        const playing = msgs.querySelector(".bot:last-child");
        if (playing) playing.remove();

        appendMessage("bot", botText);
        }
    });

    function appendMessage(cls, text) {
        const div = document.createElement("div");
        div.classList.add("message", cls);
        div.textContent = text;
        msgs.appendChild(div);
        msgs.scrollTop = msgs.scrollHeight;
    }



})();