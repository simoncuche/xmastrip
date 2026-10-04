/* ============ Spielzustand, Werte, Gegenstände ============ */
const DAYS = ['Fr', 'Sa', 'So', 'Mo', 'Di', 'Mi', 'Do']; /* Tag 0 = Freitag, 11. Dezember 2026 */
const START_DATE = { d: 11, m: 12, y: 2026 };
const DAY_NAMES = { Sa: 'Samstag', So: 'Sonntag', Mo: 'Montag', Di: 'Dienstag', Mi: 'Mittwoch', Do: 'Donnerstag', Fr: 'Freitag' };
const MONTH_NAMES = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const G = {
  S: null, map: null, player: null, npcs: [], peds: [], parts: [], birds: [],
  cam: { x: 0, y: 0 }, t: 0, busy: 0, fx: { shake: 0, flash: 0, tint: null }, warned: {}, lastMinute: 0,
};

/* ---- Gegenstände ----
   alc = Promille-Zuwachs, food = Sättigung, en = Energie, mood = Laune, nau = Übelkeit */
const ITEMS = {
  bier: { n: 'Bier (Märzen 0,5 l)', t: 'drink', alc: 0.25, beer: 1, mood: 4, en: -2, icon: 'beer' },
  pils: { n: 'Pils 0,3 l', t: 'drink', alc: 0.15, beer: 1, mood: 3, en: -1, icon: 'beer' },
  weissbier: { n: 'Weissbier 0,5 l', t: 'drink', alc: 0.27, beer: 1, mood: 4, en: -3, food: 4, icon: 'weiss' },
  radler: { n: 'Radler 0,5 l', t: 'drink', alc: 0.12, beer: 1, mood: 3, icon: 'beer' },
  dosenbier: { n: 'Dosenbier', t: 'drink', alc: 0.25, beer: 1, mood: 3, en: -2, icon: 'can', inv: true },
  flaschenbier: { n: 'Flaschenbier', t: 'drink', alc: 0.17, beer: 1, mood: 4, en: -1, icon: 'bottle' },
  sixpack: { n: 'Sixpack', t: 'pack', give: 'dosenbier', count: 6, icon: 'can', inv: true },
  zirben: { n: 'Zirbenschnaps (Stamperl)', t: 'drink', alc: 0.13, mood: 5, en: -2, nau: 3, icon: 'shot' },
  obstler: { n: 'Obstler (Stamperl)', t: 'drink', alc: 0.13, mood: 4, en: -2, nau: 4, icon: 'shot' },
  zirbenflasche: { n: 'Flasche Zirbenschnaps', t: 'drink', alc: 0.13, mood: 5, en: -2, nau: 3, icon: 'shot', inv: true, uses: 6 },
  shot: { n: 'Kräuter-Shot', t: 'drink', alc: 0.12, mood: 6, en: -1, nau: 5, icon: 'shot' },
  schoettli: { n: 'Schöttli (Mini-Fläschli)', t: 'drink', alc: 0.11, mood: 6, en: -1, nau: 4, icon: 'shot', inv: true },
  wodkaE: { n: 'Wodka-Energy', t: 'drink', alc: 0.2, mood: 6, en: 12, nau: 4, icon: 'long' },
  gintonic: { n: 'Gin Tonic', t: 'drink', alc: 0.2, mood: 6, icon: 'long' },
  jagertee: { n: 'Jagertee', t: 'drink', alc: 0.18, mood: 6, en: 2, nau: 2, icon: 'tea' },
  wein: { n: 'Achtel Rotwein', t: 'drink', alc: 0.15, mood: 4, icon: 'wine' },
  cola: { n: 'Cola', t: 'drink', en: 6, mood: 1, icon: 'long' },
  wasser: { n: 'Mineralwasser', t: 'drink', water: 1, nau: -10, icon: 'water', inv: true },
  kaffee: { n: 'Kaffee', t: 'drink', en: 14, nau: -2, icon: 'coffee' },
  melange: { n: 'Wiener Melange', t: 'drink', en: 14, mood: 2, icon: 'coffee' },
  energy: { n: 'Energy-Drink', t: 'drink', en: 25, mood: 1, nau: 2, icon: 'can2', inv: true },
  burger: { n: 'Classic Burger', t: 'food', food: 55, mood: 8, nau: -14, icon: 'burger', burger: 1 },
  cheese: { n: 'Cheeseburger mit Speck', t: 'food', food: 60, mood: 9, nau: -14, icon: 'burger', burger: 1 },
  bbq: { n: 'Gamsbock-BBQ-Burger', t: 'food', food: 70, mood: 11, nau: -16, en: -2, icon: 'burger', burger: 1 },
  ribs: { n: 'Spareribs', t: 'food', food: 70, mood: 10, nau: -14, icon: 'ribs' },
  wings: { n: 'Chicken Wings (scharf)', t: 'food', food: 35, mood: 6, nau: -6, icon: 'wings' },
  pommes: { n: 'Pommes', t: 'food', food: 25, mood: 4, nau: -8, icon: 'fries' },
  nachos: { n: 'Nachos mit Käse', t: 'food', food: 28, mood: 5, nau: -6, icon: 'nachos' },
  schnitzel: { n: 'Wiener Schnitzel mit Pommes', t: 'food', food: 70, mood: 9, nau: -16, icon: 'schnitzel' },
  groestl: { n: 'Tiroler Gröstl mit Spiegelei', t: 'food', food: 65, mood: 9, nau: -18, hang: 1, icon: 'pan' },
  spaetzle: { n: 'Käsespätzle', t: 'food', food: 65, mood: 9, nau: -14, en: -3, icon: 'pan' },
  speckbrett: { n: 'Speckbrettl', t: 'food', food: 35, mood: 6, nau: -8, icon: 'board' },
  knoedel: { n: 'Kaspressknödelsuppe', t: 'food', food: 40, mood: 7, nau: -12, hang: 1, icon: 'soup' },
  kaiserschmarrn: { n: 'Kaiserschmarrn', t: 'food', food: 50, mood: 10, nau: -10, icon: 'schmarrn' },
  strudel: { n: 'Apfelstrudel', t: 'food', food: 25, mood: 7, nau: -5, icon: 'strudel' },
  sacher: { n: 'Sachertorte', t: 'food', food: 25, mood: 7, nau: -4, icon: 'cake' },
  brezel: { n: 'Brezel', t: 'food', food: 15, mood: 2, nau: -6, icon: 'brezel' },
  kaesekrainer: { n: 'Käsekrainer', t: 'food', food: 35, mood: 6, nau: -10, icon: 'wurst' },
  bosna: { n: 'Bosna', t: 'food', food: 35, mood: 6, nau: -10, icon: 'wurst' },
  bratwurst: { n: 'Bratwurst mit Senf', t: 'food', food: 30, mood: 5, nau: -9, icon: 'wurst' },
  gipfeli: { n: 'Gipfeli', t: 'food', food: 15, mood: 3, nau: -5, icon: 'croissant', inv: true },
  butterbrezel: { n: 'Butterbrezel', t: 'food', food: 20, mood: 4, nau: -7, icon: 'brezel', inv: true },
  nussgipfel: { n: 'Nussgipfel', t: 'food', food: 18, mood: 5, nau: -4, icon: 'nussgipfel', inv: true },
  berliner: { n: 'Berliner (Konfitüre)', t: 'food', food: 16, mood: 6, nau: -3, icon: 'berliner', inv: true },
  weggli: { n: 'Weggli', t: 'food', food: 12, mood: 2, nau: -5, icon: 'weggli', inv: true },
  zopf: { n: 'Butterzopf (Stück)', t: 'food', food: 20, mood: 5, nau: -6, icon: 'zopf', inv: true },
  ruchbrot: { n: 'Ruchbrot (ganzer Laib)', t: 'food', food: 40, mood: 3, nau: -12, icon: 'bread', inv: true },
  sandwich: { n: 'Sandwich', t: 'food', food: 30, mood: 3, nau: -8, icon: 'sandwich', inv: true },
  chips: { n: 'Chips', t: 'food', food: 12, mood: 3, icon: 'chips', inv: true },
  banane: { n: 'Banane', t: 'food', food: 12, en: 4, nau: -4, icon: 'banana', inv: true },
  semmel: { n: 'Semmel', t: 'food', food: 10, nau: -3, icon: 'bread', inv: true, bird: 1 },
  speck: { n: 'Tiroler Speck', t: 'food', food: 25, mood: 4, nau: -6, icon: 'speck', inv: true },
  gulasch: { n: 'Gulaschsuppe', t: 'food', food: 40, mood: 6, nau: -12, icon: 'soup' },
  toast: { n: 'Schinken-Käse-Toast', t: 'food', food: 30, mood: 4, nau: -8, icon: 'sandwich' },
  wuerstel: { n: 'Frankfurter mit Senf', t: 'food', food: 28, mood: 4, nau: -8, icon: 'wurst' },
  germknoedel: { n: 'Germknödel', t: 'food', food: 50, mood: 9, nau: -10, icon: 'schmarrn' },
  erdnuesse: { n: 'Erdnüsse', t: 'food', food: 8, mood: 1, icon: 'chips' },
  schoko: { n: 'Schokolade', t: 'food', food: 10, mood: 4, en: 3, icon: 'choco', inv: true },
  aspirin: { n: 'Kopfwehtabletten', t: 'med', hang: 2, nau: -10, icon: 'pill', inv: true },
  magen: { n: 'Magentropfen', t: 'med', nau: -45, icon: 'pill', inv: true },
  elektrolyt: { n: 'Elektrolyt-Brausetabletten', t: 'med', en: 8, nau: -15, hang: 1, icon: 'pill', inv: true },
  zigaretten: { n: 'Zigaretten (Packung)', t: 'smoke', icon: 'cig', inv: true, uses: 20 },
  feuerzeug: { n: 'Feuerzeug', t: 'tool', icon: 'lighter', inv: true },
  zeitung: { n: 'Tiroler Tageszeitung', t: 'read', icon: 'paper', inv: true },
  schneekugel: { n: 'Schneekugel Goldenes Dachl', t: 'souv', icon: 'globe', inv: true },
  magnet: { n: 'Kühlschrank-Magnet', t: 'souv', icon: 'magnet', inv: true },
  postkarte: { n: 'Postkarte Nordkette', t: 'souv', icon: 'card', inv: true },
  edelweiss: { n: 'Edelweiss-Anstecker', t: 'souv', icon: 'flower', inv: true },
  muenze: { n: 'Glücksmünze', t: 'souv', icon: 'coin', inv: true },
  billett: { n: 'Gruppenbillett Luzern–Innsbruck', t: 'ticket', icon: 'ticket', inv: true },
  taxiticket: { n: 'Taxi-Ticket Luzern → Innsbruck', t: 'ticket', icon: 'ticket', inv: true },
  pong: { n: 'Bierpong-Becher', t: 'drink', alc: 0.09, mood: 3, en: -1, icon: 'beer' },
  kondom: { n: 'Kondome (3er-Pack)', t: 'tool', icon: 'kondom', inv: true, uses: 3 },
  meteorit: { n: 'Leuchtender Stein vom Alien', t: 'souv', icon: 'globe', inv: true },
};

