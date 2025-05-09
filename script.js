document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.getElementById('backToTop');
    const galleryItems = document.querySelectorAll('.gallery-item:not(.video-item)');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeLightbox = document.getElementById('closeLightbox');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const contactForm = document.getElementById('messageForm');
    const sections = document.querySelectorAll('section');

    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

    // Mobile Navigation
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navItems.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Effects
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar background
        navbar.classList.toggle('scrolled', scrollY > 50);

        // Back to top
        backToTopBtn?.classList.toggle('active', scrollY > 300);

        // Highlight nav link
        let currentSection = '';
        sections.forEach(section => {
            if (scrollY >= section.offsetTop - 100) {
                currentSection = section.id;
            }
        });
        navItems.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
        });

        checkVisibility();
    });

    // Lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            lightboxImg.src = images[currentImageIndex];
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightboxModal = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    closeLightbox?.addEventListener('click', closeLightboxModal);
    lightbox?.addEventListener('click', e => {
        if (e.target === lightbox) closeLightboxModal();
    });

    prevBtn?.addEventListener('click', e => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentImageIndex];
    });

    nextBtn?.addEventListener('click', e => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightboxImg.src = images[currentImageIndex];
    });

    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightboxModal();
        if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            lightboxImg.src = images[currentImageIndex];
        }
        if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            lightboxImg.src = images[currentImageIndex];
        }
    });

    // Contact Form
    contactForm?.addEventListener('submit', e => {
        e.preventDefault();
        const name = contactForm.name.value.trim();
        const email = contactForm.email.value.trim();
        const subject = contactForm.subject.value.trim();
        const message = contactForm.message.value.trim();

        if (name && email && subject && message) {
            console.log({ name, email, subject, message });
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        }
    });

    // Initialize skill bars
    document.querySelectorAll('.skill-level').forEach(bar => {
        const width = bar.getAttribute('data-width') || '0';
        bar.style.width = '0';
        bar.setAttribute('data-width', width);
    });

    function checkVisibility() {
        const elements = document.querySelectorAll(
            '.about-card, .timeline-item, .awards-list li, .cert-list li, .family-member, ' +
            '.interest-item, .skill-category, .skill-level, .philosophy-content, blockquote, ' +
            '.philosophy-text p, .gallery-item, .contact-info, .contact-form, .reveal'
        );
    
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const inView = rect.top < window.innerHeight - 100 && rect.bottom > 0;
    
            if (inView) {
                element.classList.add('visible');
    
                if (element.classList.contains('skill-level') && !element.classList.contains('animate')) {
                    const width = element.getAttribute('data-width') || '0';
                    setTimeout(() => {
                        element.style.width = width;
                        element.classList.add('animate');
                    }, 100);
                }
    
                if (element.classList.contains('reveal')) {
                    element.classList.add('active');
                }
            } else {
                element.classList.remove('visible');
    
                // Reset skill bar animation
                if (element.classList.contains('skill-level')) {
                    element.style.width = '0';
                    element.classList.remove('animate');
                }
    
                // Reset reveal animation
                if (element.classList.contains('reveal')) {
                    element.classList.remove('active');
                }
            }
        });
    }
    

    // Initial load
    checkVisibility();

    // Animate intro
    setTimeout(() => {
        ['.profile-content', '.name', '.title', '.social-icons', '.cta-button'].forEach(selector => {
            const el = document.querySelector(selector);
            if (el) {
                el.style.opacity = '1';
                el.style.transform = 'translateX(0)';
            }
        });
    }, 100);
});
document.querySelectorAll('.gallery-item.video-item').forEach(item => {
    const preview = item.querySelector('.video-preview');
    const dropdown = item.querySelector('.video-dropdown');
    const video = dropdown.querySelector('.main-video');
  
    // Open and play video on click
    preview.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevents event from reaching window
      closeAllDropdowns(); // Close any open videos
      dropdown.classList.add('show');
  
      // Reset and play the current video
      video.currentTime = 0;
      video.play().catch(() => {
        // Handle autoplay block
      });
    });
  
    // Close on outside click
    window.addEventListener('click', (e) => {
      if (!item.contains(e.target)) {
        dropdown.style.display = 'none';
        video.pause();
        video.currentTime = 0;
      }
    });
});
  
// Ensure all dropdowns are closed and videos are paused
function closeAllDropdowns() {
    document.querySelectorAll('.video-dropdown').forEach(drop => {
      drop.classList.remove('show');
      const vid = drop.querySelector('video');
      if (vid) {
        vid.pause();
        vid.currentTime = 0;
      }
    });
}

  // Ensure preview videos are fully paused at load
  document.querySelectorAll('.video-thumb').forEach(thumb => {
    thumb.pause?.(); // If supported
    thumb.currentTime = 0;
  });
  