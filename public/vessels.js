// Every vessel is drawn on a 600 x 600 canvas.
// "slots" say where each kind of dish will land: zone -> [centreX, centreY, radius]

window.ZONE_LABELS = {
  starter: 'Starters', sweet: 'Sweets', side: 'Sides', special: 'Special',
  rice: 'Rice', curry: 'Curries', drink: 'Drinks', water: 'Water Bottles'
};

// Six slots placed in a ring around the centre, plus rice in the middle.
function ringSlots(ringR, slotR, riceR) {
  const order = ['starter', 'sweet', 'side', 'drink', 'special', 'curry'];
  const slots = { rice: [300, 300, riceR] };
  order.forEach(function (zone, i) {
    const angle = (-90 + i * 60) * Math.PI / 180;
    slots[zone] = [
      Math.round(300 + ringR * Math.cos(angle)),
      Math.round(300 + ringR * Math.sin(angle)),
      slotR
    ];
  });
  return slots;
}

// ---- banana leaf (outline, side veins, small tears at the edge) ----
const LEAF_PATH = 'M26 300 C42 220 100 152 178 139 C228 131 270 142 322 135 C378 128 430 142 482 135 '
  + 'C520 131 554 134 574 142 L574 458 C554 466 520 469 482 465 C430 458 378 472 322 465 '
  + 'C270 458 228 469 178 461 C100 448 42 380 26 300 Z';

function leafVeins() {
  let dark = '', light = '';
  for (let x = 70; x <= 572; x += 8) {
    const lean = 26 + (x - 70) * 0.01;
    dark += '<path d="M' + x + ' 300 Q' + (x + 6) + ' 225 ' + (x - lean) + ' 120"/>'
          + '<path d="M' + x + ' 300 Q' + (x + 6) + ' 375 ' + (x - lean) + ' 480"/>';
    light += '<path d="M' + (x + 4) + ' 300 Q' + (x + 10) + ' 225 ' + (x + 4 - lean) + ' 120"/>'
           + '<path d="M' + (x + 4) + ' 300 Q' + (x + 10) + ' 375 ' + (x + 4 - lean) + ' 480"/>';
  }
  return '<g fill="none" stroke="#2a5f1c" stroke-opacity=".26" stroke-width="1.1">' + dark + '</g>'
       + '<g fill="none" stroke="#d2ee9a" stroke-opacity=".3" stroke-width="1.3">' + light + '</g>';
}

function leafTears() {
  const tears = [[210, 138, 1], [356, 133, 1], [440, 139, 1], [250, 463, -1], [398, 467, -1], [520, 466, -1]];
  return tears.map(function (t) {
    const y2 = t[1] + t[2] * 20;
    return '<path d="M' + t[0] + ' ' + t[1] + ' L' + (t[0] - 6) + ' ' + y2 + ' L' + (t[0] + 3) + ' ' + t[1] + ' Z" fill="#faf5e8" fill-opacity=".55"/>';
  }).join('');
}

