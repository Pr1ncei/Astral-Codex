function openNav(){
    document.getElementById("sidebar").style.width="250px";
}

function closeNav(){
    document.getElementById("sidebar").style.width="0";
}

function applyZoomLock() {
  const container = document.getElementById("canvas");
  if (!container) return;

  const zoom = window.devicePixelRatio || 1;

  container.style.transform = `translate(-50%, -50%) scale(${1 / zoom})`;
}

window.addEventListener("resize", applyZoomLock);
window.addEventListener("load", applyZoomLock);