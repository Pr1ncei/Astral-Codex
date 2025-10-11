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