// Each plate is ONE <g class="plate"> so the drop-in animation never disturbs the shapes inside it.
// "meals" = the plate is only offered for those meals (no "meals" = offered for every meal).
window.VESSELS = [
  {
   id: 'banana', label: 'Banana leaf', light: false, outside: true, serve: true, grid: { x: 120, y: 165, w: 430, h: 270 },
    meals: ['Lunch', 'Dinner'],
    slots: {
      side: [110, 250, 38], sweet: [190, 195, 42], starter: [290, 180, 44],
      curry: [400, 195, 46], special: [490, 250, 40],
      rice: [300, 340, 80], drink: [130, 360, 40]
    },
    draw: function () {
      return '<g class="plate">'
        + '<defs>'
        + '<linearGradient id="leafGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5aa536"/><stop offset=".5" stop-color="#7cc24a"/><stop offset="1" stop-color="#4a9430"/></linearGradient>'
        + '<linearGradient id="leafSheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#eaffb8" stop-opacity=".25"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#0d3a10" stop-opacity=".2"/></linearGradient>'
        + '<clipPath id="leafClip"><path d="' + LEAF_PATH + '"/></clipPath>'
        + '<filter id="leafGrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.015 0.5" numOctaves="3" seed="4" result="n"/>'
        + '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.3  0 0 0 0 0.05  0 0 0 1.6 -0.3"/></filter>'
        + '</defs>'
        + '<path d="' + LEAF_PATH + '" fill="url(#leafGrad)" filter="url(#shadow)"/>'
        + '<g clip-path="url(#leafClip)">'
        + '<rect x="0" y="100" width="600" height="400" fill="url(#leafSheen)"/>'
        + leafVeins()
        + '<rect x="0" y="100" width="600" height="400" filter="url(#leafGrain)" opacity=".2" style="mix-blend-mode:multiply"/>'
        + '<path d="M30 300 C200 296 400 304 574 300" fill="none" stroke="#e4f2a8" stroke-opacity=".75" stroke-width="7" stroke-linecap="round"/>'
        + '<path d="M30 303 C200 299 400 307 574 303" fill="none" stroke="#2a5f1c" stroke-opacity=".4" stroke-width="2"/>'
        + '<path d="' + LEAF_PATH + '" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="10"/>'
        + '</g>'
        + leafTears()
        + '<path d="' + LEAF_PATH + '" fill="none" stroke="#24521a" stroke-opacity=".75" stroke-width="2.5"/>'
        + '</g>';
    }
  },
  {
    id: 'yellow', label: 'Yellow leaf plate', light: false, grid: { x: 150, y: 150, w: 300, h: 300 },
    meals: ['Breakfast', 'Lunch', 'Snacks / High Tea', 'Dinner'],
    slots: ringSlots(165, 45, 70),
    draw: function () {
      let leaves = '';
      for (let i = 0; i < 6; i++) {
        leaves += '<g transform="rotate(' + (i * 60 + 20) + ' 300 300)">'
          + '<path d="M300 300 C212 238 212 130 300 50 C388 130 388 238 300 300 Z" fill="#f6c443" fill-opacity=".35" stroke="#dd6a14" stroke-opacity=".9" stroke-width="3.5"/>'
          + '<path d="M300 288 C226 232 226 138 300 70 C374 138 374 232 300 288 Z" fill="none" stroke="#c4560f" stroke-opacity=".75" stroke-width="2" stroke-dasharray="4 6"/>'
          + '</g>';
      }
      return '<g class="plate">'
        + '<defs><radialGradient id="plY" cx=".38" cy=".32" r=".85"><stop offset="0" stop-color="#fdd966"/><stop offset="1" stop-color="#e8991a"/></radialGradient>'
        + '<radialGradient id="plY2" cx=".5" cy=".5" r=".6"><stop offset=".7" stop-color="#f3b42e" stop-opacity="0"/><stop offset="1" stop-color="#c9780f" stop-opacity=".35"/></radialGradient>'
        + '<clipPath id="plYc"><circle cx="300" cy="300" r="222"/></clipPath></defs>'
        + '<circle cx="300" cy="300" r="272" fill="url(#plY)" stroke="#c9840f" stroke-width="3" filter="url(#shadow)"/>'
        + '<circle cx="300" cy="300" r="250" fill="none" stroke="#dd6a14" stroke-opacity=".55" stroke-width="2" stroke-dasharray="3 6"/>'
        + '<circle cx="300" cy="300" r="224" fill="#f5bd37" stroke="#d98a14" stroke-width="3"/>'
        + '<g clip-path="url(#plYc)">' + leaves + '</g>'
        + '<circle cx="300" cy="300" r="224" fill="url(#plY2)"/>'
        + '<path d="M120 200 Q200 90 340 78" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="10" stroke-linecap="round"/>'
        + '</g>';
    }
  },
  {
    id: 'green', label: 'Green leaf-print plate', light: true, grid: { x: 150, y: 150, w: 300, h: 300 },
    meals: ['Breakfast', 'Lunch', 'Snacks / High Tea', 'Dinner'],
    slots: ringSlots(165, 45, 70),
    draw: function () {
      let veins = '';
      const ax = 0.879, ay = -0.478, bx = 0.478, by = 0.879;
      for (let i = 0; i <= 24; i++) {
        const t = i / 24, px = 60 + t * 480, py = 450 - t * 260;
        [1, -1].forEach(function (s) {
          veins += 'M' + px.toFixed(0) + ' ' + py.toFixed(0)
            + ' Q' + (px + s * bx * 90 + ax * 10).toFixed(0) + ' ' + (py + s * by * 90 + ay * 10).toFixed(0)
            + ' ' + (px + s * bx * 240 + ax * 130).toFixed(0) + ' ' + (py + s * by * 240 + ay * 130).toFixed(0) + ' ';
        });
      }
      return '<g class="plate">'
        + '<defs><radialGradient id="plG" cx=".38" cy=".32" r=".85"><stop offset="0" stop-color="#3fae6d"/><stop offset="1" stop-color="#1f7a48"/></radialGradient>'
        + '<clipPath id="plGc"><circle cx="300" cy="300" r="224"/></clipPath></defs>'
        + '<circle cx="300" cy="300" r="272" fill="url(#plG)" stroke="#185f38" stroke-width="3" filter="url(#shadow)"/>'
        + '<circle cx="300" cy="300" r="248" fill="none" stroke="#cfe9d6" stroke-opacity=".45" stroke-width="2" stroke-dasharray="3 6"/>'
        + '<circle cx="300" cy="300" r="224" fill="#2f9a60" stroke="#185f38" stroke-width="3"/>'
        + '<g clip-path="url(#plGc)">'
        + '<path d="M60 450 L540 190" stroke="#efe8d0" stroke-width="14" fill="none" stroke-linecap="round" opacity=".92"/>'
        + '<path d="' + veins + '" fill="none" stroke="#f3efdc" stroke-opacity=".85" stroke-width="2.6"/></g>'
        + '<path d="M120 200 Q200 90 340 78" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="10" stroke-linecap="round"/>'
        + '</g>';
    }
  },
  {
    id: 'leaf', label: 'Natural leaf plate', light: true, grid: { x: 150, y: 150, w: 300, h: 300 },
    meals: ['Breakfast', 'Lunch', 'Snacks / High Tea', 'Dinner'],
    slots: ringSlots(165, 45, 70),
    draw: function () {
      let rays = '', rings = '';
      for (let i = 0; i < 28; i++) {
        const a = i * 12.857 * Math.PI / 180;
        rays += 'M300 300 L' + (300 + 240 * Math.cos(a)).toFixed(0) + ' ' + (300 + 240 * Math.sin(a)).toFixed(0) + ' ';
      }
      [205, 150, 100].forEach(function (r) {
        rings += '<circle cx="300" cy="300" r="' + r + '" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="7"/>'
          + '<circle cx="300" cy="300" r="' + (r - 5) + '" fill="none" stroke="#3c4a12" stroke-opacity=".3" stroke-width="2"/>';
      });
      return '<g class="plate">'
        + '<defs><radialGradient id="plL" cx=".38" cy=".32" r=".85"><stop offset="0" stop-color="#a6b34c"/><stop offset="1" stop-color="#697626"/></radialGradient></defs>'
        + '<circle cx="300" cy="300" r="272" fill="url(#plL)" stroke="#55631f" stroke-width="3" filter="url(#shadow)"/>'
        + '<circle cx="300" cy="300" r="250" fill="none" stroke="#55631f" stroke-opacity=".35" stroke-width="3" stroke-dasharray="10 6"/>'
        + '<path d="' + rays + '" stroke="#4c5a1a" stroke-opacity=".22" stroke-width="1.4" fill="none"/>'
        + rings
        + '<path d="M120 200 Q200 90 340 78" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="10" stroke-linecap="round"/>'
        + '</g>';
    }
  },
  {
    id: 'tray', label: 'Gold gift tray', light: true,
    meals: ['Saree'],
    // four quarters between the ribbons: sweets on one diagonal, special items on the other
    slots: {
      sweet:   [[188, 188, 62], [412, 412, 62]],
      special: [[412, 188, 62], [188, 412, 62]]
    },
    draw: function () {
      let tiles = '', flowers = '', fan = '';
      for (let i = 0; i < 72; i++) {          // ring of mirror tiles round the rim
        tiles += '<rect x="294" y="30" width="12" height="20" rx="1.5" transform="rotate(' + (i * 5) + ' 300 300)" fill="'
          + (i % 2 ? '#f6efd6' : '#e6d6a2') + '" stroke="#a87a1c" stroke-width="1"/>';
      }
      [[300, 80], [300, 520], [80, 300], [520, 300], [145, 145], [455, 145], [145, 455], [455, 455]].forEach(function (p) {
        flowers += '<g transform="translate(' + p[0] + ' ' + p[1] + ')">'
          + '<circle r="10" fill="#d11a3a" stroke="#7a0a1e" stroke-width="1.5"/>'
          + '<circle r="4" fill="#f6dc7a"/><circle cx="-3" cy="-4" r="2" fill="#fff" fill-opacity=".8"/></g>';
      });
      [-72, -48, -24, 0, 24, 48, 72].forEach(function (a) {   // peacock tail
        fan += '<g transform="rotate(' + a + ' 0 14)">'
          + '<ellipse cx="0" cy="-34" rx="9" ry="22" fill="#d9a21f" stroke="#8a5f0f" stroke-width="1.2"/>'
          + '<ellipse cx="0" cy="-42" rx="4" ry="6" fill="#1f8a8a" stroke="#0e4a4a" stroke-width=".8"/></g>';
      });
      let scallops = '';
      for (let i = 0; i < 20; i++) {
        scallops += '<circle cx="' + (300 + 64 * Math.cos(i * Math.PI / 10)).toFixed(1) + '" cy="' + (300 + 64 * Math.sin(i * Math.PI / 10)).toFixed(1)
          + '" r="9" fill="#dfe4e7" stroke="#9aa3a8" stroke-width="1.5"/>';
      }
      return '<g class="plate">'
        + '<defs>'
        + '<radialGradient id="trWine" cx=".4" cy=".35" r=".9"><stop offset="0" stop-color="#a02347"/><stop offset=".6" stop-color="#6a1230"/><stop offset="1" stop-color="#4a0c22"/></radialGradient>'
        + '<linearGradient id="trRim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6dc7a"/><stop offset=".5" stop-color="#c9921c"/><stop offset="1" stop-color="#e8c25a"/></linearGradient>'
        + '<linearGradient id="trGoldV" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f6dc7a"/><stop offset=".5" stop-color="#d9a21f"/><stop offset="1" stop-color="#f6dc7a"/></linearGradient>'
        + '<linearGradient id="trGoldH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6dc7a"/><stop offset=".5" stop-color="#d9a21f"/><stop offset="1" stop-color="#f6dc7a"/></linearGradient>'
        + '<radialGradient id="trFoil" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#f4f6f7"/><stop offset="1" stop-color="#a9b2b7"/></radialGradient>'
        + '<pattern id="trLat" width="36" height="36" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0H36M0 0V36" stroke="#e6b94f" stroke-opacity=".2" stroke-width="1.2" fill="none"/></pattern>'
        + '<clipPath id="trClip"><circle cx="300" cy="300" r="232"/></clipPath>'
        + '</defs>'
        + '<circle cx="300" cy="300" r="272" fill="url(#trRim)" stroke="#8a5f0f" stroke-width="3" filter="url(#shadow)"/>'
        + tiles
        + '<circle cx="300" cy="300" r="247" fill="none" stroke="#8a5f0f" stroke-width="2"/>'
        + '<circle cx="300" cy="300" r="240" fill="none" stroke="#f6dc7a" stroke-width="5" stroke-dasharray="0.1 9" stroke-linecap="round"/>'
        + '<circle cx="300" cy="300" r="232" fill="url(#trWine)" stroke="#8a5f0f" stroke-width="2"/>'
        + '<circle cx="300" cy="300" r="232" fill="url(#trLat)"/>'
        + '<g clip-path="url(#trClip)">'
        + '<rect x="288" y="60" width="24" height="480" fill="url(#trGoldV)"/>'
        + '<rect x="60" y="288" width="480" height="24" fill="url(#trGoldH)"/>'
        + '<path d="M292 60V540M308 60V540M60 292H540M60 308H540" stroke="#8a5f0f" stroke-opacity=".5" stroke-width="1" fill="none"/>'
        + '</g>'
        + '<circle cx="306" cy="308" r="76" fill="#000" fill-opacity=".3"/>'
        + '<circle cx="300" cy="300" r="74" fill="#cfd5d9" stroke="#9aa3a8" stroke-width="2"/>' + scallops
        + '<circle cx="300" cy="300" r="64" fill="url(#trFoil)" stroke="#9aa3a8" stroke-width="2"/>'
        + '<g transform="translate(300 300) scale(.9)">' + fan
        + '<path d="M-4 6 Q-14 -8 -8 -22" fill="none" stroke="#c8921a" stroke-width="8" stroke-linecap="round"/>'
        + '<ellipse cx="0" cy="16" rx="15" ry="19" fill="#c8921a" stroke="#8a5f0f" stroke-width="1.5"/>'
        + '<ellipse cx="2" cy="18" rx="8" ry="12" fill="#1f8a8a" stroke="#0e4a4a" stroke-width="1"/>'
        + '<circle cx="-8" cy="-26" r="5.5" fill="#c8921a" stroke="#8a5f0f" stroke-width="1.2"/>'
        + '<path d="M-8 -31 L-10 -38 M-8 -31 L-6 -38 M-8 -31 L-8 -39" stroke="#8a5f0f" stroke-width="1.4"/>'
        + '<path d="M-13 -26 L-19 -24 L-13 -23 Z" fill="#8a5f0f"/></g>'
        + flowers
        + '<path d="M110 190 Q170 90 320 70" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="12" stroke-linecap="round"/>'
        + '<path d="M495 410 Q440 500 300 530" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="10" stroke-linecap="round"/>'
        + '</g>';
    }
  },
  {
    id: 'box', label: 'Sweet gift box', light: true, noRings: true,
    meals: ['Saree'],
    // nine compartments: sweets fill the top and middle-left/right, special items fill the centre and bottom row
    slots: {
      sweet:   [[142, 142, 62], [300, 142, 62], [458, 142, 62], [142, 300, 62], [458, 300, 62]],
      special: [[300, 300, 62], [142, 458, 62], [300, 458, 62], [458, 458, 62]]
    },
    draw: function () {
      let cells = '', rivets = '', petals = '';
      [68, 226, 384].forEach(function (y) {
        [68, 226, 384].forEach(function (x) {
          cells += '<rect x="' + x + '" y="' + y + '" width="148" height="148" rx="14" fill="url(#bxCell)" stroke="#f0cf6a" stroke-width="3"/>'
            + '<rect x="' + (x + 4) + '" y="' + (y + 4) + '" width="140" height="140" rx="11" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="3"/>';
        });
      });
      [[60, 60], [540, 60], [60, 540], [540, 540]].forEach(function (p) {
        rivets += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5" fill="#f6dc7a" stroke="#7a5a10" stroke-width="1.5"/>';
      });
      [[20, 150, 20], [585, 330, -30], [30, 545, 55], [575, 70, 70], [300, 12, 0]].forEach(function (p) {
        petals += '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="11" ry="17" transform="rotate(' + p[2] + ' ' + p[0] + ' ' + p[1] + ')" fill="#a8142f" fill-opacity=".85"/>';
      });
      return '<g class="plate">'
        + '<defs>'
        + '<linearGradient id="bxPink" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d81b73"/><stop offset="1" stop-color="#8c0e47"/></linearGradient>'
        + '<linearGradient id="bxGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0cf6a"/><stop offset=".5" stop-color="#c9921c"/><stop offset="1" stop-color="#e8c25a"/></linearGradient>'
        + '<radialGradient id="bxCell" cx=".4" cy=".35" r=".9"><stop offset="0" stop-color="#9a6618"/><stop offset="1" stop-color="#54320a"/></radialGradient>'
        + '</defs>'
        + petals
        + '<rect x="40" y="46" width="532" height="532" rx="16" fill="#000" fill-opacity=".3"/>'
        + '<rect x="34" y="34" width="532" height="532" rx="16" fill="url(#bxPink)" stroke="#5e0a2e" stroke-width="3"/>'
        + '<rect x="52" y="52" width="496" height="496" rx="9" fill="url(#bxGold)" stroke="#7a5a10" stroke-width="2.5"/>'
        + '<rect x="58" y="58" width="484" height="484" rx="6" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/>'
        + cells + rivets
        + '<path d="M70 70 L300 70" stroke="#fff" stroke-opacity=".22" stroke-width="6" stroke-linecap="round"/>'
        + '</g>';
    }
  }
];

