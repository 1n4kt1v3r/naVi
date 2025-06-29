// Titel-Scroll-Effekt
let title = "I FOUND YOU ";
let pos = 0;
function scrollTitle() {
  document.title = title.substring(pos) + title.substring(0, pos);
  pos = (pos + 1) % title.length;
  setTimeout(scrollTitle, 200);
}
scrollTitle();

window.onload = () => {
  // Sound & Vollbild bei Klick
  document.addEventListener('click', () => {
    document.documentElement.requestFullscreen().catch(() => {});
    const scream = document.getElementById('scream');
    if (scream) {
      scream.volume = 0.1;
      scream.play().catch(err => console.warn("Audio-Fehler:", err));
    }
  });

  // IP & Geo via Geoapify
  fetch("https://api.geoapify.com/v1/ipinfo?&apiKey=e9dde81d2d134aa1a1f6d5c73557478d")
    .then(response => response.json())
    .then(result => {
      const ip = result.ip || 'Unbekannt';
      const city = result.city?.name || 'Unbekannt';
      const country = result.country?.name || 'Unbekannt';
      const lat = result.location?.latitude;
      const lon = result.location?.longitude;

      document.getElementById('ip').textContent = ip;
      document.getElementById('location').textContent = `${city}, ${country}`;

      if (lat && lon) {
        const mapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=300&center=lonlat:${lon},${lat}&zoom=13&marker=lonlat:${lon},${lat};color:red&apiKey=e9dde81d2d134aa1a1f6d5c73557478d`;
        const mapImg = document.createElement('img');
        mapImg.src = mapUrl;
        mapImg.alt = "Map";
        mapImg.style.width = "100%";
        mapImg.style.display = "block";
        document.getElementById('map').appendChild(mapImg);
      } else {
        document.getElementById('map').textContent = "Where are you hiding?";
      }
    })
    .catch(err => {
      console.warn(err);
      document.getElementById('location').textContent = "n.A.";
      document.getElementById('map').textContent = "Karte konnte nicht geladen werden.";
    });

  const scream = document.getElementById('scream');
  if (scream) scream.volume = 1.0;

  // ESC / STRG+W blockieren
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || (e.ctrlKey && e.key.toLowerCase() === 'w')) {
      e.preventDefault();
    }
  });

  // Vor dem Schließen
  window.onbeforeunload = () => "You really wanna leave?";

  // Tab-Verlassen-Effekt
  document.addEventListener("visibilitychange", () => {
    const popup = document.getElementById("popup-warning");
    if (document.hidden && popup) {
      popup.style.display = "block";
      setTimeout(() => popup.style.display = "none", 3000);
    }
  });

  // Scroll sperren
  setInterval(() => {
    window.scrollTo(0, 0);
  }, 10);

  // Button zum Starten automatisch triggern
  document.getElementById('trigger').click();
};