/* ---- Sehenswürdigkeiten (echte Fakten) ---- */
const SIGHTS = {
  torbogen: { n: 'Torbogen, Bahnhof Luzern', f: 'Der Torbogen auf dem Bahnhofplatz ist ein Rest des alten Luzerner Bahnhofs, der 1971 abbrannte. Er wurde stehen gelassen und ist heute Treffpunkt.' },
  kapellbruecke: { n: 'Kapellbrücke Luzern', f: 'Eine der ältesten gedeckten Holzbrücken Europas (14. Jahrhundert). 1993 brannte ein grosser Teil ab und wurde wieder aufgebaut.' },
  dachl: { n: 'Goldenes Dachl', f: 'Um 1500 für Kaiser Maximilian I. gebaut. Das Prunkerker-Dach trägt 2.657 feuervergoldete Kupferschindeln.' },
  stadtturm: { n: 'Stadtturm', f: 'Fertiggestellt 1450, 51 m hoch. Die Aussichtsplattform liegt auf 31 m, erreichbar über 133 Stufen.' },
  annasaeule: { n: 'Annasäule', f: 'Erinnert an den Abzug der bayerischen Truppen am Annatag, dem 26. Juli 1703, mitten in der Maria-Theresien-Strasse.' },
  triumphpforte: { n: 'Triumphpforte', f: 'Entstand 1765 zur Hochzeit von Erzherzog Leopold. Weil Kaiser Franz I. Stephan während der Feiern starb, zeigt eine Seite Trauermotive.' },
  hofburg: { n: 'Hofburg', f: 'Ehemalige Residenz der Habsburger in Tirol. Ihr heutiges Aussehen bekam sie im 18. Jahrhundert unter Maria Theresia.' },
  dom: { n: 'Dom St. Jakob', f: 'Barocker Dom (1717–1724). Am Hochaltar hängt das Gnadenbild „Mariahilf“ von Lucas Cranach dem Älteren.' },
  leopold: { n: 'Leopoldsbrunnen', f: 'Der Brunnen trägt die Reiterstatue von Erzherzog Leopold V. auf einem sich aufbäumenden Pferd, gegossen im 17. Jahrhundert.' },
  mariahilf: { n: 'Bunte Häuser am Inn', f: 'Die farbigen Häuserzeilen von Mariahilf und St. Nikolaus am Nordufer des Inn sind eines der bekanntesten Fotomotive der Stadt.' },
  innbruecke: { n: 'Innbrücke', f: 'Die Brücke über den Inn gab der Stadt ihren Namen: Innsbruck.' },
  bogen: { n: 'Viaduktbögen', f: 'In den Bögen des Eisenbahnviadukts haben sich Bars und Clubs eingerichtet – die „Bogenmeile“.' },
  bergisel: { n: 'Bergiselschanze', f: 'Die Sprungschanze von Zaha Hadid wurde 2002 eröffnet. Der rund 50 Meter hohe Turm trägt Café und Aussichtsplattform. Hier war 1964 und 1976 Olympia, und jedes Jahr Anfang Januar springt die Vierschanzentournee: K-Punkt 120 Meter, Schanzenrekord 138 Meter.' },
  seegrube: { n: 'Seegrube, Nordkette', f: 'Die Seegrube liegt auf 1.905 m. Von der Congress-Station geht es mit Hungerburgbahn und Seegrubenbahn in etwa 20 Minuten hinauf.' },
  hofgarten: { n: 'Hofgarten', f: 'Der ehemalige kaiserliche Garten neben der Hofburg ist heute ein öffentlicher Park mitten in der Stadt.' },
};

