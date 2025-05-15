class LanguageManager {
    constructor() {
        this.translations = {};
        this.currentLang = localStorage.getItem('language') || 'es';
        // Define aquí la lista de tus archivos JSON de traducción
        this.translationFiles = [
            '/assets/json/translations.json', // Tu archivo original
            '/assets/json/productos.json',
            '/assets/json/aonk.json',
            '/assets/json/max-amino.json',
            '/assets/json/maxcalcio.json',
            '/assets/json/maxcobre.json',
            '/assets/json/maxflor.json',
            '/assets/json/maxhumic.json',
            '/assets/json/maxmax.json',
            '/assets/json/maxmicros.json',
            '/assets/json/molplus.json',
            '/assets/json/orgaonk.json',
            '/assets/json/contacto.json'
            
        ];
        this.init();
    }

    async init() {
        // Cargar las traducciones desde todos los archivos JSON especificados
        await this.loadTranslations();

        // Configurar el idioma inicial
        this.setLanguage(this.currentLang);

        // Añadir manejadores de eventos para cambiar idioma
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = item.querySelector('img').alt.toLowerCase();
                let langCode = 'en'; // Default a inglés
                if (lang === 'english') {
                    langCode = 'en';
                } else if (lang === 'spanish') {
                    langCode = 'es';
                } else if (lang === 'french') {
                    langCode = 'fr';
                } else {
                    console.error('Idioma no reconocido:', lang);
                    return; // No hacer nada si el idioma no es reconocido
                }
                localStorage.setItem('language', langCode);
                this.setLanguage(langCode);
            });
        });
    }

    async loadTranslations() {
        try {
            for (const filePath of this.translationFiles) {
                const response = await fetch(filePath);
                if (!response.ok) {
                    console.error(`Error loading translation file ${filePath}: ${response.statusText}`);
                    continue; // Saltar este archivo y continuar con el siguiente
                }
                const fileTranslations = await response.json();

                // Fusionar las traducciones del archivo actual con las traducciones globales
                for (const langCode in fileTranslations) {
                    if (fileTranslations.hasOwnProperty(langCode)) {
                        if (!this.translations[langCode]) {
                            this.translations[langCode] = {};
                        }
                        // Object.assign fusiona las propiedades. Si hay claves duplicadas,
                        // las del archivo actual (fileTranslations[langCode]) sobrescribirán
                        // las existentes en this.translations[langCode].
                        Object.assign(this.translations[langCode], fileTranslations[langCode]);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    setLanguage(lang) {
        this.currentLang = lang;
        this.updateLanguageDisplay(lang);
        this.translatePage();
    }

    updateLanguageDisplay(lang) {
        const langData = {
            'en': { flag: 'gb', text: 'EN' },
            'es': { flag: 'es', text: 'ES' },
            'fr': { flag: 'fr', text: 'FR' }
        };

        document.querySelectorAll('#mobileLangDropdown, #desktopLangDropdown').forEach(dropdown => {
            const img = dropdown.querySelector('img');
            const span = dropdown.querySelector('span');
            if (img && span && langData[lang]) { // Asegurarse que langData[lang] existe
                img.src = `https://flagcdn.com/w40/${langData[lang].flag}.png`;
                img.alt = langData[lang].text;
                span.textContent = langData[lang].text;
            }
        });
    }

    translatePage() {
        if (!this.translations[this.currentLang]) {
            console.warn('Translations not found for language:', this.currentLang, 'Attempting to load page with potentially missing translations.');
            // Opcionalmente, podrías intentar cargar un idioma por defecto si las traducciones para el actual no existen
            // if (this.translations['en']) { // Intenta usar inglés como fallback
            //     this.currentLang = 'en';
            // } else {
            //     return; // No hay traducciones disponibles en absoluto
            // }
            // O simplemente retornar si prefieres no mostrar nada o mantener el texto original
            return;
        }

        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (this.translations[this.currentLang] && this.translations[this.currentLang][key]) {
                element.textContent = this.translations[this.currentLang][key];
            } else {
                // Opcional: ¿Qué hacer si una clave específica no se encuentra?
                // console.warn(`Translation key "${key}" not found for language "${this.currentLang}"`);
                // element.textContent = key; // Mostrar la clave como fallback
            }
        });
    }

    // getLangFromElement ya no parece ser usado directamente en el flujo de cambio de idioma,
    // ya que ahora usamos el 'alt' text de la imagen. Se puede mantener si es útil para otras cosas.
    getLangFromElement(element) {
        const img = element.querySelector('img');
        if (img) {
            const altText = img.alt.toLowerCase();
            if (altText === 'english' || altText === 'en') return 'en';
            if (altText === 'spanish' || altText === 'es') return 'es';
            if (altText === 'french' || altText === 'fr') return 'fr';
        }
        return 'en'; // Fallback
    }
}

// Inicializar el gestor de idiomas cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    window.languageManager = new LanguageManager();
});