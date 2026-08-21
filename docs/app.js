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
    // data-done items are permanently checked, independent of stored state.
    const checked = el.dataset.done === 'true' || !!checklistState[id];
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
    text.textContent = 'Synchronizacja między urządzeniami';
  } else {
    dot.classList.remove('connected');
    text.textContent = 'Tylko lokalnie (skonfiguruj Firebase, aby współdzielić)';
  }
}

// === PACKING TICKS ===
// The packing list (generated from packing.md into PACKING) is one long set of
// '- [ ]' items. Ticking is per-device and deliberately NOT Firebase-synced:
// each traveller packs their own bag, so sharing one state across phones would
// fight. Keys hash the item text, so they survive reordering/regeneration of
// packing.md and only reset when the wording of that item itself changes.
const PACKING_STORE = 'trip-packing';
let packingState = {};

function loadPackingState() {
  try {
    packingState = JSON.parse(localStorage.getItem(PACKING_STORE) || '{}');
  } catch (e) {
    packingState = {};
  }
}

function packKey(text) {
  let h = 5381;
  const s = text.trim().replace(/\s+/g, ' ');
  for (let i = 0; i < s.length; i++) h = (((h * 33) ^ s.charCodeAt(i)) >>> 0);
  return h.toString(36);
}

function savePackingState() {
  try {
    localStorage.setItem(PACKING_STORE, JSON.stringify(packingState));
  } catch (e) { /* private mode / quota — ticks just won't persist */ }
}

function updatePackingProgress() {
  const items = document.querySelectorAll('.packing-page li.task');
  const done = document.querySelectorAll('.packing-page li.task.checked').length;
  const el = document.querySelector('.packing-progress-text');
  if (el) el.textContent = `Zapakowane: ${done} z ${items.length}`;
  const bar = document.querySelector('.packing-progress-bar span');
  if (bar) bar.style.width = items.length ? (done / items.length * 100) + '%' : '0%';
}

function bindPackingTicks() {
  document.querySelectorAll('.packing-page li.task').forEach(li => {
    const textEl = li.querySelector('.task-text');
    const key = packKey(textEl ? textEl.textContent : li.textContent);
    li.dataset.packKey = key;
    // '- [x]' in the Markdown = ticked by default until the user says otherwise.
    const preDone = !!li.querySelector('.task-box-done');
    const checked = key in packingState ? !!packingState[key] : preDone;
    li.classList.toggle('checked', checked);
    li.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') return;       // let links through
      packingState[key] = !li.classList.contains('checked');
      li.classList.toggle('checked', packingState[key]);
      savePackingState();
      updatePackingProgress();
    });
  });
  updatePackingProgress();
}

function resetPacking() {
  packingState = {};
  savePackingState();
  document.querySelectorAll('.packing-page li.task').forEach(li => li.classList.remove('checked'));
  updatePackingProgress();
}

// === TAB NAVIGATION ===
let activeTab = 'overview';

const FIXED_TABS = ['overview', 'passes', 'packing', 'cards', 'places', 'dmz', 'car'];

// A tab is deep-linkable via the URL hash (e.g. #dmz, #day-3). Used both to
// restore the tab on load and to let in-content links (checklist, day notes)
// jump straight to it.
function isValidTab(id) {
  return FIXED_TABS.includes(id)
    || (typeof DAYS !== 'undefined' && DAYS.some(d => d.id === id));
}