// A slot is [x, y, r] (one round spot) or [[x, y, r], [x, y, r], ...] (several compartments of the same kind).
function cellsOf(slot) { return Array.isArray(slot[0]) ? slot : [slot]; }

// Draw a vessel (and its slots) into an <svg> element.
window.renderVessel = function (svg, vessel) {
  let html = '<defs>'
    + '<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">'
    + '<feDropShadow dx="6" dy="10" stdDeviation="9" flood-color="#000" flood-opacity="0.25"/></filter>'
    + '</defs>';
  html += vessel.draw();
  html += '<g class="slots">';
  Object.keys(vessel.slots).forEach(function (zone) {
    cellsOf(vessel.slots[zone]).forEach(function (s) {
      if (!vessel.noRings) html += '<circle class="slot" cx="' + s[0] + '" cy="' + s[1] + '" r="' + s[2] + '"/>';
      html += '<text class="slot-label" x="' + s[0] + '" y="' + (s[1] + 5) + '"'
        + (vessel.light ? ' style="fill:rgba(255,255,255,.88)"' : '') + '>'
        + window.ZONE_LABELS[zone] + '</text>';
    });
  });
  html += '</g>';
  if (vessel.outside) {   // space outside the banana leaf: water bottles on top, cup sweets underneath
    html += '<g class="slots"><rect class="slot" x="130" y="12" width="340" height="108" rx="20"/>'
      + '<text class="slot-label out-label" data-for="water" x="300" y="70">Water Bottles</text>'
      + '<rect class="slot" x="90" y="480" width="420" height="112" rx="20"/>'
      + '<text class="slot-label out-label" data-for="cup" x="300" y="540">Cup Sweets</text></g>';
  }
  svg.innerHTML = html;   // safe here: this is our own fixed markup, not visitor input
};

