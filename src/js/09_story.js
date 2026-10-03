/* ============ Die Reisegruppe ============ */
const CREW = [
  { id: 'cuche', name: 'Cuche', role: 'der Kassier', fn: 'kassier', bg: '#3a4a2a' },
  { id: 'didu', name: 'Didu', role: 'der Säufer', fn: 'saeufer', bg: '#5a2a24' },
  { id: 'dous', name: 'Dous', role: 'der Gourmet', fn: 'gourmet', bg: '#5a4024' },
  { id: 'coel', name: 'Coel', role: 'der Partylöwe', fn: 'party', bg: '#4a2a5a' },
  { id: 'kusi', name: 'Kusi', role: 'der kleine Freche', fn: 'frech', bg: '#2a4a5a' },
  { id: 'roemu', name: 'Römu', role: 'der Pilot', fn: 'pilot', bg: '#2a3a5a' },
  { id: 'floeru', name: 'Flöru', role: 'der Tänzer', fn: 'taenzer', bg: '#5a2a4a' },
  { id: 'hoshy', name: 'Hoshy', role: 'der Muskelprotz', fn: 'muskel', bg: '#3a3a3a' },
  { id: 'oelu', name: 'Ölu', role: 'der Kanadier', fn: 'kanadier', bg: '#6a2a2a' },
  { id: 'yaennu', name: 'Yännu', role: 'der Raucher', fn: 'raucher', bg: '#3a3a4a' },
  { id: 'lexx', name: 'Lexx', role: 'der Anwalt', fn: 'anwalt', bg: '#2a2a3a' },
  { id: 'haennsu', name: 'Hännsu', role: 'der Frauenschwarm', fn: 'charmeur', bg: '#5a3a4a' },
];
/* Vordefiniertes Aussehen der Kollegen (Indizes siehe LOOK_OPTS in 02_look.js). Alles, was hier nicht steht, wird ausgewürfelt.
   Für alle gilt zusätzlich CREW_COMMON: helle Haut und braune Augen. */
const CREW_COMMON = { skin: 1, eyeCol: 0 };
const CREW_LOOKS = {
  /* Cuche: schwarzes Cap mit kurzem Schirm, blaue Jeans, weisses T-Shirt, braune Augen */
  cuche: { head: 0, ears: 0, eyes: 0, brows: 0, nose: 1, mouth: 0, mark: 0, build: 1, height: 1, jewel: 0, hair: 3, hairCol: 1, beard: 1, beardCol: 1, hat: 11, hatCol: 0, top: 0, topCol: 13, print: 0, pants: 0, pantsCol: 0, shoes: 0, shoesCol: 0, acc: 5, glasses: 0 },
  /* Didu: kurze, orange-rote Haare (Kupfer), farbige Kleider */
  didu: { head: 1, ears: 2, eyes: 1, brows: 1, nose: 4, mouth: 2, mark: 5, build: 3, height: 1, jewel: 0, hair: 2, hairCol: 8, beard: 7, beardCol: 8, top: 3, topCol: 6, print: 1, pants: 1, pantsCol: 11, shoes: 0, shoesCol: 8, hat: 0, glasses: 0 },
  /* Dous: Glatze, T-Shirt, braune Hose, braune Schuhe, französische Baskenmütze */
  dous: { head: 5, ears: 0, eyes: 4, brows: 3, nose: 2, mouth: 0, mark: 0, build: 3, height: 1, jewel: 0, hair: 0, hairCol: 1, beard: 2, beardCol: 1, top: 0, topCol: 15, print: 0, pants: 1, pantsCol: 9, shoes: 3, shoesCol: 2, hat: 10, hatCol: 0, glasses: 0 },
  /* Coel: schwarze Haare, Stoppelbart, runde braune Brille, Hemd */
  coel: { head: 3, ears: 1, eyes: 3, brows: 4, nose: 3, mouth: 2, mark: 0, build: 2, height: 2, jewel: 0, hair: 3, hairCol: 0, beard: 1, beardCol: 0, glasses: 8, top: 1, topCol: 8, print: 0, pants: 1, pantsCol: 5, shoes: 3, shoesCol: 2, hat: 0 },
  /* Kusi: schwarze Scheitelhaare, glatt rasiert, weisser Pullover, Jeans, weisse Schuhe */
  kusi: { head: 4, ears: 0, eyes: 6, brows: 2, nose: 6, mouth: 2, mark: 1, build: 0, height: 0, jewel: 0, hair: 3, hairCol: 0, beard: 0, top: 4, topCol: 13, print: 0, pants: 0, pantsCol: 0, shoes: 0, shoesCol: 0, glasses: 0, hat: 0 },
  /* Römu: Piloten-Outfit – Navy-Sakko mit Abzeichen, Anzughose, Mütze, keine Brille */
  roemu: { head: 2, ears: 0, eyes: 2, brows: 3, nose: 1, mouth: 1, mark: 0, build: 2, height: 2, jewel: 0, hair: 2, hairCol: 2, beard: 0, glasses: 0, top: 9, topCol: 10, print: 5, pants: 5, pantsCol: 8, shoes: 3, shoesCol: 1, hat: 8, hatCol: 2 },
  /* Flöru: brauner Mantel, braune Haare, Stoppeln */
  floeru: { head: 0, ears: 3, eyes: 0, brows: 0, nose: 0, mouth: 4, mark: 4, build: 0, height: 1, jewel: 0, hair: 2, hairCol: 2, beard: 1, beardCol: 2, top: 9, topCol: 17, print: 0, pants: 1, pantsCol: 9, shoes: 1, shoesCol: 2, acc: 0, hat: 0, glasses: 0 },
  /* Hoshy: Halbglatze, blond, muskulös, T-Shirt, blaue Jeans */
  hoshy: { head: 5, ears: 0, eyes: 2, brows: 1, nose: 2, mouth: 2, mark: 2, build: 3, height: 2, jewel: 0, hair: 12, hairCol: 5, beard: 1, beardCol: 5, top: 0, topCol: 9, print: 0, pants: 0, pantsCol: 0, shoes: 0, shoesCol: 0, hat: 0, glasses: 0, acc: 0 },
  /* Ölu: der Kanadier – Holzfällerhemd und Beanie (nicht vorgegeben) */
  oelu: { head: 1, ears: 0, eyes: 5, brows: 1, nose: 1, mouth: 0, mark: 0, build: 2, height: 1, jewel: 0, hair: 10, hairCol: 3, beard: 8, beardCol: 3, top: 7, topCol: 0, hat: 3, hatCol: 1, pants: 0, shoes: 1 },
  /* Yännu: blondes, aufgestelltes Haar, grimmiger Blick, grosse Nase, Hemd, schwarze Hose, schwarze Schuhe */
  yaennu: { head: 2, ears: 0, eyes: 2, brows: 5, nose: 4, mouth: 3, mark: 7, build: 1, height: 1, jewel: 0, hair: 13, hairCol: 5, beard: 1, beardCol: 5, top: 1, topCol: 14, print: 0, pants: 1, pantsCol: 2, shoes: 3, shoesCol: 1, glasses: 0, hat: 0 },
  /* Lexx: lange blonde Haare, komplett weisse Kleider */
  lexx: { head: 3, ears: 0, eyes: 3, brows: 4, nose: 3, mouth: 1, mark: 0, build: 0, height: 2, jewel: 0, hair: 10, hairCol: 5, beard: 0, glasses: 0, top: 1, topCol: 13, print: 0, pants: 1, pantsCol: 10, shoes: 0, shoesCol: 0, hat: 0 },
  /* Hännsu: volles, kurzes schwarzes Haar, schwarze Brille, schwarze Kleider */
  haennsu: { head: 0, ears: 1, eyes: 6, brows: 0, nose: 1, mouth: 0, mark: 0, build: 1, height: 1, jewel: 0, hair: 2, hairCol: 0, beard: 1, beardCol: 0, glasses: 2, top: 4, topCol: 16, print: 0, pants: 0, pantsCol: 2, shoes: 0, shoesCol: 1, acc: 0, hat: 0 },
};
const FN_FALLBACK = {
  kassier: ['cuche', 'lexx'], jass: ['lexx', 'didu', 'dous'], arm: ['hoshy', 'coel', 'didu'], darts: ['didu', 'kusi', 'hoshy'],
  kicker: ['kusi', 'yaennu', 'coel'], dance: ['floeru', 'coel', 'haennsu'], smoke: ['yaennu', 'coel', 'didu'], food: ['dous', 'didu', 'hoshy'],
  pilot: ['roemu', 'lexx', 'hoshy'], foto: ['roemu', 'lexx', 'oelu'], music: ['oelu', 'floeru', 'kusi'], party: ['coel', 'haennsu', 'floeru'], schnaps: ['didu', 'oelu', 'dous'],
};
let FRIENDS = {};
/* Der komplette Look eines Kollegen: Zufall nur für Merkmale, die CREW_LOOKS nicht vorgibt (z. B. Muster, Accessoire) */
function crewLook(id, seed = 0) {
  const c = CREW.find((x) => x.id === id);
  return Object.assign(randomLook(rng(c.name.length * 977 + c.name.charCodeAt(0) * 31 + seed * 7919), {}), CREW_COMMON, CREW_LOOKS[id]);
}
function buildFriends() {
  FRIENDS = {};
  const seed = G.S.flags.crewSeed || 0;
  for (const c of CREW) {
    if (c.id === G.S.pid) continue;
    const L = crewLook(c.id, seed);
    FRIENDS[c.id] = { id: c.id, name: c.name, role: c.role, fn: c.fn, look: L, bg: c.bg };
  }
  for (const k of Object.keys(FRIENDS)) if (G.S.aff[k] == null) G.S.aff[k] = 50;
  if (!G.S.fprom) G.S.fprom = {};
  if (!G.S.flags.sick) G.S.flags.sick = {};
}
const fprom = (id) => (G.S.fprom && G.S.fprom[id]) || 0;
function who(fn) { for (const id of FN_FALLBACK[fn] || []) if (FRIENDS[id]) return id; return Object.keys(FRIENDS)[0]; }
const fname = (id) => (FRIENDS[id] ? FRIENDS[id].name : G.S.name);
const playerIsKassier = () => G.S.pid === 'cuche';
const T2P = (tx, ty) => ({ x: tx * 16 + 8, y: ty * 16 + 12 });
/* Abfahrt in Luzern: Der Spieler kauft das Gruppenbillett, alle müssen um 9:10 im Zug sein. */
const DEP_TIME = 9 * 60 + 10;
const TICKET_PRICE = 468; /* 12 × 39.00 CHF */
const TICKET_CASH = 500;  /* was der Kassier für das Billett herausrückt */
const latecomer = () => who('smoke'); /* der Raucher verpasst den Zug – wer auch immer gerade die Rolle hat */
/* Am Torbogen müssen der Partylöwe (Proviant), der Fotograf (Tipp) und der Kassier (Geld fürs Billett) begrüsst werden,
   dazu insgesamt mindestens vier. meetNeed() liefert, wer noch fehlt. */
const listNames = (ids) => { const n = ids.map(fname); return n.length <= 1 ? n.join('') : n.slice(0, -1).join(', ') + ' und ' + n[n.length - 1]; };
const moreStr = (k) => (k === 1 ? 'einen weiteren Kollegen' : `${k} weitere Kollegen`);
function meetNeed() {
  const met = G.S.flags.met || {};
  const req = [who('party'), who('foto')].concat(playerIsKassier() ? [] : [who('kassier')]);
  const missing = req.filter((x) => !met[x]);
  const more = Math.max(0, 4 - Object.keys(met).length - missing.length);
  return { req, missing, more };
}
/* Jemand aus der Gruppe, der eine Rolle spricht – aber nie der Nachzügler selbst. */
function voice(fn) { const id = who(fn); if (id !== latecomer()) return id; return Object.keys(FRIENDS).find((x) => x !== id) || id; }

/* ============ Ablauf ============ */
const STAGES = ['meet', 'board', 'ride', 'arrived', 'findHotel', 'checkin', 'room', 'bar', 'free'];
const stageAt = (s) => STAGES.indexOf(G.S.stage) >= STAGES.indexOf(s);
const OPEN = {
  bar: [11, 26], stueberl: [10, 24], club: [22, 29], rouge: [21, 29], casino: [15, 27], huette: [9, 17], bahn: [8.5, 17.5], turm: [10, 17], shop: [9, 19], souvenir: [9, 20], cafe: [8, 20], apotheke: [8, 18], wurst: [10, 28], kebap: [11, 28], trafik: [6, 22], spar: [8, 19], barbier: [9, 18],
};
function isOpen(k) {
  const o = OPEN[k]; if (!o) return true;
  let h = hourOf(G.S.time);
  const sunday = dayStr() === 'So';
  if (sunday && ['shop', 'spar', 'apotheke', 'barbier'].includes(k)) return false;
  if (dayStr() === 'Sa' && ['shop', 'spar', 'barbier'].includes(k) && h >= 18) return false;
  if (o[1] > 24 && h < o[1] - 24) h += 24;
  return h >= o[0] && h < o[1];
}
const hoursStr = (k) => { const o = OPEN[k]; const f = (v) => pad2(Math.floor(v % 24)) + ':' + pad2(Math.round((v % 1) * 60)); return f(o[0]) + '–' + f(o[1]); };

/* ============ Läden ============ */
const it = (id, price, o = {}) => Object.assign({ id, price }, o);
const SHOPS = {
  kiosk_lu: { title: 'Bahnhofkiosk', cur: 'chf', mode: 'take', sections: [{ t: 'Für die Reise', items: [it('dosenbier', 3.2), it('sixpack', 13.9), it('gipfeli', 2.5), it('sandwich', 6.9), it('wasser', 2.8), it('energy', 3.5), it('chips', 3.9), it('schoko', 2.9)] }] },
  baeckerei_lu: { title: 'Bahnhof-Bäckerei', cur: 'chf', mode: 'eat', sections: [{ t: 'Frisch', items: [it('kaffee', 4.6), it('gipfeli', 2.2), it('brezel', 3.2), it('sandwich', 7.5)] }] },
  speisewagen: { title: 'Speisewagen', mode: 'eat', intro: 'Der Kellner balanciert drei Tassen gleichzeitig, während der Zug durch eine Kurve fährt.', sections: [{ t: 'Getränke', items: [it('bier', 4.9), it('radler', 4.5), it('wein', 5.2), it('kaffee', 3.4), it('wasser', 2.9)] }, { t: 'Speisen', items: [it('gulasch', 6.9), it('wuerstel', 5.9), it('toast', 5.5), it('schoko', 2.5)] }] },
  bar: { title: 'Gamsbock Bar', mode: 'eat', venue: 'bar', intro: 'Sepp poliert ein Glas. „Was darf\'s sein?“', sections: [
    { t: 'Bier', items: [it('bier', 4.8), it('weissbier', 5.2), it('pils', 3.8), it('radler', 4.5)] },
    { t: 'Schnaps & Co.', items: [it('zirben', 3.5), it('jagertee', 5.5)] },
    { t: 'Alkoholfrei', items: [it('cola', 3.5), it('wasser', 2.5), it('kaffee', 3.0)] },
    { t: 'Küche', items: [it('burger', 13.9), it('cheese', 14.9), it('bbq', 16.9), it('ribs', 18.9), it('wings', 9.9), it('schnitzel', 16.9), it('groestl', 13.5), it('nachos', 8.9), it('pommes', 4.9), it('brezel', 3.5)] },
    { t: 'Für die Jungs', items: [it('runde', 28.8, { n: 'Runde Bier für alle', d: 'Die ganze Truppe bekommt ein Bier', icon: 'beer', special: 'round' })] },
  ] },
  stueberl: { title: 'Tiroler Stüberl', mode: 'eat', venue: 'stueberl', intro: 'Resi wischt den Tisch ab. „Griaß di! Was mog\'sch?“', sections: [
    { t: 'Getränke', items: [it('bier', 4.5), it('weissbier', 4.9), it('wein', 3.9), it('zirben', 3.8), it('obstler', 3.5), it('wasser', 2.2)] },
    { t: 'Tiroler Küche', items: [it('speckbrett', 11.5), it('knoedel', 6.5), it('spaetzle', 13.9), it('groestl', 12.9), it('kaiserschmarrn', 11.9), it('strudel', 5.5)] },
    { t: 'Für die Jungs', items: [it('runde', 22.8, { n: 'Runde Zirbenschnaps für alle', d: 'Ein Stamperl für jeden', icon: 'shot', special: 'roundShots' })] },
  ] },
  club: { title: 'Bar im Club Lawine', mode: 'eat', venue: 'club', intro: 'Mira schreit über den Bass: „WAS DARF\'S SEIN?“', sections: [
    { t: 'Drinks', items: [it('flaschenbier', 5.5), it('wodkaE', 9.5), it('gintonic', 10.5), it('shot', 4.5)] },
    { t: 'Alkoholfrei', items: [it('cola', 4.0), it('wasser', 4.0), it('energy', 4.5)] },
    { t: 'Für die Jungs', items: [it('runde', 27, { n: 'Shot-Runde für die Jungs', d: 'Kräuter-Shots für alle hier', icon: 'shot', special: 'roundShots' })] },
  ] },
  rouge: { title: 'Rouge · Bar', mode: 'eat', venue: 'rouge', intro: 'Jacky lächelt. „Ein Drink für dich – oder einer für die Bühne?“ Die Preise haben es in sich.', sections: [
    { t: 'Drinks', items: [it('bier', 9), it('gintonic', 16), it('shot', 8), it('wein', 12)] },
    { t: 'Alkoholfrei', items: [it('cola', 7), it('wasser', 6)] },
    { t: 'Für die Bühne', items: [it('piccolo', 45, { n: 'Piccolo für die Tänzerin', d: 'Chantal prostet dir zu', icon: 'wine', special: 'tip' }), it('flasche', 180, { n: 'Flasche Champagner für die Bühne', d: 'Mit Wunderkerze. Alle schauen.', icon: 'wine', special: 'bottle' })] },
  ] },
  casinobar: { title: 'Casinobar', mode: 'eat', venue: 'casino', intro: 'Gedämpftes Licht, leises Klackern der Jetons.', sections: [{ t: 'Drinks', items: [it('bier', 6.5), it('gintonic', 12), it('wein', 7.5), it('cola', 4.5), it('wasser', 4)] }] },
  turmcafe: { title: 'Café im Turm', mode: 'eat', intro: 'Panoramafenster, Kaffee und Strudel in 50 Metern Höhe über dem Stadion.', sections: [{ t: 'Getränke', items: [it('kaffee', 3.9), it('melange', 4.6), it('wasser', 3.2), it('jagertee', 6.2)] }, { t: 'Süsses', items: [it('strudel', 5.8), it('sacher', 6.5)] }] },
  huette: { title: 'Restaurant Seegrube', mode: 'eat', intro: 'Auf 1.905 Metern schmeckt alles doppelt so gut.', sections: [{ t: 'Getränke', items: [it('radler', 4.9), it('bier', 5.2), it('jagertee', 5.9), it('kaffee', 3.5), it('wasser', 3.2)] }, { t: 'Hüttenküche', items: [it('kaiserschmarrn', 13.9), it('germknoedel', 9.9), it('gulasch', 7.9), it('strudel', 6.5)] }] },
  minibar: { title: 'Minibar', mode: 'eat', intro: 'Hotelpreise. Natürlich.', sections: [{ t: 'Inhalt', items: [it('dosenbier', 6.5), it('zirben', 7.0), it('cola', 4.5), it('wasser', 4.0), it('schoko', 4.5), it('erdnuesse', 5.0)] }] },
  kebap: { title: 'Kebap im Bogen', mode: 'eat', venue: 'kebap', sections: [{ t: 'Auf die Hand', items: [it('kebap', 6.5, { n: 'Kebap mit allem', icon: 'kebap', d: 'macht richtig satt · gegen Übelkeit' }), it('pommes', 3.9), it('cola', 3.0), it('dosenbier', 3.5)] }] },
  wurst: { title: 'Würstelstand', mode: 'eat', venue: 'wurst', intro: '„A Käsekrainer mit an Buckl und an Sechzehner-Blech?“ Du nickst einfach.', sections: [{ t: 'Würstel', items: [it('kaesekrainer', 4.9), it('bosna', 4.5), it('bratwurst', 4.2), it('pommes', 3.5)] }, { t: 'Dazu', items: [it('dosenbier', 3.0), it('cola', 2.8)] }] },
  spar: { title: 'Supermarkt', mode: 'take', venue: 'spar', sections: [{ t: 'Einkaufen', items: [it('wasser', 0.89), it('dosenbier', 1.29), it('energy', 1.49), it('semmel', 0.39), it('banane', 0.39), it('sandwich', 3.49), it('chips', 2.29), it('schoko', 1.99), it('speck', 6.99), it('kondom', 3.99, { d: '3 Stück, Hausmarke' })] }] },
  apotheke: { title: 'Apotheke', mode: 'take', venue: 'apotheke', intro: 'Die Apothekerin mustert dich über ihre Brille hinweg. Alles landet in deiner Tasche.', sections: [{ t: 'Rezeptfrei', items: [it('aspirin', 6.9), it('magen', 8.5), it('elektrolyt', 5.9)] }, { t: 'Diskret', items: [it('kondom', 4.9, { d: '3 Stück · Jessy besteht darauf' })] }] },
  trafik: { title: 'Trafik', mode: 'take', venue: 'trafik', sections: [{ t: 'Tabak & Zeitung', items: [it('zigaretten', 7.0), it('feuerzeug', 1.5), it('zeitung', 2.2), it('postkarte', 1.2)] }, { t: 'Unter der Theke', items: [it('kondom', 5.5, { d: '3 Stück' })] }] },
  souvenir: { title: 'Souvenirs Dachl', mode: 'take', venue: 'souvenir', sections: [{ t: 'Andenken', items: [it('schneekugel', 12.9), it('magnet', 4.9), it('postkarte', 1.5), it('edelweiss', 7.9)] }, { t: 'Tiroler Spezialitäten', items: [it('speck', 14.9), it('zirbenflasche', 19.9)] }] },
  cafe: { title: 'Café Konditorei', mode: 'eat', venue: 'cafe', sections: [{ t: 'Kaffeehaus', items: [it('melange', 4.2), it('kaffee', 3.4), it('wasser', 2.8)] }, { t: 'Mehlspeisen', items: [it('strudel', 5.5), it('sacher', 6.2), it('kaiserschmarrn', 12.5)] }] },
  sport: { title: 'Sport Gipfel', mode: 'wear', venue: 'shop', intro: 'Ausrüstung für Berg und Stadt. Gekaufte Stücke ziehst du direkt an.', sections: [{ t: 'Kleidung', items: [
    it('o_sonne', 39, { n: 'Sonnenbrille', icon: 'glasses', wear: { glasses: 4 }, d: 'Coole Gläser' }),
    it('o_sport', 69, { n: 'Sportbrille, verspiegelt', icon: 'glasses', wear: { glasses: 5 }, d: 'Wie ein Skirennfahrer' }),
    it('o_beanie', 24, { n: 'Beanie mit Bommel', icon: 'cap', wear: { hat: 3, hatCol: 1 }, d: 'Rot, warm' }),
    it('o_trucker', 29, { n: 'Trucker-Cap', icon: 'cap', wear: { hat: 5, hatCol: 2 }, d: 'Mit Bergmotiv' }),
    it('o_jacke', 79, { n: 'Trainerjacke', icon: 'shirt', wear: { top: 10, topCol: 9 }, d: 'Blau mit Streifen' }),
    it('o_lauf', 119, { n: 'Laufschuhe Neon', icon: 'shoe', wear: { shoes: 5, shoesCol: 9 }, d: 'Leuchten im Dunkeln (fast)' }),
  ] }] },
  mode: { title: 'Mode Alpin', mode: 'wear', venue: 'shop', intro: 'Daunenjacken, Beanies und alles, was nach Après-Ski riecht.', sections: [{ t: 'Outfits', items: [
    it('m_apres', 149, { n: 'Après-Ski-Set', icon: 'shirt', wear: { top: 3, topCol: 2, hat: 3, hatCol: 7, pants: 2, pantsCol: 3, shoes: 1, shoesCol: 2, print: 0, costume: 0 }, d: 'Oranger Hoodie, Beanie, Cargohose, Boots' }),
    it('m_winter', 189, { n: 'Winter-Set', icon: 'shirt', wear: { top: 10, topCol: 9, hat: 3, hatCol: 2, pants: 0, pantsCol: 0, shoes: 2, shoesCol: 2, print: 0, costume: 0 }, d: 'Trainerjacke blau, Beanie, Jeans, Wanderschuhe' }),
    it('m_sport', 99, { n: 'Sport-Set', icon: 'shirt', wear: { top: 6, topCol: 0, print: 3, hat: 5, hatCol: 6, pants: 4, pantsCol: 2, shoes: 5, shoesCol: 9, costume: 0 }, d: 'Trikot Nummer 10, Trucker-Cap, Jogginghose, Laufschuhe' }),
    it('m_fan', 59, { n: 'Fan-Set', icon: 'hat', wear: { acc: 4, hat: 1, hatCol: 1, top: 0, topCol: 13, print: 2, costume: 0 }, d: 'Fan-Schal, rote Cap, Shirt mit Schweizerkreuz' }),
  ] }] },
  boutique: { title: 'Boutique Maximilian', mode: 'wear', venue: 'shop', intro: 'Leise Musik, grosse Spiegel – und ein Verkäufer, der deine Schuhe mustert.', sections: [{ t: 'Fein gemacht', items: [
    it('b_sakko', 299, { n: 'Sakko-Set', icon: 'shirt', wear: { top: 9, topCol: 10, pants: 5, pantsCol: 3, shoes: 3, shoesCol: 1, hat: 0, print: 0, acc: 3, costume: 0 }, d: 'Navy-Sakko, Anzughose, Halbschuhe, Uhr' }),
    it('b_hemd', 129, { n: 'Hemd-Set', icon: 'shirt', wear: { top: 1, topCol: 13, pants: 1, pantsCol: 5, shoes: 3, shoesCol: 2, hat: 0, print: 0, costume: 0 }, d: 'Weisses Hemd, Chino beige, braune Halbschuhe' }),
    it('b_leder', 349, { n: 'Rocker-Set', icon: 'shirt', wear: { top: 8, topCol: 16, pants: 0, pantsCol: 2, shoes: 1, shoesCol: 1, hat: 0, print: 0, costume: 0 }, d: 'Lederjacke, schwarze Jeans, Boots' }),
    it('b_polo', 89, { n: 'Polo-Set', icon: 'shirt', wear: { top: 2, topCol: 7, pants: 1, pantsCol: 10, shoes: 0, shoesCol: 0, hat: 0, print: 0, costume: 0 }, d: 'Petrol-Polo, weisse Chino, Sneaker' }),
  ] }] },
  kostuem: { title: 'Maskerade Kostümverleih', mode: 'wear', venue: 'shop', intro: 'Perücken, Masken, Plüsch. „Fasching ist, wann du willst“, sagt der Verkäufer.', sections: [{ t: 'Kostüme (einmal kaufen, immer tragen)', items: [
    it('k_pirat', 39, { n: 'Pirat', icon: 'hat', wear: { costume: 1 }, unlock: 'k_pirat', d: 'Dreispitz, Augenklappe, Streifenhemd' }),
    it('k_cowboy', 39, { n: 'Cowboy', icon: 'hat', wear: { costume: 2 }, unlock: 'k_cowboy', d: 'Hut, Weste, rotes Halstuch' }),
    it('k_baer', 49, { n: 'Bär', icon: 'shirt', wear: { costume: 3 }, unlock: 'k_baer', d: 'Plüsch-Overall mit Ohren' }),
    it('k_kuh', 49, { n: 'Kuh', icon: 'shirt', wear: { costume: 4 }, unlock: 'k_kuh', d: 'Overall mit Flecken und Hörnern' }),
    it('k_pinguin', 49, { n: 'Pinguin', icon: 'shirt', wear: { costume: 5 }, unlock: 'k_pinguin', d: 'Frack von Natur aus, oranger Schnabel' }),
    it('k_dino', 59, { n: 'Dino', icon: 'shirt', wear: { costume: 6 }, unlock: 'k_dino', d: 'Grün, mit Zacken auf dem Rücken' }),
    it('k_ritter', 59, { n: 'Ritter', icon: 'hat', wear: { costume: 7 }, unlock: 'k_ritter', d: 'Rüstung, Helm mit Federbusch' }),
    it('k_held', 49, { n: 'Superheld', icon: 'shirt', wear: { costume: 8 }, unlock: 'k_held', d: 'Blauer Anzug, roter Umhang, Maske' }),
    it('k_santa', 39, { n: 'Weihnachtsmann', icon: 'hat', wear: { costume: 9 }, unlock: 'k_santa', d: 'Rot, weisser Rauschebart, Zipfelmütze' }),
    it('k_elch', 49, { n: 'Elch', icon: 'shirt', wear: { costume: 10 }, unlock: 'k_elch', d: 'Geweih und rote Nase' }),
  ] }, { t: 'Zurück zu dir', items: [it('k_none', 0, { n: 'Kostüm ablegen', icon: 'shirt', wear: { costume: 0 }, d: 'Wieder in deinen eigenen Kleidern' })] }] },
  tracht: { title: 'Trachten Holzer', mode: 'wear', venue: 'shop', intro: 'Es riecht nach Leder und Loden. Die Verkäuferin lächelt wissend.', sections: [{ t: 'Echte Tracht', items: [
    it('o_hut', 69, { n: 'Tirolerhut mit Feder', icon: 'hat', wear: { hat: 9, hatCol: 8 }, unlock: 'tirolerhut', d: 'Loden, mit Spielhahnfeder' }),
    it('o_hemd', 79, { n: 'Trachtenhemd kariert', icon: 'shirt', wear: { top: 11, topCol: 0 }, unlock: 'trachtenhemd', d: 'Rot-weiss kariert' }),
    it('o_lederhose', 249, { n: 'Lederhose mit Hosenträgern', icon: 'pants', wear: { pants: 7 }, unlock: 'lederhose', d: 'Hirschleder, knielang' }),
    it('o_haferl', 139, { n: 'Haferlschuhe', icon: 'shoe', wear: { shoes: 6 }, unlock: 'haferlschuhe', d: 'Seitlich geschnürt' }),
  ] }] },
  barbier: { title: 'Friseur & Barbier', mode: 'special', venue: 'barbier', intro: 'Der Barbier schärft sein Messer. „Was machen wir heute?“', sections: [{ t: 'Neuer Look', items: [it('s_hair', 28, { n: 'Haarschnitt & Farbe', icon: 'scissors', special: 'hair', d: 'Frisur und Haarfarbe frei wählen' }), it('s_beard', 18, { n: 'Bart trimmen', icon: 'scissors', special: 'beard', d: 'Bart und Bartfarbe frei wählen' })] }, { t: 'Schnell und radikal', items: [it('s_glatze', 15, { n: 'Glatze rasieren', icon: 'scissors', special: 'glatze', d: 'Alles ab – blank wie ein Ei' }), it('s_rasur', 12, { n: 'Bart abrasieren', icon: 'scissors', special: 'rasur', d: 'Glatt rasiert mit dem Messer' })] }] },
};
ITEMS.kebap = { n: 'Kebap mit allem', t: 'food', food: 60, mood: 7, nau: -18, icon: 'kebap' };

/* ============ Story ============ */
const Story = {
  ready: false,
  say(sp, text) { return UI.say(sp, text); },
  ask(sp, text, opts) { return UI.ask(sp, text, opts); },
  objective() {
    const s = G.S.stage, org = playerIsKassier() ? null : fname(who('kassier'));
    switch (s) {
      case 'meet': {
        const n = meetNeed();
        if (!n.missing.length && !n.more) return 'Alle da – gleich geht\'s zum Gleis. Abfahrt 9:10!';
        const parts = [];
        if (n.missing.length) parts.push(listNames(n.missing));
        if (n.more) parts.push(moreStr(n.more));
        return `Torbogen: Begrüss ${parts.join(' – dazu ')} · Abfahrt 9:10!`;
      }
      case 'board': return hasInv('billett') ? 'Gleis 4: Steig in den IR nach Zürich – Abfahrt 9:10!' : 'Billettautomat in der Bahnhofshalle: Gruppenbillett kaufen – Abfahrt 9:10!';
      case 'ride': return 'Railjet nach Innsbruck · Wagen 3, Vierertisch';
      case 'arrived': return 'Innsbruck Hbf! Aussteigen – Zugtür im Vorraum links vom Speisewagen';
      case 'findHotel': return 'Finde das Hotel Zirbe (Altstadt, Gasse beim Goldenen Dachl)';
      case 'checkin': return 'Check an der Rezeption ein';
      case 'room': return 'Bezieh Zimmer 307 im 3. Stock';
      case 'bar': return 'Triff die Jungs in der Gamsbock Bar (Maria-Theresien-Strasse)';
      default: {
        const tips = [];
        const h = hourOf(G.S.time);
        if (G.S.money.eur < 15) tips.push('Fast pleite – Bankomat am Hauptbahnhof oder bei der BANK an der Maria-Theresien-Strasse');
        else if (G.S.st.energy < 25) tips.push('Du bist müde – leg dich im Zimmer 307 hin');
        else if (G.S.st.food < 25) tips.push('Hunger! Burger in der Gamsbock Bar?');
        else if (G.S.st.nau > 70) tips.push('Dir ist übel – Wasser, Essen oder Schlaf');
        else if (h >= 22 || h < 4) tips.push(h >= 1 && h < 3 ? 'Nachtleben: Club Lawine und Rouge in den Viaduktbögen' : 'Nachtleben: Club Lawine in den Viaduktbögen');
        else if (h < 17 && !G.S.ach.seegrube) tips.push('Nordkettenbahn zur Seegrube (bis 17:30)');
        else if (h < 16 && !G.S.ach.springer) tips.push('Tram zum Bergisel: Schanze, Turm und Gästespringen (9–16:30)');
        else if (dayOf(G.S.time) >= 2 && Math.floor(hourOf(G.S.time)) % 3 === 0) tips.push('Genug gefeiert? Heimreise am Hauptbahnhof – das beendet das Spiel');
        else tips.push('Die Jungs sind in der Gamsbock Bar');
        return `${tips[0]} · Fotos ${Object.keys(G.S.photos).length}/${Object.keys(SIGHTS).length}`;
      }
    }
  },
  objectiveTag() { return { meet: 'LUZERN', board: 'GLEIS 4', ride: 'RAILJET', arrived: 'AUSSTIEG', findHotel: 'HOTEL', checkin: 'HOTEL', room: 'ZIMMER', bar: 'BAR', free: 'FREI' }[G.S.stage]; },
  steps() {
    return [
      { t: 'Die Jungs beim Torbogen treffen', d: `Bahnhofplatz Luzern – ${playerIsKassier() ? `${fname(who('party'))} und ${fname(who('foto'))}` : `${fname(who('party'))}, ${fname(who('foto'))} und ${fname(who('kassier'))}`} begrüssen, insgesamt mindestens vier`, done: stageAt('board') },
      { t: 'Gruppenbillett kaufen', d: 'Billettautomat in der Bahnhofshalle, 12 Personen', done: hasInv('billett') || stageAt('ride') },
      { t: 'Pünktlich um 9:10 in den IR nach Zürich', d: 'Gleis 4, umsteigen in Zürich HB', done: stageAt('arrived') },
      { t: 'Hotel Zirbe finden', d: 'Gasse südlich vom Goldenen Dachl', done: stageAt('checkin') },
      { t: 'Einchecken', d: 'Rezeption bei Frau Hofer', done: stageAt('room') },
      { t: 'Zimmer 307 beziehen', d: '3. Stock, Rucksack auspacken', done: stageAt('bar') },
      { t: 'Die Jungs in der Gamsbock Bar treffen', d: 'Maria-Theresien-Strasse, Ostseite', done: stageAt('free') },
      { t: 'Innsbruck geniessen', d: 'Bars, Club Lawine, Casino, Shopping, Nordkette, Altstadt', done: Object.keys(G.S.ach).length >= 20 },
      { t: 'Heimreise nach Luzern', d: 'Am Hauptbahnhof, wann ihr wollt – damit endet das Spiel', done: !!G.S.finished },
    ];
  },
  setStage(s) { G.S.stage = s; UI.hud(); },
  mapPois(id) {
    if (id !== 'ibk') return [];
    const A = '#ffb53d', S = '#6cc46f', V = '#7ab0f0', N = '#e85af0';
    return [
      { x: 19, y: 46, n: 'Hotel Zirbe', c: A }, { x: 43, y: 64, n: 'Gamsbock Bar', c: A }, { x: 25, y: 46, n: 'Stüberl', c: A }, { x: 71, y: 63, n: 'Club Lawine', c: N },
      { x: 65, y: 63, n: 'Rouge', c: N }, { x: 50, y: 80, n: 'Casino', c: N }, { x: 74, y: 74, n: 'Hauptbahnhof', c: V }, { x: 34, y: 33, n: 'Goldenes Dachl', c: V }, { x: 24, y: 38, n: 'Stadtturm', c: V }, { x: 45, y: 33, n: 'Dom', c: V },
      { x: 62, y: 33, n: 'Hofburg', c: V }, { x: 61, y: 38, n: 'Leopoldsbrunnen', c: V }, { x: 77, y: 31, n: 'Nordkettenbahn', c: V }, { x: 85, y: 44, n: 'Hofgarten', c: V }, { x: 79, y: 82, n: 'Tram Bergisel', c: V },
      { x: 35, y: 64, n: 'Annasäule', c: V }, { x: 35, y: 81, n: 'Triumphpforte', c: V }, { x: 30, y: 20, n: 'Innbrücke', c: V },
      { x: 3, y: 46, n: 'Sport', c: S }, { x: 9, y: 46, n: 'Tracht', c: S }, { x: 4, y: 64, n: 'Mode', c: S }, { x: 11, y: 64, n: 'Boutique', c: S }, { x: 19, y: 64, n: 'Kostüme', c: S }, { x: 29, y: 46, n: 'Souvenir', c: S }, { x: 21, y: 72, n: 'Apotheke', c: S }, { x: 28, y: 72, n: 'Spar', c: S },
      { x: 43, y: 72, n: 'Souvenir', c: S }, { x: 49, y: 72, n: 'Trafik', c: S }, { x: 19, y: 80, n: 'Bankomat', c: A }, { x: 60, y: 74, n: 'Bankomat', c: A }, { x: 28, y: 80, n: 'Barbier', c: S }, { x: 43, y: 80, n: 'Konditorei', c: S }, { x: 61, y: 77, n: 'Würstel', c: S }, { x: 87, y: 77, n: 'Taxi', c: A },
    ];
  },

  /* ---------- Freunde platzieren ---------- */
  /* Der Nachzügler ist nicht dabei: vor der Abfahrt raucht er vor dem Bahnhof, danach sitzt er im Taxi. */
  away(id) {
    if (id !== latecomer()) return false;
    if (G.S.stage === 'board') return true;
    return !!(G.S.flags.late && !G.S.flags.lateArrived);
  },
  /* Wo ist ein Kollege gerade? Text und Kartenpunkt für Handy-Status und Karte. */
  whereIs(id) {
    const s = G.S.stage;
    if (this.away(id)) return { t: G.S.flags.late ? 'im Taxi unterwegs nach Innsbruck' : 'raucht noch vor dem Bahnhof', x: null };
    if (!stageAt('bar')) {
      if (G.S.map === 'luzern' || s === 'meet') return { t: 'beim Torbogen in Luzern', x: null };
      if (s === 'board') return { t: 'auf Gleis 4', x: null };
      if (s === 'ride' || s === 'arrived') return { t: 'im Zug, Wagen 3', x: null };
      return { t: 'auf dem Weg ins Hotel Zirbe', x: 19, y: 46 };
    }
    const j = G.S.flags.jail;
    if (j && j.id === id && G.S.time < j.until) return { t: `auf der Polizeiwache beim Bahnhof (bis ca. ${clockStr(j.until)})`, x: 74, y: 74 };
    const loc = this.schedule(id);
    const P = { bar: ['in der Gamsbock Bar', 43, 64], stueberl: ['im Tiroler Stüberl', 25, 46], club: ['im Club Lawine', 71, 63], rouge: ['im Rouge', 65, 63], hotel: ['im Hotel Zirbe', 19, 46], breakfast: ['beim Frühstück im Hotel', 19, 46], city: ['beim Goldenen Dachl', 34, 33] };
    const e = P[loc];
    if (!e) return { t: 'irgendwo in Innsbruck', x: null };
    const sick = G.S.flags.sick && G.S.flags.sick[id] === dayOf(G.S.time - 300);
    return { t: sick && loc === 'hotel' ? 'im Hotel, schläft seinen Rausch aus' : e[0], x: e[1], y: e[2] };
  },
  schedule(id) {
    if (this.away(id)) return null;
    const h = hourOf(G.S.time);
    const o = G.S.flags.group;
    const j = G.S.flags.jail;
    if (j && j.id === id && G.S.time < j.until) return null;
    /* Wer sich übergeben hat, liegt bis zum Morgen im Hotel */
    if (G.S.flags.sick && G.S.flags.sick[id] === dayOf(G.S.time - 300) && stageAt('bar')) return 'hotel';
    if (o && G.S.time < o.until && o.ids.includes(id)) return o.loc;
    if (!stageAt('bar')) return null;
    if (G.S.stage === 'bar') return 'bar';
    if (h >= 2.5 && h < 9) return 'hotel';
    if (h >= 9 && h < 11) return ['kassier', 'gourmet', 'anwalt', 'muskel'].includes(FRIENDS[id].fn) ? 'breakfast' : 'hotel';
    if (h >= 14 && h < 17 && FRIENDS[id].fn === 'pilot') return 'city';
    if (h >= 22 || h < 2.5) {
      if (FRIENDS[id].fn === 'charmeur' && h >= 0.5 && h < 2.5) return 'rouge';
      if (['party', 'taenzer', 'charmeur', 'raucher'].includes(FRIENDS[id].fn)) return 'club';
      if (['saeufer', 'kanadier'].includes(FRIENDS[id].fn) && h >= 22 && h < 24) return 'stueberl';
      if (h < 2) return 'bar';
      return 'hotel';
    }
    return 'bar';
  },
  friendActor(id, tx, ty, dir, pose = 'stand', extra = {}) {
    const f = FRIENDS[id], p = T2P(tx, ty);
    return new Actor(Object.assign({ id, friend: true, name: f.name, look: f.look, x: p.x, y: p.y, dir, pose, solid: true, talk: () => Story.talkFriend(id), keepDir: pose === 'sit', label: 'Reden: ' + f.name, sitIdle: pose === 'sit' }, extra));
  },
  populate(m) {
    const ids = Object.keys(FRIENDS).filter((id) => !this.away(id));
    const add = (id, tx, ty, dir, pose, extra) => { if (FRIENDS[id]) G.npcs.push(this.friendActor(id, tx, ty, dir, pose, extra)); };
    const s = G.S.stage;
    if (m.id === 'luzern' && s === 'board') {
      /* Der Raucher steht noch vor dem Bahnhof – und wird den Zug verpassen */
      add(latecomer(), 17, 9, 0, 'stand', { bubbleRand: ['dots'] });
      return;
    }
    if (m.id === 'luzern' && s === 'meet') {
      const spots = [[14, 15, 0], [16, 15, 0], [18, 15, 0], [20, 15, 1], [13, 14, 2], [21, 14, 1], [15, 16, 3], [19, 16, 3], [17, 16, 3]];
      const org = who('kassier'), party = who('party'), foto = who('foto');
      let k = 0;
      for (const id of ids) {
        if (id === party) { add(id, 5, 12, 3, 'stand', { bubbleRand: ['beer'] }); continue; }
        if (id === foto) { add(id, 12, 20, 0, 'stand', { bubbleRand: ['!'] }); continue; }
        const sp = spots[k++ % spots.length];
        add(id, sp[0], sp[1], sp[2], 'stand', { bubbleRand: id === org ? ['?'] : ['dots', 'note'] });
      }
      /* Wer noch begrüsst werden muss, winkt dauerhaft mit „!“ */
      for (const n of G.npcs) if (n.friend && meetNeed().missing.includes(n.id)) { n.bubbleRand = ['!']; n.bubble = '!'; n.bubbleT = 99; }
      return;
    }
    if (m.id === 'luzern_halle' && s === 'board') {
      let k = 0;
      for (const id of ids) { const x = 11 + (k % 6), y = 9 + Math.floor(k / 6); add(id, x, y, 3, 'stand'); k++; }
      return;
    }
    if (m.id === 'zug' && (s === 'ride' || s === 'arrived')) {
      if (s === 'arrived') {
        /* Warten vor der Tür (Reihen 5–6) und an den Bistrotischen – nicht fest, damit der Spieler zur Tür durchkommt */
        const spots = [[20, 5], [21, 5], [22, 5], [20, 6], [21, 6], [22, 6], [25, 3], [27, 3], [29, 3], [31, 3], [33, 3], [35, 3]];
        let k = 0; for (const id of ids) { const sp = spots[k++ % spots.length]; add(id, sp[0], sp[1], 3, 'stand', { bubbleRand: ['!'], solid: false }); }
        return;
      }
      const tm = trainState().tm;
      const seats = [[46, 3, 2], [46, 2, 2], [48, 2, 1], [46, 5, 2], [48, 5, 1], [46, 6, 2], [48, 6, 1], [50, 2, 2], [52, 2, 1], [50, 3, 2], [52, 3, 1]];
      const jassP = who('jass');
      const order = [jassP, ...ids.filter((x) => x !== jassP)];
      let k = 0;
      for (const id of order) {
        if (FRIENDS[id].fn === 'gourmet' && tm > 20 && tm < 110) { add(id, 30, 4, 0, 'stand', { drinkIdle: true }); continue; }
        if (FRIENDS[id].fn === 'saeufer' && tm > 40 && tm < 140) { add(id, 27, 4, 0, 'drink', { drinkIdle: true }); continue; }
        const st = seats[k++];
        if (!st) break;
        add(id, st[0], st[1], st[2], 'sit', { bubbleRand: ['card', 'dots', 'zzz'] });
      }
      return;
    }
    if (m.id === 'ibk') {
      for (const id of ids) if (this.schedule(id) === 'city') add(id, 33, 38, 3, 'stand', { bubbleRand: ['!'] });
      return;
    }
    const here = ids.filter((id) => this.schedule(id) === m.id);
    if (m.id === 'bar') {
      const table = [[9, 8, 2], [9, 9, 2], [13, 8, 1], [13, 9, 1], [10, 7, 0], [12, 7, 0], [10, 10, 3], [12, 10, 3]];
      let k = 0;
      for (const id of here) {
        const fn = FRIENDS[id].fn;
        if (id === who('darts') && hash(dayOf(G.S.time), Math.floor(hourOf(G.S.time))) > 0.4) { add(id, 19, 4, 3, 'stand', { bubbleRand: ['!'] }); continue; }
        if (fn === 'frech' && here.length > 4) { add(id, 13, 5, 2, 'stand', { bubbleRand: ['!', 'note'] }); continue; }
        if (fn === 'saeufer') { add(id, 4, 6, 3, 'drink', { drinkIdle: true, bubbleRand: ['beer'] }); continue; }
        const t = table[k++];
        if (t) add(id, t[0], t[1], t[2], 'sit', { drinkIdle: true, bubbleRand: ['beer', 'note', 'card'] });
        else add(id, 15 + (k % 4), 12, 3, 'stand', { drinkIdle: true });
      }
      return;
    }
    if (m.id === 'club') {
      const spots = [[11, 8], [13, 9], [10, 10], [14, 7]];
      let k = 0;
      for (const id of here) {
        const fn = FRIENDS[id].fn;
        if (fn === 'raucher') { add(id, 3, 14, 0, 'stand', { bubbleRand: ['dots'] }); continue; }
        if (fn === 'charmeur') { add(id, 21, 6, 1, 'stand', { drinkIdle: true, bubbleRand: ['heart'] }); continue; }
        const sp = spots[k++ % 4];
        add(id, sp[0], sp[1], 0, 'stand', { danceIdle: true });
      }
      return;
    }
    if (m.id === 'stueberl') { let k = 0; for (const id of here) { add(id, 7 + k, 8, 3, 'sit', { drinkIdle: true, bubbleRand: ['beer'] }); k++; } return; }
    if (m.id === 'rouge') { let k = 0; for (const id of here) { add(id, 1 + k, 6, 0, 'sit', { drinkIdle: true, bubbleRand: ['heart', 'beer'] }); k++; } return; }
    if (m.id === 'hotel_lobby') { const b = ids.filter((id) => this.schedule(id) === 'breakfast'); b.slice(0, 4).forEach((id, k) => add(id, 2 + (k % 2), k < 2 ? 9 : 11, 3, 'sit', { bubbleRand: ['dots'] })); }
  },
  friendsHere() { return G.npcs.filter((n) => n.friend && !n.hidden).map((n) => n.id); },
  _lastHour: -1,
  minute() {
    const h = Math.floor(hourOf(G.S.time));
    const m = G.map;
    if (!stageAt('ride')) {
      if (G.S.time >= DEP_TIME) { this.missedTrain(); return; }
      const left = DEP_TIME - Math.floor(G.S.time);
      if ([10, 5, 2].includes(left) && !G.S.flags['dep' + left]) {
        G.S.flags['dep' + left] = 1; Snd.sfx('ding');
        UI.toast(`🔊 Noch ${left} Minuten bis zur Abfahrt des IR 70 auf Gleis 4${hasInv('billett') ? '' : ' – und du hast noch kein Billett'}!`, 'warn');
      }
    }
    if (h !== this._lastHour) {
      const prev = this._lastHour;
      this._lastHour = h;
      if (prev >= 0 && m.id === 'ibk' && !G.busy) for (const d of m.npcDefs) if (d.cond) { const has = G.npcs.some((n) => n.id === d.id); const want = d.cond(); if (want && !has) G.npcs.push(new Actor(Object.assign({}, d))); if (!want && has) G.npcs = G.npcs.filter((n) => n.id !== d.id); }
      if (prev >= 0 && ['bar', 'club', 'stueberl', 'rouge', 'hotel_lobby', 'ibk'].includes(m.id) && !G.busy) {
        const before = this.friendsHere().sort().join();
        G.npcs = G.npcs.filter((n) => !n.friend);
        this.populate(m);
        const after = this.friendsHere().sort().join();
        if (before !== after && m.id !== 'ibk') {
          const left = before.split(',').filter((x) => x && !after.includes(x));
          if (left.length) UI.toast(`${left.map(fname).join(', ')} ${left.length > 1 ? 'ziehen' : 'zieht'} weiter.`);
        }
      }
      const closing = { bar: 'bar', club: 'club', stueberl: 'stueberl', rouge: 'rouge' }[m.id];
      if (closing && !isOpen(closing) && !G.busy) this.closingTime(closing);
    }
    this.maybeEvent();
  },

  /* ---------- Versteckte Zufallsereignisse in der Stadt ---------- */
  tempActor(o) { const a = new Actor(Object.assign({ solid: false, speed: 70, ev: true, dir: 0 }, o)); G.npcs.push(a); return a; },
  walk(a, tx, ty) { return new Promise((res) => { a.path = [{ x: tx, y: ty }]; a.onArrive = () => res(); }); },
  dropActor(a) { G.npcs = G.npcs.filter((n) => n !== a); },
  evCount(id) { return (G.S.flags.ev && G.S.flags.ev[id]) || 0; },
  EVENTS: [
    { id: 'ueberfall', max: 2, night: 23, cond: () => { const h = hourOf(G.S.time); return h >= 23 || h < 4; } },
    { id: 'polizei', max: 2, cond: () => { const h = hourOf(G.S.time); const v = Story.victim(); return v && h >= 11 && h < 23 && Story.schedule(v) && !Story.away(v); } },
    { id: 'hundkatze', max: 3, cond: () => { const h = hourOf(G.S.time); return h >= 8 && h < 20; } },
    { id: 'taube', max: 3, cond: () => { const h = hourOf(G.S.time); return h >= 7 && h < 19 && G.S.st.wet === 0; } },
    { id: 'krampus', max: 2, cond: () => { const h = hourOf(G.S.time); return h >= 17 && h < 22; } },
    { id: 'portemonnaie', max: 2, cond: () => { const h = hourOf(G.S.time); return h >= 9 && h < 21; } },
    { id: 'ufo', max: 1, night: 21, cond: () => { const h = hourOf(G.S.time); return h >= 21 || h < 3; } },
    { id: 'trump', max: 1, cond: () => { const h = hourOf(G.S.time); return h >= 10 && h < 18; } },
    { id: 'verfolgung', max: 2, cond: () => { const h = hourOf(G.S.time); return h >= 9 && h < 23 && G.S.money.eur >= 20; } },
  ],
  victim() { return FRIENDS.oelu && !Story.away('oelu') ? 'oelu' : (FRIENDS.didu ? 'didu' : Object.keys(FRIENDS)[0]); },
  maybeEvent() {
    if (G.map.id !== 'ibk' || G.busy || G.mode !== 'play' || !stageAt('free') || G.live) return;
    const fl = G.S.flags;
    /* Tag 5: Godzilla – unabhängig vom Tagesereignis, einmalig, nicht vor 10 Uhr */
    if (dayOf(G.S.time) >= 4 && hourOf(G.S.time) >= 10 && !(fl.ev && fl.ev.monster)) { fl.ev = fl.ev || {}; fl.ev.monster = 1; fl.lastEv = G.S.time; this.announce('monster').then(() => this.ev_monster()); return; }
    /* Tagesplan: Jeden Tag ein Ereignis, ab einer zufälligen Uhrzeit. Welches Ereignis an welchem Tag kommt, wird pro Spiel
       einmal gemischt (flags.evOrder), damit jede Reise anders verläuft. Passt das nächste geplante Ereignis zur Zeit nicht
       (z. B. UFO nur nachts), kommt das nächste passende dran; passt keines, wird jede Minute neu geprüft. */
    const day = dayOf(G.S.time);
    fl.evPlan = fl.evPlan || {};
    if (!fl.evOrder) { const ids = this.EVENTS.map((e) => e.id); for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; } fl.evOrder = ids; }
    /* Zwei Ereignisse pro Tag: eines tagsüber (10–16 Uhr) und eines abends (17–23:30 Uhr), Startzeit jeweils zufällig.
       Alte Spielstände hatten eine einzelne Zahl; null (Tests) heisst: an diesem Tag keine Ereignisse. */
    if (fl.evPlan[day] === undefined) {
      let eve = Math.round((17 + Math.random() * 6.5) * 2) / 2;
      /* Ist als Nächstes ein Nacht-Ereignis dran (UFO, Überfall), wird der Abendtermin entsprechend spät gelegt */
      const nextUp = fl.evOrder.map((id) => this.EVENTS.find((e) => e.id === id)).filter((e) => e && this.evCount(e.id) < e.max).sort((a, b) => this.evCount(a.id) - this.evCount(b.id)).slice(0, 2).find((e) => e.night);
      if (nextUp) eve = Math.min(23.5, Math.max(eve, nextUp.night + Math.round(Math.random() * 2) / 2));
      fl.evPlan[day] = [Math.round((10 + Math.random() * 6) * 2) / 2, eve];
    }
    if (typeof fl.evPlan[day] === 'number') fl.evPlan[day] = [fl.evPlan[day]];
    const plan = fl.evPlan[day];
    if (!plan) return;
    fl.evN = fl.evN || {};
    if (fl.evDay === day && !fl.evN[day]) fl.evN[day] = 1; /* Spielstände von vor 2.10 */
    const n = fl.evN[day] || 0;
    if (n >= plan.length || hourOf(G.S.time) < plan[n]) return;
    if (fl.lastEv != null && G.S.time - fl.lastEv < 150) return; /* mindestens 2½ Stunden Abstand */
    const byOrder = fl.evOrder.map((id) => this.EVENTS.find((e) => e.id === id)).filter(Boolean);
    const pool = byOrder.filter((e) => this.evCount(e.id) < e.max && e.cond()).sort((a, b) => this.evCount(a.id) - this.evCount(b.id)); /* Wiederholungen erst, wenn alles einmal dran war */
    if (!pool.length) return;
    const e = pool[0];
    fl.ev = fl.ev || {}; fl.ev[e.id] = this.evCount(e.id) + 1; fl.lastEv = G.S.time; fl.evDay = dayOf(G.S.time); fl.evN[day] = n + 1;
    this.announce(e.id).then(() => this['ev_' + e.id]());
  },
  /* Jedes Ereignis beginnt mit einer kurzen Sequenz: Kinobalken fahren ein, „EREIGNIS“ blinkt, der Titel tippt sich
     Buchstabe für Buchstabe hin, Fanfare, Blitz – dann geht es in der Spielwelt los. Die Welt steht derweil (G.busy). */
  EV_TITLES: {
    ueberfall: ['Nachtschatten', 'Schritte hinter dir in der Gasse …'],
    polizei: ['Blaulicht', 'Die Polizei hat jemanden im Visier'],
    hundkatze: ['Hund gegen Katze', 'Showdown auf dem Platz'],
    taube: ['Die Taube', 'Von oben droht Gefahr'],
    krampus: ['Krampuslauf', 'Es rasselt und klirrt in den Gassen'],
    portemonnaie: ['Fundsache', 'Da liegt etwas auf dem Pflaster'],
    ufo: ['Unbekanntes Flugobjekt', 'Lichter über der Maria-Theresien-Strasse'],
    trump: ['Hoher Besuch', 'Motorradeskorte und Sirenen'],
    verfolgung: ['Taschendieb', 'Halt den Dieb!'],
    monster: ['Godzilla', 'Er kommt über die Nordkette'],
  },
  async announce(id) {
    const el = document.getElementById('cine');
    const [title, sub] = this.EV_TITLES[id] || ['Ereignis', ''];
    if (!el) return;
    G.busy++;
    const kick = el.querySelector('.ckick'), tt = el.querySelector('.ctitle'), ss = el.querySelector('.csub');
    kick.textContent = `Ereignis · Tag ${dayOf(G.S.time) + 1}`; tt.textContent = ''; ss.textContent = '';
    el.classList.add('on');
    Snd.tone(392, 0.12, 'square', 0.06); setTimeout(() => Snd.tone(523, 0.12, 'square', 0.06), 140); setTimeout(() => Snd.tone(659, 0.25, 'square', 0.07), 280);
    G.fx.shake = Math.max(G.fx.shake || 0, 0.35);
    await sleep(520);
    for (const ch of title) { tt.textContent += ch; if (ch !== ' ') Snd.tone(1200 + Math.random() * 400, 0.03, 'square', 0.025); await sleep(45); }
    ss.textContent = sub;
    el.classList.add('flash'); Snd.sfx('ding');
    await sleep(1500);
    el.classList.remove('on'); el.classList.remove('flash');
    await sleep(450);
    G.busy--;
  },
  /* Helfer für Ereignisse in der Spielwelt */
  wait(cond, max = 15000) { return new Promise((res) => { const t0 = performance.now(); const iv = setInterval(() => { if (cond() || performance.now() - t0 > max) { clearInterval(iv); res(); } }, 50); }); },
  roadRow() {
    const p = G.player, ty = p.y / TS, tx = p.x / TS;
    const rows = [26, 28, 84, 86].concat(tx >= 58 ? [66, 68] : []);
    return rows.reduce((a, b) => (Math.abs(b - ty) < Math.abs(a - ty) ? b : a));
  },
  async ev_ufo() {
    G.busy++;
    const p = G.player;
    const side = p.x > G.map.w * TS / 2 ? -1 : 1;
    const sx = p.x + side * 64, sy = p.y + 4;
    const live = { runWhileBusy: true, t: 0, h: 190, phase: 'descend', beam: 0,
      update(dt) { this.t += dt; if (this.phase === 'descend') { this.h = Math.max(46, this.h - 55 * dt); if (this.h <= 46) this.phase = 'hover'; } if (this.phase === 'hover') this.beam = Math.min(1, this.beam + dt * 1.5); if (this.phase === 'leave') { this.beam = Math.max(0, this.beam - dt * 2); this.h += 90 * dt; } },
      lights() { return this.beam > 0 ? [{ x: sx, y: sy, r: 70 * this.beam, c: '#8affb0' }, { x: sx, y: sy - this.h, r: 50, c: '#aee8ff' }] : []; },
      draw(c, cx, cy, t) {
        const x = sx - cx, gy = sy - cy, y = gy - this.h + Math.sin(t * 3) * 1.5;
        if (this.beam > 0) { c.fillStyle = `rgba(160,255,200,${0.22 * this.beam})`; c.beginPath(); c.moveTo(x - 8, y + 6); c.lineTo(x + 8, y + 6); c.lineTo(x + 26 * this.beam, gy + 4); c.lineTo(x - 26 * this.beam, gy + 4); c.closePath(); c.fill(); E(c, x, gy + 3, 26 * this.beam, 6 * this.beam, `rgba(160,255,200,${0.3 * this.beam})`); }
        E(c, x, gy + 3, 18, 4, 'rgba(0,0,0,0.25)');
        E(c, x, y + 4, 30, 7, '#8a9096'); E(c, x, y + 3, 28, 5, '#b8bcc2'); E(c, x, y - 3, 12, 8, 'rgba(160,230,255,0.75)'); E(c, x - 3, y - 5, 4, 2, 'rgba(255,255,255,0.6)');
        for (let k = 0; k < 10; k++) { const a = t * 4 + k * 0.628; P(c, Math.round(x + Math.cos(a) * 24), Math.round(y + 6 + Math.sin(a) * 4), k % 2 ? '#ff5aa0' : '#5aff8a'); }
      } };
    G.live = live;
    UI.toast('Ein Summen am Himmel. Die Laternen flackern – etwas landet neben dir!', 'warn');
    G.fx.shake = 0.3;
    for (let k = 0; k < 6; k++) { Snd.tone(500 + k * 90, 0.08, 'sine', 0.04, k * 0.3); }
    await this.wait(() => live.phase === 'hover');
    await sleep(900);
    const alien = this.tempActor({ name: 'Alien', look: npcLook(980, { skin: 12, hair: 0, beard: 0, eyes: 1, eyeCol: 3, top: 5, topCol: 6, pants: 3, pantsCol: 2, shoes: 0, shoesCol: 3, glasses: 0, mark: 0, hat: 0, jewel: 0, acc: 0, print: 0, build: 0, height: 0 }), x: sx, y: sy, speed: 40, bubbleRand: ['?'] });
    for (let i = 0; i < 16; i++) addPart({ x: sx + rnd(-10, 10), y: sy - rnd(0, 30), vx: 0, vy: -20, life: 1.2, kind: 'spark', col: 'rgba(160,255,200,0.9)' });
    await this.walk(alien, p.x + side * 16, p.y);
    alien.dir = dirTo(alien.x, alien.y, p.x, p.y); p.dir = dirTo(p.x, p.y, alien.x, alien.y);
    await this.say(alien, 'Blip. Blop. … Übersetzer an. Grüss dich, Erdling. Bring mich zu eurem Anführer.');
    const c = await this.ask(alien, 'Das Wesen ist grün, hat riesige Augen und riecht nach Zirbe.', [`Zum Piloten (${fname(who('pilot'))})`, 'In die Gamsbock Bar', 'Ein Bier anbieten', 'Weglaufen']);
    if (c === 3) { await this.say(alien, 'Blop. Unhöflich. Wir kommen wieder. In 3.000 Jahren.'); mood(-2); }
    else {
      if (c === 0) await this.say(alien, `${fname(who('pilot'))}? Ein Pilot? Er fliegt in einem Blechvogel, ohne Antimaterie? Primitiv, aber mutig. Den nehmen wir mit. Später.`);
      if (c === 1) await this.say(alien, 'Gams-bock-bar. Dort gibt es „Bier“? Unser Scanner zeigt: 4,8 Prozent Freude.');
      if (c === 2) { if (hasInv('dosenbier') || hasInv('bier')) { takeInv(hasInv('dosenbier') ? 'dosenbier' : 'bier'); await this.say(alien, '… … … BLOP! Das ist das Beste, was ich je … Wir nehmen zwölf Kisten mit. Hier, ein Geschenk.'); } else await this.say(alien, 'Du hast gar keins dabei. Erdlinge. Trotzdem: ein Geschenk, für die Mühe.'); }
      addInv('meteorit'); mood(10);
      await this.say(alien, 'Ein Stein von unserem Mond. Leuchtet im Dunkeln. Erzähl niemandem davon – sie glauben dir eh nicht.');
    }
    achieve('alien');
    G.busy--;
    await this.walk(alien, sx, sy);
    this.dropActor(alien);
    for (let i = 0; i < 16; i++) addPart({ x: sx + rnd(-10, 10), y: sy - rnd(0, 30), vx: 0, vy: -20, life: 1.2, kind: 'spark', col: 'rgba(160,255,200,0.9)' });
    live.phase = 'leave';
    Snd.sfx('whoosh');
    setTimeout(() => { if (G.live === live) G.live = null; }, 3500);
    UI.toast('Das UFO steigt lautlos auf und ist weg.');
  },
  async ev_trump() {
    G.busy++;
    const p = G.player, m = G.map;
    const row = this.roadRow();
    const ry = row * TS + 13;
    const dir = p.x > m.w * TS / 2 ? -1 : 1;
    const startX = dir > 0 ? -60 : m.w * TS + 60;
    const stopX = p.x - dir * 20;
    const [cc, cx] = canvas(32, 22); objCar(0, 0, '#111114').paint(cx, 32, 22);
    const cars = [0, 1, 2].map((k) => { const v = { kind: 'car', ev: true, x: startX - dir * k * 44, y: ry, dir, speed: 95, k, update(dt) { const target = stopX - dir * k * 44; if (dir > 0 ? v.x < target : v.x > target) v.x += dir * v.speed * dt; else v.x = target; }, draw(c, cx2, cy2) { const x = Math.round(v.x - cx2), y = Math.round(v.y - cy2 - 20); if (x > View.w + 40 || x < -60) return; if (v.dir < 0) { c.save(); c.translate(x + 32, y); c.scale(-1, 1); c.drawImage(cc, 0, 0); c.restore(); } else c.drawImage(cc, x, y); R(c, x + 4, y - 2, 1, 6, '#c9ccd2'); R(c, x + 5, y - 2, 5, 3, k === 1 ? '#c8302a' : '#2f5fb8'); if (k === 1) { R(c, x + 5, y - 2, 2, 3, '#ffffff'); } if (Math.floor(G.t * 8) % 2 === 0) R(c, x + 26, y + 2, 3, 2, '#4a8aff'); }, sortY: () => v.y }; return v; });
    const bike = { kind: 'car', ev: true, x: startX + dir * 30, y: ry, dir, speed: 100, update(dt) { const target = stopX + dir * 40; if (dir > 0 ? bike.x < target : bike.x > target) bike.x += dir * bike.speed * dt; }, draw(c, cx2, cy2) { const x = Math.round(bike.x - cx2), y = Math.round(bike.y - cy2 - 12); R(c, x, y + 4, 16, 6, '#2f5fb8'); R(c, x + 5, y - 2, 6, 7, '#1a1a1e'); E(c, x + 3, y + 11, 3, 3, '#1a1a1e'); E(c, x + 13, y + 11, 3, 3, '#1a1a1e'); R(c, x + 2, y - 3, 4, 3, Math.floor(G.t * 8) % 2 ? '#4a8aff' : '#ff4a4a'); }, sortY: () => bike.y };
    m.vehicles.push(bike, ...cars);
    UI.toast('Sirenen! Eine Wagenkolonne mit Fähnchen biegt in die Strasse ein.', 'warn');
    const sir = setInterval(() => Snd.tone(Math.floor(performance.now() / 300) % 2 ? 660 : 520, 0.22, 'square', 0.03), 300);
    await this.wait(() => cars.every((v) => Math.abs(v.x - (stopX - dir * v.k * 44)) < 1), 9000);
    clearInterval(sir);
    const carX = cars[1].x + 16, carY = ry - 6;
    const dt = this.tempActor({ name: 'Donald', look: npcLook(983, { skin: 4, hair: 3, hairCol: 5, beard: 0, top: 9, topCol: 10, pants: 5, pantsCol: 8, shoes: 3, shoesCol: 1, build: 3, height: 2, mouth: 3, brows: 5, glasses: 0, hat: 0, print: 0, acc: 0 }), x: carX, y: carY, speed: 50 });
    const g1 = this.tempActor({ name: 'Secret Service', look: npcLook(984, { hair: 1, hairCol: 0, beard: 0, top: 9, topCol: 16, pants: 5, pantsCol: 2, shoes: 3, shoesCol: 1, glasses: 4, build: 3, hat: 0 }), x: cars[0].x + 16, y: carY, speed: 55 });
    const g2 = this.tempActor({ name: 'Secret Service', look: npcLook(985, { hair: 1, hairCol: 0, beard: 0, top: 9, topCol: 16, pants: 5, pantsCol: 2, shoes: 3, shoesCol: 1, glasses: 4, build: 3, hat: 0 }), x: cars[2].x + 16, y: carY, speed: 55 });
    await Promise.all([this.walk(dt, p.x - dir * 22, p.y), this.walk(g1, p.x - dir * 40, p.y - 14), this.walk(g2, p.x - dir * 40, p.y + 14)]);
    dt.dir = dirTo(dt.x, dt.y, p.x, p.y); p.dir = dirTo(p.x, p.y, dt.x, dt.y);
    await this.say(dt, 'Innsbruck. Tremendous. The best mountains, everybody says so. You – are you from Switzerland? Great cheese. I love cheese.');
    const c = await this.ask(dt, 'Zwei Männer mit Sonnenbrillen und Knopf im Ohr mustern dich.', ['Selfie machen', 'Ihm ein Bier anbieten', 'Über Zölle diskutieren', 'Nur nicken']);
    if (c === 0) { Snd.sfx('shutter'); G.fx.flash = 1; mood(8); await this.say(dt, 'Great photo. The best photo. Put it on the internet, it\'ll go viral. Believe me.'); }
    else if (c === 1) { await this.say(dt, 'I don\'t drink. Never did. Best decision I ever made. But my people will take it. Thank you, Swiss.'); if (hasInv('dosenbier')) takeInv('dosenbier'); mood(5); }
    else if (c === 2) { await this.say(g1, 'Sir, bitte zurücktreten.'); await this.say(dt, 'Tariffs? On cheese? Interesting. We\'ll look into it. Very strongly.'); mood(-3); UI.toast('Die Secret-Service-Männer schieben dich sanft, aber bestimmt zur Seite.'); }
    else { await this.say(dt, 'Smart guy. Very smart. I like him.'); mood(3); }
    await this.say(g2, 'Weiter geht\'s, Sir. Der Kaiserschmarrn wartet.');
    achieve('trump');
    G.busy--;
    await Promise.all([this.walk(dt, carX, carY), this.walk(g1, cars[0].x + 16, carY), this.walk(g2, cars[2].x + 16, carY)]);
    for (const a of [dt, g1, g2]) this.dropActor(a);
    for (const v of cars) v.update = (d) => { v.x += dir * 110 * d; };
    bike.update = (d) => { bike.x += dir * 115 * d; };
    const sir2 = setInterval(() => Snd.tone(Math.floor(performance.now() / 300) % 2 ? 660 : 520, 0.22, 'square', 0.02), 300);
    setTimeout(() => { clearInterval(sir2); m.vehicles = m.vehicles.filter((v) => !v.ev); }, 6000);
  },
  async ev_verfolgung() {
    G.busy++;
    const p = G.player, m = G.map;
    const side = Math.random() < 0.5 ? -1 : 1;
    const th = this.tempActor({ name: 'Taschendieb', look: npcLook(973, { hat: 3, hatCol: 0, top: 3, topCol: 16, pants: 4, pantsCol: 2, beard: 1 }), x: p.x + side * 70, y: p.y, speed: 82, bubbleRand: ['dots'] });
    await this.walk(th, p.x + side * 14, p.y);
    Snd.sfx('whoosh'); th.bubble = '!'; th.bubbleT = 2;
    await this.say(null, 'Ein Rempler, ein „Entschuldigung“ – und dein Portemonnaie ist weg! Der Kerl rennt los.');
    /* Fluchtweg: sieben Wegpunkte im Zickzack quer über die Karte, innerhalb der Kartengrenzen */
    const W = m.w * TS, H = m.h * TS;
    let x = th.x, y = th.y; const pts = [];
    let dx = -side; let dy = p.y > H / 2 ? -1 : 1;
    for (let k = 0; k < 9; k++) { x = clamp(x + dx * rnd(70, 130), 24, W - 24); y = clamp(y + dy * rnd(40, 100), 24, H - 24); pts.push({ x, y }); if (k % 2 === 1) dx = -dx; if (k === 2 || k === 5) dy = -dy; }
    th.path = pts.slice(); th.onArrive = null;
    th.bubbleRand = ['!'];
    const loss = Math.min(G.S.money.eur, Math.round(rnd(30, 60)));
    UI.toast('HINTERHER! Renn (Shift bzw. weit ziehen) und fass ihn – er ist schnell und schlägt Haken!', 'warn');
    G.busy--;
    let done = false, t = 0, puff = 0, stamina = 3.5, away = false;
    const live = { update(dt) {
      t += dt; puff -= dt;
      const d = Math.hypot(th.x - G.player.x, th.y - G.player.y);
      if (d > 26) away = true;
      /* Spurt, wenn du ihm auf die Pelle rückst (solange der Atem reicht); nach 15 Sekunden geht ihm die Luft aus */
      const sprint = d < 40 && stamina > 0 && t < 15;
      if (sprint) stamina -= dt;
      th.speed = sprint ? 94 : t > 15 ? 66 : 78;
      if (d < 40 && puff <= 0) { puff = 0.5; addPart({ x: th.x + rnd(-4, 4), y: th.y - 2, vx: rnd(-10, 10), vy: -12, life: 0.5, kind: 'spark', col: '#ffffff' }); }
      if (away && d < 11) done = 'caught'; else if ((!th.path || !th.path.length) || t > 40) done = 'lost';
    } };
    G.live = live;
    await this.wait(() => !!done || G.map !== m, 48000);
    if (G.live === live) G.live = null;
    if (G.map !== m) { addMoney('eur', -loss); UI.toast(`Du hast ihn aus den Augen verloren. ${fmtEur(loss)} weg.`); return; }
    G.busy++;
    th.path = null; th.moving = false;
    if (done === 'caught') { th.dir = dirTo(th.x, th.y, G.player.x, G.player.y); mood(10); energy(-12); achieve('verfolgung'); await this.say('me', 'HAB DICH! Her mit dem Portemonnaie!'); await this.say(th, pick(['Okay, okay! Schweizer sind schneller als sie aussehen.', 'Keuch … wer rennt denn bei der Kälte so?! Da, nimm.'])); UI.toast('Portemonnaie zurück. Alles drin.'); th.path = [{ x: th.x + side * 120, y: th.y }]; th.onArrive = () => this.dropActor(th); }
    else { addMoney('eur', -loss); mood(-8); energy(-10); await this.say('me', `Weg ist er. Und ${fmtEur(loss)} mit ihm. Immerhin: Der Ausweis liegt im Hotel.`); this.dropActor(th); }
    G.busy--;
  },
  async ev_monster() {
    G.busy++;
    const p = G.player, m = G.map;
    UI.toast('Sirenen in der ganzen Stadt. Der Boden bebt …', 'warn');
    G.fx.shake = 1; Snd.tone(55, 0.8, 'sawtooth', 0.14, 0, -20);
    await this.say(voice('pilot'), 'Das ist KEIN Föhn! Da … da kommt GODZILLA über die Nordkette! Der Turm ist höher als die Hofburg!');
    await this.say(null, 'Godzilla stapft auf dich zu. Wo ein Schatten auf den Boden fällt, landet gleich ein Fuss – und wenn seine Rückenplatten blau leuchten, kommt der Atomstrahl: raus aus der Linie! 32 Sekunden, dann ist er durch.');
    const self = this;
    /* Godzilla: Schritte mit angehobenem Fuss, schwingender Schwanz, Rückenplatten, die vor dem Atomstrahl von hinten nach vorn
       blau aufglühen, aufreissendes Maul mit Zahnreihe, Atemstrahl, der über den Boden fegt und Brandspuren hinterlässt */
    const god = { x: p.x + 20, y: p.y - 190, step: 0, foot: 0, footT: 0, charge: 0, beam: null, mouth: 0, roarT: 0, walking: true, scorch: [], blink: 0 };
    const DARK = '#1b3326', MID = '#2a4a36', LIGHT = '#4a7a52', BELLY = '#8aa07a', CLAW = '#d8d8c8';
    const drawGod = (c, x, y, t) => {
      const bob = Math.abs(Math.sin(god.step * Math.PI)) * 2;
      const plateCol = (k) => { const g = clamp(god.charge * 1.4 - k * 0.12, 0, 1); return g > 0 ? mix('#4a8a5a', '#9ae8ff', g) : '#4a8a5a'; };
      E(c, x, y + 4, 36, 10, 'rgba(0,0,0,0.35)');
      /* Schwanz: Segmente nach hinten oben, pendelt */
      for (let k = 9; k >= 0; k--) { const sz = 11 - k; const sw = Math.sin(t * 2.2 + k * 0.5) * (2 + k * 1.4); const tx = x - 10 - k * 7 + sw, ty = y - 20 - k * 5; E(c, tx, ty, sz, sz * 0.75, k % 2 ? DARK : MID); if (k < 7) { c.fillStyle = plateCol(9 - k); c.beginPath(); c.moveTo(tx - 2, ty - sz * 0.6); c.lineTo(tx, ty - sz * 0.6 - 4 + (k % 2)); c.lineTo(tx + 2, ty - sz * 0.6); c.closePath(); c.fill(); } }
      /* Rückenplatten (hinter dem Körper, drei Reihen, mit Glühen beim Aufladen) */
      for (let col = -1; col <= 1; col++) for (let k = 0; k < 4; k++) { const px = x + col * 11 + (k % 2) * 2, h = 12 - k * 2 - Math.abs(col) * 3, py = y - 74 - k * 4 + bob + Math.abs(col) * 6; const ci = 4 - k + Math.abs(col); c.fillStyle = plateCol(ci); c.beginPath(); c.moveTo(px - 4, py + h); c.lineTo(px, py); c.lineTo(px + 4, py + h); c.closePath(); c.fill(); c.fillStyle = shade(plateCol(ci), -0.3); c.beginPath(); c.moveTo(px, py); c.lineTo(px + 4, py + h); c.lineTo(px + 1, py + h); c.closePath(); c.fill(); if (god.charge > 0) { const gl = clamp(god.charge * 1.4 - ci * 0.12, 0, 1); if (gl > 0) E(c, px, py + h / 2, 6 + gl * 5, 6 + gl * 5, `rgba(130,225,255,${0.18 * gl * (0.6 + 0.4 * Math.sin(t * 24 + k))})`); } }
      /* Beine: ein Fuss hebt sich beim Schritt, Krallen, Schatten unter dem gehobenen Fuss */
      const lift = god.footT > 0 ? Math.sin(Math.min(1, god.footT) * Math.PI) * 12 : 0;
      for (const s of [-1, 1]) { const up = god.foot === s ? lift : 0; if (up > 0) E(c, x + s * 13, y + 4, 11, 4, 'rgba(0,0,0,0.3)'); R(c, x + s * 13 - 8, y - 22 - up, 16, 24, MID); R(c, x + s * 13 - 8, y - 22 - up, 4, 24, DARK); R(c, x + s * 13 - 9, y - 3 - up, 18, 7, DARK); for (let k = 0; k < 3; k++) R(c, x + s * 13 - 8 + k * 6, y + 2 - up, 4, 3, CLAW); for (let k = 0; k < 3; k++) R(c, x + s * 13 - 5 + (k % 2) * 4, y - 18 + k * 6 - up, 2, 2, LIGHT); }
      /* Körper mit Bauchplatten und Schuppen */
      R(c, x - 17, y - 62 + bob, 34, 46, MID); R(c, x - 17, y - 62 + bob, 5, 46, DARK); R(c, x + 12, y - 62 + bob, 5, 46, shade(MID, -0.15));
      R(c, x - 10, y - 56 + bob, 20, 38, BELLY); for (let k = 0; k < 6; k++) { R(c, x - 9, y - 54 + k * 6 + bob, 18, 1, shade(BELLY, -0.2)); R(c, x - 9, y - 50 + k * 6 + bob, 18, 1, shade(BELLY, 0.12)); }
      for (let k = 0; k < 18; k++) P(c, x - 16 + (k * 7) % 33, y - 60 + (k * 13) % 42 + bob, LIGHT);
      /* Arme mit Krallen */
      for (const s of [-1, 1]) { const ay = y - 46 + bob + Math.sin(t * 3 + s) * 1.5; R(c, x + s * 19 - 3, ay, 7, 14, DARK); R(c, x + s * 21 - 3, ay + 12, 7, 6, MID); for (let k = 0; k < 3; k++) R(c, x + s * 21 - 3 + k * 3, ay + 17, 2, 3, CLAW); }
      /* Hals und Kopf: Brauenwulst, Augen (blinzeln), Schnauze, Nüstern, Maul mit Zähnen */
      R(c, x - 8, y - 72 + bob, 16, 12, MID); R(c, x - 8, y - 72 + bob, 3, 12, DARK);
      const hy = y - 88 + bob + god.mouth * 2;
      R(c, x - 13, hy, 26, 18, MID); R(c, x - 13, hy, 26, 4, DARK); R(c, x - 13, hy, 3, 18, DARK); R(c, x + 10, hy, 3, 18, shade(MID, -0.2));
      for (let k = 0; k < 5; k++) P(c, x - 10 + k * 5, hy + 2, LIGHT);
      for (const s of [-1, 1]) { if (god.blink > 0) R(c, x + s * 6 - 2, hy + 6, 5, 1, DARK); else { R(c, x + s * 6 - 2, hy + 5, 5, 3, '#ffd23d'); R(c, x + s * 6 - 1, hy + 5, 1, 3, '#1a1a1a'); P(c, x + s * 6 - 2, hy + 5, '#fff8c0'); } }
      R(c, x - 10, hy + 9, 20, 7, MID); R(c, x - 10, hy + 9, 20, 1, shade(MID, 0.15)); P(c, x - 4, hy + 11, DARK); P(c, x + 3, hy + 11, DARK);
      const jaw = Math.round(god.mouth * 9);
      R(c, x - 10, hy + 16, 20, 3 + jaw, DARK);
      if (jaw > 2) { R(c, x - 8, hy + 17, 16, jaw, '#7a1c2a'); R(c, x - 5, hy + 19, 10, Math.max(1, jaw - 4), '#a8303a'); }
      for (let k = 0; k < 7; k++) { P(c, x - 9 + k * 3, hy + 16, '#ffffff'); if (jaw > 3) P(c, x - 8 + k * 3, hy + 17 + jaw, '#ffffff'); }
      R(c, x - 10, hy + 19 + jaw, 20, 2, MID);
      /* Mündungsglühen beim Aufladen */
      if (god.charge > 0.5) E(c, x, hy + 18 + jaw / 2, 3 + god.charge * 5, 3 + god.charge * 4, `rgba(160,235,255,${(god.charge - 0.5) * 1.2})`);
    };
    const mouthPos = () => ({ x: god.x, y: god.y - 70 + god.mouth * 2 + Math.round(god.mouth * 9) });
    const beamEnd = (b) => { const mp = mouthPos(); return { x: mp.x + Math.cos(b.a) * b.len, y: mp.y + Math.sin(b.a) * b.len }; };
    const segDist = (px, py, ax, ay, bx, by) => { const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1; const u = clamp(((px - ax) * dx + (py - ay) * dy) / l2, 0, 1); return Math.hypot(px - (ax + dx * u), py - (ay + dy * u)); };
    const roar = (big) => { god.roarT = big ? 1.2 : 0.6; Snd.tone(70, big ? 1.1 : 0.5, 'sawtooth', 0.14, 0, -30); Snd.noise(big ? 0.9 : 0.4, 0.1, 260); G.fx.shake = Math.max(G.fx.shake, big ? 1 : 0.5); };
    let result = null, t = 0, next = 2.2, stomps = 0, shadows = [], rings = [], nextBeam = 7, beamPhase = null, beamT = 0;
    const live = {
      update(dt) {
        t += dt;
        /* Godzilla hält sich nördlich vom Spieler, pendelt seitlich, stapft heran */
        const tx = G.player.x + Math.sin(t * 0.35) * 50, ty = G.player.y - 66;
        const dx = tx - god.x, dy = ty - god.y, d = Math.hypot(dx, dy) || 1;
        god.walking = d > 6 && !beamPhase;
        if (god.walking) { const sp = t < 4 ? 34 : 18; god.x += dx / d * sp * dt; god.y += dy / d * sp * dt; god.step += dt * 1.1; if (god.step >= 1) { god.step -= 1; god.foot = god.foot === 1 ? -1 : 1; god.footT = 0.001; Snd.tone(50, 0.25, 'sawtooth', 0.08, 0, -20); G.fx.shake = Math.max(G.fx.shake, 0.4); } }
        if (god.footT > 0) { god.footT += dt * 1.4; if (god.footT >= 1) god.footT = 0; }
        god.blink = god.blink > 0 ? god.blink - dt : (Math.random() < dt * 0.3 ? 0.15 : 0);
        if (god.roarT > 0) { god.roarT -= dt; god.mouth = Math.max(god.mouth, Math.min(1, god.roarT * 2)); } else if (!beamPhase) god.mouth = Math.max(0, god.mouth - dt * 2);
        /* Stampfer: Schatten wächst, dann kracht der Fuss herunter – mit Druckwelle und Trümmern */
        next -= dt;
        if (next <= 0 && !beamPhase) { next = Math.max(0.9, 1.7 - stomps * 0.05); const atP = Math.random() < 0.55; const a = Math.random() * 6.28, r = atP ? rnd(0, 8) : rnd(14, 46); shadows.push({ x: G.player.x + Math.cos(a) * r, y: G.player.y + Math.sin(a) * r, t: 0 }); god.foot = Math.random() < 0.5 ? -1 : 1; god.footT = 0.001; }
        for (const sh of shadows) {
          sh.t += dt;
          if (sh.t >= 0.9 && !sh.done) {
            sh.done = true; stomps++; G.fx.shake = 1; Snd.sfx('hit'); Snd.tone(60, 0.4, 'sawtooth', 0.15, 0, -30);
            rings.push({ x: sh.x, y: sh.y, t: 0 });
            for (let k = 0; k < 14; k++) addPart({ x: sh.x + rnd(-12, 12), y: sh.y, vx: rnd(-60, 60), vy: rnd(-80, -20), g: 170, life: 0.9, kind: 'crumb' });
            for (let k = 0; k < 6; k++) addPart({ x: sh.x + rnd(-14, 14), y: sh.y + rnd(-4, 4), vx: rnd(-10, 10), vy: rnd(-16, -6), life: 1.2, kind: 'smoke' });
            if (Math.hypot(G.player.x - sh.x, G.player.y - 4 - sh.y) < 17 && !result) result = 'caught';
          }
        }
        shadows = shadows.filter((sh) => sh.t < 1.5);
        for (const r of rings) r.t += dt; rings = rings.filter((r) => r.t < 0.7);
        /* Atomstrahl: Platten laden auf (1,4 s), dann fegt der Strahl 1,5 s lang über den Boden */
        if (!beamPhase && t >= nextBeam && t < 29) { beamPhase = 'charge'; beamT = 0; god.walking = false; god.fan = { x: G.player.x, y: G.player.y }; roar(true); addPart({ x: god.x, y: god.y - 100, vy: -8, life: 1.3, kind: 'txt', txt: 'ATOMSTRAHL!', col: 'rgba(140,230,255,1)' }); }
        if (beamPhase === 'charge') {
          beamT += dt; god.charge = Math.min(1, beamT / 1.4); god.mouth = Math.max(god.mouth, god.charge);
          if (beamT > 0.3 && Math.random() < dt * 30) { const mp = mouthPos(); addPart({ x: god.x + rnd(-14, 14), y: god.y - 78 + rnd(-6, 6), vx: rnd(-10, 10), vy: rnd(-30, -10), life: 0.5, kind: 'spark', col: 'rgba(150,230,255,0.9)' }); }
          if (beamT >= 1.4) {
            const mp = mouthPos(); const side = Math.random() < 0.5 ? -1 : 1;
            const f = god.fan; const a0 = Math.atan2(f.y - mp.y, f.x - 46 * side - mp.x), a1 = Math.atan2(f.y + 10 - mp.y, f.x + 46 * side - mp.x);
            god.beam = { a: a0, a0, a1, t: 0, len: Math.hypot(G.player.y - mp.y, 60) + 90 }; beamPhase = 'fire'; beamT = 0;
            Snd.tone(200, 1.5, 'sawtooth', 0.1, 0, 300); Snd.noise(1.5, 0.12, 2200); G.fx.shake = 1;
          }
        } else if (beamPhase === 'fire') {
          beamT += dt; const b = god.beam; b.t = Math.min(1, beamT / 1.5); b.a = b.a0 + (b.a1 - b.a0) * b.t; god.mouth = 1; god.charge = 1 - b.t * 0.5;
          const mp = mouthPos(), e = beamEnd(b);
          /* Treffer am Boden: Brandspur, Funken, Feuer */
          const hit = { x: e.x, y: e.y };
          if (Math.random() < dt * 40) god.scorch.push({ x: hit.x + rnd(-5, 5), y: hit.y + rnd(-3, 3), t: 0 });
          for (let k = 0; k < 2; k++) addPart({ x: hit.x + rnd(-8, 8), y: hit.y + rnd(-4, 4), vx: rnd(-40, 40), vy: rnd(-70, -20), g: 120, life: rnd(0.4, 0.8), kind: 'fire' });
          addPart({ x: hit.x + rnd(-10, 10), y: hit.y, vx: rnd(-20, 20), vy: rnd(-50, -20), life: 1, kind: 'ember' });
          if (b.t > 0.08 && segDist(G.player.x, G.player.y - 4, mp.x, mp.y, e.x, e.y) < 10 && !result) result = 'caught';
          if (beamT >= 1.5) { beamPhase = null; god.beam = null; god.charge = 0; nextBeam = t + rnd(6, 8); next = 1.2; }
        }
        for (const sc of god.scorch) sc.t += dt; god.scorch = god.scorch.filter((sc) => sc.t < 14);
        if (!beamPhase && Math.floor(t / 5) !== this._roar && t > 1) { this._roar = Math.floor(t / 5); roar(false); }
        if (t > 32 && !result) result = 'survived';
      },
      draw(c, cx, cy, gt) {
        for (const sc of god.scorch) { const a = Math.max(0, 1 - sc.t / 14); E(c, sc.x - cx, sc.y - cy, 7, 3, `rgba(20,16,12,${0.65 * a})`); if (sc.t < 3 && Math.floor(gt * 10 + sc.x) % 3 === 0) P(c, sc.x - cx + rnd(-3, 3), sc.y - cy - 1, `rgba(255,140,40,${a})`); }
        for (const sh of shadows) { const x = sh.x - cx, y = sh.y - cy; if (!sh.done) E(c, x, y, 7 + sh.t * 16, 4 + sh.t * 10, `rgba(0,0,0,${0.25 + sh.t * 0.5})`); else { R(c, x - 18, y - 10, 36, 18, MID); R(c, x - 18, y - 10, 36, 4, DARK); for (let k = 0; k < 3; k++) R(c, x - 16 + k * 12, y + 6, 8, 4, CLAW); for (let k = 0; k < 4; k++) P(c, x - 14 + k * 8, y - 3, LIGHT); } }
        for (const r of rings) { const q = r.t / 0.7; c.strokeStyle = `rgba(120,100,80,${(1 - q) * 0.7})`; c.lineWidth = 2; c.beginPath(); c.ellipse(r.x - cx, r.y - cy, 10 + q * 46, 4 + q * 18, 0, 0, Math.PI * 2); c.stroke(); }
        drawGod(c, god.x - cx, god.y - cy, gt);
        if (god.beam) {
          const b = god.beam, mp = mouthPos(), e = beamEnd(b);
          const x0 = mp.x - cx, y0 = mp.y - cy, x1 = e.x - cx, y1 = e.y - cy;
          c.save(); c.lineCap = 'round';
          c.strokeStyle = 'rgba(90,190,255,0.22)'; c.lineWidth = 16; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
          c.strokeStyle = 'rgba(120,210,255,0.8)'; c.lineWidth = 7; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
          c.strokeStyle = '#eafaff'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x0, y0); for (let k = 1; k <= 8; k++) { const u = k / 8; const nx = -(y1 - y0), ny = x1 - x0, nl = Math.hypot(nx, ny) || 1; const j = (k < 8 ? Math.sin(gt * 40 + k * 2.1) * 3 : 0); c.lineTo(x0 + (x1 - x0) * u + nx / nl * j, y0 + (y1 - y0) * u + ny / nl * j); } c.stroke();
          c.restore();
          E(c, x1, y1, 12 + Math.sin(gt * 30) * 3, 6, 'rgba(200,240,255,0.7)'); E(c, x1, y1, 6, 3, '#ffffff');
        }
        if (beamPhase === 'charge') { const mp = mouthPos(); const q = god.charge; const x0 = mp.x - cx, y0 = mp.y - cy; const side = 0; c.strokeStyle = `rgba(140,220,255,${0.25 + q * 0.3})`; c.lineWidth = 1; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(x0, y0); c.lineTo(god.fan.x - cx - 46, god.fan.y - cy); c.moveTo(x0, y0); c.lineTo(god.fan.x - cx + 46, god.fan.y - cy + 10); c.stroke(); c.setLineDash([]); E(c, god.fan.x - cx, god.fan.y - cy + 4, 50, 8, `rgba(140,220,255,${0.08 + q * 0.12})`); }
      },
      lights() { if (god.beam) { const e = beamEnd(god.beam), mp = mouthPos(); return [{ x: e.x, y: e.y, r: 60, c: '#7ad0ff' }, { x: mp.x, y: mp.y, r: 50, c: '#7ad0ff' }]; } if (god.charge > 0) return [{ x: god.x, y: god.y - 76, r: 30 + god.charge * 40, c: '#7ad0ff' }]; return []; },
      onLeave() { if (!result) result = 'survived'; },
      dbg() { return { t, stomps, result, beamPhase, fan: god.fan && beamPhase ? [Math.round(god.fan.x), Math.round(god.fan.y)] : null, god: [Math.round(god.x), Math.round(god.y)], shadows: shadows.map((sh) => [Math.round(sh.x), Math.round(sh.y), Math.round(sh.t * 100) / 100, !!sh.done]) }; },
    };
    G.live = live;
    G.busy--;
    await this.wait(() => !!result, 45000);
    if (G.live === live) G.live = null;
    G.busy++;
    if (result === 'survived') {
      achieve('monster'); mood(15);
      UI.toast('Godzilla stapft weiter – über den Arlberg Richtung Zürich.');
      await this.say(voice('party'), 'DAS erzählen wir in Luzern niemandem. Glaubt uns eh keiner. Runde?');
    } else {
      achieve('platt'); Snd.sfx('hit'); G.fx.shake = 1;
      await UI.card('Dunkel. … Piepsen. … Ein Spital. Es riecht nach Desinfektionsmittel.', 2200);
      const bill = Math.min(G.S.money.eur, 200);
      addMoney('eur', -bill);
      const d = dayOf(G.S.time); G.S.time = (d + 1) * 1440 + 9 * 60; G.S.lastSleep = G.S.time;
      Object.assign(G.S.st, { energy: 45, prom: 0, nau: 0, mood: Math.max(20, G.S.st.mood - 20) });
      enterMap('hotel_room', 'bed');
      await this.say('Krankenschwester', `Plattgetreten, aber heil. ${fmtEur(bill)} Selbstbehalt, bitte. Godzilla ist übrigens weitergezogen – Richtung Schweiz.`);
      UI.toast(`Die Jungs haben dich aus dem Spital ins Hotel gebracht. ${clockStr()}, nächster Tag.`);
    }
    G.busy--;
  },

  /* ---------- Casino ---------- */
  async casinoDoor() {
    const st = G.S.st, L = G.S.look;
    const sec = { name: 'Security', look: npcLook(986, { build: 3, hair: 1, beard: 0, top: 9, topCol: 16, pants: 5, pantsCol: 2, shoes: 3, shoesCol: 1, glasses: 0, hat: 0 }) };
    if (!isOpen('casino')) { await this.say(sec, 'Das Casino öffnet um 15 Uhr und schliesst um 3.'); return false; }
    if (L.pants === 4 || L.shoes === 4) { await this.say(sec, 'Jogginghose oder Sandalen? Nicht im Casino. Wir sind nicht in Las Vegas.'); return false; }
    if (st.prom > 2) { await this.say(sec, 'Spielen in dem Zustand? Nein. Komm nüchterner wieder.'); return false; }
    if (!G.S.flags.casinoSeen) { G.S.flags.casinoSeen = 1; await this.say(sec, 'Ausweis bitte … Danke. Willkommen im Casino Innsbruck. Eintritt frei, Jetons an den Tischen, Mindesteinsatz 10 Euro.'); }
    achieve('casino');
    return true;
  },
  async casinoBet(game) {
    const opts = [10, 20, 50, 100].filter((v) => canPay('eur', v));
    if (!opts.length) { await this.say(null, 'Mindesteinsatz 10 Euro. Dein Bargeld reicht nicht – Bankomat beim Bahnhof oder an der Maria-Theresien-Strasse.'); return 0; }
    const c = await this.ask(null, `${game} · Einsatz wählen (Bargeld: ${fmtEur(G.S.money.eur)})`, opts.map((v) => ({ t: `${v} €` })).concat([{ t: 'Doch nicht' }]));
    if (c >= opts.length) return 0;
    return opts[c];
  },
  async roulette() {
    const bet = await this.casinoBet('Roulette');
    if (!bet) return;
    const RED = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    const c = await this.ask('Croupier Max', 'Faites vos jeux. Worauf setzt du?', [{ t: 'Rot', r: '1:1' }, { t: 'Schwarz', r: '1:1' }, { t: 'Gerade', r: '1:1' }, { t: 'Ungerade', r: '1:1' }, { t: 'Eine Zahl (Plein)', r: '35:1' }, { t: 'Doch nicht' }]);
    if (c === 5) return;
    let num = -1;
    if (c === 4) { const c2 = await this.ask('Croupier Max', 'Welche Zahl?', ['7', '12', '17', '23', '31', '36', 'Eine zufällige']); num = [7, 12, 17, 23, 31, 36][c2] ?? Math.floor(Math.random() * 37); }
    pay('eur', bet);
    const target = Math.floor(Math.random() * 37);
    const res = await Mini.rouletteSpin(target);
    if (res == null) { addMoney('eur', bet); return; }
    let win = 0;
    if (c === 0 && RED.includes(res)) win = bet * 2;
    if (c === 1 && res !== 0 && !RED.includes(res)) win = bet * 2;
    if (c === 2 && res !== 0 && res % 2 === 0) win = bet * 2;
    if (c === 3 && res % 2 === 1) win = bet * 2;
    if (c === 4 && res === num) { win = bet * 36; achieve('jackpot'); }
    if (win) { addMoney('eur', win); Snd.sfx('coin'); mood(win > bet * 10 ? 20 : 6); await this.say('Croupier Max', `${res}${res === 0 ? ', grün' : RED.includes(res) ? ', rot' : ', schwarz'}. ${win > bet * 10 ? 'PLEIN! Alle schauen her.' : 'Gewonnen.'} Auszahlung ${fmtEur(win)}.`); }
    else { mood(-4); await this.say('Croupier Max', `${res}${res === 0 ? ', grün – die Bank dankt' : RED.includes(res) ? ', rot' : ', schwarz'}. Leider verloren. Nächstes Spiel?`); }
    passTime(5);
  },
  async blackjack() {
    let bet = await this.casinoBet('Blackjack');
    let rounds = 0, won = 0;
    while (bet) {
      pay('eur', bet);
      const r = await Mini.blackjack(bet);
      if (!r) { addMoney('eur', bet); break; }
      rounds++;
      if (r.res === 'win') { addMoney('eur', bet + r.mult); won += r.mult; Snd.sfx('coin'); mood(8); achieve('blackjack'); UI.toast(`Gewonnen – ${fmtEur(bet + r.mult)} zurück an dich.`, 'ach'); }
      else if (r.res === 'push') { addMoney('eur', bet); UI.toast('Unentschieden. Einsatz zurück.'); }
      else { if (r.mult < -bet) pay('eur', Math.min(G.S.money.eur, -r.mult - bet)); won += r.mult; mood(-4); UI.toast(pick(['Die Bank gewinnt. Wie meistens.', 'Verloren. Die Bar ist auch offen.', 'Siebzehn und vier war früher. Heute heisst es: die Bank.']), 'warn'); }
      passTime(6);
      /* Mehrere Runden hintereinander: gleicher Einsatz, neuer Einsatz oder Schluss */
      const opts = []; if (canPay('eur', bet)) opts.push({ t: 'Noch eine Runde', r: fmtEur(bet) }); opts.push({ t: 'Einsatz ändern' }, { t: 'Aufhören' });
      const c = await this.ask('Croupière Lisa', `${rounds}. Runde: ${won >= 0 ? '+' : '–'}${fmtEur(Math.abs(won))}. Bargeld ${fmtEur(G.S.money.eur)}.`, opts);
      const k = opts[c] && opts[c].t;
      if (k === 'Einsatz ändern') bet = await this.casinoBet('Blackjack');
      else if (k !== 'Noch eine Runde') bet = 0;
    }
    if (rounds) await this.say('Croupière Lisa', won > 0 ? `${rounds} Runden, ${fmtEur(won)} Gewinn. Komm wieder – die Bank hat Geduld.` : won < 0 ? `${rounds} Runden, ${fmtEur(-won)} für die Bank. Danke fürs Spiel.` : 'Plus minus null. Unentschieden gegen die Bank – das schaffen nicht viele.');
  },
  async ev_ueberfall() {
    G.busy++;
    const p = G.player;
    const side = Math.random() < 0.5 ? -1 : 1;
    const a = this.tempActor({ name: 'Unbekannter', look: npcLook(971, { hat: 3, hatCol: 0, top: 3, topCol: 16, pants: 4, pantsCol: 2, shoes: 0, shoesCol: 1, beard: 1, beardCol: 0, glasses: 0, mark: 2 }), x: p.x + side * 90, y: p.y, dir: side < 0 ? 2 : 1, speed: 85 });
    UI.toast('Aus dem Schatten löst sich eine Gestalt …', 'warn');
    await this.walk(a, p.x + side * 16, p.y);
    a.dir = dirTo(a.x, a.y, p.x, p.y); p.dir = dirTo(p.x, p.y, a.x, a.y);
    await this.say(a, 'Hey. Hasch mal Feuer? … Und dein Portemonnaie, Schweizer. Langsam.');
    const nearby = Object.keys(FRIENDS).filter((id) => ['bar', 'club', 'rouge', 'stueberl'].includes(this.schedule(id)));
    const c = await this.ask(a, 'Der Typ ist einen Kopf grösser als du.', ['Weglaufen', 'Nach den Jungs rufen', 'Geld geben']);
    const loss = Math.min(G.S.money.eur, Math.round(rnd(30, 70)));
    if (c === 0) {
      if (G.S.st.energy > 30 && G.S.st.prom < 1.6) { energy(-12); mood(2); await this.say('me', 'Nicht mit mir!'); UI.toast('Du rennst, bis dir die Lunge brennt. Er gibt auf.'); a.path = [{ x: a.x + side * 200, y: a.y }]; }
      else { await this.say(a, 'Rennen? In dem Zustand? Haha. Her damit.'); addMoney('eur', -loss); mood(-10); UI.toast(`Er nimmt dir ${fmtEur(loss)} ab und verschwindet.`); a.path = [{ x: a.x + side * 200, y: a.y }]; }
    } else if (c === 1) {
      if (nearby.length && Math.random() < 0.75) {
        const h1 = nearby[0], h2 = nearby[1] || nearby[0];
        const f1 = this.friendActor(h1, Math.floor(p.x / TS) - side * 7, Math.floor(p.y / TS), 0, 'stand'); G.npcs.push(f1);
        f1.solid = false; f1.speed = 95;
        await this.say('me', `${fname(h1).toUpperCase()}! HOSHY! HIER!`);
        await this.walk(f1, p.x - side * 20, p.y);
        await this.say(h1, `Heast, lass meinen Kollegen in Ruhe! ${h2 !== h1 ? fname(h2) + ' kommt auch gleich' : 'Wir sind zwölf'} – willst du das wirklich?`);
        await this.say(a, 'Schon gut, schon gut. War nur Spass, Burschen.');
        a.path = [{ x: a.x + side * 220, y: a.y }];
        mood(8); G.S.aff[h1] = clamp(G.S.aff[h1] + 10, 0, 100);
        await this.say(h1, 'Alles okay? Komm, wir trinken eins drauf. Und du gehst nachts nicht mehr allein durch die Bögen.');
        f1.path = [{ x: f1.x - side * 160, y: f1.y }]; f1.onArrive = () => this.dropActor(f1);
      } else {
        await this.say(null, 'Du rufst. Niemand kommt. Nur das Echo in den Bögen.');
        await this.say(a, 'Deine Freunde sind nicht da. Ich schon.');
        addMoney('eur', -loss); mood(-10); UI.toast(`Er nimmt dir ${fmtEur(loss)} ab und verschwindet.`); a.path = [{ x: a.x + side * 200, y: a.y }];
      }
    } else { addMoney('eur', -loss); mood(-8); await this.say(a, 'Braver Schweizer. Schöne Nacht noch.'); UI.toast(`${fmtEur(loss)} weg. Dafür heil geblieben.`); a.path = [{ x: a.x + side * 200, y: a.y }]; }
    a.onArrive = () => this.dropActor(a);
    achieve('ueberfall');
    G.busy--;
  },
  async ev_polizei() {
    G.busy++;
    const p = G.player, v = this.victim();
    const side = Math.random() < 0.5 ? -1 : 1;
    const cop = this.tempActor({ name: 'Polizist', look: npcLook(902, { hat: 1, hatCol: 2, top: 10, topCol: 10, pants: 5, pantsCol: 8, shoes: 3, shoesCol: 1, beard: 2, glasses: 0, print: 0, acc: 0 }), x: p.x + side * 120, y: p.y - 6, speed: 60 });
    const f = this.friendActor(v, Math.floor((p.x + side * 136) / TS), Math.floor(p.y / TS), 0, 'stand'); f.solid = false; f.speed = 60; f.bubbleRand = ['dots']; G.npcs.push(f);
    UI.toast(`Da kommt ein Polizist – und er hat ${fname(v)} am Arm.`);
    await Promise.all([this.walk(cop, p.x + side * 22, p.y - 6), this.walk(f, p.x + side * 38, p.y)]);
    cop.dir = dirTo(cop.x, cop.y, p.x, p.y); f.dir = cop.dir; p.dir = dirTo(p.x, p.y, cop.x, cop.y);
    const reason = pick(['hat an die Hofburg-Mauer gepinkelt. In aller Öffentlichkeit, mit Gesang', 'wollte auf den Leopoldsbrunnen klettern, „um das Pferd zu reiten“', 'hat die Tram-Tür blockiert und dem Fahrer „Sorry, eh!“ zugerufen – dreimal', 'hat auf der Maria-Theresien-Strasse Ahornsirup an Passanten verteilt. Ohne Bewilligung']);
    await this.say(cop, `Gehört der zu Ihnen? Der Herr ${reason}.`);
    await this.say(v, pick(['Sorry, eh! In Kanada wäre das okay gewesen.', 'Ich wollte nur … es ist kompliziert. Sorry, eh.', 'Sag ihm, dass ich Kanadier bin. Das zählt doch irgendwie?']));
    const opts = [{ t: 'Organmandat zahlen', r: '60,00 €' }];
    if (FRIENDS.lexx && v !== 'lexx') opts.push({ t: 'Lexx anrufen – er ist Anwalt' });
    opts.push({ t: '„Den kenn ich nicht.“' });
    const c = await this.ask(cop, 'Also: 60 Euro Organmandat, oder er kommt mit auf die Wache.', opts);
    let freed = false;
    if (c === 0) { if (pay('eur', 60)) { freed = true; await this.say(cop, 'Danke. Und schauen S\', dass er sich benimmt.'); G.S.aff[v] = clamp(G.S.aff[v] + 12, 0, 100); } else await this.say(cop, 'Kein Geld? Dann kommt er mit.'); }
    else if (opts[c].t.startsWith('Lexx')) { await UI.card('Zwanzig Minuten später steht Lexx mit Visitenkarte und Krawatte da …', 1800); passTime(20); await this.say('lexx', 'Grüß Gott, Herr Inspektor. Mein Mandant ist Kanadier, kulturell desorientiert und bereut zutiefst. Rechtlich gesehen: Verwarnung reicht.'); await this.say(cop, '… Sie haben a Krawatte an. Also gut. Verwarnung. Aber einmal noch und er sitzt.'); freed = true; G.S.aff.lexx = clamp((G.S.aff.lexx || 50) + 8, 0, 100); G.S.aff[v] = clamp(G.S.aff[v] + 8, 0, 100); }
    else { await this.say(v, 'WAS?! Du … du Verräter! Ich hab dir ein Dosenbier gegeben!'); await this.say(cop, 'Dann kommt er mit. Wache beim Bahnhof, Auslösung ab drei Stunden.'); G.S.flags.jail = { id: v, until: G.S.time + 180 }; G.S.aff[v] = clamp(G.S.aff[v] - 25, 0, 100); mood(-4); }
    achieve('polizei');
    if (freed) { await this.say(v, 'Danke, Kollege. Das vergess ich dir nie. Bis zum nächsten Bier.'); f.path = [{ x: f.x - side * 160, y: f.y }]; f.onArrive = () => this.dropActor(f); cop.path = [{ x: cop.x + side * 160, y: cop.y }]; cop.onArrive = () => this.dropActor(cop); }
    else { UI.toast(`${fname(v)} wird abgeführt. Auf der Wache beim Bahnhof, frei ab ${clockStr(G.S.time + 180)}.`); cop.path = [{ x: cop.x + side * 220, y: cop.y }]; f.path = [{ x: f.x + side * 220, y: f.y }]; cop.onArrive = () => this.dropActor(cop); f.onArrive = () => this.dropActor(f); G.npcs = G.npcs.filter((n) => !(n.friend && n.id === v && n !== f)); }
    G.busy--;
  },
  async ev_hundkatze() {
    G.busy++;
    const p = G.player;
    const side = Math.random() < 0.5 ? -1 : 1;
    Snd.tone(1800, 0.12, 'sawtooth', 0.05); Snd.tone(300, 0.1, 'square', 0.06, 0.2); Snd.tone(280, 0.1, 'square', 0.06, 0.35);
    G.birds.push({ x: p.x + side * 150, y: p.y + 10, vx: -side * 95, vy: 0, z: 0, t: 0, life: 4.2, kind: 'cat', state: 'run' });
    G.birds.push({ x: p.x + side * 190, y: p.y + 12, vx: -side * 90, vy: 0, z: 0, t: 0, life: 4.2, kind: 'dog', state: 'run' });
    UI.toast('FAUCHEN! BELLEN! Eine Katze rast über den Platz, ein Dackel hinterher!');
    await sleep(1400);
    const lady = G.npcs.find((n) => n.id === 'hund');
    await this.say(lady ? lady : 'Frau mit Dackel', 'FERDL! FERDL, HIERHER! … Der hört nie. Zwölf Jahre und hört nie.');
    const c = await this.ask(null, 'Die Katze flüchtet auf eine Linde, der Dackel kläfft unten. Wetten?', ['„Die Katze bleibt oben.“', '„Der Dackel gibt auf.“', 'Nur zuschauen']);
    await sleep(900);
    const catWins = Math.random() < 0.6;
    if (c < 2) { const right = (c === 0) === catWins; mood(right ? 6 : 1); await this.say(null, catWins ? 'Die Katze putzt sich oben in aller Ruhe. Der Dackel trottet beleidigt zu Frauchen zurück.' : 'Der Dackel bellt, bis die Katze mit einem Satz über die Mauer verschwindet. Ferdl schaut stolz.'); UI.toast(right ? 'Richtig getippt!' : 'Daneben. Tiere sind unberechenbar.'); }
    else { mood(3); await this.say(null, catWins ? 'Die Katze putzt sich oben in aller Ruhe. Der Dackel trottet beleidigt zu Frauchen zurück.' : 'Der Dackel bellt, bis die Katze über die Mauer verschwindet. Ferdl schaut stolz.'); }
    achieve('tierfilm');
    G.busy--;
  },
  async ev_taube() {
    G.busy++;
    Snd.sfx('whoosh');
    for (let i = 0; i < 6; i++) addPart({ x: G.player.x + rnd(-3, 3), y: G.player.y - 40, vx: rnd(-5, 5), vy: 60, g: 80, life: 0.5, kind: 'splash' });
    await sleep(400);
    await this.say('me', pick(['… Ernsthaft?! Auf die Schulter?!', 'Das ist KEIN Regen.', 'Soll Glück bringen. SOLL.']));
    G.S.st.smell = Math.min(100, G.S.st.smell + 35); mood(-4);
    UI.toast('Taubenvolltreffer. Im Hotel duschen oder damit leben – die Jungs werden es riechen.');
    achieve('taube');
    G.busy--;
  },
  async ev_krampus() {
    G.busy++;
    const p = G.player;
    const side = Math.random() < 0.5 ? -1 : 1;
    const k = this.tempActor({ name: 'Krampus', look: npcLook(972, { hair: 14, hairCol: 0, beard: 12, beardCol: 0, top: 8, topCol: 16, pants: 2, pantsCol: 2, shoes: 1, shoesCol: 1, hat: 0, mark: 6, glasses: 0, eyes: 1 }), x: p.x + side * 140, y: p.y, speed: 110, bubbleRand: ['!'] });
    Snd.sfx('hit'); Snd.tone(90, 0.5, 'sawtooth', 0.1, 0, -40);
    UI.toast('Kettenrasseln! Ein Krampus mit Rute rennt durch die Gasse – direkt auf dich zu!', 'warn');
    await this.walk(k, p.x + side * 20, p.y);
    k.dir = dirTo(k.x, k.y, p.x, p.y);
    await this.say(k, 'RRRAAAAH! Warst du brav dieses Jahr, Schweizer?!');
    const c = await this.ask(k, 'Die Rute pfeift durch die Luft.', ['Wegrennen', 'Stehen bleiben und Selfie machen', '„Ich war brav!“']);
    if (c === 0) { energy(-10); mood(2); await this.say(null, 'Du rennst. Der Krampus auch. Er ist schneller – ein Rutenschlag auf den Hintern, dann lässt er von dir ab.'); G.fx.shake = 0.5; Snd.sfx('hit'); }
    else if (c === 1) { mood(10); Snd.sfx('shutter'); G.fx.flash = 1; await this.say(k, '… Okay, das ist neu. Grinsen! Und jetzt: RRRAAH!'); UI.toast('Selfie mit Krampus. Die Jungs werden neidisch sein.'); }
    else { await this.say(k, 'Brav? Du riechst nach Bier und Rouge. BRAV!'); energy(-5); mood(4); G.fx.shake = 0.4; Snd.sfx('hit'); await this.say(null, 'Ein symbolischer Rutenschlag. Dann poltert er weiter, Richtung Altstadt, wo schon die Kinder kreischen.'); }
    k.path = [{ x: k.x - side * 240, y: k.y }]; k.onArrive = () => this.dropActor(k);
    achieve('krampus');
    G.busy--;
  },
  async ev_portemonnaie() {
    G.busy++;
    await this.say(null, 'Auf dem Boden liegt ein Portemonnaie. Drin: 80 Euro, ein Ausweis – Herbert Gruber, Wattens – und ein Foto von einem Dackel.');
    const c = await this.ask(null, 'Niemand schaut.', ['Zur Polizei bringen', 'Behalten']);
    if (c === 0) {
      await UI.card('Bei der Polizei am Hauptbahnhof …', 1400); passTime(15);
      await this.say('Polizist', 'Der Gruber Herbert? Der sucht das seit gestern! Ehrliche Haut, Sie. Zehn Euro Finderlohn, sagt er.');
      addMoney('eur', 10); mood(8); achieve('ehrlich'); G.S.flags.karma = (G.S.flags.karma || 0) + 1;
    } else { addMoney('eur', 80); mood(-3); G.S.flags.karma = (G.S.flags.karma || 0) - 1; UI.toast('80 Euro mehr. Das Dackelfoto schaut dich vorwurfsvoll an.'); const l = FRIENDS.lexx; if (l) await this.say('lexx', 'Rechtlich gesehen heisst das Fundunterschlagung. Moralisch gesehen: Du zahlst heute die Runde.'); }
    G.busy--;
  },
  async closingTime(v) {
    G.busy++;
    const who2 = { bar: 'Sepp', club: 'Türsteher', stueberl: 'Wirtin Resi', rouge: 'Rocky' }[v];
    await this.say(who2, v === 'bar' ? 'Sperrstund is! Austrinken, Burschen, ab ins Bett!' : v === 'club' ? 'Licht an, Party aus. Wir machen zu!' : v === 'rouge' ? 'Sperrstund, die Damen gehen heim. Du auch.' : 'So, Feierabend. Gute Nacht miteinand!');
    G.busy--;
    await warpTo('ibk', { bar: 'bar_out', club: 'club_out', stueberl: 'stueberl_out', rouge: 'rouge_out' }[v]);
  },
  async openGuard(v) {
    if (v === 'bar' && G.S.stage === 'bar') return true;
    if (v === 'stueberl' && G.S.flags.stueberlBan === dayOf(G.S.time - 300)) { await this.say('Wirtin Resi', pick(['Du? Heit nimmer. Hausverbot bis morgen, Raufbold.', 'Naa, naa. Nach dem Theater vorhin kimmsch du heit nimmer eina.'])); return false; }
    if (isOpen(v)) return true;
    await this.say(null, `Geschlossen. Öffnungszeiten: ${hoursStr(v)} Uhr.`);
    return false;
  },

  /* ---------- Gespräche mit den Jungs ---------- */
  line(id) {
    const f = FRIENDS[id], st = G.S.st, fl = G.S.flags, me = G.S.name;
    const p = [];
    const m = G.map.id;
    if (fl.blackoutAt && G.S.time - fl.blackoutAt < 900) p.push(`Weisst du noch, wie du gestern um 2 Uhr „${pick(['I am from Austria', 'Ein Prosit der Gemütlichkeit', 'Schwiizerland, mis Heimatland'])}“ gesungen hast? Nein? Wir schon.`);
    if (fl.vomitAt && G.S.time - fl.vomitAt < 180) p.push(pick(['Geht\'s wieder? Trink mal ein Wasser.', `${me}, du warst grün wie eine Zirbe vorhin.`, 'Iss was Richtiges, bevor du weitermachst!']));
    if (st.wet > 0) p.push(fl.bathAt && G.S.time - fl.bathAt < 120 ? 'Du hast im Leopoldsbrunnen gebadet?! Legende!' : 'Bist du in den Inn gefallen? Du bist ja klatschnass!');
    if (st.smell > 30 && f.fn !== 'raucher') p.push('Du riechst wie ein Aschenbecher.');
    if (tracht()) p.push(pick(['Schau dir den an! Fehlt nur noch das Alphorn.', 'Steht dir, die Lederhose! Echt jetzt.', 'Bist du jetzt Tiroler? Muesch no jodle lerne!']));
    if (st.hang > 0) p.push('Na, Brummschädel? Ein Gröstl oder eine Knödelsuppe hilft.');
    if (fprom(id) > 2) p.push(pick(['Hicks … wo isch … mein Bier?', 'Du … du bisch mein beschter Freund. Ehrlich. Hicks.', 'Alles dreht sich. Ist das normal? Isch normal, oder?']));
    else if (fprom(id) > 1.2) p.push(pick(['Heute läuft\'s! Noch eins?', 'Ich bin erst warm. ERST WARM!', 'Wer hat mir die Bier alle ausgegeben? Ah, du. Merci!']));
    if (fl.jessyAt && G.S.time - fl.jessyAt < 240) p.push(pick(['Du warst bei Jessy?! Hast du … wenigstens ein Gummi gehabt? … Gut. Dann sag ich nichts.', 'Jessy aus den Bögen? Die hat Hännsu letztes Jahr abblitzen lassen. Respekt.', 'Ich hab nichts gesehen. In den Bögen sieht man nie was.']));
    if (fl.rougeAt && G.S.time - fl.rougeAt < 240 && m !== 'rouge') p.push(pick(['Du warst im Rouge?! Erzähl. Alles.', 'Rouge, hm? Wie viel hat der Piccolo gekostet? 45? Ha!', 'Im Rouge gewesen und jetzt pleite. Klassiker.']));
    if (m === 'rouge') p.push(pick(['Ich bin nur wegen der Musik hier. Ehrlich.', 'Schau nicht so, ich schau auch nicht. Wir schauen alle nicht.', 'Chantal hat mir zugezwinkert. Ganz sicher. Ganz sicher mir.']));
    if (st.energy < 22) p.push('Du gähnst ununterbrochen. Leg dich doch kurz ins Hotel.');
    if (st.food < 20) p.push('Dein Magen knurrt lauter als die Musik. Iss was!');
    if (st.prom > 2) p.push('Du schwankst wie die Seegrubenbahn bei Föhn. Mal ein Wasser?');
    else if (st.prom > 1.2) p.push(pick(['Jetzt wird\'s lustig!', 'Du hast so einen glasigen Blick. Gefällt mir.', 'Noch eins? Oder lieber Wasser?']));
    const R = {
      kassier: ['Die Gruppenkasse stimmt. Fast. Wer hat die drei Bier am Bahnhof nicht bezahlt?', 'Ich hab für alles Quittungen. ALLES.', 'Wenn du Geld brauchst: Die Kasse ist für Notfälle. Bier ist kein Notfall. Meistens.'],
      saeufer: ['Prost! Auf die Gesundheit – von der hab ich ja genug.', 'Bier ist flüssiges Brot. Ich ernähre mich also gesund.', 'Hast du das Weissbier probiert? Und das Märzen? Und den Zirbenschnaps? Ich schon.'],
      gourmet: ['Der BBQ-Burger hier: Brioche, Röstzwiebeln, rauchige Sauce. Neun von zehn Punkten.', 'Hast du den Kaiserschmarrn auf der Seegrube probiert? Ein Gedicht.', 'Käsekrainer vom Würstelstand um Mitternacht. Das ist österreichische Hochkultur.'],
      party: ['Heute Nacht: Club Lawine in den Bögen! Ab 22 Uhr. Du kommst mit, keine Diskussion.', 'Ich spür\'s, heute wird legendär.', 'Shots? Shots!'],
      frech: ['Klein, aber oho! Wer mich unterschätzt, zahlt die nächste Runde.', 'Ich hab dem Barkeeper erzählt, du hast Geburtstag. Viel Spass!', 'Wetten, ich schlag dich am Kicker? Mit links.'],
      pilot: ['Von der Seegrube aus siehst du die ganze Anflugschneise. Innsbruck ist einer der anspruchsvollsten Flughäfen der Alpen.', 'Hätten wir fliegen sollen? Nein. Zug ist Romantik.', 'Wind aus Süden heute – Föhn. Darum ist die Sicht so klar.'],
      taenzer: ['Ich hab mir für heute Abend neue Moves überlegt. Warte nur.', 'Der DJ im Club Lawine spielt angeblich gute Sachen. Ich bin bereit.', 'Tanzen ist wie Jassen: alles eine Frage des Timings.'],
      muskel: ['Armdrücken? Ich hab heute nur 200 Liegestütze gemacht, also bin ich fair.', 'Proteine! Hast du das Schnitzel gesehen? Das sind Proteine.', 'Die Hosenträger der Lederhosen würden bei mir platzen.'],
      kanadier: ['Sorry, eh! Bei uns in Kanada sind die Berge grösser. Aber das Bier hier ist besser.', 'Jassen ist wie Eishockey, nur mit Karten. Und ohne Zähne verlieren.', 'Ich hab Ahornsirup im Rucksack. Für Notfälle.'],
      raucher: ['Kurz eine rauchen? Draussen natürlich, drinnen ist in Österreich seit 2019 Rauchverbot.', 'Die Trafik beim Bahnhof hat bis 22 Uhr offen. Gut zu wissen.', 'Im Club gibt\'s einen Raucherhof. Dort lernt man die besten Leute kennen.'],
      anwalt: ['Rechtlich gesehen ist Baden im Leopoldsbrunnen... sagen wir mal: eine Grauzone. Eher grau.', 'Beim Jassen gilt: Angeben ist Pflicht! Ausser beim Puur. Steht so im Reglement.', 'Falls du ein Organmandat kriegst: Ich vertrete dich. Mein Honorar: ein Bier.'],
      charmeur: ['Die Bardame hat mir vorhin zugelächelt. Ganz sicher.', 'Ich hab heute schon drei Telefonnummern bekommen. Okay, eine davon war vom Hotel.', 'Frisur sitzt. Hemd sitzt. Heute Abend sitzt alles.'],
    };
    if (m === 'zug') p.push(pick(['Gleich kommt der Arlbergtunnel, über zehn Kilometer!', 'Am Vierertisch ist noch ein Platz frei. Jassen?', 'Im Speisewagen gibt\'s Gulaschsuppe. Und Bier.', `${fname(latecomer())} sitzt jetzt sechs Stunden im Taxi. Für eine Zigarette.`]));
    if (m === 'luzern' || m === 'luzern_halle') p.push(pick(['Endlich Innsbruck! Ich freu mich schon seit Wochen.', 'Hast du deinen Ausweis dabei? Ohne kommst du im Hotel nicht rein.', 'Ich hoffe, im Zug ist ein Vierertisch frei.']));
    const pool = p.length && Math.random() < 0.65 ? p : R[f.fn];
    return pick(pool);
  },
  /* Ein Kollege trinkt (ausgegeben oder Runde): Pegel steigt, ab 2,6 ‰ übergibt er sich und geht ins Hotel. */
  async friendDrink(id, alc) {
    G.S.fprom[id] = Math.min(4, fprom(id) + alc);
    const n = G.npcs.find((x) => x.friend && x.id === id);
    const pr = fprom(id);
    if (pr >= 2.6) { await this.friendVomit(id); return; }
    if (pr > 1.8 && n) { n.bubbleRand = ['dots', 'zzz', 'beer']; n.bubble = 'dots'; n.bubbleT = 2; if (!G.S.flags['fwarn' + id + dayOf(G.S.time)]) { G.S.flags['fwarn' + id + dayOf(G.S.time)] = 1; UI.toast(`${fname(id)} schwankt schon bedenklich (${promStr(pr)}).`, 'warn'); } }
  },
  async friendVomit(id) {
    const n = G.npcs.find((x) => x.friend && x.id === id);
    if (n) { n.pose = 'bend'; n.bubble = null; await this.spew(n); }
    else { Snd.sfx('vomit'); G.fx.shake = 0.6; }
    await this.say(id, pick(['Uuurgh … das war eins zu viel … sorry …', 'Blöärgh! Ich … ich geh mal … Hotel …', 'Das letzte Bier war schlecht. Ganz sicher das letzte.']));
    G.S.fprom[id] = 0.8;
    G.S.flags.sick[id] = dayOf(G.S.time - 300);
    achieve('abgefuellt');
    const host = { bar: 'Sepp', stueberl: 'Wirtin Resi', club: 'Türsteher', rouge: 'Rocky' }[G.map.id];
    if (host) await this.say(host, pick(['Oida! Schafft\'s den heim, bevor er\'s nochmal macht!', 'Raus mit ihm an die Luft. Und wer putzt das?', 'Taxi für den Herrn. Sofort.']));
    const other = this.friendsHere().find((x) => x !== id);
    if (other) await this.say(other, `Ich bring ${fname(id)} ins Hotel. Du hast ihn abgefüllt, du zahlst morgen das Frühstück.`);
    if (n) { n.pose = 'stand'; n.hidden = true; }
    const o2 = other ? G.npcs.find((x) => x.friend && x.id === other) : null;
    if (o2) o2.hidden = true;
    UI.toast(`${fname(id)} wird ins Hotel gebracht. Bis morgen früh ist er ausser Gefecht.`);
    mood(-3);
  },
  async talkFriend(id) {
    const f = FRIENDS[id];
    const s = G.S.stage;
    if (G.map.id === 'luzern' && s === 'meet') return this.meetTalk(id);
    if (G.map.id === 'luzern' && s === 'board') return this.lateTalk(id);
    if (G.map.id === 'zug') return this.trainTalk(id);
    const opts = [{ t: 'Plaudern', k: 'chat' }];
    const venue = ['bar', 'stueberl', 'club'].includes(G.map.id);
    if (venue) opts.push({ t: `${f.name} ein Getränk ausgeben`, r: G.map.id === 'club' ? '5,50 €' : '4,80 €', k: 'treat' });
    const roundDef = { bar: ['beer', 28.8, 'Bier'], stueberl: ['zirben', 22.8, 'Zirbenschnaps'], club: ['shot', 27, 'Shots'], rouge: ['beer', 9 * (this.friendsHere().length + 1), 'Bier'] }[G.map.id];
    if (roundDef && this.friendsHere().length > 1) opts.push({ t: `Runde ${roundDef[2]} für alle`, r: fmtEur(roundDef[1]), k: 'runde' });
    if (venue && id === who('jass') && G.map.id !== 'club') opts.push({ t: 'Jassen', k: 'jass' });
    if (venue && id === who('arm')) opts.push({ t: 'Armdrücken', k: 'arm' });
    if (['bar', 'club'].includes(G.map.id)) opts.push({ t: 'Bierpong spielen (Trinkspiel)', r: G.map.id === 'club' ? '11,00 €' : '9,60 €', k: 'pong' });
    if (G.map.id === 'bar' && id === who('darts')) opts.push({ t: 'Darts-Duell', k: 'darts' });
    if (G.map.id === 'bar' && id === who('kicker')) opts.push({ t: 'Kicker-Duell', k: 'kicker' });
    if (id === who('smoke')) opts.push({ t: 'Eine rauchen gehen', k: 'smoke' });
    if (id === who('foto')) opts.push({ t: 'Tipp für Sehenswürdigkeiten', k: 'foto' });
    if (id === who('kassier') && !playerIsKassier()) opts.push({ t: 'Etwas aus der Gruppenkasse?', k: 'kasse' });
    if (id === who('party')) opts.push({ t: 'Was läuft heute Nacht?', k: 'party' });
    if (id === who('food')) opts.push({ t: 'Was soll ich essen?', k: 'food' });
    if (FRIENDS[id].fn === 'anwalt' && G.S.flags.mandat) opts.push({ t: 'Kannst du mir beim Organmandat helfen?', k: 'law' });
    const others = this.friendsHere().filter((x) => x !== id);
    if (others.length && ['bar', 'stueberl', 'club', 'ibk'].includes(G.map.id)) opts.push({ t: 'Gemeinsam ein Taxi nehmen', k: 'taxi' });
    opts.push({ t: 'Bis später', k: 'bye' });
    const c = await this.ask(id, this.line(id), opts);
    const k = opts[c].k;
    G.S.aff[id] = clamp(G.S.aff[id] + 1, 0, 100);
    switch (k) {
      case 'chat': await this.say(id, this.line(id)); mood(2); break;
      case 'treat': {
        const pr = G.map.id === 'club' ? 5.5 : 4.8;
        if (!pay('eur', pr)) { await this.say(null, 'Dein Portemonnaie ist leer.'); break; }
        G.S.aff[id] = clamp(G.S.aff[id] + 8, 0, 100); mood(3);
        Snd.sfx('clink');
        const pr0 = fprom(id);
        await this.say(id, pr0 > 2 ? pick(['Hicks … noch eins? Du bisch … mein beschter Freund …', 'Proscht … die Bar dreht sich. Oder ich.', 'Isch das … mein Bier? Alles meins.']) : pr0 > 1.2 ? pick(['Jaaa, Proscht! Heute wird\'s wild!', 'Du willst mich abfüllen, oder? Funktioniert.', 'Noch eins und ich sing.']) : pick(['Merci viu mau! Proscht!', 'Du bist ein Guter. Prost!', 'Auf Innsbruck!', 'Zum Wohl! Die nächste geht auf mich.']));
        await this.friendDrink(id, G.map.id === 'club' ? 0.2 : 0.3);
        if (!G.npcs.some((x) => x.friend && x.id === id && !x.hidden)) break;
        if (G.S.aff[id] > 70 && !G.S.flags['gift_' + id + dayOf(G.S.time)]) { G.S.flags['gift_' + id + dayOf(G.S.time)] = 1; await this.say(id, 'Und weil du\'s bist: Die hier geht auf mich!'); consume(G.map.id === 'club' ? 'flaschenbier' : 'bier'); }
        break;
      }
      case 'runde': {
        if (!pay('eur', roundDef[1])) { await this.say(null, 'Dafür reicht dein Geld nicht. Bankomat?'); break; }
        await this.round(roundDef[0]);
        break;
      }
      case 'jass': await this.jass(); break;
      case 'arm': await this.armwrestle(id); break;
      case 'pong': await this.beerpong(id); break;
      case 'darts': await this.darts(); break;
      case 'kicker': await this.kicker(); break;
      case 'smoke': await this.smoke(id); break;
      case 'foto': {
        const miss = Object.keys(SIGHTS).filter((s2) => !G.S.photos[s2]);
        const where = { dachl: 'am Ende der Herzog-Friedrich-Strasse', stadtturm: 'gleich westlich vom Goldenen Dachl', annasaeule: 'mitten in der Maria-Theresien-Strasse', triumphpforte: 'am südlichen Ende der Maria-Theresien-Strasse', hofburg: 'östlich vom Dom', dom: 'nördlich vom Domplatz', leopold: 'vor der Hofburg', mariahilf: 'vom Südufer des Inn aus', innbruecke: 'über den Inn', bogen: 'bei den Viaduktbögen östlich der Maria-Theresien-Strasse', seegrube: 'oben auf der Nordkette – Bahn ab Congress', bergisel: 'südlich der Stadt – Tram ab der Haltestelle beim Hauptbahnhof', hofgarten: 'im Park östlich der Hofburg', torbogen: 'in Luzern, zu spät', kapellbruecke: 'in Luzern, zu spät' };
        const miss2 = miss.filter((x) => !['torbogen', 'kapellbruecke'].includes(x));
        await this.say(id, miss2.length ? `Dir fehlen noch ${miss2.length} Fotos. Probier mal ${SIGHTS[miss2[0]].n} – ${where[miss2[0]]}.` : 'Du hast alles fotografiert! Respekt, da bin sogar ich neidisch.');
        break;
      }
      case 'kasse': {
        const day = dayOf(G.S.time);
        if (G.S.flags.kasse === day) { await this.say(id, 'Heute hast du schon was gekriegt. Die Kasse ist kein Bankomat!'); break; }
        G.S.flags.kasse = day; addMoney('eur', 40); Snd.sfx('coin');
        await this.say(id, 'Na gut, 40 Euro aus der Gruppenkasse. Ich schreib\'s auf. Mit Datum.');
        break;
      }
      case 'party': await this.say(id, `Ab 22 Uhr ist der Club Lawine in den Viaduktbögen offen, Eintritt 12 €. Achtung, der Türsteher lässt dich nicht mit Jogginghose rein. ${fname(who('dance'))} tanzt schon den ganzen Tag im Kopf.`); break;
      case 'food': await this.say(id, G.S.st.food < 40 ? 'In der Gamsbock Bar: der BBQ-Burger. Im Stüberl: Gröstl mit Spiegelei. Und nach Mitternacht: Käsekrainer am Würstelstand beim Bahnhof.' : 'Du bist ja noch satt. Aber Kaiserschmarrn passt immer rein.'); break;
      case 'law': await this.say(id, 'Laut Gesetz… zahl einfach. Und bade das nächste Mal in der Hotel-Dusche. Kostet nichts.'); break;
      case 'taxi': await this.taxi({ group: true }); break;
    }
  },
  async meetTalk(id) {
    const fl = G.S.flags, org = who('kassier'), party = who('party'), foto = who('foto');
    fl.met[id] = 1;
    const me = G.npcs.find((n) => n.friend && n.id === id);
    if (me) { me.bubbleRand = ['dots', 'note']; me.bubble = null; me.bubbleT = 0; }
    UI.hud();
    if (id === party && !fl.gotBeer) {
      fl.gotBeer = 1; addInv('dosenbier');
      await this.say(id, 'Hoi! Ich hab Reiseproviant geholt. Da, ein Dosenbier für dich – aber erst im Zug aufmachen!');
    } else if (id === foto) {
      await this.say(id, 'Schau dir das Licht über dem See an! Mach doch auch ein Foto – von der Kapellbrücke und vom Torbogen. Stell dich einfach davor.');
    } else if (id === org && !playerIsKassier()) {
      await this.say(id, `Hoi ${G.S.name}! Die Hotelreservation hab ich: Hotel Zirbe in der Altstadt. Aber das Gruppenbillett kaufst du – du bist heute für die Fahrkarten zuständig.`);
      if (!fl.gotCash) { fl.gotCash = 1; addMoney('chf', TICKET_CASH); Snd.sfx('coin'); await this.say(id, `Hier, ${TICKET_CASH} Franken aus der Gruppenkasse. Der Automat ist in der Bahnhofshalle. Und bitte: vor 9:10!`); UI.toast(`+${TICKET_CASH} CHF aus der Gruppenkasse`); }
    } else await this.say(id, this.line(id));
    const need = [party, foto].concat(playerIsKassier() ? [] : [org]);
    const metCount = Object.keys(fl.met).length;
    if (need.every((x) => fl.met[x]) && metCount >= 4) {
      const lead = playerIsKassier() ? party : org;
      const late = latecomer();
      await this.say(lead, `Alle da! ${G.S.name}, du holst das Gruppenbillett am Automaten in der Halle. Wir gehen schon mal auf Gleis 4 – der IR nach Zürich fährt um 9:10, pünktlich!`);
      await this.say(late, 'Ich rauch noch schnell eine vor dem Bahnhof. Geht schon vor, ich komm dann nach!');
      for (const n of G.npcs) if (n.friend) n.hidden = true;
      this.setStage('board');
      G.npcs = G.npcs.filter((n) => !n.friend); this.populate(G.map);
      UI.toast(hasInv('billett') ? 'Die Jungs gehen zum Gleis. Durch den Bahnhof zu Gleis 4!' : 'Die Jungs gehen zum Gleis. Kauf das Billett am Automaten in der Halle – bis 9:10!');
    } else {
      const n = meetNeed();
      const parts = [];
      if (n.missing.length) parts.push(`noch ${listNames(n.missing)} begrüssen (${n.missing.map((x) => FRIENDS[x].role).join(', ')}) – die mit dem „!“`);
      if (n.more) parts.push(`dazu ${moreStr(n.more)}`);
      UI.toast(`Torbogen: ${parts.join(', ')}.`);
    }
  },
  async lateTalk(id) {
    const c = await this.ask(id, 'Ich rauch noch schnell eine fertig. Geh schon vor, ich komm gleich nach!', [{ t: 'Komm jetzt, der Zug fährt um 9:10!' }, { t: 'Okay, bis gleich' }]);
    if (c === 0) await this.say(id, pick(['Ja ja, gleich. Ich bin schneller als du denkst.', 'Zwei Züge, eine Zigarette – das geht sich aus.', 'Stress nicht. Ich hab noch mindestens drei Minuten.']));
    else await this.say(id, 'Bis gleich!');
  },
  async trainTalk(id) {
    const s = G.S.stage;
    if (s === 'arrived') { await this.say(id, 'Innsbruck! Raus hier – die Tür ist gleich da vorne!'); return; }
    const opts = [{ t: 'Plaudern', k: 'chat' }];
    if (id === who('jass')) opts.push({ t: 'Jassen', k: 'jass' });
    if (hasInv('dosenbier')) opts.push({ t: `${FRIENDS[id].name} ein Dosenbier geben`, k: 'give' });
    opts.push({ t: 'Bis später', k: 'bye' });
    const c = await this.ask(id, this.line(id), opts);
    if (opts[c].k === 'chat') { await this.say(id, this.line(id)); mood(2); }
    if (opts[c].k === 'jass') await this.jass();
    if (opts[c].k === 'give') { takeInv('dosenbier'); G.S.aff[id] = clamp(G.S.aff[id] + 10, 0, 100); Snd.sfx('clink'); await this.say(id, 'Merci! Du bist ein Schatz. Proscht!'); }
  },

  /* ---------- Bahnhof Luzern & Zug ---------- */
  async ticketMachine() {
    if (hasInv('billett')) { await this.say(null, 'Du hast das Gruppenbillett schon in der Tasche. Ab auf Gleis 4!'); return; }
    if (stageAt('ride')) { await this.say(null, 'Der Automat zeigt „Ausser Betrieb“.'); return; }
    const c = await this.ask('Billettautomat', 'SBB Billettautomat. Bitte wählen:', [
      { t: 'Gruppenbillett Luzern–Innsbruck Hbf, 12 Personen, 2. Klasse', r: fmtChf(TICKET_PRICE) },
      { t: 'Gruppenbillett 1. Klasse, 12 Personen', r: fmtChf(TICKET_PRICE * 2) },
      { t: 'Einzelbillett Luzern–Innsbruck Hbf', r: fmtChf(78) },
      { t: 'Abbrechen' },
    ]);
    if (c === 3) return;
    if (c === 2) { await this.say('me', 'Ein Billett für mich allein? Und die anderen elf? Nein, ich bin für alle zuständig.'); return; }
    const price = c === 1 ? TICKET_PRICE * 2 : TICKET_PRICE;
    if (!canPay('chf', price)) { Snd.sfx('error'); await this.say('Billettautomat', `Guthaben nicht ausreichend. Du hast ${fmtChf(G.S.money.chf)}, das Billett kostet ${fmtChf(price)}.`); if (c === 1) await this.say('me', 'Erste Klasse mit der Gruppenkasse? Das hätte der Kassier sowieso nie durchgehen lassen.'); return; }
    pay('chf', price);
    addInv('billett');
    achieve('billett');
    await this.say(null, `Der Automat rattert, dann rutscht ein langes Papier heraus: Gruppenbillett Luzern – Innsbruck Hbf, 12 Personen${c === 1 ? ', 1. Klasse' : ''}, gültig heute.`);
    UI.toast(`Gruppenbillett eingepackt. Jetzt zu den Jungs auf Gleis 4 – Abfahrt ${clockStr(DEP_TIME)}!`);
  },
  async missedTrain() {
    if (G.busy || G.mode !== 'play') return;
    G.busy++;
    Snd.sfx('lose');
    await UI.fadeOut(`${clockStr(DEP_TIME)} · Der IR 70 nach Zürich HB fährt ab.`);
    await sleep(1800);
    const s = G.S.stage;
    const late = latecomer();
    let text;
    if (s === 'meet') text = `Die Jungs haben beim Torbogen auf dich gewartet, bis es zu spät war. Der IR 70 ist ohne euch abgefahren – und mit ihm der Anschluss an den Railjet nach Innsbruck.`;
    else if (!hasInv('billett')) text = `Elf Jungs stehen auf Gleis 4 und schauen dem Zug hinterher. Du hattest eine Aufgabe: das Gruppenbillett. Ohne Billett steigt keiner ein – und jetzt ist der Zug weg.`;
    else text = `Du stehst mit dem Gruppenbillett in der Hand da, während der IR 70 aus dem Bahnhof rollt. ${fname(late)} raucht draussen seelenruhig weiter. Der Ausflug nach Innsbruck fällt ins Wasser.`;
    await UI.fadeIn();
    UI.gameOver('Zug verpasst', text);
  },
  async boardTrain() {
    const s = G.S.stage;
    if (s === 'meet') { await this.say(null, 'Du solltest zuerst die Jungs beim Torbogen treffen.'); return; }
    if (s !== 'board') { await this.say(null, 'Der Zug ist schon weg.'); return; }
    if (!hasInv('billett')) {
      Snd.sfx('error');
      await this.say(voice('kassier'), `Halt, ${G.S.name}! Hast du das Gruppenbillett? Ohne Billett steigt hier keiner ein. Der Automat ist in der Halle – lauf!`);
      return;
    }
    if (G.S.time >= DEP_TIME) { this.missedTrain(); return; }
    const late = latecomer();
    const jass = voice('jass');
    G.S.time = Math.max(G.S.time, DEP_TIME - 1);
    G.S.flags.late = 1;
    achieve('zug');
    await this.say(jass, `Da bist du ja! Alle einsteigen, Wagen 3! Moment … wo ist ${fname(late)}?`);
    await this.say(voice('party'), 'Der raucht noch vor dem Bahnhof! Ich hab\'s ihm dreimal gesagt.');
    Snd.sfx('ding');
    await this.say(null, '🔊 „Bitte zurücktreten, die Türen schliessen.“ Die Türen zischen zu. Der IR 70 rollt an – und draussen auf dem Perron rennt jemand mit einer Zigarette im Mund hinterher. Zu spät.');
    await Scene.play('train', { text: 'IR 70 · Luzern → Zürich HB', ms: 2600, label: 'IR 70', col: '#c8302a', keep: true });
    passTime(46);
    await Scene.play('train', { text: 'Umsteigen in Zürich HB · Railjet nach Innsbruck', ms: 2600, label: 'RAILJET', col: '#a8282a', lake: true, keep: true });
    G.S.flags.trainDep = G.S.time + 2;
    this.setStage('ride');
    enterMap('zug', 'start');
    await UI.fadeIn();
    await this.say(jass, `Wagen 3, Vierertisch! ${G.S.name}, setz dich zu uns – wir jassen!`);
    Snd.sfx('blip');
    UI.toast(`📱 ${fname(late)}: „Verpasst 🙈 Nehm ein Taxi nach Innsbruck. Sagt's nicht meiner Freundin.“`);
    saveGame(true);
  },
  _announced: {},
  trainUpdate(dt) {
    if (G.S.stage !== 'ride') { _trainScroll += 0; return; }
    const ts = trainState();
    const speed = ts.moving ? 260 : 0;
    _trainScroll += speed * dt;
    G.map.timeScale = G.player.pose === 'sit' && G.player.seated ? 5 : 1.6;
    for (const st2 of TRAIN_STOPS) {
      const k = 'n' + st2.n;
      if (ts.tm > st2.t - 5 && ts.tm < st2.t && !this._announced[k] && st2.t > 0) { this._announced[k] = 1; UI.toast(`🔊 Nächster Halt: <b>${st2.n}</b>`); Snd.sfx('ding'); }
    }
    if (ts.scene === 'tunnel' && !this._announced.tunnel) { this._announced.tunnel = 1; UI.toast('Arlbergtunnel – über zehn Kilometer durch den Berg.'); }
    if (ts.tm > 25 && !G.S.flags.ticketCheck && !G.busy && !this._cond) this.conductorStart();
    if (this._cond && !G.S.flags.ticketCheck) this.conductorFollow();
    if (ts.tm >= 216 && G.S.stage === 'ride' && !G.busy) this.arrive();
  },
  /* Die Zugbegleiterin betritt den Wagen am anderen Ende und läuft durch den Gang (Reihe 4) zum Spieler. */
  _cond: null,
  conductorLook() { return npcLook(951, { hat: 8, hatCol: 2, top: 9, topCol: 1, pants: 5, pantsCol: 8, shoes: 3, shoesCol: 1, hair: 9, beard: 0, glasses: 0, acc: 5, print: 0 }); },
  conductorStart() {
    const p = G.player;
    const fromLeft = p.x > 32 * TS;
    const s = T2P(fromLeft ? 1 : 62, 4);
    const a = new Actor({ id: 'kondukteur', name: 'Zugbegleiterin', look: this.conductorLook(), x: s.x, y: s.y, dir: fromLeft ? 2 : 1, solid: false, speed: 78, label: 'Zugbegleiterin', talk: () => Story.say(a, 'Einen Moment, ich komm gleich zu Ihnen.') });
    G.npcs.push(a);
    this._cond = a;
    UI.toast('Die Zugbegleiterin kommt durch den Wagen. Fahrkartenkontrolle!');
    Snd.sfx('door');
  },
  conductorFollow() {
    const a = this._cond, p = G.player;
    const px = Math.floor(p.x / TS), py = Math.floor((p.y - 3) / TS);
    const side = a.x < p.x ? -1 : 1;
    const tgt = T2P(clamp(py === 4 ? px + side : px, 1, 62), 4);
    const d = Math.hypot(tgt.x - a.x, tgt.y - a.y);
    if (d > 2) { if (!a.path || !a.path.length || a.path[0].x !== tgt.x) a.path = [tgt]; return; }
    a.path = null; a.moving = false; a.dir = dirTo(a.x, a.y, p.x, p.y);
    if (!G.busy) { G.S.flags.ticketCheck = 1; this.ticketCheck(a); }
  },
  async ticketCheck(actor) {
    G.busy++;
    const cond = actor || { name: 'Zugbegleiterin', look: this.conductorLook() };
    if (actor) { actor.bubble = '!'; actor.bubbleT = 1.5; await sleep(400); }
    await this.say(cond, 'Grüß Gott, die Fahrkarten bitte!');
    await this.say('me', 'Hier, das Gruppenbillett für zwölf Personen.');
    if (G.S.flags.late) {
      await this.say(cond, 'Zwölf? Ich zähle elf.');
      await this.say(FRIENDS.lexx && 'lexx' !== latecomer() ? 'lexx' : voice('jass'), `Der Zwölfte sitzt in einem Taxi irgendwo bei Sargans. Lange Geschichte. Rechtlich gesehen ist das Billett trotzdem gültig.`);
    }
    await this.say(cond, 'Danke, passt. Gute Weiterfahrt nach Innsbruck – und viel Spass!');
    G.busy--;
    this._cond = null;
    if (actor) { /* weiter durch den Zug und am Ende des Wagens verschwinden */
      const end = T2P(actor.x < G.player.x ? 62 : 1, 4);
      actor.path = [end]; actor.onArrive = () => { G.npcs = G.npcs.filter((n) => n !== actor); };
    }
  },
  async arrive() {
    G.busy++;
    this.setStage('arrived');
    G.player.seated = false; G.player.pose = 'stand';
    UI.toast('🔊 Meine Damen und Herren, in Kürze erreichen wir <b>Innsbruck Hauptbahnhof</b>.');
    Snd.sfx('ding');
    G.npcs = G.npcs.filter((n) => !n.friend);
    this.populate(G.map);
    await this.say(who('kassier') === G.S.pid ? who('party') : who('kassier'), 'Innsbruck! Alle Sachen mitnehmen. Ausgang ist im Vorraum!');
    G.busy--;
  },
  async trainSeat() {
    if (G.S.stage !== 'ride') { await this.say(null, 'Alle stehen schon an der Tür.'); return; }
    const p = G.player;
    const pos = T2P(48, 3);
    p.x = pos.x; p.y = pos.y; p.dir = 1; p.pose = 'sit'; p.seated = true;
    const c = await this.ask(null, 'Du sitzt am Vierertisch. Draussen zieht die Landschaft vorbei.', [{ t: 'Jassen' }, { t: 'Aus dem Fenster schauen (bis zum nächsten Halt)' }, { t: 'Ein Nickerchen machen' }, { t: 'Aufstehen' }]);
    if (c === 0) await this.jass();
    if (c === 1 || c === 2) {
      const ts = trainState();
      const next = TRAIN_STOPS.find((s) => s.t > ts.tm + 1);
      const dm = next ? next.t - ts.tm : 0;
      await UI.fadeOut(c === 1 ? `Draussen: ${ts.scene === 'walensee' ? 'der Walensee und die Churfirsten' : ts.scene === 'arlberg' ? 'steile Hänge und Lawinengalerien' : ts.scene === 'inntal' ? 'das Inntal' : 'Felder, Dörfer, Kirchtürme'}…` : 'Zzz…');
      if (c === 2) passTime(dm, { sleep: true, rate: 0.3 }); else passTime(dm);
      if (c === 2) G.S.lastSleep = Math.min(G.S.time, G.S.lastSleep + 120);
      await sleep(1200);
      await UI.fadeIn();
      if (next) UI.toast(`${next.n} · ${clockStr()}`);
      mood(2);
    }
    if (c === 3) { p.pose = 'stand'; p.seated = false; p.y = T2P(48, 4).y; }
  },
  async trainDoor() {
    if (G.S.stage === 'arrived') {
      G.busy--;
      await warpTo('ibk', 'hbf');
      G.busy++;
      this.setStage('findHotel');
      const org = playerIsKassier() ? who('party') : who('kassier');
      await this.say(org, `So, wir gehen schon mal vor und bringen die Koffer ins Hotel Zirbe. ${G.S.name}, du findest den Weg selbst: Altstadt, in der Gasse gleich südlich vom Goldenen Dachl.`);
      await this.say(who('party'), 'Danach treffen wir uns in der Gamsbock Bar an der Maria-Theresien-Strasse. Erste Runde zahlt der Letzte!');
      UI.toast('Tipp: Im Handy unter „Karte“ siehst du die Stadt.');
      return;
    }
    await this.say(null, 'Die Türen sind während der Fahrt verriegelt.');
  },

  /* ---------- Hotel ---------- */
  async reception() {
    const s = G.S.stage;
    const hof = { name: 'Frau Hofer', look: G.npcs.find((n) => n.id === 'rezeption')?.look };
    if (s === 'findHotel' || s === 'checkin') {
      this.setStage('checkin');
      const org = playerIsKassier() ? G.S.name : fname(who('kassier'));
      await this.say(hof, 'Grüß Gott im Hotel Zirbe! Haben Sie reserviert?');
      const c = await this.ask(hof, 'Auf welchen Namen läuft die Reservation?', [`Gruppe ${org}, aus Luzern`, 'Äh… gute Frage']);
      if (c === 1) await this.say(hof, 'Ah, Sie sind sicher der Nachzügler der Schweizer Gruppe! Ihre Freunde sind schon oben.');
      else await this.say(hof, 'Die zwölf Herren aus der Schweiz! Ihre Freunde haben schon eingecheckt.');
      await this.say(hof, `Dann trage ich Sie ein: ${G.S.name}. Darf ich noch einen Ausweis sehen?`);
      const c2 = await this.ask('me', 'Du kramst in deiner Tasche…', ['Identitätskarte zeigen', 'Pass zeigen', 'Führerschein zeigen']);
      if (c2 === 2) await this.say(hof, 'Der Führerschein geht ausnahmsweise. Sie schauen ja vertrauenswürdig aus.');
      else await this.say(hof, 'Danke schön, passt.');
      await this.say(hof, 'Sie haben Zimmer 307 im dritten Stock. Der Lift ist gleich dort drüben, die Zimmerkarte öffnet ihn. Frühstück gibt\'s von 7 bis 10:30 hier unten.');
      Snd.sfx('ok');
      G.S.flags.checkedIn = 1;
      achieve('checkin');
      this.setStage('room');
      UI.toast('Zimmerkarte 307 erhalten.');
      return;
    }
    if (!stageAt('checkin')) { await this.say(hof, 'Grüß Gott!'); return; }
    const c = await this.ask(hof, pick(['Grüß Gott! Was kann ich für Sie tun?', 'Na, wie gefällt Ihnen Innsbruck?', 'Brauchen Sie etwas?']), ['Tipp für den Abend?', 'Wo finde ich was?', 'Taxi rufen', 'Nichts, danke']);
    if (c === 0) await this.say(hof, isNight() ? 'Die Gamsbock Bar hat bis 2 Uhr offen, das Stüberl bis Mitternacht. Die Jungen gehen in den Club Lawine bei den Viaduktbögen – ab 22 Uhr.' : 'Fahren Sie mit der Nordkettenbahn auf die Seegrube – die Station ist beim Congress, letzte Talfahrt um 17:30. Und schauen Sie sich das Goldene Dachl an!');
    if (c === 1) await this.say(hof, 'Gamsbock Bar: Maria-Theresien-Strasse, Ostseite. Stüberl: zwei Türen weiter in unserer Gasse. Club Lawine: in den Viaduktbögen östlich vom Bahnhof. Apotheke und Supermarkt: Maria-Theresien-Strasse, Westseite.');
    if (c === 2) await this.taxi();
  },
  async needKey() { if (G.S.flags.checkedIn) return true; await this.say(null, 'Ohne Zimmerkarte kommst du nicht nach oben. Erst einchecken!'); return false; },
  async lift(dir) {
    if (dir === 'up') { if (!(await this.needKey())) return; G.busy--; await warpTo('hotel_floor', 'lift'); G.busy++; }
    else { G.busy--; await warpTo('hotel_lobby', 'lift'); G.busy++; }
  },
  async roomDoor(n) {
    if (n === 307) {
      if (!G.S.flags.checkedIn) { await this.say(null, 'Die Tür ist abgeschlossen.'); return; }
      G.busy--; await warpTo('hotel_room', 'entry'); G.busy++;
      if (G.S.stage === 'room' && !G.S.flags.roomHint) { G.S.flags.roomHint = 1; UI.toast('Pack deinen Rucksack aus (Kofferablage unten links).'); }
      return;
    }
    const rooms = { 301: ['didu', 'dous'], 302: ['coel', 'kusi'], 303: ['roemu', 'floeru'], 304: ['hoshy', 'oelu'], 305: ['yaennu', 'lexx'], 306: ['haennsu', 'cuche'] };
    const inside = (rooms[n] || []).filter((id) => FRIENDS[id] && this.schedule(id) === 'hotel');
    Snd.sfx('door');
    if (!inside.length) { await this.say(null, `Du klopfst an Zimmer ${n}. Niemand macht auf.`); return; }
    const id = inside[0];
    const h = hourOf(G.S.time);
    await this.say(id, h > 1 && h < 9 ? pick(['Mmmh… was isch? Es isch mitten in der Nacht!', 'Zzz… geh schlafen, du Löli.', 'Wer da? Ah, du. Gute Nacht!']) : pick(['Komme gleich! Bin noch unter der Dusche.', 'Wir treffen uns unten, ja?']));
  },
  async unpack() {
    if (G.S.stage === 'room') {
      await this.say(null, 'Du packst aus: Zahnbürste, Ladekabel, frische Socken – und die Notfall-Schoggi.');
      addInv('schoko');
      G.S.flags.unpacked = 1;
      this.setStage('bar');
      await this.say(null, 'Zimmer bezogen! Jetzt ab in die Gamsbock Bar zu den Jungs. Vielleicht vorher noch duschen oder umziehen?');
      saveGame(true);
      return;
    }
    await this.say(null, 'Dein Rucksack. Alles drin, was du brauchst.');
  },
  async bed() {
    const c = await this.ask(null, 'Das Bett sieht unglaublich gemütlich aus.', [{ t: 'Kurz hinlegen', r: '1 Std.' }, { t: 'Powernap', r: '3 Std.' }, { t: 'Schlafen bis morgen früh', r: 'bis 9:00' }, { t: 'Lieber nicht' }]);
    if (c === 3) return;
    await this.sleep(c === 0 ? 60 : c === 1 ? 180 : null);
  },
  async sleep(mins, where = 'bed') {
    const st = G.S.st;
    G.player.pose = 'sit';
    if (mins == null) {
      const t = G.S.time, d = dayOf(t), h = hourOf(t);
      const wake = h < 4 ? d * 1440 + 9 * 60 : (d + 1) * 1440 + 9 * 60;
      mins = wake - t;
    }
    const drunk = st.prom;
    await Scene.play('sleep', { text: mins > 300 ? 'Gute Nacht …' : `Zzz … (${Math.round(mins / 60)} Std.)`, ms: mins > 300 ? 3200 : 2000, long: mins > 300, keep: true });
    passTime(mins, { sleep: true, rate: mins > 300 ? 0.3 : 0.38 });
    G.S.lastSleep = mins > 300 ? G.S.time : Math.min(G.S.time, G.S.lastSleep + mins * 3);
    if (mins > 300) { st.energy = 100; if (drunk > 1.2) { st.hang = 100; mood(-10); } else mood(8); G.warned = {}; }
    G.npcs = G.npcs.filter((n) => !n.friend); this.populate(G.map);
    this._lastHour = Math.floor(hourOf(G.S.time));
    await UI.fadeIn();
    G.player.pose = 'stand';
    if (mins > 300) {
      UI.toast(`${dayStr()} · ${clockStr()} – ausgeschlafen!`);
      if (st.hang > 0) await this.say('me', 'Aua. Mein Kopf. Ein Gröstl, eine Kopfwehtablette oder viel Wasser wären jetzt gut…');
      const org = playerIsKassier() ? who('party') : who('kassier');
      UI.toast(`💬 ${fname(org)}: „Frühstück unten bis 10:30!“`);
    } else UI.toast('Erholt!');
    UI.hud();
  },
  async wardrobe() {
    const c = await this.ask(null, 'Der Kleiderschrank. Deine Sachen hängen ordentlich drin.', ['Umziehen', 'Doch nicht']);
    if (c !== 0) return;
    await Editor.open({ mode: 'clothes' });
  },
  async desk() {
    const opts = ['Fernsehen', 'Hotelmappe lesen'];
    if (hasInv('postkarte')) opts.push('Postkarte schreiben');
    opts.push('Nichts');
    const c = await this.ask(null, 'Auf dem Schreibtisch: Hotelmappe, Fernbedienung, ein Kugelschreiber mit Hotellogo.', opts);
    const k = opts[c];
    if (k === 'Fernsehen') { const prog = pick(['eine Wiederholung vom „Bergdoktor“', 'die Ski-Weltcup-Vorschau', 'eine Kochsendung über Tiroler Knödel', 'die Wetterkarte: Föhn über dem Inntal', 'eine Doku über den Bau des Arlbergtunnels']); await UI.card(`Du schaust ${prog}.`, 1400); passTime(30); mood(3); energy(4); }
    if (k === 'Hotelmappe lesen') await this.say(null, 'Gamsbock Bar 11–2 Uhr · Tiroler Stüberl 10–24 Uhr · Club Lawine 22–5 Uhr · Rouge (Bögen) 21–5 Uhr · Nordkettenbahn 8:30–17:30 · Stadtturm 10–17 Uhr · Frühstück 7–10:30. Taxi: einfach an der Rezeption fragen oder per Handy rufen.');
    if (k === 'Postkarte schreiben') { takeInv('postkarte'); await this.say('me', `„Liebe Grüsse aus Innsbruck! Wetter super, Bier besser. Bis bald – ${G.S.name}“`); mood(5); }
  },
  async window() { await this.say(null, isNight() ? 'Über den dunklen Dächern blinken oben auf der Nordkette die Lichter der Seegrube.' : 'Über den Dächern der Altstadt steht die Nordkette. Ganz oben siehst du die Station der Seegrube.'); mood(1); },
  async mirror() {
    const st = G.S.st;
    let t = 'Du schaust in den Spiegel. Sieht gut aus!';
    if (st.wet > 0) t = 'Nasse Haare, nasse Kleider. Der Brunnen war eine Idee.';
    else if (st.prom > 1.6) t = 'Zwei Spiegelbilder schauen zurück. Beide grinsen.';
    else if (st.energy < 25) t = 'Augenringe bis zum Kinn. Du brauchst Schlaf.';
    else if (st.hang > 0) t = 'Ein Häufchen Elend schaut dich an. Wasser, Gröstl, Tabletten.';
    else if (tracht()) t = 'Ein echter Tiroler! Fast.';
    UI.showDlg('me');
    const c = await this.ask('me', t, ['Gesicht waschen', 'Zurück']);
    if (c === 0) { st.smell = Math.max(0, st.smell - 20); energy(3); mood(1); Snd.sfx('splash'); UI.toast('Erfrischt.'); }
  },
  async shower() {
    Snd.sfx('splash');
    await Scene.play('shower', { text: 'Du duschst ausgiebig … und singst dabei.', ms: 3000 });
    passTime(15);
    const st = G.S.st;
    st.wet = 0; st.smell = 0; energy(12); mood(8); st.prom = Math.max(0, st.prom - 0.05); st.nau = Math.max(0, st.nau - 8);
    achieve('dusche');
    UI.toast(st.prom > 1.4 ? 'Kalt duschen hilft. Ein bisschen.' : 'Frisch wie ein Bergbach!');
  },
  async toilet(where) {
    const st = G.S.st;
    const opts = ['Kurz aufs WC', 'Hände waschen'];
    if (st.nau > 45) opts.push('Kontrolliert übergeben');
    opts.push('Zurück');
    const c = await this.ask(null, where === 'zug' ? 'Das Zug-WC. Es schaukelt.' : 'Das WC.', opts);
    const k = opts[c];
    if (k === 'Kurz aufs WC') { await Scene.play('toilet', { text: where === 'zug' ? 'Das Zug-WC schaukelt …' : 'Kurz aufs WC …', ms: 3000, zug: where === 'zug' }); passTime(3); mood(1); UI.toast('Erleichtert.'); }
    if (k === 'Hände waschen') { st.smell = Math.max(0, st.smell - 10); Snd.sfx('splash'); }
    if (k === 'Kontrolliert übergeben') {
      Snd.sfx('vomit'); G.fx.shake = 0.5;
      await UI.card('Du schaffst es gerade noch rechtzeitig …', 1300);
      st.nau = 0; st.food = Math.max(0, st.food - 30); st.prom = Math.max(0, st.prom - 0.25); mood(-4); energy(-4);
      G.S.flags.vomitAt = G.S.time;
      achieve('kotzen');
      UI.toast('Besser. Jetzt Wasser trinken und etwas essen.');
    }
  },
  async breakfast() {
    const h = hourOf(G.S.time);
    if (h < 7 || h >= 10.5) { await this.say(null, 'Das Frühstücksbuffet ist von 7 bis 10:30 Uhr geöffnet.'); return; }
    const d = dayOf(G.S.time);
    if (G.S.flags.breakfast === d) { await this.say(null, 'Du hast heute schon gefrühstückt. Mehr als drei Teller sind peinlich.'); return; }
    G.S.flags.breakfast = d;
    await UI.card('Semmeln, Speck, Rührei, Bergkäse, Kaffee …', 1300);
    passTime(25);
    const st = G.S.st;
    st.food = clamp(st.food + 65, 0, 100); energy(12); mood(8); st.nau = Math.max(0, st.nau - 25);
    if (st.hang > 0) { st.hang = Math.max(0, st.hang - 40); if (st.hang === 0) achieve('kater'); }
    Snd.sfx('eat');
    UI.toast('Frühstück inklusive. Gut fürs Gemüt!');
  },

  /* ---------- Bar ---------- */
  async barArrive() {
    if (G.S.stage !== 'bar') return;
    G.busy++;
    const party = who('party'), org = playerIsKassier() ? who('party') : who('kassier');
    const lawyer = FRIENDS.lexx ? 'lexx' : who('jass');
    await sleep(300);
    await this.say(party, `Da isch er ja! ${G.S.name}, endlich! Wir dachten schon, du hast dich am Goldenen Dachl verlaufen.`);
    await this.say(who('kicker'), 'Der Letzte zahlt die erste Runde! So sind die Regeln.');
    const c = await this.ask(null, 'Alle schauen dich erwartungsvoll an.', [{ t: 'Runde für alle bezahlen', r: '28,80 €' }, { t: '„Das ist eine Lüge!“' }]);
    if (c === 0 && pay('eur', 28.8)) { await this.round('beer'); }
    else { await this.say(lawyer, 'Rechtlich gesehen hat er recht: Die Regel wurde nie schriftlich festgehalten. Ich übernehme die erste Runde.'); consume('bier'); Snd.sfx('clink'); }
    G.S.flags.barMet = 1;
    this.setStage('free');
    await this.say(org, 'Willkommen in Innsbruck! Ab jetzt ist alles erlaubt: Bar, Altstadt, Nordkette, Club. Wir sind meistens hier – schau einfach wieder rein.');
    if (G.S.flags.late && !G.S.flags.lateArrived) await this.lateArrival();
    G.busy--;
    saveGame(true);
  },
  async lateArrival() {
    const late = latecomer();
    G.S.flags.lateArrived = 1;
    Snd.sfx('door');
    await this.say(null, `Draussen hält ein Taxi mit Luzerner Kennzeichen. Die Tür geht auf, und ${fname(late)} steigt aus – zerknittert, blass und ein paar hundert Franken ärmer.`);
    G.npcs.push(this.friendActor(late, 11, 12, 3, 'stand', { bubbleRand: ['beer', 'dots'] }));
    await this.say(late, 'Sechs Stunden Taxi. Der Fahrer heisst Hakan, und ich kenne jetzt seine ganze Familie. Bier. Sofort.');
    await this.say(voice('kassier'), `Das Taxi hat 640 Franken gekostet. Aus der Gruppenkasse kommt davon nichts, ${fname(late)}. Null.`);
    achieve('nachzuegler');
    G.S.aff[late] = clamp((G.S.aff[late] || 50) + 5, 0, 100);
  },
  async round(kind) {
    const here = this.friendsHere();
    Snd.sfx('clink'); Snd.sfx('cheer');
    for (const id of here) G.S.aff[id] = clamp(G.S.aff[id] + 6, 0, 100);
    for (const n of G.npcs) if (n.friend) { n.bubble = 'beer'; n.bubbleT = 3; }
    consume(kind === 'shot' ? 'shot' : kind === 'zirben' ? 'zirben' : 'bier');
    achieve('runde');
    mood(8);
    await this.say(here[0] || who('party'), pick(['PROOOSCHT! Auf Innsbruck!', 'Auf uns und auf die Gruppenkasse!', 'Zum Wohl! Der war fällig.']));
    for (const id of here) await this.friendDrink(id, kind === 'beer' ? 0.3 : 0.15);
  },
  async barTable() {
    const p = G.player;
    const pos = T2P(11, 10);
    p.x = pos.x; p.y = pos.y; p.dir = 3; p.pose = 'sit';
    const here = this.friendsHere();
    const opts = [{ t: 'Anstossen', k: 'prost' }];
    if (here.length >= 3) opts.push({ t: 'Eine Runde jassen', k: 'jass' });
    if (here.includes(who('arm'))) opts.push({ t: `Armdrücken mit ${fname(who('arm'))}`, k: 'arm' });
    opts.push({ t: 'Aufstehen', k: 'up' });
    const c = await this.ask(null, here.length ? `Am Tisch: ${here.map(fname).join(', ')}.` : 'Der Stammtisch ist leer. Die Jungs sind woanders unterwegs.', opts);
    const k = opts[c].k;
    if (k === 'prost') {
      /* Ohne Bier kein Anstossen: aus der Tasche, oder eines vom Tresen bestellen */
      const beers = Object.keys(G.S.inv).filter((id) => ITEMS[id] && ITEMS[id].beer && hasInv(id));
      const price = G.map.id === 'stueberl' ? 4.4 : 4.8;
      const bo = beers.map((id) => ({ t: `${ITEMS[id].n} aus der Tasche`, id }));
      bo.push({ t: 'Ein Bier bestellen', r: fmtEur(price), order: true }, { t: 'Doch nicht' });
      const bc = await this.ask(null, beers.length ? 'Womit stösst du an?' : 'Anstossen ohne Glas in der Hand? Du brauchst zuerst ein Bier.', bo);
      const sel = bo[bc];
      if (!sel || (!sel.id && !sel.order)) { p.pose = 'sit'; return; }
      let beer = sel.id;
      if (sel.order) { if (!pay('eur', price)) { await this.say(null, 'Die Bedienung schaut auf die leere Hand. Kein Geld, kein Bier.'); return; } beer = 'bier'; }
      else takeInv(beer);
      Snd.sfx('clink'); p.pose = 'drink';
      for (const id of here) G.S.aff[id] = clamp(G.S.aff[id] + 1, 0, 100);
      await this.say(here[0] || null, here.length ? pick(['Proscht!', 'Zum Wohl!', 'Auf den Gruppenausflug!']) : 'Du prostest dir selbst zu. Auch schön.');
      consume(beer);
      UI.toast(`${ITEMS[beer].n} – Prost! (${G.S.st.prom.toFixed(1)} ‰)`);
      for (const id of here) await this.friendDrink(id, 0.12);
      p.pose = 'sit';
    }
    if (k === 'jass') await this.jass();
    if (k === 'arm') await this.armwrestle(who('arm'));
    if (k === 'up') { p.pose = 'stand'; p.y += 4; }
  },
  async jass() {
    const here = this.friendsHere();
    if (here.length < 3) { await this.say(null, 'Zum Schieber braucht ihr zu viert.'); return; }
    const partner = here.includes(who('jass')) ? who('jass') : here[0];
    const opp = here.filter((x) => x !== partner).slice(0, 2);
    const res = await Jass.play({ partner, opp });
    if (!res) return;
    passTime(res.deals * 12);
    if (res.win) { G.S.rec.jassW++; achieve('jass'); mood(10); await this.say(opp[0], pick(['Gopferdeckel! Okay, die Runde geht auf uns.', 'Glück gehabt! Revanche später.', 'Nicht schlecht. Die nächste Runde zahlen wir.'])); if (['bar', 'stueberl'].includes(G.map.id)) consume('bier'); }
    else { G.S.rec.jassL++; mood(-3); await this.say(opp[0], pick(['Und das nennt ihr Jassen? Ihr zahlt die Runde!', 'Weis doch das nächste Mal was!', 'Schöne Niederlage. Prost!'])); if (['bar', 'stueberl'].includes(G.map.id) && canPay('eur', 9.6)) { pay('eur', 9.6); UI.toast('Verlierer zahlen: 9,60 €'); } }
    if (res.match) achieve('match');
  },
  async armwrestle(id) {
    const res = await Mini.arm(FRIENDS[id]);
    if (res == null) return;
    passTime(5); energy(-6);
    if (res) { achieve('arm'); mood(8); G.S.aff[id] = clamp(G.S.aff[id] + 4, 0, 100); await this.say(id, FRIENDS[id].fn === 'muskel' ? 'WAS?! Das… das war der Ellbogen! Revanche!' : 'Okay, du hast gewonnen. Fair ist fair.'); }
    else { mood(-2); await this.say(id, FRIENDS[id].fn === 'muskel' ? 'Haha! Diese Arme trainieren jeden Tag. Komm wieder, wenn du Proteine hattest.' : 'Gewonnen! Nächstes Bier geht auf dich.'); }
  },
  async darts() {
    const opp = this.friendsHere().includes(who('darts')) ? FRIENDS[who('darts')] : null;
    const res = await Mini.darts(opp);
    if (!res) return;
    passTime(15);
    G.S.rec.darts = Math.max(G.S.rec.darts, res.score);
    if (res.bull) achieve('bull');
    if (opp && res.win) { achieve('darts'); mood(6); await this.say(opp.id, 'Na gut, du hast gewonnen. Zufall!'); }
    else if (opp) await this.say(opp.id, 'Übung macht den Meister. Nächstes Mal vielleicht!');
    else mood(3);
  },
  async beerpong(id) {
    const price = G.map.id === 'club' ? 11 : 9.6;
    if (!pay('eur', price)) { await this.say(null, 'Zwei Bier für die Becher – dafür reicht dein Geld nicht.'); return; }
    await this.say(id, pick(['Bierpong? Du gegen mich. Sechs Becher, wer trifft, lässt den anderen trinken. Der Verlierer trinkt den Rest!', 'Okay, Bierpong. Aber ich sag\'s dir: Ich hab das an der Uni gelernt. Jeden Abend.', 'Sechs Becher, ein Ball, keine Gnade. Los!']));
    const res = await Mini.beerpong(FRIENDS[id], (whoDrinks) => { if (whoDrinks === 'me') consume('pong', { silent: true }); else this.friendDrink(id, 0.09); });
    if (!res) return;
    passTime(12);
    /* Der Verlierer trinkt die übrigen Becher des Gewinners */
    if (res.win) { for (let k = 0; k < res.myLeft; k++) await this.friendDrink(id, 0.09); }
    else { for (let k = 0; k < res.theirLeft; k++) consume('pong', { silent: true }); }
    checkThresholds();
    UI.toast(`Bierpong: Du hast ${res.myDrinks + (res.win ? 0 : res.theirLeft)} Becher getrunken (${promStr()}), ${fname(id)} ${res.oppDrinks + (res.win ? res.myLeft : 0)} (${promStr(fprom(id))}).`);
    if (res.win) { achieve('bierpong'); mood(8); G.S.rec.pong = (G.S.rec.pong || 0) + 1; if (G.npcs.some((n) => n.friend && n.id === id && !n.hidden)) await this.say(id, pick(['Pfff. Der Ball war schlecht aufgepumpt.', 'Revanche! Sofort! … Okay, gleich. Mir ist etwas schwindlig.', 'Du hast geübt. Gib\'s zu.'])); }
    else { mood(2); if (G.npcs.some((n) => n.friend && n.id === id && !n.hidden)) await this.say(id, pick(['Uni-Erfahrung. Hab ich dir gesagt.', 'Trink aus, trink aus! Regeln sind Regeln.', 'Nächstes Mal mit links, versprochen.'])); }
  },
  async kicker() {
    const opp = this.friendsHere().includes(who('kicker')) ? FRIENDS[who('kicker')] : null;
    const res = await Mini.kicker(opp);
    if (res == null) return;
    passTime(10);
    if (res) { mood(6); if (opp) await this.say(opp.id, opp.fn === 'frech' ? 'Ich hab dich gewinnen lassen. Aus Mitleid.' : 'Nicht schlecht!'); }
    else if (opp) await this.say(opp.id, opp.fn === 'frech' ? 'Klein, aber gemein! Hab ich doch gesagt.' : 'Gewonnen!');
  },
  async jukebox() {
    const c = await this.ask(null, 'Die Jukebox leuchtet. Ein Lied kostet 1 €.', ['Ländler', 'Gemütlicher Bar-Swing', 'Disco-Kracher', 'Doch nicht']);
    if (c === 3) return;
    if (!pay('eur', 1)) { await this.say(null, 'Kein Kleingeld.'); return; }
    const k = ['stube', 'bar', 'disco'][c];
    G.map.musicFn = () => k; Snd.music(k); mood(3);
    const mus = who('music');
    if (this.friendsHere().includes(mus)) await this.say(mus, c === 2 ? 'Jaaa! Dreh lauter!' : c === 0 ? 'Ländler? Ernsthaft? …Okay, das hat was.' : 'Gute Wahl.');
  },
  async tv() {
    await UI.card('Live: Tirol gegen Vorarlberg, 1:1, 80. Minute …', 1200);
    passTime(15);
    const r = Math.random();
    if (r < 0.4) { Snd.sfx('cheer'); mood(6); UI.toast('TOOOR! 2:1 in der 89. Minute! Die ganze Bar jubelt.'); }
    else if (r < 0.7) { mood(-1); UI.toast('Abpfiff: 1:1. Sepp schimpft auf den Schiedsrichter.'); }
    else { mood(1); UI.toast('Gegentor in der Nachspielzeit. Kollektives Stöhnen.'); }
  },

  /* ---------- Stüberl ---------- */
  async stove() { const st = G.S.st; await this.say(null, st.wet > 0 ? 'Du setzt dich auf die warme Ofenbank. Deine Kleider trocknen langsam.' : 'Die Ofenbank am Kachelofen ist herrlich warm.'); passTime(10); st.wet = 0; energy(5); mood(3); },
  async hias() {
    const c = await this.ask('Hias', pick(['Griaß di! A Schweizer? Do herinnen wird gnaglt, net gjasst!', 'Mei, de Jungen heitzutog. Kennsch du s\'Nageln?', 'Prost, Schweizer!']), ['Nageln? Zeig mal!', 'Prost!', 'Servus']);
    if (c === 0) await this.nageln();
    if (c === 1) { Snd.sfx('clink'); mood(2); }
  },
  /* ---------- Holzknecht Ferdl: wer ihn provoziert, bekommt eine Wirtshausrauferei ---------- */
  async ferdl() {
    const f = G.npcs.find((n) => n.id === 'ferdl') || 'Holzknecht Ferdl';
    const c = await this.ask(f, pick(['Wos schaugsch so? Hosch a Problem?', 'Schweizer, gell? Ihr mit eurem Käs und eure Uhren.', 'I hob heit scho drei Bam umghaut. Mit da Hand.']), [{ t: 'Prost, Ferdl!' }, { t: 'Sein Bier umstossen' }, { t: 'Tiroler Knödel sind Gummibälle' }, { t: '„Watten ist ein Kinderspiel“' }, { t: 'Lieber in Ruhe lassen' }]);
    if (c === 0) { Snd.sfx('clink'); mood(2); await this.say(f, 'Prost. Bisch eh a Netter. Für an Schweizer.'); return; }
    if (c === 4) return;
    if (G.S.st.energy < 15) { await this.say('me', 'Eigentlich … bin ich zu müde für sowas.'); return; }
    await this.say(f, [null, 'Mei … BIER. Des woar MEI BIER. Steh auf, Bürschl.', 'GUMMIBÄLLE? Do red ma draussen weiter. Na – do herinnen!', 'A KINDERSPIEL? I hob 40 Johr Watten im Bluat!'][c]);
    await this.brawl();
  },
  async brawl() {
    const ferdl = G.npcs.find((n) => n.id === 'ferdl');
    const opp = { name: 'Ferdl', look: ferdl ? ferdl.look : npcLook(934, { build: 3 }) };
    const here = this.friendsHere();
    const allies = here.filter((id) => ['arm', 'party', 'kicker'].some((fn) => who(fn) === id)).map(fname);
    const reg = G.npcs.filter((n) => n.id === 'hias' || n.id === 'loisl').map((n) => n.look);
    const resi = G.npcs.find((n) => n.id === 'resi');
    const res = await Mini.brawl(opp, { allies: allies.length ? allies : here.map(fname).slice(0, 1), crowd: here.map((id) => ({ name: fname(id), look: FRIENDS[id].look })), regulars: reg, resi: resi && resi.look });
    if (!res) { mood(-3); await this.say('Holzknecht Ferdl', 'Haha! Do schaugsch, wia der rennt. Feigling!'); return; }
    passTime(8); energy(-15);
    G.S.st.prom = Math.max(0, G.S.st.prom - 0.1);
    G.S.flags.brawls = (G.S.flags.brawls || 0) + 1;
    if (res.win) {
      achieve('rauferei'); mood(12);
      for (const id of here) G.S.aff[id] = clamp(G.S.aff[id] + 4, 0, 100);
      await this.say('Holzknecht Ferdl', '… Sakra. Du hosch an Schlog wia a Muli. Respekt, Schweizer. … I zohl a Runde. Wenn i wieder steh.');
      consume('bier');
      if (here.length) await this.say(here[0], pick(['Hast du gesehen, wie der umgefallen ist?! Wie ein gefällter Baum!', 'Das erzählen wir an der GV. Jedes Jahr.', 'Ich hab alles gefilmt. ALLES.']));
    } else {
      achieve('veilchen'); mood(-8); energy(-10); G.S.st.nau = clamp(G.S.st.nau + 12, 0, 140);
      const bill = Math.min(G.S.money.eur, 40);
      addMoney('eur', -bill);
      await this.say('Holzknecht Ferdl', 'Na, Bürschl? Des is Tirol. Do wird net lang gredt.');
      UI.toast(`Ein prächtiges Veilchen ziert dein Auge. Resi verrechnet ${fmtEur(bill)} für den Stuhl.`, 'warn');
      if (here.length) await this.say(here[0], pick(['Komm, wir bringen dich raus. Eis drauf, Bier rein.', 'Der war doppelt so breit wie du. Was hast du erwartet?']));
    }
    await this.say('Wirtin Resi', 'SCHLUSS JETZ! Raus, olle zwoa – und du, Schweizer, kimmsch heit nimmer eina!');
    G.S.flags.stueberlBan = dayOf(G.S.time - 300);
    await warpTo('ibk', 'stueberl_out', { label: 'Rausgeworfen!' });
    UI.toast('Hausverbot im Stüberl bis morgen früh.', 'warn');
  },
  async loisl() { await this.say('Loisl', pick(['Der Föhn kimmt. Do werd jeder narrisch.', 'Friahr hot\'s do no Rauchen derfen. Is lang her.', 'Beim Watten bin i unschlagbar. Jassen kenn i net.', 'Hosch scho a Gröstl gessn? Des Beste in ganz Tirol.'])); },
  async nageln() {
    const res = await Mini.nageln();
    if (res == null) return;
    passTime(10);
    if (res) { achieve('nagel'); mood(8); await this.say('Hias', 'Sakra! Du hosch des Nagl schneller drin ois i. Do, a Zirbenschnaps auf mi!'); consume('zirben'); }
    else { await this.say('Hias', 'Haha! Übung, Bua, Übung. Du zohlsch a Runde Obstler!'); if (pay('eur', 7)) consume('obstler'); }
  },

  /* ---------- Club ---------- */
  async bouncer() {
    const st = G.S.st, L = G.S.look;
    const tuer = { name: 'Türsteher', look: npcLook(904, { build: 3, hair: 0, beard: 7, beardCol: 0, top: 8, topCol: 16, glasses: 4 }) };
    if (G.S.flags.clubPaid === dayOf(G.S.time - 300)) return true;
    if (!isOpen('club')) { await this.say(tuer, 'Wir machen um 22 Uhr auf. Komm später wieder.'); return false; }
    if (st.wet > 0) { await this.say(tuer, 'So nass kommst du nicht rein. Ist das Brunnenwasser? Geh dich umziehen.'); return false; }
    if (st.prom > 2.1) { await this.say(tuer, 'Du hast genug für heute, Freundchen. Ab nach Hause.'); return false; }
    if (st.nau > 85) { await this.say(tuer, 'Du bist ja ganz grün im Gesicht. Nicht in meinem Club.'); return false; }
    if (L.pants === 4 || L.shoes === 4) { await this.say(tuer, L.pants === 4 ? 'Jogginghose? Netter Versuch. Nicht bei uns.' : 'Mit Sandalen? Nein. Einfach nein.'); return false; }
    const crew = Object.keys(FRIENDS).filter((id) => this.schedule(id) === 'club');
    if (tracht()) await this.say(tuer, 'Trachtenabend ist eigentlich erst am Donnerstag… aber gut, du schaust lässig aus.');
    if (crew.length && Math.random() < 0.5) { await this.say(tuer, `Ah, du gehörst zu ${fname(crew[0])}? Der hat dich auf die Liste gesetzt. Rein mit dir.`); }
    else {
      const c = await this.ask(tuer, 'Eintritt 12 Euro.', [{ t: 'Zahlen', r: '12,00 €' }, { t: 'Lieber nicht' }]);
      if (c !== 0 || !pay('eur', 12)) { if (c === 0) await this.say(tuer, 'Ohne Geld kein Bass.'); return false; }
    }
    G.S.flags.clubPaid = dayOf(G.S.time - 300);
    achieve('club');
    return true;
  },
  /* ---------- Coiffeur: auf dem Stuhl wird geschnippelt ---------- */
  async barberAnim(kind, shave = false) {
    /* Drei Sessel bei den Kacheln 2–3, 5–6 und 8–9 in Reihe 4: der Spieler nimmt den nächsten freien */
    const p = G.player;
    const chairs = [2, 5, 8].map((tx) => ({ x: (tx + 1) * 16, y: 4 * 16 + 12 }));
    const chair = chairs.reduce((a, c) => Math.abs(c.x - p.x) < Math.abs(a.x - p.x) ? c : a, chairs[0]);
    p.x = chair.x; p.y = chair.y; p.dir = 0; p.pose = 'sit';
    const b = G.npcs.find((n) => n.id === 'keeper');
    if (b) { await this.walk(b, chair.x + 22, chair.y + 2); b.dir = 1; b.keepDir = true; }
    UI.toast(shave ? (kind === 'hair' ? 'Mehmet holt die Maschine. „Null Millimeter. Sicher? … Zu spät.“' : 'Mehmet schäumt dick ein. „Rasiermesser. Nicht sprechen, nicht lachen.“') : kind === 'hair' ? 'Mehmet legt den Umhang um. „Wie immer? Es gibt kein Wie-immer, du warst noch nie da.“' : 'Mehmet schäumt ein. „Stillhalten. Das Messer ist scharf.“');
    const col = lc(G.S.look, kind === 'hair' ? 'hairCol' : 'beardCol');
    const n = shave ? 9 : 7;
    for (let k = 0; k < n; k++) {
      if (shave) { Snd.noise(0.12, 0.05, 1800); Snd.tone(kind === 'hair' ? 140 : 2400, 0.1, kind === 'hair' ? 'sawtooth' : 'square', 0.03); } else { Snd.sfx('card'); Snd.tone(1800, 0.04, 'square', 0.04, 0.05); }
      for (let i = 0; i < (shave ? 6 : 4); i++) addPart({ x: p.x + rnd(-6, 6), y: p.y - rnd(14, 22), vx: rnd(-15, 15), vy: rnd(10, 30), g: 90, life: 0.8, kind: 'crumb', col });
      if (shave && kind === 'beard') addPart({ x: p.x + rnd(-5, 5), y: p.y - rnd(12, 16), vx: rnd(-6, 6), vy: 14, g: 60, life: 0.6, kind: 'crumb', col: '#ffffff' });
      addPart({ x: p.x + rnd(-8, 8), y: p.y - rnd(16, 24), vx: 0, vy: -10, life: 0.4, kind: 'spark', col: '#ffffff' });
      await sleep(shave ? 280 : 330);
    }
    addPart({ x: p.x, y: p.y - 34, vy: -12, life: 1.4, kind: 'txt', txt: shave ? (kind === 'hair' ? 'BRRRRRRT' : 'RITSCH RATSCH') : 'SCHNIPP SCHNAPP', col: 'rgba(255,255,255,1)' });
    await sleep(500);
    p.pose = 'stand'; p.y = 5 * 16 + 12;
    if (b) { b.path = [{ x: 11 * 16 + 8, y: 3 * 16 + 10 }]; b.onArrive = () => { b.dir = 0; }; }
  },
  /* ---------- Jessy in den Bögen ---------- */
  async jessy() {
    const j = G.npcs.find((n) => n.id === 'jessy') || 'Jessy';
    await this.say(j, pick(['Na, Süsser. Kalt heute, hm? Suchst du Gesellschaft?', 'Schweizer? Hört man. Ihr seid immer so höflich. Und so … vorsichtig. Hoffentlich.', 'Du schaust aus, als hättest du gerade ein Bierpong verloren. Komm, ich muntere dich auf.']));
    const c = await this.ask(j, 'Jessy zwinkert. Aus Bogen 12 dröhnt der Bass.', [{ t: 'Händchenhalten am Inn', r: '20,00 €' }, { t: 'Kuscheln im Bogen', r: '50,00 €' }, { t: 'Das volle Programm', r: '120,00 €' }, { t: 'Nur plaudern' }, { t: 'Weiter' }]);
    if (c === 4) { await this.say(j, 'Schade. Weisst ja, wo du mich findest.'); return; }
    if (c === 3) { mood(2); await this.say(j, pick(['Ich mach das nur im Winter. Im Sommer bin ich auf der Alm. Ehrlich.', 'Dein Kollege mit der Frisur – Hännsu? – hat mich gestern eine Stunde lang vollgequatscht. Ohne was zu kaufen.', 'Die Bögen sind wie ein Dorf. Jeder kennt jeden. Und jeder hat Durst.'])); return; }
    const price = [20, 50, 120][c], mins = [20, 30, 45][c];
    if (!hasInv('kondom')) {
      await this.say(j, 'Ohne Gummi läuft gar nichts, Schatz. Nicht mal Händchenhalten. Meine Regel, keine Diskussion. Apotheke, Trafik oder Spar – und dann komm wieder.');
      UI.toast('Jessy besteht auf ein Kondom. Gibt es in der Apotheke, in der Trafik und im Supermarkt (Tasche).', 'warn');
      return;
    }
    if (!pay('eur', price)) { await this.say(j, 'Kein Bares, kein Jessy. Der Bankomat ist beim Bahnhof.'); return; }
    takeUse('kondom');
    await this.say(j, 'Braver Junge. Sicherheit geht vor.');
    const jsheet = j && j.look ? getSheet(j.look) : null;
    await Scene.play('jessy', { kind: c, jsheet, ms: 3600, text: ['Zwanzig Minuten Händchenhalten am Inn. Jessy erzählt von ihrer Katze. Mit Gummi. Weil Regel.', 'Kuscheln in Bogen 12. Es ist warm, riecht nach Vanille, und Jessy schnarcht leise.', 'Was in den Bögen passiert, bleibt in den Bögen.'][c] });
    passTime(mins); mood([6, 10, 15][c]); energy(-[2, 5, 12][c]);
    G.S.flags.jessyAt = G.S.time;
    achieve('gummi');
    await this.say(j, pick(['Komm wieder, Süsser. Und sag deinem Kollegen mit der Frisur, er soll nicht nur reden.', 'War nett. Grüss die Schweiz. Und kauf Nachschub, die Packung ist nicht ewig.']));
  },
  /* ---------- Rouge ---------- */
  async rougeDoor() {
    const st = G.S.st;
    const rocky = { name: 'Rocky', look: npcLook(964, { build: 3, hair: 1, beard: 5, beardCol: 0, top: 9, topCol: 16, glasses: 0, pants: 5, pantsCol: 2, shoes: 3, shoesCol: 1 }) };
    if (G.S.flags.rougePaid === dayOf(G.S.time - 300)) return true;
    if (G.S.flags.rougePaid === -1) { await this.say(rocky, 'Du schon wieder? Nein. Heute nicht mehr.'); return false; }
    if (!isOpen('rouge')) { await this.say(rocky, 'Ab 21 Uhr. Rot leuchtet\'s dann, du siehst es schon.'); return false; }
    if (st.wet > 0) { await this.say(rocky, 'Tropfnass auf meinen Samt? Vergiss es.'); return false; }
    if (st.prom > 2.3) { await this.say(rocky, 'Du stehst ja kaum. Komm morgen nüchterner. Oder gar nicht.'); return false; }
    const c = await this.ask(rocky, 'Rouge. Tabledance. Ab 18, Eintritt 20 Euro, inklusive einem Getränk. Kein Anfassen, kein Fotografieren.', [{ t: 'Zahlen', r: '20,00 €' }, { t: 'Nur schauen, ob die Jungs drin sind' }, { t: 'Lieber nicht' }]);
    if (c === 1) { const here = Object.keys(FRIENDS).filter((id) => this.schedule(id) === 'rouge'); await this.say(rocky, here.length ? `${fname(here[0])}? Ja, der sitzt drin. Seit einer Stunde. Rein nur mit Eintritt.` : 'Von deinen Leuten ist keiner drin. Noch nicht.'); return false; }
    if (c !== 0) return false;
    if (!pay('eur', 20)) { await this.say(rocky, 'Kein Geld, kein Rouge. Der Bankomat ist beim Bahnhof.'); return false; }
    G.S.flags.rougePaid = dayOf(G.S.time - 300);
    G.S.flags.rougeAt = G.S.time;
    consume('bier');
    achieve('rouge');
    UI.toast('Dein Willkommensdrink: ein Bier. Die Preise an der Bar liest du besser zweimal.');
    return true;
  },
  async dancer() {
    const n = G.npcs.find((x) => x.id === 'dancer');
    const d = { name: 'Chantal', look: n ? n.look : null };
    const c = await this.ask(d, pick(['Hallo, Süsser. Aus der Schweiz? Das hört man.', 'Na, gefällt dir die Show?', 'Du schaust so, als hättest du Durst. Oder Heimweh.']), [{ t: 'Privattanz', r: '50,00 €' }, { t: 'Nur plaudern' }, { t: 'Zurück zu den Jungs' }]);
    if (c === 0) {
      if (!pay('eur', 50)) { await this.say(d, 'Ohne Bares kein Tanz, Schatz. Der Bankomat ist beim Bahnhof.'); return; }
      G.S.flags.rougeAt = G.S.time;
      await UI.card('Ein Lied lang … du schaust brav auf die Hände. Meistens.', 2200);
      passTime(5); mood(14); energy(-4);
      await this.say(d, pick(['Das war\'s schon. Für den nächsten bitte wieder bei mir melden.', 'Süss, wie du rot wirst. Nächstes Lied?', 'Erzähl das deiner Freundin aber selbst.']));
      const lawyer = this.friendsHere().find((x) => FRIENDS[x].fn === 'anwalt');
      if (lawyer) await this.say(lawyer, 'Rechtlich gesehen: nichts passiert. Finanziell gesehen: 50 Euro.');
    }
    if (c === 1) { mood(4); await this.say(d, pick(['Ich studiere eigentlich Jus. Nein, Scherz. Doch, wirklich.', 'Innsbruck ist klein, aber die Bögen sind gross. Heute ist viel los.', 'Dein Kollege da hinten gibt seit einer Stunde an, er sei Pilot. Stimmt das?'])); }
  },
  async stageFront() {
    const c = await this.ask(null, 'Direkt vor der Bühne. Pinkes Licht, Bass, Glitzer.', ['Einen Schein hinlegen (10 €)', 'Nur schauen', 'Zurück']);
    if (c === 0) { if (!pay('eur', 10)) { UI.toast('Kein Geld.', 'warn'); return; } Snd.sfx('coin'); mood(6); for (const n of G.npcs) if (n.id === 'dancer' || n.id === 'dancer2') { n.bubble = 'heart'; n.bubbleT = 3; } UI.toast('Chantal zwinkert. Vanessa auch. Zehn Euro gut angelegt. Oder so.'); }
    if (c === 1) { mood(3); passTime(5); await this.say('me', pick(['Ich bin nur wegen der Musik hier.', 'Beeindruckende … Choreografie.', 'Daheim erzähl ich: Kulturprogramm.'])); }
  },
  async bouncerTalk() { await this.say('Türsteher', isOpen('club') ? 'Eintritt 12 Euro, keine Jogginghosen, keine Sandalen, nicht besoffen. Klar?' : 'Ab 22 Uhr geht\'s los.'); },
  async dj() {
    const c = await this.ask('DJ Firn', 'Hey! Wunsch?', ['Etwas Schweizerisches!', 'Mehr Bass!', 'Nichts, alles gut']);
    if (c === 0) await this.say('DJ Firn', 'Schweizerisch? Ich mix dir einen Ländler mit Techno. Wird legendär.');
    if (c === 1) { await this.say('DJ Firn', 'MEHR BASS!'); G.fx.shake = 0.6; }
    mood(2);
  },
  async dance() {
    const st = G.S.st;
    if (st.energy < 10) { await this.say('me', 'Keine Kraft mehr zum Tanzen…'); return; }
    const dancer = this.friendsHere().find((x) => FRIENDS[x].fn === 'taenzer');
    if (dancer) await this.say(dancer, 'Endlich! Zeig, was du kannst. Pfeile im Takt treffen!');
    const res = await Mini.dance();
    if (res == null) return;
    passTime(8); energy(-10); mood(res > 60 ? 10 : 4);
    G.S.rec.dance = Math.max(G.S.rec.dance, res);
    if (res >= 80) achieve('tanz');
    G.player.pose = 'danceA';
    if (dancer) await this.say(dancer, res > 80 ? 'WOW! Du hast mir die Show gestohlen!' : res > 50 ? 'Nicht schlecht! Bisschen mehr Hüfte.' : 'Das war… mutig. Sehr mutig.');
  },
  async smoke(friendId) {
    const st = G.S.st;
    const m = G.map.id;
    if (m !== 'club' && G.map.indoor) { await this.say(null, 'Drinnen herrscht Rauchverbot. Geh nach draussen.'); return; }
    let fromPack = hasInv('zigaretten');
    if (!fromPack) {
      const opts = [];
      if (m === 'club') opts.push({ t: 'Am Automaten kaufen', r: '7,00 €', k: 'buy' });
      opts.push({ t: 'Eine schnorren', k: 'bum' }, { t: 'Lass mal', k: 'no' });
      const c = await this.ask(null, 'Du hast keine Zigaretten.', opts);
      const k = opts[c].k;
      if (k === 'no') return;
      if (k === 'buy') { if (!pay('eur', 7)) return; addInv('zigaretten'); fromPack = true; }
      else if (friendId || Math.random() < 0.6) await this.say(friendId || 'Raucherin', friendId ? 'Hier, nimm eine. Aber du schuldest mir was.' : 'Klar, nimm eine.');
      else { await this.say('Raucher', 'Sorry, letzte.'); return; }
    }
    if (fromPack) { G.S.uses.zigaretten = (G.S.uses.zigaretten || 20) - 1; if (G.S.uses.zigaretten <= 0) { takeInv('zigaretten'); delete G.S.uses.zigaretten; } }
    Snd.sfx('lighter');
    for (let i = 0; i < 12; i++) setTimeout(() => addPart({ x: G.player.x + 4, y: G.player.y - 18, vx: rnd(-4, 4), vy: -10, life: 2, kind: 'smoke' }), i * 300);
    passTime(6); mood(4); energy(-1); st.smell = Math.min(100, st.smell + 60);
    achieve('rauch');
    const chats = ['„Woher kommst du? Aus Luzern? Da war ich mal auf dem Pilatus!“', '„Der DJ heute ist der Wahnsinn, oder?“', '„Innsbruck im Winter ist noch schöner. Alles weiss.“', '„Ich hab heute meinen Job gekündigt. Prost!“', '„Hast du Feuer? Ah, danke.“'];
    if (friendId) await this.say(friendId, pick(['Das tut gut. Weisst du, wieso Rauchen draussen netter ist? Hier redet man mit den Leuten.', 'Eine noch, dann geh ich tanzen. Versprochen.', 'Sag\'s nicht meiner Mutter.']));
    else await this.say('Jemand im Raucherhof', pick(chats));
  },
  async coatcheck() {
    if (G.S.flags.coat === dayOf(G.S.time - 300)) { await this.say('Garderobe', 'Deine Jacke hängt bei Nummer 107.'); return; }
    const c = await this.ask('Garderobe', 'Jacke abgeben? 2 Euro.', [{ t: 'Abgeben', r: '2,00 €' }, { t: 'Nein danke' }]);
    if (c === 0 && pay('eur', 2)) { G.S.flags.coat = dayOf(G.S.time - 300); mood(1); UI.toast('Garderobenmarke Nr. 107. Nicht verlieren!'); }
  },

  /* ---------- Stadt-Interaktionen ---------- */
  async photo(id) {
    try {
      const W = 120, H = 90;
      const [c, x] = canvas(W, H);
      const px = G.player.x - G.cam.x, py = G.player.y - G.cam.y - 30;
      x.drawImage(View.wcv, Math.round(px - W / 2), Math.round(py - H / 2), W, H, 0, 0, W, H);
      G.photoImg = G.photoImg || {};
      G.photoImg[id] = c.toDataURL('image/png');
      try { const all = JSON.parse(localStorage.getItem(SAVE_KEY + '-img') || '{}'); all[id] = G.photoImg[id]; localStorage.setItem(SAVE_KEY + '-img', JSON.stringify(all)); } catch (e) {}
    } catch (e) {}
    G.player.pose = 'stand';
    addPhoto(id);
    await this.say(null, `<em>${SIGHTS[id].n}</em> – ${SIGHTS[id].f}`);
  },
  async drinkFountain() { consume('wasser', { silent: true }); G.S.st.prom = Math.max(0, G.S.st.prom - 0.02); Snd.sfx('splash'); UI.toast('Frisches, eiskaltes Bergwasser.'); },
  async fountain() {
    const c = await this.ask(null, 'Der Leopoldsbrunnen plätschert. Erzherzog Leopold reitet in Bronze über dir.', [{ t: 'Münze werfen und etwas wünschen', r: '1,00 €' }, { t: 'Wasser ins Gesicht spritzen' }, { t: 'Im Brunnen baden!' }, { t: 'Lieber nicht' }]);
    const st = G.S.st;
    if (c === 0) { if (pay('eur', 1)) { Snd.sfx('splash'); mood(4); await this.say(null, pick(['Du wünschst dir, dass der Kater morgen ausbleibt.', 'Du wünschst dir einen Jass-Sieg.', 'Du wünschst dir, dass dieser Ausflug nie endet.'])); } }
    if (c === 1) { Snd.sfx('splash'); energy(6); st.nau = Math.max(0, st.nau - 5); UI.toast('Brrr! Wach!'); }
    if (c === 2) {
      Snd.sfx('splash');
      const cop0 = G.npcs.find((n) => n.id === 'polizei');
      const copComes = !!(cop0 && Math.hypot(cop0.x - G.player.x, cop0.y - G.player.y) < 200 && Math.random() < 0.7);
      await Scene.play('bath', { text: 'Eiskalt! Erzherzog Leopold schaut streng herab.', ms: 2600, cop: copComes });
      for (let i = 0; i < 30; i++) addPart({ x: G.player.x + rnd(-14, 14), y: G.player.y - rnd(0, 20), vx: rnd(-40, 40), vy: rnd(-70, -20), g: 160, life: 0.9, kind: 'splash' });
      st.wet = 60; energy(15); mood(12); st.prom = Math.max(0, st.prom - 0.15); st.nau = Math.max(0, st.nau - 10);
      G.S.flags.bathAt = G.S.time;
      passTime(5);
      achieve('brunnen');
      await this.say('me', st.prom > 1 ? 'JUHUUU! Das Wasser ist eiskalt! Herrlich!' : 'Eiskalt! Aber irgendwie… befreiend.');
      const cop = cop0;
      if (copComes) {
        cop.path = [{ x: G.player.x + 14, y: G.player.y }];
        await sleep(600);
        await this.say(cop, 'Heast! Baden im Brunnen ist verboten. Des kostet a Organmandat: 30 Euro.');
        const c2 = await this.ask(cop, 'Zahlen Sie gleich?', ['Zahlen', 'Ich bin Schweizer, ich wusste das nicht!']);
        if (c2 === 1) await this.say(cop, 'Unwissenheit schützt vor Strafe net. Auch in der Schweiz net.');
        if (!pay('eur', 30)) await this.say(cop, 'Kein Geld? Dann lass ich\'s heute bei einer Verwarnung. Aber raus aus dem Brunnen!');
        G.S.flags.mandat = 1; achieve('mandat');
      }
    }
  },
  async feedBirds(kind) {
    if (!hasInv('semmel') && !hasInv('gipfeli') && !hasInv('brezel')) { await this.say(null, kind === 'duck' ? 'Die Enten schauen dich erwartungsvoll an. Du hast nichts dabei – im Supermarkt gibt\'s Semmeln.' : 'Die Tauben gurren erwartungsvoll. Du hast nichts zum Füttern – im Supermarkt gibt\'s Semmeln für 39 Cent.'); return; }
    takeInv(hasInv('semmel') ? 'semmel' : hasInv('gipfeli') ? 'gipfeli' : 'brezel');
    for (const b of G.birds) if (b.kind === kind && Math.hypot(b.x - G.player.x, b.y - G.player.y) < 160) { b.state = 'feed'; b.t = 0; b.tx = G.player.x + rnd(-20, 20) + DIRV[G.player.dir][0] * 20; b.ty = G.player.y + rnd(-10, 14) + DIRV[G.player.dir][1] * 20; }
    for (let i = 0; i < 16; i++) addPart({ x: G.player.x + DIRV[G.player.dir][0] * 16 + rnd(-12, 12), y: G.player.y + DIRV[G.player.dir][1] * 12 + rnd(-6, 6), life: 6, kind: 'crumb' });
    mood(5);
    if (kind === 'pigeon') achieve('tauben');
    UI.toast(kind === 'duck' ? 'Die Enten schnattern begeistert.' : 'Gurr, gurr! Plötzlich hast du viele Freunde.');
  },
  async stones() {
    const res = await Mini.stones();
    if (res == null) return;
    G.S.rec.stone = Math.max(G.S.rec.stone, res);
    if (res >= 8) achieve('flitzer');
    mood(res >= 5 ? 4 : 1);
  },
  async busker() {
    const c = await this.ask('Strassenmusiker', 'Er spielt auf seiner Ziehharmonika einen flotten Landler.', [{ t: 'Etwas in den Hut werfen', r: '2,00 €' }, { t: 'Mitsingen' }, { t: 'Weitergehen' }]);
    if (c === 0 && pay('eur', 2)) { Snd.music('busker'); setTimeout(() => { if (G.map.id === 'ibk') Snd.music(null); }, 15000); mood(5); achieve('musik'); await this.say('Strassenmusiker', 'Vergelt\'s Gott! Für di spiel i a Extra-Stückl.'); }
    if (c === 1) { mood(3); await this.say('Strassenmusiker', G.S.st.prom > 1 ? 'Haha, du singst falsch, aber mit Herz!' : 'Bravo! Gar net schlecht für an Schweizer.'); }
  },
  async police() { await this.say('Polizist', G.S.st.prom > 1.5 ? 'Alles in Ordnung? Schauen S\', dass Sie heil ins Hotel kommen.' : pick(['Grüß Gott. Schönen Aufenthalt in Innsbruck!', 'Bitte nicht in den Brunnen steigen. Passiert öfter, als man glaubt.'])); },
  async dog() { mood(3); await this.say('Frau mit Dackel', pick(['Des is da Ferdl. Er mag Schweizer.', 'Streicheln ist erlaubt, Füttern nicht!', 'Der Ferdl ist schon zwölf. Aber noch ganz flott.'])); UI.toast('Der Dackel wedelt mit dem Schwanz.'); },
  async fiaker() {
    const c = await this.ask('Fiakerin', 'Grüß Gott! Eine Runde durch die Altstadt?', [{ t: 'Rundfahrt', r: '40,00 €' }, { t: 'Das Pferd streicheln' }, { t: 'Nein danke' }]);
    if (c === 1) { mood(3); UI.toast('Das Pferd schnaubt zufrieden.'); }
    if (c === 0) {
      if (!pay('eur', 40)) { await this.say('Fiakerin', 'Leider nur gegen Bares.'); return; }
      await Scene.play('fiaker', { text: 'Klipp, klapp … vorbei an Hofburg, Dom, Goldenem Dachl und Annasäule …', ms: 4200 });
      passTime(30); mood(10); energy(5);
      await this.say('Fiakerin', 'Und? Schön war\'s, gell? Das Goldene Dachl hat übrigens 2.657 vergoldete Schindeln.');
    }
  },
  async museum() {
    if (!isOpen('turm')) { await this.say(null, 'Die Hofburg hat schon geschlossen (10–17 Uhr).'); return; }
    const c = await this.ask(null, 'Kaiserliche Hofburg: Prunkräume, Riesensaal, Kaiserappartements.', [{ t: 'Besichtigen', r: '10,00 €' }, { t: 'Lieber nicht' }]);
    if (c !== 0 || !pay('eur', 10)) return;
    await UI.card('Stuck, Gold und Ahnenbilder von Maria Theresia …', 2000);
    passTime(60); mood(6); energy(-8);
  },
  async tower() {
    if (!isOpen('turm')) { await this.say(null, 'Der Stadtturm hat geschlossen (10–17 Uhr).'); return; }
    const c = await this.ask(null, 'Stadtturm: 133 Stufen bis zur Aussichtsplattform auf 31 Metern.', [{ t: 'Hinaufsteigen', r: '5,00 €' }, { t: 'Zu viele Stufen' }]);
    if (c !== 0 || !pay('eur', 5)) return;
    if (G.S.st.energy < 15) { await this.say('me', 'Nach 60 Stufen gibst du auf. Zu müde.'); energy(-5); return; }
    await Scene.play('tower', { text: '133 Stufen … Stufe für Stufe …', ms: 3000 });
    energy(-8); passTime(25);
    await Mini.panorama('turm');
    achieve('turm'); mood(8);
  },
  async cableCar() {
    const h = hourOf(G.S.time);
    if (h < 8.5 || h >= 17) { await this.say(null, h >= 17 ? 'Die letzte Bergfahrt war um 17 Uhr. Talfahrten bis 17:30.' : 'Die Nordkettenbahn fährt ab 8:30 Uhr.'); return; }
    const c = await this.ask(null, 'Nordkettenbahn: Hungerburgbahn und Seegrubenbahn, in etwa 20 Minuten auf 1.905 Meter.', [{ t: 'Berg- und Talfahrt', r: '38,00 €' }, { t: 'Lieber nicht' }]);
    if (c !== 0) return;
    if (!pay('eur', 38)) { await this.say(null, 'Nicht genug Geld. Am Bankomat beim Hauptbahnhof kannst du abheben.'); return; }
    G.S.flags.bahnTicket = dayOf(G.S.time);
    await Scene.play('cable', { text: 'Hungerburgbahn … Umsteigen … Seegrubenbahn …', ms: 3400, keep: true });
    passTime(20);
    enterMap('seegrube', 'entry');
    await UI.fadeIn();
    achieve('seegrube');
    UI.toast('Seegrube, 1.905 m. Die Luft ist dünn und klar.');
  },
  async cableDown() {
    const h = hourOf(G.S.time);
    if (h >= 17.5 || h < 8.5) {
      await this.say(null, 'Die letzte Talfahrt ist weg! Dir bleibt nur der Wanderweg ins Tal.');
      await UI.fadeOut('Zwei Stunden Abstieg …');
      passTime(130); energy(-35); mood(-5);
      await sleep(1200);
      enterMap('ibk', 'hbb_out'); await UI.fadeIn();
      return;
    }
    await Scene.play('cable', { text: 'Talfahrt …', ms: 2600, down: true, keep: true }); passTime(20);
    enterMap('ibk', 'hbb_out'); await UI.fadeIn();
  },
  async telescope() { await Mini.panorama('seegrube'); mood(4); },
  /* ---------- Bergisel: Tram, Kassa, Turm, Schanze ---------- */
  async bergiselTram() {
    const h = hourOf(G.S.time);
    if (h < 6 || h >= 23.5) { await this.say(null, 'Die Tram zum Bergisel fährt von 6 bis 23:30 Uhr.'); return; }
    const c = await this.ask(null, 'Tram zum Bergisel: in zwölf Minuten zur Sprungschanze von Zaha Hadid, zum Andreas-Hofer-Denkmal und zum Tirol Panorama.', [{ t: 'Einsteigen', r: '3,00 €' }, { t: 'Lieber nicht' }]);
    if (c !== 0) return;
    if (!pay('eur', 3)) { await this.say(null, 'Kein Geld fürs Ticket. Der Bankomat ist gleich hier beim Bahnhof.'); return; }
    await Scene.play('tram', { text: 'Tram zum Bergisel … Wilten … Endstation Bergisel.', ms: 3400, keep: true });
    passTime(12);
    enterMap('bergisel', 'entry'); await UI.fadeIn();
    if (!G.S.ach.bergisel) { achieve('bergisel'); await this.say('me', 'Da oben thront sie: die Bergiselschanze. Sieht aus wie eine Kobra, die über die Stadt schaut.'); }
  },
  async bergiselBack() {
    const c = await this.ask(null, 'Tram zurück in die Stadt, zum Hauptbahnhof.', [{ t: 'Einsteigen', r: '3,00 €' }, { t: 'Noch bleiben' }]);
    if (c !== 0) return;
    if (!pay('eur', 3)) { await this.say(null, 'Pleite? Dann heisst es: zu Fuss. Eine halbe Stunde bergab durch Wilten.'); await UI.fadeOut('Zu Fuss durch Wilten …'); passTime(35); energy(-8); await sleep(900); enterMap('ibk', 'bergisel_stop'); await UI.fadeIn(); return; }
    await Scene.play('tram', { text: 'Tram in die Stadt … Hauptbahnhof.', ms: 2800, keep: true, back: true });
    passTime(12);
    enterMap('ibk', 'bergisel_stop'); await UI.fadeIn();
  },
  hasBergiselTicket() { return G.S.flags.bergiselTicket === dayOf(G.S.time); },
  async bergiselTicket() {
    const k = G.npcs.find((n) => n.id === 'kassa') || 'Kassa';
    if (this.hasBergiselTicket()) { await this.say(k, 'Du hast heute schon ein Ticket, Bursch. Lift und Stadion stehen dir offen.'); return; }
    const h = hourOf(G.S.time);
    if (h < 9 || h >= 17) { await this.say(k, 'Kassa offen von 9 bis 17 Uhr. Die Schanze kannst du von aussen anschauen.'); return; }
    const c = await this.ask(k, 'Bergisel: Eintritt ins Schanzenstadion und Panoramalift auf den Turm – mit Café und Aussicht über ganz Innsbruck.', [{ t: 'Ticket', r: '11,00 €' }, { t: 'Nur schauen' }]);
    if (c !== 0) return;
    if (!pay('eur', 11)) { await this.say(k, 'Nicht genug Geld. Und einen Bankomaten gibt es hier oben nicht.'); return; }
    G.S.flags.bergiselTicket = dayOf(G.S.time);
    UI.toast('Ticket Bergisel: Stadion und Panoramalift, gültig heute.');
  },
  async bergiselTower() {
    if (!this.hasBergiselTicket()) { await this.say(null, 'Der Lift braucht ein Ticket – gibt es an der Kassa beim Eingang (9–17 Uhr).'); return; }
    await Scene.play('lift', { text: 'Panoramalift … 50 Meter in 30 Sekunden …', ms: 3000 });
    passTime(10);
    await Mini.panorama('bergisel');
    mood(5);
    const c = await this.ask(null, 'Oben im Turm: das Café mit Panoramafenstern. Unter dir das Stadion, gegenüber die Nordkette.', [{ t: 'Café im Turm' }, { t: 'Wieder runter' }]);
    if (c === 0) await this.shop('turmcafe');
    await Scene.play('lift', { text: 'Lift abwärts …', ms: 1800, down: true }); passTime(10);
  },
  async hofer() { await this.say(null, '<em>Andreas-Hofer-Denkmal</em> (1893). Der Tiroler Freiheitskämpfer schlug 1809 hier am Bergisel dreimal bayerische und französische Truppen – und verlor die vierte Schlacht. 1810 wurde er in Mantua erschossen.'); mood(1); },
  async panoramaMuseum() {
    const h = hourOf(G.S.time);
    if (h < 9 || h >= 17) { await this.say(null, 'Das Tirol Panorama hat von 9 bis 17 Uhr offen.'); return; }
    const c = await this.ask(null, 'Tirol Panorama: Das Riesenrundgemälde von 1896 zeigt die Bergiselschlacht von 1809 – rund 1.000 Quadratmeter Leinwand, einmal rundherum.', [{ t: 'Hinein', r: '11,00 €' }, { t: 'Später' }]);
    if (c !== 0 || !pay('eur', 11)) return;
    await UI.card('Du stehst mitten im Gemälde: Pulverdampf, Sensen, Andreas Hofer auf dem Hügel … und ein Schweizer, der sich fragt, warum er nicht in der Bar ist.', 2600);
    passTime(45); mood(4); energy(-4); achieve('museum');
  },
  async skijump() {
    const t = G.npcs.find((n) => n.id === 'trainer') || 'Trainer Sepp';
    const st = G.S.st, h = hourOf(G.S.time);
    if (h < 9 || h >= 16.5) { await this.say(t, 'Gästespringen gibt es nur bei Tageslicht, 9 bis 16:30 Uhr. Im Dunkeln spring nicht mal ich.'); return; }
    if (!this.hasBergiselTicket()) { await this.say(t, 'Ohne Stadion-Ticket kommst du nicht mal zum Schanzentisch. Kassa beim Eingang.'); return; }
    if (st.prom > 1.5) { await this.say(t, 'Du riechst wie eine Schnapsbrennerei. Mit dem Pegel? Nein. Nüchtern wiederkommen.'); return; }
    if (st.energy < 20) { await this.say(t, 'Du schläfst ja im Stehen. So lass ich dich nicht auf den Balken.'); return; }
    if (!G.S.flags.sjIntro) { G.S.flags.sjIntro = 1; await this.say(t, 'Gästespringen? Die Schweizer wieder. Okay: Helm, Anzug, Leihski – 25 Euro. Anlauf, am Tisch abspringen, in der Luft ruhig bleiben, Telemark bei der Landung. Und wenn du dir was brichst, bist du selber schuld.'); }
    const c = await this.ask(t, `Bereit? K-Punkt 120 Meter, Schanzenrekord 138.${G.S.rec.jump ? ` Dein Bester: ${G.S.rec.jump.toFixed(1)} m.` : ''}`, [{ t: 'Springen', r: '25,00 €' }, { t: 'Wie geht das nochmal?' }, { t: 'Lieber nicht' }]);
    if (c === 1) { await this.say(t, 'START antippen. Am Schanzentisch – da, wo die Spur aufhört – im richtigen Moment ABSPRUNG drücken. Im Flug mit ◀ und ▶ die Haltung halten, der Balken oben muss im grünen Bereich bleiben. Kurz vor dem Boden nochmal drücken: Telemark.'); return; }
    if (c !== 0) return;
    if (!pay('eur', 25)) { await this.say(t, 'Kein Geld, kein Ski. So einfach ist das.'); return; }
    Snd.sfx('ok');
    const res = await Mini.skijump();
    if (!res) { UI.toast('Abgebrochen – die Leihgebühr ist trotzdem weg.'); return; }
    passTime(30); energy(-12);
    if (!res.crash) G.S.rec.jump = Math.max(G.S.rec.jump || 0, res.d);
    achieve('springer');
    if (res.crash) {
      energy(-18); mood(-4); st.nau = clamp(st.nau + 10, 0, 140); achieve('sturz');
      await this.say(t, pick(['Au weh! Das war keine Landung, das war ein Einschlag. Alles noch dran?', 'Bauchlandung. Ein paar blaue Flecken, sonst nichts – Glück gehabt, Schweizer.']));
    } else {
      if (res.d >= 120) achieve('kpunkt');
      if (res.d > 138) achieve('rekord');
      mood(res.d >= 120 ? 14 : 8);
      await this.say(t, res.d > 138 ? 'SCHANZENREKORD?! Das … das gibt es nicht. Hast du das gefilmt? Keiner glaubt mir das!' : res.d >= 120 ? `${res.d.toFixed(1)} Meter, über den K-Punkt! ${res.telemark ? 'Und mit Telemark. ' : ''}Du bist sicher, dass du Schweizer bist?` : res.d >= 100 ? `${res.d.toFixed(1)} Meter. Sauber. Für einen Touristen fast schon ernst zu nehmen.` : `${res.d.toFixed(1)} Meter. Na ja. Der Hügel ist steil, die Luft ist dünn, und du bist kein Adler.`);
    }
    const f = who('party');
    UI.toast(`${fname(f)} per WhatsApp: „${res.crash ? 'Hab das Video. Das geht in die Gruppe. Sofort.' : res.d >= 120 ? `${res.d.toFixed(0)} METER?! Heute Abend geht das Bier auf mich!` : `${res.d.toFixed(0)} Meter? Mein Grosi springt weiter.`}“`);
  },
  async yodel() {
    Snd.sfx('yodel'); achieve('jodel'); mood(6);
    for (const b of G.birds) if (b.kind === 'marmot') { b.state = 'hide'; b.t = 0; }
    await this.say('me', 'Holleri-duli-dödl-diii!');
    await this.say(null, '… iii … iii … (Das Echo antwortet. Irgendwo pfeift ein Murmeltier.)');
  },
  async station() {
    const c = await this.ask(null, 'Abfahrtstafel: Railjet nach Zürich HB, nächste Abfahrt in 40 Minuten. Achtung: Die Heimreise beendet das Spiel.', ['Heimreise antreten – beendet das Spiel', 'Taxi am Taxistand nehmen', 'Nur schauen']);
    if (c === 0) {
      if (!stageAt('free')) { await this.say(null, 'Jetzt schon? Ihr seid doch gerade erst angekommen!'); return; }
      const c2 = await this.ask(null, `Wirklich nach Hause fahren? Das Spiel ist danach zu Ende, der Spielstand wird abgeschlossen. Ihr wart ${dayOf(G.S.time) + 1} Tage in Innsbruck.`, ['Ja, Heimreise nach Luzern', 'Doch noch bleiben']);
      if (c2 === 0) await this.goHome();
    }
    if (c === 1) await this.taxi();
  },
  async goHome() {
    G.busy++;
    const here = Object.keys(FRIENDS);
    await this.say(voice('kassier'), `Alle da? Zwölf … ${G.S.flags.jail ? 'elf, einer sitzt noch' : 'zwölf'}. Billette hab ich. Luzern, wir kommen.`);
    await this.say(voice('party'), 'Letzte Runde war gestern. Oder vorgestern. Egal. Es war LEGENDÄR.');
    achieve('heimreise');
    G.S.finished = 1;
    await Scene.play('train', { text: 'Railjet · Innsbruck → Zürich HB → Luzern', ms: 4200, label: 'RAILJET', col: '#a8282a', lake: true, keep: true });
    saveGame(true);
    await UI.fadeIn();
    await Ending.show();
    G.busy--;
  },
  async atm() {
    const d = dayOf(G.S.time);
    if (G.S.cashDay !== d) { G.S.cashDay = d; G.S.cashToday = 0; }
    const left = 1000 - G.S.cashToday;
    const chf = G.S.money.chf;
    const exOpt = chf >= 5 ? [{ t: `Franken wechseln (${fmtChf(chf)} → ${fmtEur(Math.floor(chf * 1.04 - 2))})` }] : [];
    const c = await this.ask(null, `Bankomat · Konto: unbegrenzt (fast). Heute noch ${Math.max(0, left)} € möglich.${chf >= 5 ? ' Franken nimmt hier sonst niemand – wechseln lohnt sich.' : ''}`, ['50 €', '100 €', '200 €', '500 €'].concat(exOpt.map((o) => o.t)).concat(['Abbrechen']));
    if (c === 4 + exOpt.length) return;
    if (c === 4 && exOpt.length) { const eur = Math.floor(chf * 1.04 - 2); addMoney('chf', -chf); addMoney('eur', eur); Snd.sfx('coin'); UI.toast(`${fmtChf(chf)} gewechselt: ${fmtEur(eur)} (Kurs 1,04, 2 € Gebühr).`); return; }
    if (left <= 0) { await this.say(null, 'Tageslimit von 1.000 € erreicht. Morgen geht wieder was.'); return; }
    const v = Math.min(left, [50, 100, 200, 500][c]);
    G.S.cashToday += v; addMoney('eur', v); Snd.sfx('coin');
    UI.toast(`${v} € abgehoben.`);
  },

  /* ---------- Taxi ---------- */
  TAXI: [
    { k: 'hotel', n: 'Hotel Zirbe', to: ['ibk', 'hotel_out'], x: 19, y: 47 },
    { k: 'bar', n: 'Gamsbock Bar', to: ['ibk', 'bar_out'], x: 43, y: 65 },
    { k: 'stueberl', n: 'Tiroler Stüberl', to: ['ibk', 'stueberl_out'], x: 25, y: 47 },
    { k: 'club', n: 'Club Lawine (Viaduktbögen)', to: ['ibk', 'club_out'], x: 70, y: 65 },
    { k: 'rouge', n: 'Rouge Tabledance (Viaduktbögen)', to: ['ibk', 'rouge_out'], x: 65, y: 65 },
    { k: 'casino', n: 'Casino Innsbruck', to: ['ibk', 'casino_out'], x: 50, y: 81 },
    { k: 'hbf', n: 'Hauptbahnhof', to: ['ibk', 'hbf'], x: 74, y: 75 },
    { k: 'bahn', n: 'Nordkettenbahn (Congress)', to: ['ibk', 'hbb_out'], x: 77, y: 33 },
  ],
  playerCityPos() {
    const m = G.map.id;
    const venue = { hotel_lobby: [19, 47], hotel_floor: [19, 47], hotel_room: [19, 47], bar: [43, 65], stueberl: [25, 47], club: [70, 65] }[m];
    if (venue) return venue;
    return [G.player.x / TS, G.player.y / TS];
  },
  async taxi(o = {}) {
    if (!(G.map.city === 'ibk' || ['hotel_lobby', 'hotel_floor', 'hotel_room', 'bar', 'stueberl', 'club'].includes(G.map.id))) { await this.say(null, 'Hier fährt kein Innsbrucker Taxi hin.'); return; }
    const [px, py] = this.playerCityPos();
    const here = this.friendsHere();
    const dests = this.TAXI.map((d) => { const dist = Math.hypot(d.x - px, d.y - py); return Object.assign({}, d, { price: Math.round((4.7 + dist * 0.22) * 10) / 10, dist }); }).filter((d) => d.dist > 4);
    if (!dests.length) { await this.say(null, 'Du bist ja schon fast da. Zu Fuss geht\'s schneller.'); return; }
    const c = await this.ask('Taxi-Zentrale', 'Taxi Innsbruck, grüß Gott! Wohin soll\'s gehen?', dests.map((d) => ({ t: d.n, r: fmtEur(d.price) })).concat([{ t: 'Doch nicht' }]));
    if (c >= dests.length) return;
    const d = dests[c];
    let group = [];
    if (here.length) {
      const c2 = await this.ask(null, `Mitfahrer? Hier sind gerade ${here.map(fname).join(', ')}.`, o.group ? [{ t: `Gemeinsam fahren (${Math.min(here.length, 7) + 1} Personen, Kosten teilen)` }, { t: 'Allein fahren' }] : [{ t: 'Allein fahren' }, { t: `Gemeinsam fahren (${Math.min(here.length, 7) + 1} Personen, Kosten teilen)` }]);
      const together = o.group ? c2 === 0 : c2 === 1;
      if (together) group = here.slice(0, 7);
    }
    const cars = group.length > 3 ? 2 : 1;
    const total = d.price * cars;
    const share = Math.round((total / (group.length + 1)) * 100) / 100;
    if (!pay('eur', share)) { await this.say(null, 'Du hast nicht genug Geld fürs Taxi.'); return; }
    if (group.length) {
      for (const id of group) G.S.aff[id] = clamp(G.S.aff[id] + 2, 0, 100);
      const loc = { hotel: 'hotel', bar: 'bar', stueberl: 'stueberl', club: 'club', rouge: 'rouge' }[d.k];
      if (loc) G.S.flags.group = { loc, ids: group, until: G.S.time + 150 };
    }
    const driver = pick(['Der Fahrer erzählt von seinem Cousin in Zürich.', 'Im Radio läuft Schlager, der Fahrer singt mit.', 'Der Fahrer fährt, als wäre er im Ski-Weltcup.', 'Der Fahrer schimpft über die Baustellen am Südring.']);
    await Scene.play('taxi', { text: `🚕 ${group.length ? `${cars > 1 ? 'Zwei Taxis' : 'Taxi'} mit ${group.map(fname).join(', ')}` : 'Taxi'} → ${d.n}. ${driver}`, ms: 3000, keep: true });
    passTime(Math.round(6 + d.dist * 0.15));
    const st = G.S.st;
    let spew = false;
    if (st.nau > 82 && Math.random() < 0.75) { spew = true; }
    enterMap(d.to[0], d.to[1]);
    await UI.fadeIn();
    UI.toast(`Taxi: ${fmtEur(total)} gesamt${group.length ? `, dein Anteil ${fmtEur(share)}` : ''}.`);
    if (spew) {
      await this.say('Taxifahrer', 'NA BITTE! Ins Auto?! Des kost\' 80 Euro Reinigungspauschale!');
      pay('eur', Math.min(80, G.S.money.eur));
      st.nau = 0; st.food = Math.max(0, st.food - 30); st.prom = Math.max(0, st.prom - 0.2); mood(-15);
      G.S.flags.vomitAt = G.S.time; achieve('kotzen');
    } else if (group.length) await this.say(group[0], pick(['Gute Idee mit dem Taxi!', 'Schneller als zu Fuss. Und wärmer.', 'Weiter geht\'s!']));
  },

  /* ---------- Kauf & Inventar ---------- */
  async shop(id) {
    const def = SHOPS[id];
    if (def.venue && OPEN[def.venue] && !['bar', 'club', 'stueberl'].includes(def.venue) && !isOpen(def.venue)) {
      await this.say(null, `${def.title}: geschlossen. Öffnungszeiten ${hoursStr(def.venue)} Uhr${['shop', 'spar', 'apotheke', 'barbier'].includes(def.venue) ? ', sonntags zu' : ''}.`);
      return;
    }
    await UI.shop(def);
  },
  onEnter(m) {
    if (m.id === 'hotel_lobby' && G.S.stage === 'findHotel') this.setStage('checkin');
    if (m.id === 'bar' && G.S.stage === 'bar') setTimeout(() => this.barArrive(), 650);
    if (m.id === 'zug' && G.S.stage === 'ride') { this._announced = {}; this._cond = null; }
  },
  async buy(def, item, cur, opts = {}) {
    if (item.special === 'hair' || item.special === 'beard') {
      if (!pay(cur, item.price)) return;
      UI.closeOverlay();
      if (G.map.id === 'shop_barbier') await this.barberAnim(item.special);
      await Editor.open({ mode: item.special });
      achieve('frisur');
      return 'close';
    }
    if (item.special === 'glatze' || item.special === 'rasur') {
      const hair = item.special === 'glatze';
      if (hair && !G.S.look.hair) { await this.say(null, 'Mehmet schaut auf deinen Kopf. „Da ist nichts mehr zum Rasieren, Freund.“'); return; }
      if (!hair && !G.S.look.beard) { await this.say(null, 'Mehmet fährt dir übers Kinn. „Glatt wie ein Babypopo. Wofür soll ich dich rasieren?“'); return; }
      if (!pay(cur, item.price)) return;
      UI.closeOverlay();
      if (G.map.id === 'shop_barbier') await this.barberAnim(hair ? 'hair' : 'beard', true);
      G.S.look[hair ? 'hair' : 'beard'] = 0;
      G.player.look = G.S.look;
      achieve('frisur');
      if (hair) achieve('glatze');
      await this.say(null, hair ? 'Mehmet hält den Spiegel hin. Blank. „Jetzt spürst du den Föhn richtig.“' : 'Mehmet hält den Spiegel hin. Glatt rasiert. „Zehn Jahre jünger. Mindestens.“');
      return 'close';
    }
    if (item.wear) {
      if (item.unlock && G.S.unlocked[item.unlock]) { Object.assign(G.S.look, item.wear); UI.toast('Angezogen!'); return; }
      if (!pay(cur, item.price)) return;
      if (item.unlock) G.S.unlocked[item.unlock] = 1;
      Object.assign(G.S.look, item.wear);
      G.player.look = G.S.look;
      UI.toast(item.price ? `${item.n} gekauft und angezogen.` : `${item.n}.`);
      if (tracht()) achieve('tracht');
      if (item.wear.costume) achieve('kostuem');
      return;
    }
    if (item.special === 'tip' || item.special === 'bottle') {
      if (!pay(cur, item.price)) return;
      Snd.sfx('clink');
      for (const n of G.npcs) if (n.id === 'dancer' || n.id === 'dancer2') { n.bubble = 'heart'; n.bubbleT = 4; }
      for (const n of G.npcs) if (n.friend) { n.bubble = '!'; n.bubbleT = 3; }
      if (item.special === 'bottle') { achieve('champagner'); mood(16); consume('wein'); consume('wein'); for (let i = 0; i < 24; i++) addPart({ x: G.player.x + rnd(-24, 24), y: G.player.y - rnd(10, 40), vx: rnd(-20, 20), vy: rnd(-30, 10), g: 40, life: 1.2, kind: 'spark' }); UI.toast('Wunderkerze, Applaus von der Bühne – und 180 Euro weniger. Chantal: „Du bist mein Held.“'); }
      else { mood(8); UI.toast('Chantal prostet dir von der Bühne zu. Jacky schenkt dir ein Glas mit ein.'); consume('wein'); }
      G.S.aff[who('charmeur')] = clamp((G.S.aff[who('charmeur')] || 50) + 3, 0, 100);
      return;
    }
    if (item.special === 'round' || item.special === 'roundShots') {
      const here = this.friendsHere();
      if (!here.length) { UI.toast('Die Jungs sind gerade nicht hier.', 'warn'); return; }
      if (!pay(cur, item.price)) return;
      UI.closeOverlay();
      await this.round(item.special === 'roundShots' ? (G.map.id === 'stueberl' ? 'zirben' : 'shot') : 'beer');
      return 'close';
    }
    if (!pay(cur, item.price)) { UI.toast('Nicht genug Geld.', 'warn'); return; }
    const I = ITEMS[item.id];
    if (def.mode === 'take' || opts.take) { addInv(item.id); Snd.sfx('ok'); UI.toast(`${I.n} eingepackt (${G.S.inv[item.id]} in der Tasche). Konsumieren: Handy → Tasche.`); return; }
    consume(item.id);
    const p = G.player;
    if (I.t === 'drink') { p.pose = 'drink'; setTimeout(() => { if (p.pose === 'drink') p.pose = 'stand'; }, 1600); }
    UI.toast(I.alc ? pick(['Prost!', 'Zum Wohl!', 'Proscht!', 'Santé!']) + ` ${I.n}` : `${I.n} – ${I.food ? pick(['lecker!', 'herrlich!', 'mmh!']) : 'erfrischend.'}`);
    if (G.map.id === 'bar' && I.alc && G.S.st.prom > 1.8 && Math.random() < 0.3) UI.toast('Sepp: „Vielleicht mal a Wasser dazwischen, hm?“');
  },
  async useItem(id) {
    const I = ITEMS[id];
    if (I.t === 'pack') { takeInv(id); addInv(I.give, I.count); UI.toast(`${I.count} × ${ITEMS[I.give].n} ausgepackt.`); return; }
    if (I.t === 'smoke') return this.smoke();
    if (I.t === 'ticket') { await this.say(null, 'Gruppenbillett Luzern – Innsbruck Hbf, 12 Personen, 2. Klasse, gültig heute. Nicht verlieren!'); return; }
    if (I.t === 'read') { await this.say(null, pick(['Schlagzeile: „Föhnsturm am Wochenende erwartet“.', 'Sportteil: Ski-Saison startet bald am Gletscher.', 'Lokales: Neue Tram-Linie bis zum Flughafen geplant?'])); passTime(10); mood(1); return; }
    if (I.t === 'souv') { await this.say(null, { schneekugel: 'Du schüttelst die Schneekugel. Schnee rieselt aufs Goldene Dachl.', magnet: 'Ein Magnet mit dem Goldenen Dachl. Für den Kühlschrank zu Hause.', postkarte: 'Eine Postkarte der Nordkette. Am Schreibtisch im Hotel kannst du sie schreiben.', edelweiss: 'Ein Edelweiss-Anstecker. Du steckst ihn dir an.', muenze: 'Deine Glücksmünze.' }[id] || I.n); return; }
    if (I.uses) { G.S.uses[id] = (G.S.uses[id] || I.uses) - 1; if (G.S.uses[id] <= 0) { takeInv(id); delete G.S.uses[id]; } }
    else takeInv(id);
    consume(id);
    UI.toast(`${I.n}: ${I.alc ? 'Prost!' : I.t === 'med' ? 'eingenommen.' : 'mmh.'}`);
  },

  /* ---------- Ereignisse ---------- */
  /* Sichtbarer Schwall: zwei Wellen Brocken aus dem Mund, Schrei als Text, Pfütze vor den Füssen */
  async spew(a) {
    const dx = DIRV[a.dir][0], dy = DIRV[a.dir][1];
    const mouthX = a.x + dx * 6, mouthY = a.y - 12;
    const wave = (n) => { for (let i = 0; i < n; i++) addPart({ x: mouthX + rnd(-2, 2), y: mouthY + rnd(-2, 2), vx: dx * rnd(25, 70) + rnd(-25, 25), vy: dy * 20 + rnd(-10, 30), g: 170, life: rnd(0.8, 1.4), kind: 'vomit', s: Math.random() < 0.35 ? 4 : Math.random() < 0.5 ? 3 : 2, col: pick(['rgba(165,170,60,0.95)', 'rgba(140,150,45,0.95)', 'rgba(200,190,90,0.95)']) }); };
    Snd.sfx('vomit'); G.fx.shake = 1;
    addPart({ x: a.x, y: a.y - 34, vy: -14, life: 1.6, kind: 'txt', txt: 'BLÖÄÄRGH!', col: 'rgba(170,220,90,1)' });
    wave(30);
    G.S.vomitSpots.push({ map: G.map.id, x: a.x + dx * 12, y: a.y + dy * 6 + 2, t: G.S.time });
    await sleep(500);
    Snd.sfx('vomit'); G.fx.shake = 0.6; wave(22);
    await sleep(500);
    wave(10);
    await sleep(700);
  },
  async vomit() {
    if (G.busy) return;
    G.busy++;
    const p = G.player, st = G.S.st;
    p.pose = 'bend';
    await this.say('me', 'Oh nein… mir wird…');
    await this.spew(p);
    st.nau = 0; st.food = Math.max(0, st.food - 40); st.prom = Math.max(0, st.prom - 0.3); mood(-14); energy(-8);
    G.S.flags.vomitAt = G.S.time;
    achieve('kotzen');
    p.pose = 'stand';
    const near = this.friendsHere();
    if (G.map.id === 'club') { await this.say('Türsteher', 'Raus! Sofort! Du gehst jetzt an die frische Luft.'); G.busy--; await warpTo('ibk', 'club_out'); G.S.flags.clubPaid = -1; return; }
    if (G.map.id === 'rouge') { await this.say('Rocky', 'Auf meinen Samtteppich?! Raus, und komm heute nicht wieder.'); G.busy--; await warpTo('ibk', 'rouge_out'); G.S.flags.rougePaid = -1; return; }
    if (G.map.id === 'bar') await this.say('Sepp', 'Oida! Des putzt jetzt aber wer anderer. Trink a Wasser und iss was!');
    else if (near.length) await this.say(near[0], pick(['Ui, ui, ui. Geht\'s? Komm, setz dich mal.', 'Zu viel und zu wenig gegessen. Klassiker.', 'Ich hab nichts gesehen. Wirklich nicht.']));
    else await this.say(null, 'Das war zu viel ohne Essen und ohne Schlaf. Iss etwas, trink Wasser oder leg dich hin.');
    G.busy--;
  },
  async blackout() {
    if (G.busy) return;
    G.busy++;
    const st = G.S.st;
    await this.say('me', 'Alles… dreht… sich…');
    await UI.fadeOut('Filmriss.');
    await sleep(1500);
    const t = G.S.time, d = dayOf(t);
    const wake = (hourOf(t) < 5 ? d : d + 1) * 1440 + 10 * 60;
    const lost = Math.min(G.S.money.eur, Math.round(rnd(15, 45)));
    addMoney('eur', -lost);
    G.S.time = wake; G.S.lastSleep = wake;
    Object.assign(st, { energy: 70, prom: 0, nau: 0, food: 20, mood: Math.max(15, st.mood - 25), hang: 120 });
    G.S.flags.blackoutAt = wake;
    achieve('filmriss');
    let extra = '';
    const r = Math.random();
    if (r < 0.35) { G.S.unlocked.tirolerhut = 1; G.S.look.hat = 9; G.S.look.hatCol = 8; extra = 'Auf deinem Kopf sitzt ein Tirolerhut, an den du dich nicht erinnern kannst.'; }
    else if (r < 0.65) { addInv('muenze'); extra = 'In deiner Hosentasche steckt eine Münze mit einer eingeritzten Telefonnummer.'; }
    else { G.S.beers += 3; extra = 'Auf deinem Bierdeckel sind drei Striche mehr, als du dir erklären kannst.'; }
    if (G.S.flags.checkedIn) enterMap('hotel_room', 'bed'); else enterMap('ibk', 'hbf');
    G.npcs = G.npcs.filter((n) => !n.friend); this.populate(G.map);
    await sleep(600);
    await UI.fadeIn();
    await this.say('me', `Wo… bin ich? ${G.S.flags.checkedIn ? 'Ah, im Hotelzimmer.' : 'Am Bahnhof?'} Wie spät ist es? ${clockStr()}?!`);
    await this.say(null, `${extra} Dein Portemonnaie ist ${lost} € leichter.`);
    UI.toast(`💬 ${fname(who('party'))}: „Lebst du noch? Wir haben dich gestern ins Bett getragen 😂“`);
    G.busy--;
  },
  /* Kurz vor dem Einschlafen: letzte Chance, etwas zu essen, zu trinken oder ins Hotel zu fahren */
  async tiredWarning() {
    if (G.busy) return;
    G.busy++;
    G.warned.tiredCrit = 1;
    Snd.sfx('yawn');
    energy(6); /* Adrenalin: ein paar Minuten Zeit */
    const bag = Object.keys(G.S.inv).filter((id) => ITEMS[id] && ['drink', 'food', 'med'].includes(ITEMS[id].t) && (ITEMS[id].en > 0 || ITEMS[id].food || ITEMS[id].water));
    const opts = [];
    if (bag.length) opts.push({ t: `Tasche öffnen (${bag.slice(0, 3).map((id) => ITEMS[id].n).join(', ')}${bag.length > 3 ? ' …' : ''})`, k: 'bag' });
    else opts.push({ t: 'Tasche öffnen – leer, aber vielleicht hilft Wasser', k: 'bag' });
    if (G.map.id === 'hotel_room') opts.push({ t: 'Ins Bett', k: 'bed' });
    else if (G.map.city === 'ibk' || ['bar', 'stueberl', 'club', 'rouge', 'casino', 'hotel_lobby', 'hotel_floor'].includes(G.map.id)) opts.push({ t: 'Taxi ins Hotel Zirbe rufen', k: 'taxi' });
    if (['bar', 'stueberl', 'casino', 'hotel_lobby'].includes(G.map.id)) opts.push({ t: 'Einen Kaffee an der Theke bestellen', k: 'coffee' });
    opts.push({ t: 'Durchhalten', k: 'hold' });
    const c = await this.ask('me', 'Meine Augen fallen zu … Wenn ich jetzt nichts mache, schlafe ich im Stehen ein. Essen, Wasser, Kaffee, Energy-Drink oder ab ins Bett!', opts);
    const k = opts[c].k;
    G.busy--;
    if (k === 'bag') { Phone.open('inv'); UI.toast('Alles mit „weckt auf“ oder Essen hilft gegen die Müdigkeit.'); }
    else if (k === 'bed') await this.bed();
    else if (k === 'taxi') await this.taxi();
    else if (k === 'coffee') { if (pay('eur', 3.4)) { consume('kaffee'); UI.toast('Ein doppelter Espresso. Das hält dich wach.'); } else UI.toast('Kein Geld für Kaffee.', 'warn'); }
    else UI.toast('Du reisst dich zusammen. Ein paar Minuten hast du noch – dann brauchst du Schlaf.', 'warn');
  },
  async collapse() {
    if (G.busy) return;
    G.busy++;
    await this.say('me', 'Ich… kann nicht mehr… nur kurz… die Augen…');
    if (G.map.id === 'zug') { await UI.fadeOut('Zzz…'); passTime(Math.max(5, 216 - trainState().tm - 2), { sleep: true }); await sleep(1000); await UI.fadeIn(); G.busy--; return; }
    await UI.fadeOut('Du schläfst im Stehen ein.');
    passTime(240, { sleep: true, rate: 0.25 });
    G.S.lastSleep = Math.min(G.S.time, G.S.lastSleep + 600);
    await sleep(1400);
    if (G.S.flags.checkedIn) enterMap('hotel_room', 'bed');
    else enterMap(G.map.id, G.S.map === 'ibk' ? 'hbf' : Object.keys(G.map.spawns)[0]);
    await UI.fadeIn();
    await this.say(null, G.S.flags.checkedIn ? 'Du wachst in deinem Hotelbett auf. Die Jungs haben dich offenbar hergebracht.' : 'Du wachst auf einer Bank auf. Ein Taubenschwarm beobachtet dich.');
    G.busy--;
  },
};
function tracht() { const L = G.S.look; return L.hat === 9 && L.top === 11 && L.pants === 7 && L.shoes === 6; }

/* ============ Ende / Heimreise ============ */
const Ending = {
  async show() {
    const S2 = G.S;
    const html = `<div class="panel"><div class="panel-head"><h2>Heimreise nach Luzern</h2><span class="sub">Spiel beendet</span></div><div class="panel-body">
      <p class="note">Der Railjet rollt aus dem Inntal. ${Object.keys(FRIENDS).length} müde Kollegen, ein voller Bierdeckel und viele Geschichten.</p>
      <div class="statgrid">
        <div class="stat"><small>Bier</small><b>${S2.beers}</b></div><div class="stat"><small>Schnäpse</small><b>${S2.shots}</b></div>
        <div class="stat"><small>Burger</small><b>${S2.burgers}</b></div><div class="stat"><small>Fotos</small><b>${Object.keys(S2.photos).length}/${Object.keys(SIGHTS).length}</b></div>
        <div class="stat"><small>Erlebnisse</small><b>${Object.keys(S2.ach).length}/${Object.keys(ACH).length}</b></div><div class="stat"><small>Jass-Siege</small><b>${S2.rec.jassW}</b></div>
        <div class="stat"><small>Restgeld</small><b>${fmtEur(S2.money.eur)}</b></div><div class="stat"><small>Tage</small><b>${dayOf(S2.time) + 1}</b></div>
      </div>
      <p class="note">${Object.keys(S2.ach).length > 20 ? 'Legendär. Davon werdet ihr noch in zehn Jahren erzählen.' : 'Schöner Ausflug! Aber da geht noch mehr – vielleicht beim nächsten Mal.'}</p>
      <p class="note">Das Spiel ist damit beendet. Ein neues Spiel beginnt wieder in Luzern am Bahnhof.</p>
      </div><div class="panel-foot"><span>Danke fürs Spielen!</span><button class="btn primary" id="endNew">Neues Spiel</button></div></div>`;
    const o = UI.overlay(html, null);
    o.querySelector('#endNew').addEventListener('click', () => { clearSave(); try { localStorage.removeItem(SAVE_KEY + '-img'); } catch (e) {} location.reload(); });
    G.mode = 'over';
    await new Promise(() => {});
  },
};