function switchTab(tabId) {
  activeTab = tabId;
  // Keep the URL hash in sync so the tab is shareable/bookmarkable. replaceState
  // (not location.hash=) avoids a scroll jump to a same-id element and doesn't
  // fire hashchange, so this won't recurse with the listener below.
  if (location.hash.slice(1) !== tabId) {
    history.replaceState(null, '', '#' + tabId);
  }
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
  } else if (activeTab === 'places') {
    main.innerHTML = renderPlaces();
  } else if (activeTab === 'dmz') {
    main.innerHTML = renderDmz();
  } else if (activeTab === 'car') {
    main.innerHTML = renderCar();
  } else {
    const day = DAYS.find(d => d.id === activeTab);
    if (day) main.innerHTML = renderDay(day);
  }
  // Re-bind checklist events
  document.querySelectorAll('.checklist-item').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') return;
      if (el.dataset.done === 'true') return; // permanently done — locked
      toggleCheckItem(el.dataset.id);
    });
  });
  if (activeTab === 'packing') bindPackingTicks();
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

  let checklistHTML = '<div class="sync-status"><span class="sync-dot"></span><span class="sync-text">Ładowanie...</span></div>';
  for (const [cat, items] of Object.entries(categories)) {
    checklistHTML += `<h3>${cat}</h3><div class="checklist">`;
    items.forEach(item => {
      // item.done = marked [x] in the Markdown: permanently checked + locked.
      const doneAttr = item.done ? ' data-done="true"' : '';
      const doneClass = item.done ? ' checked' : '';
      const checkedAttr = item.done ? ' checked' : '';
      checklistHTML += `<div class="checklist-item${doneClass}" data-id="${item.id}"${doneAttr}><input type="checkbox" tabindex="-1"${checkedAttr}><span class="checklist-text">${item.text}</span></div>`;
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
      <h2>Lista rezerwacji</h2>
      ${checklistHTML}
    </div>
    <div class="overview-section">
      <h2>Dzie\u0144 po dniu</h2>
      <div class="country-label korea">Korea \u2014 Seoul + Busan (11\u201320 sie)</div>
      <div class="day-cards">${koreaCards}</div>
      <div class="country-label taiwan">Tajwan \u2014 Taipei + Taichung + Tainan + Kaohsiung (20\u201329 sie)</div>
      <div class="day-cards">${taiwanCards}</div>
    </div>`;
}

// Emoji tag key. The emoji live inline in the Markdown next to each place
// (see places.md / days/*.md) and flow through to the schedule + Also Nearby
// text automatically; this block just explains what they mean.
const LEGEND_GROUPS = [
  { title: 'Typ miejsca', items: [
    ['\ud83c\udf5c', 'Jedzenie i restauracje'],
    ['\u2615', 'Kawiarnie, desery i piekarnie'],
    ['\ud83c\udfef', 'Pa\u0142ace, \u015bwi\u0105tynie i zabytki'],
    ['\ud83c\udfdb\ufe0f', 'Muzea i galerie'],
    ['\ud83c\udf33', 'Parki, ogrody i przyroda'],
    ['\ud83d\udecd\ufe0f', 'Zakupy, targi i centra handlowe'],
    ['\ud83c\udfee', 'Nocne targi'],
    ['\ud83c\udfa1', 'Parki rozrywki'],
    ['\ud83d\udeb6', 'Spacery i stare uliczki'],
    ['\ud83d\uddfc', 'Punkty i tarasy widokowe, wie\u017ce'],
    ['\ud83d\udcf8', 'Zabytki i miejsca na zdj\u0119cia'],
    ['\ud83c\udfa8', 'Warsztaty i do\u015bwiadczenia kulturalne'],
  ]},
  { title: 'Znacznik osobisty', items: [
    ['\ud83d\udc1e', '\u017byczenie Jadzi \u2014 nie wyrzucamy przy przek\u0142adaniu planu'],
  ]},
  { title: 'Dodatkowe tagi (dok\u0142adane do typu)', items: [
    ['\ud83e\uddd2', 'Hit u dzieci'],
    ['\ud83d\udc3e', 'Zwierz\u0119ta (zoo, akwarium, kawiarnia ze zwierz\u0119tami)'],
    ['\u2668\ufe0f', 'Gor\u0105ce \u017ar\u00f3d\u0142a i spa'],
    ['\ud83d\udea1', 'Widokowe przejazdy (kolejka linowa, gondola, prom)'],
    ['\ud83c\udf7a', 'Nocne \u017cycie i bary'],
  ]},
  { title: 'Tagi szczeg\u00f3\u0142owe', items: [
    ['\ud83c\udf75', 'Tradycyjna herbaciarnia'],
    ['\ud83e\uddcb', 'Bubble tea'],
    ['\ud83c\udf0a', 'Wodospady i cuda natury'],
    ['\u26ea', 'Ko\u015bcio\u0142y i katedry'],
    ['\ud83c\udfad', 'Sceny i teatry'],
    ['\ud83e\udd2a', 'Miejsca dziwne / nietypowe'],
    ['\ud83c\udf81', 'Sklepy z maskotkami i gad\u017cetami'],
  ]},
  { title: 'Dziennik podr\u00f3\u017cy', items: [
    ['\u2705', 'Widziane \u2014 byli\u015bmy, z nasz\u0105 ocen\u0105 1\u20135 po fakcie (osobna skala od \u2605 przy nazwie, kt\u00f3re m\u00f3wi\u0105 o wa\u017cno\u015bci przy planowaniu)'],
    ['\u23ed\ufe0f', 'Pomini\u0119te \u2014 by\u0142o w planie dnia, ale odpu\u015bcili\u015bmy'],
  ]},
];

function renderLegend() {
  let html = '<div class="overview-section"><h2>Tagi miejsc</h2>'
    + '<p class="legend-intro">Emoji obok ka\u017cdego miejsca m\u00f3wi\u0105, czym ono jest \u2014 jedno miejsce mo\u017ce mie\u0107 kilka.</p>';
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
  // Route through the day's MAIN scheduled stops only, in order.
  // 'Also Nearby' extras are deliberately excluded: they're optional side
  // options, not part of the day's path, and including them blew the route
  // past Google's ~9-waypoint limit for dir/?api=1 URLs (some days had 20+).
  const searchPattern = /google\.com\/maps\/search\/([^"'\s]+)/g;
  const places = [];
  day.schedule.forEach(s => {
    let match;
    while ((match = searchPattern.exec(s.activity)) !== null) {
      const name = match[1].replace(/\+/g, ' ').replace(/\btarget$/i, '').trim();
      // skip empties and consecutive duplicates (same stop referenced twice)
      if (name && name !== places[places.length - 1]) places.push(name);
    }
    searchPattern.lastIndex = 0;
  });
  if (places.length < 2) return null;
  const MAX_WAYPOINTS = 9; // Google Maps dir/?api=1 caps waypoints at 9
  const origin = encodeURIComponent(places[0]);
  const destination = encodeURIComponent(places[places.length - 1]);
  let middle = places.slice(1, -1);
  if (middle.length > MAX_WAYPOINTS) middle = middle.slice(0, MAX_WAYPOINTS);
  const waypoints = middle.map(p => encodeURIComponent(p)).join('|');
  const mode = day.country === 'korea' ? 'transit' : 'walking';
  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
  if (waypoints) url += `&waypoints=${waypoints}`;
  url += `&travelmode=${mode}`;
  return url;
}

function renderDay(day) {
  let badgesHTML = day.badges.map(b => `<span class="badge badge-${b.type}">${b.text}</span>`).join('');
  badgesHTML += `<span class="badge badge-${day.country}">${day.country === 'korea' ? 'Korea' : 'Tajwan'}</span>`;

  // Build maps buttons: use data maps (Naver etc) + auto-generated Google Maps pins
  const nonGoogleMaps = day.maps.filter(m => !m.url.includes('google.com/maps/dir'));
  const gmapUrl = buildGoogleMapsPinsUrl(day);
  const allMaps = [...nonGoogleMaps];
  if (gmapUrl) allMaps.push({ label: 'Google Maps (wszystkie punkty)', url: gmapUrl });

  let mapsHTML = '';
  if (allMaps.length === 1) {
    mapsHTML = `<a href="${allMaps[0].url}" target="_blank" class="map-btn">${MAP_ICON} ${allMaps[0].label || 'Otwórz trasę'}</a>`;
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
    extrasHTML = '<div class="extras-section"><h3>W okolicy</h3>';
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
  navHTML += prevDay ? `<button class="map-btn" onclick="switchTab('${prevDay.id}')">\u2190 Dzie\u0144 ${prevDay.day}</button>` : '<span></span>';
  navHTML += nextDay ? `<button class="map-btn" onclick="switchTab('${nextDay.id}')">Dzie\u0144 ${nextDay.day} \u2192</button>` : '<span></span>';
  navHTML += '</div>';

  return `
    <div class="day-header">
      <h2>${day.title}</h2>
      <div class="date">${day.date} \u2014 Dzie\u0144 ${day.day} z 19</div>
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
      <div class="pass-buy">Kup: ${p.buy}</div>
    </div>`).join('');

  return `
    <div class="overview-section">
      <h2>Passy miejskie i transportowe</h2>
      ${cardsHTML}
    </div>
    <div class="overview-section">
      <h2>Karty transportu miejskiego</h2>
      <div class="pass-card">
        <h3>T-money Card (Korea)</h3>
        <ul>
          <li>Kup w dowolnym sklepie ca\u0142odobowym na lotnisku Incheon</li>
          <li>Do\u0142aduj na start ~50 000 KRW</li>
          <li>Dzia\u0142a w: autobusach, metrze, cz\u0119\u015bci taks\u00f3wek, sklepach ca\u0142odobowych</li>
        </ul>
      </div>
      <div class="pass-card">
        <h3>EasyCard (Tajwan)</h3>
        <ul>
          <li>Kup w dowolnym sklepie ca\u0142odobowym lub na stacji MRT na lotnisku Taoyuan</li>
          <li>Do\u0142aduj na start ~NT$500</li>
          <li>Dzia\u0142a w: MRT, autobusach, poci\u0105gach TRA, sklepach ca\u0142odobowych, YouBike, Maokong Gondola</li>
          <li>20% zni\u017cki na przejazdy MRT</li>
        </ul>
      </div>
    </div>
    <div class="overview-section">
      <h2>\u0141\u0105czno\u015b\u0107</h2>
      <div class="pass-card">
        <h3>Opcje eSIM</h3>
        <ul>
          <li><strong>Airalo</strong> \u2014 ~$5\u201310 za 7 dni</li>
          <li><strong>Holafly</strong> \u2014 dane bez limitu ~$25</li>
          <li>Albo kup SIM na lotnisku (Chunghwa Telecom na Tajwanie: 10 dni bez limitu ~NT$700)</li>
        </ul>
      </div>
    </div>`;
}

function renderPacking() {
  // The list itself is GENERATED from packing.md into PACKING (data.js) \u2014 edit
  // the Markdown, not this function. Only the weather/strategy grid, the
  // closed-day tables and the swap cards below are hand-written here.
  let listHTML = '<div class="overview-section"><p>Brak danych pakowania \u2014 uruchom <code>python generate_site_data.py</code>.</p></div>';
  if (typeof PACKING !== 'undefined' && PACKING && PACKING.sections.length) {
    const nav = '<div class="card-nav">' +
      PACKING.sections.map(s => `<a class="card-nav-chip" href="#${s.id}">${s.nav}</a>`).join('') +
      '</div>';
    const sections = PACKING.sections.map(s =>
      `<section class="card-doc" id="${s.id}"><h2 class="card-doc-title">${s.title}</h2>${s.html}</section>`
    ).join('');
    listHTML = `
      <div class="packing-hero">
        <h2>${PACKING.title}</h2>
        ${PACKING.intro}
        <div class="packing-progress">
          <div class="packing-progress-bar"><span></span></div>
          <div class="packing-progress-row">
            <span class="packing-progress-text"></span>
            <button class="packing-reset" onclick="resetPacking()">Odznacz wszystko</button>
          </div>
          <p class="packing-hint">Kliknij pozycj\u0119, \u017ceby j\u0105 odhaczy\u0107 \u2014 stan zapisuje si\u0119 w tej przegl\u0105darce (ka\u017cdy pakuje si\u0119 sam).</p>
        </div>
      </div>
      ${nav}${sections}`;
  }

  return `
    <div class="cards-page packing-page">
    ${listHTML}
    <div class="overview-section">
      <h2>Pogoda i strategia dnia</h2>
      <div class="packing-grid">
        <div class="packing-card">
          <h3>Korea: 28\u201333\u00b0C</h3>
          <ul>
            <li>70\u201385% wilgotno\u015bci</li>
            <li>Monsun zwykle ko\u0144czy si\u0119 z ko\u0144cem lipca</li>
            <li>W sierpniu wci\u0105\u017c zdarzaj\u0105 si\u0119 nag\u0142e ulewy</li>
          </ul>
        </div>
        <div class="packing-card">
          <h3>Tajwan: 28\u201335\u00b0C</h3>
          <ul>
            <li>Przy tej wilgotno\u015bci odczuwalne 38\u201345\u00b0C</li>
            <li>Popo\u0142udniowe burze to norma</li>
            <li>Szczyt sezonu tajfunowego</li>
          </ul>
        </div>
        <div class="packing-card">
          <h3>Strategia</h3>
          <ul>
            <li><strong>Miejsca na zewn\u0105trz:</strong> wczesny poranek, przed 10:00</li>
            <li><strong>Miejsca w \u015brodku:</strong> po\u0142udniowy upa\u0142 11:00\u201315:00</li>
            <li><strong>Targi i nocne targi:</strong> wieczorem</li>
            <li>Sklepy ca\u0142odobowe = klimatyzowane schronienie na ka\u017cdym kroku</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="overview-section">
      <h2>Dni zamkni\u0119cia</h2>
      <h3>Seoul</h3>
      <table class="closed-table">
        <tr><th>Dzie\u0144</th><th>Co zamkni\u0119te</th></tr>
        <tr><td>Poniedzia\u0142ek</td><td>Changdeokgung, Changgyeonggung, War Memorial, Leeum, SeMoCA</td></tr>
        <tr><td>Wtorek</td><td>Gyeongbokgung, National Folk Museum, Jongmyo Shrine</td></tr>
        <tr><td>Hanbok \u2014 wskaz\u00f3wka</td><td>W hanboku wst\u0119p do wszystkich pa\u0142ac\u00f3w jest bezp\u0142atny</td></tr>
      </table>
      <h3>Busan</h3>
      <table class="closed-table">
        <tr><th>Dzie\u0144</th><th>Co zamkni\u0119te</th></tr>
        <tr><td>Poniedzia\u0142ek</td><td>Oryukdo Skywalk (tylko 1. pon.), Busan Science Museum, Museum of Art, Taejongdae Danubi Train, GoEun Museum of Photography, Johyun Gallery, Korea National Maritime Museum, F1963</td></tr>
        <tr><td>1. i 3. wtorek</td><td>Jagalchi Fish Market</td></tr>
        <tr><td>1. i 3. niedziela</td><td>Gukje Market</td></tr>
        <tr><td>Nasze dni</td><td>19 sie (\u015br.) + 20 sie (czw.) \u2014 nic z powy\u017cszego nie wypada</td></tr>
      </table>
      <h3>Tajwan</h3>
      <table class="closed-table">
        <tr><th>Dzie\u0144</th><th>Co zamkni\u0119te</th></tr>
        <tr><td>Poniedzia\u0142ek</td><td>National Palace Museum, Maokong Gondola, Beitou Hot Spring Museum, Tainan Art Museum</td></tr>
        <tr><td>Wtorek</td><td>Fo Guang Shan Buddha Museum</td></tr>
        <tr><td>Poniedzia\u0142ek + \u015broda</td><td>Ruifeng Night Market (Kaohsiung) \u2014 jeste\u015bmy tam w czw. 27 sie, wi\u0119c dost\u0119pny</td></tr>
        <tr><td>Nocne targi w Tainan</td><td>Rotacja: pon./wt./pt. = Dadong, \u015br./sob. = Wusheng, czw./niedz. = Garden. Nasz wiecz\u00f3r to \u015br. 26 sie \u2192 Dadong zamkni\u0119ty, idziemy na Wusheng</td></tr>
        <tr><td>Tylko czw.\u2013niedz.</td><td>Six Thousand Beef Soup (Tainan) \u2014 jeste\u015bmy tam w czw. 27 sie, wi\u0119c otwarte</td></tr>
      </table>
    </div>
    <div class="overview-section">
      <h2>Opcjonalne zamiany</h2>
      <div class="packing-card">
        <h3>Chcecie Gyeongju?</h3>
        <ul><li>Po przesuni\u0119ciu lotu nie trzeba ju\u017c nic wycina\u0107: <strong>20 sie to wolny dzie\u0144 w Busan</strong> \u2014 zamie\u0144cie go na wycieczk\u0119 do Gyeongju (autobus z terminalu Nopo, ~50 min): Bulguksa, Seokguram, kurhany Daereungwon, Gyeongju National Museum. Kosztem jest ca\u0142a zawarto\u015b\u0107 20 sie \u2014 Yeongdo, Songdo i o\u015b sztuki w Haeundae (przepada GoEun Museum of Photography). Wracajcie wcze\u015bnie: nazajutrz wyjazd z hotelu o 5:30.</li></ul>
      </div>
      <div class="packing-card">
        <h3>Everland zamiast Lotte World?</h3>
        <ul><li>Everland (~1 h od Seoulu) ma T Express (najbardziej stromy drewniany rollercoaster). Lotte World jest wygodniejsze i ma cz\u0119\u015b\u0107 pod dachem na upa\u0142.</li></ul>
      </div>
      <div class="packing-card">
        <h3>Wi\u0119cej Taipei?</h3>
        <ul><li>Pomi\u0144cie Taichung (poranek 26 sie) i jed\u017acie HSR wprost do Tainan. Wolne p\u00f3\u0142 dnia na Treasure Hill albo Houtong Cat Village.</li></ul>
      </div>
      <div class="packing-card">
        <h3>Alishan albo Sun Moon Lake?</h3>
        <ul><li>Trzeba 1\u20132 dni wi\u0119cej. Do wyci\u0119cia Tainan albo Kaohsiung. Sun Moon Lake da si\u0119 zrobi\u0107 jako wycieczk\u0119 jednodniow\u0105 z Taichung.</li></ul>
      </div>
    </div>
    </div>`;
}

function renderCards() {
  if (typeof CARDS === 'undefined' || !CARDS.length) {
    return '<div class="overview-section"><p>Brak danych kart — uruchom <code>python generate_site_data.py</code>.</p></div>';
  }
  const nav = '<div class="card-nav">' +
    CARDS.map(c => `<a class="card-nav-chip" href="#${c.id}">${c.nav}</a>`).join('') +
    '</div>';
  const sections = CARDS.map(c =>
    `<section class="card-doc" id="${c.id}"><h2 class="card-doc-title">${c.title}</h2>${c.html}</section>`
  ).join('');
  return `<div class="cards-page">${nav}${sections}</div>`;
}

function renderPlaces() {
  if (typeof PLACES === 'undefined' || !PLACES.length) {
    return '<div class="overview-section"><p>Brak danych miejsc — uruchom <code>python generate_site_data.py</code>.</p></div>';
  }
  const intro = '<p class="legend-intro">Pełny katalog miejsc, region po regionie. Wybierz region, a potem przeglądaj po dzielnicach i kategoriach. Każda nazwa prowadzi do Google Maps.</p>';
  const nav = '<div class="card-nav">' +
    PLACES.map(p => `<a class="card-nav-chip" href="#${p.id}">${p.nav}</a>`).join('') +
    '</div>';
  const sections = PLACES.map(p =>
    `<section class="card-doc" id="${p.id}"><h2 class="card-doc-title">${p.title}</h2>${p.html}</section>`
  ).join('');
  return `<div class="cards-page places-page">${intro}${nav}${sections}</div>`;
}

function renderDmz() {
  if (typeof DMZ === 'undefined' || !DMZ) {
    return '<div class="overview-section"><p>Brak danych DMZ — uruchom <code>python generate_site_data.py</code>.</p></div>';
  }
  return `<div class="cards-page"><section class="card-doc" id="dmz"><h2 class="card-doc-title">${DMZ.title}</h2>${DMZ.html}</section></div>`;
}

function renderCar() {
  if (typeof CAR === 'undefined' || !CAR) {
    return '<div class="overview-section"><p>Brak danych o aucie — uruchom <code>python generate_site_data.py</code>.</p></div>';
  }
  return `<div class="cards-page"><section class="card-doc" id="car"><h2 class="card-doc-title">${CAR.title}</h2>${CAR.html}</section></div>`;
}

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  // Tab click handlers
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  loadPackingState();   // before the first render, so ticks show immediately

  // Initial render — honor a deep-link hash (e.g. #dmz) if present.
  const hashTab = location.hash.slice(1);
  if (isValidTab(hashTab)) {
    switchTab(hashTab);
  } else {
    renderContent();
  }
  initFirebase();

  // React to hash changes (back/forward button, or an in-content #tab link).
  window.addEventListener('hashchange', () => {
    const t = location.hash.slice(1);
    if (isValidTab(t) && t !== activeTab) switchTab(t);
  });
});