/* ---- Erlebnisse ---- */
const ACH = {
  zug: ['Pünktlich', 'Den Zug in Luzern erwischt'],
  billett: ['Reiseleiter', 'Das Gruppenbillett rechtzeitig gekauft'],
  nachzuegler: ['Nachzügler', 'Einer kam mit dem Taxi nach Innsbruck'],
  jass: ['Jass-König', 'Eine Jass-Runde gewonnen'],
  match: ['Match!', 'Alle neun Stiche in einer Runde geholt'],
  checkin: ['Eingecheckt', 'Im Hotel Zirbe eingecheckt'],
  ersteRunde: ['Prost!', 'Das erste Bier in Innsbruck'],
  burger: ['Burger-Boss', 'Einen Burger verdrückt'],
  brunnen: ['Brunnenbad', 'Im Leopoldsbrunnen gebadet'],
  mandat: ['Organmandat', 'Beim Baden erwischt worden'],
  tauben: ['Taubenflüsterer', 'Die Tauben gefüttert'],
  tanz: ['Tanzbär', 'Auf der Tanzfläche über 80 % geholt'],
  bull: ['Bullseye', 'Beim Darts ins Bull getroffen'],
  darts: ['Pfeilschnell', 'Ein Darts-Duell gewonnen'],
  arm: ['Stahlarm', 'Beim Armdrücken gewonnen'],
  nagel: ['Nagelprofi', 'Beim Nageln im Stüberl gewonnen'],
  seegrube: ['Gipfelstürmer', 'Mit der Bahn auf die Seegrube'],
  bergisel: ['Bergisel', 'Mit der Tram zur Sprungschanze gefahren'],
  springer: ['Adlerflug', 'Von der Bergiselschanze gesprungen'],
  kpunkt: ['K-Punkt', 'Am Bergisel über 120 Meter gesprungen'],
  rekord: ['Schanzenrekord', 'Am Bergisel weiter als 138 Meter geflogen'],
  kostuem: ['Maskerade', 'Im Kostüm durch Innsbruck'],
  apokalypse: ['Last Exit Innsbruck', 'Der Apokalypse im letzten Zug entkommen'],
  trittsicher: ['Trittsicher', 'Bei der Apokalypse nie in einen Riss gestürzt'],
  knipser: ['Knipser', 'Einen Schnappschuss gemacht'],
  influencer: ['Influencer', 'Ein Foto aus dem Spiel geteilt'],
  schuettler: ['Schüttelfrost', 'Das Handy geschüttelt und ein Ereignis heraufbeschworen'],
  rauferei: ['Wirtshausrauferei', 'Im Stüberl Holzknecht Ferdl umgehauen'],
  veilchen: ['Veilchen', 'Eine Wirtshausrauferei verloren'],
  museum: ['Kulturbanause', 'Im Tirol Panorama das Riesenrundgemälde gesehen'],
  sturz: ['Bauchlandung', 'Beim Skispringen gestürzt – und überlebt'],
  turm: ['Turmblick', 'Auf den Stadtturm gestiegen'],
  fotos: ['Fotograf', 'Alle Sehenswürdigkeiten fotografiert'],
  tracht: ['Trachtler', 'In voller Tracht unterwegs'],
  strich: ['Bierdeckel voll', '10 Bier auf der Strichliste'],
  kotzen: ['Ups…', 'Sich übergeben müssen'],
  filmriss: ['Filmriss', 'Komplett abgestürzt'],
  flitzer: ['Flitzer', 'Einen Stein 8-mal springen lassen'],
  runde: ['Spendabel', 'Eine Runde für alle bezahlt'],
  club: ['Drin!', 'Am Türsteher vorbeigekommen'],
  rauch: ['Rauchpause', 'Im Raucherraum eine geraucht'],
  kater: ['Kater besiegt', 'Einen Kater kuriert'],
  musik: ['Mäzen', 'Dem Strassenmusiker etwas gegeben'],
  jodel: ['Juchizer', 'Auf der Seegrube gejodelt'],
  frisur: ['Neuer Look', 'Beim Barbier gewesen'],
  glatze: ['Blank', 'Beim Barbier eine Glatze rasieren lassen'],
  dusche: ['Frisch gemacht', 'Im Hotel geduscht'],
  rouge: ['Rotlicht', 'Im Rouge in den Viaduktbögen gewesen'],
  champagner: ['Grosszügig', 'Im Rouge eine Flasche für die Bühne spendiert'],
  verraucht: ['Zug verraucht', 'Den Zug in Luzern beim Rauchen verpasst'],
  flitzer: ['Flitzer-Alarm', 'Didu und Römu nackt durch die Gassen rennen sehen'],
  fussball: ['Stammtisch-Experte', 'Mit Hakan Yakin und Xherdan Shaqiri über Fussball diskutiert'],
  schoettli: ['Schöttli-Rundi', 'Im Railjet eine Schöttli-Runde gekippt'],
  abgefuellt: ['Abgefüllt', 'Einen Kollegen bis zum Übergeben abgefüllt'],
  ueberfall: ['Nachtschatten', 'Einen nächtlichen Überfall überstanden'],
  polizei: ['Sorry, eh!', 'Zugeschaut, wie die Polizei Ölu abführt'],
  tierfilm: ['Tierfilm', 'Hund gegen Katze auf dem Platz erlebt'],
  taube: ['Glücksbringer', 'Von einer Taube getroffen – soll Glück bringen'],
  krampus: ['Krampuslauf', 'Dem Krampus in der Altstadt begegnet'],
  ehrlich: ['Ehrliche Haut', 'Ein gefundenes Portemonnaie abgegeben'],
  alien: ['Erster Kontakt', 'Ein Alien in Innsbruck getroffen'],
  trump: ['Tremendous', 'Donald Trump samt Entourage begegnet'],
  verfolgung: ['Sprinter', 'Den Taschendieb bei der Verfolgungsjagd erwischt'],
  monster: ['Überlebt', 'Godzilla entkommen – nicht erwischt, Atomstrahl ausgewichen'],
  platt: ['Plattgetreten', 'Von Godzilla erwischt und im Spital gelandet'],
  casino: ['Spieler', 'Im Casino Innsbruck gewesen'],
  jackpot: ['Plein!', 'Beim Roulette die richtige Zahl getroffen'],
  blackjack: ['Siebzehn und vier', 'Beim Blackjack gegen die Bank gewonnen'],
  heimreise: ['Heimreise', 'Mit dem Zug zurück nach Luzern – das Spiel ist beendet'],
  bierpong: ['Pong-König', 'Beim Bierpong gegen einen Kollegen gewonnen'],
  gummi: ['Safer Sex', 'Bei Jessy in den Bögen – mit Gummi, versteht sich'],
};

