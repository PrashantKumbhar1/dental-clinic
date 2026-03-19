/**
 * Dr. Mhatre Dental Clinic
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navigation & Scroll Behavior
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinksList = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileOverlay = document.getElementById('mobile-menu-overlay');
    
    // Handle Sticky Navbar Glassmorphism
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active spy link handling (to be refined when sections are added)
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active');
            }
        });
    });

    // Handle Mobile Menu Toggle
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navLinksList.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = document.body.style.overflow === 'hidden' ? '' : 'hidden';
    }

    hamburger.addEventListener('click', toggleMobileMenu);
    mobileOverlay.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksList.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // 2. Generic Scroll Reveal Animation Observer
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const revealCallback = function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    
    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Hero Word Rotate Animation
    const wordRotateEl = document.getElementById('word-rotate');
    if (wordRotateEl) {
        const words = ['Smile', 'Confidence', 'Health'];
        let wordIndex = 0;

        setInterval(() => {
            wordRotateEl.classList.add('word-rotate-fade-out');
            
            setTimeout(() => {
                wordIndex = (wordIndex + 1) % words.length;
                wordRotateEl.textContent = words[wordIndex];
                wordRotateEl.classList.remove('word-rotate-fade-out');
                wordRotateEl.classList.add('word-rotate-fade-in');
                
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        wordRotateEl.classList.remove('word-rotate-fade-in');
                    });
                });
            }, 400); // Wait for fade out to complete
        }, 3000);
    }

    // 4. Stats Counter Animation
    const counters = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    const runCounters = () => {
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const isDecimal = counter.getAttribute('data-decimal') === 'true';
            const speed = parseInt(counter.getAttribute('data-speed')) || 200; // Lower is faster
            let current = 0;
            const increment = target / speed;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    if (isDecimal) {
                        counter.innerText = current.toFixed(1);
                    } else {
                        counter.innerText = Math.ceil(current);
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = isDecimal ? target.toFixed(1) : target;
                }
            };
            
            updateCounter();
        });
    };

    // Only run counter when the stats section comes into view
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && !hasCounted) {
                runCounters();
                hasCounted = true;
                statsObserver.unobserve(statsSection);
            }
        }, { threshold: 0.1 });
        
        statsObserver.observe(statsSection);
    }

    // 6. Testimonial Carousel
    const carousel = document.getElementById('testimonial-carousel');
    const prevBtn = document.getElementById('car-prev');
    const nextBtn = document.getElementById('car-next');
    const dotsContainer = document.getElementById('car-dots');

    if (carousel && prevBtn && nextBtn && dotsContainer) {
        const cards = carousel.querySelectorAll('.testimonial-card');
        
        // Create dots corresponding to number of cards
        cards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                const scrollPos = cards[i].offsetLeft - carousel.offsetLeft - (carousel.offsetWidth / 2) + (cards[i].offsetWidth / 2);
                carousel.scrollTo({ left: scrollPos, behavior: 'smooth' });
            });
            
            dotsContainer.appendChild(dot);
        });
        
        const dots = dotsContainer.querySelectorAll('.dot');
        
        // Update dots on scroll
        carousel.addEventListener('scroll', () => {
            let centerPos = carousel.scrollLeft + (carousel.offsetWidth / 2);
            let activeIndex = 0;
            let minDistance = Infinity;
            
            cards.forEach((card, i) => {
                const cardCenter = card.offsetLeft - carousel.offsetLeft + (card.offsetWidth / 2);
                const distance = Math.abs(centerPos - cardCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    activeIndex = i;
                }
            });
            
            dots.forEach(dot => dot.classList.remove('active'));
            if(dots[activeIndex]) {
                dots[activeIndex].classList.add('active');
            }
        });
        
        // Buttons
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -380, behavior: 'smooth' });
        });
        
        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: 380, behavior: 'smooth' });
        });
    }

    // 7. Form Validation & Submission (Mock)
    const bookingForm = document.getElementById('booking-form');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = document.getElementById('form-submit-btn');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation is handled by HTML5 attributes
            submitBtn.textContent = 'Processing...';
            submitBtn.classList.add('submitting');
            
            // Mock API delay
            setTimeout(() => {
                formSuccess.classList.remove('hidden');
                bookingForm.reset();
                submitBtn.textContent = 'Confirm Appointment ✅';
                submitBtn.classList.remove('submitting');
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formSuccess.classList.add('hidden');
                }, 5000);
            }, 1000);
        });
    }

    // 8. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // Toggle clicked
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

});
