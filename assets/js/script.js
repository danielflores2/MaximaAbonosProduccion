document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library
    AOS.init({
        duration: 1000,
        once: true
    });

    // Initialize navbar functionality
    initNavbar();
    
    // Navbar scroll effect
    initNavbarScroll();
    
    // Back to top button
    initBackToTop();
    
    // Initialize product filtering if on products page
    if (document.querySelectorAll('.category-btn').length > 0) {
        initProductFiltering();
    }
    
    // Initialize product modals if on products page
    if (document.querySelectorAll('.btn-product').length > 0) {
        initProductModals();
    }
    
    // Apply animation to products if on products page
    if (document.querySelectorAll('.product-item').length > 0) {
        animateProducts();
    }
    
    // Initialize contact form if on contact page
    if (document.getElementById('contactForm')) {
        initContactForm();
    }
    
    // Initialize gallery if on homepage
    if (document.querySelector('.image-grid') || document.querySelector('.gallery-popup-link')) {
        initGallery();
    }
    
    // Initialize smooth scroll for all pages
    initSmoothScroll();

    // Hide preloader when page is loaded
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        preloader.classList.add('fade-out');
        
        // Remove preloader from DOM after animation
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 1000);
    });
});

/**
 * Initialize navbar functionality
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = navbar.querySelector('.navbar-toggler');
    const navbarCollapse = navbar.querySelector('.navbar-collapse');
    const navLinks = navbar.querySelectorAll('.nav-link');

    // Toggle navbar when toggler is clicked
    navbarToggler.addEventListener('click', function(e) {
        e.stopPropagation();
        navbarCollapse.classList.toggle('show');
        navbarToggler.classList.toggle('active');
    });

    // Close navbar when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
            navbarToggler.classList.remove('active');
        }
    });

    // Close navbar when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navbarCollapse.classList.remove('show');
            navbarToggler.classList.remove('active');
        });
    });

    // Prevent navbar collapse from closing when clicking inside it
    navbarCollapse.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

/**
 * Initialize navbar scroll effect
 */
function initNavbarScroll() {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            document.querySelector('.navbar').classList.add('scrolled');
        } else {
            document.querySelector('.navbar').classList.remove('scrolled');
        }
    });
}

/**
 * Initialize back-to-top button
 */
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        // Show/hide back-to-top button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
                backToTopButton.style.opacity = '1';
                backToTopButton.style.visibility = 'visible';
            } else {
                backToTopButton.classList.remove('show');
                backToTopButton.style.opacity = '0';
                backToTopButton.style.visibility = 'hidden';
            }
        });
        
        // Scroll to top when button is clicked
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Initialize category filtering for products
 */
function initProductFiltering() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const productItems = document.querySelectorAll('.product-item');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Show or hide products based on filter
            if (filterValue === 'all') {
                productItems.forEach(item => {
                    item.style.display = 'block';
                });
            } else {
                productItems.forEach(item => {
                    if (item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    });
    
    // Set "All" as default active filter
    if (categoryButtons.length) {
        categoryButtons[0].click();
    }
}

/**
 * Initialize product modal functionality
 */
function initProductModals() {
    const productButtons = document.querySelectorAll('.btn-product');
    
    productButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const modalId = this.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                // Get product data from data attributes
                const productCard = this.closest('.product-card');
                const productImage = productCard.querySelector('.product-image img').src;
                const productName = productCard.querySelector('.product-name').textContent;
                const productDescription = productCard.querySelector('.product-description').textContent;
                
                // Populate modal with product data
                modal.querySelector('.modal-product-details h3').textContent = productName;
                modal.querySelector('.modal-product-description p').textContent = productDescription;
                modal.querySelector('.modal-image img').src = productImage;
                
                // Show modal
                const bootstrapModal = new bootstrap.Modal(modal);
                bootstrapModal.show();
            } else {
                // If no modal is specified, redirect to the href
                window.location.href = this.getAttribute('href');
            }
        });
    });
}

/**
 * Apply animation to product items
 */
function animateProducts() {
    const productItems = document.querySelectorAll('.product-item');
    
    productItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

/**
 * Initialize contact form 
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would normally have AJAX code to submit the form
            // For demonstration purposes, let's just show a success message
            alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
            this.reset();
        });
    }
}

/**
 * Initialize gallery functionality with Magnific Popup
 */
function initGallery() {
    // Initialize Magnific Popup for image grid
    if ($('.image-grid').length) {
        $('.image-grid').magnificPopup({
            delegate: 'a',
            type: 'image',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0,1]
            },
            zoom: {
                enabled: true,
                duration: 300,
                easing: 'ease-in-out'
            }
        });
    }
    
    // Initialize Magnific Popup for gallery section
    if ($('.gallery-popup-link').length) {
        $('.gallery-popup-link').magnificPopup({
            type: 'image',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0,1]
            },
            zoom: {
                enabled: true,
                duration: 300,
                easing: 'ease-in-out'
            }
        });
    }
    
    // Initialize filter functionality
    if ($('.filter-btn').length) {
        $('.filter-btn').on('click', function() {
            var filterValue = $(this).attr('data-filter');
            
            // Show/hide items based on filter
            if (filterValue === '*') {
                $('.gallery-column').show();
            } else {
                $('.gallery-column').hide();
                $(filterValue).show();
            }
            
            // Update active class
            $('.filter-btn').removeClass('active');
            $(this).addClass('active');
        });
    }
}

/**
 * Initialize smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href === "#") return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Add event handler for navbar toggle for mobile
 */
(function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            navbarCollapse.classList.toggle('show');
        });
    }
})(); 