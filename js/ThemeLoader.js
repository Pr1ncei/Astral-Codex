/* ==========================================
   DYNAMIC THEME SYSTEM - THEME LOADER
   Loads themes from characters.json
   ========================================== */

// Global state
let charactersData = null;
let currentCharacter = null;

/**
 * Load character data from JSON file
 */
async function loadCharactersData() {
  try {
    const response = await fetch('../../data/characters.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    charactersData = await response.json();
    console.log('✓ Characters data loaded successfully');
    return true;
  } catch (error) {
    console.error('✗ Error loading characters.json:', error);
    return false;
  }
}

/**
 * Convert camelCase to kebab-case for CSS variables
 * Example: accentColor -> accent-color
 */
function camelToKebab(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Apply theme colors from JSON to CSS variables
 */
function applyThemeColors(themeData) {
  if (!themeData) {
    console.warn('⚠ No theme data provided');
    return;
  }

  const root = document.documentElement;

  // Apply each theme property as a CSS variable
  Object.keys(themeData).forEach(key => {
    const cssVarName = `--${camelToKebab(key)}`;
    const value = themeData[key];
    root.style.setProperty(cssVarName, value);
  });

  console.log('✓ Theme colors applied:', Object.keys(themeData).length, 'variables');
}

/**
 * Detect the current character from the page
 * Uses multiple detection methods for reliability
 */
function detectCharacter() {
  // Method 1: Check for data-character attribute on body or any element
  const characterElement = document.querySelector('[data-character]');
  if (characterElement) {
    const charName = characterElement.getAttribute('data-character').toLowerCase();
    console.log('→ Character detected via data-attribute:', charName);
    return charName;
  }

  // Method 2: Extract from URL pathname (e.g., /pages/characters/anaxa.html)
  const path = window.location.pathname;
  const match = path.match(/\/([^\/]+)\.html$/);
  if (match) {
    const charName = match[1].toLowerCase();
    // Verify it exists in our data
    if (charactersData && charactersData[charName]) {
      console.log('→ Character detected via URL:', charName);
      return charName;
    }
  }

  // Method 3: Check for specific class on body (e.g., class="page-anaxa")
  const bodyClasses = Array.from(document.body.classList);
  for (const className of bodyClasses) {
    if (className.startsWith('character-') || className.startsWith('page-')) {
      const charName = className.replace(/^(character-|page-)/, '').toLowerCase();
      if (charactersData && charactersData[charName]) {
        console.log('→ Character detected via body class:', charName);
        return charName;
      }
    }
  }

  // Method 4: Check the page title or character name element
  const titleElement = document.querySelector('.character-name, h1#title');
  if (titleElement) {
    const titleText = titleElement.textContent.toLowerCase().trim();
    if (charactersData && charactersData[titleText]) {
      console.log('→ Character detected via page title:', titleText);
      return titleText;
    }
  }

  console.log('⚠ No character detected, using default theme');
  return null;
}

/**
 * Apply theme for a specific character
 */
function applyCharacterTheme(characterName) {
  if (!charactersData) {
    console.error('✗ Characters data not loaded yet');
    return false;
  }

  const characterData = charactersData[characterName];

  if (!characterData) {
    console.error(`✗ Character "${characterName}" not found in database`);
    return false;
  }

  if (!characterData.theme) {
    console.warn(`⚠ No theme data found for character "${characterName}"`);
    return false;
  }

  // Apply the theme colors
  applyThemeColors(characterData.theme);

  // Add character-specific class to body for additional styling
  document.body.classList.add(`theme-${characterName}`);
  document.body.setAttribute('data-current-theme', characterName);

  // Store current character
  currentCharacter = characterName;

  // Dispatch custom event for theme change
  const themeChangeEvent = new CustomEvent('themeChanged', {
    detail: {
      character: characterName,
      theme: characterData.theme
    }
  });
  document.dispatchEvent(themeChangeEvent);

  console.log(`✓ Applied theme for: ${characterName}`);
  return true;
}

/**
 * Initialize the theme system
 */
async function initThemeSystem() {
  console.log('=== Theme System Initializing ===');

  // Load character data
  const loaded = await loadCharactersData();

  if (!loaded) {
    console.error('✗ Failed to load characters data, using default theme');
    return;
  }

  // Detect current character
  const character = detectCharacter();

  if (character) {
    // Apply character-specific theme
    applyCharacterTheme(character);
  } else {
    // Apply default theme (castorice)
    console.log('→ Applying default theme (castorice)');
    if (charactersData && charactersData['castorice']) {
      applyCharacterTheme('castorice');
    }
  }

  console.log('=== Theme System Ready ===');
}

/**
 * Manually set a theme (useful for testing or theme switchers)
 * @param {string} characterName - The name of the character
 */
function setTheme(characterName) {
  characterName = characterName.toLowerCase();

  if (!charactersData) {
    console.error('✗ Theme system not initialized yet');
    return false;
  }

  if (charactersData[characterName]) {
    // Remove old theme class
    if (currentCharacter) {
      document.body.classList.remove(`theme-${currentCharacter}`);
    }

    applyCharacterTheme(characterName);
    return true;
  }

  console.error(`✗ Invalid character name: ${characterName}`);
  console.log('Available characters:', Object.keys(charactersData).join(', '));
  return false;
}

/**
 * Get the current active theme
 * @returns {string|null} The current character name
 */
function getCurrentTheme() {
  return currentCharacter;
}

/**
 * Get all available themes
 * @returns {string[]} Array of character names
 */
function getAvailableThemes() {
  return charactersData ? Object.keys(charactersData) : [];
}

/**
 * Get theme data for a specific character
 * @param {string} characterName - The name of the character
 * @returns {object|null} The theme data object
 */
function getThemeData(characterName) {
  if (!charactersData || !charactersData[characterName]) {
    return null;
  }
  return charactersData[characterName].theme;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeSystem);
} else {
  initThemeSystem();
}

// Re-apply theme when navigating back to page (for SPAs or cached pages)
window.addEventListener('pageshow', function(event) {
  if (event.persisted && currentCharacter) {
    console.log('→ Page restored from cache, reapplying theme');
    applyCharacterTheme(currentCharacter);
  }
});

// Export functions for external use
if (typeof window !== 'undefined') {
  window.ThemeSystem = {
    setTheme,
    getCurrentTheme,
    getAvailableThemes,
    getThemeData,
    detectCharacter,
    initThemeSystem
  };

}