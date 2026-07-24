// Itinerary data (DAYS, CHECKLIST, PASSES) is generated from the Markdown
// files into data.js by generate_site_data.py and loaded before this script.

// === MAP ICON SVG ===
const MAP_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
const ARROW_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';

// === FIREBASE SYNC ===
let db = null;
let checklistState = {};

function initFirebase() {
  if (typeof window.FIREBASE_CONFIG !== 'undefined' && window.FIREBASE_CONFIG.apiKey) {
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js';
    script.onload = () => {
      const script2 = document.createElement('script');
      script2.src = 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js';
      script2.onload = () => {
        firebase.initializeApp(window.FIREBASE_CONFIG);
        db = firebase.database();
        db.ref('checklist').on('value', (snap) => {
          checklistState = snap.val() || {};
          updateChecklistUI();
        });
        updateSyncStatus(true);
      };
      document.head.appendChild(script2);
    };
    document.head.appendChild(script);
  } else {
    // Fall back to localStorage
    try {
      checklistState = JSON.parse(localStorage.getItem('trip-checklist') || '{}');
    } catch (e) {
      checklistState = {};
    }
    updateSyncStatus(false);
  }
}

function toggleCheckItem(id) {
  checklistState[id] = !checklistState[id];
  if (db) {
    db.ref('checklist/' + id).set(checklistState[id]);
  } else {
    localStorage.setItem('trip-checklist', JSON.stringify(checklistState));
    updateChecklistUI();
  }
}

function updateChecklistUI() {
  document.querySelectorAll('.checklist-item').forEach(el => {
    const id = el.dataset.id;
    const checked = !!checklistState[id];
    el.classList.toggle('checked', checked);
    const cb = el.querySelector('input[type="checkbox"]');
    if (cb) cb.checked = checked;
  });
}

function updateSyncStatus(connected) {
  const el = document.querySelector('.sync-status');
  if (!el) return;
  const dot = el.querySelector('.sync-dot');
  const text = el.querySelector('.sync-text');
  if (connected) {
    dot.classList.add('connected');
    text.textContent = 'Synced across devices';
  } else {
    dot.classList.remove('connected');
    text.textContent = 'Local only (configure Firebase for shared sync)';
  }
}

// === TAB NAVIGATION ===
let activeTab = 'overview';

function switchTab(tabId) {
  activeTab = tabId;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
  renderContent();
  // Scroll tab into view
  const activeBtn = document.querySelector(`.tab[data-tab="${tabId}"]`);
  if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === RENDER FUNCTIONS ===

function renderContent() {
  const main = document.getElementById('content');
  if (activeTab === 'overview') {
    main.innerHTML = renderOverview();
  } else if (activeTab === 'passes') {
    main.innerHTML = renderPasses();
  } else if (activeTab === 'packing') {
    main.innerHTML = renderPacking();
  } else if (activeTab === 'cards') {
    main.innerHTML = renderCards();
  } else {
    const day = DAYS.find(d => d.id === activeTab);
    if (day) main.innerHTML = renderDay(day);
  }
  // Re-bind checklist events
  document.querySelectorAll('.checklist-item').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') return;
      toggleCheckItem(el.dataset.id);
    });
  });
  // Re-bind day card clicks
  document.querySelectorAll('.day-card').forEach(el => {
    el.addEventListener('click', () => switchTab(el.dataset.tab));
  });
  updateChecklistUI();
}

