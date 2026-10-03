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
        <div class="panel-body"><div class="jass-top"><div class="tafel"><span>Wir <b id="jWe">0</b></span><span>Sie <b id="jThey">0</b></span><span style="opacity:.75">Spiel <b id="jRound">0 : 0</b></span></div><div class="trumpf" id="jTrump">Trumpf: –</div></div>
        <div class="jtable" id="jTable">
          <div class="seat top" id="seat2"><canvas width="64" height="64"></canvas><div><div>${seats[2].name}</div><div class="backs" id="b2"></div></div></div>
          <div class="seat left" id="seat3"><canvas width="64" height="64"></canvas><div>${seats[3].name}</div><div class="backs" id="b3"></div></div>
          <div class="seat right" id="seat1"><canvas width="64" height="64"></canvas><div>${seats[1].name}</div><div class="backs" id="b1"></div></div>
          <div class="trick" id="jTrick"></div>
        </div>
        <div class="jass-msg" id="jMsg"></div><div class="jass-actions" id="jAct"></div><div class="hand" id="jHand"></div></div></div>`;
      const o = UI.overlay(html, () => { st.closed = true; resolve(null); });
      [1, 2, 3].forEach((i) => { const c = o.querySelector(`#seat${i} canvas`).getContext('2d'); c.imageSmoothingEnabled = false; c.drawImage(portraitCanvas(seats[i].look, FRIENDS[seats[i].id] ? FRIENDS[seats[i].id].bg : '#2a3a52'), 0, 0); });
      const $j = (s) => o.querySelector(s);
      const msg = (t) => { $j('#jMsg').innerHTML = t; };
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