// ---- dishes on the plate ----
window.ZONE_COLORS = {
  starter: '#e8a33d', sweet: '#d4682a', side: '#b5532f', special: '#c2557a',
  rice: '#f6efd2', curry: '#c4631f', drink: '#4aa3c7'
};

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// One compartment: lay its dishes out inside the circle [cx, cy, r].
function cellHtml(cell, dishes, zone, newKey) {
  const cx = cell[0], cy = cell[1], r = cell[2];
  const n = dishes.length;
  const br = n === 1 ? r * 0.62 : Math.max(8, Math.min(r * 0.55, r * 0.72 / Math.sqrt(n)));
  let html = '';
  dishes.forEach(function (d, i) {
    let x = cx, y = cy;
    if (n > 1) {
      const dist = (r - br - 2) * Math.sqrt((i + 0.5) / n);
      const ang = i * 2.39996;
      x = cx + dist * Math.cos(ang);
      y = cy + dist * Math.sin(ang);
    }
    const isNew = newKey === '*' || newKey === d.key;
    const art = (d.cat === window.JUICE_CAT)
      ? window.juiceGlass(d.en, isNew)
      : window.foodArt(d.en, zone, d.cat);
    html += '<g><title>' + escapeXml(d.en) + '</title>'
      + '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(' + (br / 19).toFixed(3) + ')">'
      + '<g class="dish-blob' + (isNew ? ' new' : '') + '">' + art + '</g></g>';
    if (n === 1 && br >= 18) {
      html += '<text class="dish-text" x="' + x.toFixed(1) + '" y="' + (y + br + 13).toFixed(1) + '" fill="#fff">'
        + escapeXml(d.en) + '</text>';
    }
    html += '</g>';
  });
  return html;
}

