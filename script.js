/**
 * New Gopal Motor Driving Training School
 * Premium JavaScript with Automotive-Inspired Animations
 * 
 * Features:
 * - IntersectionObserver for scroll-triggered animations
 * - Animated stat counters (odometer-style)
 * - Scroll progress indicator
 * - Performance-safe event handling
 * - Reduced motion support
 */

(function() {
    'use strict';

    // ============================================
    // Configuration
    // ============================================
    const CONFIG = {
        animation: {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
            staggerDelay: 100
        },
        counter: {
            duration: 2000,
            easing: 'easeOutQuart'
        },
        scroll: {
            throttleDelay: 16 // ~60fps
        }
    };

    // ============================================
    // DOM Element References
    // ============================================
    const elements = {
        navbar: document.getElementById('navbar'),
        mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
        navMenu: document.querySelector('.nav-menu'),
        navLinks: document.querySelectorAll('.nav-menu a'),
        contactForm: document.getElementById('contactForm'),
        faqQuestions: document.querySelectorAll('.faq-question'),
        scrollProgressBar: document.querySelector('.scroll-progress-bar'),
        animatedElements: document.querySelectorAll('[data-animate]'),
        statNumbers: document.querySelectorAll('.stat-number[data-count]'),
        ratingNumber: document.querySelector('.rating-number[data-count]')
    };

    // ============================================
    // Utility Functions
    // ============================================
    
    /**
     * Throttle function for performance optimization
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if user prefers reduced motion
     */
    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Easing functions for animations
     */
    const easings = {
        easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
        easeOutExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
        easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    };

    // ============================================
    // Scroll Progress Indicator
    // ============================================
    function initScrollProgress() {
        if (!elements.scrollProgressBar) return;
        
        const updateProgress = throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            elements.scrollProgressBar.style.width = progress + '%';
        }, CONFIG.scroll.throttleDelay);

        window.addEventListener('scroll', updateProgress, { passive: true });
    }

    // ============================================
    // Navigation Scroll Effect
    // ============================================
    function initNavbarScroll() {
        if (!elements.navbar) return;

        const handleScroll = throttle(() => {
            const scrolled = window.scrollY > 50;
            elements.navbar.classList.toggle('scrolled', scrolled);
        }, CONFIG.scroll.throttleDelay);

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    }

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    function initMobileMenu() {
        if (!elements.mobileMenuBtn || !elements.navMenu) return;

        function toggleMobileMenu() {
            elements.mobileMenuBtn.classList.toggle('active');
            elements.navMenu.classList.toggle('active');
            
            const isExpanded = elements.navMenu.classList.contains('active');
            elements.mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        }

        elements.mobileMenuBtn.addEventListener('click', toggleMobileMenu);

        // Close menu when clicking a link
        elements.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                elements.mobileMenuBtn.classList.remove('active');
                elements.navMenu.classList.remove('active');
                elements.mobileMenuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!elements.navMenu.contains(e.target) && !elements.mobileMenuBtn.contains(e.target)) {
                elements.mobileMenuBtn.classList.remove('active');
                elements.navMenu.classList.remove('active');
                elements.mobileMenuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (!target) return;
                
                e.preventDefault();
                
                const navHeight = elements.navbar ? elements.navbar.offsetHeight : 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: prefersReducedMotion() ? 'auto' : 'smooth'
                });
            });
        });
    }

    // ============================================
    // Active Navigation Link on Scroll
    // ============================================
    function initActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        if (!sections.length) return;

        const updateActiveLink = throttle(() => {
            const scrollPosition = window.scrollY + 150;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    elements.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, CONFIG.scroll.throttleDelay);

        window.addEventListener('scroll', updateActiveLink, { passive: true });
        updateActiveLink(); // Initial check
    }

    // ============================================
    // IntersectionObserver for Scroll Animations
    // ============================================
    function initScrollAnimations() {
        if (prefersReducedMotion()) {
            // Show all elements immediately if reduced motion is preferred
            elements.animatedElements.forEach(el => {
                el.classList.add('animated');
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }

        const observerOptions = {
            threshold: CONFIG.animation.threshold,
            rootMargin: CONFIG.animation.rootMargin
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, parseInt(delay));
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        elements.animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // ============================================
    // Animated Counter (Odometer-style)
    // ============================================
    function animateCounter(element, target, duration = CONFIG.counter.duration, decimals = 0) {
        const startTime = performance.now();
        const startValue = 0;
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easings.easeOutQuart(progress);
            const currentValue = startValue + (target - startValue) * easedProgress;
            
            if (decimals > 0) {
                element.textContent = currentValue.toFixed(decimals);
            } else {
                element.textContent = Math.floor(currentValue).toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    function initCounters() {
        if (prefersReducedMotion()) {
            // Set final values immediately
            elements.statNumbers.forEach(stat => {
                const target = parseInt(stat.dataset.count);
                const decimals = parseInt(stat.dataset.decimals) || 0;
                stat.textContent = decimals > 0 ? target.toFixed(decimals) : target.toLocaleString();
            });
            
            if (elements.ratingNumber) {
                const target = parseFloat(elements.ratingNumber.dataset.count);
                const decimals = parseInt(elements.ratingNumber.dataset.decimals) || 0;
                elements.ratingNumber.textContent = target.toFixed(decimals);
            }
            return;
        }

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseFloat(entry.target.dataset.count);
                    const decimals = parseInt(entry.target.dataset.decimals) || 0;
                    animateCounter(entry.target, target, CONFIG.counter.duration, decimals);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        elements.statNumbers.forEach(stat => counterObserver.observe(stat));
        
        if (elements.ratingNumber) {
            counterObserver.observe(elements.ratingNumber);
        }
    }

    // ============================================
    // FAQ Accordion
    // ============================================
    function initFAQ() {
        if (!elements.faqQuestions.length) return;

        elements.faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const answer = this.nextElementSibling;
                const isActive = this.classList.contains('active');
                
                // Close all other answers
                elements.faqQuestions.forEach(q => {
                    q.classList.remove('active');
                    const ans = q.nextElementSibling;
                    if (ans) ans.classList.remove('show');
                });
                
                // Toggle current answer
                if (!isActive) {
                    this.classList.add('active');
                    if (answer) answer.classList.add('show');
                }
            });
        });
    }

    // ============================================
    // Contact Form Validation
    // ============================================
    function initFormValidation() {
        if (!elements.contactForm) return;

        const fields = {
            name: document.getElementById('name'),
            phone: document.getElementById('phone'),
            course: document.getElementById('course'),
            message: document.getElementById('message')
        };

        function validateField(field, validationFn) {
            if (!field) return true;
            
            const errorElement = field.parentElement.querySelector('.error-message');
            if (!errorElement) return true;
            
            const result = validationFn(field.value);
            
            if (!result.isValid) {
                field.classList.add('error');
                errorElement.textContent = result.message;
                return false;
            } else {
                field.classList.remove('error');
                errorElement.textContent = '';
                return true;
            }
        }

        function validateName(value) {
            if (!value.trim()) {
                return { isValid: false, message: 'Please enter your full name' };
            }
            if (value.trim().length < 2) {
                return { isValid: false, message: 'Name must be at least 2 characters' };
            }
            if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
                return { isValid: false, message: 'Name should only contain letters' };
            }
            return { isValid: true, message: '' };
        }

        function validatePhone(value) {
            if (!value.trim()) {
                return { isValid: false, message: 'Please enter your phone number' };
            }
            const phoneRegex = /^[6-9]\d{9}$/;
            const cleanedPhone = value.replace(/\D/g, '');
            
            if (!phoneRegex.test(cleanedPhone)) {
                return { isValid: false, message: 'Please enter a valid 10-digit phone number' };
            }
            return { isValid: true, message: '' };
        }

        function validateCourse(value) {
            if (!value) {
                return { isValid: false, message: 'Please select a course type' };
            }
            return { isValid: true, message: '' };
        }

        function validateMessage(value) {
            if (value.trim().length > 500) {
                return { isValid: false, message: 'Message should be less than 500 characters' };
            }
            return { isValid: true, message: '' };
        }

        // Real-time validation on blur
        if (fields.name) {
            fields.name.addEventListener('blur', () => validateField(fields.name, validateName));
            fields.name.addEventListener('input', () => {
                if (fields.name.classList.contains('error')) {
                    validateField(fields.name, validateName);
                }
            });
        }

        if (fields.phone) {
            fields.phone.addEventListener('blur', () => validateField(fields.phone, validatePhone));
            fields.phone.addEventListener('input', () => {
                if (fields.phone.classList.contains('error')) {
                    validateField(fields.phone, validatePhone);
                }
            });
        }

        if (fields.course) {
            fields.course.addEventListener('change', () => validateField(fields.course, validateCourse));
        }

        if (fields.message) {
            fields.message.addEventListener('blur', () => validateField(fields.message, validateMessage));
            fields.message.addEventListener('input', () => {
                if (fields.message.classList.contains('error')) {
                    validateField(fields.message, validateMessage);
                }
            });
        }

        // Form submission
        elements.contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const isNameValid = validateField(fields.name, validateName);
            const isPhoneValid = validateField(fields.phone, validatePhone);
            const isCourseValid = validateField(fields.course, validateCourse);
            const isMessageValid = validateField(fields.message, validateMessage);
            
            if (isNameValid && isPhoneValid && isCourseValid && isMessageValid) {
                const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                // Success animation
                submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>Sent!</span>';
                submitBtn.style.background = '#27ae60';
                submitBtn.disabled = true;
                
                elements.contactForm.reset();
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
                
                // Show success message
                showNotification('Thank you for your enquiry! We will contact you shortly.', 'success');
            } else {
                const firstError = elements.contactForm.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ 
                        behavior: prefersReducedMotion() ? 'auto' : 'smooth', 
                        block: 'center' 
                    });
                    firstError.focus();
                }
            }
        });
    }

    // ============================================
    // Notification System
    // ============================================
    function showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : 'var(--primary-color)'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            transform: translateX(150%);
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    }

    // ============================================
    // Scroll to Top Button
    // ============================================
    function initScrollToTop() {
        const scrollBtn = document.createElement('button');
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollBtn.className = 'scroll-top-btn';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 45px;
            height: 45px;
            background: var(--primary-color, #0A3D62);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 998;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(scrollBtn);
        
        const toggleVisibility = throttle(() => {
            const shouldShow = window.scrollY > 500;
            scrollBtn.style.opacity = shouldShow ? '1' : '0';
            scrollBtn.style.visibility = shouldShow ? 'visible' : 'hidden';
            scrollBtn.style.transform = shouldShow ? 'translateY(0)' : 'translateY(20px)';
        }, CONFIG.scroll.throttleDelay);
        
        window.addEventListener('scroll', toggleVisibility, { passive: true });
        
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion() ? 'auto' : 'smooth'
            });
        });
        
        scrollBtn.addEventListener('mouseenter', () => {
            scrollBtn.style.background = '#F39C12';
            scrollBtn.style.transform = 'translateY(-3px)';
        });
        
        scrollBtn.addEventListener('mouseleave', () => {
            scrollBtn.style.background = '#0A3D62';
            scrollBtn.style.transform = 'translateY(0)';
        });
    }

    // ============================================
    // Gallery Lightbox
    // ============================================
    function initGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                if (img) {
                    window.open(img.src, '_blank');
                }
            });
        });
    }

    // ============================================
    // Performance Monitor (Development)
    // ============================================
    function initPerformanceMonitor() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // Log performance metrics in development
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = window.performance.timing;
                    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                    console.log(`%c⚡ Page load time: ${pageLoadTime}ms`, 'color: #F39C12; font-weight: bold;');
                }, 0);
            });
        }
    }

    // ============================================
    // Initialize All Modules
    // ============================================
    function init() {
        initScrollProgress();
        initNavbarScroll();
        initMobileMenu();
        initSmoothScroll();
        initActiveNavLink();
        initScrollAnimations();
        initCounters();
        initFAQ();
        initFormValidation();
        initScrollToTop();
        initGallery();
        initPerformanceMonitor();

        // Console welcome message
        console.log('%c🚗 New Gopal Motor Driving Training School', 'color: #F39C12; font-size: 20px; font-weight: bold;');
        console.log('%cGovernment Approved Driving School in Rohini | 30+ Years Experience', 'color: #0A3D62; font-size: 14px;');
        
        if (prefersReducedMotion()) {
            console.log('%cℹ️ Reduced motion preference detected - animations disabled', 'color: #666; font-style: italic;');
        }
    }

    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
