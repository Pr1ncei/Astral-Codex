// SIDE BAR
function openNav(){
    document.getElementById("sidebar").style.width="250px";
}

function closeNav(){
    document.getElementById("sidebar").style.width="0";
}


// FIXED CONTENT ZOOM
function applyZoomLock() {
  const container = document.getElementById("canvas");
  if (!container) return;

  const zoom = window.devicePixelRatio || 1;

  container.style.transform = `translate(-50%, -50%) scale(${1 / zoom})`;
}

window.addEventListener("resize", applyZoomLock);
window.addEventListener("load", applyZoomLock);


// SEARCH BAR

/* CURRENT ISSUE:
  - Search Button does not work :(
*/

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector('#search-bar input');
  const resultBox = document.querySelector('.result-box');
  const ul = resultBox.querySelector('ul');

  const data = [
    { name: 'Aglaea', page: 'pages/characters/aglaea.html' },
    { name: 'Anaxa', page: 'pages/characters/anaxa.html' },
    { name: 'Castorice', page: 'pages/characters/castorice.html' },
    { name: 'Cerydra', page: 'pages/characters/cerydra.html' },
    { name: 'Cipher', page: 'pages/characters/cipher.html' },
    { name: 'Hyacine', page: 'pages/characters/hyacine.html' },
    { name: 'Hysilens', page: 'pages/characters/hysilens.html' },
    { name: 'Mydei', page: 'pages/characters/mydei.html' },
    { name: 'Phainon', page: 'pages/characters/phainon.html' },
    { name: 'Tribbie', page: 'pages/characters/tribbie.html' },
    { name: 'Make Farewells More Beatiful', page: 'pages/lightcones/make_farewells_more_beautiful.html'}
  ];

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    ul.innerHTML = '';

    if (query === '') {
      resultBox.classList.remove('active');
      return;
    }

    const matches = data
      .filter(item => item.name.toLowerCase().includes(query))
      .slice(0, 3);

    matches.forEach(match => {
      const li = document.createElement('li');
      li.textContent = match.name;
      li.addEventListener('click', () => {
        window.location.href = match.page;
      });
      ul.appendChild(li);
    });

    resultBox.classList.toggle('active', matches.length > 0);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchInput.value.toLowerCase().trim();
      const match = data.find(item => item.name.toLowerCase() === query);
      if (match) {
        window.location.href = match.page;
      }
    }
  });
});


// IMAGE SLIDER
const sliderImg = document.querySelector('.location-img');
const sliderName = document.querySelector('.location-name');

const locations = [
  {
    name: "Astral Express",
    img: "../assets/locations/astral-express.png"
  },
  {
    name: "Herta Space Station",
    img: "../assets/locations/herta-space-station.png"
  },
  {
    name: "Jarilo-VI",
    img: "../assets/locations/jarilo-vi.png"
  },
  {
    name: "Xianzhou Luofu",
    img: "../assets/locations/xianzhou-luofu.png"
  },
  {
    name: "Penacony",
    img: "../assets/locations/penacony.png"
  },
  {
    name: "Amphoreus",
    img: "../assets/locations/amphoreus.png"
  }
];

let startPos = 0;

function updateSlider() {
  sliderImg.src = locations[startPos].img;
  sliderName.textContent = locations[startPos].name;
}


function next() {
  startPos++;
  if (startPos >= locations.length) {
    startPos = 0;
  }
  updateSlider();
}

function prev() {
  startPos--;
  if (startPos < 0){
    startPos = locations.length - 1;
  }
  updateSlider();
}

// Character Ascension Stats
let levels = [];
let currentLevel = 0;
let characterData = null;

// Load character data from JSON
async function loadCharacterData(characterName) {
  try {
    const response = await fetch('../../data/characters.json');
    const allCharacters = await response.json();

    characterData = allCharacters[characterName];

    if (!characterData) {
      console.error(`Character "${characterName}" not found in database`);
      return false;
    }

    levels = characterData.levels;
    return true;

  } catch (error) {
    console.error('Error loading character data:', error);
    return false;
  }
}

