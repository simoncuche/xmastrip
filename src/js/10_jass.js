/* ============ Jass: Schieber ============ */
const JASS_SUIT_DE = ['Schellen', 'Rosen', 'Schilten', 'Eicheln'];
const JASS_SUIT_FR = ['Ecke', 'Herz', 'Schaufel', 'Kreuz'];
const JASS_RANK_DE = ['6', '7', '8', '9', '10', 'U', 'O', 'K', 'A'];
const JASS_RANK_FR = ['6', '7', '8', '9', '10', 'B', 'D', 'K', 'A'];
const TRUMP_RANK = { 5: 8, 3: 7, 8: 6, 7: 5, 6: 4, 4: 3, 2: 2, 1: 1, 0: 0 };
const SUIT_SVG_DE = [
  '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8" fill="#e8b830" stroke="#7a5a10" stroke-width="1.2"/><rect x="4.5" y="9" width="15" height="3.5" fill="#c8302a"/><circle cx="12" cy="17.5" r="1.6" fill="#3a2a10"/><rect x="11" y="3" width="2" height="3" fill="#7a5a10"/></svg>',
  '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="#c8302a" stroke="#7a1a1a" stroke-width=".8"><circle cx="12" cy="6.5" r="4"/><circle cx="17.5" cy="10.5" r="4"/><circle cx="15.5" cy="17" r="4"/><circle cx="8.5" cy="17" r="4"/><circle cx="6.5" cy="10.5" r="4"/></g><circle cx="12" cy="12" r="3.2" fill="#e8c23a" stroke="#7a5a10" stroke-width=".8"/></svg>',
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h16v8c0 6-4 9-8 11-4-2-8-5-8-11z" fill="#1a1a1a" stroke="#000" stroke-width="1"/><path d="M4 3h16v5H4z" fill="#e8b830"/><path d="M12 8v14c-4-2-8-5-8-11V8z" fill="#c8302a"/></svg>',
  '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="15" rx="5.5" ry="7" fill="#c8902a" stroke="#6a4a10" stroke-width="1"/><path d="M5.5 11.5c0-4 3-6 6.5-6s6.5 2 6.5 6z" fill="#6a4a20" stroke="#3a2a10" stroke-width="1"/><rect x="11" y="2" width="2" height="4" fill="#3a2a10"/><path d="M13 4c3-2 6-1 7 1-3 1-5 1-7-1z" fill="#3f8a3a"/></svg>',
];
const SUIT_FR_GLYPH = ['♦', '♥', '♠', '♣'];
const suitSvg = (s) => (G.S.flags.deck === 'fr' ? `<svg viewBox="0 0 24 24" aria-hidden="true"><text x="12" y="20" font-size="22" text-anchor="middle" fill="${s < 2 ? '#c8202a' : '#1a1a1a'}">${SUIT_FR_GLYPH[s]}</text></svg>` : SUIT_SVG_DE[s]);
const suitName = (s) => (G.S.flags.deck === 'fr' ? JASS_SUIT_FR : JASS_SUIT_DE)[s];
const rankLbl = (r) => (G.S.flags.deck === 'fr' ? JASS_RANK_FR : JASS_RANK_DE)[r];
const modeName = (m) => (m.type === 'trump' ? suitName(m.s) : m.type === 'obe' ? 'Obenabe' : 'Undenufe');