// Every picked dish in a neat grid inside area a = {x, y, w, h}, name underneath
const ZONE_ORDER = ['starter', 'sweet', 'side', 'special', 'curry', 'rice', 'drink'];
// Banana-leaf serving order: top half = pickles, snacks, curries, sweets. Bottom half = rice, dal, sambar, drinks.
function isBottom(d) { return d.zone === 'rice' || d.zone === 'drink' || d.cat === 'Dal Items' || d.cat === 'South Indian Liquids'; }
function serveRank(d) {
  if (d.zone === 'rice') return 10 + ['Roti', 'Rice', 'Biryani Rice'].indexOf(d.cat);
  if (d.cat === 'Dal Items') return 14;
  if (d.cat === 'South Indian Liquids') return 15;
  if (d.zone === 'drink') return 16;
  if (d.zone === 'side') return (d.cat === 'Pickles & Chutneys' || d.cat === 'Podulu') ? 0 : 1;
  if (d.zone === 'curry') return d.cat === 'South Indian Fry' ? 3 : 3.2;
  return { starter: 2, sweet: 4, special: 5 }[d.zone] || 6;
}
function gridHtml(dishes, a, newKey) {
  const n = dishes.length;
  if (!n) return '';
  let best = { cell: 0, cols: 1 };
  for (let c = 1; c <= n; c++) {                       // try every column count, keep the biggest cell
    const cell = Math.min(a.w / c, a.h / Math.ceil(n / c), 120);
    if (cell > best.cell) best = { cell: cell, cols: c };
  }
  const cols = best.cols, rows = Math.ceil(n / cols), cell = best.cell;
  const labels = cell >= 50;                           // names hide only when the grid gets very crowded
  const sc = Math.min(2.2, (labels ? cell - 20 : cell - 6) / 42);
  const fs = Math.max(8, Math.min(12, cell / 7));
  const maxCh = Math.max(6, Math.floor(cell / (fs * 0.55)));
  const top = a.y + (a.h - rows * cell) / 2;
  let html = '';
  dishes.forEach(function (d, i) {
    const r = Math.floor(i / cols), c = i % cols, inRow = Math.min(cols, n - r * cols);
    const x = a.x + a.w / 2 + (c - (inRow - 1) / 2) * cell;
    const y = top + r * cell + cell / 2 - (labels ? 8 : 0);
    const isNew = newKey === '*' || newKey === d.key;
    const art = (d.cat === window.JUICE_CAT) ? window.juiceGlass(d.en, isNew) : window.foodArt(d.en, d.zone, d.cat);
    const name = d.en.length > maxCh ? d.en.slice(0, maxCh - 1) + '…' : d.en;
    html += '<g><title>' + escapeXml(d.en) + '</title>'
      + '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(' + sc.toFixed(2) + ')">'
      + '<g class="dish-blob' + (isNew ? ' new' : '') + '">' + art + '</g></g>'
      + (labels ? '<text class="dish-text" style="font-size:' + fs.toFixed(1) + 'px" x="' + x.toFixed(1) + '" y="' + (y + 21 * sc + fs + 1).toFixed(1) + '" fill="#fff">' + escapeXml(name) + '</text>' : '')
      + '</g>';
  });
  return html;
}

