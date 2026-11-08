// Richer, dish-specific pictures. Loaded after food-art.js: dishes it knows are drawn here,
// anything else falls back to food-art.js. To add a dish, add a rule in pick() below.
(function () {
  var base = window.foodArt;
  var st = ' stroke="rgba(0,0,0,.22)" stroke-width=".7"';
  function C(x, y, r, f) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"' + st + '/>'; }
  function O(x, y, rx, ry, f, a) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + f + '"' + st + (a ? ' transform="rotate(' + a + ' ' + x + ' ' + y + ')"' : '') + '/>'; }
  function R(x, y, s, f, a) { return '<rect x="' + (x - s / 2) + '" y="' + (y - s / 2) + '" width="' + s + '" height="' + s + '" rx="1" fill="' + f + '"' + st + ' transform="rotate(' + (a || 0) + ' ' + x + ' ' + y + ')"/>'; }
  function P(d, f, s) { return '<path d="' + d + '" fill="' + f + '" stroke="' + (s || 'rgba(0,0,0,.25)') + '" stroke-width=".9" stroke-linejoin="round"/>'; }
  function T(x, y, sz, f, t) { return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="' + sz + '" font-weight="800" fill="' + f + '" font-family="DM Sans,Arial,sans-serif">' + t + '</text>'; }
  function spark(x, y) { return '<path class="sparkle" d="M' + x + ' ' + (y - 3) + 'L' + (x + 1) + ' ' + (y - 1) + 'L' + (x + 3) + ' ' + y + 'L' + (x + 1) + ' ' + (y + 1) + 'L' + x + ' ' + (y + 3) + 'L' + (x - 1) + ' ' + (y + 1) + 'L' + (x - 3) + ' ' + y + 'L' + (x - 1) + ' ' + (y - 1) + 'Z" fill="#fff"/>'; }
  var STEAM = '<g class="steam"><path d="M-4 -17Q-7 -20 -4 -23M3 -17Q6 -20 3 -23" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.4" stroke-linecap="round"/></g>';
  function bowl(c, inner) { return '<circle r="20" fill="#efe9d8" stroke="#b9ae8d" stroke-width="1.5"/><circle r="15.5" fill="' + c + '"/><circle r="11" fill="none" stroke="#fff" stroke-opacity=".16"/>' + (inner || '') + '<ellipse cx="-5" cy="-8" rx="6" ry="2.4" fill="#fff" opacity=".25"/>'; }
  function dots(c, n, R2, r) { var s = ''; for (var i = 0; i < n; i++) { var a = i * 2.4, d = R2 * Math.sqrt((i + .5) / n); s += C((d * Math.cos(a)).toFixed(1), (d * Math.sin(a)).toFixed(1), r || 1.3, c); } return s; }

  // ---- vegetables / pieces, picked from the words in the dish name ----
  var ING = [
    [/paneer/, function (x, y) { return R(x, y, 5.4, '#fff2c4', 12); }],
    [/gobi|cauliflower/, function (x, y) { return C(x - 1.5, y, 2.6, '#f3ecd0') + C(x + 1.8, y - 1, 2.6, '#ece3c0') + C(x, y + 2, 2.4, '#f6f0da'); }],
    [/vankaya|baigan|bagara|brinjal/, function (x, y) { return O(x, y, 4.6, 2.7, '#6a3a8a', 30) + O(x + 1, y - .7, 2, .9, '#a779c4', 30); }],
    [/bendi|bendakaya/, function (x, y) { return O(x, y, 4.8, 1.7, '#6b9a3a', 20); }],
    [/alu|potato/, function (x, y) { return R(x, y, 5, '#e3be78', 20); }],
    [/capsicum|mirchi|mirapa/, function (x, y) { return O(x, y, 4.8, 1.5, '#4f9a2e', -25); }],
    [/mushroom/, function (x, y) { return P('M' + (x - 4) + ' ' + y + ' Q' + x + ' ' + (y - 6) + ' ' + (x + 4) + ' ' + y + 'Z', '#e9dcc6') + R(x, y + 1.5, 2.4, '#d8c9ad'); }],
    [/corn/, function (x, y) { return O(x, y, 4.6, 1.8, '#f2cf3a', 35); }],
    [/beans|chikkudu|mulakkaya|beerakaya|dondakaya|donda/, function (x, y) { return O(x, y, 4.6, 1.5, '#7ab040', -35); }],
    [/cabbage/, function (x, y) { return C(x, y, 3.2, '#c9dc8a') + C(x + 1, y, 1.4, '#e4efb8'); }],
    [/tomato/, function (x, y) { return C(x, y, 3, '#d8402a'); }],
    [/ulli|onion|kanda bachali/, function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="3" fill="none" stroke="#c07a9a" stroke-width="1.3"/>'; }],
    [/kakarakaya/, function (x, y) { return O(x, y, 4.4, 2, '#2f6a22', 15); }],
    [/sorakaya|dosakaya|panasa|aratikaya|chama/, function (x, y) { return R(x, y, 4.8, '#cfd88a', 25); }],
    [/kanda/, function (x, y) { return R(x, y, 4.8, '#d9a88a', 25); }],
    [/carrot/, function (x, y) { return C(x, y, 2.6, '#ef8a22'); }],
    [/kofta|bullet|vada/, function (x, y) { return C(x, y, 3.6, '#8a4a1c'); }],
    [/chole|chana|senaga|rajma|batani|matar/, function (x, y) { return O(x, y, 2.4, 1.8, '#b97a3a', 20); }],
    [/kaju/, function (x, y) { return O(x, y, 3.2, 1.4, '#f3dca0', 40); }],
    [/kobbari|coconut/, function (x, y) { return O(x, y, 3, 1.1, '#fffaf0', -20); }]
  ];
  var SPOTS = [[-6, -2], [5, -4], [0, 5], [-7, 6], [7, 4], [0, -7]];
  function pieces(n, max) { var s = '', k = 0; for (var i = 0; i < ING.length && k < max; i++) if (ING[i][0].test(n)) { var p = SPOTS[k++]; s += ING[i][1](p[0], p[1]); } return s; }

  function gravy(n) {
    return /palak|methi|thotakura|gongura|chukka|menthi|pudina|kothimeera/.test(n) ? '#6a8a2e' : /makhani|rajma/.test(n) ? '#7a2e16'
      : /paneer|butter|shahi|kofta|malai|kurma|makhan|navaratan/.test(n) ? '#eb9a45' : /kolhapuri|masala|karam|tomato|salan|dham/.test(n) ? '#c9421c'
      : /coconut|kobbari/.test(n) ? '#f0dba0' : '#d4772a';
  }
  function curry(n, dry) {
    var bub = '<circle class="bubble" cx="-9" cy="3" r="1.4" fill="#fff" opacity=".5"/><circle class="bubble" cx="8" cy="-8" r="1.2" fill="#fff" opacity=".5" style="animation-delay:.8s"/>';
    var pc = pieces(n, dry ? 6 : 3) || C(0, 0, 3, '#f3e3b8');
    return (dry ? bowl('#b9772a', pc + dots('#fffaf0', /kobbari|coconut/.test(n) ? 8 : 0, 11, 1) + dots('#5a8a2a', 4, 11, 1)) : bowl(gravy(n), pc + dots('#3f7a2a', 5, 12, .9) + bub)) + STEAM;
  }
  function riceArt(n) {
    var c = /pulihora|chinta/.test(n) ? '#e3a52a' : /nimma|lemon/.test(n) ? '#f2d545' : /mamidi/.test(n) ? '#efc94a' : /tomato/.test(n) ? '#e8743a'
      : /biryani|pulav|pulao|baghara|kaju|brinjal/.test(n) ? '#e7c06a' : /fried|schezwan|chinese/.test(n) ? '#d9b25a' : /bisi|bath|sambar|pongal|khichdi/.test(n) ? '#d9a444'
      : /zeera|jeera/.test(n) ? '#f1e6b8' : '#fbf8ee';
    var top = /pulihora|nimma|lemon|chinta|mamidi/.test(n) ? dots('#c27a14', 6, 9, 1.1) + dots('#7a9a2a', 4, 8, 1) : /kaju|biryani|pulav|pulao/.test(n) ? dots('#f6e3b0', 6, 9, 1.4) + dots('#c9552a', 3, 8, 1.1)
      : /fried|schezwan|chinese/.test(n) ? dots('#e87a1c', 5, 9, 1.1) + dots('#4f9a2e', 5, 9, 1.1) : /bisi|bath|pongal/.test(n) ? '<ellipse cx="0" cy="-5" rx="6" ry="2.4" fill="#f6dc6a" opacity=".9"/>' + dots('#6b3a14', 4, 8, .9)
      : /coconut/.test(n) ? dots('#fff', 8, 10, 1.1) : /curd/.test(n) ? dots('#c2a040', 3, 8, 1) + dots('#4f9a2e', 3, 7, 1) : /tomato/.test(n) ? dots('#4f9a2e', 4, 8, 1) : dots('#d8d2b8', 7, 10, 1);
    return '<ellipse cy="6" rx="20" ry="11" fill="#efe9d8" stroke="#b9ae8d" stroke-width="1.2"/>'
      + '<path d="M-16 6 Q0 -24 16 6 Z" fill="' + c + '" stroke="rgba(0,0,0,.2)" stroke-width=".9"/><g transform="translate(0 -1)">' + top + '</g>' + STEAM;
  }
  function bread(n) {
    if (/naan/.test(n)) return P('M0 -19 C14 -10 18 8 10 17 C4 21 -4 21 -10 17 C-18 8 -14 -10 0 -19Z', '#ecc98a') + dots('#8a5a22', 7, 11, 1.5) + (/butter/.test(n) ? R(0, 2, 6, '#fde58a', 12) : '');
    if (/parota/.test(n)) return C(0, 0, 18, '#e9c27a') + '<path d="M0 0 m0 0 a3 3 0 1 1 6 0 a6 6 0 1 1 -12 0 a9 9 0 1 1 18 0 a12 12 0 1 1 -24 0" fill="none" stroke="#b9852f" stroke-width="1.6" transform="translate(-3 0)"/>';
    if (/kulcha/.test(n)) return C(0, 0, 18, '#ecc98a') + dots('#8a5a22', 6, 11, 1.3) + dots(/pudina/.test(n) ? '#4f9a2e' : /paneer/.test(n) ? '#fff2c4' : '#fff', 8, 12, 1);
    if (/bhatura/.test(n)) return O(0, 0, 19, 14, '#e8b04a', 0) + O(-5, -5, 7, 3, '#fff', 0).replace('fill="#fff"', 'fill="#fff" opacity=".3"');
    return C(0, 0, 18, '#ecc78a') + dots('#9a6a2a', 6, 12, 1.8);
  }
  function jar(c, lid) { return '<rect x="-12" y="-12" width="24" height="30" rx="5" fill="#e8f4f8" fill-opacity=".5" stroke="#9cc3cf" stroke-width="1.3"/><rect x="-10" y="-4" width="20" height="20" rx="3" fill="' + c + '"/>' + dots('#fff', 4, 6, 1).replace(/fill="#fff"/g, 'fill="#fff" opacity=".25"') + '<rect x="-13" y="-17" width="26" height="6" rx="2" fill="' + lid + '"/><rect x="-8" y="-9" width="3" height="22" rx="1.5" fill="#fff" opacity=".35"/>'; }

  // ---- sweets served in paper cups (also placed outside the banana leaf) ----
  var CUP = /jamoon|jamun|rasagulla|rasgulla|chum chum|rasmalai|ras madhuri|double ka|qurbani|basundhi|rabdi|payasam|paramannam|kheer|custard|sreekhand|angoor|raj bhog|dil bahar/;
  window.isCupSweet = function (name) { return CUP.test(String(name).toLowerCase()); };
  function cup(fill, top, hot) {
    return '<ellipse cx="0" cy="18.4" rx="12" ry="2" fill="#000" opacity=".25"/>'
      + '<path d="M-14 -4L-10 16Q-9.5 18 -8 18H8Q9.5 18 10 16L14 -4Z" fill="#fff" stroke="#d6d6cc" stroke-width=".9"/>'
      + '<path d="M-12.4 5L12.4 5L11.4 9L-11.4 9Z" fill="#c8421e" opacity=".85"/><circle cx="0" cy="7" r="1.1" fill="#f6dc7a"/>'
      + '<ellipse cx="0" cy="-4" rx="14.4" ry="3" fill="#fff" stroke="#d6d6cc" stroke-width=".9"/><ellipse cx="0" cy="-4" rx="12.6" ry="2.3" fill="' + fill + '"/>'
      + top + (hot ? STEAM : '');
  }
  function cupSweet(n) {
    if (/jamoon|jamun/.test(n)) return cup('#c9811a', C(-6, -7, 5.2, '#5a230f') + C(6, -7, 5.2, '#5a230f') + C(0, -10, 5.4, '#6b2e14') + '<ellipse class="sheen" cx="-1.5" cy="-12" rx="2.4" ry="1.2" fill="#fff"/>');
    if (/rasagulla|rasgulla|chum chum/.test(n)) return cup('#f3e2a0', C(-5.5, -7, 5, '#fffaf0') + C(5.5, -7, 5, '#fffdf6') + C(0, -10, 5.2, '#fff'));
    if (/rasmalai/.test(n)) return cup('#f6e7b4', O(-4, -6.5, 7, 3, '#fffaf0') + O(5, -8, 6, 2.8, '#fffdf6') + '<circle cx="-4" cy="-7" r=".9" fill="#e8a020"/><circle cx="5" cy="-8" r=".9" fill="#6b9a2a"/>');
    if (/double ka/.test(n)) return cup('#d9a441', R(-5, -7, 7, '#e8b84a', 12) + R(5, -7, 7, '#d9a032', -10) + R(0, -10, 6, '#f0c35a', 25) + spark(-3, -11) + spark(6, -5) + '<circle cx="1" cy="-8" r=".9" fill="#c8e8a0"/>');
    if (/qurbani/.test(n)) return cup('#e8a03a', O(-5, -7, 5, 3.2, '#d9772a', 10) + O(5, -8, 5, 3.2, '#e08a30', -10) + '<path d="M-7 -9 Q0 -14 7 -9" stroke="#fffaf0" stroke-width="2.6" fill="none" stroke-linecap="round"/>', 0);
    if (/semiya|vermicelli/.test(n)) return cup('#f1d9a0', '<path d="M-10 -5 Q-5 -10 0 -5 Q5 0 10 -5" stroke="#fffaf0" stroke-width="1.2" fill="none"/>' + dots('#d9a040', 5, 8, 1.2), 1);
    if (/custard/.test(n)) return cup('#f7e7a8', C(-6, -6, 2.2, '#d8402a') + C(5, -7, 2.2, '#6b9a2a') + C(0, -9, 2.2, '#f5a020') + C(7, -4, 1.8, '#7a3a8a'));
    if (/sreekhand/.test(n)) return cup('#f6c85a', '<path d="M-9 -5 Q0 -14 9 -5Z" fill="#f8dc86"/>' + dots('#c9421c', 2, 4, 1) + dots('#6b9a2a', 3, 6, .9));
    if (/payasam|paramannam|kheer|basundhi|rabdi/.test(n)) return cup(/basundhi|rabdi/.test(n) ? '#f4e2b0' : '#f1dca0', dots('#c98a2b', 4, 8, 1.2) + dots('#6b9a2a', 2, 6, 1), 1);
    return cup('#e8b040', C(-5, -7, 4.6, '#e8a03a') + C(5, -7, 4.6, '#f0b04a') + spark(0, -10));
  }

  // ---- other sweets ----
  function sweet(n) {
    if (/mysore pak/.test(n)) return R(0, 0, 26, '#f0a928', 0) + dots('#b97a14', 9, 11, 1.3) + R(-5, -6, 6, '#fff', 0).replace('fill="#fff"', 'fill="#fff" opacity=".2"');
    if (/badhusha|badusha|bandar/.test(n) && !/laddu/.test(n)) return C(0, 0, 18, '#d9892e') + C(0, 0, 5, '#a8601a') + '<ellipse class="sheen" cx="-6" cy="-8" rx="6" ry="2.6" fill="#fff"/>';
    if (/peda|agra/.test(n)) return C(0, 0, 17, '#e8b562') + '<circle r="11" fill="none" stroke="#b9852f" stroke-width="1" stroke-dasharray="2 2"/>' + C(0, 0, 3, '#e8a020') + spark(7, -7);
    if (/katli/.test(n)) return R(0, 0, 25, /badam/.test(n) ? '#e0c890' : '#ecdcb0', 45) + '<rect x="-12" y="-12" width="24" height="24" fill="#d8dde0" opacity=".45" transform="rotate(45)"/>' + spark(-3, -3) + spark(5, 4);
    if (/kaja|gavvalu|chekkalu/.test(n) && !/madatha/.test(n) && !/kajjik/.test(n)) return P('M-16 0 L0 -15 L16 0 L0 15Z', '#e7b45a') + '<path d="M-10 0 L0 -9 L10 0 M-6 3L0 -3L6 3" stroke="#b9852f" stroke-width="1.2" fill="none"/>';
    if (/kajjik|kajjikayalu/.test(n)) return P('M-17 6 Q-17 -14 0 -14 Q17 -14 17 6Z', '#e0a850') + '<path d="M-17 6 H17" stroke="#9a6a1c" stroke-width="2.6" stroke-dasharray="2 1.6"/>';
    if (/pootharekulu/.test(n)) return P('M-18 -6 L14 -14 L18 4 L-14 12Z', '#f6efdc') + '<path d="M-16 0 L16 -8M-14 6L18 -2" stroke="#d8ccae" stroke-width="1"/>' + dots('#fff', 6, 10, 1);
    if (/sunnundalu/.test(n)) return C(0, 0, 17, '#4a2a14') + dots('#7a4a22', 8, 11, 1.1);
    if (/bobbatlu|boorelu|bakshalu|poornam|boobattu|bobatlu/.test(n)) return C(0, 0, 18, '#e8b04a') + '<circle r="12" fill="none" stroke="#b9852f" stroke-width=".9"/>' + dots('#fff6d0', 3, 7, 1);
    if (/arisa|ariselu|athirasam/.test(n)) return C(0, 0, 17, '#a8601a') + dots('#f6efdc', 9, 11, 1);
    if (/laddu|ladoo|boondi/.test(n)) { var c = /motichur|carrot/.test(n) ? '#f0922a' : /besan/.test(n) ? '#f2b83a' : /rava|coconut/.test(n) ? '#f6e3b0' : /dry fruit/.test(n) ? '#c98a3a' : '#e59a2c'; return C(0, 0, 17, c) + dots(/boondi|motichur/.test(n) ? '#b9740f' : '#f6e3b0', 14, 12, 1.5) + '<path d="M-3 -9 l2 -4 l2 4z" fill="#8ab04a"/>'; }
    if (/halwa|kesari/.test(n)) return bowl(/carrot|gajar|papaya/.test(n) ? '#e0661c' : /kesari/.test(n) ? '#f0a020' : /sorakaya|gummadi/.test(n) ? '#d8c870' : '#c98a2b', dots('#f3dca0', 6, 9, 1.4) + dots('#6b9a2a', 3, 7, 1) + spark(5, -5));
    return null;
  }

  // ---- snacks / tiffins / chat ----
  function snack(n, cat) {
    if (/pakoda|pakodi|punugulu|punugu/.test(n)) return C(-6, 3, 7, '#d8a64a') + C(6, 4, 7.5, '#c99038') + C(0, -6, 7.5, '#dfae52') + dots('#5a9a2e', 5, 12, 1.2);
    if (/samosa|singada/.test(n)) return P('M0 -18 L18 14 L-18 14Z', '#dba03c', '#8c5a14') + '<path d="M-10 6 L10 6M-5 -3L5 -3" stroke="#a8721c" stroke-width="1.2" stroke-dasharray="2 2"/>' + C(0, 8, 1.6, '#fff').replace('fill="#fff"', 'fill="#fff" opacity=".4"');
    if (/spring roll|shanghai|dragon/.test(n)) return '<rect x="-17" y="-8" width="34" height="16" rx="8" fill="#d9993a" stroke="#8c5a14" stroke-width="1.3" transform="rotate(-25)"/><ellipse cx="13" cy="-6" rx="3" ry="6" fill="#9fc060" transform="rotate(-25 13 -6)"/>';
    if (/manchuria|chilli|chilly/.test(n)) return bowl('#6a2a14', C(-5, -3, 4.2, '#b3652a') + C(5, -2, 4.2, '#a85a26') + C(0, 5, 4.2, '#b3652a') + dots('#7ab040', 5, 11, 1.1)) + STEAM;
    if (/-65|65/.test(n)) return bowl('#d9a03a', R(-5, -3, 6, '#d8341e', 20) + R(5, -1, 6, '#e0421e', -10) + R(0, 6, 6, '#c8341e', 30) + O(7, -8, 3.4, 1.2, '#3f8a2a', 30)) + STEAM;
    if (/noodles/.test(n)) return bowl('#e8c36a', '<path d="M-10 -4 Q-4 -12 2 -4 T12 -4 M-11 2 Q-5 -6 1 2 T12 2 M-9 8 Q-3 0 3 8 T11 8" stroke="#c99038" stroke-width="1.8" fill="none"/>' + dots('#4f9a2e', 4, 9, 1)) + STEAM;
    if (/kabab|kebab|tikka|sheekh/.test(n)) return '<path d="M-20 14 L20 -14" stroke="#8a6a3a" stroke-width="1.6"/>' + R(-9, 7, 8, /hara/.test(n) ? '#5a8a2e' : '#e0902a', 35) + R(0, 0, 8, /hara/.test(n) ? '#6a9a38' : '#d8341e', 35) + R(9, -7, 8, /hara/.test(n) ? '#5a8a2e' : '#e8c24a', 35);
    if (/chips|finger/.test(n)) return '<g stroke="#8c5a14" stroke-width=".8">' + [-12, -6, 0, 6, 12].map(function (x, i) { return '<rect x="' + (x - 2) + '" y="' + (-14 + i % 2 * 3) + '" width="4" height="26" rx="1.4" fill="#e9c24a" transform="rotate(' + (i * 14 - 28) + ')"/>'; }).join('') + '</g>';
    if (/cutlet|patty/.test(n)) return C(0, 0, 17, '#c48230') + dots('#7a9a2a', 5, 10, 1.1) + dots('#e8a040', 6, 11, 1);
    if (/pav bhaji/.test(n)) return bowl('#c9421c', dots('#f3d88a', 3, 6, 1.4)) + O(10, 12, 9, 6, '#e8b96a', -10);
    if (/dahi vada|dahi papdi|dahi puri/.test(n)) return bowl('#fffaf0', C(-4, 0, 6, '#c98a2b') + C(5, 2, 6, '#c98a2b') + dots('#c9421c', 3, 9, 1) + dots('#4f9a2e', 3, 8, 1));
    if (/bhel|bhujiya|ragada/.test(n)) return '<ellipse cy="6" rx="19" ry="10" fill="#efe9d8" stroke="#b9ae8d"/><path d="M-15 6 Q0 -20 15 6Z" fill="#e8b45a"/>' + dots('#c9421c', 4, 9, 1.2) + dots('#4f9a2e', 4, 9, 1.1);
    if (/gup chup|pani/.test(n)) return C(-6, 2, 8, '#e0a040') + C(8, 4, 7, '#e5aa4a') + '<ellipse cx="-6" cy="-4" rx="3" ry="1.5" fill="#5a3a10"/>';
    if (/idly|idli/.test(n)) return O(-8, 6, 8, 4, '#e9e4d2') + O(8, 6, 8, 4, '#e9e4d2') + P('M-15 6 Q-8 -8 -1 6Z', '#fffdf4', '#d6cfb6') + P('M1 6 Q8 -8 15 6Z', '#fffdf4', '#d6cfb6') + P('M-7 -2 Q0 -16 7 -2Z', '#fffdf4', '#d6cfb6') + C(0, 12, 3, '#e8b45a');
    if (/dosa|uthappam|pesar|peserattu/.test(n)) return /uthappam/.test(n) ? C(0, 0, 18, '#e3b25a') + dots('#d8341e', 5, 11, 1.4) + dots('#4f9a2e', 5, 11, 1.2) : P('M-18 12 L16 -14 L19 -8 L-12 16Z', '#dfa94a', '#9a6a1c') + '<ellipse cx="17" cy="-11" rx="3" ry="4" fill="#c98a2b" transform="rotate(40 17 -11)"/>';
    if (/upma|semiya/.test(n)) return rice0('#f1e2b0') + dots('#5a3a10', 5, 9, .9) + dots('#4f9a2e', 3, 7, 1) + STEAM;
    if (/pongal|khichdi/.test(n)) return rice0('#efe3b4') + '<ellipse cx="0" cy="-6" rx="5" ry="2" fill="#f6dc6a"/>' + dots('#3a2a14', 4, 8, .9) + STEAM;
    if (/tomato bath/.test(n)) return rice0('#e8743a') + STEAM;
    if (/murukulu|murukku|chakli|jantikalu|sakinalu/.test(n)) return '<circle r="14" fill="none" stroke="#d8a040" stroke-width="4"/><circle r="8" fill="none" stroke="#c99038" stroke-width="3.5"/><circle r="2.5" fill="#b9852f"/>';
    if (/mixture|boondi|kara boondi/.test(n)) return '<ellipse cy="6" rx="18" ry="9" fill="#efe9d8"/>' + dots('#e0a030', 14, 14, 1.8) + dots('#c0723a', 4, 10, 2) + dots('#4f9a2e', 3, 8, 1.2);
    if (/ribbon/.test(n)) return '<path d="M-14 -4 Q-6 -14 0 -4 T14 -4 M-14 4 Q-6 -6 0 4 T14 4" stroke="#e0a030" stroke-width="3.4" fill="none" stroke-linecap="round"/>';
    if (/thattai|chalimidi/.test(n)) return C(0, 0, 16, '#e3b25a') + dots('#9a6a1c', 7, 10, 1.3);
    if (/peanut|jaggery|sesame/.test(n)) return C(-6, 3, 7, '#a8601a') + C(7, 4, 7, '#b86e22') + C(0, -6, 7, '#a8601a') + dots('#f6efdc', 6, 12, 1);
    if (/betel|dry fruits|pan$|^pan\b|sompu/.test(n)) return P('M-16 4 Q0 -22 16 4 Q0 16 -16 4Z', '#4f9a2e') + dots('#f3dca0', 4, 6, 1.4);
    return null;
  }
  function rice0(c) { return '<ellipse cy="6" rx="20" ry="11" fill="#efe9d8" stroke="#b9ae8d" stroke-width="1.2"/><path d="M-16 6 Q0 -24 16 6 Z" fill="' + c + '" stroke="rgba(0,0,0,.2)" stroke-width=".9"/>'; }


    function iceCup(n) {
    var c = /strawberry/.test(n) ? '#f4a3b8' : /butterscotch/.test(n) ? '#e8b24a' : /mango/.test(n) ? '#f7b92a' : /orange/.test(n) ? '#f59a23' : /dry fruit/.test(n) ? '#e8d3a0' : /tutti/.test(n) ? '#f7c4d4' : '#fbf1c9';
    var bits = /dry fruit/.test(n) ? dots('#a8601a', 5, 6, 1.1) : /tutti/.test(n) ? dots('#d8402a', 3, 6, 1) + dots('#4f9a2e', 3, 6, 1) : /butterscotch/.test(n) ? dots('#8a5a22', 4, 6, 1) : '';
    var top = C(-5, -8, 5.6, c) + C(5, -8, 5.6, c) + C(0, -12, 6, c) + '<ellipse class="sheen" cx="-2" cy="-14" rx="2.6" ry="1.2" fill="#fff"/><g transform="translate(0 -10)">' + bits + '</g>';
    return cup(c, top);
  }

  function bottle(n) {
    var b = /bisleri/.test(n), cap = b ? '#1c6fc4' : '#0b3a6b';
    return '<ellipse cx="0" cy="19.4" rx="7" ry="1.5" fill="#000" opacity=".28"/>'
      + '<path d="M-3 -17 H3 V-14 Q8 -11 8 -5 V16 Q8 19 5 19 H-5 Q-8 19 -8 16 V-5 Q-8 -11 -3 -14Z" fill="#dff1f8" fill-opacity=".7" stroke="#8fb9c9" stroke-width="1"/>'
      + '<path d="M-8 6 Q-4 3 0 6 T8 6 V16 Q8 19 5 19 H-5 Q-8 19 -8 16Z" fill="#bfe3f2" opacity=".7"/>'
      + '<rect x="-3.6" y="-21" width="7.2" height="4.6" rx="1" fill="' + cap + '"/>'
      + (b ? '<rect x="-8" y="-6" width="16" height="12" fill="#1c6fc4"/><path d="M-8 3 Q-4 0 0 3 T8 3 V6 H-8Z" fill="#7fc4f0"/>' + T(0, -0.6, 4.2, '#fff', 'bisleri')
           : '<rect x="-8" y="-6" width="16" height="12" fill="#fff"/><rect x="-8" y="-6" width="16" height="3.4" fill="#2a9a9a"/>' + T(0, 1, 4.2, '#0b3a6b', 'TATA') + T(0, 4.6, 2.6, '#2a9a9a', 'water plus'))
      + T(0, 14, 2.8, '#2a6a8a', '200 ml')
      + '<rect x="-6.6" y="-12" width="1.8" height="22" rx=".9" fill="#fff" opacity=".5"/><ellipse class="sheen" cx="4" cy="-9" rx="1.2" ry="2" fill="#fff"/>';
  }

  function pick(n, zone, cat) {
    if (cat === 'Water Bottles') return bottle(n);
        if (cat === 'Ice Creams') return iceCup(n);
    if (cat === 'Sweets') return CUP.test(n) ? cupSweet(n) : sweet(n);
    if (cat === 'Roti') return /poori|puri/.test(n) ? null : bread(n);
    if (cat === 'Rice' || cat === 'Biryani Rice') return riceArt(n);
    if (cat === 'North Indian Curries' || cat === 'South Indian Curries') return curry(n, false);
    if (cat === 'South Indian Fry') return curry(n, true);
    if (cat === 'Dal Items') return bowl(/palak|thotakura|gongura|chukka|menthi|bachali/.test(n) ? '#8a9a3a' : /makhani/.test(n) ? '#7a2e16' : '#e8c24a', '<path d="M-8 0 Q0 -6 8 0" stroke="#c9421c" stroke-width="1.4" fill="none"/>' + dots('#3f7a2a', 3, 8, 1) + dots('#c9421c', 2, 6, 1)) + STEAM;
    if (cat === 'Raitas') return bowl('#f4f0dc', /keera/.test(n) ? dots('#8ab04a', 6, 10, 1.6) : /carrot/.test(n) ? dots('#ef8a22', 6, 10, 1.5) : /tomato/.test(n) ? dots('#d8402a', 5, 10, 1.6) : /boondi/.test(n) ? dots('#e0a030', 9, 11, 1.3) : dots('#4f9a2e', 6, 10, 1.1) + dots('#d8402a', 3, 8, 1.3));
    if (cat === 'Podulu') return bowl('#efe9d8', '<path d="M-11 4 Q0 -14 11 4Z" fill="' + (/nalla|karivepaku/.test(n) ? '#4a2a1a' : /vellulli/.test(n) ? '#e8d8b0' : /putnala/.test(n) ? '#d8a040' : '#b3341e') + '"/>' + dots('#fff', 4, 6, .8).replace(/fill="#fff"/g, 'fill="#fff" opacity=".35"'));
    if (cat === 'Pickles & Chutneys') {
      if (/chutney|pachadi/.test(n)) return bowl(/pudina|kothimeera|karivepaku|palak/.test(n) ? '#6a8a2e' : /kobbari|coconut|nimbu/.test(n) ? '#f6efd8' : /allam/.test(n) ? '#e8c98a' : /tomato|dosakaya|vankaya/.test(n) ? '#c9421c' : '#c0642a', dots('#5a3a10', 4, 9, .9) + dots('#c9421c', 2, 7, 1));
      return jar(/gongura/.test(n) ? '#5a7a22' : /lemon|nimma|nimbu/.test(n) ? '#d8b83a' : /mango|ava|mamidi|dondakaya|dosa|cabbage|cauli|veg|chikkudu/.test(n) ? '#d8851e' : /tomato|pandu|mirchi/.test(n) ? '#c0341e' : '#b8501e', '#c8421e');
    }
    if (cat === 'Tiffins' || cat === 'Hot Snacks' || cat === 'Snacks' || cat === 'Chat Items' || cat === 'Saree Items' || cat === 'Special Items') return snack(n, cat);
    return null;
  }

  window.foodArt = function (name, zone, cat) {
    var a = pick(String(name).toLowerCase(), zone, cat);
    return a === null ? base(name, zone, cat) : a;
  };
})();