function renderOverview() {
  // Group checklist by category
  const categories = {};
  CHECKLIST.forEach(item => {
    if (!categories[item.category]) categories[item.category] = [];
    categories[item.category].push(item);
  });

  let checklistHTML = '<div class="sync-status"><span class="sync-dot"></span><span class="sync-text">Loading...</span></div>';
  for (const [cat, items] of Object.entries(categories)) {
    checklistHTML += `<h3>${cat}</h3><div class="checklist">`;
    items.forEach(item => {
      checklistHTML += `<div class="checklist-item" data-id="${item.id}"><input type="checkbox" tabindex="-1"><span class="checklist-text">${item.text}</span></div>`;
    });
    checklistHTML += '</div>';
  }

  let koreaCards = '';
  let taiwanCards = '';
  DAYS.forEach(day => {
    const card = `<div class="day-card" data-tab="${day.id}">
      <div class="day-card-num ${day.country}">${day.day}</div>
      <div class="day-card-info">
        <div class="day-card-title">${day.date} \u2014 ${day.title}</div>
        <div class="day-card-desc">${day.summary}</div>
      </div>
      <div class="day-card-arrow">${ARROW_ICON}</div>
    </div>`;
    if (day.country === 'korea') koreaCards += card;
    else taiwanCards += card;
  });

  return `
    ${renderLegend()}
    <div class="overview-section">
      <h2>Booking Checklist</h2>
      ${checklistHTML}
    </div>
    <div class="overview-section">
      <h2>Day-by-Day</h2>
      <div class="country-label korea">Korea \u2014 Seoul + Busan (Aug 11\u201320)</div>
      <div class="day-cards">${koreaCards}</div>
      <div class="country-label taiwan">Taiwan \u2014 Taipei + Taichung + Tainan + Kaohsiung (Aug 20\u201329)</div>
      <div class="day-cards">${taiwanCards}</div>
    </div>`;
}

// Emoji tag key. The emoji live inline in the Markdown next to each place
// (see places.md / days/*.md) and flow through to the schedule + Also Nearby
// text automatically; this block just explains what they mean.
const LEGEND_GROUPS = [
  { title: 'Place type', items: [
    ['\ud83c\udf5c', 'Food & restaurants'],
    ['\u2615', 'Caf\u00e9s, dessert & bakeries'],
    ['\ud83c\udfef', 'Palaces, temples & historic sites'],
    ['\ud83c\udfdb\ufe0f', 'Museums & galleries'],
    ['\ud83c\udf33', 'Parks, gardens & nature'],
    ['\ud83d\udecd\ufe0f', 'Shopping, markets & malls'],
    ['\ud83c\udfee', 'Night markets'],
    ['\ud83c\udfa1', 'Theme parks & amusement'],
    ['\ud83d\udeb6', 'Strolls & old streets'],
    ['\ud83d\uddfc', 'Viewpoints, decks & towers'],
    ['\ud83d\udcf8', 'Landmarks & photo spots'],
    ['\ud83c\udfa8', 'Hands-on & cultural experiences'],
  ]},
  { title: 'Extra tags (stacked on top)', items: [
    ['\ud83e\uddd2', 'Kid-favourite'],
    ['\ud83d\udc3e', 'Animals (zoo, aquarium, animal caf\u00e9)'],
    ['\u2668\ufe0f', 'Hot springs & spas'],
    ['\ud83d\udea1', 'Scenic rides (cable car, gondola, ferry)'],
    ['\ud83c\udf7a', 'Nightlife & bars'],
  ]},
  { title: 'Finer tags', items: [
    ['\ud83c\udf75', 'Traditional tea house'],
    ['\ud83e\uddcb', 'Bubble tea'],
    ['\ud83c\udf0a', 'Waterfalls & natural wonders'],
    ['\u26ea', 'Churches & cathedrals'],
    ['\ud83c\udfad', 'Performing-arts venues'],
    ['\ud83e\udd2a', 'Quirky / novelty venues'],
    ['\ud83c\udf81', 'Character & fandom stores'],
  ]},
];

function renderLegend() {
  let html = '<div class="overview-section"><h2>Place Tags</h2>'
    + '<p class="legend-intro">The emoji beside each place mark what it is \u2014 a place can carry more than one.</p>';
  LEGEND_GROUPS.forEach(g => {
    html += `<h3>${g.title}</h3><div class="legend-grid">`;
    g.items.forEach(([emoji, label]) => {
      html += `<div class="legend-item"><span class="legend-emoji">${emoji}</span><span class="legend-label">${label}</span></div>`;
    });
    html += '</div>';
  });
  html += '</div>';
  return html;
}