// Items that sit OUTSIDE the plate: ys = row heights, xs (optional) = fixed x positions
function outsideHtml(list, ys, newKey, xs) {
  const rows = ys.length, per = Math.ceil(list.length / rows);
  let html = '';
  list.forEach(function (d, i) {
    const r = Math.floor(i / per), inRow = Math.min(per, list.length - r * per), c = i - r * per;
    const gap = Math.min(110, 520 / inRow), sc = xs ? 1.5 : Math.min(rows > 1 ? 1.45 : 2.2, gap / 30);
    const x = xs ? xs[i % xs.length] : 300 + (c - (inRow - 1) / 2) * gap, y = ys[r];
    const isNew = newKey === '*' || newKey === d.key;
    html += '<g><title>' + escapeXml(d.en) + '</title><g transform="translate(' + x.toFixed(1) + ' ' + y + ') scale(' + sc.toFixed(2) + ')">'
      + '<g class="dish-blob' + (isNew ? ' new' : '') + '">' + window.foodArt(d.en, d.zone, d.cat) + '</g></g>'
      + (rows === 1 && !xs ? '<text class="dish-text" x="' + x.toFixed(1) + '" y="' + (y + 22 * sc + 10).toFixed(1) + '" fill="#fff">' + escapeXml(d.en) + '</text>' : '') + '</g>';
  });
  return html;
}

