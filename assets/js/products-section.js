// Translation functionality
const translationss = {
  'es': {
    'our_products1': 'Nuestros&nbsp;',
    'our_products2': 'productos',
    'all_products': 'Todos los productos'
  },
  'en': {
    'our_products1': 'Our&nbsp;',
    'our_products2': 'products',
    'all_products': 'All products'
  },
  'fr': {
    'our_products1': 'Nos&nbsp;',
    'our_products2': 'produits',
    'all_products': 'Tous les produits'
  }
};

// Set default language
let currentLanguage = 'es';

// Function to change language
function changeLanguage(lang) {
  if (!translationss[lang]) return;
  
  currentLanguage = lang;
  
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translationss[lang][key]) {
            element.innerHTML = translationss[lang][key];
    }
  });
}

// Sprite animation
const sprites = document.querySelectorAll('.sprite');
console.log('Found sprites:', sprites.length);

// Try to verify if sprite sheet is loading - try both relative paths
const img = new Image();
img.onload = function() {
  console.log('Sprite sheet loaded successfully!');
};
img.onerror = function() {
  console.error('First path failed to load. Trying alternative path...');
  
  const altImg = new Image();
  altImg.onload = function() {
    console.log('Sprite sheet loaded successfully with alternative path!');
    // Update all sprites with the working path
    sprites.forEach(sprite => {
      sprite.style.backgroundImage = 'url("../images/spritesheet_orgaonk.png")';
    });
  };
  altImg.onerror = function() {
    console.error('All sprite sheet paths failed to load!');
    
    // Fallback to show something in place of the sprites
    sprites.forEach(sprite => {
      sprite.style.display = 'flex';
      sprite.style.justifyContent = 'center';
      sprite.style.alignItems = 'center';
     
      sprite.style.color = '#333';
    });
  };
  altImg.src = '../images/spritesheet_orgaonk.png';
};
img.src = 'images/spritesheet_orgaonk.png';

const totalFrames = 120;
const frameWidth = 400;

// Initialize sprite animations
function initSpriteAnimations() {
  // Initial frame setup
  sprites.forEach((sprite, index) => {
    sprite.style.backgroundPosition = '0 0';
    
    // Set data attribute to help with debugging
    sprite.setAttribute('data-loaded', 'initialized');
  });

  // Scroll-based animation
  window.addEventListener('scroll', () => {
    sprites.forEach(sprite => {
      const container = sprite.parentElement;
      const rect = container.getBoundingClientRect();
      const containerHeight = window.innerHeight;

      if (rect.top <= containerHeight && rect.bottom >= 0) {
        const scrollFraction = Math.min(1, Math.max(0, (containerHeight - rect.top) / (containerHeight + rect.height / 2)));
        let currentFrame = Math.floor(scrollFraction * totalFrames);

        // Prevent going back to first frame at the end of animation
        currentFrame = Math.min(currentFrame, totalFrames - 1);

        sprite.style.backgroundPosition = `-${currentFrame * frameWidth}px 0`;
        
        // Set data attribute to help with debugging
        sprite.setAttribute('data-frame', currentFrame);
      }
    });
  });
}

// Initialize everything when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing animations...');
  initSpriteAnimations();
  
  // Manually trigger scroll event to initialize animation
  window.dispatchEvent(new Event('scroll'));
  
  // Double-check sprite visibility after a short delay
  setTimeout(() => {
    sprites.forEach((sprite, index) => {
      console.log(`Sprite ${index} visibility check:`, 
        getComputedStyle(sprite).backgroundImage,
        getComputedStyle(sprite).width,
        getComputedStyle(sprite).height
      );
    });
  }, 1000);
}); 