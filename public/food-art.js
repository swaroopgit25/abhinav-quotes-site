// Draws a small picture of a dish, centred on 0,0, about 20 units radius.
// To add or change a dish picture, edit the RULES list or byWord() below.
(function () {
  const bowl = function (c, extra) {
    return '<circle r="20" fill="#efe9d8" stroke="#b9ae8d" stroke-width="1.5"/><circle r="15.5" fill="' + c + '"/>'
      + (extra || '') + '<ellipse cx="-5" cy="-7" rx="7" ry="3" fill="#fff" opacity=".28"/>';
  };
  const ball = function (c, d) {
    return '<circle r="17" fill="' + c + '" stroke="' + d + '" stroke-width="1.5"/>'
      + '<ellipse cx="-5" cy="-6" rx="6" ry="4" fill="#fff" opacity=".3"/>';
  };
  const dots = function (col, n, R) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const a = i * 2.4, d = R * Math.sqrt((i + .5) / n);
      const px = (d * Math.cos(a)).toFixed(1), py = (d * Math.sin(a)).toFixed(1);
      s += '<ellipse cx="' + px + '" cy="' + py + '" rx="3.2" ry="1.7" transform="rotate(' + (i * 40) + ' ' + px + ' ' + py + ')" fill="' + col + '"/>';
    }
    return s;
  };
  const glass = function (c) {
    return '<path d="M-11 -17 L11 -17 L8 17 Q0 20 -8 17 Z" fill="#e6f3f7" fill-opacity=".55" stroke="#9cc3cf" stroke-width="1.5"/>'
      + '<path d="M-9.6 -6 L9.6 -6 L7.4 15.5 Q0 18 -7.4 15.5 Z" fill="' + c + '"/>'
      + '<rect x="-6" y="-15" width="3" height="22" rx="1.5" fill="#fff" opacity=".35"/>';
  };
  const tile = function (c) {
    return '<rect x="-15" y="-15" width="30" height="30" rx="3" transform="rotate(45)" fill="' + c + '" stroke="rgba(0,0,0,.25)" stroke-width="1.2"/>'
      + '<circle r="3" fill="#fff" opacity=".5"/>';
  };
  const rice = function (c, spot) {
    return '<ellipse cy="4" rx="19" ry="12" fill="' + c + '" stroke="rgba(0,0,0,.18)"/>'
      + '<path d="M-15 4 Q0 -22 15 4 Z" fill="' + c + '" stroke="rgba(0,0,0,.18)"/>'
      + (spot ? dots(spot, 10, 11) : '<ellipse cx="-4" cy="-5" rx="5" ry="3" fill="#fff" opacity=".5"/>');
  };
  const flat = function (c, spot) {
    return '<circle r="18" fill="' + c + '" stroke="rgba(0,0,0,.25)" stroke-width="1.3"/>' + dots(spot, 9, 12);
  };
  const tri = function (c) {
    return '<path d="M0 -18 L18 14 L-18 14 Z" fill="' + c + '" stroke="#8c5a14" stroke-width="1.5" stroke-linejoin="round"/>'
      + '<path d="M0 -8 L9 8 L-9 8 Z" fill="#fff" opacity=".18"/>';
  };

  // [words in the dish name, picture]. null = use byWord() below.
  const RULES = [
    [/vada|garelu|bullet|bonda/, '<circle r="18" fill="#c98a2b" stroke="#8c5a14" stroke-width="1.5"/><circle r="6" fill="#5a3a10"/><ellipse cx="-7" cy="-9" rx="6" ry="2.5" fill="#fff" opacity=".3"/>'],
    [/idly|idli/, '<ellipse cy="8" rx="18" ry="8" fill="#e9e4d2"/><path d="M-17 8 Q0 -26 17 8 Z" fill="#fffdf4" stroke="#d6cfb6" stroke-width="1.5"/><ellipse cx="-5" cy="-3" rx="5" ry="3" fill="#fff"/>'],
    [/dosa|uthappam|pesar?attu/, '<path d="M-19 10 Q-8 -22 19 -12 Q10 8 -19 10 Z" fill="#dfa94a" stroke="#9a6a1c" stroke-width="1.5"/><path d="M-12 6 Q0 -10 14 -9" stroke="#f4d28a" stroke-width="3" fill="none"/>'],
    [/puri|poori|bhatura|kachori|papad|appadam/, '<circle r="18" fill="#e3a43a" stroke="#9a6a1c" stroke-width="1.5"/><circle r="12" fill="#f2c264"/><ellipse cx="-6" cy="-7" rx="6" ry="3" fill="#fff" opacity=".35"/>'],
    [/jalebi|jilebi|jangri/, '<path d="M0 0 m0 0 a3 3 0 1 1 6 0 a6 6 0 1 1 -12 0 a9 9 0 1 1 18 0 a12 12 0 1 1 -24 0 a15 15 0 1 1 30 0" transform="translate(-3 0)" fill="none" stroke="#e8761c" stroke-width="3.4" stroke-linecap="round"/>'],
    [/gulab|jamoon|jamun|kala jam/, ball('#6b2e14', '#3e1708')],
    [/laddu|ladoo|sunnundalu|bobatlu/, ball('#e59a2c', '#a8650f') + dots('#b9740f', 12, 11)],
    [/bajji/, '<path d="M-17 8 Q-6 -16 14 -12 Q19 -10 15 -4 Q2 4 -17 8 Z" fill="#d8a64a" stroke="#8c5a14" stroke-width="1.5"/><path d="M-14 6 Q-4 -10 12 -9" stroke="#f1d08a" stroke-width="3" fill="none"/><path d="M15 -9 L19 -14" stroke="#3b7a2a" stroke-width="3" stroke-linecap="round"/>'],
    [/tea|coffee|bournvita|horlicks|^milk$/, '<path d="M-14 -6 H10 V6 Q10 16 0 16 H-4 Q-14 16 -14 6 Z" fill="#f4efe2" stroke="#b9ae8d" stroke-width="1.5"/><ellipse cx="-2" cy="-6" rx="12" ry="3" fill="#8a5a2b"/><path d="M10 -2 Q19 -2 19 4 Q19 9 10 9" fill="none" stroke="#b9ae8d" stroke-width="2.5"/>']
  ];

  const byWord = function (n, z) {
    if (/roti|naan|chapathi|pulka|parota|kulcha|romali/.test(n)) return flat('#e2b36a', '#9a6a2a');
    if (/burfee|burfi|katli|pak$|peda|barfi|kalakhand|mothi|chakki|kaja|petha|roll/.test(n))
      return tile(/choco/.test(n) ? '#6b3a1c' : /pista/.test(n) ? '#9bbb5a' : /kaju|katli|badam/.test(n) ? '#e9d3a0' : '#f0c36a');
    if (/halwa|kesari/.test(n))
      return bowl(/carrot|gajar/.test(n) ? '#e0661c' : /kesari/.test(n) ? '#f0a020' : '#c98a2b', '<circle cx="-3" cy="-2" r="2.3" fill="#fff" opacity=".6"/><circle cx="4" cy="3" r="2.3" fill="#fff" opacity=".6"/>');
    if (/samosa|cutlet|spring|pakoda|pakodi|manchuria|65|kabab|tikka/.test(n)) return tri(/manchuria|65/.test(n) ? '#c0452a' : '#dba03c');
    if (/biryani|pulav|pulao|bath|fried rice|baghara|khichdi/.test(n)) return rice('#e9c47a', '#b9742a');
    if (/pulihora|lemon|nimma/.test(n)) return rice('#f2d545', '#7a9a2a');
    if (/tomato rice|tomato bath/.test(n)) return rice('#e8743a', '#c04a1a');
    if (/pongal|upma|curd rice/.test(n)) return rice('#f6efd2');
    if (/rice/.test(n)) return rice('#fbf8ee');
    if (/ice cream|vanilla|strawberry|butterscotch|tutti/.test(n)) {
      const c = /strawberry/.test(n) ? '#f4a3b8' : /butterscotch/.test(n) ? '#e8b24a' : /mango|orange/.test(n) ? '#f5a623' : /tutti/.test(n) ? '#f7c4d4' : '#fbf1c9';
      return '<path d="M-9 2 L9 2 L0 19 Z" fill="#d9a35a" stroke="#a8742a" stroke-width="1.3"/><circle cy="-4" r="11" fill="' + c + '" stroke="rgba(0,0,0,.2)"/><ellipse cx="-4" cy="-8" rx="4" ry="2.5" fill="#fff" opacity=".5"/>';
    }
    if (/payasam|kheer|custard|basundhi|rabdi|rasmalai|rasagulla/.test(n))
      return bowl('#f8ecc8', '<circle cx="-4" cy="-2" r="2" fill="#c98a2b"/><circle cx="4" cy="3" r="2" fill="#c98a2b"/><circle cx="3" cy="-5" r="2" fill="#7a9a2a"/>');
    if (/soup/.test(n)) return bowl(/tomato/.test(n) ? '#d94a2a' : /corn/.test(n) ? '#f2d868' : '#c9a85a');
    if (/juice|punch|rasna|cool drink|milk shake|badam milk|water|fruit/.test(n))
      return glass(/orange/.test(n) ? '#f5a020' : /mango/.test(n) ? '#f7b92a' : /grape/.test(n) ? '#7a3a8a' : /watermelon|punch|rasna/.test(n) ? '#e8445a' : /carrot/.test(n) ? '#e87a1c' : /lemon|sapota|banana|water/.test(n) ? '#f2e58a' : /milk|badam/.test(n) ? '#f3e6c4' : '#e8a040');
    if (/pickle|chutney|pachadi|podi|karam|avakaya|ava$|gongura|mango|tomato$|chintakaya|mirchi|raita|curd|perugu|salad/.test(n))
      return bowl(/pudina|kothimeera|raita|curd|perugu/.test(n) ? '#e9f0d0' : /gongura/.test(n) ? '#6a8a2a' : /podi|karam/.test(n) ? '#a8321a' : /kobbari|coconut/.test(n) ? '#fff6e0' : '#c0451e');
    if (/sambar|rasam|pulusu|charu|dappalam/.test(n))
      return bowl(/rasam|charu/.test(n) ? '#b8501e' : '#c98a2b', '<circle cx="-4" cy="2" r="1.8" fill="#6b8a2a"/><circle cx="4" cy="-3" r="1.8" fill="#e0782a"/>');
    if (/pappu|dal/.test(n)) return bowl(/palak|thotakura|gongura|chukka|menthi/.test(n) ? '#8a9a3a' : '#e8c24a');
    if (z === 'curry')
      return bowl(/palak|methi/.test(n) ? '#6a8a3a' : /paneer|butter|shahi|kofta|malai|kurma/.test(n) ? '#e8883a' : /fry|chips|kobbari/.test(n) ? '#b3752a' : '#c9531e',
        '<rect x="-5" y="-4" width="5" height="5" rx="1" fill="#f3e3b8" opacity=".85"/><rect x="2" y="1" width="5" height="5" rx="1" fill="#f3e3b8" opacity=".85"/>');
    if (z === 'sweet') return ball('#e59a2c', '#a8650f');
    if (z === 'drink') return glass('#e8a040');
    if (z === 'starter') return tri('#dba03c');
    if (z === 'rice') return rice('#fbf8ee');
    return ball('#d4a037', '#8c6a1c');
  };

      // ---------- Welcome Drinks: two glass styles, juice pours in ----------
  window.JUICE_CAT = 'Fruit Juices & Fruit Chat';
  window.glassStyle = 'plastic';
  window.GLASSES = [
    { id: 'plastic', label: 'Clear plastic glass' },
    { id: 'paper', label: 'Paper juice cup' }
  ];
  let glassId = 0;

  const juiceColor = function (n) {
    n = n.toLowerCase();
    return /orange/.test(n) ? '#f5a020' : /mango/.test(n) ? '#f7b92a' : /pineapple/.test(n) ? '#f2d04a'
      : /grape/.test(n) ? '#7a3a8a' : /watermelon|punch|rasna/.test(n) ? '#e8445a' : /carrot/.test(n) ? '#e87a1c'
      : /apple/.test(n) ? '#d8b04a' : /lemon|sapota|banana/.test(n) ? '#f2e58a' : /milk|badam/.test(n) ? '#f3e6c4'
      : /cocktail|mixed|fruit/.test(n) ? '#e8604a' : '#e8a040';
  };

  // small fruit picture printed on the paper cup
  const fruitIcon = function (n) {
    n = n.toLowerCase();
    if (/orange/.test(n)) return '<circle r="5" fill="#f5a020" stroke="#c97a10" stroke-width=".6"/><path d="M0 -5 Q4 -9 7 -6 Q3 -3 0 -5Z" fill="#4a9a2a"/>';
    if (/pineapple/.test(n)) return '<ellipse ry="5.5" rx="4" fill="#f2c23a"/><path d="M-3 -5 L0 -10 L3 -5Z" fill="#3a8a2a"/>';
    if (/apple/.test(n)) return '<circle r="5" fill="#d83a2a"/><path d="M0 -5 Q1 -8 3 -8" stroke="#4a7a2a" fill="none" stroke-width="1"/>';
    if (/grape/.test(n)) return '<circle cx="-2.4" cy="-1.5" r="2.6" fill="#7a3a8a"/><circle cx="2.4" cy="-1.5" r="2.6" fill="#7a3a8a"/><circle cy="2.6" r="2.6" fill="#8a4a9a"/>';
    if (/mango/.test(n)) return '<ellipse rx="5" ry="4" fill="#f5b020" transform="rotate(-25)"/>';
    if (/lemon|sapota|banana/.test(n)) return '<ellipse rx="5" ry="3.6" fill="#f2e04a"/>';
    if (/watermelon|punch|rasna|mixed|cocktail|fruit/.test(n)) return '<circle r="5" fill="#e8445a" stroke="#3a8a2a" stroke-width="1"/>';
    return '<circle r="5" fill="#f5a020"/>';
  };

  // animate = juice pours in. empty = glass with nothing in it.
  window.juiceGlass = function (name, animate, empty) {
    const id = 'jg' + (++glassId), c = juiceColor(name), paper = window.glassStyle === 'paper';
    const body = paper
      ? 'M-14 -16 L-10 17 Q-9.7 18.5 -8 18.5 L8 18.5 Q9.7 18.5 10 17 L14 -16 Z'
      : 'M-14.5 -14 L-12.8 9 L-10.2 12 L-9.8 17 Q-9.6 18.5 -8 18.5 L8 18.5 Q9.6 18.5 9.8 17 L10.2 12 L12.8 9 L14.5 -14 Z';
    let s = '<defs><clipPath id="' + id + '"><path d="' + body + '"/></clipPath></defs>'
      + '<ellipse cx="0" cy="19.6" rx="12" ry="2" fill="#000" opacity=".25"/>';

    if (paper) {
      s += '<path d="' + body + '" fill="#fbfaf5"/>'
        + '<g clip-path="url(#' + id + ')">'
        + '<rect x="-15" y="4" width="30" height="8" fill="' + c + '"/>'
        + '<text x="0" y="9.8" text-anchor="middle" font-size="5.4" font-weight="800" fill="#fff" font-family="DM Sans,Arial,sans-serif" letter-spacing=".4">FRESH</text>'
        + '<g transform="translate(0 -5.5)">' + fruitIcon(name) + '</g>'
        + '<rect x="-15" y="-16" width="8" height="36" fill="#000" opacity=".06"/></g>'
        + '<path d="' + body + '" fill="none" stroke="#cfcfc2" stroke-width="1.1" stroke-linejoin="round"/>'
        + '<ellipse cx="0" cy="-16" rx="14.2" ry="2.9" fill="#fff" stroke="#cfcfc2" stroke-width="1.1"/>'
        + '<ellipse cx="0" cy="-16" rx="12.6" ry="2.2" fill="' + ((empty || animate) ? '#4a4a44' : c) + '"/>'
        + ((!empty && animate) ? '<ellipse class="juice-top" cx="0" cy="-16" rx="12.6" ry="2.2" fill="' + c + '"/>' : '');
    } else {
      s += '<path d="' + body + '" fill="#e8f4f8" fill-opacity=".14"/>';
      if (!empty) {
        s += '<g clip-path="url(#' + id + ')"><g class="juice-liquid' + (animate ? ' pour' : '') + '">'
          + '<rect x="-16" y="-9" width="32" height="30" fill="' + c + '" fill-opacity=".93"/>'
          + '<ellipse cx="0" cy="-9" rx="14" ry="2.4" fill="#fff" fill-opacity=".38"/></g></g>';
      }
      s += '<path d="' + body + '" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1.2" stroke-linejoin="round"/>'
        + '<ellipse cx="0" cy="-14" rx="15.6" ry="3.2" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="1.2"/>'
        + '<path d="M-12.8 9 L12.8 9" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>'
        + '<path d="M-5 -12 L-4.4 9 M5 -12 L4.4 9" stroke="#fff" stroke-opacity=".28" stroke-width="1"/>'
        + '<path d="M-10.5 -10 L-9.2 7" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" stroke-linecap="round"/>';
    }
    if (animate && !empty) {   // the stream of juice falling in
      s += '<g class="juice-stream"><rect x="-2.2" y="-42" width="4.4" height="' + (paper ? 26 : 58) + '" rx="2.2" fill="' + c + '"/>'
        + '<rect x="-1" y="-42" width="1.2" height="' + (paper ? 26 : 58) + '" fill="#fff" fill-opacity=".35"/></g>';
    }
    return s;
  };

  // Welcome Drinks table: one glass per picked juice, no plate
  window.renderDrinkTray = function (svg, picked, newKey) {
    let html = '<g class="dishes">';
    const list = picked.slice(0, 20), n = list.length;
    if (!n) {
      html += '<g transform="translate(300 290) scale(7)" opacity=".5">' + window.juiceGlass('', false, true) + '</g>'
        + '<text class="tray-hint" x="300" y="470">Pick a juice from the Items panel</text>';
    } else {
      const cols = n <= 3 ? n : n <= 8 ? 4 : 5, rows = Math.ceil(n / cols);
      const cw = 560 / cols, ch = Math.min(280, 560 / rows);
      const sc = Math.min(cw / 36, (ch - 26) / 64, 7);
      const fs = Math.max(9, Math.min(15, sc * 2.2));
      list.forEach(function (d, i) {
        const r = Math.floor(i / cols), c = i % cols;
        const inRow = (r === rows - 1) ? n - r * cols : cols;
        const x = 300 + (c - (inRow - 1) / 2) * cw, y = 300 + (r - (rows - 1) / 2) * ch;
        const isNew = newKey === '*' || newKey === d.key;
        html += '<g><title>' + d.en + '</title>'
          + '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(' + sc.toFixed(2) + ')">'
          + '<g class="dish-blob' + (isNew ? ' new' : '') + '">' + window.juiceGlass(d.en, isNew) + '</g></g>'
          + '<text class="tray-name" style="font-size:' + fs.toFixed(1) + 'px" x="' + x.toFixed(1) + '" y="' + (y + 24 * sc).toFixed(1) + '">'
          + d.en.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</text></g>';
      });
    }
    svg.innerHTML = html + '</g>';
  };
  // ---------- Tea cup: yellow "Chai Joy" paper cup ----------
  const teaColor = function (n) {
    n = n.toLowerCase();
    return /coffee/.test(n) ? '#6b3f1d' : /lemon/.test(n) ? '#d9a441' : /bournvita/.test(n) ? '#7a4a2a'
      : /horlicks/.test(n) ? '#b98a54' : /milk/.test(n) ? '#f3e6c4' : '#c68642';
  };
  window.teaCup = function (name) {
    const body = 'M-12.5 -13 L-9.6 15 Q-9.4 17 -7.6 17 L7.6 17 Q9.4 17 9.6 15 L12.5 -13 Z';
    return '<ellipse cx="0" cy="18.4" rx="12" ry="2" fill="#000" opacity=".25"/>'
      + '<g class="steam"><path d="M-4 -16 Q-7 -19 -4 -22" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.4" stroke-linecap="round"/>'
      + '<path d="M3 -16 Q6 -19 3 -22" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.4" stroke-linecap="round"/></g>'
      + '<path d="' + body + '" fill="#f6e51c" stroke="#c9b800" stroke-width=".8"/>'
      + '<path d="M-9.7 13.2 L9.7 13.2 L9.6 15 Q9.4 17 7.6 17 L-7.6 17 Q-9.4 17 -9.6 15 Z" fill="#fff"/>'
      + '<text x="-2.2" y="1" text-anchor="end" font-size="3.6" font-weight="900" fill="#1e7a34" font-family="Arial Black,DM Sans,sans-serif">CHAI</text>'
      + '<path d="M0 3 C-2.6 .6 -1.4 -1.2 0 -.2 C1.4 -1.2 2.6 .6 0 3 Z" fill="none" stroke="#c9a000" stroke-width=".7"/>'
      + '<text x="2.2" y="1" text-anchor="start" font-size="3.6" font-weight="900" fill="#1e7a34" font-family="Arial Black,DM Sans,sans-serif">JOY</text>'
      + '<text x="0" y="6.2" text-anchor="middle" font-size="1.9" font-weight="700" fill="#7a6a10" font-family="DM Sans,Arial,sans-serif">Cup full of Happiness</text>'
      + '<circle cx="7" cy="11" r="1.3" fill="#3a9ad9"/>'
      + '<ellipse cx="0" cy="-13" rx="13.4" ry="2.8" fill="#fff" stroke="#d8d8cc" stroke-width=".9"/>'
      + '<ellipse cx="0" cy="-13" rx="11.8" ry="2.1" fill="' + teaColor(name) + '"/>'
      + '<ellipse cx="-4" cy="-13.4" rx="3" ry=".7" fill="#fff" opacity=".3"/>';
  };

  // ---------- Sambar / Rasam: printed paper cup ----------
  const liquidColor = function (n) {
    n = n.toLowerCase();
    return /rasam|charu/.test(n) ? '#b8501e' : /majjiga/.test(n) ? '#efe6c8' : /mukkala|gujju|pachi|pulusu/.test(n) ? '#d08a2a' : '#c98a2b';
  };
  let cupId = 0;
  window.liquidCup = function (name) {
    const id = 'lc' + (++cupId), c = liquidColor(name);
    const body = 'M-15 -8 L-12 12 Q-11.8 14.2 -9.6 14.2 L9.6 14.2 Q11.8 14.2 12 12 L15 -8 Z';
    return '<defs><clipPath id="' + id + '"><path d="' + body + '"/></clipPath></defs>'
      + '<ellipse cx="0" cy="15.8" rx="14" ry="2" fill="#000" opacity=".25"/>'
      + '<path d="' + body + '" fill="#fff"/>'
      + '<g clip-path="url(#' + id + ')">'
      + '<path d="M-20 9 L10 -13" stroke="#f2d02a" stroke-width="3"/>'
      + '<path d="M-20 13 L12 -10" stroke="#6fa83a" stroke-width="5"/>'
      + '<ellipse cx="-6" cy="4" rx="3.2" ry="4.6" fill="#f2a33a" opacity=".85" transform="rotate(25 -6 4)"/>'
      + '<ellipse cx="-3" cy="8" rx="2" ry="3" fill="#e8788a" opacity=".6"/>'
      + '<path d="M3 16 L15 6" stroke="#6fa83a" stroke-width="2.6"/>'
      + '<circle cx="6" cy="2" r=".9" fill="#7ab0d8" opacity=".7"/><circle cx="9" cy="5" r=".7" fill="#7ab0d8" opacity=".7"/>'
      + '<rect x="9" y="-9" width="8" height="26" fill="#000" opacity=".07"/></g>'
      + '<path d="' + body + '" fill="none" stroke="#d6d6cc" stroke-width=".9" stroke-linejoin="round"/>'
      + '<ellipse cx="0" cy="-8" rx="15.6" ry="3.1" fill="#fff" stroke="#d6d6cc" stroke-width=".9"/>'
      + '<ellipse cx="0" cy="-8" rx="13.6" ry="2.4" fill="' + c + '"/>'
      + '<circle cx="-4" cy="-8" r=".9" fill="#6b8a2a"/><circle cx="3" cy="-7.6" r=".9" fill="#e0782a"/>'
      + '<ellipse cx="-5" cy="-8.6" rx="3.5" ry=".7" fill="#fff" opacity=".3"/>';
  };

  window.foodArt = function (name, zone, cat) {
    if (cat === window.JUICE_CAT) return window.juiceGlass(name, false);      // Welcome Drinks = glass
    if (cat === 'Hot Drinks') return window.teaCup(name);                     // tea, coffee... = Chai Joy cup
    if (cat === 'South Indian Liquids') return window.liquidCup(name);        // sambar, rasam... = printed cup
    const n = String(name).toLowerCase();
    for (let i = 0; i < RULES.length; i++) {
      if (RULES[i][0].test(n)) return RULES[i][1];
    }
    return byWord(n, zone);
  };
})();