// picked = [{ key, en, zone, cat }]   newKey = the dish to pop in ('*' = all of them)
window.renderDishes = function (svg, vessel, picked, newKey) {
  const old = svg.querySelector('.dishes');
  if (old) old.remove();

  const waterL = picked.filter(function (d) { return d.zone === 'water'; });
 const cupL = vessel.outside ? picked.filter(function (d) { return (d.zone === 'sweet' && window.isCupSweet(d.en)) || d.cat === 'Ice Creams' || /^pan$/i.test(d.en); }) : [];
  const byZone = {};
  picked.forEach(function (d) { if (waterL.indexOf(d) < 0 && cupL.indexOf(d) < 0) (byZone[d.zone] = byZone[d.zone] || []).push(d); });

  svg.querySelectorAll('.slot-label').forEach(function (lbl) {
    const used = Object.keys(byZone).some(function (z) { return window.ZONE_LABELS[z] === lbl.textContent; });
    lbl.style.opacity = used ? 0 : 1;
  });

  let html = '<g class="dishes">';
  svg.querySelectorAll('.out-label').forEach(function (l) { l.style.opacity = (l.dataset.for === 'cup' ? cupL : waterL).length ? 0 : 1; });
  if (vessel.outside) html += outsideHtml(waterL.concat(cupL), [58], newKey);   // one row on top
else if (waterL.length) html += outsideHtml(waterL, [548], newKey, [58, 542]);
if (vessel.grid) {
  const rest = picked.filter(function (d) { return waterL.indexOf(d) < 0 && cupL.indexOf(d) < 0; });
  const g = vessel.grid;
  if (vessel.serve) {
    const byRank = function (a, b) { return serveRank(a) - serveRank(b); };
    const topL = rest.filter(function (d) { return !isBottom(d); }).sort(byRank);
    const botL = rest.filter(isBottom).sort(byRank);
    const share = (topL.length && botL.length) ? Math.max(0.38, Math.min(0.62, topL.length / (topL.length + botL.length))) : 1;
    const hT = topL.length ? (botL.length ? g.h * share : g.h) : 0;
    html += gridHtml(topL, { x: g.x, y: g.y, w: g.w, h: hT }, newKey)
          + gridHtml(botL, { x: g.x, y: g.y + hT, w: g.w, h: g.h - hT }, newKey);
  } else {
    rest.sort(function (a, b) { return ZONE_ORDER.indexOf(a.zone) - ZONE_ORDER.indexOf(b.zone); });
    html += gridHtml(rest, g, newKey);
  }
}
    if (!vessel.grid) Object.keys(byZone).forEach(function (zone) {
    const slot = vessel.slots[zone];
    if (!slot) return;
    const cells = cellsOf(slot);
    const dishes = byZone[zone].slice(0, 14);
    // dishes are dealt out one by one: 1st -> 1st compartment, 2nd -> 2nd compartment, ...
    cells.forEach(function (cell, ci) {
      html += cellHtml(cell, dishes.filter(function (d, i) { return i % cells.length === ci; }), zone, newKey);
    });
    if (byZone[zone].length > 14) {
      html += '<text class="dish-text" x="' + cells[0][0] + '" y="' + (cells[0][1] + cells[0][2] + 14) + '" fill="#fff">+'
        + (byZone[zone].length - 14) + ' more</text>';
    }
  });

  html += '</g>';
  svg.insertAdjacentHTML('beforeend', html);
};