function newState(look, name) {
  return {
    v: 4, name: name || 'Simon', look, unlocked: {},
    time: 8 * 60 + 38, map: 'luzern', x: 0, y: 0, dir: 3,
    stage: 'meet', flags: { met: {} },
    st: { energy: 88, food: 62, mood: 72, prom: 0, nau: 0, wet: 0, smell: 0, hang: 0 },
    money: { eur: 260, chf: 60 }, cashToday: 0,
    inv: { wasser: 1 }, uses: {}, photos: {}, ach: {},
    beers: 0, shots: 0, burgers: 0, lastSleep: 8 * 60 - 60 * 1.5, lastFood: 7 * 60 + 30,
    aff: { reto: 50, luca: 50, jonas: 50, marco: 50, domi: 50 },
    rec: { jassW: 0, jassL: 0, darts: 0, dance: 0, stone: 0 },
    vomitSpots: [],
  };
}
const S = () => G.S;
const minutesAwake = () => G.S.time - G.S.lastSleep;
const dayOf = (t) => Math.floor(t / 1440);
const hourOf = (t) => (t % 1440) / 60;
function clockStr(t = G.S.time) { const m = Math.floor(t) % 1440; return pad2(Math.floor(m / 60)) + ':' + pad2(m % 60); }
function dayStr(t = G.S.time) { return DAYS[dayOf(t) % 7]; }
function calDate(t = G.S.time) { const dt = new Date(START_DATE.y, START_DATE.m - 1, START_DATE.d + dayOf(t)); return { d: dt.getDate(), m: dt.getMonth() + 1, y: dt.getFullYear() }; }
function dateStr(t = G.S.time) { const c = calDate(t); return `${dayStr(t)} ${c.d}.${c.m}.${c.y}`; }
function dateLong(t = G.S.time) { const c = calDate(t); return `${DAY_NAMES[dayStr(t)]}, ${c.d}. ${MONTH_NAMES[c.m - 1]} ${c.y}`; }
function isNight(t = G.S.time) { const h = hourOf(t); return h >= 20 || h < 6.5; }