const JassRules = {
  power(c, mode, lead) {
    if (mode.type === 'trump' && c.s === mode.s) return 100 + TRUMP_RANK[c.r];
    if (c.s !== lead) return -1;
    return mode.type === 'unde' ? 8 - c.r : c.r;
  },
  pts(c, mode) {
    if (mode.type === 'trump') return c.s === mode.s ? [0, 0, 0, 14, 10, 20, 3, 4, 11][c.r] : [0, 0, 0, 0, 10, 2, 3, 4, 11][c.r];
    if (mode.type === 'obe') return [0, 0, 8, 0, 10, 2, 3, 4, 11][c.r];
    return [11, 0, 8, 0, 10, 2, 3, 4, 0][c.r];
  },
  winner(trick, mode) {
    const lead = trick[0].c.s;
    let best = 0, bp = -2;
    trick.forEach((t, i) => { const p = this.power(t.c, mode, lead); if (p > bp) { bp = p; best = i; } });
    return best;
  },
  legal(hand, trick, mode) {
    if (!trick.length) return hand.slice();
    const lead = trick[0].c.s;
    const follow = hand.filter((c) => c.s === lead);
    if (mode.type !== 'trump') return follow.length ? follow : hand.slice();
    const T = mode.s;
    if (lead === T) {
      if (!follow.length) return hand.slice();
      if (follow.length === 1 && follow[0].r === 5) return hand.slice();
      return follow;
    }
    let hi = -1;
    for (const t of trick) if (t.c.s === T) hi = Math.max(hi, TRUMP_RANK[t.c.r]);
    const under = (c) => c.s === T && hi >= 0 && TRUMP_RANK[c.r] < hi;
    const opts = follow.length ? follow.concat(hand.filter((c) => c.s === T)) : hand.slice();
    const ok = opts.filter((c) => !under(c));
    return ok.length ? ok : opts;
  },
};

