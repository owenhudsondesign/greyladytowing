/**
 * Grey Lady Towing & Roadside
 * Main JavaScript File
 */

(function() {
    'use strict';

    // DOM Elements
    const header = document.getElementById('header');
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const contactForm = document.getElementById('contactForm');

    // Header scroll effect
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Mobile navigation toggle
    function toggleNav() {
        nav.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    }

    // Close nav when clicking a link
    function closeNavOnClick(e) {
        if (e.target.tagName === 'A') {
            nav.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    }

    // Close nav when clicking outside
    function closeNavOnOutsideClick(e) {
        if (nav.classList.contains('active') &&
            !nav.contains(e.target) &&
            !navToggle.contains(e.target)) {
            nav.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    }

    // Smooth scroll for anchor links
    function smoothScroll(e) {
        const href = e.currentTarget.getAttribute('href');

        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }

    // Contact form handling
    function handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // Basic validation
        if (!data.name || !data.email || !data.message) {
            alert('Please fill in all required fields.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // In a real implementation, this would send to a server
        // For now, we'll create a mailto link as a fallback
        const subject = encodeURIComponent(`Website Contact: ${data.subject || 'General Inquiry'}`);
        const body = encodeURIComponent(
            `Name: ${data.name}\n` +
            `Email: ${data.email}\n` +
            `Phone: ${data.phone || 'Not provided'}\n\n` +
            `Message:\n${data.message}`
        );

        window.location.href = `mailto:beachtow02554@gmail.com?subject=${subject}&body=${body}`;

        // Show success message
        alert('Thank you for your message! Your email client should open with the message ready to send.');
        contactForm.reset();
    }

    // Stop pulse animation after it plays
    function stopPulseAnimation() {
        const pulseElements = document.querySelectorAll('.pulse');
        pulseElements.forEach(el => {
            setTimeout(() => {
                el.classList.remove('pulse');
            }, 6000); // 3 iterations at 2s each
        });
    }

    // Lazy load images
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    // Animate elements on scroll
    function animateOnScroll() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                    }
                });
            }, {
                rootMargin: '0px 0px -50px 0px',
                threshold: 0.1
            });

            animatedElements.forEach(el => animationObserver.observe(el));
        } else {
            // Fallback
            animatedElements.forEach(el => el.classList.add('animated'));
        }
    }

    // Track call clicks (for analytics)
    function trackCallClicks() {
        const callLinks = document.querySelectorAll('a[href^="tel:"]');

        callLinks.forEach(link => {
            link.addEventListener('click', function() {
                // If Google Analytics is present
                if (typeof gtag === 'function') {
                    gtag('event', 'click', {
                        'event_category': 'Contact',
                        'event_label': 'Phone Call',
                        'value': 1
                    });
                }

                // Console log for debugging
                console.log('Call click tracked');
            });
        });
    }

    // Initialize
    function init() {
        // Event listeners
        window.addEventListener('scroll', handleScroll, { passive: true });

        if (navToggle) {
            navToggle.addEventListener('click', toggleNav);
        }

        if (nav) {
            nav.addEventListener('click', closeNavOnClick);
        }

        document.addEventListener('click', closeNavOnOutsideClick);

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', smoothScroll);
        });

        // Contact form
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }

        // Initialize features
        handleScroll(); // Set initial state
        stopPulseAnimation();
        lazyLoadImages();
        animateOnScroll();
        trackCallClicks();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