function addMoney(cur, v) { G.S.money[cur] = Math.round((G.S.money[cur] + v) * 100) / 100; UI.hud(); }
function canPay(cur, v) { return G.S.money[cur] + 1e-6 >= v; }
function pay(cur, v) { if (!canPay(cur, v)) return false; addMoney(cur, -v); Snd.sfx('coin'); return true; }
function addInv(id, n = 1) { G.S.inv[id] = (G.S.inv[id] || 0) + n; if (ITEMS[id] && ITEMS[id].uses && !G.S.uses[id]) G.S.uses[id] = ITEMS[id].uses; }
function hasInv(id) { return (G.S.inv[id] || 0) > 0; }
/* Einen Gebrauch verbrauchen (Zigaretten, Kondome …); ohne Gebrauchszähler wird das Stück entfernt */
function takeUse(id) { if (!hasInv(id)) return false; const I = ITEMS[id]; if (I && I.uses) { G.S.uses[id] = (G.S.uses[id] || I.uses) - 1; if (G.S.uses[id] <= 0) { takeInv(id); delete G.S.uses[id]; } return true; } return takeInv(id); }
function takeInv(id, n = 1) { if (!hasInv(id)) return false; G.S.inv[id] -= n; if (G.S.inv[id] <= 0) delete G.S.inv[id]; return true; }