const Jass = {
  async play({ partner, opp }) {
    const seats = [{ id: 'me', name: G.S.name, look: G.S.look }, FRIENDS[opp[0]], FRIENDS[partner], FRIENDS[opp[1]]];
    const lenC = await UI.ask(partner, `Schieber! ${fname(partner)} und du gegen ${fname(opp[0])} und ${fname(opp[1])}. Wie lange?`, [{ t: 'Ein Spiel', r: '9 Stiche' }, { t: 'Partie bis 500', r: 'ca. 4 Spiele' }, { t: 'Doch nicht' }]);
    if (lenC === 2) return null;
    const target = lenC === 0 ? 0 : 500;
    return new Promise((resolve) => {
      const st = { seats, total: [0, 0], deals: 0, match: false, announcer: 0, busy: false, closed: false };
      const html = `<div class="panel jass"><div class="panel-head"><h2>Schieber</h2><span class="sub">${target ? 'bis 500' : 'ein Spiel'}</span><button class="x-btn" data-close aria-label="Aufgeben">×</button></div>
        <div class="panel-body"><div class="jass-top"><div class="tafel"><span>Wir <b id="jWe">0</b></span><span>Sie <b id="jThey">0</b></span><span style="opacity:.75">Spiel <b id="jRound">0 : 0</b></span></div><div class="trumpf" id="jTrump">Trumpf: –</div><button class="btn sip" id="jSip" aria-label="Schluck Bier"><span class="mug" id="mug0"><i></i></span> Schluck</button></div>
        <div class="jtable" id="jTable">
          <div class="seat top" id="seat2"><canvas width="64" height="64"></canvas><div><div>${seats[2].name} <span class="mug" id="mug2"><i></i></span></div><div class="backs" id="b2"></div></div><div class="bub" id="bub2"></div></div>
          <div class="seat left" id="seat3"><canvas width="64" height="64"></canvas><div>${seats[3].name} <span class="mug" id="mug3"><i></i></span></div><div class="backs" id="b3"></div><div class="bub" id="bub3"></div></div>
          <div class="seat right" id="seat1"><canvas width="64" height="64"></canvas><div>${seats[1].name} <span class="mug" id="mug1"><i></i></span></div><div class="backs" id="b1"></div><div class="bub" id="bub1"></div></div>
          <div class="seat me" id="seat0"><div class="bub" id="bub0"></div></div>
          <div class="trick" id="jTrick"></div>
        </div>
        <div class="jass-msg" id="jMsg"></div><div class="jass-actions" id="jAct"></div><div class="hand" id="jHand"></div></div></div>`;
      const o = UI.overlay(html, () => { st.closed = true; resolve(null); });
      [1, 2, 3].forEach((i) => { const c = o.querySelector(`#seat${i} canvas`).getContext('2d'); c.imageSmoothingEnabled = false; c.drawImage(portraitCanvas(seats[i].look, FRIENDS[seats[i].id] ? FRIENDS[seats[i].id].bg : '#2a3a52'), 0, 0); });
      const $j = (s) => o.querySelector(s);
      const msg = (t) => { $j('#jMsg').innerHTML = t; };
      /* ---- Stammtisch-Gespräche: Sprechblasen, Sprüche, Witze, Reise-Erinnerungen und Bier ---- */
      const bubT = [0, 0, 0, 0];
      const say = (i, text, ms = 3600) => {
        if (st.closed) return; const b = $j('#bub' + i); if (!b) return;
        const others = seats.filter((_, k) => k !== i).map((x) => x.name);
        b.innerHTML = text.replace(/\{a\}/g, () => pick(others)).replace(/\{me\}/g, G.S.name);
        b.classList.add('on'); Snd.tone(700 + i * 90, 0.04, 'square', 0.02);
        clearTimeout(bubT[i]); bubT[i] = setTimeout(() => b.classList.remove('on'), ms);
      };
      const fill = [1, 1, 1, 1];
      const setMug = (i) => { const m = $j('#mug' + i); if (m) m.querySelector('i').style.height = Math.round(fill[i] * 100) + '%'; };
      for (let i = 0; i < 4; i++) setMug(i);
      const lift = (i) => { const m = $j('#mug' + i); if (!m) return; m.classList.remove('lift'); void m.offsetWidth; m.classList.add('lift'); };
      const sip = (i) => {
        if (fill[i] <= 0.01) return false;
        fill[i] = Math.max(0, fill[i] - 1 / 3); setMug(i); lift(i); Snd.sfx('gulp');
        if (fill[i] <= 0.01) { if (i === 0) consume('bier', { silent: true }); else if (seats[i].id && G.S.fprom) G.S.fprom[seats[i].id] = Math.min(2.4, (G.S.fprom[seats[i].id] || 0) + 0.25); }
        return true;
      };
      const refill = () => { let any = false; for (let i = 0; i < 4; i++) if (fill[i] <= 0.01) { fill[i] = 1; setMug(i); any = true; } if (any) { msg('Die Serviertochter bringt Nachschub. 🍺'); Snd.sfx('clink'); } };
      $j('#jSip').addEventListener('click', () => {
        if (fill[0] <= 0.01) { say(0, pick(['Leer! Serviertochter?', 'Mis Glas isch leer – Rundi!', '🍺? 🍺!']), 2200); setTimeout(refill, 1800); return; }
        sip(0); if (Math.random() < 0.5) { say(0, pick(['Prost! 🍺', 'Zum Wohl!', 'Uf s\'Wiehnachtsreisli! 🍺', 'Ahh, das tuet guet.'])); const r = 1 + Math.floor(Math.random() * 3); setTimeout(() => { if (sip(r)) say(r, pick(['Proscht! 🍺', 'Zum Wohl!', 'Gsundheit!'])); }, 700); }
        if (fill[0] <= 0.01) setTimeout(refill, 4000);
      });
      const TRIP = [
        ['Weisch no Strassburg? Christkindelsmärik, Glühwein – und {a} het s\'Münster für e Bar ghalte.', 'Er het gseit, d\'Orgel sig en Zapfhahn! 🍺'],
        ['In Strassburg hämmer am drü am Morge Flammkueche gässe.', 'Und am nüni scho wieder. Zmorge isch Zmorge.'],
        ['Turin: Bicerin – Kafi, Schoggi, Rahm. Ich ha drei trunke.', 'Und denn Grappa. {a} weiss bis hüt nöd, wie er is Hotel cho isch.'],
        ['Weisch no d\'Mole Antonelliana in Turin? Lift ufe, und {a} het Höheangst gha.', 'Er het d\'ganzi Ziit d\'Auge zue gha und gseit: „Schön, gäll?“'],
        ['Dublin, Temple Bar: zwölf Guinness, und es het nonstop grägnet.', 'Drum simmer ja nie us em Pub use. Reine Wätterschutz. 🍺'],
        ['Im Guinness Storehouse het {a} sälber es Pint zapft.', 'Meh Schuum als Bier. Irischi Huet, seit mer dem.'],
        ['Lyon a de Fête des Lumières – d\'Basilika het glüchtet wie {a} nach em vierte Pastis.', 'Ich ha glüchtet. Innerlich.'],
        ['Lyon im Bouchon: Saucisson, Andouillette, Beaujolais …', 'Andouillette – das sind Chuttle. Ich schmöck s\'hüt no.'],
        ['Strassburg, Turin, Dublin, Lyon – und jetzt Innsbruck. Wohi gaht\'s nächschts Jahr?', 'Mir lönd {a} entscheide. … Nei, lieber doch nöd.'],
        ['Innsbruck chunnt uf Platz eis. Scho nur wäg em Stüberl.', 'Und wäg de Bergiselschanze. Hesch mi gseh flüge?'],
        ['Wer het eigentlich s\'Billett zahlt?', '{me}. Drum zahlt {me} hüt au die nächschti Rundi. 🍺'],
        ['S\'Goldene Dachl isch chliner als uf de Poschtcharte.', 'Wie alles im Läbe, Brüeder.'],
        ['In Dublin het {a} sis Portemonnaie im Pub vergässe. Zwei Mal.', 'Und beidi Mal het\'s de Barkeeper zruggbracht. Irland, gäll.'],
        ['Weisch no, wie mir z\'Turin de Zug verpasst händ?', 'Mir händ en nöd verpasst. Er isch eifach zfrüe gfahre.'],
      ];
      /* Fibu, der Surfer aus Thun */
      if (FRIENDS.fibu || G.S.pid === 'fibu') { const Fb = fname('fibu'); TRIP.push(
        [`${Fb}, wie isch de Swell hüt?`, 'Flach wie de Thunersee am Morge. Drum jass ich.'],
        [`De ${Fb} het scho d'Lawinebulletin vo morn glese.`, 'Für d\'Bar gilt Stufe eis. Für de Jasstisch Stufe vier.'],
        [`${Fb}, chunsch mit de Felle uf d'Nordkette?`, 'Nur wenn obe e Hütte mit Kaiserschmarrn wartet.'],
      ); }
      /* Flöru und Hännsu sind 40 */
      const F = fname('floeru'), Hn = fname('haennsu');
      TRIP.push(
        [`${F} isch jetzt 40. Er het gfrogt, öb mer mit Lesebrille jasse dörf.`, 'Dörf mer. Aber Spicke isch verbote.'],
        [`Mit 40 zellt de ${F} d'Pünkt im Chopf – und vergisst s'Resultat.`, 'Drum schriib ich uf de Tafel, gäll.'],
        [`Uf de 40ste vom ${F} und vom ${Hn}! 🍺`, 'Zäme 80 Johr – und immer no kei Match gmacht.'],
        ['Wie fiiret mer en 40ste? Mit eme Wiehnachtsreisli!', 'Und mit Rückeschmerze am nächschte Morge.'],
        [`De ${Hn} seit, mit 40 sig er wie e guete Wii.`, 'Stimmt – er wird langsam Essig.'],
        [`De ${F} het im Club gfrogt, öb er chan sitze.`, 'Er tanzt jetzt im Sitze. Sitztanz ab 40.'],
        [`${Hn}, mit 40 bruuchsch für d'Charte e grösseri Schrift.`, 'Oder längeri Ärm.'],
      );
      const JASS = ['Stöck!', 'Trumpf isch Trumpf.', 'Wer nüt weist, verlürt.', 'Bock!', 'Ich ha nüt – aber das mit Stil.', 'Chasch nöd zelle?', 'D\'Nell isch mini Fründin.', 'Schiebe isch kei Schand.', 'Das isch kei Jass, das isch e Katastrophe.', 'Gopfriedstutz, scho wieder Schälle!', 'Weis doch öppis!', 'Wer de Puur het, het s\'Säge.', 'Ruhig, ich zell mit.', 'Nie de Puur verschänke!', 'Obenabe wie de Föhn!'];
      const JOKES = [
        'Mini Frau seit, ich jass z\'vill. Ich ha gseit: Trumpf. Sie isch gange.',
        'Zwei Jasser im Himmel. Fragt de eint: „Git\'s do Trumpf?“ Seit de Petrus: „Nur Obenabe.“',
        'Was macht en Jasser im Lift? Er schiebt.',
        'Min Dokter seit, ich söll weniger Bier trinke. Drum trink ich jetzt Rundene. 🍺',
        'Ich ha früener Schach gspielt. Aber det git\'s kei Bier debii.',
        'Wie heisst en Tiroler, wo jasst? En Usländer mit guete Charte.',
        'Was isch de Unterschied zwüsche mim Jass und em Wätter? S\'Wätter cha sich no bessere.',
      ];
      const BEER = ['Prost! 🍺', 'Zum Wohl!', 'Proscht, ihr Säcke! 🍺', 'Uf s\'Wiehnachtsreisli!', 'Eis gönd no! 🍺', 'Serviertochter, no e Rundi!'];
      const chatter = async () => {
        await wait(2500);
        while (!st.closed) {
          await wait(4200 + Math.random() * 3800);
          if (st.closed) return;
          const r = Math.random(), a = 1 + Math.floor(Math.random() * 3);
          if (r < 0.42) { const [l1, l2] = pick(TRIP); say(a, l1, 4800); await wait(2300); let b2 = 1 + Math.floor(Math.random() * 3); if (b2 === a) b2 = (a % 3) + 1; say(b2, l2, 4200); }
          else if (r < 0.62) say(a, pick(JASS), 2600);
          else if (r < 0.78) { say(a, pick(JOKES), 5000); await wait(2600); const b2 = (a % 3) + 1; say(b2, pick(['Haha! 😂', 'Uff …', 'Dä isch so alt wie min Jassteppich.', 'Wieder eine vo dine.', '😂😂']), 2400); }
          else { if (sip(a)) { say(a, pick(BEER), 2600); if (Math.random() < 0.5) { setTimeout(() => { for (let i = 1; i < 4; i++) if (i !== a) lift(i); Snd.sfx('clink'); }, 500); } }
            else { say(a, pick(['Mis Glas isch leer! 🍺', 'Serviertochter? Nachschub!']), 2400); setTimeout(refill, 2500); } }
          if (fill.slice(1).every((f) => f <= 0.01)) setTimeout(refill, 3000);
        }
      };
      setTimeout(() => chatter().catch((e) => console.error(e)), 0); /* erst nach der Definition von wait() starten */
      const cardHTML = (c, cls = '', attrs = '') => `<button class="card ${cls} ${G.S.flags.deck === 'fr' && c.s < 2 ? 'red' : ''}" ${attrs} aria-label="${suitName(c.s)} ${rankLbl(c.r)}"><span class="r">${rankLbl(c.r)}</span><span class="s">${suitSvg(c.s)}</span><span class="r2">${rankLbl(c.r)}</span></button>`;
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      let H = [[], [], [], []], trick = [], mode = null, played = [], tricksWon = [0, 0], pts = [0, 0], announcerTeam = 0;
      const renderBacks = () => { for (const i of [1, 2, 3]) $j('#b' + i).innerHTML = '<i></i>'.repeat(H[i].length); };
      const renderTrick = () => { $j('#jTrick').innerHTML = trick.map((t) => cardHTML(t.c, 'p' + t.p, 'tabindex="-1"')).join(''); };
      const sortHand = (h) => h.sort((a, b) => (a.s - b.s) || (a.r - b.r));
      const renderHand = (legalSet, onPick) => {
        const h = $j('#jHand');
        h.innerHTML = H[0].map((c, i) => cardHTML(c, legalSet ? (legalSet.has(c) ? 'ok' : 'no') : '', `data-i="${i}"`)).join('');
        if (onPick) h.querySelectorAll('.card.ok').forEach((b) => b.addEventListener('click', () => onPick(H[0][+b.dataset.i])));
      };
      const setTurn = (p) => { [1, 2, 3].forEach((i) => $j('#seat' + i).classList.toggle('turn', i === p)); };
      const tafel = () => { $j('#jWe').textContent = st.total[0]; $j('#jThey').textContent = st.total[1]; $j('#jRound').textContent = `${pts[0]} : ${pts[1]}`; $j('#jTrump').innerHTML = mode ? `Trumpf: ${mode.type === 'trump' ? suitSvg(mode.s) : ''} <b>${modeName(mode)}</b>` : 'Trumpf: –'; };
      const deal = () => {
        const deck = [];
        for (let s = 0; s < 4; s++) for (let r = 0; r < 9; r++) deck.push({ s, r });
        for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
        H = [0, 1, 2, 3].map((p) => sortHand(deck.slice(p * 9, p * 9 + 9)));
        trick = []; played = []; tricksWon = [0, 0]; pts = [0, 0]; mode = null;
        Snd.sfx('card');
      };
      const evalModes = (h) => {
        const res = [];
        for (let s = 0; s < 4; s++) {
          let v = 0;
          for (const c of h) {
            if (c.s === s) v += { 5: 9, 3: 7, 8: 4, 7: 2.5, 6: 2, 4: 2 }[c.r] || 1.2;
            else if (c.r === 8) v += 1.6;
            else if (c.r === 7 && h.some((x) => x.s === c.s && x.r === 8)) v += 0.6;
          }
          v += h.filter((c) => c.s === s).length * 0.8;
          res.push({ m: { type: 'trump', s }, v });
        }
        let ob = 0, un = 0;
        for (let s = 0; s < 4; s++) {
          const rs = h.filter((c) => c.s === s).map((c) => c.r).sort((a, b) => b - a);
          let k = 8; for (const r of rs) { if (r === k) { ob += r === 8 ? 5 : 3; k--; } else break; }
          const rsu = rs.slice().sort((a, b) => a - b);
          k = 0; for (const r of rsu) { if (r === k) { un += r === 0 ? 5 : 3; k++; } else break; }
        }
        res.push({ m: { type: 'obe' }, v: ob + 2 }, { m: { type: 'unde' }, v: un + 2 });
        res.sort((a, b) => b.v - a.v);
        return res[0];
      };
      const chooseHuman = (canPush) => new Promise((res) => {
        const act = $j('#jAct');
        const btn = (lbl, v) => { const b = document.createElement('button'); b.className = 'btn'; b.innerHTML = lbl; b.onclick = () => { act.innerHTML = ''; res(v); }; act.appendChild(b); };
        for (let s = 0; s < 4; s++) btn(`${suitSvg(s)}${suitName(s)}`, { type: 'trump', s });
        btn('▼ Obenabe', { type: 'obe' }); btn('▲ Undenufe', { type: 'unde' });
        if (canPush) btn('Schieben →', 'push');
        renderHand(null);
      });
      const bock = (c) => {
        if (mode.type === 'trump' && c.s === mode.s) { for (let r = 0; r < 9; r++) if (TRUMP_RANK[r] > TRUMP_RANK[c.r] && !played.some((x) => x.s === c.s && x.r === r)) return false; return true; }
        const higher = mode.type === 'unde' ? (r) => r < c.r : (r) => r > c.r;
        for (let r = 0; r < 9; r++) if (higher(r) && !played.some((x) => x.s === c.s && x.r === r)) return false;
        return true;
      };
      const aiPick = (p) => {
        const hand = H[p], L = JassRules.legal(hand, trick, mode);
        if (L.length === 1) return L[0];
        const team = p % 2, T = mode.type === 'trump' ? mode.s : -1;
        const P = (c) => JassRules.pts(c, mode);
        const low = (arr) => arr.slice().sort((a, b) => (P(a) - P(b)) || ((a.s === T) - (b.s === T)) || (JassRules.power(a, mode, a.s) - JassRules.power(b, mode, b.s)))[0];
        if (!trick.length) {
          if (T >= 0 && team === announcerTeam) {
            const my = hand.filter((c) => c.s === T);
            const left = 9 - played.filter((c) => c.s === T).length - my.length;
            if (left > 0 && my.some((c) => c.r === 5 || (c.r === 3 && bock(c)))) return my.sort((a, b) => TRUMP_RANK[b.r] - TRUMP_RANK[a.r])[0];
          }
          const bocks = L.filter((c) => c.s !== T && bock(c));
          if (bocks.length) return bocks.sort((a, b) => P(b) - P(a))[0];
          const nonT = L.filter((c) => c.s !== T && P(c) < 10);
          return low(nonT.length ? nonT : L);
        }
        const lead = trick[0].c.s;
        const wi = JassRules.winner(trick, mode);
        const winCard = trick[wi].c, winSeat = trick[wi].p;
        const partnerWins = winSeat % 2 === team;
        const last = trick.length === 3;
        const wp = JassRules.power(winCard, mode, lead);
        const beating = L.filter((c) => JassRules.power(c, mode, lead) > wp);
        const tp = trick.reduce((s, t) => s + P(t.c), 0);
        if (partnerWins && (last || bock(winCard))) {
          const sm = L.filter((c) => !(c.s === T && (c.r === 5 || c.r === 3)));
          return (sm.length ? sm : L).sort((a, b) => P(b) - P(a))[0];
        }
        if (beating.length) {
          const cheapest = beating.sort((a, b) => JassRules.power(a, mode, lead) - JassRules.power(b, mode, lead))[0];
          if (last && (tp > 0 || trick.length === 3)) return cheapest;
          const safe = beating.filter((c) => bock(c));
          if (safe.length && tp >= 3) return safe.sort((a, b) => P(a) - P(b))[0];
          if (tp >= 10 && !(cheapest.s === T && cheapest.r === 5 && tp < 14)) return cheapest;
        }
        return low(L);
      };
      const playCard = async (p, c) => {
        H[p].splice(H[p].indexOf(c), 1);
        trick.push({ p, c }); played.push(c);
        Snd.sfx('card'); renderTrick(); renderBacks();
        if (p === 0) renderHand(null);
      };
      const humanTurn = () => new Promise((res) => {
        const L = new Set(JassRules.legal(H[0], trick, mode));
        msg(trick.length ? 'Du bist dran.' : 'Du spielst aus.');
        renderHand(L, (c) => res(c));
      });
      const runDeal = async () => {
        deal(); renderBacks(); renderTrick(); tafel();
        const ann = st.announcer;
        announcerTeam = ann % 2;
        if (ann === 0) {
          msg('Du sagst Trumpf an.');
          renderHand(null);
          let ch = await chooseHuman(true);
          if (st.closed) return;
          if (ch === 'push') {
            msg(`Du schiebst zu ${seats[2].name}…`); await wait(800);
            ch = evalModes(H[2]).m;
            msg(`${seats[2].name}: „${modeName(ch)}!“`);
          }
          mode = ch;
        } else {
          setTurn(ann);
          msg(`${seats[ann].name} überlegt…`); await wait(900);
          let best = evalModes(H[ann]);
          if (best.v < 17) {
            const pp = (ann + 2) % 4;
            msg(`${seats[ann].name} schiebt!`); await wait(800);
            if (pp === 0) { msg('Geschoben – du musst ansagen.'); mode = await chooseHuman(false); if (st.closed) return; }
            else { best = evalModes(H[pp]); mode = best.m; msg(`${seats[pp].name}: „${modeName(mode)}!“`); }
          } else { mode = best.m; msg(`${seats[ann].name}: „${modeName(mode)}!“`); }
        }
        { const who2 = ann === 0 ? 0 : ann; say(who2, `${modeName(mode)}!`, 2200); if (Math.random() < 0.5) setTimeout(() => say((who2 + 2) % 4, pick(['Guet so!', 'Mutig …', 'Das chunnt guet.', 'Hoffentlich weisch, was d\'machsch.']), 2200), 900); }
        tafel(); await wait(900);
        let leader = ann;
        for (let k = 0; k < 9; k++) {
          trick = []; renderTrick();
          for (let j = 0; j < 4; j++) {
            if (st.closed) return;
            const p = (leader + j) % 4;
            setTurn(p);
            let c;
            if (p === 0) c = await humanTurn();
            else { await wait(520 + Math.random() * 380); c = aiPick(p); }
            if (st.closed) return;
            await playCard(p, c);
          }
          const wi = JassRules.winner(trick, mode);
          const w = trick[wi].p;
          let tp = trick.reduce((s, t) => s + JassRules.pts(t.c, mode), 0);
          if (k === 8) tp += 5;
          pts[w % 2] += tp; tricksWon[w % 2]++;
          msg(`${w === 0 ? 'Du nimmst' : seats[w].name + ' nimmt'} den Stich (${tp} Punkte).`);
          if (tp >= 20 || (k === 8 && Math.random() < 0.6)) { say(w, pick(['Ab in Sack!', 'Merci vielmal!', 'Danke, das nimm ich!', 'Hesch gmeint, gäll?', 'Stich! 🍺']), 2000); const lo = (w + 1) % 4; setTimeout(() => say(lo, pick(['Gopf!', 'Säich!', 'Das isch gmein.', 'Hätt ich nur de Puur bhalte …']), 1900), 700); }
          tafel();
          await wait(1100);
          leader = w;
        }
        let matchTeam = -1;
        if (tricksWon[0] === 9) { pts[0] += 100; matchTeam = 0; } if (tricksWon[1] === 9) { pts[1] += 100; matchTeam = 1; }
        st.total[0] += pts[0]; st.total[1] += pts[1]; st.deals++;
        if (matchTeam === 0) st.match = true;
        trick = []; renderTrick(); tafel(); setTurn(-1);
        msg(`${matchTeam === 0 ? '<b>MATCH!</b> ' : matchTeam === 1 ? '<b>Match für die anderen…</b> ' : ''}Spiel: Wir ${pts[0]} – Sie ${pts[1]}.`);
        if (matchTeam === 0) { say(2, 'MATCH!!! Das gits doch nöd! 🍺', 3000); setTimeout(() => say(1, 'Die Rundi zahle mir. Gopf.', 2600), 900); }
        else if (matchTeam === 1) { say(1, 'MATCH! Ab in d\'Gschicht!', 3000); }
        else say(pts[0] > pts[1] ? 2 : 1, pick(['Guet gspielt!', 'Revanche!', 'No eis!', 'S\'nächscht Spiel gwünne mir.']), 2400);
        Snd.sfx(pts[0] > pts[1] ? 'win' : 'lose');
        st.announcer = (st.announcer + 1) % 4;
      };
      (async () => {
        while (!st.closed) {
          await runDeal();
          if (st.closed) return;
          const done = !target || st.total[0] >= target || st.total[1] >= target;
          const act = $j('#jAct');
          await new Promise((r) => { act.innerHTML = ''; const b = document.createElement('button'); b.className = 'btn primary'; b.textContent = done ? 'Fertig' : 'Nächstes Spiel'; b.onclick = () => { act.innerHTML = ''; r(); }; act.appendChild(b); });
          if (done) {
            const win = st.total[0] > st.total[1];
            st.closed = true;
            UI._ovClose = null;
            UI.closeOverlay();
            resolve({ win, match: st.match, deals: st.deals });
            return;
          }
        }
      })();
    });
  },
};