// Get character name from page
function getCharacterName() {
  const characterElement = document.querySelector('[data-character]');
  if (characterElement) {
    return characterElement.getAttribute('data-character');
  }

  const path = window.location.pathname;
  const match = path.match(/\/([^\/]+)\.html$/);
  if (match) {
    return match[1].toLowerCase();
  }

  return null;
}

// Initialize ascension stats
async function initAscension() {
  const characterName = getCharacterName();

  if (!characterName) {
    console.error('Could not determine character name');
    return;
  }

  const loaded = await loadCharacterData(characterName);

  if (loaded) {
    createLevelButtons();
    updateStats();
    updateMaterials();
  }
}

// Create level selection buttons
function createLevelButtons() {
  const container = document.getElementById('levelButtons');
  if (!container) return;

  container.innerHTML = ''; // Clear existing buttons

  levels.forEach((data, index) => {
    const btn = document.createElement('button');
    btn.className = 'level-btn';
    btn.textContent = `Lv. ${data.level}`;
    if (index === 0) btn.classList.add('active');
    btn.onclick = () => selectLevel(index);
    container.appendChild(btn);
  });
}

// Select a level
function selectLevel(index) {
  currentLevel = index;
  const buttons = document.querySelectorAll('.level-btn');
  buttons.forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });
  updateStats();
}

// Update stats display
function updateStats() {
  const data = levels[currentLevel];
  const baseData = levels[0];
  const statsDisplay = document.getElementById('statsDisplay');

  if (!statsDisplay) return;

  statsDisplay.innerHTML = `
    <div class="stat-row">
      <div class="stat-info">
        <span class="stat-icon"><img src="../../assets/icons/base-hp.svg" /></span>
        <span class="stat-label">Base HP</span>
      </div>
      <div class="stat-values">
        <span class="base-value">${baseData.hp}</span>
        <span class="arrow">→</span>
        <span class="final-value">${data.hp}</span>
      </div>
    </div>
    <div class="stat-row">
      <div class="stat-info">
        <span class="stat-icon"><img src="../../assets/icons/base-atk.svg" /></span>
        <span class="stat-label">Base ATK</span>
      </div>
      <div class="stat-values">
        <span class="base-value">${baseData.atk}</span>
        <span class="arrow">→</span>
        <span class="final-value">${data.atk}</span>
      </div>
    </div>
    <div class="stat-row">
      <div class="stat-info">
        <span class="stat-icon"><img src="../../assets/icons/base-def.svg" /></span>
        <span class="stat-label">Base DEF</span>
      </div>
      <div class="stat-values">
        <span class="base-value">${baseData.def}</span>
        <span class="arrow">→</span>
        <span class="final-value">${data.def}</span>
      </div>
    </div>
    <div class="stat-row">
      <div class="stat-info">
        <span class="stat-icon"><img src="../../assets/icons/base-spd.svg" /></span>
        <span class="stat-label">Base SPD</span>
      </div>
      <div class="stat-values">
        <span class="base-value">${baseData.spd}</span>
        <span class="arrow">→</span>
        <span class="final-value">${data.spd}</span>
      </div>
    </div>
  `;
}

// Update materials display
function updateMaterials() {
  const materialsGrid = document.querySelector('.materials-grid');
  if (!materialsGrid || !characterData || !characterData.materials) return;

  materialsGrid.innerHTML = characterData.materials.map(material => `
    <div class="material-item">
      <div class="material-icon">
        ${material.icon.endsWith('.png') || material.icon.endsWith('.svg')
          ? `<img src="../../assets/materials/${material.icon}" alt="${material.name}">`
          : material.icon}
      </div>
      <div class="material-count">${material.count}</div>
      <div class="material-name">${material.name}</div>
    </div>
  `).join('');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAscension);
} else {
  initAscension();
}