function achieve(id) {
  if (!ACH[id] || G.S.ach[id]) return;
  G.S.ach[id] = G.S.time;
  Track.event('ach', ACH[id][0]);
  Snd.sfx('win');
  UI.toast(`<b>Erlebnis:</b> ${ACH[id][0]}`, 'ach');
}
function addPhoto(id) {
  if (G.S.photos[id]) { UI.toast('Davon hast du schon ein Foto.'); return false; }
  G.S.photos[id] = G.S.time;
  Snd.sfx('shutter');
  G.fx.flash = 1;
  UI.toast(`📷 Foto: <b>${SIGHTS[id].n}</b>`);
  const all = Object.keys(SIGHTS).length;
  if (Object.keys(G.S.photos).length >= all) achieve('fotos');
  mood(3);
  return true;
}
function mood(v) { G.S.st.mood = clamp(G.S.st.mood + v, 0, 100); }
function energy(v) { G.S.st.energy = clamp(G.S.st.energy + v, 0, 100); }

/* Essen und Trinken */
function consume(id, opts = {}) {
  const it = ITEMS[id];
  const st = G.S.st;
  if (!it) return;
  if (it.alc) {
    const stomach = st.food > 55 ? 0.82 : st.food < 20 ? 1.22 : 1;
    st.prom = Math.min(4, st.prom + it.alc * stomach);
    const units = it.alc / 0.25;
    let n = 8 * units;
    if (st.food < 30) n += 10 * units;
    if (minutesAwake() > 14 * 60) n += 8 * units;
    if (st.prom > 1.4) n += 7 * units;
    if (st.food > 60) n -= 4 * units;
    st.nau = clamp(st.nau + Math.max(2, n) + (it.nau || 0), 0, 140);
    if (it.beer) { G.S.beers++; if (G.S.beers >= 10) achieve('strich'); if (G.map && G.map.city === 'ibk') achieve('ersteRunde'); }
    else G.S.shots++;
    if (st.prom < 1.8) mood(it.mood || 3); else mood(-1);
    energy(it.en || 0);
    Snd.sfx(it.icon === 'shot' ? 'gulp' : 'gulp');
  } else {
    if (it.food) { st.food = clamp(st.food + it.food, 0, 100); G.S.lastFood = G.S.time; Snd.sfx('eat'); }
    else Snd.sfx('gulp');
    if (it.nau) st.nau = clamp(st.nau + it.nau, 0, 140);
    if (it.en) energy(it.en);
    if (it.mood) mood(it.mood);
    if (it.water) { st.prom = Math.max(0, st.prom - 0.04); st.hang = Math.max(0, st.hang - 15); }
    if (it.hang && st.hang > 0) { st.hang = Math.max(0, st.hang - 40 * it.hang); if (st.hang <= 0) { achieve('kater'); UI.toast('Der Kater ist weg!'); } }
    if (it.burger) { G.S.burgers++; achieve('burger'); }
  }
  if (!opts.silent) checkThresholds();
}

