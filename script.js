/**
 * New Gopal Motor Driving Training School
 * Main JavaScript File
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const contactForm = document.getElementById('contactForm');
    const faqQuestions = document.querySelectorAll('.faq-question');

    // ============================================
    // Navigation Scroll Effect
    // ============================================
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Initial check

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    function toggleMobileMenu() {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Update ARIA attribute
        const isExpanded = navMenu.classList.contains('active');
        mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
    }

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // ============================================
    // Smooth Scroll for Navigation Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Active Navigation Link on Scroll
    // ============================================
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial check

    // ============================================
    // FAQ Accordion
    // ============================================
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Close all other answers
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('show');
            });
            
            // Toggle current answer
            if (!isActive) {
                this.classList.add('active');
                answer.classList.add('show');
            }
        });
    });

    // ============================================
    // Contact Form Validation
    // ============================================
    function validateField(field, validationFn) {
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
        // Indian phone number format
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
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const courseSelect = document.getElementById('course');
    const messageTextarea = document.getElementById('message');

    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            validateField(this, validateName);
        });
        
        nameInput.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this, validateName);
            }
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            validateField(this, validatePhone);
        });
        
        phoneInput.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this, validatePhone);
            }
        });
    }

    if (courseSelect) {
        courseSelect.addEventListener('change', function() {
            validateField(this, validateCourse);
        });
    }

    if (messageTextarea) {
        messageTextarea.addEventListener('blur', function() {
            validateField(this, validateMessage);
        });
        
        messageTextarea.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this, validateMessage);
            }
        });
    }

    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            const isNameValid = validateField(nameInput, validateName);
            const isPhoneValid = validateField(phoneInput, validatePhone);
            const isCourseValid = validateField(courseSelect, validateCourse);
            const isMessageValid = validateField(messageTextarea, validateMessage);
            
            // Check if all fields are valid
            if (isNameValid && isPhoneValid && isCourseValid && isMessageValid) {
                // Show success message (in production, you would send data to server)
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                submitBtn.style.background = '#27ae60';
                
                // Reset form
                contactForm.reset();
                
                // Show success alert
                alert('Thank you for your enquiry! We will contact you shortly.');
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                }, 3000);
            } else {
                // Scroll to first error
                const firstError = contactForm.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
            }
        });
    }

    // ============================================
    // Lazy Loading for Images
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // Gallery Lightbox (Simple Version)
    // ============================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                // In production, you would create a modal lightbox here
                // For now, we'll just open the image in a new tab
                window.open(img.src, '_blank');
            }
        });
    });

    // ============================================
    // Scroll to Top Button (Optional Enhancement)
    // ============================================
    function createScrollTopButton() {
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
            transition: all 0.3s ease;
            z-index: 998;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(scrollBtn);
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.visibility = 'visible';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.visibility = 'hidden';
            }
        });
        
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        scrollBtn.addEventListener('mouseenter', () => {
            scrollBtn.style.background = '#F39C12';
        });
        
        scrollBtn.addEventListener('mouseleave', () => {
            scrollBtn.style.background = '#0A3D62';
        });
    }

    createScrollTopButton();

    // ============================================
    // Add Loading Animation to Elements on Scroll
    // ============================================
    function addScrollAnimations() {
        const animatedElements = document.querySelectorAll('.course-card, .why-us-card, .trainer-card, .review-card, .pricing-card');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered animation delay
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Set initial state
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            animationObserver.observe(el);
        });
    }

    // ============================================
    // Preloader (Optional Enhancement)
    // ============================================
    function addPageLoader() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #0A3D62;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        `;
        
        const loaderContent = document.createElement('div');
        loaderContent.style.cssText = `
            text-align: center;
        `;
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-car-side';
        icon.style.cssText = `
            font-size: 3rem;
            color: #F39C12;
            animation: drive 1s ease-in-out infinite;
        `;
        
        const text = document.createElement('p');
        text.textContent = 'Loading...';
        text.style.cssText = `
            color: white;
            margin-top: 20px;
            font-size: 1.1rem;
        `;
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes drive {
                0%, 100% { transform: translateX(-20px); }
                50% { transform: translateX(20px); }
            }
        `;
        
        loaderContent.appendChild(icon);
        loaderContent.appendChild(text);
        loader.appendChild(loaderContent);
        document.head.appendChild(style);
        document.body.appendChild(loader);
        
        window.addEventListener('load', () => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        });
    }

    // Uncomment the line below to enable page loader
    // addPageLoader();

    // Initialize scroll animations
    addScrollAnimations();

    // ============================================
    // Console Welcome Message
    // ============================================
    console.log('%c🚗 New Gopal Motor Driving Training School', 'color: #F39C12; font-size: 20px; font-weight: bold;');
    console.log('%cGovernment Approved Driving School in Rohini | 30+ Years Experience', 'color: #0A3D62; font-size: 14px;');

})();