function buildGoogleMapsPinsUrl(day) {
  // Extract place names from google maps search URLs in schedule HTML
  const searchPattern = /google\.com\/maps\/search\/([^"'\s]+)/g;
  const places = [];
  day.schedule.forEach(s => {
    let match;
    while ((match = searchPattern.exec(s.activity)) !== null) {
      places.push(match[1].replace(/\+/g, ' ').replace(/\btarget$/i, '').trim());
    }
    searchPattern.lastIndex = 0;
  });
  // Extract place names from extras URLs
  if (day.extras) {
    day.extras.forEach(cat => {
      cat.items.forEach(item => {
        if (item.url) {
          const m = item.url.match(/google\.com\/maps\/search\/([^"'\s]+)/);
          if (m) places.push(m[1].replace(/\+/g, ' ').trim());
        }
      });
    });
  }
  if (places.length < 2) return null;
  const origin = encodeURIComponent(places[0]);
  const destination = encodeURIComponent(places[places.length - 1]);
  const waypoints = places.slice(1, -1).map(p => encodeURIComponent(p)).join('|');
  const mode = day.country === 'korea' ? 'transit' : 'walking';
  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
  if (waypoints) url += `&waypoints=${waypoints}`;
  url += `&travelmode=${mode}`;
  return url;
}

function renderDay(day) {
  let badgesHTML = day.badges.map(b => `<span class="badge badge-${b.type}">${b.text}</span>`).join('');
  badgesHTML += `<span class="badge badge-${day.country}">${day.country === 'korea' ? 'Korea' : 'Taiwan'}</span>`;

  // Build maps buttons: use data maps (Naver etc) + auto-generated Google Maps pins
  const nonGoogleMaps = day.maps.filter(m => !m.url.includes('google.com/maps/dir'));
  const gmapUrl = buildGoogleMapsPinsUrl(day);
  const allMaps = [...nonGoogleMaps];
  if (gmapUrl) allMaps.push({ label: 'Google Maps (all pins)', url: gmapUrl });

  let mapsHTML = '';
  if (allMaps.length === 1) {
    mapsHTML = `<a href="${allMaps[0].url}" target="_blank" class="map-btn">${MAP_ICON} ${allMaps[0].label || 'Open route'}</a>`;
  } else if (allMaps.length > 1) {
    mapsHTML = '<div class="map-buttons">' + allMaps.map(m => `<a href="${m.url}" target="_blank" class="map-btn">${MAP_ICON} ${m.label}</a>`).join('') + '</div>';
  }

  const notesHTML = day.notes ? `<div class="day-note">${day.notes}</div>` : '';

  const scheduleHTML = day.schedule.map(s => {
    const priceHTML = s.price ? `<div class="schedule-price">${s.price}</div>` : '';
    return `<div class="schedule-item ${day.country}-accent">
      <div class="schedule-time">${s.time}</div>
      <div class="schedule-body">
        <div class="schedule-activity">${s.activity}</div>
        ${priceHTML}
      </div>
    </div>`;
  }).join('');

  // Also Nearby extras
  let extrasHTML = '';
  if (day.extras && day.extras.length > 0) {
    extrasHTML = '<div class="extras-section"><h3>Also Nearby</h3>';
    day.extras.forEach(cat => {
      extrasHTML += `<div class="extras-category"><h4>${cat.category}</h4><ul class="extras-list">`;
      cat.items.forEach(item => {
        const link = item.url ? `<a href="${item.url}" target="_blank">${item.name}</a>` : item.name;
        extrasHTML += `<li>${link} \u2014 ${item.desc}</li>`;
      });
      extrasHTML += '</ul></div>';
    });
    extrasHTML += '</div>';
  }

  // Navigation
  const prevDay = DAYS.find(d => d.day === day.day - 1);
  const nextDay = DAYS.find(d => d.day === day.day + 1);
  let navHTML = '<div style="display:flex;justify-content:space-between;margin-top:1.5rem;">';
  navHTML += prevDay ? `<button class="map-btn" onclick="switchTab('${prevDay.id}')">\u2190 Day ${prevDay.day}</button>` : '<span></span>';
  navHTML += nextDay ? `<button class="map-btn" onclick="switchTab('${nextDay.id}')">Day ${nextDay.day} \u2192</button>` : '<span></span>';
  navHTML += '</div>';

  return `
    <div class="day-header">
      <h2>${day.title}</h2>
      <div class="date">${day.date} \u2014 Day ${day.day} of 19</div>
      <div class="day-badges">${badgesHTML}</div>
    </div>
    ${notesHTML}
    ${mapsHTML}
    <div class="schedule">${scheduleHTML}</div>
    ${extrasHTML}
    ${navHTML}`;
}

function renderPasses() {
  const cardsHTML = PASSES.map(p => `
    <div class="pass-card">
      <h3>${p.name}</h3>
      <div class="pass-price">${p.price}</div>
      <div class="pass-activate">${p.activate}</div>
      <ul>${p.includes.map(i => `<li>${i}</li>`).join('')}</ul>
      <div class="pass-value">${p.value}</div>
      <div class="pass-buy">Buy: ${p.buy}</div>
    </div>`).join('');

  return `
    <div class="overview-section">
      <h2>City & Transport Passes</h2>
      ${cardsHTML}
    </div>
    <div class="overview-section">
      <h2>Transit Cards</h2>
      <div class="pass-card">
        <h3>T-money Card (Korea)</h3>
        <ul>
          <li>Buy at any convenience store at Incheon Airport</li>
          <li>Load ~50,000 KRW to start</li>
          <li>Works on: all buses, subways, some taxis, convenience stores</li>
        </ul>
      </div>
      <div class="pass-card">
        <h3>EasyCard (Taiwan)</h3>
        <ul>
          <li>Buy at any convenience store or MRT station at Taoyuan Airport</li>
          <li>Load ~NT$500 to start</li>
          <li>Works on: MRT, buses, TRA trains, convenience stores, YouBike, Maokong Gondola</li>
          <li>20% discount on MRT rides</li>
        </ul>
      </div>
    </div>
    <div class="overview-section">
      <h2>Connectivity</h2>
      <div class="pass-card">
        <h3>eSIM Options</h3>
        <ul>
          <li><strong>Airalo</strong> \u2014 ~$5\u201310 for 7 days</li>
          <li><strong>Holafly</strong> \u2014 Unlimited data ~$25</li>
          <li>Or buy SIM at airport (Chunghwa Telecom in Taiwan: 10 days unlimited ~NT$700)</li>
        </ul>
      </div>
    </div>`;
}

function renderPacking() {
  return `
    <div class="overview-section">
      <h2>Weather & Packing for August</h2>
      <div class="packing-grid">
        <div class="packing-card">
          <h3>Korea: 28\u201333\u00b0C</h3>
          <ul>
            <li>70\u201385% humidity</li>
            <li>Monsoon typically ends late July</li>
            <li>August still gets sudden heavy showers</li>
          </ul>
        </div>
        <div class="packing-card">
          <h3>Taiwan: 28\u201335\u00b0C</h3>
          <ul>
            <li>Feels like 38\u201345\u00b0C with humidity</li>
            <li>Afternoon thunderstorms common</li>
            <li>Peak typhoon season</li>
          </ul>
        </div>
        <div class="packing-card">
          <h3>Pack</h3>
          <ul>
            <li>Lightweight breathable clothing (linen, cotton, quick-dry)</li>
            <li>Compact rain jacket or umbrella (ESSENTIAL)</li>
            <li>SPF 50+ sunscreen, hat, sunglasses</li>
            <li>Comfortable walking shoes for wet conditions</li>
            <li>Portable fan / cooling towel</li>
            <li>Waterproof phone case</li>
            <li>Reusable water bottle</li>
          </ul>
        </div>
        <div class="packing-card">
          <h3>Strategy</h3>
          <ul>
            <li><strong>Outdoor sites:</strong> early morning before 10am</li>
            <li><strong>Indoor sites:</strong> midday heat 11am\u20133pm</li>
            <li><strong>Markets & night markets:</strong> evening</li>
            <li>Convenience stores = air-conditioned refuges everywhere</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="overview-section">
      <h2>Closed-Day Rules</h2>
      <h3>Seoul</h3>
      <table class="closed-table">
        <tr><th>Day</th><th>What\u2019s Closed</th></tr>
        <tr><td>Monday</td><td>Changdeokgung, Changgyeonggung, War Memorial, Leeum, SeMoCA, MMCA</td></tr>
        <tr><td>Tuesday</td><td>Gyeongbokgung, National Folk Museum, Jongmyo Shrine</td></tr>
        <tr><td>Hanbok tip</td><td>Wearing hanbok = free entry to all palaces</td></tr>
      </table>
      <h3>Busan</h3>
      <table class="closed-table">
        <tr><th>Day</th><th>What\u2019s Closed</th></tr>
        <tr><td>Monday</td><td>Oryukdo Skywalk, Busan Science Museum, Art Museum, Taejongdae Danubi Train</td></tr>
        <tr><td>1st & 3rd Tue</td><td>Jagalchi Fish Market</td></tr>
        <tr><td>1st & 3rd Sun</td><td>Gukje Market</td></tr>
      </table>
      <h3>Taiwan</h3>
      <table class="closed-table">
        <tr><th>Day</th><th>What\u2019s Closed</th></tr>
        <tr><td>Monday</td><td>Maokong Gondola, Beitou Hot Spring Museum, Tainan Art Museum</td></tr>
        <tr><td>Sun + Mon</td><td>National Palace Museum</td></tr>
        <tr><td>Tuesday</td><td>Fo Guang Shan Buddha Museum</td></tr>
      </table>
    </div>
    <div class="overview-section">
      <h2>Optional Swaps</h2>
      <div class="packing-card">
        <h3>Want Gyeongju?</h3>
        <ul><li>Drop Nami Island (Aug 15) or Lotte World (Aug 17). Take KTX to Busan early. Use Aug 18 for Gyeongju day trip.</li></ul>
      </div>
      <div class="packing-card">
        <h3>Want Everland instead of Lotte World?</h3>
        <ul><li>Everland (~1h from Seoul) has T Express (steepest wooden coaster). Lotte World is more convenient + indoor for heat.</li></ul>
      </div>
      <div class="packing-card">
        <h3>Want more Taipei?</h3>
        <ul><li>Skip Taichung (Aug 25 morning), take HSR directly to Tainan. Extra half-day for Treasure Hill or Houtong Cat Village.</li></ul>
      </div>
      <div class="packing-card">
        <h3>Want Alishan or Sun Moon Lake?</h3>
        <ul><li>Requires 1\u20132 extra days. Cut Tainan or Kaohsiung. Sun Moon Lake doable as day trip from Taichung.</li></ul>
      </div>
    </div>`;
}

function renderCards() {
  if (typeof CARDS === 'undefined' || !CARDS.length) {
    return '<div class="overview-section"><p>No card data — run <code>python generate_site_data.py</code>.</p></div>';
  }
  const nav = '<div class="card-nav">' +
    CARDS.map(c => `<a class="card-nav-chip" href="#${c.id}">${c.nav}</a>`).join('') +
    '</div>';
  const sections = CARDS.map(c =>
    `<section class="card-doc" id="${c.id}"><h2 class="card-doc-title">${c.title}</h2>${c.html}</section>`
  ).join('');
  return `<div class="cards-page">${nav}${sections}</div>`;
}

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  // Tab click handlers
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // Initial render
  renderContent();
  initFirebase();
});