/* Werte pro Spielminute fortschreiben */
function tickStats(dm) {
  const st = G.S.st;
  const awakeH = minutesAwake() / 60;
  let enDrain = 4 / 60 + Math.max(0, st.prom - 0.8) * 2.2 / 60 + (awakeH > 16 ? 2 / 60 : 0);
  if (G.player && G.player.running) enDrain += 3 / 60;
  st.energy = clamp(st.energy - enDrain * dm, 0, 100);
  st.food = clamp(st.food - (6 / 60) * dm, 0, 100);
  st.prom = Math.max(0, st.prom - (0.15 / 60) * dm);
  let nauRate = -10 / 60;
  if (st.food < 15 && st.prom > 0.8) nauRate = 4 / 60;
  if (awakeH > 18 && st.prom > 1) nauRate += 3 / 60;
  st.nau = clamp(st.nau + nauRate * dm, 0, 140);
  if (st.food < 20) mood(-2 / 60 * dm);
  if (st.energy < 20) mood(-2 / 60 * dm);
  if (st.hang > 0) { st.hang = Math.max(0, st.hang - dm * 0.5); mood(-1.2 / 60 * dm); }
  if (st.wet > 0) st.wet = Math.max(0, st.wet - dm);
  if (st.smell > 0) st.smell = Math.max(0, st.smell - dm * 0.5);
  /* Pegel der Kollegen baut sich wie beim Spieler ab */
  if (G.S.fprom) for (const k of Object.keys(G.S.fprom)) G.S.fprom[k] = Math.max(0, G.S.fprom[k] - (0.15 / 60) * dm);
  checkThresholds();
}
function warnOnce(key, cond, msg, reset) {
  if (cond && !G.warned[key]) { G.warned[key] = 1; UI.toast(msg, 'warn'); }
  if (reset && G.warned[key]) G.warned[key] = 0;
}
function checkThresholds() {
  const st = G.S.st;
  if (G.S.flags.adrenalin) return; /* Flucht vor der Apokalypse: keine Müdigkeits- oder Übelkeitshinweise */
  warnOnce('hunger', st.food < 18, 'Dein Magen knurrt. Zeit für einen Burger?', st.food > 35);
  warnOnce('tired', st.energy < 22, 'Du bist müde. Leg dich im Hotelzimmer kurz hin.', st.energy > 40);
  warnOnce('nau1', st.nau > 60, 'Dir ist flau im Magen …', st.nau < 40);
  warnOnce('nau2', st.nau > 85, 'Dir wird richtig übel! Iss etwas oder geh schlafen.', st.nau < 70);
  warnOnce('prom1', st.prom > 1.2, 'Die Welt fängt an zu schwanken.', st.prom < 0.9);
  warnOnce('prom2', st.prom > 2.0, 'Du siehst doppelt. Vielleicht ein Wasser?', st.prom < 1.7);
  if (st.energy > 40) G.warned.tiredCrit = 0;
  if (!G.busy && Story.ready && !G.S.flags.adrenalin) { /* während der Flucht vor der Apokalypse: Adrenalin, kein Kollaps */
    if (st.nau >= 100) Story.vomit();
    else if (st.prom >= 2.6) Story.blackout();
    else if (st.energy <= 7 && !G.warned.tiredCrit) Story.tiredWarning();
    else if (st.energy <= 0) Story.collapse();
  }
}
function promStr(v = G.S.st.prom) { return v.toFixed(2).replace('.', ',') + ' ‰'; }

/* ---- Speichern ---- */
const SAVE_KEY = 'gleis4-innsbruck-v4';
function saveGame(silent) {
  if (!G.S || !G.player) return;
  G.S.map = G.map.id; G.S.x = Math.round(G.player.x); G.S.y = Math.round(G.player.y); G.S.dir = G.player.dir;
  Track.send('save');
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(G.S)); if (!silent) UI.toast('Spielstand gespeichert.'); return true; }
  catch (e) { if (!silent) UI.toast('Speichern ist in diesem Browser nicht möglich.', 'warn'); return false; }
}
function loadSave() {
  try { const s = localStorage.getItem(SAVE_KEY); if (!s) return null; const o = JSON.parse(s); if (o && o.look && o.look.costume == null) o.look.costume = 0; return o && o.v === 4 ? o : null; } catch (e) { return null; }
}
function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }
