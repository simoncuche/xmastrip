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
  /* Kusi: schwarze Scheitelhaare, weisser Pullover, Jeans, weisse Schuhe */
  kusi: { head: 4, ears: 0, eyes: 6, brows: 2, nose: 6, mouth: 2, mark: 1, build: 0, height: 0, jewel: 0, hair: 3, hairCol: 0, top: 4, topCol: 13, print: 0, pants: 0, pantsCol: 0, shoes: 0, shoesCol: 0, glasses: 0, hat: 0 },
  /* Römu: Piloten-Outfit – Navy-Sakko mit Abzeichen, Anzughose, Pilotenbrille, Mütze */
  roemu: { head: 2, ears: 0, eyes: 2, brows: 3, nose: 1, mouth: 1, mark: 0, build: 2, height: 2, jewel: 0, hair: 2, hairCol: 2, beard: 0, glasses: 3, top: 9, topCol: 10, print: 5, pants: 5, pantsCol: 8, shoes: 3, shoesCol: 1, hat: 8, hatCol: 2 },
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
  foto: ['roemu', 'lexx', 'oelu'], music: ['oelu', 'floeru', 'kusi'], party: ['coel', 'haennsu', 'floeru'], schnaps: ['didu', 'oelu', 'dous'],
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
}
function who(fn) { for (const id of FN_FALLBACK[fn] || []) if (FRIENDS[id]) return id; return Object.keys(FRIENDS)[0]; }
const fname = (id) => (FRIENDS[id] ? FRIENDS[id].name : G.S.name);
const playerIsKassier = () => G.S.pid === 'cuche';
const T2P = (tx, ty) => ({ x: tx * 16 + 8, y: ty * 16 + 12 });
/* Abfahrt in Luzern: Der Spieler kauft das Gruppenbillett, alle müssen um 9:10 im Zug sein. */
const DEP_TIME = 9 * 60 + 10;
const TICKET_PRICE = 468; /* 12 × 39.00 CHF */
const TICKET_CASH = 500;  /* was der Kassier für das Billett herausrückt */
const latecomer = () => who('smoke'); /* der Raucher verpasst den Zug – wer auch immer gerade die Rolle hat */
/* Jemand aus der Gruppe, der eine Rolle spricht – aber nie der Nachzügler selbst. */
function voice(fn) { const id = who(fn); if (id !== latecomer()) return id; return Object.keys(FRIENDS).find((x) => x !== id) || id; }

/* ============ Ablauf ============ */
const STAGES = ['meet', 'board', 'ride', 'arrived', 'findHotel', 'checkin', 'room', 'bar', 'free'];
const stageAt = (s) => STAGES.indexOf(G.S.stage) >= STAGES.indexOf(s);
const OPEN = {
  bar: [11, 26], stueberl: [10, 24], club: [22, 29], huette: [9, 17], bahn: [8.5, 17.5], turm: [10, 17], shop: [9, 19], souvenir: [9, 20], cafe: [8, 20], apotheke: [8, 18], wurst: [10, 28], kebap: [11, 28], trafik: [6, 22], spar: [8, 19], barbier: [9, 18],
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
  huette: { title: 'Restaurant Seegrube', mode: 'eat', intro: 'Auf 1.905 Metern schmeckt alles doppelt so gut.', sections: [{ t: 'Getränke', items: [it('radler', 4.9), it('bier', 5.2), it('jagertee', 5.9), it('kaffee', 3.5), it('wasser', 3.2)] }, { t: 'Hüttenküche', items: [it('kaiserschmarrn', 13.9), it('germknoedel', 9.9), it('gulasch', 7.9), it('strudel', 6.5)] }] },
  minibar: { title: 'Minibar', mode: 'eat', intro: 'Hotelpreise. Natürlich.', sections: [{ t: 'Inhalt', items: [it('dosenbier', 6.5), it('zirben', 7.0), it('cola', 4.5), it('wasser', 4.0), it('schoko', 4.5), it('erdnuesse', 5.0)] }] },
  kebap: { title: 'Kebap im Bogen', mode: 'eat', venue: 'kebap', sections: [{ t: 'Auf die Hand', items: [it('kebap', 6.5, { n: 'Kebap mit allem', icon: 'kebap', d: 'macht richtig satt · gegen Übelkeit' }), it('pommes', 3.9), it('cola', 3.0), it('dosenbier', 3.5)] }] },
  wurst: { title: 'Würstelstand', mode: 'eat', venue: 'wurst', intro: '„A Käsekrainer mit an Buckl und an Sechzehner-Blech?“ Du nickst einfach.', sections: [{ t: 'Würstel', items: [it('kaesekrainer', 4.9), it('bosna', 4.5), it('bratwurst', 4.2), it('pommes', 3.5)] }, { t: 'Dazu', items: [it('dosenbier', 3.0), it('cola', 2.8)] }] },
  spar: { title: 'Supermarkt', mode: 'take', venue: 'spar', sections: [{ t: 'Einkaufen', items: [it('wasser', 0.89), it('dosenbier', 1.29), it('energy', 1.49), it('semmel', 0.39), it('banane', 0.39), it('sandwich', 3.49), it('chips', 2.29), it('schoko', 1.99), it('speck', 6.99)] }] },
  apotheke: { title: 'Apotheke', mode: 'take', venue: 'apotheke', intro: 'Die Apothekerin mustert dich über ihre Brille hinweg.', sections: [{ t: 'Rezeptfrei', items: [it('aspirin', 6.9), it('magen', 8.5), it('elektrolyt', 5.9)] }] },
  trafik: { title: 'Trafik', mode: 'take', venue: 'trafik', sections: [{ t: 'Tabak & Zeitung', items: [it('zigaretten', 7.0), it('feuerzeug', 1.5), it('zeitung', 2.2), it('postkarte', 1.2)] }] },
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
  tracht: { title: 'Trachten Holzer', mode: 'wear', venue: 'shop', intro: 'Es riecht nach Leder und Loden. Die Verkäuferin lächelt wissend.', sections: [{ t: 'Echte Tracht', items: [
    it('o_hut', 69, { n: 'Tirolerhut mit Feder', icon: 'hat', wear: { hat: 9, hatCol: 8 }, unlock: 'tirolerhut', d: 'Loden, mit Spielhahnfeder' }),
    it('o_hemd', 79, { n: 'Trachtenhemd kariert', icon: 'shirt', wear: { top: 11, topCol: 0 }, unlock: 'trachtenhemd', d: 'Rot-weiss kariert' }),
    it('o_lederhose', 249, { n: 'Lederhose mit Hosenträgern', icon: 'pants', wear: { pants: 7 }, unlock: 'lederhose', d: 'Hirschleder, knielang' }),
    it('o_haferl', 139, { n: 'Haferlschuhe', icon: 'shoe', wear: { shoes: 6 }, unlock: 'haferlschuhe', d: 'Seitlich geschnürt' }),
  ] }] },
  barbier: { title: 'Friseur & Barbier', mode: 'special', venue: 'barbier', intro: 'Der Barbier schärft sein Messer. „Was machen wir heute?“', sections: [{ t: 'Neuer Look', items: [it('s_hair', 28, { n: 'Haarschnitt & Farbe', icon: 'scissors', special: 'hair', d: 'Frisur und Haarfarbe frei wählen' }), it('s_beard', 18, { n: 'Bart trimmen', icon: 'scissors', special: 'beard', d: 'Bart und Bartfarbe frei wählen' })] }] },
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
      case 'meet': return playerIsKassier() ? 'Triff die Jungs beim Torbogen – du kaufst das Gruppenbillett. Abfahrt 9:10!' : `Triff die Jungs beim Torbogen – ${org} gibt dir das Geld fürs Billett. Abfahrt 9:10!`;
      case 'board': return hasInv('billett') ? 'Gleis 4: Steig in den IR nach Zürich – Abfahrt 9:10!' : 'Billettautomat in der Bahnhofshalle: Gruppenbillett kaufen – Abfahrt 9:10!';
      case 'ride': return 'Railjet nach Innsbruck · Wagen 3, Vierertisch';
      case 'arrived': return 'Innsbruck Hbf! Aussteigen (Tür im Vorraum)';
      case 'findHotel': return 'Finde das Hotel Zirbe (Altstadt, Gasse beim Goldenen Dachl)';
      case 'checkin': return 'Check an der Rezeption ein';
      case 'room': return 'Bezieh Zimmer 307 im 3. Stock';
      case 'bar': return 'Triff die Jungs in der Gamsbock Bar (Maria-Theresien-Strasse)';
      default: {
        const tips = [];
        const h = hourOf(G.S.time);
        if (G.S.st.energy < 25) tips.push('Du bist müde – leg dich im Zimmer 307 hin');
        else if (G.S.st.food < 25) tips.push('Hunger! Burger in der Gamsbock Bar?');
        else if (G.S.st.nau > 70) tips.push('Dir ist übel – Wasser, Essen oder Schlaf');
        else if (h >= 22 || h < 4) tips.push('Nachtleben: Club Lawine in den Viaduktbögen');
        else if (h < 17 && !G.S.ach.seegrube) tips.push('Nordkettenbahn zur Seegrube (bis 17:30)');
        else tips.push('Die Jungs sind in der Gamsbock Bar');
        return `${tips[0]} · Fotos ${Object.keys(G.S.photos).length}/${Object.keys(SIGHTS).length}`;
      }
    }
  },
  objectiveTag() { return { meet: 'LUZERN', board: 'GLEIS 4', ride: 'RAILJET', arrived: 'AUSSTIEG', findHotel: 'HOTEL', checkin: 'HOTEL', room: 'ZIMMER', bar: 'BAR', free: 'FREI' }[G.S.stage]; },
  steps() {
    return [
      { t: 'Die Jungs beim Torbogen treffen', d: 'Bahnhofplatz Luzern', done: stageAt('board') },
      { t: 'Gruppenbillett kaufen', d: 'Billettautomat in der Bahnhofshalle, 12 Personen', done: hasInv('billett') || stageAt('ride') },
      { t: 'Pünktlich um 9:10 in den IR nach Zürich', d: 'Gleis 4, umsteigen in Zürich HB', done: stageAt('arrived') },
      { t: 'Hotel Zirbe finden', d: 'Gasse südlich vom Goldenen Dachl', done: stageAt('checkin') },
      { t: 'Einchecken', d: 'Rezeption bei Frau Hofer', done: stageAt('room') },
      { t: 'Zimmer 307 beziehen', d: '3. Stock, Rucksack auspacken', done: stageAt('bar') },
      { t: 'Die Jungs in der Gamsbock Bar treffen', d: 'Maria-Theresien-Strasse, Ostseite', done: stageAt('free') },
      { t: 'Innsbruck geniessen', d: 'Bars, Club Lawine, Shopping, Nordkette, Altstadt', done: Object.keys(G.S.ach).length >= 20 },
    ];
  },
  setStage(s) { G.S.stage = s; UI.hud(); },
  mapPois(id) {
    if (id !== 'ibk') return [];
    const A = '#ffb53d', S = '#6cc46f', V = '#7ab0f0', N = '#e85af0';
    return [
      { x: 19, y: 46, n: 'Hotel Zirbe', c: A }, { x: 43, y: 64, n: 'Gamsbock Bar', c: A }, { x: 25, y: 46, n: 'Stüberl', c: A }, { x: 71, y: 63, n: 'Club Lawine', c: N },
      { x: 74, y: 74, n: 'Hauptbahnhof', c: V }, { x: 34, y: 33, n: 'Goldenes Dachl', c: V }, { x: 24, y: 38, n: 'Stadtturm', c: V }, { x: 45, y: 33, n: 'Dom', c: V },
      { x: 62, y: 33, n: 'Hofburg', c: V }, { x: 61, y: 38, n: 'Leopoldsbrunnen', c: V }, { x: 77, y: 31, n: 'Nordkettenbahn', c: V }, { x: 85, y: 44, n: 'Hofgarten', c: V },
      { x: 35, y: 64, n: 'Annasäule', c: V }, { x: 35, y: 81, n: 'Triumphpforte', c: V }, { x: 30, y: 20, n: 'Innbrücke', c: V },
      { x: 3, y: 46, n: 'Sport', c: S }, { x: 9, y: 46, n: 'Tracht', c: S }, { x: 29, y: 46, n: 'Souvenir', c: S }, { x: 21, y: 72, n: 'Apotheke', c: S }, { x: 28, y: 72, n: 'Spar', c: S },
      { x: 43, y: 72, n: 'Souvenir', c: S }, { x: 49, y: 72, n: 'Trafik', c: S }, { x: 28, y: 80, n: 'Barbier', c: S }, { x: 43, y: 80, n: 'Konditorei', c: S }, { x: 61, y: 77, n: 'Würstel', c: S }, { x: 87, y: 77, n: 'Taxi', c: A },
    ];
  },

  /* ---------- Freunde platzieren ---------- */
  /* Der Nachzügler ist nicht dabei: vor der Abfahrt raucht er vor dem Bahnhof, danach sitzt er im Taxi. */
  away(id) {
    if (id !== latecomer()) return false;
    if (G.S.stage === 'board') return true;
    return !!(G.S.flags.late && !G.S.flags.lateArrived);
  },
  schedule(id) {
    if (this.away(id)) return null;
    const h = hourOf(G.S.time);
    const o = G.S.flags.group;
    if (o && G.S.time < o.until && o.ids.includes(id)) return o.loc;
    if (!stageAt('bar')) return null;
    if (G.S.stage === 'bar') return 'bar';
    if (h >= 2.5 && h < 9) return 'hotel';
    if (h >= 9 && h < 11) return ['kassier', 'gourmet', 'anwalt', 'muskel'].includes(FRIENDS[id].fn) ? 'breakfast' : 'hotel';
    if (h >= 14 && h < 17 && FRIENDS[id].fn === 'pilot') return 'city';
    if (h >= 22 || h < 2.5) {
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
      return;
    }
    if (m.id === 'luzern_halle' && s === 'board') {
      let k = 0;
      for (const id of ids) { const x = 11 + (k % 6), y = 9 + Math.floor(k / 6); add(id, x, y, 3, 'stand'); k++; }
      return;
    }
    if (m.id === 'zug' && (s === 'ride' || s === 'arrived')) {
      if (s === 'arrived') { let k = 0; for (const id of ids) { add(id, 41 + (k % 3), 2 + Math.floor(k / 3), 3, 'stand'); k++; } return; }
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
      if (prev >= 0 && ['bar', 'club', 'stueberl', 'hotel_lobby', 'ibk'].includes(m.id) && !G.busy) {
        const before = this.friendsHere().sort().join();
        G.npcs = G.npcs.filter((n) => !n.friend);
        this.populate(m);
        const after = this.friendsHere().sort().join();
        if (before !== after && m.id !== 'ibk') {
          const left = before.split(',').filter((x) => x && !after.includes(x));
          if (left.length) UI.toast(`${left.map(fname).join(', ')} ${left.length > 1 ? 'ziehen' : 'zieht'} weiter.`);
        }
      }
      const closing = { bar: 'bar', club: 'club', stueberl: 'stueberl' }[m.id];
      if (closing && !isOpen(closing) && !G.busy) this.closingTime(closing);
    }
  },
  async closingTime(v) {
    G.busy++;
    const who2 = { bar: 'Sepp', club: 'Türsteher', stueberl: 'Wirtin Resi' }[v];
    await this.say(who2, v === 'bar' ? 'Sperrstund is! Austrinken, Burschen, ab ins Bett!' : v === 'club' ? 'Licht an, Party aus. Wir machen zu!' : 'So, Feierabend. Gute Nacht miteinand!');
    G.busy--;
    await warpTo('ibk', { bar: 'bar_out', club: 'club_out', stueberl: 'stueberl_out' }[v]);
  },
  async openGuard(v) {
    if (v === 'bar' && G.S.stage === 'bar') return true;
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
  async talkFriend(id) {
    const f = FRIENDS[id];
    const s = G.S.stage;
    if (G.map.id === 'luzern' && s === 'meet') return this.meetTalk(id);
    if (G.map.id === 'luzern' && s === 'board') return this.lateTalk(id);
    if (G.map.id === 'zug') return this.trainTalk(id);
    const opts = [{ t: 'Plaudern', k: 'chat' }];
    const venue = ['bar', 'stueberl', 'club'].includes(G.map.id);
    if (venue) opts.push({ t: `${f.name} ein Getränk ausgeben`, r: G.map.id === 'club' ? '5,50 €' : '4,80 €', k: 'treat' });
    if (venue && id === who('jass') && G.map.id !== 'club') opts.push({ t: 'Jassen', k: 'jass' });
    if (venue && id === who('arm')) opts.push({ t: 'Armdrücken', k: 'arm' });
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
        await this.say(id, pick(['Merci viu mau! Proscht!', 'Du bist ein Guter. Prost!', 'Auf Innsbruck!', 'Zum Wohl! Die nächste geht auf mich.']));
        if (G.S.aff[id] > 70 && !G.S.flags['gift_' + id + dayOf(G.S.time)]) { G.S.flags['gift_' + id + dayOf(G.S.time)] = 1; await this.say(id, 'Und weil du\'s bist: Die hier geht auf mich!'); consume(G.map.id === 'club' ? 'flaschenbier' : 'bier'); }
        break;
      }
      case 'jass': await this.jass(); break;
      case 'arm': await this.armwrestle(id); break;
      case 'darts': await this.darts(); break;
      case 'kicker': await this.kicker(); break;
      case 'smoke': await this.smoke(id); break;
      case 'foto': {
        const miss = Object.keys(SIGHTS).filter((s2) => !G.S.photos[s2]);
        const where = { dachl: 'am Ende der Herzog-Friedrich-Strasse', stadtturm: 'gleich westlich vom Goldenen Dachl', annasaeule: 'mitten in der Maria-Theresien-Strasse', triumphpforte: 'am südlichen Ende der Maria-Theresien-Strasse', hofburg: 'östlich vom Dom', dom: 'nördlich vom Domplatz', leopold: 'vor der Hofburg', mariahilf: 'vom Südufer des Inn aus', innbruecke: 'über den Inn', bogen: 'bei den Viaduktbögen östlich der Maria-Theresien-Strasse', seegrube: 'oben auf der Nordkette – Bahn ab Congress', hofgarten: 'im Park östlich der Hofburg', torbogen: 'in Luzern, zu spät', kapellbruecke: 'in Luzern, zu spät' };
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
      const left = need.filter((x) => !fl.met[x]).map(fname);
      if (left.length) UI.toast(`Noch nicht begrüsst: ${left.join(', ')}`);
      else if (metCount < 4) UI.toast(`Begrüss noch ${4 - metCount} weitere Kollegen.`);
    }
  },
  async lateTalk(id) {
    const c = await this.ask(id, 'Ich rauch noch schnell eine fertig. Geh schon vor, ich komm gleich nach!', [{ t: 'Komm jetzt, der Zug fährt um 9:10!' }, { t: 'Okay, bis gleich' }]);
    if (c === 0) await this.say(id, pick(['Ja ja, gleich. Ich bin schneller als du denkst.', 'Zwei Züge, eine Zigarette – das geht sich aus.', 'Stress nicht. Ich hab noch mindestens drei Minuten.']));
    else await this.say(id, 'Bis gleich!');
  },
  async trainTalk(id) {
    const s = G.S.stage;
    if (s === 'arrived') { await this.say(id, 'Innsbruck! Raus hier, die Tür ist im Vorraum!'); return; }
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
    await UI.fadeOut('IR 70 · Luzern → Zürich HB');
    passTime(46);
    await sleep(1400);
    UI.els.fadeText.textContent = 'Umsteigen in Zürich HB · Railjet nach Innsbruck';
    await sleep(1600);
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
    if (ts.tm > 25 && !G.S.flags.ticketCheck && !G.busy) { G.S.flags.ticketCheck = 1; this.ticketCheck(); }
    if (ts.tm >= 216 && G.S.stage === 'ride' && !G.busy) this.arrive();
  },
  async ticketCheck() {
    G.busy++;
    const cond = { name: 'Zugbegleiterin', look: npcLook(951, { hat: 8, hatCol: 2, top: 9, topCol: 1, hair: 9, beard: 0 }) };
    await this.say(cond, 'Grüß Gott, die Fahrkarten bitte!');
    await this.say('me', 'Hier, das Gruppenbillett für zwölf Personen.');
    if (G.S.flags.late) {
      await this.say(cond, 'Zwölf? Ich zähle elf.');
      await this.say(FRIENDS.lexx && 'lexx' !== latecomer() ? 'lexx' : voice('jass'), `Der Zwölfte sitzt in einem Taxi irgendwo bei Sargans. Lange Geschichte. Rechtlich gesehen ist das Billett trotzdem gültig.`);
    }
    await this.say(cond, 'Danke, passt. Gute Weiterfahrt nach Innsbruck – und viel Spass!');
    G.busy--;
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
    await UI.fadeOut(mins > 300 ? 'Gute Nacht …' : 'Zzz …');
    passTime(mins, { sleep: true, rate: mins > 300 ? 0.3 : 0.38 });
    G.S.lastSleep = mins > 300 ? G.S.time : Math.min(G.S.time, G.S.lastSleep + mins * 3);
    if (mins > 300) { st.energy = 100; if (drunk > 1.2) { st.hang = 100; mood(-10); } else mood(8); G.warned = {}; }
    await sleep(1300);
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
    if (k === 'Hotelmappe lesen') await this.say(null, 'Gamsbock Bar 11–2 Uhr · Tiroler Stüberl 10–24 Uhr · Club Lawine 22–5 Uhr · Nordkettenbahn 8:30–17:30 · Stadtturm 10–17 Uhr · Frühstück 7–10:30. Taxi: einfach an der Rezeption fragen oder per Handy rufen.');
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
    await UI.fadeOut('Du duschst ausgiebig …');
    passTime(15);
    const st = G.S.st;
    st.wet = 0; st.smell = 0; energy(12); mood(8); st.prom = Math.max(0, st.prom - 0.05); st.nau = Math.max(0, st.nau - 8);
    Snd.sfx('splash');
    await sleep(1000);
    await UI.fadeIn();
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
    if (k === 'Kurz aufs WC') { passTime(3); mood(1); UI.toast('Erleichtert.'); }
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
    if (k === 'prost') { Snd.sfx('clink'); p.pose = 'drink'; mood(3); for (const id of here) G.S.aff[id] = clamp(G.S.aff[id] + 1, 0, 100); await this.say(here[0] || null, here.length ? pick(['Proscht!', 'Zum Wohl!', 'Auf den Gruppenausflug!']) : 'Du prostest dir selbst zu. Auch schön.'); p.pose = 'sit'; }
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
      await UI.fadeOut('PLATSCH!');
      Snd.sfx('splash');
      for (let i = 0; i < 30; i++) addPart({ x: G.player.x + rnd(-14, 14), y: G.player.y - rnd(0, 20), vx: rnd(-40, 40), vy: rnd(-70, -20), g: 160, life: 0.9, kind: 'splash' });
      st.wet = 60; energy(15); mood(12); st.prom = Math.max(0, st.prom - 0.15); st.nau = Math.max(0, st.nau - 10);
      G.S.flags.bathAt = G.S.time;
      passTime(5);
      await sleep(700);
      await UI.fadeIn();
      achieve('brunnen');
      await this.say('me', st.prom > 1 ? 'JUHUUU! Das Wasser ist eiskalt! Herrlich!' : 'Eiskalt! Aber irgendwie… befreiend.');
      const cop = G.npcs.find((n) => n.id === 'polizei');
      if (cop && Math.hypot(cop.x - G.player.x, cop.y - G.player.y) < 200 && Math.random() < 0.7) {
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
      await UI.card('Klipp, klapp … vorbei an Hofburg, Dom, Goldenem Dachl und Annasäule …', 2200);
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
    await UI.card('… 131, 132, 133!', 1000);
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
    await UI.fadeOut('Hungerburgbahn … Umsteigen … Seegrubenbahn …');
    passTime(20);
    await sleep(1500);
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
    await UI.fadeOut('Talfahrt …'); passTime(20); await sleep(1000);
    enterMap('ibk', 'hbb_out'); await UI.fadeIn();
  },
  async telescope() { await Mini.panorama('seegrube'); mood(4); },
  async yodel() {
    Snd.sfx('yodel'); achieve('jodel'); mood(6);
    for (const b of G.birds) if (b.kind === 'marmot') { b.state = 'hide'; b.t = 0; }
    await this.say('me', 'Holleri-duli-dödl-diii!');
    await this.say(null, '… iii … iii … (Das Echo antwortet. Irgendwo pfeift ein Murmeltier.)');
  },
  async station() {
    const c = await this.ask(null, 'Abfahrtstafel: Railjet nach Zürich HB, nächste Abfahrt in 40 Minuten.', ['Heimreise antreten (Spiel beenden)', 'Taxi am Taxistand nehmen', 'Nur schauen']);
    if (c === 0) {
      if (!stageAt('free')) { await this.say(null, 'Jetzt schon? Ihr seid doch gerade erst angekommen!'); return; }
      const c2 = await this.ask(null, 'Wirklich nach Hause fahren? Du kannst danach weiterspielen.', ['Ja, Heimreise', 'Doch noch bleiben']);
      if (c2 === 0) await Ending.show();
    }
    if (c === 1) await this.taxi();
  },
  async atm() {
    const d = dayOf(G.S.time);
    if (G.S.cashDay !== d) { G.S.cashDay = d; G.S.cashToday = 0; }
    const left = 400 - G.S.cashToday;
    if (left <= 0) { await this.say(null, 'Tageslimit von 400 € erreicht.'); return; }
    const c = await this.ask(null, `Bankomat · Noch ${left} € heute möglich.`, ['50 €', '100 €', '200 €', 'Abbrechen']);
    if (c === 3) return;
    const v = Math.min(left, [50, 100, 200][c]);
    G.S.cashToday += v; addMoney('eur', v); Snd.sfx('coin');
    UI.toast(`${v} € abgehoben.`);
  },

  /* ---------- Taxi ---------- */
  TAXI: [
    { k: 'hotel', n: 'Hotel Zirbe', to: ['ibk', 'hotel_out'], x: 19, y: 47 },
    { k: 'bar', n: 'Gamsbock Bar', to: ['ibk', 'bar_out'], x: 43, y: 65 },
    { k: 'stueberl', n: 'Tiroler Stüberl', to: ['ibk', 'stueberl_out'], x: 25, y: 47 },
    { k: 'club', n: 'Club Lawine (Viaduktbögen)', to: ['ibk', 'club_out'], x: 70, y: 65 },
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
      const loc = { hotel: 'hotel', bar: 'bar', stueberl: 'stueberl', club: 'club' }[d.k];
      if (loc) G.S.flags.group = { loc, ids: group, until: G.S.time + 150 };
    }
    const driver = pick(['Der Fahrer erzählt von seinem Cousin in Zürich.', 'Im Radio läuft Schlager, der Fahrer singt mit.', 'Der Fahrer fährt, als wäre er im Ski-Weltcup.', 'Der Fahrer schimpft über die Baustellen am Südring.']);
    await UI.fadeOut(`🚕 ${group.length ? `${cars > 1 ? 'Zwei Taxis' : 'Taxi'} mit ${group.map(fname).join(', ')}` : 'Taxi'} → ${d.n}`);
    await sleep(900);
    UI.els.fadeText.textContent = driver;
    passTime(Math.round(6 + d.dist * 0.15));
    await sleep(1300);
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
    if (m.id === 'zug' && G.S.stage === 'ride') { this._announced = {}; }
  },
  async buy(def, item, cur, opts = {}) {
    if (item.special === 'hair' || item.special === 'beard') {
      if (!pay(cur, item.price)) return;
      UI.closeOverlay();
      await Editor.open({ mode: item.special });
      achieve('frisur');
      return 'close';
    }
    if (item.wear) {
      if (item.unlock && G.S.unlocked[item.unlock]) { Object.assign(G.S.look, item.wear); UI.toast('Angezogen!'); return; }
      if (!pay(cur, item.price)) return;
      if (item.unlock) G.S.unlocked[item.unlock] = 1;
      Object.assign(G.S.look, item.wear);
      G.player.look = G.S.look;
      UI.toast(`${item.n} gekauft und angezogen.`);
      if (tracht()) achieve('tracht');
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
  async vomit() {
    if (G.busy) return;
    G.busy++;
    const p = G.player, st = G.S.st;
    p.pose = 'bend';
    await this.say('me', 'Oh nein… mir wird…');
    Snd.sfx('vomit'); G.fx.shake = 1;
    for (let i = 0; i < 26; i++) addPart({ x: p.x + DIRV[p.dir][0] * 8 + rnd(-3, 3), y: p.y - 10, vx: DIRV[p.dir][0] * 30 + rnd(-20, 20), vy: rnd(10, 40), g: 140, life: 0.9, kind: 'vomit' });
    G.S.vomitSpots.push({ map: G.map.id, x: p.x + DIRV[p.dir][0] * 10, y: p.y + DIRV[p.dir][1] * 6 - 2, t: G.S.time });
    await sleep(900);
    st.nau = 0; st.food = Math.max(0, st.food - 40); st.prom = Math.max(0, st.prom - 0.3); mood(-14); energy(-8);
    G.S.flags.vomitAt = G.S.time;
    achieve('kotzen');
    p.pose = 'stand';
    const near = this.friendsHere();
    if (G.map.id === 'club') { await this.say('Türsteher', 'Raus! Sofort! Du gehst jetzt an die frische Luft.'); G.busy--; await warpTo('ibk', 'club_out'); G.S.flags.clubPaid = -1; return; }
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
    const html = `<div class="panel"><div class="panel-head"><h2>Heimreise nach Luzern</h2><button class="x-btn" data-close aria-label="Schliessen">×</button></div><div class="panel-body">
      <p class="note">Der Railjet rollt aus dem Inntal. ${Object.keys(FRIENDS).length} müde Kollegen, ein voller Bierdeckel und viele Geschichten.</p>
      <div class="statgrid">
        <div class="stat"><small>Bier</small><b>${S2.beers}</b></div><div class="stat"><small>Schnäpse</small><b>${S2.shots}</b></div>
        <div class="stat"><small>Burger</small><b>${S2.burgers}</b></div><div class="stat"><small>Fotos</small><b>${Object.keys(S2.photos).length}/${Object.keys(SIGHTS).length}</b></div>
        <div class="stat"><small>Erlebnisse</small><b>${Object.keys(S2.ach).length}/${Object.keys(ACH).length}</b></div><div class="stat"><small>Jass-Siege</small><b>${S2.rec.jassW}</b></div>
        <div class="stat"><small>Restgeld</small><b>${fmtEur(S2.money.eur)}</b></div><div class="stat"><small>Tage</small><b>${dayOf(S2.time) + 1}</b></div>
      </div>
      <p class="note">${Object.keys(S2.ach).length > 20 ? 'Legendär. Davon werdet ihr noch in zehn Jahren erzählen.' : 'Schöner Ausflug! Aber da geht noch mehr – vielleicht beim nächsten Mal.'}</p>
      </div><div class="panel-foot"><span>Danke fürs Spielen!</span><button class="btn primary" data-close>Weiterspielen</button></div></div>`;
    await new Promise((r) => UI.overlay(html, r));
  },
};
