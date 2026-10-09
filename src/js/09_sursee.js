/* ============ Kapitel 2: Sursee – „Gans oder gar nicht“ ============
   Nach der Heimreise aus Innsbruck geht das Spiel in Luzern weiter: Gleis 2, S-Bahn nach Sursee. Dort ist die goldene
   Sonnenmaske der Zunft Heini von Uri verschwunden, die Gansabhauet vom Martinstag musste ausfallen und wird jetzt im
   Dezember mit einer Chilbi nachgeholt – wenn die Maske rechtzeitig auftaucht. Der Spieler löst den Fall, frei in der
   offenen Welt, aber mit einem klaren nächsten Ziel. Zustand in G.S.su, Stufen in STAGES (ab 'heim'). */

const SU_STAGES = ['heim', 'sbahn', 's_ankunft', 's_tatort', 's_faehrten', 's_strahl', 's_probe', 's_boot', 's_gans', 's_frei'];
STAGES.push(...SU_STAGES);
const suAt = (s) => STAGES.indexOf(G.S.stage) >= STAGES.indexOf(s);
const SU_MAPS = ['sursee', 'sursee_see', 'inseli'];

/* ---- Leute in Sursee (erfunden bis auf die Familie: Isa mit Elin und Timo, Cousin Thierry und Cousine Louve) ---- */
const SU_P = {
  isa: { name: 'Isa', bg: '#5a2a4a', look: { skin: 1, build: 0, height: 1, head: 0, ears: 1, hair: 10, hairCol: 2, eyes: 1, eyeCol: 3, brows: 2, nose: 0, mouth: 4, beard: 0, beardCol: 0, mark: 0, glasses: 0, jewel: 4, hat: 0, hatCol: 0, top: 4, topCol: 7, print: 0, pants: 0, pantsCol: 2, shoes: 1, shoesCol: 2, acc: 2, costume: 0 } },
  elin: { name: 'Elin', bg: '#6a3a6a', look: { skin: 1, build: 0, height: 1, head: 4, ears: 1, hair: 10, hairCol: 4, eyes: 1, eyeCol: 5, brows: 2, nose: 6, mouth: 0, beard: 0, beardCol: 0, mark: 1, glasses: 0, jewel: 1, hat: 3, hatCol: 1, top: 3, topCol: 12, print: 0, pants: 0, pantsCol: 1, shoes: 0, shoesCol: 0, acc: 1, costume: 0, kid: 1 } },
  timo: { name: 'Timo', bg: '#2a4a6a', look: { skin: 1, build: 1, height: 1, head: 1, ears: 2, hair: 2, hairCol: 4, eyes: 6, eyeCol: 5, brows: 0, nose: 6, mouth: 2, beard: 0, beardCol: 0, mark: 1, glasses: 0, jewel: 0, hat: 0, hatCol: 0, top: 10, topCol: 9, print: 0, pants: 4, pantsCol: 3, shoes: 5, shoesCol: 9, acc: 0, costume: 0, kid: 1 } },
  thierry: { name: 'Thierry', bg: '#3a5a2a', look: { skin: 1, build: 1, height: 1, head: 1, ears: 2, hair: 7, hairCol: 2, eyes: 1, eyeCol: 0, brows: 0, nose: 6, mouth: 6, beard: 0, beardCol: 0, mark: 5, glasses: 0, jewel: 0, hat: 1, hatCol: 2, top: 6, topCol: 0, print: 3, pants: 3, pantsCol: 0, shoes: 0, shoesCol: 4, acc: 0, costume: 0, kid: 2 } },
  louve: { name: 'Louve', bg: '#6a5a2a', look: { skin: 1, build: 0, height: 1, head: 4, ears: 1, hair: 16, hairCol: 5, eyes: 1, eyeCol: 6, brows: 2, nose: 0, mouth: 0, beard: 0, beardCol: 0, mark: 5, glasses: 0, jewel: 0, hat: 0, hatCol: 0, top: 4, topCol: 4, print: 0, pants: 1, pantsCol: 11, shoes: 1, shoesCol: 4, acc: 1, costume: 0, kid: 2 } },
  heinivater: { name: 'Heinivater', bg: '#7a6a1a', look: { skin: 2, build: 3, height: 1, head: 1, ears: 3, hair: 12, hairCol: 9, eyes: 4, eyeCol: 5, brows: 1, nose: 4, mouth: 0, beard: 6, beardCol: 9, mark: 5, glasses: 7, jewel: 0, hat: 8, hatCol: 1, top: 9, topCol: 0, print: 0, pants: 5, pantsCol: 2, shoes: 3, shoesCol: 1, acc: 2, costume: 0 } },
  pfister: { name: 'Ruedi Pfister', bg: '#4a3a2a', look: { skin: 3, build: 3, height: 2, head: 2, ears: 2, hair: 12, hairCol: 3, eyes: 4, eyeCol: 7, brows: 1, nose: 4, mouth: 5, beard: 2, beardCol: 3, mark: 7, glasses: 0, jewel: 0, hat: 0, hatCol: 0, top: 7, topCol: 0, print: 0, pants: 2, pantsCol: 7, shoes: 1, shoesCol: 2, acc: 0, costume: 0 } },
  roli: { name: 'Roli Rüttimann', bg: '#2a3a6a', look: { skin: 4, build: 2, height: 2, head: 2, ears: 0, hair: 4, hairCol: 0, eyes: 2, eyeCol: 1, brows: 3, nose: 1, mouth: 2, beard: 4, beardCol: 0, mark: 2, glasses: 4, jewel: 2, hat: 2, hatCol: 0, top: 8, topCol: 16, print: 0, pants: 0, pantsCol: 2, shoes: 1, shoesCol: 1, acc: 3, costume: 0 } },
  narr: { name: 'Heini, der Narr', bg: '#7a5a1a', look: { skin: 2, build: 0, height: 1, head: 3, ears: 2, hair: 7, hairCol: 7, eyes: 1, eyeCol: 3, brows: 4, nose: 3, mouth: 2, beard: 0, beardCol: 0, mark: 5, glasses: 0, jewel: 3, hat: 0, hatCol: 0, top: 4, topCol: 4, print: 1, pants: 4, pantsCol: 11, shoes: 4, shoesCol: 4, acc: 0, costume: 0 } },
  riesenrad: { name: 'Riesenrad-Frau Nelly', bg: '#5a2a5a', look: { skin: 2, build: 1, height: 1, head: 0, ears: 0, hair: 9, hairCol: 13, eyes: 1, eyeCol: 0, brows: 2, nose: 0, mouth: 4, beard: 0, beardCol: 0, mark: 0, glasses: 1, jewel: 4, hat: 0, hatCol: 0, top: 3, topCol: 11, print: 0, pants: 0, pantsCol: 2, shoes: 0, shoesCol: 0, acc: 5, costume: 0 } },
};
SU_P.lejan = { name: 'Lejan', bg: '#4a6a2a', look: Object.assign({}, SU_P.timo.look, { hair: 6, hairCol: 1, skin: 2, topCol: 3, kid: 2 }) };
const suP = (k) => SU_P[k];
/* Elin und Timo sagen nur zu Cuche „Papi“ – alle anderen sprechen sie mit dem Namen an */
const kidCall = () => (G.S.pid === 'cuche' ? 'Papi' : G.S.name);
const kidText = (k, text) => (k !== 'elin' && k !== 'timo' || G.S.pid === 'cuche' ? text : String(text).replace(/\bPAPI\b/g, G.S.name.toUpperCase()).replace(/\bPapi\b/g, G.S.name));
const sayP = (k, text) => UI.say(SU_P[k], kidText(k, text));
/* Elin und Timo: vor Ort, wenn sie dich begleiten – sonst per Handy */
const kidSay = (k, text) => (Sur.followOk() ? UI.say(SU_P[k], kidText(k, text)) : UI.say(SU_P[k], '📱 ' + kidText(k, text)));
const askP = (k, text, opts) => UI.ask(SU_P[k], kidText(k, text), opts);
/* Wer begleitet als „Papi“? Cuche – oder Lexx, wenn man Cuche spielt */
/* S-Bahn Luzern (Flirt): weisser Wagenkasten, rote Türen, rotes Band – für die Tür-Szenen */
const SBAHN_LOOK = { body: '#eeece6', top: '#b8bcc4', band: '#d8302a', doorCol: '#d8302a' };
const playerIsCuche = () => G.S.pid === 'cuche';
const suPapi = () => (playerIsCuche() ? (FRIENDS.lexx ? 'lexx' : who('kassier')) : 'cuche');

/* ---- Sehenswürdigkeiten in Sursee (eigene Fotoreihe, getrennt von Innsbruck) ---- */
const SIGHTS_SU = {
  untertor: { n: 'Untertor, Sursee', f: 'Das einzige erhaltene Stadttor von Sursee, auch Baslertor genannt: ein weisser Turm mit hohem Dach, 1674 von Meister Thomas Martin aus Beromünster anstelle eines mittelalterlichen Vorgängers gebaut.' },
  rathaus_sursee: { n: 'Rathaus Sursee', f: 'Erbaut 1539 bis 1546, einer der bedeutendsten spätgotischen Profanbauten der Schweiz: Treppengiebel, eine Sonnenuhr am Giebel und zwei in den Bau integrierte Türme. Vor dem Rathaus findet am Martinstag die Gansabhauet statt.' },
  stgeorg: { n: 'Stadtkirche St. Georg', f: '1638 bis 1641 nach Plänen von Jakob Berger gebaut, der zuvor an der Hofkirche Luzern mitgearbeitet hatte. Seit 1726 trägt der Turm eine welsche Haube.' },
  diebenturm: { n: 'Diebenturm', f: '1681 als Gefängnis- und Pulverturm gebaut, mit steilem Ziegeldach. Im angebauten oberen Waschhaus hat die Zunft Heini von Uri im ersten Stock ihre Zunftstube.' },
  marienbrunnen: { n: 'Marienbrunnen', f: 'Ein Brunnen an dieser Stelle ist 1596 erstmals erwähnt. Säule und Marienfigur schuf Meister Hans Spichtig 1688 im Auftrag des Surseer Rats.' },
  heinibrunnen: { n: 'Heinibrunnen', f: '1975 wurde vor dem Rathaus wieder ein Brunnen gebaut und 1979 mit einer Figur des Heini von Uri von Bildhauer August Bläsi versehen. Seit 2001 steht er am Vierherrenplatz.' },
  murihof: { n: 'Murihof', f: 'Einst Stadtburg der Kyburger und Habsburger, seit Ende des 14. Jahrhunderts Hof des Klosters Muri und das älteste Steingebäude der Altstadt. 1785 bis 1787 spätbarock umgebaut.' },
  sankturbanhof: { n: 'Sankturbanhof', f: 'Der ehemalige Hof des Klosters St. Urban an der Theaterstrasse, gebaut 1596 bis 1598. Heute Museum mit Kunst und Stadtgeschichte.' },
  unterstadt: { n: 'Sure in der Unterstadt', f: 'Durch die Unterstadt fliesst die Sure offen zwischen den Häusern. Nach dem letzten grossen Stadtbrand von 1734 wurde die Altstadt barock wieder aufgebaut.' },
  ehretpark: { n: 'Ehret-Park', f: 'Der Park liegt unterhalb der Unterstadt, auf der anderen Seite der Stadtmauer, an der Sure.' },
  triechter: { n: 'Triechter', f: 'Der Triechter ist die trichterförmige Bucht am Nordende des Sempachersees mit Quai, Promenade und Strandbad.' },
  gammainseli: { n: 'Gamma-Inseli', f: 'Eine echte kleine Insel von 184 m² mit hohen Bäumen. Sie entstand, als der See zwischen 1806 und 1814 abgesenkt wurde, und war schon in der Jungsteinzeit bewohnt.' },
};

/* ---- Erlebnisse ---- */
Object.assign(ACH, {
  su_sbahn: ['Seeblick', 'Mit der S-Bahn dem Sempachersee entlang nach Sursee'],
  su_spuren: ['Spürnase', 'Alle drei Spuren in der Zunftstube gefunden'],
  su_faehrten: ['Fährtenleser', 'Allen drei Fährten gefolgt'],
  su_velo: ['Velo-Kurier', 'Den Flüchtigen auf dem Velo nicht verloren'],
  su_boot: ['Kapitän', 'Die Bootsjagd zum Gamma-Inseli gewonnen'],
  su_maske: ['Die Sonne geht auf', 'Die goldene Sonnenmaske gefunden'],
  su_anklage: ['Plädoyer', 'Den Dieb mit drei Beweisen überführt'],
  su_gans: ['Gansabhauer', 'An der Gansabhauet die Gans mit einem Hieb heruntergeholt'],
  su_zunft: ['Ehrenzünftler', 'Von der Zunft Heini von Uri geehrt'],
  su_fisch: ['Petri Heil', 'Einen Felchen aus dem Sempachersee gezogen'],
  su_hecht: ['Hecht im See', 'Einen Hecht gefangen'],
  su_riesenrad: ['Überblick', 'Mit dem Riesenrad über Sursee gefahren'],
  su_achterbahn: ['Looping', 'Achterbahn an der Chilbi gefahren'],
  su_lukas: ['Glocke!', 'Beim Hau den Lukas die Glocke getroffen'],
  su_schiess: ['Scharfschütze', 'An der Schiessbude einen Preis gewonnen'],
  su_konzert: ['Mitgesungen', 'Am Konzert in der Stadthalle mitgemacht'],
  su_guugge: ['Schränzer', 'Mit der Guuggenmusig mitgespielt'],
  su_roemer: ['Archäologe', 'Alle fünf Römermünzen gefunden'],
  su_narr: ['Narrenfreiheit', 'Fünf Rätsel von Heini, dem Narren, gelöst'],
  su_sprung: ['Winterschwimmer', 'Im Dezember vom Sprungturm ins Strandbad gesprungen'],
  su_sup: ['Stehpaddler', 'Auf dem Stand-up-Paddle trocken geblieben'],
  su_pedalo: ['Pedalo-Profi', 'Mit dem Pedalo ums Gamma-Inseli'],
  su_kinder: ['Kinderspiele', 'Sackgumpe, Chäszänne oder Stangechlädere gewonnen'],
  su_118: ['Kellerkonzert', 'Im Kulturwerk 118 auf der Bühne gestanden'],
  su_kloster: ['Klostergeheimnis', 'Im Kapuzinerkloster etwas Verstecktes gefunden'],
  su_rechnen: ['Zweitklass-Profi', 'Mit Elin drei Rechnungen bis 20 richtig gelöst'],
  su_kita: ['Besuch in der Villa Luna', 'Mit Timo seinen Freund Lejan in der Kita Villa Luna besucht'],
  su_bauer: ['Landmaschinen-Profi', 'Thierrys Bauernhof-Quiz bestanden'],
  su_poller: ['Klonk!', 'Live dabei, als einer in den Poller beim Untertor gefahren ist'],
  su_feuer: ['Held von der Unterstadt', 'Mit der Feuerwehr Sursee einen Brand gelöscht und Frau Wüest gerettet'],
  su_fotos: ['Sursee im Kasten', 'Alle Sehenswürdigkeiten von Sursee fotografiert'],
  su_velofahrer: ['Gümmeler', 'Mit dem Mietvelo durch Sursee gefahren'],
  su_egg: ['Abkürzung', 'Innsbruck ausgelassen und direkt nach Sursee gefahren'],
});

/* ---- Gegenstände ---- */
Object.assign(ITEMS, {
  strahl: { n: 'Goldener Strahl', t: 'souv', icon: 'ray', inv: true },
  sonnenmaske: { n: 'Goldene Sonnenmaske', t: 'souv', icon: 'mask', inv: true },
  felchen: { n: 'Felchen (frisch gefangen)', t: 'souv', icon: 'fish', inv: true },
  detektor: { n: 'Metalldetektor', t: 'souv', icon: 'detector', inv: true },
  konzertticket: { n: 'Konzertticket Stadthalle', t: 'souv', icon: 'ticket', inv: true },
  pluschgans: { n: 'Plüschgans', t: 'souv', icon: 'flower', inv: true },
  legofeuerwehr: { n: 'Lego-Feuerwehrauto', t: 'souv', icon: 'card', inv: true },
  plektren: { n: 'Gitarren-Plektren (für Elin)', t: 'souv', icon: 'card', inv: true },
  kinderhelm: { n: 'Kinder-Velohelm (für Timo)', t: 'souv', icon: 'cap', inv: true },
  krimi: { n: 'Krimi „Tod am Sempachersee“', t: 'souv', icon: 'paper', inv: true },
  bilderbuch: { n: 'Bilderbuch „Der kleine Traktor“', t: 'souv', icon: 'paper', inv: true },
  glace: { n: 'Glace (zwei Kugeln)', t: 'food', food: 10, mood: 8, en: 2, icon: 'cake' },
  pizza: { n: 'Pizza aus dem Holzofen', t: 'food', food: 65, mood: 10, nau: -16, icon: 'pizza' },
  pasta: { n: 'Spaghetti al ragù', t: 'food', food: 60, mood: 9, nau: -14, icon: 'pasta' },
  tiramisu: { n: 'Tiramisù della casa', t: 'food', food: 22, mood: 9, nau: -4, icon: 'cake' },
  espresso: { n: 'Espresso', t: 'drink', en: 16, nau: -2, icon: 'coffee' },
  cappuccino: { n: 'Cappuccino', t: 'drink', en: 12, mood: 3, icon: 'coffee' },
  kafilutz: { n: 'Kafi Lutz', t: 'drink', alc: 0.08, en: 6, mood: 6, icon: 'tea' },
  lager: { n: 'Lager vom Fass (5 dl)', t: 'drink', alc: 0.24, beer: 1, mood: 4, en: -2, icon: 'beer' },
  ipa: { n: 'Craft-IPA (4 dl)', t: 'drink', alc: 0.26, beer: 1, mood: 5, en: -2, icon: 'weiss' },
  stout: { n: 'Stout (3 dl)', t: 'drink', alc: 0.2, beer: 1, mood: 5, food: 4, icon: 'beer' },
  sangria: { n: 'Sangria', t: 'drink', alc: 0.18, mood: 6, icon: 'wine' },
  williams: { n: 'Williams (2 cl)', t: 'drink', alc: 0.13, mood: 5, en: -2, nau: 3, icon: 'shot' },
  gluehwein: { n: 'Glühwein', t: 'drink', alc: 0.15, mood: 6, en: 2, icon: 'tea' },
  punsch: { n: 'Kinderpunsch', t: 'drink', mood: 4, en: 3, icon: 'tea' },
  rivella: { n: 'Rivella', t: 'drink', en: 5, mood: 2, icon: 'bottle', inv: true },
  eistee: { n: 'Eistee', t: 'drink', en: 4, mood: 1, icon: 'can2', inv: true },
  eglifilet: { n: 'Eglifilets mit Pommes', t: 'food', food: 60, mood: 9, nau: -14, icon: 'fishplate' },
  felchenfilet: { n: 'Felchenfilet Müllerinnenart', t: 'food', food: 55, mood: 9, nau: -14, icon: 'fishplate' },
  cordonbleu: { n: 'Cordon bleu mit Pommes', t: 'food', food: 75, mood: 10, nau: -16, en: -3, icon: 'schnitzel' },
  roesti: { n: 'Rösti mit Spiegelei', t: 'food', food: 60, mood: 8, nau: -16, hang: 1, icon: 'pan' },
  chaeschuechli: { n: 'Chäschüechli', t: 'food', food: 25, mood: 5, nau: -6, icon: 'cake' },
  tapas: { n: 'Tapas-Teller', t: 'food', food: 35, mood: 7, nau: -8, icon: 'board' },
  magenbrot: { n: 'Magenbrot (Tüte)', t: 'food', food: 18, mood: 6, icon: 'nuts', inv: true },
  mandeln: { n: 'Gebrannte Mandeln', t: 'food', food: 15, mood: 6, icon: 'nuts', inv: true },
  zuckerwatte: { n: 'Zuckerwatte', t: 'food', food: 8, mood: 8, nau: 3, icon: 'cotton' },
  marroni: { n: 'Heisse Marroni', t: 'food', food: 20, mood: 6, nau: -4, icon: 'nuts', inv: true },
  migrosmenu: { n: 'Tagesmenü Migros-Restaurant', t: 'food', food: 70, mood: 6, nau: -14, icon: 'pan' },
  gipfeli_m: { n: 'Gipfeli', t: 'food', food: 15, mood: 3, nau: -5, icon: 'croissant', inv: true },
  ruebli: { n: 'Rüeblitorte (Stück)', t: 'food', food: 20, mood: 7, icon: 'cake', inv: true },
  angelkoeder: { n: 'Köder (Maden)', t: 'tool', icon: 'bait', inv: true, uses: 5 },
});

/* ---- Läden und Lokale (Franken) ---- */
Object.assign(OPEN, { wildermann: [10, 24], muehle: [11, 23.5], stadtcafe: [8, 24], tnt: [17, 26], roessli: [21, 28], mosquito: [16, 25], lafuga: [7, 18.5], craftwerk: [16, 25], museum: [11, 17], theater: [9, 22], stadthalle: [18, 24], kulturwerk: [20, 28], chilbi: [10, 24], boote: [9, 17], buvette: [10, 18], surseepark: [8, 20] });
Object.assign(SHOPS, {
  wildermann: { title: 'Wirtshaus Wilder Mann', cur: 'chf', mode: 'eat', venue: 'wildermann', intro: 'Seit 1495 am Untertor. Die Wirtin wischt den Stammtisch ab: „Grüezi! Was darf\'s sein?“', sections: [
    { t: 'Aus dem See', items: [it('eglifilet', 34.5), it('felchenfilet', 36)] },
    { t: 'Gutbürgerlich', items: [it('cordonbleu', 32), it('roesti', 22.5), it('chaeschuechli', 9.5)] },
    { t: 'Getränke', items: [it('lager', 6.8), it('wein', 7.5), it('williams', 6), it('kafilutz', 7.5), it('rivella', 4.8), it('wasser', 4.2)] },
    { t: 'Für die Jungs', items: [it('runde', 54, { n: 'Runde Lager für alle', d: 'Alle Jungs hier bekommen ein Bier', icon: 'beer', special: 'round' })] },
  ] },
  muehle: { title: 'Pizzeria zur Mühle', cur: 'chf', mode: 'eat', venue: 'muehle', intro: 'Es duftet nach Holzofen. Pizzaiolo Gino wirbelt den Teig: „Buonasera! Una pizza, una pasta?“', sections: [
    { t: 'Dal forno', items: [it('pizza', 21.5, { n: 'Pizza Margherita', d: 'Holzofen, Büffelmozzarella' }), it('pizza', 25.5, { n: 'Pizza Diavola', d: 'scharfe Salami · macht richtig satt' })] },
    { t: 'Primi e dolci', items: [it('pasta', 23.5), it('tiramisu', 10.5)] },
    { t: 'Da bere', items: [it('wein', 7.9, { n: 'Chianti (1 dl)' }), it('lager', 6.5, { n: 'Birra Moretti' }), it('espresso', 4.2), it('wasser', 4)] },
  ] },
  stadtcafe: { title: 'Stadtcafé', cur: 'chf', mode: 'eat', venue: 'stadtcafe', intro: 'Am Rathausplatz, im ehemaligen Modehaus Heimann. An den Wänden hängt die aktuelle Ausstellung.', sections: [
    { t: 'Kaffee', items: [it('cappuccino', 5.2), it('espresso', 4.2), it('kafilutz', 7.8)] },
    { t: 'Dazu', items: [it('gipfeli_m', 3.2), it('ruebli', 6.5), it('chaeschuechli', 8.5)] },
    { t: 'Bar', items: [it('lager', 6.9), it('wein', 7.8), it('gluehwein', 7.5), it('punsch', 5)] },
  ] },
  tnt: { title: 'TNT Rock Bar', cur: 'chf', mode: 'eat', venue: 'tnt', intro: 'AC/DC aus den Boxen, Billardkugeln klacken. „Was trinksch?“', sections: [{ t: 'Bar', items: [it('lager', 7.5), it('flaschenbier', 6.5), it('shot', 6), it('wodkaE', 13), it('cola', 5)] }] },
  roessli: { title: 'Rössli Nightbar', cur: 'chf', mode: 'eat', venue: 'roessli', intro: 'Rotes Licht, Discokugel, Schlager und Hits. Die Barfrau zwinkert.', sections: [{ t: 'Bar', items: [it('gintonic', 16), it('flaschenbier', 7.5), it('shot', 7), it('wodkaE', 15), it('wasser', 5)] }] },
  mosquito: { title: 'El Mosquito Bodega & Bar', cur: 'chf', mode: 'eat', venue: 'mosquito', intro: '¡Hola! Weinfässer, Schinken an der Decke, Gitarrenmusik.', sections: [{ t: 'Tapas', items: [it('tapas', 16.5)] }, { t: 'Bebidas', items: [it('sangria', 8.5), it('wein', 7.5, { n: 'Rioja (1 dl)' }), it('flaschenbier', 6.5, { n: 'Estrella' }), it('wasser', 4)] }] },
  lafuga: { title: 'La Fuga', cur: 'chf', mode: 'eat', venue: 'lafuga', intro: 'Die Siebträgermaschine faucht. Hier gibt es den besten Kaffee im Städtli.', sections: [{ t: 'Caffè', items: [it('espresso', 4), it('cappuccino', 5), it('kaffee', 4.5)] }, { t: 'Dolci', items: [it('gipfeli_m', 3), it('ruebli', 6)] }] },
  craftwerk: { title: 'Craftwerk', cur: 'chf', mode: 'eat', venue: 'craftwerk', intro: 'Zwanzig Zapfhähne an der Wand. Auf der Kreidetafel stehen Namen, die du noch nie gehört hast.', sections: [{ t: 'Vom Hahn', items: [it('ipa', 9.5), it('stout', 8.5), it('lager', 7)] }, { t: 'Dazu', items: [it('nachos', 12.5), it('cola', 5)] }, { t: 'Für die Jungs', items: [it('runde', 66, { n: 'Runde Craft-Bier für alle', d: 'Für alle Jungs hier', icon: 'beer', special: 'round' })] }] },
  migros: { title: 'Migros Surseepark', cur: 'chf', mode: 'take', venue: 'surseepark', intro: 'Grosse Migros: alles für unterwegs.', sections: [{ t: 'Proviant', items: [it('sandwich', 5.2), it('gipfeli_m', 1.2), it('banane', 0.6), it('chips', 2.9), it('schoko', 2.2), it('ruebli', 3.9)] }, { t: 'Getränke', items: [it('wasser', 1.1), it('rivella', 2.1), it('eistee', 1.6), it('dosenbier', 1.9), it('energy', 2.3)] }, { t: 'Apotheke & Co.', items: [it('aspirin', 7.9), it('elektrolyt', 6.5)] }] },
  migrosresto: { title: 'Migros-Restaurant', cur: 'chf', mode: 'eat', venue: 'surseepark', intro: 'Tablett nehmen, anstehen, essen. Schnell und günstig.', sections: [{ t: 'Menü', items: [it('migrosmenu', 14.9), it('roesti', 13.5), it('pommes', 5.5)] }, { t: 'Getränke', items: [it('kaffee', 3.6), it('rivella', 3.5), it('wasser', 2.5)] }] },
  sportsursee: { title: 'Sport im Surseepark', cur: 'chf', mode: 'take', venue: 'surseepark', intro: 'Angelruten, Neoprenanzüge, Velohelme. „Für den See im Dezember? Mutig!“', sections: [{ t: 'Fischen', items: [it('angelkoeder', 6.5, { d: '5 Würfe mit Maden – mehr Bisse' })] }, { t: 'Kleidung', items: [it('o_beanie', 24, { n: 'Beanie mit Bommel', icon: 'cap', wear: { hat: 3, hatCol: 1 }, d: 'Rot, warm' }), it('o_jacke', 79, { n: 'Trainerjacke', icon: 'shirt', wear: { top: 10, topCol: 9 }, d: 'Blau mit Streifen' })] }] },
  elektro: { title: 'Elektronik', cur: 'chf', mode: 'take', venue: 'surseepark', intro: 'Bildschirme, Kopfhörer, Drohnen. Ein Verkäufer zeigt dir begeistert einen Metalldetektor.', sections: [{ t: 'Angebote', items: [it('detektor', 129, { d: 'Für Schatzsucher · findet Münzen im Boden' })] }] },
  spielwaren: { title: 'Spielwaren', cur: 'chf', mode: 'take', venue: 'surseepark', intro: 'Regale bis zur Decke: Lego, Plüschtiere, Bausätze. Priska lächelt: „Für die Kleinen?“', sections: [{ t: 'Spielwaren', items: [it('pluschgans', 19.9), it('legofeuerwehr', 34.9), it('kinderhelm', 39.9), it('plektren', 6.5)] }] },
  buchhandlung: { title: 'Buchhandlung', cur: 'chf', mode: 'take', venue: 'surseepark', intro: 'Es riecht nach Papier. Auf dem Tisch: Lokalkrimis und Bilderbücher.', sections: [{ t: 'Bücher', items: [it('krimi', 24), it('bilderbuch', 18.9)] }] },
  glace_og: { title: 'Glace & Café', cur: 'chf', mode: 'eat', venue: 'surseepark', intro: 'Zwölf Sorten in der Vitrine. Im Dezember? „Glace geht immer“, sagt Nina.', sections: [{ t: 'Glace und Kaffee', items: [it('glace', 5.5), it('cappuccino', 4.9), it('espresso', 3.9), it('punsch', 4.5)] }] },
  kiosk_sursee: { title: 'Kiosk', cur: 'chf', mode: 'take', venue: 'surseepark', sections: [{ t: 'Kiosk', items: [it('zigaretten', 9.8), it('feuerzeug', 2), it('zeitung', 3.5), it('schoko', 2.5), it('eistee', 2.5), it('dosenbier', 2.9)] }] },
  stadthalle_bar: { title: 'Bar in der Stadthalle', cur: 'chf', mode: 'eat', venue: 'stadthalle', intro: 'Becherpfand zwei Franken. Die Schlange ist lang, aber schnell.', sections: [{ t: 'Bar', items: [it('lager', 7.5), it('wein', 8), it('cola', 5), it('wasser', 4)] }, { t: 'Snacks', items: [it('bratwurst', 8.5), it('pommes', 6)] }] },
  kulturwerk: { title: 'Bar im Kulturwerk 118', cur: 'chf', mode: 'eat', venue: 'kulturwerk', sections: [{ t: 'Bar', items: [it('lager', 6), it('ipa', 8), it('shot', 5), it('cola', 4)] }] },
  buvette: { title: 'Triechter Buvette', cur: 'chf', mode: 'eat', venue: 'buvette', intro: 'Mit Blick auf den Triechter. Im Winter gibt es Glühwein und heisse Marroni.', sections: [{ t: 'Warm', items: [it('gluehwein', 6.5), it('punsch', 4.5), it('kaffee', 4.2), it('marroni', 6)] }, { t: 'Kalt', items: [it('lager', 6.5), it('rivella', 4.5)] }, { t: 'Snacks', items: [it('bratwurst', 8), it('chaeschuechli', 7.5)] }] },
  magenbrot: { title: 'Magenbrot-Stand', cur: 'chf', mode: 'eat', venue: 'chilbi', intro: 'Es riecht nach Zimt und Zucker.', sections: [{ t: 'Chilbi-Klassiker', items: [it('magenbrot', 6), it('mandeln', 7), it('zuckerwatte', 5)] }, { t: 'Warm', items: [it('gluehwein', 6), it('punsch', 4)] }] },
  marroni: { title: 'Marroni-Stand', cur: 'chf', mode: 'eat', intro: 'Heisse Marroni aus der Trommel, im Papiersack.', sections: [{ t: 'Heiss', items: [it('marroni', 6, { d: '200 g' }), it('punsch', 4)] }] },
});

/* ============ Logik ============ */
const Sur = {
  active() { return !!(G.S && G.S.chapter); },
  here() { return !!(G.S && G.S.chapter === 'sursee'); },
  st() { if (!G.S.su) G.S.su = { clues: {}, f: {}, notes: [], ev: {}, hidden: {}, coins: [], photos: {}, met: {}, riddles: 0, attempts: 0 }; return G.S.su; },
  note(k, text) { const s = this.st(); if (s.notes.some((n) => n.k === k)) return; s.notes.push({ k, t: text, at: G.S.time }); s.lastProg = G.S.time; UI.toast(`📓 Notizbuch: ${text}`); },
  evid(k) { this.st().ev[k] = 1; },
  prog() { this.st().lastProg = G.S.time; this.hintLvl = 0; },
  setStage(s) { Story.setStage(s); this.prog(); },

  /* ---------- Kapitelwechsel: von Innsbruck zurück nach Luzern ---------- */
  async toLuzern(opt = {}) {
    G.S.chapter = 'heim';
    G.S.finished = 0;
    this.st();
    delete BUILT.luzern_halle;
    Story.setStage('heim');
    passTime(opt.apoc ? 200 : 255);
    if (G.S.time % 1440 < 8 * 60) G.S.time = dayOf(G.S.time) * 1440 + 8 * 60;
    G.S.st.prom = Math.min(G.S.st.prom, 0.6);
    enterMap('luzern_halle', 'gleis');
    G.player.dir = 0;
    await sleep(200);
    await UI.fadeIn();
    const papi = suPapi(), k = voice('kassier');
    await Story.say(k, opt.apoc ? 'Luzern. Wir leben. Innsbruck … naja. Ich sag nur: Das zahlt keine Versicherung.' : 'Luzern Hauptbahnhof. Endstation, Jungs. Danke für die legendärsten Tage seit Dublin.');
    if (playerIsCuche()) {
      Snd.sfx('blip');
      await sayP('isa', '📱 Schatz! Seid ihr zurück? Komm bitte sofort nach Sursee. Die Sonnenmaske der Zunft ist weg, die Gansabhauet steht auf der Kippe. Der Heinivater sucht einen Detektiv – ich hab gesagt, ich kenn einen.');
    } else {
      await Story.say(papi, `${G.S.name}, komm doch mit nach Sursee! Isa hat geschrieben, im Städtli ist etwas Verrücktes passiert. Die goldene Sonnenmaske der Zunft ist verschwunden – und die Gansabhauet wird nachgeholt, sobald sie wieder da ist.`);
      await sayP('isa', `📱 ${G.S.name}, du warst doch schon in Innsbruck der mit dem Riecher. Die Kinder wollen unbedingt Detektiv spielen. Gleis 2, die S-Bahn fährt gleich!`);
    }
    await Story.say(voice('party'), 'Sursee? Chilbi? Bier? Wir kommen später nach. Erst mal duschen.');
    UI.toast('Gleis 2: S-Bahn nach Sursee. Oder durch die Halle heimgehen – das beendet das Spiel.');
    saveGame(true);
  },
  /* Easter Egg: Dreimal auf die Abfahrtstafel in der Luzerner Bahnhofshalle tippen – heimlich die S1 nach Sursee nehmen */
  _tafel: 0,
  async tafel() {
    if (this.active()) { await Story.say(null, 'Abfahrtstafel: S1 nach Sursee, Gleis 2. IR 70 nach Zürich HB, Gleis 4.'); return; }
    this._tafel++;
    if (this._tafel < 3 || stageAt('ride')) { await Story.say(null, `Abfahrtstafel: ${clockStr(DEP_TIME)} IR 70 nach Zürich HB, Gleis 4. ${clockStr(DEP_TIME + 4)} S1 nach Sursee, Gleis 2.${this._tafel === 2 ? ' Die Zeile „S1 Sursee“ flackert seltsam … Schau noch einmal hin.' : ''}`); if (this._tafel === 2) Snd.sfx('blip'); return; }
    this._tafel = 0;
    Snd.sfx('ding');
    const c = await Story.ask(null, 'Psst … Die Anzeige „S1 SURSEE“ blinkt nur für dich. Innsbruck auslassen und heimlich direkt nach Sursee fahren? Dort wartet ein Fall auf dich. (Easter Egg – nach Innsbruck geht es danach nicht mehr.)', ['Ab nach Sursee!', 'Nein, Innsbruck ruft']);
    if (c !== 0) return;
    await this.directSursee();
  },
  async directSursee() {
    G.busy++;
    const s = this.st();
    s.direct = 1;
    G.S.chapter = 'heim';
    achieve('su_egg');
    delete BUILT.luzern_halle;
    Story.setStage('sbahn');
    G.S.flags.sbDep = G.S.time + 1;
    _sbScroll = 0;
    await Scene.play('trainboard', Object.assign({ station: 'LUZERN', gleis: 2, text: 'S1 nach Sursee', ms: 2300, keep: true }, SBAHN_LOOK));
    enterMap('sbahn', 'start');
    await UI.fadeIn();
    Snd.sfx('blip');
    await Story.say(voice('kassier'), `📱 ${G.S.name}?! Wo bist du? Der IR 70 fährt gleich!`);
    await Story.say('me', '📱 Sorry, Jungs. Ich sitz in der S-Bahn nach Sursee. In Sursee ist die goldene Sonnenmaske verschwunden – Isa braucht einen Detektiv.');
    await Story.say(voice('party'), '📱 VERRÄTER! … Wir trinken eins für dich. Oder zwölf.');
    G.busy--;
    saveGame(true);
  },
  async leaveLuzern() {
    const c = await Story.ask(null, 'Durch die Halle hinaus und nach Hause? Damit endet das Spiel. Die S-Bahn nach Sursee fährt auf Gleis 2.', ['Heimgehen – Spiel beenden', 'Doch nach Sursee']);
    if (c !== 0) return false;
    G.S.finished = 1;
    saveGame(true);
    await Ending.show({ final: true });
    return false;
  },
  async boardSBahn() {
    if (G.S.stage !== 'heim') { await Story.say(null, 'Die S-Bahn nach Sursee.'); return; }
    G.busy++;
    Snd.sfx('ding');
    await Story.say(null, '🔊 „S1 nach Sursee, Abfahrt auf Gleis 2. Nächster Halt: Emmenbrücke.“');
    Story.setStage('sbahn');
    G.S.flags.sbDep = G.S.time + 1;
    _sbScroll = 0;
    await Scene.play('trainboard', Object.assign({ station: 'LUZERN', gleis: 2, text: 'S1 nach Sursee', ms: 2300, keep: true }, SBAHN_LOOK));
    enterMap('sbahn', 'start');
    await UI.fadeIn();
    G.busy--;
    UI.toast('Setz dich ans Fenster: Ab Sempach-Neuenkirch fährst du dem See entlang.');
    saveGame(true);
  },
  _sbLast: null,
  sbahnUpdate(dt) {
    if (G.S.stage !== 'sbahn') return;
    const st = sbState();
    _sbScroll += (st.stop ? 0 : 200) * dt;
    G.map.timeScale = G.player.seated ? 2 : 1;
    if (st.stop && this._sbLast !== st.stop.n && st.tm > 0.5 && st.stop.n !== 'Luzern') {
      this._sbLast = st.stop.n;
      Snd.sfx('ding');
      UI.toast(st.stop.n === 'Sursee' ? '🔊 „Sursee. Endstation. Bitte alle aussteigen.“' : `🔊 „${st.stop.n}.“${st.stop.n === 'Nottwil' ? ' Am Ufer das Paraplegiker-Zentrum.' : st.stop.n === 'Sempach-Neuenkirch' ? ' Draussen glitzert der Sempachersee.' : ''}`);
      if (st.stop.n === 'Sursee') { G.player.seated = false; G.player.pose = 'stand'; }
    }
  },
  async sbahnSeat() {
    if (G.player.seated) { G.player.seated = false; G.player.pose = 'stand'; return; }
    G.player.seated = true; G.player.pose = 'sit'; G.player.dir = 2;
    UI.toast('Du setzt dich ans Fenster. Die Fahrt vergeht schneller.');
  },
  async sbahnDoor() {
    const st = sbState();
    if (st.tm < SB_END) { await Story.say(null, `Die Türen sind zu. Nächster Halt: ${st.next.n}.${st.next.n === 'Sursee' ? '' : ' Du fährst bis Sursee.'}`); return; }
    G.busy++;
    achieve('su_sbahn');
    G.S.chapter = 'sursee';
    Story.setStage('s_ankunft');
    await Scene.play('trainexit', Object.assign({ station: 'SURSEE', text: 'Sursee', ms: 1600, keep: true }, SBAHN_LOOK));
    enterMap('sursee', 'bahnhof');
    await UI.fadeIn();
    G.busy--;
    await this.arrive();
  },

  /* ---------- Ankunft in Sursee ---------- */
  async arrive() {
    G.busy++;
    const s = this.st();
    s.met.isa = 1;
    const papi = suPapi();
    const h = hourOf(G.S.time), night = h >= 20 || h < 7;
    if (night) {
      G.npcs = G.npcs.filter((n) => !n.follower);
      await sayP('isa', `${playerIsCuche() ? 'Da bist du ja, Schatz' : `Willkommen in Sursee, ${G.S.name}`}! Elin und Timo schlafen schon – sie wollten unbedingt wach bleiben, für den Detektiv. Morgen ab acht sind sie dabei.`);
    } else {
      await sayP('elin', 'PAPI! Mami, Papi ist da!');
      await sayP('timo', 'Hoi Papi! Hast du eine Lupe dabei? Wir haben schon ein Notizbuch!');
    }
    await sayP('isa', `${playerIsCuche() ? 'Da bist du ja endlich' : `Willkommen in Sursee, ${G.S.name}`}! Also, hör zu. Die goldene Sonnenmaske der Zunft Heini von Uri ist weg. Die Zunft feiert dieses Jahr 150 Jahre, die Maske war in der Jubiläumsausstellung im Sankturbanhof.`);
    await sayP('isa', 'In der Nacht vor dem Martinstag haben sie die Maske in die Zunftstube beim Diebenturm gebracht – sie ist im ersten Stock des alten Waschhauses. Am Morgen war sie verschwunden – und die Gansabhauet fiel zum ersten Mal überhaupt aus.');
    await sayP('isa', 'Die Stadt holt sie jetzt nach, mit Chilbi auf dem Märtplatz. Aber ohne Sonnenmaske keine Gansabhauet. Der Heinivater wartet in der Zunftstube – im alten Waschhaus beim Diebenturm. Unterstadt, beim Hirschenplatz.');
    if (!playerIsCuche() && FRIENDS[papi] && !s.direct) await Story.say(papi, 'Ich bring die Taschen heim. Elin und Timo zeigen dir den Weg. Du schaffst das, Sherlock.');
    if (s.direct) await sayP('isa', `Und die Jungs sind ohne dich nach Innsbruck? ${playerIsCuche() ? 'Und du bist trotzdem hier. Ich bin gerührt.' : 'Cuche auch. Na dann: Willkommen im Team Sursee.'}`);
    s.follow = 1;
    Story.dropActor(G.npcs.find((n) => n.id === 'su_isa'));
    if (night) {
      await sayP('isa', 'Der Diebenturm ist in der Unterstadt, beim Hirschenplatz – der Heinivater wartet dort, auch spät noch. Und das Gästebett bei uns in der Münstervorstadt 8 ist frisch bezogen.');
      UI.toast('Isa geht heim in die Münstervorstadt 8. Morgen früh begleiten dich Elin und Timo.');
    } else {
      await sayP('elin', 'Wir kommen mit, Papi! Wir kennen alle Schleichwege. Und wenn du nicht weiterweisst, sagen wir dir einen Tipp.');
      UI.toast('Isa geht heim in die Münstervorstadt 8. Elin und Timo bleiben bei dir.');
      this.spawnFollowers(true);
    }
    G.busy--;
    this.prog();
    UI.toast('📓 Im Handy gibt es jetzt das Notizbuch mit Spuren, Fährten und Tipps.');
    saveGame(true);
  },

  /* ---------- Ziele, Schritte, Karte ---------- */
  faehrtenDone() { const f = this.st().f; return ['chilbi', 'see', 'alt'].filter((k) => this.faehrte(k)).length; },
  faehrte(k) { const f = this.st().f; return k === 'chilbi' ? !!(f.roli && f.rad) : k === 'see' ? !!(f.log && f.fischer) : !!(f.buch && f.fundus); },
  objective() {
    const s = this.st(), st = G.S.stage;
    switch (st) {
      case 'heim': return 'Zurück in Luzern · Gleis 2: S-Bahn nach Sursee – oder durch die Halle heimgehen (beendet das Spiel)';
      case 'sbahn': { const b = sbState(); return b.tm >= SB_END ? 'Sursee! Aussteigen – Tür in der Mitte des Wagens' : `S-Bahn nach Sursee · nächster Halt: ${b.next.n}`; }
      case 's_ankunft': return `Geh${this.followOk() ? ' mit Elin und Timo' : ''} zum Diebenturm in der Unterstadt (Zunftstube, beim Hirschenplatz)`;
      case 's_tatort': return `Zunftstube beim Diebenturm: Finde drei Spuren (${Object.keys(s.clues).length}/3)`;
      case 's_faehrten': {
        const open = [];
        if (!this.faehrte('chilbi')) open.push(s.f.roli ? (isNight() || hourOf(G.S.time) >= 17 ? 'Riesenrad: Ausschau halten' : 'Riesenrad ab 17 Uhr') : 'Chilbi: Jeton zum Achterbahn-Betreiber');
        if (!this.faehrte('see')) open.push(!s.f.log ? 'See: Logbuch der Bootsvermietung' : 'See: Fischer Wäli am Quai');
        if (!this.faehrte('alt')) open.push(!s.f.buch ? 'Altstadt: Besucherbuch im Sankturbanhof' : 'Altstadt: Fundus im Stadttheater');
        return `Folge den Fährten (${this.faehrtenDone()}/3) · ${open.join(' · ')}`;
      }
      case 's_strahl': return hasInv('strahl') ? `Zeig Isa den goldenen Strahl (${this.isaWhere().t})` : 'Thierry und Louve warten beim Spielplatz im Ehret-Park';
      case 's_probe': { const h = hourOf(G.S.time); return h >= 16 && h < 23 ? 'Guuggen-Probe der Diebetormtöibeler beim Untertor – schau dir den Bläser mit der Larve an' : 'Die Guuggen proben heute ab 16 Uhr beim Untertor. Bis dahin: Chilbi, See, Essen!'; }
      case 's_boot': return 'Er flieht über den See! Zum Quai – Bootsjagd zum Gamma-Inseli';
      case 's_gans': { const h = hourOf(G.S.time); return h >= 10 && h < 16 ? 'Nachhol-Gansabhauet: Hol dir beim Diebenturm deine Startnummer' : 'Die Gansabhauet beginnt um 10 Uhr beim Diebenturm. Schlaf bei Isa oder geniess die Chilbi.'; }
      default: {
        const tips = [];
        if (G.S.money.chf < 15) tips.push('Kaum Franken – Bankomat am Bahnhof oder im Surseepark');
        else if (G.S.st.energy < 25) tips.push('Müde – Gästebett bei Isa, Münstervorstadt 8');
        else if (G.S.st.food < 25) tips.push('Hunger! Pizza in der Mühle oder Egli im Wilden Mann');
        else if (hourOf(G.S.time) >= 19 && hourOf(G.S.time) < 23 && !G.S.ach.su_konzert) tips.push('Heute Abend Konzert in der Stadthalle');
        else if (s.coins.length < 5 && hasInv('detektor')) tips.push(`Römermünzen im Vicus (${s.coins.length}/5)`);
        else tips.push('Chilbi, See, Bars – Sursee gehört dir');
        return `${tips[0]} · Fotos ${Object.keys(s.photos).length}/${Object.keys(SIGHTS_SU).length}`;
      }
    }
  },
  tag() { return { heim: 'LUZERN', sbahn: 'S1', s_ankunft: 'SURSEE', s_tatort: 'TATORT', s_faehrten: 'FÄHRTEN', s_strahl: 'STRAHL', s_probe: 'GUUGGE', s_boot: 'SEE', s_gans: 'GANS', s_frei: 'FREI' }[G.S.stage] || 'SURSEE'; },
  steps() {
    const s = this.st();
    return [
      s.direct ? { t: 'Abkürzung genommen', d: 'Innsbruck ausgelassen – die Jungs feiern ohne dich', done: true } : { t: 'Heimreise nach Luzern', d: 'Innsbruck ist geschafft', done: true },
      { t: 'S-Bahn nach Sursee', d: 'Gleis 2, dem Sempachersee entlang', done: suAt('s_ankunft') },
      { t: 'Isa und die Kinder am Bahnhof treffen', d: 'Elin und Timo helfen beim Suchen', done: suAt('s_tatort') || !!s.met.isa },
      { t: 'Tatort Diebenturm', d: `Drei Spuren in der Zunftstube (${Object.keys(s.clues).length}/3)`, done: suAt('s_faehrten') },
      { t: 'Fährte Chilbi', d: 'Jeton zum Achterbahn-Betreiber, vom Riesenrad aus Ausschau halten', done: this.faehrte('chilbi') },
      { t: 'Fährte See', d: 'Logbuch der Bootsvermietung, Fischer Wäli braucht einen Felchen', done: this.faehrte('see') },
      { t: 'Fährte Altstadt', d: 'Besucherbuch im Sankturbanhof, Fundus im Stadttheater', done: this.faehrte('alt') },
      { t: 'Louves Schatzkiste', d: 'Spielplatz im Ehret-Park', done: suAt('s_probe') },
      { t: 'Velo-Verfolgung', d: 'Guuggen-Probe beim Untertor', done: suAt('s_boot') },
      { t: 'Bootsjagd und Anklage', d: 'Gamma-Inseli', done: suAt('s_gans') },
      { t: 'Nachhol-Gansabhauet', d: 'Vor dem Rathaus', done: suAt('s_frei') },
    ];
  },
  pois(id) {
    const A = '#ffb53d', S = '#6cc46f', V = '#7ab0f0', N = '#e85af0';
    if (id === 'sursee') return [
      { x: 9, y: 31, n: 'Bahnhof', c: V }, { x: 28, y: 34, n: 'Surseepark', c: S }, { x: 45, y: 43, n: 'Martigny-Platz', c: S }, { x: 54, y: 38, n: 'Untertor', c: V },
      { x: 58, y: 36, n: 'Wilder Mann', c: A }, { x: 63, y: 36, n: 'TNT', c: N }, { x: 80, y: 36, n: 'Rathaus', c: V }, { x: 89, y: 36, n: 'Stadtcafé', c: A },
      { x: 98, y: 36, n: 'El Mosquito', c: A }, { x: 107, y: 36, n: 'Craftwerk', c: N }, { x: 81, y: 22, n: 'St. Georg', c: V }, { x: 71, y: 33, n: 'Obertor', c: V },
      { x: 66, y: 26, n: 'Theater', c: V }, { x: 58, y: 26, n: 'Sankturbanhof', c: V }, { x: 79, y: 8, n: 'Stadthalle', c: N }, { x: 58, y: 16, n: 'Vierherrenplatz', c: V },
      { x: 110, y: 16, n: 'Chilbi', c: N }, { x: 62, y: 49, n: 'Rössli', c: N }, { x: 71, y: 49, n: 'La Fuga', c: A }, { x: 81, y: 49, n: 'Diebenturm', c: V },
      { x: 101, y: 49, n: 'Mühle', c: A }, { x: 65, y: 57, n: 'Spielplatz', c: S }, { x: 85, y: 62, n: 'Ehret-Park', c: V }, { x: 127, y: 41, n: 'Beckenhof', c: V },
      { x: 122, y: 60, n: 'Nr. 8 (Isa)', c: A }, { x: 128, y: 77, n: 'Zum See', c: V }, { x: 32, y: 11, n: 'Kloster', c: V }, { x: 13, y: 49, n: 'Kulturwerk 118', c: N }, { x: 12, y: 20, n: 'Römer-Vicus', c: V }, { x: 22, y: 55, n: 'Polizei', c: S }, { x: 27, y: 49, n: 'Dreiklang', c: V },
    ];
    if (id === 'sursee_see') return [{ x: 32, y: 14, n: 'Bootsvermietung', c: A }, { x: 39, y: 18, n: 'Fischer', c: S }, { x: 47, y: 12, n: 'Buvette', c: A }, { x: 63, y: 19, n: 'Sprungturm', c: V }, { x: 79, y: 18, n: 'SUP', c: S }, { x: 7, y: 26, n: 'Zellmoos', c: V }, { x: 45, y: 48, n: 'Gamma-Inseli', c: V }, { x: 84, y: 3, n: 'Mariazell', c: V }, { x: 40, y: 1, n: 'Stadt', c: V }];
    return [];
  },

  /* ---------- Wo sind Isa, die Kinder und die Jungs? ---------- */
  isaWhere() {
    const h = hourOf(G.S.time);
    if ((h >= 10 && h < 11) || (h >= 15 && h < 16)) return { t: 'im Stadtcafé am Rathausplatz (Kaffeepause)', map: 'stadtcafe', x: 89, y: 36 };
    if (h >= 8 && h < 18 && dayOf(G.S.time) % 7 > 2) return { t: 'zu Hause in der Münstervorstadt 8 (Homeoffice)', map: 'isa_haus', x: 122, y: 60 };
    return { t: 'zu Hause in der Münstervorstadt 8', map: 'isa_haus', x: 122, y: 60 };
  },
  jungsDa() { const s = this.st(); return !s.direct && suAt('s_tatort') && (s.jungsAt != null && G.S.time >= s.jungsAt); },
  friendLoc(id) {
    if (!this.jungsDa() || !FRIENDS[id]) return null;
    const h = hourOf(G.S.time), fn = FRIENDS[id].fn;
    if (id === suPapi() && !playerIsCuche()) return this.isaWhere().map;
    if (h >= 3 && h < 9) return null;
    const night = h >= 22 || h < 3;
    const T = {
      saeufer: h >= 11 || night ? 'wildermann' : null, gourmet: (h >= 11 && h < 14) || (h >= 18 && h < 23) ? 'muehle' : 'lafuga',
      party: night || h >= 18 ? 'tnt' : h >= 14 ? 'chilbi' : 'stadtcafe', frech: h >= 10 && h < 22 ? 'chilbi' : 'roessli', pilot: h >= 9 && h < 16 ? 'martigny' : 'craftwerk',
      taenzer: night ? 'roessli' : 'stadtcafe', charmeur: night ? 'roessli' : 'stadtcafe', muskel: h >= 10 && h < 17 ? 'quai' : 'craftwerk',
      kanadier: h >= 9 && h < 16 ? 'quai' : 'craftwerk', raucher: h >= 17 || night ? 'diebenturm' : 'lafuga', anwalt: h >= 9 && h < 18 ? 'stadtcafe' : 'wildermann', kassier: 'stadtcafe', surfer: h >= 10 && h < 16 ? 'quai' : 'craftwerk',
    };
    return T[fn] || 'wildermann';
  },
  LOC: { wildermann: ['im Wilden Mann', 58, 36], muehle: ['in der Pizzeria zur Mühle', 101, 49], stadtcafe: ['im Stadtcafé', 89, 36], tnt: ['in der TNT Rock Bar', 63, 36], roessli: ['in der Rössli Nightbar', 62, 49], craftwerk: ['im Craftwerk', 107, 36], lafuga: ['im La Fuga', 71, 49], chilbi: ['an der Chilbi', 108, 20], martigny: ['auf dem Martigny-Platz (mit Drohne)', 46, 43], quai: ['am Quai beim See', 128, 77], diebenturm: ['beim Diebenturm, eine rauchen', 81, 50], isa_haus: ['bei Isa zu Hause (Münstervorstadt 8)', 122, 60] },
  whereIs(id) {
    if (!this.here()) return { t: G.S.stage === 'sbahn' ? 'in Luzern geblieben' : 'auf Gleis 4 in Luzern', x: null };
    const l = this.friendLoc(id);
    if (!l) return { t: suAt('s_tatort') && this.jungsDa() ? 'im Hotel Rössli, schläft' : 'kommt später nach Sursee', x: null };
    const e = this.LOC[l];
    return { t: e[0], x: e[1], y: e[2] };
  },
  /* Figuren der Story auf die Karten setzen */
  populate(m) {
    G.npcs = G.npcs.filter((n) => !(n.friend || (n.id && String(n.id).startsWith('su_'))));
    const s = this.st(), st = G.S.stage, h = hourOf(G.S.time);
    const add = (o) => { const a = new Actor(Object.assign({ solid: true, keepDir: true, dir: 0 }, o)); G.npcs.push(a); return a; };
    const person = (k, x, y, dir, extra = {}) => add(Object.assign({ id: 'su_' + k, name: SU_P[k].name, look: SU_P[k].look, x: x * 16 + 8, y: y * 16 + 12, dir, talk: () => this.talk(k), label: 'Reden: ' + SU_P[k].name, bubbleRand: ['dots'] }, extra));
    const spot = (name) => (m.spots && m.spots[name]) || null;
    const atSpot = (k, name, extra) => { const p = spot(name); if (p) person(k, p[0], p[1], p[2] ?? 0, extra); };
    const friend = (id, x, y, dir, pose = 'stand', extra = {}) => { if (FRIENDS[id]) G.npcs.push(Story.friendActor(id, x, y, dir, pose, Object.assign({ talk: () => this.friendTalk(id) }, extra))); };
    /* Followers zuerst entfernen, sie werden unten neu gesetzt */
    if (m.id === 'sbahn') {
      const c = spot('cuche'); if (c && !playerIsCuche() && FRIENDS.cuche && !s.direct) friend('cuche', c[0], c[1], c[2], 'sit', { bubbleRand: ['zzz', 'dots'] });
      const a = spot('alter'); if (a) person('heinivater', a[0], a[1], a[2], { name: 'Älterer Herr mit Abzeichen', label: 'Reden: Älterer Herr', pose: 'sit', bubbleRand: ['!'], talk: () => this.talk('alter') });
      return;
    }
    if (m.id === 'sursee') {
      if (st === 's_ankunft' && !s.met.isa) { person('isa', 8, 34, 3); }
      person('roli', 106, 13, 0, { bubbleRand: ['dots', '!'] });
      person('riesenrad', 116, 14, 0, { talk: () => this.riesenrad(), label: 'Riesenrad', bubbleRand: ['note'] });
      if ((st === 's_strahl' && h >= 8 && h < 20) || (suAt('s_ankunft') && h >= 9 && h < 17)) { const hot = st === 's_strahl' && !hasInv('strahl'); person('thierry', 66, 59, 0, { bubbleRand: hot ? ['!'] : ['note'] }); person('louve', 68, 59, 1, { bubbleRand: hot ? ['!'] : ['heart'] }); }
      if (dayOf(G.S.time) % 7 > 2 && h >= 8 && h < 17) person('lejan', 106, 4, 0, { talk: () => this.kita(), label: 'Reden: Lejan', bubbleRand: ['!', 'note'] });
      if (st === 's_probe' && h >= 16 && h < 23) this.spawnGuuggen();
      if (st === 's_gans' && h >= 10 && h < 16) person('heinivater', 82, 51, 0, { bubbleRand: ['!'] });
      if (suAt('s_ankunft')) this.spawnNarr(m);
      for (const id of Object.keys(FRIENDS)) {
        const l = this.friendLoc(id); if (!l) continue;
        const P = { chilbi: [[104, 20], [112, 21], [100, 21]], martigny: [[46, 43]], diebenturm: [[79, 51]] }[l];
        if (!P) continue;
        const k = Object.keys(FRIENDS).indexOf(id) % P.length;
        friend(id, P[k][0], P[k][1], 0, 'stand', { bubbleRand: l === 'diebenturm' ? ['dots'] : l === 'martigny' ? ['!', '?'] : ['note', '!'] });
      }
    } else if (m.id === 'sursee_see') {
      for (const id of Object.keys(FRIENDS)) { if (this.friendLoc(id) !== 'quai') continue; const k = Object.keys(FRIENDS).indexOf(id) % 2; friend(id, k ? 36 : 30, 16, 0, 'stand', { bubbleRand: ['!', 'dots'] }); }
    } else if (m.id === 'zunftstube') {
      if (suAt('s_ankunft') && !suAt('s_gans')) atSpot('heinivater', 'heinivater');
    } else if (m.id === 'rathaus') {
      if (suAt('s_faehrten') && !suAt('s_gans') && h >= 9 && h < 18) atSpot('heinivater', 'heinivater');
    } else if (m.id === 'isa_haus') {
      if (this.isaWhere().map === 'isa_haus') atSpot('isa', 'isa');
      if (h >= 18 || h < 8) { atSpot('elin', 'elin', { pose: h >= 21 || h < 7 ? 'sit' : 'stand', bubbleRand: h >= 21 || h < 7 ? ['zzz'] : ['note'] }); atSpot('timo', 'timo', { bubbleRand: h >= 21 || h < 7 ? ['zzz'] : ['!'] }); }
    } else if (m.id === 'stadtcafe') {
      if (this.isaWhere().map === 'stadtcafe') atSpot('isa', 'isa', { pose: 'sit' });
    } else if (m.id === 'stadthalle' || m.id === 'kulturwerk') {
      this.spawnBand(m);
    } else if (m.id === 'inseli') {
      if (G.S.stage === 's_boot' && this.st().maskFound) atSpot('pfister', 'pfister');
    }
    /* Die Jungs in den Lokalen */
    if (m.spots) {
      const here = Object.keys(FRIENDS).filter((id) => this.friendLoc(id) === m.id && !(m.id === 'isa_haus' && id !== suPapi()) && !(m.id === 'stadtcafe' && id === suPapi() && this.isaWhere().map !== 'stadtcafe'));
      const names = Object.keys(m.spots).filter((k) => /^friend|^lexx|^cuche/.test(k));
      here.forEach((id, i) => { const nm = m.spots[id] ? id : names[i]; const p = m.spots[nm]; if (p) friend(id, p[0], p[1], p[2] ?? 0, /friend/.test(nm) ? 'sit' : 'stand', { drinkIdle: true, bubbleRand: ['beer', 'note', 'dots'] }); });
    }
    this.spawnFollowers(false);
  },
  onEnter(m) {
    const s = this.st();
    G.player.velo = !!s.velo && !s.veloOff && !m.indoor && ['sursee', 'sursee_see'].includes(m.id);
    if (m.id === 'zunftstube' && G.S.stage === 's_ankunft') setTimeout(() => this.tatortStart(), 600);
    if (m.id === 'sursee_see' && G.S.stage === 's_boot' && !s.bootReady) { s.bootReady = 1; setTimeout(() => this.bootsjagd(), 500); }
    if (m.id === 'inseli') s.photosInseli = 1;
    if (m.id === 'muehle' && this.followOk()) setTimeout(() => { UI.toast(`💬 Timo: „Teigwaren mit Käse! Ohne Sauce! Nur Käse! Und noch mehr Käse!“`); setTimeout(() => UI.toast(`💬 Elin: „Pizza Margherita. Aber ${playerIsCuche() ? 'deine Pizza ist besser, Papi' : 'Papis Pizza ist besser'}. Psst, nicht dem Gino sagen.“`), 2600); }, 900);
  },
  minute() {
    const s = this.st();
    const h = Math.floor(hourOf(G.S.time));
    if (h !== this._h) {
      const prev = this._h; this._h = h;
      if (prev != null && h === 20 && G.map.id === 'stadthalle') setTimeout(() => UI.toast('🎤 Licht aus, Nebel, Jubel: Die Stubete Gäng steht auf der Bühne! Mit Ticket vor die Bühne (A).', 'ach'), 400);
      if (prev != null && !G.busy && (SU_MAPS.includes(G.map.id) || G.map.spots)) { G.npcs = G.npcs.filter((n) => !(n.friend || (n.id && n.id.startsWith('su_')))); this.populate(G.map); }
      if (s.follow && (h === 20) && !G.busy) { UI.toast('💬 Isa: „Elin, Timo – ab nach Hause, es ist acht! Morgen helft ihr wieder.“'); }
    }
    if (this.here() && suAt('s_tatort') && s.jungsAt == null && !s.direct) s.jungsAt = G.S.time + 120;
    if (s.jungsAt != null && !s.jungsMsg && G.S.time >= s.jungsAt) { s.jungsMsg = 1; Snd.sfx('blip'); UI.toast(`💬 ${fname(voice('party'))}: „Wir sind in Sursee! Hotel Rössli. Wo ist hier das Bier?“`); }
    this.hintTick();
    this.maybeEvent();
  },

  /* ---------- Kinder als Begleiter ---------- */
  followOk() { const s = this.st(), h = hourOf(G.S.time); return !!s.follow && h >= 8 && h < 20 && suAt('s_ankunft') && !['inseli', 'sbahn', 'roessli', 'tnt', 'craftwerk', 'kulturwerk', 'mosquito'].includes(G.map.id); },
  _trail: [],
  spawnFollowers(force) {
    G.npcs = G.npcs.filter((n) => !n.follower);
    if (!this.followOk() && !force) return;
    const p = G.player;
    ['elin', 'timo'].forEach((k, i) => {
      const a = new Actor({ id: 'su_' + k, name: SU_P[k].name, look: SU_P[k].look, x: p.x - (i + 1) * 6, y: p.y + 4 + i * 3, dir: p.dir, solid: false, follower: i + 1, talk: () => this.talk(k), label: 'Reden: ' + SU_P[k].name, speed: 60 });
      G.npcs.push(a);
    });
    this._trail = [];
  },
  tick(dt) {
    const p = G.player;
    const fol = G.npcs.filter((n) => n.follower);
    if (!fol.length) return;
    const last = this._trail[this._trail.length - 1];
    if (!last || Math.hypot(p.x - last.x, p.y - last.y) > 3) { this._trail.push({ x: p.x, y: p.y }); if (this._trail.length > 80) this._trail.shift(); }
    for (const a of fol) {
      const idx = this._trail.length - 1 - a.follower * 13;
      const tgt = idx >= 0 ? this._trail[idx] : null;
      if (!tgt) { a.moving = false; continue; }
      const dx = tgt.x - a.x, dy = tgt.y - a.y, d = Math.hypot(dx, dy);
      if (d < 2) { a.moving = false; if (!p.moving) a.dir = dirTo(a.x, a.y, p.x, p.y); continue; }
      const sp = Math.min(d, (d > 40 ? 140 : 70) * dt * (p.velo ? 1.8 : 1));
      a.x += dx / d * sp; a.y += dy / d * sp; a.dir = dirTo(0, 0, dx, dy); a.moving = true; a.walkT += dt;
      a.velo = a.id === 'su_timo' && !!p.velo;
      if (d > 120) { a.x = tgt.x; a.y = tgt.y; }
    }
  },
  mapUpdate() {},
};

/* ============ Gespräche und Fall ============ */
const SU_CLUES = {
  feder: ['Gänsefeder', 'Eine weisse Gänsefeder, noch ganz flaumig. Wer trainiert hier mit einer Gans?'],
  jeton: ['Achterbahn-Jeton', 'Ein Messing-Jeton mit dem Aufdruck „LOOPING – Freifahrt“. Von der Achterbahn an der Chilbi.'],
  quittung: ['Nasser Quittungsfetzen', 'Ein aufgeweichter Fetzen: „Bootsvermietung Sursee … Boot 7 … Nacht…“. Der Rest ist unleserlich.'],
};
const SU_SUSPECTS = [
  { k: 'roli', n: 'Roli Rüttimann', d: 'Betreibt die Achterbahn. Die Jetons sind von ihm.' },
  { k: 'bea', n: 'Kostümbildnerin Bea', d: 'Hütet den Fundus im Stadttheater, in dem ein roter Mantel fehlt.' },
  { k: 'pfister', n: 'Ruedi Pfister, der Pechvogel', d: 'Ist seit zwanzig Jahren Schläger an der Gansabhauet und hat noch nie getroffen.' },
  { k: 'kari', n: 'Schatzsucher Kari', d: 'Sucht mit dem Metalldetektor im Zellmoos. Nach was eigentlich?' },
];
/* Beweise für die Anklage: p = zeigt auf den Täter */
const SU_EVID = {
  jeton: { n: 'Der Jeton gehört einem Stammgast mit Jahresabo', p: 1 },
  rad: { n: 'Nachts Licht auf dem Gamma-Inseli', p: 1 },
  log: { n: 'Logbuch: Boot 7, Nacht vor dem Martinstag, unterschrieben „R. P.“', p: 1 },
  fischer: { n: 'Fischer Wäli: ein Boot mit goldenem Schimmer Richtung Inseli', p: 1 },
  buch: { n: 'Besucherbuch: „R. Pfister“ 23-mal vor der Sonnenmaske', p: 1 },
  fundus: { n: 'Zettel im Fundus: „Bringe den Mantel nach der Gansabhauet zurück. R.“', p: 1 },
  strahl: { n: 'Goldener Strahl der Maske, gefunden im Ehret-Park', p: 1 },
  plan: { n: 'Trainingsplan aus dem Klostergarten: „blind, Maske, Mantel, Inseli“', p: 1 },
  zeuge: { n: 'Zeugin an der Stadthalle: Mann mit Sousaphon-Koffer und rotem Mantel', p: 1 },
  bea: { n: 'Bea war in jener Nacht an der Theaterprobe', p: 0 },
  kari: { n: 'Kari sucht Römermünzen, nicht Gold', p: 0 },
  roli: { n: 'Roli war in jener Nacht mit der Achterbahn unterwegs', p: 0 },
};
Object.assign(Sur, {
  clueOpen(id) { return suAt('s_tatort') && !this.st().clues[id] && !suAt('s_faehrten'); },
  hiddenOpen(id) { return suAt('s_faehrten') && !this.st().hidden[id]; },
  maskSpot(k) { const s = this.st(); if (s.maskSpot == null) s.maskSpot = rint(0, 3); return G.S.stage === 's_boot' && s.inseliSearch && !s.maskFound && s.maskSpot === k && (s.searched || []).length >= 2; },
  hasPhoto(id) { return !!this.st().photos[id]; },
  async photo(id) {
    const s = this.st();
    if (s.photos[id]) { UI.toast('Davon hast du schon ein Foto.'); return; }
    try { const W = 120, H = 90; const [c, x] = canvas(W * GFX, H * GFX); const px = G.player.x - G.cam.x, py = G.player.y - G.cam.y - 30; x.drawImage(View.wcv, Math.round(px - W / 2) * View.k, Math.round(py - H / 2) * View.k, W * View.k, H * View.k, 0, 0, W * GFX, H * GFX); G.photoImg = G.photoImg || {}; G.photoImg['su_' + id] = c.toDataURL('image/png'); try { const all = JSON.parse(localStorage.getItem(SAVE_KEY + '-img') || '{}'); all['su_' + id] = G.photoImg['su_' + id]; localStorage.setItem(SAVE_KEY + '-img', JSON.stringify(all)); } catch (e) {} } catch (e) {}
    s.photos[id] = G.S.time; Snd.sfx('shutter'); G.fx.flash = 1; mood(3);
    UI.toast(`📷 Foto: <b>${SIGHTS_SU[id].n}</b>`);
    if (Object.keys(s.photos).length >= Object.keys(SIGHTS_SU).length) achieve('su_fotos');
    await Story.say(null, `<em>${SIGHTS_SU[id].n}</em> – ${SIGHTS_SU[id].f}`);
  },
  async openGuard(k) {
    if (isOpen(k)) return true;
    await Story.say(null, `Geschlossen. Offen ${hoursStr(k)} Uhr.`);
    return false;
  },
  async diebenturmDoor() {
    if (!suAt('s_ankunft')) return true;
    if (G.S.stage === 's_gans') { await Story.say(null, 'Die Zunftstube ist abgeschlossen. Alle sind draussen für die Gansabhauet.'); return false; }
    return true;
  },
  async isaDoor() { if (hourOf(G.S.time) >= 23 || hourOf(G.S.time) < 7) UI.toast('Leise – die Kinder schlafen.'); return true; },
  async stadthalleDoor() {
    const h = hourOf(G.S.time);
    if (h >= 18 && h < 24) return true;
    await Story.say(null, 'Plakat an der Stadthalle: „Stubete Gäng · Samichlaus Tour · Heute 20 Uhr · Türöffnung 18 Uhr · Abendkasse“. Jetzt ist noch zu.');
    return false;
  },
  async kulturwerkDoor() {
    const h = hourOf(G.S.time);
    if (h >= 20 || h < 4) return true;
    await Story.say(null, 'Kulturwerk 118 – Konzertkeller im Untergeschoss der Feuerwehr. Die 118 ist die Nummer der Feuerwehr. Geöffnet ab 20 Uhr.');
    return false;
  },
  async rathausDoor() {
    if (!(hourOf(G.S.time) >= 8 && hourOf(G.S.time) < 18)) { await Story.say(null, 'Das Rathaus ist zu. Öffnungszeiten 8–18 Uhr.'); return; }
    await warpTo('rathaus', 'entry');
  },

  /* ---------- Gespräche ---------- */
  async talk(k) {
    const s = this.st(), st = G.S.stage;
    switch (k) {
      case 'isa': return this.talkIsa();
      case 'elin': case 'timo': return this.kidTalk(k);
      case 'thierry': case 'louve': return this.cousinsTalk(k);
      case 'heinivater': return this.talkHeinivater();
      case 'alter': return this.talkAlter();
      case 'roli': return this.talkRoli();
      case 'narr': return this.narr();
      case 'fischer': return this.talkFischer();
      case 'bea': return this.talkBea();
      case 'museum': return this.talkMuseum();
      case 'kari': return this.talkKari();
      case 'pfister': return Story.say(SU_P.pfister, suAt('s_gans') ? 'Ich hab der Zunft alles erzählt. Und weisst du was? Der Heinivater hat gesagt, ich darf trotzdem wieder Schläger sein. Diesmal treff ich!' : 'Lass mich in Ruhe!');
      case 'stadtschreiber': return Story.say('Stadtschreiber Huber', suAt('s_gans') ? 'Die Gansabhauet ist bewilligt! Die Stadt dankt dir. Vor dem Rathaus wird schon die Gans aufgehängt.' : 'Die Stadt hat die Gansabhauet als Nachholtermin bewilligt – sobald die Sonnenmaske wieder da ist. Ohne Maske kein Schläger, so ist die Tradition seit 1880.');
      case 'polizei': return Story.say('Polizistin Fischer', suAt('s_gans') ? 'Die Maske ist wieder da? Ohne Anzeige? Die Zunft regelt das unter sich, sagt der Heinivater. Typisch Sursee.' : 'Die Zunft hat keine Anzeige gemacht. „Das regeln wir unter uns“, hat der Heinivater gesagt. Viel Glück, Detektiv.');
      case 'kapuziner': return Story.say('Museumsführerin', 'Das Kloster wurde 1606 bis 1608 gebaut. Heute ist hier das Museum der Schweizer Kapuziner. Im Klostergarten ist es herrlich ruhig – manche kommen zum Nachdenken her. Oder zum Üben.');
    }
  },
  async talkIsa() {
    const st = G.S.stage;
    if (st === 's_strahl' && hasInv('strahl')) return this.showStrahl();
    const lines = {
      s_ankunft: 'Der Diebenturm ist in der Unterstadt, beim Hirschenplatz. Die Kinder zeigen dir den Weg.',
      s_tatort: 'Schau dich in der Zunftstube gut um. Drei Spuren, hat Elin gesagt. Sie hat ein Gefühl für so was.',
      s_faehrten: `Chilbi, See und Altstadt – das sind deine drei Fährten. ${this.faehrtenDone()} von 3 hast du. Und iss zwischendurch etwas!`,
      s_strahl: 'Thierry und Louve haben im Ehret-Park etwas gefunden, sagen sie. Beim Spielplatz.',
      s_probe: 'Die Diebetormtöibeler proben ab 16 Uhr beim Untertor. Pass auf den mit der Larve auf.',
      s_boot: 'Zum See! Schnell!',
      s_gans: 'Morgen holen wir die Gansabhauet nach. Ich bin so stolz auf dich. Die Kinder auch.',
    };
    const opts = ['Wie geht es dir?', 'Wo finde ich was?', 'Einen Kaffee zusammen?', 'Tschüss'];
    const c = await askP('isa', lines[st] || (playerIsCuche() ? 'Schön, dass du da bist. Gehen wir später zusammen an die Chilbi?' : 'Fühl dich wie zu Hause. Das Gästebett ist frisch bezogen.'), opts);
    if (c === 0) await sayP('isa', pick(['Gut! Seit die Maske weg ist, ist das ganze Städtli in Aufruhr. Endlich passiert mal was.', 'Müde. Die Kinder reden von nichts anderem mehr als von Detektiven.', 'Gespannt, ob du den Fall löst. Ich wette auf dich.',
      'Homeoffice ist super: Um zehn ein Call, um elf ein Call, um zwei … ein Call. Dazwischen Wäsche.', 'Meine liebste Arbeitskollegin? Die Kaffeemaschine. Elin hat sie Bruno getauft.', 'Ich hab heute schon vier Kaffee getrunken. Oder fünf. Timo hat mitgezählt, aber er kann nur bis fünf.',
      'Elin übt jeden Abend Gitarre. Drei Akkorde. Immer dieselben drei. Ich kann sie im Schlaf.', 'Timo will nur noch Teigwaren mit Käse. Ich hab ihm Broccoli versteckt. Er hat ihn gefunden.']));
    if (c === 2) await this.kaffee(true);
    if (c === 1) await sayP('isa', 'Bars sind in der Oberstadt: TNT, El Mosquito, Craftwerk. In der Unterstadt das Rössli und La Fuga. Essen: Mühle oder Wilder Mann. Einkaufen im Surseepark beim Bahnhof. Und zum See geht\'s hinten raus über den Beckenhof und die Münstervorstadt.');
  },
  async kidTalk(k) {
    const st = G.S.stage;
    const opts = k === 'elin' ? ['Hast du einen Tipp?', 'Erzähl mal was!', 'Rechnen üben', 'Lauft mal kurz alleine heim', 'Weiter'] : ['Hast du einen Tipp?', 'Erzähl mal was!', 'Lauft mal kurz alleine heim', 'Weiter'];
    const c = await askP(k, k === 'elin' ? pick(['Papi, ich schreib alles ins Notizbuch!', 'Detektive brauchen Zvieri, Papi. Nur so als Tipp.', 'Papi, wenn wir die Maske finden, darf ich sie dann mal anprobieren?']) : pick(['Papi, ich glaub, der Täter ist der Achterbahn-Mann. Der hat eine Sonnenbrille. Im Dezember!', 'Papi, darf ich nachher auf die Putschibahn?', 'Ich bin dein Assistent, Papi. Assistent Timo.']), opts);
    const pick2 = opts[c];
    if (pick2 === 'Hast du einen Tipp?') await this.giveHint(true);
    if (pick2 === 'Erzähl mal was!') await sayP(k, this.kidFact(k));
    if (pick2 === 'Rechnen üben') await this.rechnen();
    if (pick2 === 'Lauft mal kurz alleine heim') { this.st().follow = 0; G.npcs = G.npcs.filter((n) => !n.follower); UI.toast('Elin und Timo gehen heim. In der Münstervorstadt 8 bei Isa holst du sie wieder ab.'); }
  },
  async cousinsTalk(k) {
    if (G.S.stage === 's_strahl' && !hasInv('strahl')) return this.schatzkiste();
    const s = this.st();
    if (k === 'thierry' && suAt('s_gans') && !hasInv('detektor') && !s.detGiven) {
      s.detGiven = 1; addInv('detektor');
      await sayP('thierry', 'Schau, Kari aus dem Zellmoos hat mir seinen alten Metalldetektor geschenkt! Hier, du darfst ihn haben. Im Römer-Vicus beim Bahnhof liegen bestimmt noch Münzen!');
      UI.toast('Metalldetektor erhalten. Römer-Vicus westlich der Altstadt: fünf Münzen sind versteckt.');
      return;
    }
    if (k === 'thierry') {
      const c = await askP('thierry', pick(['Ich bin ein Schatzsucher!', 'Ich kann schon bis hundert zählen. Fast.', 'Gänse sind lustig. Die machen so: GAAA!', 'Weisst du, was ein Kreiselheuer ist? Ich schon!']), ['Erzähl was vom Bauernhof!', 'Bauernhof-Quiz', 'Tschüss']);
      if (c === 0) await sayP('thierry', this.kidFact('thierry'));
      if (c === 1) await this.bauernQuiz();
      return;
    }
    await sayP(k, pick(['Meine Schatzkiste ist geheim.', 'Ich hab einen Stein gefunden, der aussieht wie ein Herz.', 'Spielst du mit uns Fangis?', this.kidFact('louve'), this.kidFact('louve')]));
  },
  async friendTalk(id) {
    const s = this.st();
    const fn = FRIENDS[id].fn;
    const opts = ['Wie gefällt dir Sursee?', 'Hilfst du mir beim Fall?', 'Ein Bier zusammen?', ...(fn === 'surfer' ? ['Fachsimpeln: Hang, Tour, Bike'] : []), 'Tschüss'];
    const first = {
      saeufer: 'Der Wilde Mann ist seit 1495 offen. Das ist Vertrauen. Ich bleib hier.', gourmet: 'Diese Pizza … der Holzofen … ich glaub, ich zieh nach Sursee.', party: 'Chilbi ist wie Club, nur mit Zuckerwatte. Ich liebe es.',
      frech: 'Ich bin dreimal Putschibahn gefahren. Der Mann an der Kasse kennt jetzt meinen Namen. Und meine Mutter.', pilot: 'Ich hab die Drohne über die Altstadt geflogen. Von oben sieht man alles. ALLES.',
      taenzer: 'Rössli Nightbar. Ich sag nur: Schlager-Nacht. Ich war der König.', charmeur: 'Die Barfrau im Rössli hat gelacht. Zweimal. Das zählt.', muskel: 'Bin am See. Wenn du ein Boot brauchst, ich steuer.',
      kanadier: 'This lake is nice, eh. Like Canada, but smaller. And everything is closed at 6.', raucher: 'Ich steh hier beim Diebenturm. Hab da in Innsbruck … egal. Hier ist gut rauchen.', anwalt: 'Wenn du jemanden anklagst, brauchst du drei Beweise. Nicht zwei. Drei.', surfer: 'Sempachersee, null Wind, null Welle. Ich bin trotzdem aufs SUP. Im Neopren. Die Schwäne fanden\'s lustig.', kassier: 'Isa hat gesagt, ich soll den Detektiv nicht stören. Also: Ich stör nicht.',
    }[fn] || 'Sursee ist herzig.';
    const c = await Story.ask(id, first, opts);
    if (c === 0) await Story.say(id, pick(['Kleiner als Innsbruck, aber das Bier ist näher.', 'Die Altstadt ist schön. Und der See! Im Sommer kommen wir wieder.', 'Hier kennt jeder jeden. Die Wirtin wusste schon meinen Namen.']));
    if (c === 1) await Story.say(id, this.friendHint(id));
    if (fn === 'surfer' && c === 3) await Story.fibuTalk(id);
    if (c === 2) { if (pay('chf', 6.8)) { consume('lager'); Story.friendDrink(id, 0.24); Snd.sfx('clink'); await Story.say(id, 'Prost! Auf Sursee. Und auf den Detektiv.'); G.S.aff[id] = clamp((G.S.aff[id] || 50) + 4, 0, 100); } else UI.toast('Zu wenig Franken.', 'warn'); }
  },
  friendHint(id) {
    const s = this.st(), fn = FRIENDS[id].fn, st = G.S.stage;
    if (fn === 'raucher' && suAt('s_faehrten') && !s.yaennuSaid) { s.yaennuSaid = 1; this.note('yaennu', `${fname(id)}: Nachts beim Diebenturm riecht es nach See – und nach Ventilöl wie bei Blasinstrumenten.`); return 'Ich steh oft hier zum Rauchen. Weisst du, was komisch ist? Die Zunftstube riecht nach Ventilöl. Wie bei Trompeten. Oder Sousaphonen.'; }
    if (fn === 'pilot' && suAt('s_faehrten') && !s.droneSaid) { s.droneSaid = 1; this.note('drohne', `${fname(id)}: Die Drohne hat auf dem Gamma-Inseli eine Plane und Fussspuren gesehen.`); return 'Meine Drohne war über dem See. Auf dem Gamma-Inseli liegt eine Plane zwischen den Bäumen. Wer zeltet im Dezember auf einer Insel?'; }
    if (fn === 'anwalt') return suAt('s_boot') ? 'Bei der Anklage: drei Beweise, die alle auf dieselbe Person zeigen. Nicht raten.' : 'Sammle Beweise, nicht Vermutungen. Im Notizbuch siehst du, was du hast.';
    if (fn === 'muskel' && st === 's_boot') return 'Ab in ein Elektroboot! Ich steuer, du schaust.';
    return this.hintText(1);
  },
  async talkAlter() {
    const s = this.st();
    if (s.sageHeard) { await Story.say(SU_P.heinivater.name === 'Heinivater' ? 'Älterer Herr' : 'Älterer Herr', 'Schöne Fahrt. Grüssen Sie mir Sursee.'); return; }
    s.sageHeard = 1;
    await UI.say({ name: 'Älterer Herr mit Abzeichen', look: SU_P.heinivater.look, bg: SU_P.heinivater.bg }, 'Sie fahren nach Sursee? Dann kennen Sie die Geschichte von Heini? Nein? Hören Sie zu.');
    await UI.say({ name: 'Älterer Herr mit Abzeichen', look: SU_P.heinivater.look, bg: SU_P.heinivater.bg }, 'Herzog Leopold III. zog 1386 nach Sempach in die Schlacht. Mit dabei: sein Narr Heini aus Uri. Der sagte seinem Herrn immer die Wahrheit – und riet ihm vom Kampf ab.');
    await UI.say({ name: 'Älterer Herr mit Abzeichen', look: SU_P.heinivater.look, bg: SU_P.heinivater.bg }, 'Der Herzog schickte ihn nach Sursee, dort sollte er den Ausgang abwarten. Seither heisst unsere Fasnachtszunft „Heini von Uri“. 150 Jahre dieses Jahr. Gegründet 1876.');
    await UI.say({ name: 'Älterer Herr mit Abzeichen', look: SU_P.heinivater.look, bg: SU_P.heinivater.bg }, 'Ein Narr sagt immer die Wahrheit. Merken Sie sich das. Man sieht sich.');
    this.note('sage', 'Sage: Der Narr Heini sagte dem Herzog immer die Wahrheit. Die Zunft heisst nach ihm.');
  },

  /* ---------- Tatort Diebenturm ---------- */
  async tatortStart() {
    if (G.S.stage !== 's_ankunft') return;
    G.busy++;
    await sayP('heinivater', `Da seid ihr! Ich bin der Heinivater der Zunft Heini von Uri. Sie müssen ${G.S.name} sein – Isa hat Sie angekündigt. Willkommen in der Zunftstube.`);
    await sayP('heinivater', 'Hier, in dieser Vitrine, lag die Sonnenmaske. Seit 1880 tragen unsere Schläger an der Gansabhauet die Maske und den roten Mantel. Die Zunft kleidet sie ein und hängt die Gans auf. Und jetzt? Leer.');
    await sayP('heinivater', 'Die Polizei haben wir nicht geholt. Das regeln wir unter uns – und mit Ihnen. Suchen Sie den Raum ab. Wenn etwas glitzert, schauen Sie genau hin.');
    await kidSay('elin', 'Papi, drei Spuren! Ich spür das. Drei.');
    this.setStage('s_tatort');
    G.busy--;
    saveGame(true);
  },
  async clue(id) {
    const s = this.st();
    if (s.clues[id]) return;
    s.clues[id] = 1; Snd.sfx('ok');
    const [n, d] = SU_CLUES[id];
    await Story.say(null, `<em>${n}</em> – ${d}`);
    this.note('clue_' + id, `Spur: ${n}`);
    const k = Object.keys(s.clues).length;
    if (k < 3) { await kidSay(k === 1 ? 'timo' : 'elin', k === 1 ? 'Eine! Noch zwei!' : 'Noch eine Spur! Schau überall, wo es glitzert.'); return; }
    achieve('su_spuren');
    await sayP('heinivater', 'Eine Gänsefeder, ein Achterbahn-Jeton und ein Quittungsfetzen von der Bootsvermietung. Das sind drei Fährten: Chilbi, See – und die Altstadt, denn die Maske kam aus dem Sankturbanhof, und der rote Mantel …');
    await sayP('heinivater', 'Ach ja: Auch ein roter Mantel fehlt. Nicht unserer – einer aus dem Fundus des Stadttheaters. Die Kostümbildnerin Bea hat es gemeldet.');
    await sayP('heinivater', 'Verdächtige gibt es genug. Roli von der Achterbahn. Bea vom Theater. Kari, der Schatzsucher im Zellmoos. Und Ruedi Pfister – unser ewiger Pechvogel. Zwanzig Jahre Schläger, nie getroffen.');
    for (const sp of SU_SUSPECTS) this.note('sus_' + sp.k, `Verdächtig: ${sp.n}`);
    await kidSay('timo', 'Ich schreib alle auf, Papi! Das Notizbuch ist in deinem Handy.');
    this.setStage('s_faehrten');
    UI.toast('Drei Fährten: Chilbi auf dem Märtplatz · See (Bootsvermietung am Quai) · Altstadt (Sankturbanhof und Stadttheater). Reihenfolge egal.');
    saveGame(true);
  },
  async look(key) {
    const s = this.st();
    const L = {
      vitrine: suAt('s_gans') ? 'Die Sonnenmaske liegt wieder in ihrer Vitrine. Golden, mit einem frisch angelöteten Strahl.' : 'Die Vitrine ist leer. Auf dem roten Samt sieht man noch den Abdruck der Maske – und einen kleinen Kratzer, als wäre etwas abgebrochen.',
      ratssaal: 'Der Ratssaal: Holztäfer, das Stadtwappen in Rot und Weiss, Porträts früherer Schultheissen. Hier entscheidet der Stadtrat.',
      ausstellung: pick(['Eine Ausstellung lokaler Malerinnen: der Sempachersee in allen Jahreszeiten.', 'Fotografien vom Städtli in den Fünfzigerjahren. Erstaunlich wenig hat sich verändert.', 'Ölbilder vom Märtplatz an der Chilbi. Das Riesenrad in Rosa und Gold.']),
      billard: 'Ein Billardtisch mit grünem Filz. Jemand hat mit Kreide „TNT RULES“ auf die Bande geschrieben.',
      gehege: 'Ein Bauernhof am Stadtrand. Im Gehege schnattern Gänse. Eine schaut dich an, als wüsste sie, was am Martinstag passiert.',
      gaerten: 'Familiengärten an der Sure. Im Dezember ruhen die Beete, nur der Grünkohl steht noch.',
      vicus: 'Tafel: „Römischer Vicus Sursee. Im 1. bis 3. Jahrhundert lag hier, westlich der heutigen Altstadt, eine Siedlung mit Handwerkern und einem Markt, Holz- und Steinbauten an einer Strasse.“',
      markt: 'Wochenmarkt auf dem Martigny-Platz: Gemüse, Käse, Brot, Blumen. Im Winter riecht es nach Marroni.',
      pfarreizentrum: 'Das neue Pfarreizentrum am Vierherrenplatz. Im Saal proben manchmal auch die Guuggen – heute nicht.',
      bahnhof: pick(['Bahnhof Sursee: SBB-Schalter, Wartsaal, Fahrplan an der Wand. Draussen stehen die Velos dicht an dicht.', 'Über der Tür das rote SBB-Logo und das blaue Ortsschild. Die Bahnhofsuhr springt auf die nächste Minute – pünktlich, wie immer.', 'Im Schaufenster hängt der Fahrplan der S-Bahn nach Luzern. Heim kommst du jederzeit, aber noch nicht jetzt.']),
      billettautomat: 'Ein Billettautomat der SBB. „Sursee → Luzern, 2. Klasse“ blinkt auf dem Bildschirm. Ein anderes Mal.',
      dreiklang: pick(['Der Dreiklang gegenüber vom Surseepark: drei helle Bauten – ein Hochhaus, ein kleinerer Turm und dazwischen ein langer, flacher Riegel. Unten Läden und Büros, oben Wohnungen mit Blick über das Städtli.', 'Vom Hochhaus des Dreiklangs sieht man bestimmt bis zum Sempachersee. Der Lift ist leider nur für Bewohner.', 'Zwischen den drei Bauten zieht der Wind durch. Ein Velokurier flitzt vorbei.']),
      stadthof: pick(['Der Stadthof am Martigny-Platz: ein heller Betonwürfel mit hohen Pfeilern, oben eine offene Pergola über der Dachterrasse. Unten Reisebüro, Coiffeur, Versicherung und Praxen.', 'Im Schaufenster vom Reisebüro hängt ein Plakat: „Innsbruck – Weihnachtsmärkte und Bergisel“. Du lachst kurz.', 'Unter den Arkaden des Stadthofs ist es windstill. Ein Velo lehnt an einem der weissen Pfeiler.']),
      homeoffice: `Isas Homeoffice: Laptop mit einem Videocall voller kleiner Gesichter, ein Headset, Post-its mit „Call 14:00!!“. Daneben ${3 + ((this.st().isaKaffee || 0) % 4)} leere Kaffeetassen.`,
      scheune: 'Die Scheune vom Gänsehof: ein Traktor mit Frontlader, ein Ladewagen, ein Kreiselheuer und ein Schwader. Im Dezember ruhen die Maschinen.',
      kita: 'Die Kita Villa Luna beim Märtplatz: eine helle Villa mit blauen Läden, Rosenbogen über der Tür und einer Tafel voller bunter Punkte. Gummistiefel in allen Grössen vor der Tür. Hier geht Timo hin.',
      poller: this.pollerBroken() ? `Der Versenkpoller beim Untertor liegt schief. Daneben ein Hütchen und ein Zettel vom Werkhof: „Defekt. Schon wieder.“ Am Laternenpfahl führt jemand eine Strichliste: ${'|'.repeat(Math.min(30, 11 + (this.st().pollerN || 0)))}` : 'Ein Versenkpoller beim Untertor. Er fährt hoch, damit keine Autos in die Altstadt fahren. Leider merken das nicht alle Autos rechtzeitig. Und das Postauto auch nicht.',
      lichthof: pick(['Durch die Glasbrüstung siehst du ins Erdgeschoss: der Christbaum, die Leute mit ihren Einkaufstaschen, ganz klein.', 'Unten beim Kiosk winkt jemand. Wahrscheinlich nicht dir.', 'Von hier oben sieht der Christbaum aus wie ein grüner Kreisel mit Lämpchen.']),
      passerelle: 'Die Glas-Passerelle führt über die Strasse zum Parkhaus. Unten fährt gerade ein Postauto vorbei. Ohne Poller.',
      sportplatz: 'Der rote Sportplatz bei der Stadthalle. Im Sommer Leichtathletik, im Winter nur Krähen.',
      vierherrenplatz: 'Der Vierherrenplatz hinter dem Wilden Mann: neu gestaltet, mit Pfarreizentrum, Wohn- und Geschäftshaus und einer Tiefgarage darunter.',
      kirche: 'Die Stadtkirche St. Georg. Drinnen ist es still, Kerzen flackern. Du zündest eine an – für die Gans. Oder gegen sie?',
      marienbrunnen: 'Der Marienbrunnen: Säule und Marienfigur von Meister Hans Spichtig, 1688. Ein Brunnen an dieser Stelle ist schon 1596 erwähnt. Das Wasser plätschert, auch im Dezember.',
      heinibrunnen: 'Der Heinibrunnen: Heini von Uri, der Narr mit der Schellenkappe, vom Bildhauer August Bläsi (1979). Früher stand der Brunnen vor dem Rathaus, seit 2001 hier am Vierherrenplatz.',
      murihof: 'Der Murihof an der Theaterstrasse 2: früher Stadtburg der Kyburger und Habsburger, dann Hof des Klosters Muri. Das älteste Steingebäude der Altstadt. Drinnen ein festlicher Barocksaal mit Deckengemälde.',
      hirschen: 'Hotel Hirschen, Oberstadt 10. Unten eine Wein- und Cocktailbar. Über der Tür ein geschmiedetes Wirtshausschild, wie überall in der Oberstadt.',
      diebenturm: 'Der Diebenturm von 1681, einst Gefängnis- und Pulverturm. Im Turm liegen heute Archiv und Sitzungszimmer der Turner. Die Zunftstube ist nebenan im ersten Stock des alten Waschhauses.',
      muehlerad: 'Ein altes Mühlerad an der Sure. Hier am Mühleplatz stand früher die Mühle, die dem Platz den Namen gab.',
      hirschenplatz: 'Der Hirschenplatz in der Unterstadt, gleich beim Diebenturm.',
      spielplatz: 'Schaukel, Rutschbahn, Sandkasten. Im Sand liegen Schaufeln – und Spuren von Kinderstiefeln.',
      beckenhof: 'Der Beckenhof mit dem Städtlipark. Von hier geht es durch das neue Quartier Münstervorstadt Richtung See.',
      muenstervorstadt: 'Das neue Quartier Münstervorstadt zwischen Altstadt und See: vier olivgrüne Häuser, Nummer 2, 4, 6 und 8. In der Nummer 8 wohnt Isa mit den Kindern.',
      suhre: 'Hier fliesst die Suhre aus dem Sempachersee – durch Sursee nach Norden, bis in die Aare.',
      zellmoos: 'Naturschutzgebiet Zellmoos: das grösste naturnahe Ufer am Sempachersee. Schilf, Weiden, Wasservögel. Bitte auf den Wegen bleiben.',
      mariazell: 'Die Wallfahrtskirche Mariazell über dem See. Von hier oben sieht man den ganzen Triechter.',
      inseli: suAt('s_boot') ? 'Das Gamma-Inseli. 184 m², hohe Bäume. Von hier aus winzig.' : 'Das Gamma-Inseli draussen vor dem Triechter. 184 Quadratmeter, hohe Bäume. Nachts sieht man manchmal ein Licht, sagen die Fischer.',
      besucherbuch: () => this.besucherbuch(),
      fundus: () => this.fundus(),
      roemervitrine: `Eine Vitrine mit römischen Funden aus dem Vicus: Scherben, eine Fibel, Werkzeug. Fünf Münzplätze, ${s.coins.length} davon belegt.${s.coins.length >= 5 ? ' Daneben ein Schild: „Gefunden von ' + G.S.name + '“.' : ''}`,
      klosterbank: () => this.klosterbank(),
    };
    const v = L[key];
    if (typeof v === 'function') return v();
    await Story.say(null, v || 'Nichts Besonderes.');
    if (key === 'kirche') mood(2);
  },

  /* ---------- Fährte Chilbi ---------- */
  async talkRoli() {
    const s = this.st();
    if (!suAt('s_faehrten') || s.f.roli) {
      const c = await askP('roli', s.f.roli ? 'Na, Detektiv? Noch eine Runde LOOPING? Fünf Franken.' : 'LOOPING! Die schnellste Achterbahn der Innerschweiz. Na gut, eine der schnelleren. Fünf Franken!', ['Einsteigen (5 CHF)', 'Nein danke']);
      if (c === 0) await this.achterbahn();
      return;
    }
    if (!s.clues.jeton) { await sayP('roli', 'Was schaust du so? Willst du fahren oder nicht?'); return; }
    await sayP('roli', 'Ein Jeton von mir! „LOOPING – Freifahrt“. Die gibt es nur für Jahresabos. Und ich hab genau einen Kunden mit Jahresabo.');
    await sayP('roli', 'Aber Moment: Ich verrat doch keine Kunden. Ausser … du fährst einmal mit. Und am Ende lachst du auf dem Foto. Abgemacht?');
    const ok = await this.achterbahn(true);
    if (!ok) return;
    await sayP('roli', 'Hahaha, das Foto! Also gut: Mein Jahresabo-Kunde fährt jeden Abend, immer allein, immer mit so einem langen roten Mantel. Sagt nach jeder Fahrt: „Pech gehabt.“ Den Namen kenn ich nicht. Aber er spielt Sousaphon – ich hör ihn manchmal hinter der Kirche üben.');
    await sayP('roli', 'Und wenn du ihn suchst: Vom Riesenrad aus sieht man nachts den ganzen See. Nelly hat mir erzählt, auf dem Gamma-Inseli brennt manchmal ein Licht.');
    s.f.roli = 1; this.evid('jeton');
    this.note('f_roli', 'Chilbi: Der Jeton gehört einem Stammgast mit Jahresabo – roter Mantel, spielt Sousaphon, sagt „Pech gehabt“.');
    this.checkFaehrten();
  },
  async achterbahn(story) {
    if (!isOpen('chilbi')) { await Story.say(null, 'Die Chilbi ist zu. Offen 10–24 Uhr.'); return false; }
    if (!pay('chf', 5)) { UI.toast('Fünf Franken fehlen.', 'warn'); return false; }
    const r = await this.mini('achterbahn');
    achieve('su_achterbahn'); mood(8); G.S.st.nau = clamp(G.S.st.nau + (G.S.st.prom > 1 ? 18 : 6), 0, 140);
    if (r && r.score != null) UI.toast(`Fahrtfoto: ${r.score} Punkte`);
    if (G.S.st.nau > 85) await Story.say('me', 'Uff. Ich glaub, das Zuckerwatte war keine gute Idee.');
    return true;
  },
  async riesenrad() {
    const s = this.st();
    if (!isOpen('chilbi')) { await Story.say(null, 'Die Chilbi ist zu. Offen 10–24 Uhr.'); return; }
    const story = G.S.stage === 's_faehrten' && s.f.roli && !s.f.rad;
    const c = await askP('riesenrad', story ? 'Hoch hinaus? Nachts sieht man den ganzen See. Sechs Franken.' : 'Eine Runde Riesenrad? Sechs Franken. Ganz oben bleibt es kurz stehen. Extra für Verliebte und Detektive.', ['Einsteigen (6 CHF)', 'Nein danke']);
    if (c !== 0) return;
    if (!pay('chf', 6)) { UI.toast('Sechs Franken fehlen.', 'warn'); return; }
    if (story && !(isNight() || hourOf(G.S.time) >= 17)) {
      await Scene.play('lift', { text: 'Das Riesenrad dreht sich langsam über den Märtplatz …', ms: 2600 });
      achieve('su_riesenrad'); mood(6);
      await Story.say('me', 'Schöne Aussicht. Aber am Tag sieht man auf dem See kein Licht. Ich komm am Abend wieder, nach 17 Uhr.');
      return;
    }
    const r = await this.mini('riesenrad');
    achieve('su_riesenrad'); mood(6);
    if (story) {
      if (r && r.found === false) { await Story.say('me', 'Ich hab das Licht nicht gefunden. Nochmal versuchen – es blinkt irgendwo draussen auf dem See.'); return; }
      await Story.say('me', 'Da! Draussen auf dem See, auf dem Gamma-Inseli, blinkt eine Taschenlampe. Wer ist um diese Zeit auf der Insel?');
      s.f.rad = 1; this.evid('rad');
      this.note('f_rad', 'Chilbi: Vom Riesenrad aus ein Licht auf dem Gamma-Inseli gesehen.');
      this.checkFaehrten();
    }
  },
  /* ---------- Fährte See ---------- */
  async bootsverleih() {
    const s = this.st();
    const storyLog = G.S.stage === 's_faehrten' && !s.f.log;
    const opts = [];
    if (storyLog) opts.push({ t: s.clues.quittung ? 'Quittungsfetzen zeigen' : 'Nach der Nacht vor dem Martinstag fragen', k: 'log' });
    if (G.S.stage === 's_boot') opts.push({ t: 'Elektroboot: dem Flüchtigen nach!', k: 'jagd' });
    opts.push({ t: 'Pedalo mieten (12 CHF)', k: 'pedalo' }, { t: 'Elektroboot mieten (25 CHF)', k: 'motor' });
    if (suAt('s_gans')) opts.push({ t: 'Elektroboot zum Gamma-Inseli (25 CHF)', k: 'inseli' });
    opts.push({ t: 'Nichts', k: 'x' });
    const c = await Story.ask('Bootsvermieter Sepp', isOpen('boote') ? 'Grüezi! Im Winter vermiete ich nur wegen der Chilbi. Pedalo oder Elektroboot?' : 'Jetzt ist zu. Die Boote gibt\'s von 9 bis 17 Uhr.', isOpen('boote') || storyLog ? opts.map((o) => o.t) : ['Okay']);
    if (!isOpen('boote') && !storyLog) return;
    const k = opts[c] && opts[c].k;
    if (k === 'log') {
      if (!s.clues.quittung) { await Story.say('Bootsvermieter Sepp', 'Ohne Quittung kann ich dir nicht sagen, wer wann wo war. Datenschutz, weisch.'); return; }
      await Story.say('Bootsvermieter Sepp', 'Das ist von mir, ja. Boot 7. Moment, das Logbuch … Nacht vom 10. auf den 11. November. Rausgegangen um 23 Uhr, zurückgebracht um 4 Uhr früh. Das Boot war nass innen, und auf dem Sitz lag eine Gänsefeder.');
      await Story.say('Bootsvermieter Sepp', 'Unterschrieben hat er mit „R. P.“. Mehr weiss ich nicht. Ich frag die Leute nicht aus, die mitten in der Nacht Boote mieten. Wer das macht, hat seine Gründe.');
      s.f.log = 1; this.evid('log');
      this.note('f_log', 'See: Logbuch – Boot 7 in der Nacht vor dem Martinstag, unterschrieben „R. P.“.');
      this.checkFaehrten();
      return;
    }
    if (k === 'jagd') return this.bootsjagd();
    if (k === 'pedalo') { if (!pay('chf', 12)) { UI.toast('Zu wenig Franken.', 'warn'); return; } const r = await this.mini('pedalo'); if (r && r.ok) { achieve('su_pedalo'); UI.toast(`Einmal ums Gamma-Inseli in ${r.time.toFixed(1)} s!`); } mood(5); return; }
    if (k === 'motor') { if (!pay('chf', 25)) { UI.toast('Zu wenig Franken.', 'warn'); return; } const r = await this.mini('motorboat'); if (r) UI.toast(`Slalom: ${r.time ? r.time.toFixed(1) + ' s' : ''}${r.hits ? `, ${r.hits} Bojen touchiert` : ', fehlerfrei!'}`); mood(6); return; }
    if (k === 'inseli') { if (!pay('chf', 25)) { UI.toast('Zu wenig Franken.', 'warn'); return; } await Scene.play('boat', { text: 'Mit dem Elektroboot zum Gamma-Inseli …', ms: 2200, keep: true }); enterMap('inseli', 'landing'); await UI.fadeIn(); return; }
  },
  async talkFischer() {
    const s = this.st();
    const story = G.S.stage === 's_faehrten' && !s.f.fischer;
    if (story && hasInv('felchen')) {
      takeInv('felchen');
      await Story.say('Fischer Wäli', 'Ein Felchen! Schön, schön. Also gut, ich erzähl dir was. In der Nacht vor dem Martinstag war ich draussen, Netze kontrollieren. Da fuhr ein Elektroboot ohne Licht Richtung Gamma-Inseli.');
      await Story.say('Fischer Wäli', 'Und im Boot hat etwas geglänzt. Golden. Wie eine kleine Sonne. Ich dachte zuerst, ich hab zu viel Kafi Lutz gehabt.');
      s.f.fischer = 1; this.evid('fischer');
      this.note('f_fischer', 'See: Fischer Wäli sah nachts ein Boot ohne Licht mit goldenem Schimmer Richtung Gamma-Inseli.');
      this.checkFaehrten();
      return;
    }
    if (story) { await Story.say('Fischer Wäli', 'Reden? Ich red nicht mit Leuten, die nicht fischen. Bring mir einen Felchen, dann reden wir. Ruten und Köder gibt\'s im Surseepark, aber du kannst auch hier vom Quai aus fischen. Ich leih dir meine Rute.'); return; }
    await Story.say('Fischer Wäli', pick(['Felchen, Egli, Hecht. Der Sempachersee ist gut zu uns.', 'Im Winter beissen sie langsam. Wie ich.', 'Siehst du die Möwen? Wo Möwen sind, ist Fisch.']));
  },
  async fish(spot) {
    const st = G.S.stage;
    const r = await this.mini('fishing', spot);
    if (!r) return;
    if (r.fish === 'hecht') achieve('su_hecht');
    if (r.felchen || r.fish === 'felchen') { achieve('su_fisch'); addInv('felchen'); UI.toast('Ein Felchen! Für Fischer Wäli?'); }
    else if (r.fish === 'egli') UI.toast(`Ein Egli, ${r.cm} cm. Schön, aber Wäli will einen Felchen.`);
    else if (r.fish === 'schuh') UI.toast('Ein alter Schuh. Immerhin in deiner Grösse.');
    mood(4); passTime(15);
  },
  /* ---------- Fährte Altstadt ---------- */
  async talkMuseum() {
    const s = this.st();
    if (G.S.stage === 's_faehrten' && !s.f.buch) { await Story.say('Museumswärter Bruno', 'Die Jubiläumsausstellung „zünftig“ war ein Riesenerfolg, darum haben wir sie bis Ende November verlängert. Die Sonnenmaske lag in der Mitte. Ein Besucher kam fast jeden Tag. Steht alles im Besucherbuch.'); return; }
    await Story.say('Museumswärter Bruno', 'Der Sankturbanhof war früher der Verwaltungshof des Klosters St. Urban. Heute zeigen wir Kunst und die Geschichte von Sursee.');
  },
  async besucherbuch() {
    const s = this.st();
    if (G.S.stage !== 's_faehrten' || s.f.buch) { await Story.say(null, 'Das Besucherbuch. Viele Einträge: „Wunderschön!“, „Zünftig!“, „Hopp Heini!“'); return; }
    await Story.say(null, 'Das Besucherbuch der Ausstellung. Seite um Seite: „Toll!“, „Zünftig!“ … und immer wieder dieselbe Handschrift: „R. Pfister – heute wieder vor der Sonnenmaske. Einmal tragen. Nur einmal.“ Dreiundzwanzig Einträge.');
    s.f.buch = 1; this.evid('buch');
    this.note('f_buch', 'Altstadt: Im Besucherbuch steht 23-mal „R. Pfister – vor der Sonnenmaske. Einmal tragen.“');
    this.checkFaehrten();
  },
  async talkBea() {
    const s = this.st();
    if (G.S.stage === 's_faehrten' && !s.f.fundus) { await Story.say('Kostümbildnerin Bea', 'Ja, ein roter Mantel fehlt im Fundus! Aus einer alten Operetten-Produktion. Ich war es nicht, falls du das denkst – in jener Nacht hatten wir Probe bis Mitternacht, frag das ganze Ensemble. Schau dir den Bügel an.'); this.evid('bea'); return; }
    await Story.say('Kostümbildnerin Bea', pick(['Ein Theater ohne Fundus ist wie eine Fasnacht ohne Guuggen.', 'Du brauchst ein Kostüm? Für die Fasnacht gibt\'s den Kostümverleih. Hier wird nur geliehen, wenn man fragt.']));
  },
  async fundus() {
    const s = this.st();
    if (G.S.stage !== 's_faehrten' || s.f.fundus) { await Story.say(null, 'Rote Mäntel, ordentlich aufgereiht.'); return; }
    await Story.say(null, 'An einem leeren Bügel hängt ein Zettel, mit Bleistift geschrieben: „Bringe den Mantel nach der Gansabhauet zurück. Versprochen. R.“');
    s.f.fundus = 1; this.evid('fundus');
    this.note('f_fundus', 'Altstadt: Zettel im Fundus – „Bringe den Mantel nach der Gansabhauet zurück. R.“');
    this.checkFaehrten();
  },
  async talkKari() {
    const s = this.st();
    if (suAt('s_faehrten') && !s.kari) { s.kari = 1; this.evid('kari'); this.note('kari', 'Kari sucht im Zellmoos Römermünzen, kein Gold.'); }
    await Story.say('Schatzsucher Kari', suAt('s_faehrten') ? 'Gold? Masken? Ich such Römermünzen! Westlich der Altstadt lag ein römischer Vicus. Hier im Zellmoos find ich höchstens Kronkorken. Aber mein Detektor piepst bei allem.' : 'Psst. Hier liegt etwas. Ich spür es.');
  },
  async checkFaehrten() {
    const n = this.faehrtenDone();
    this.prog();
    if (n < 3) { UI.toast(`Fährten: ${n}/3`); saveGame(true); return; }
    achieve('su_faehrten');
    await kidSay('elin', 'Papi, alle drei Fährten! R. P., roter Mantel, Sousaphon, Gamma-Inseli … Mami muss das hören!');
    Snd.sfx('blip');
    await sayP('isa', '📱 Thierry und Louve rufen die ganze Zeit an! Sie haben im Ehret-Park etwas Goldenes gefunden. Beim Spielplatz!');
    this.setStage('s_strahl');
    saveGame(true);
  },
  /* ---------- Louves Schatzkiste ---------- */
  async schatzkiste() {
    await sayP('louve', 'Schau mal in meine Schatzkiste! Aber nicht anfassen. Doch, du darfst.');
    await Story.say(null, 'In der Blechdose: drei Kastanien, ein Herzstein, ein Glasmurmel – und ein goldener, gezackter Strahl aus dünnem Blech. Wie ein Sonnenstrahl.');
    await sayP('thierry', 'Den haben wir am Ufer gefunden, da wo die Sure vom See kommt! Unter der Brücke. Ist das ein Schatz?');
    addInv('strahl'); this.evid('strahl');
    this.note('strahl', 'Goldener Strahl der Sonnenmaske – gefunden von Thierry und Louve an der Sure im Ehret-Park. Der Dieb kam vom See.');
    Snd.sfx('win');
    await sayP('timo', 'Papi, das ist von der Maske! Zeig es Mami!');
    this.prog();
    saveGame(true);
  },
  async showStrahl() {
    await sayP('isa', 'Ein Strahl von der Sonnenmaske! Und alles zeigt auf „R. P.“ … Ruedi Pfister? Unser Pechvogel? Der spielt Sousaphon bei den Diebetormtöibelern!');
    await sayP('isa', 'Die Guuggen proben heute Abend beim Untertor. Ab 16 Uhr. Wenn er da ist, nimmt er bestimmt nie die Larve ab …');
    this.setStage('s_probe');
    saveGame(true);
  },
});

/* ============ Probe, Verfolgung, See, Anklage, Finale ============ */
/* Larven (Fasnachtsmasken) und Instrumente der Guuggenmusig, über die Figur gezeichnet */
function drawLarve(c, x, y, a) {
  const hy = y - 25 + (a.moving ? Math.floor(G.t * 8) % 2 : 0);
  const col = a.larve || '#e8c23a';
  E(c, x, hy + 6, 6, 7, col); E(c, x, hy + 6, 5, 6, shade(col, 0.15));
  R(c, x - 4, hy + 4, 3, 2, '#1a1a1a'); R(c, x + 1, hy + 4, 3, 2, '#1a1a1a'); E(c, x, hy + 10, 2, 1, '#8a1e1e');
  for (let k = -5; k <= 5; k += 2) R(c, x + k, hy - 2 - Math.abs(k) * 0.4, 1, 3, a.larve2 || '#c8302a');
  const ins = a.instr;
  if (ins === 'sousa') { c.strokeStyle = '#e8c84a'; c.lineWidth = 2; c.beginPath(); c.arc(x, y - 14, 8, 0.4, 5.5); c.stroke(); E(c, x + 6, y - 27, 6, 4, '#f2d860'); E(c, x + 6, y - 27, 4, 2, '#3a3020'); }
  else if (ins === 'pauke') { E(c, x, y - 9, 6, 4, '#c8302a'); E(c, x, y - 11, 6, 2, '#f4f0e6'); if (Math.floor(G.t * 4) % 2) line(c, x - 6, y - 16, x - 2, y - 12, '#8a6a3a'); }
  else if (ins === 'trompete') { R(c, x + 3, y - 18, 8, 2, '#e8c84a'); E(c, x + 11, y - 17, 2, 3, '#f2d860'); }
}
/* Instrumente der Band, in Spielfiguren-Koordinaten (x, y = Füsse); während des Konzerts wippen alle im Takt */
function drawBandInstr(c, x, y, a) {
  const beat = Math.floor(G.t * 2.4 + a.x * 0.013) % 2;
  if (a.live) a.pose = a.instr === 'mikro' ? (beat ? 'danceA' : 'danceB') : a.instr === 'trommle' ? 'stand' : (beat ? 'walkA' : 'walkB');
  const ins = a.instr;
  if (ins === 'gitarre' || ins === 'bass') { const col = ins === 'bass' ? '#2a2a2e' : '#c8302a'; line(c, x - 3, y - 12, x + 9, y - 19, '#5a3a24'); E(c, x - 2, y - 10, 4, 3, col); E(c, x - 4, y - 9, 3, 3, col); R(c, x + 8, y - 21, 2, 3, '#2a2a2e'); }
  else if (ins === 'oergeli') { R(c, x - 6, y - 15, 12, 7, '#c8302a'); for (let k = -5; k < 6; k += 2) R(c, x + k, y - 15, 1, 7, '#8a1a1a'); R(c, x - 7, y - 15, 2, 7, '#2a2a2e'); R(c, x + 5, y - 15, 2, 7, '#2a2a2e'); for (let k = 0; k < 3; k++) P(c, x - 6, y - 14 + k * 2, '#f4f0e6'); }
  else if (ins === 'trommle') { const up = Math.floor(G.t * 6) % 2; line(c, x - 2, y - 14, x - 8, y - 18 - up * 3, '#c8a060'); line(c, x + 2, y - 14, x + 8, y - 18 - (1 - up) * 3, '#c8a060'); }
  else if (ins === 'tech') { R(c, x + 3, y - 22, 6, 1, '#2a2a2e'); E(c, x + 9, y - 22, 2, 2, '#2a2a2e'); R(c, x - 6, y - 12, 4, 6, '#3a3a40'); }
  if (a.live && Math.floor(G.t * 1.5 + a.x * 0.01) % 3 === 0) { const col = ['#ff6ab0', '#6ae0ff', '#ffe05a'][Math.floor(a.x) % 3], ny = y - 32 - Math.floor(G.t * 4) % 3; E(c, x + 7, ny + 6, 2, 1.5, col); R(c, x + 8, ny, 1, 6, col); R(c, x + 8, ny, 3, 1, col); }
}
Object.assign(Sur, {
  spawnGuuggen() {
    const cols = [['#e8c23a', '#c8302a', 'pauke'], ['#3f8ec8', '#f4f0e6', 'trompete'], ['#e3589c', '#ffd23d', 'trompete'], ['#3f8e4b', '#c8302a', 'pauke'], ['#f4f0e6', '#2f5fb8', 'sousa']];
    const pos = [[53, 46], [54, 47], [55, 46], [56, 47], [55, 48]];
    cols.forEach(([c1, c2, ins], i) => {
      const pf = ins === 'sousa';
      const a = new Actor({ id: pf ? 'su_sousa' : 'su_guugge' + i, name: pf ? 'Sousaphonist mit Larve' : 'Diebetormtöibeler', look: npcLook(4100 + i, { top: 4, topCol: [3, 9, 12, 6, 13][i], pants: 4, pantsCol: 2, hat: 0 }), x: pos[i][0] * 16 + 8, y: pos[i][1] * 16 + 12, dir: 0, solid: true, keepDir: true, larve: c1, larve2: c2, instr: ins, extra: drawLarve, bubbleRand: ['note'], danceIdle: !pf,
        talk: () => (pf ? this.sousaphonist() : this.guuggenTalk()), label: pf ? 'Den Sousaphonisten ansprechen' : 'Reden: Diebetormtöibeler' });
      G.npcs.push(a);
    });
  },
  async guuggenTalk() {
    const c = await Story.ask('Diebetormtöibeler', 'Wir sind die Diebetormtöibeler, benannt nach dem Diebenturm! Wir proben schon für die Fasnacht. Willst du mitschränzen?', ['Mitspielen', 'Lieber zuhören']);
    if (c === 0) { const r = await this.mini('rhythm', 'guugge'); if (r && r.pct >= 50) achieve('su_guugge'); mood(8); UI.toast(r ? `Takt getroffen: ${Math.round(r.pct)} %` : 'Schräg, aber laut. Perfekt.'); }
    else { Snd.sfx('cheer'); mood(3); }
  },
  async sousaphonist() {
    if (G.S.stage !== 's_probe') { await Story.say('Sousaphonist mit Larve', 'Mmmh. (Er spielt weiter.)'); return; }
    G.busy++;
    await Story.say('me', 'Schönes Sousaphon. Sagen Sie … Pech gehabt in letzter Zeit? Mit einer Maske vielleicht? Einer goldenen?');
    await Story.say('Sousaphonist mit Larve', '…');
    if (this.followOk()) await sayP('elin', 'Papi, er hat einen roten Mantel unter der Jacke!');
    Snd.sfx('whoosh');
    await Story.say('Sousaphonist mit Larve', 'PECH GEHABT!');
    await Story.say(null, 'Er lässt das Sousaphon fallen, springt auf ein Velo und rast durch das Untertor davon – Richtung Unterstadt!');
    const papi = suPapi();
    await Story.say(this.followOk() ? 'me' : null, this.followOk() ? 'Elin, dein Velo! Ich bring es dir zurück!' : 'Neben dem Wilden Mann steht ein Velo. Du schwingst dich drauf.');
    let r = await this.mini('velo', 'chase');
    if (!(r && r.ok)) {
      await kidSay('timo', 'Er biegt beim Hirschenplatz ab! Hinterher, Papi, du schaffst das!');
      r = await this.mini('velo', 'chase');
    }
    if (r && r.ok) { achieve('su_velo'); await Story.say('me', 'Er fährt zum See! Ich bleib dran!'); }
    else await Story.say('me', 'Weg ist er … aber die Spur führt zum See. Zum Quai!');
    this.setStage('s_boot');
    this.st().bootReady = 0;
    G.npcs = G.npcs.filter((n) => !n.larve);
    await warpTo('sursee_see', 'quai', { plain: true });
    G.busy--;
  },
  async bootsjagd() {
    G.busy++;
    const helper = this.st().direct ? 'Bootsvermieter Sepp' : FRIENDS.hoshy ? 'hoshy' : who('arm');
    await Story.say(null, 'Am Quai springt der Mann im roten Mantel in Boot 7 und fährt los – mitten in den Triechter hinaus.');
    if (FRIENDS[helper]) { await Story.say(helper, `${G.S.name}! Ich war grad hier am Quai. Rein ins Elektroboot, ich steuer – du schaust, wohin er fährt!`); await Story.say('Bootsvermieter Sepp', 'Nimm die Nummer 3, die ist geladen! Bezahlen kannst du später!'); }
    else await Story.say('Bootsvermieter Sepp', 'Rein in die Nummer 3, ich steuer! Halt dich fest!');
    const r = await this.mini('bootsjagd');
    if (r && r.ok) { achieve('su_boot'); await Story.say(helper, 'Er legt am Gamma-Inseli an! Wir sind direkt hinter ihm!'); }
    else await Story.say(helper, 'Er ist schneller … aber er fährt zum Gamma-Inseli. Hinterher!');
    this.st().inseliSearch = 1;
    await Scene.play('boat', { text: 'Das Elektroboot surrt über den Triechter hinaus zum Gamma-Inseli …', ms: 2200, keep: true });
    enterMap('inseli', 'landing');
    await UI.fadeIn();
    await Story.say('me', 'Er ist zwischen den Bäumen verschwunden. Irgendwo hier muss die Maske sein. Ich such die Insel ab.');
    UI.toast('Such die Insel ab: unter Bäumen, im Schilf, hinter Steinen.');
    G.busy--;
  },
  async search(k) {
    const s = this.st();
    if (G.S.stage !== 's_boot' || s.maskFound) { await Story.say(null, pick(['Wurzeln, Moos, ein paar Federn von Enten.', 'Nur Laub und ein alter Ast.', 'Eine Ente schaut dich vorwurfsvoll an.'])); return; }
    if (s.maskSpot == null) s.maskSpot = rint(0, 3);
    s.searched = s.searched || [];
    if (!s.searched.includes(k)) s.searched.push(k);
    if (k !== s.maskSpot) { await Story.say(null, pick(['Nichts. Nur Wurzeln.', 'Ein Krähennest. Leer.', 'Ein Kronkorken. Kari wäre stolz.'])); if (s.searched.length >= 2) UI.toast('Dort drüben glitzert etwas!'); return; }
    s.maskFound = 1;
    addInv('sonnenmaske'); achieve('su_maske'); Snd.sfx('win'); G.fx.flash = 0.8;
    await Story.say(null, 'Unter einer grünen Plane, in ein Frotteetuch gewickelt: die goldene Sonnenmaske! Es fehlt genau ein Strahl.');
    const sp = (G.map.spots && G.map.spots.pfister) || [10, 6, 0];
    const a = Story.tempActor({ id: 'su_pfister', name: SU_P.pfister.name, look: Object.assign({}, SU_P.pfister.look, { top: 9, topCol: 0 }), x: sp[0] * 16 + 8, y: sp[1] * 16 + 12, dir: 0, solid: true, speed: 30 });
    a.talk = () => this.talk('pfister');
    await Story.walk(a, G.player.x + 20, G.player.y);
    a.dir = 1;
    await Story.say(SU_P.pfister, 'Pech gehabt. Wieder mal. Zwanzig Jahre Pech.');
    await this.anklage();
  },
  async anklage() {
    const s = this.st();
    const lawyer = this.st().direct ? { name: 'Isa (am Telefon)', look: SU_P.isa.look, bg: SU_P.isa.bg } : FRIENDS.lexx ? 'lexx' : suPapi();
    await Story.say(lawyer, `Moment. Bevor hier jemand „Pech“ sagt: ${G.S.name}, du brauchst drei Beweise, die alle auf ihn zeigen. Dann gilt es.`);
    const used = {};
    let n = 0, tries = 0;
    while (n < 3 && tries < 12) {
      tries++;
      const keys = Object.keys(SU_EVID).filter((k) => s.ev[k] && !used[k]);
      if (!keys.length) break;
      const c = await Story.ask(lawyer, `Beweis ${n + 1} von 3: Was legst du vor?`, keys.map((k) => SU_EVID[k].n));
      const k = keys[c];
      used[k] = 1;
      if (SU_EVID[k].p) { n++; Snd.sfx('ok'); await Story.say(SU_P.pfister, ['Das … das kann jeder gewesen sein.', 'Hm. Ja. Das war ich. Aber das beweist noch nichts!', 'Schon gut. Schon gut! Ich geb es zu.'][n - 1]); }
      else { Snd.sfx('error'); await Story.say(lawyer, 'Das beweist nichts gegen ihn. Überleg nochmal – im Notizbuch steht alles.'); }
    }
    if (n < 3) { await Story.say(lawyer, 'Es reicht auch so. Er hat ja die Maske versteckt.'); }
    else achieve('su_anklage');
    this.note('gestaendnis', 'Ruedi Pfister hat gestanden.');
    await Story.say(SU_P.pfister, 'Zwanzig Jahre bin ich Schläger an der Gansabhauet. Zwanzig Mal mit verbundenen Augen – und nie getroffen. Nicht einmal gestreift.');
    await Story.say(SU_P.pfister, 'Ich wollte nur EINMAL mit der echten Maske üben. Nachts, hier auf dem Inseli, wo mich niemand sieht. Mit dem roten Mantel aus dem Theater und einer Stoffgans. Dabei bin ich an der Sure gestolpert, und ein Strahl ist abgebrochen.');
    await Story.say(SU_P.pfister, 'Ich wollte die Maske am Martinstag zurückbringen. Aber dann fiel die Gansabhauet aus – wegen MIR. Ich hab mich so geschämt, dass ich sie hier versteckt habe. Und jede Nacht hab ich mit der Taschenlampe nachgeschaut, ob sie noch da ist.');
    await Story.say('me', 'Gib sie der Zunft zurück. Selber. Das ist das Mindeste.');
    await Story.say(SU_P.pfister, 'Ja. Das mach ich. Pech gehabt … nein. Diesmal nicht.');
    Snd.sfx('blip');
    await sayP('heinivater', '📱 Die Maske ist gefunden?! Das ganze Städtli redet schon davon. Ruedi hat mich angerufen und alles erzählt. Die Gansabhauet wird nachgeholt – um 10 Uhr geht\'s los! Kommen Sie zum Diebenturm, Sie bekommen eine Startnummer.');
    takeInv('sonnenmaske');
    Story.dropActor(G.npcs.find((n) => n.id === 'su_pfister'));
    this.setStage('s_gans');
    await Scene.play('boat', { text: 'Zurück zum Quai. Ruedi fährt im eigenen Boot hinterher, die Maske im Arm.', ms: 2200, keep: true, back: true });
    enterMap('sursee_see', 'inseli_back');
    await UI.fadeIn();
    saveGame(true);
  },
  async inseliBoat() {
    const c = await Story.ask(null, 'Mit dem Elektroboot zurück zum Quai?', ['Zurückfahren', 'Noch bleiben']);
    if (c !== 0) return;
    if (G.S.stage === 's_boot' && !this.st().maskFound) { await Story.say('me', 'Nicht ohne die Maske!'); return; }
    await Scene.play('boat', { text: 'Zurück zum Quai …', ms: 1800, keep: true, back: true });
    enterMap('sursee_see', 'inseli_back');
    await UI.fadeIn();
  },

  /* ---------- Finale: Nachhol-Gansabhauet ---------- */
  async talkHeinivater() {
    const s = this.st(), st = G.S.stage, h = hourOf(G.S.time);
    if (st === 's_gans') {
      if (!(h >= 10 && h < 16)) { await sayP('heinivater', 'Die Gansabhauet beginnt um 10 Uhr. Schlafen Sie gut!'); return; }
      return this.gansabhauet();
    }
    if (st === 's_ankunft') return this.tatortStart();
    if (st === 's_tatort') { await sayP('heinivater', 'Schauen Sie überall, wo es glitzert. Drei Spuren, sagt das Mädchen. Sie hat recht, glaube ich.'); return; }
    if (suAt('s_frei')) { await sayP('heinivater', 'Unser Ehrenzünftler! Kommen Sie an die Fasnacht. Am Güdisdienstag eröffnen drei Kanonenschüsse den Umzug.'); return; }
    await sayP('heinivater', pick(['Die Zunft Heini von Uri wurde 1876 von über hundert Surseern gegründet. Seit 1880 organisieren wir die Gansabhauet mit.', 'Am Fasnachtssamstag spielen beim Monsterkonzert rund zwanzig Guuggen in der Altstadt. Die Guggsurruugger haben es 1987 erfunden.', 'Ohne Sonnenmaske keine Gansabhauet. So einfach ist das. Und so schlimm.']));
  },
  async gansabhauet() {
    G.busy++;
    const s = this.st();
    await sayP('heinivater', `Startnummer 7, für ${G.S.name}! Und Startnummer 6 für Ruedi – er hat es sich nicht verdient, aber die Zunft verzeiht. Einmal im Jahr.`);
    await Scene.play('umzug', { text: 'Umzug mit Stadtrat, Zunft und Tambouren vom Diebenturm durch die Gasse zum Rathaus …', ms: 3600, keep: true });
    enterMap('sursee', 'rathausplatz');
    this.gansLive();
    await UI.fadeIn();
    await Story.say(null, 'Vor dem Rathaus hängt an einem Draht die Gans. Hunderte Menschen stehen in der Gasse, auf den Treppen, in den Fenstern. Die Tambouren wirbeln.');
    const kids = ['Elin', 'Timo', 'Thierry'];
    for (;;) {
      const c = await askP('elin', 'Zuerst die Kinderspiele, Papi! Machst du mit?', ['Sackgumpe', 'Chäszänne (Grimassen)', 'Stangechlädere', 'Weiter zur Gansabhauet']);
      if (c === 3) break;
      if (c === 0) { const r = await this.mini('sackgumpe', kids); if (r && r.place === 1) { achieve('su_kinder'); UI.toast('Erster im Sackgumpe!'); } }
      if (c === 1) { const r = await this.mini('chaeszaenne'); if (r && r.win) { achieve('su_kinder'); addInv('chaeschuechli'); UI.toast('Die grässlichste Grimasse! Du gewinnst ein Stück Käse.'); } }
      if (c === 2) { const r = await this.mini('stange'); if (r && r.top) { achieve('su_kinder'); UI.toast('Ganz oben! Der Preis am Kranz gehört dir.'); } }
    }
    await sayP('heinivater', 'Schläger Nummer 6: Ruedi Pfister! Maske auf, Augen verbunden, roter Mantel. Ein Hieb mit dem stumpfen Säbel!');
    let hit = false;
    for (let round = 1; round <= 3 && !hit; round++) {
      Snd.sfx('hit');
      await Story.say(null, round === 1 ? 'Ruedi holt aus … und schlägt einen halben Meter daneben. Die Menge stöhnt. „Pech gehabt!“, ruft er – und lacht dabei.' : 'Ruedi schlägt wieder ins Leere. Er zuckt mit den Schultern und grinst.');
      await sayP('heinivater', `Schläger Nummer 7: ${G.S.name}!${round > 1 ? ` ${round}. Durchgang!` : ''}`);
      const r = await this.mini('gansabhauet');
      hit = !!(r && r.hit);
      if (hit) { G.fx.flash = 1; Snd.sfx('cheer'); achieve('su_gans'); await Story.say(null, 'Ein sauberer Hieb – die Gans fällt! Die Menge tobt, Hüte fliegen, die Tambouren trommeln wie verrückt. Du nimmst die Sonnenmaske ab und blinzelst ins Licht.'); }
      else await Story.say(null, round < 3 ? 'Knapp daneben! Die Menge raunt. Nächster Durchgang.' : 'Wieder daneben …');
    }
    if (!hit) {
      Snd.sfx('cheer');
      await Story.say(null, 'Im letzten Durchgang tritt Ruedi Pfister noch einmal an. Er holt aus – und trifft. Zum ersten Mal in zwanzig Jahren. Die Gans fällt, Ruedi fällt auf die Knie, die Menge jubelt.');
      await Story.say(SU_P.pfister, 'Ich … ich hab GETROFFEN! Danke! Ohne dich hätte es diese Gansabhauet nie gegeben!');
    }
    achieve('su_zunft');
    await sayP('heinivater', `Liebe Surseerinnen und Surseer! Ohne ${G.S.name} gäbe es heute keine Gansabhauet. Im Namen der Zunft Heini von Uri: Ehrenzünftler auf Lebenszeit!`);
    await sayP('isa', playerIsCuche() ? 'Ich bin so stolz auf dich, Schatz.' : `${G.S.name}, du bist ab heute offiziell ein Surseer. Fast.`);
    await sayP('timo', 'Papi, ich war der Assistent! Assistent Timo!');
    G.live = null;
    const c2 = await Story.ask('Diebetormtöibeler', 'Und jetzt: Musik! Spielst du mit?', ['Mitschränzen', 'Zuhören']);
    if (c2 === 0) { const r = await this.mini('rhythm', 'guugge'); if (r && r.pct >= 50) achieve('su_guugge'); }
    passTime(Math.max(0, (dayOf(G.S.time) * 1440 + 18 * 60) - G.S.time));
    await Scene.play('raebeli', { text: 'Am Abend zieht der Räbeliechtli-Umzug vom Untertor durch die dunkle Altstadt.', ms: 4200, keep: true });
    await Scene.play('lift', { text: 'Zum Schluss: eine letzte Fahrt mit dem Riesenrad. Ganz oben bleibt es stehen. Unter dir leuchtet Sursee.', ms: 3200, keep: true });
    this.setStage('s_frei');
    saveGame(true);
    await UI.fadeIn();
    G.busy--;
    await Ending.show({ sursee: true });
  },
  gansLive() {
    G.live = {
      draw: (c, cx, cy, t) => {
        const x = 81 * 16 - cx, y = 37 * 16 - cy;
        line(c, x - 40, y - 34, x + 40, y - 34, '#3a3a40');
        const sw = Math.sin(t * 1.3) * 1.5;
        line(c, x, y - 34, x + sw, y - 20, '#3a3a40');
        E(c, x + sw, y - 12, 4, 6, '#f4f0e6'); R(c, x + sw - 1, y - 20, 2, 6, '#f4f0e6'); E(c, x + sw, y - 21, 2, 2, '#f4f0e6'); P(c, x + sw + 2, y - 21, '#e8902a'); R(c, x + sw - 2, y - 6, 1, 3, '#e8902a'); R(c, x + sw + 1, y - 6, 1, 3, '#e8902a');
      },
    };
  },

  /* ---------- Notizbuch im Handy ---------- */
  notebook(b) {
    const s = this.st();
    const sus = SU_SUSPECTS.map((x) => `<div class="row ${G.S.stage === 's_gans' || suAt('s_frei') ? (x.k === 'pfister' ? '' : 'done') : ''}"><div><div class="t">${x.n}</div><div class="d">${x.d}</div></div><span class="open">${(suAt('s_gans') && x.k === 'pfister') ? '!' : '?'}</span></div>`).join('');
    const ev = Object.keys(SU_EVID).filter((k) => s.ev[k]).map((k) => `<div class="row"><div><div class="t">${SU_EVID[k].n}</div></div></div>`).join('') || '<p class="note">Noch keine Beweise.</p>';
    const notes = s.notes.slice().reverse().map((n) => `<div class="row"><div><div class="d">${dateStr(n.at)} ${clockStr(n.at)}</div><div class="t">${n.t}</div></div></div>`).join('') || '<p class="note">Noch leer.</p>';
    b.innerHTML = `<div class="row" style="border-color:var(--amber)"><div><div class="d">Jetzt</div><div class="t">${this.objective()}</div></div></div>
      <button class="btn" id="suHint">💡 Tipp von Elin und Timo</button>
      <div class="shop-sec">Spuren aus der Zunftstube</div><div class="list">${Object.entries(SU_CLUES).map(([k, [n, d]]) => `<div class="row ${s.clues[k] ? 'done' : ''}"><div><div class="t">${s.clues[k] ? n : '???'}</div><div class="d">${s.clues[k] ? d : 'noch nicht gefunden'}</div></div><span class="${s.clues[k] ? 'tick' : 'open'}">${s.clues[k] ? '✓' : '·'}</span></div>`).join('')}</div>
      <div class="shop-sec">Verdächtige</div><div class="list">${suAt('s_faehrten') ? sus : '<p class="note">Noch keine – zuerst den Tatort untersuchen.</p>'}</div>
      <div class="shop-sec">Beweise</div><div class="list">${ev}</div>
      <div class="shop-sec">Notizen</div><div class="list">${notes}</div>`;
    b.querySelector('#suHint').onclick = async () => { UI.closeOverlay(); G.busy++; await this.giveHint(true); G.busy--; };
  },
  hintText(lvl) {
    const s = this.st(), st = G.S.stage;
    const H = {
      s_ankunft: ['Der Diebenturm ist in der Unterstadt. Durch das Untertor und dann rechts runter in die Gasse mit dem Bach.', 'Folg der Unterstadt nach Osten bis zum Turm mit der gelben Fahne. Die Tür ist unten.'],
      s_tatort: [`Es glitzert! Unter dem Fenster, unter einer Bank, bei der Truhe. ${3 - Object.keys(s.clues).length} fehlen noch.`, 'Stell dich vor die glitzernden Stellen und drück A.'],
      s_faehrten: [!s.f.roli ? 'Der Jeton ist von der Achterbahn. Auf dem Märtplatz rechts von der Kirche steht Roli bei der Kasse.' : !s.f.rad ? 'Roli hat vom Riesenrad gesprochen. Nach 17 Uhr ist es dunkel – dann sieht man Lichter auf dem See.' : !s.f.log ? 'Die Quittung ist von der Bootsvermietung am See. Über den Beckenhof und die Münstervorstadt zum Quai.' : !s.f.fischer ? 'Fischer Wäli will einen Felchen. Fisch vom Quai aus – vorne auf dem Steg.' : !s.f.buch ? 'Die Maske war im Museum Sankturbanhof. Neben dem Stadttheater, beim Obertor. Dort liegt ein Besucherbuch.' : 'Im Stadttheater fehlt ein roter Mantel. Schau im Fundus nach!', 'Im Notizbuch steht, was noch fehlt. Auf der Handy-Karte siehst du alle Orte.'],
      s_strahl: [hasInv('strahl') ? `Mami ist ${this.isaWhere().t}.` : 'Thierry und Louve spielen beim Spielplatz im Ehret-Park. Durch die Pforte in der Stadtmauer.', 'Rede mit ihnen!'],
      s_probe: ['Die Guuggen proben beim Untertor, unten an der Sure. Ab 16 Uhr.', 'Der mit dem grossen, goldenen Instrument – das ist ein Sousaphon.'],
      s_boot: ['Zum See! Die Bootsvermietung am Quai hat ein Elektroboot für dich.', 'Rede mit Sepp von der Bootsvermietung.'],
      s_gans: ['Die Gansabhauet beginnt um 10 Uhr beim Diebenturm. Der Heinivater wartet dort.', 'Wenn es Nacht ist: Schlaf bei uns im Gästebett, Münstervorstadt 8.'],
    }[st];
    if (!H) return 'Sursee ist gross genug für alles: Chilbi, See, Bars. Viel Spass!';
    return H[Math.min(lvl, H.length) - 1];
  },
  hintLvl: 0,
  async giveHint(asked) {
    this.hintLvl = Math.min(2, this.hintLvl + 1);
    const k = this.followOk() ? (this.hintLvl === 1 ? 'elin' : 'timo') : 'elin';
    const t = this.hintText(this.hintLvl);
    const tp = 'Papi, ' + t.charAt(0).toLowerCase() + t.slice(1);
    if (this.followOk()) await sayP(k, tp); else await sayP(k, '📱 ' + tp);
  },
  hintTick() {
    const s = this.st();
    if (!this.here() || G.busy || s.lastProg == null || ['s_frei', 's_gans'].includes(G.S.stage)) return;
    if (G.S.time - s.lastProg > 100 && (!s.lastHint || G.S.time - s.lastHint > 100)) {
      s.lastHint = G.S.time;
      const k = Math.random() < 0.5 ? 'elin' : 'timo';
      const kid = G.npcs.find((n) => n.id === 'su_' + k);
      if (kid) { kid.bubble = '?'; kid.bubbleT = 4; }
      UI.toast(`💬 ${SU_P[k].name}: „${this.hintText(Math.min(2, ++this.hintLvl))}“`);
    }
  },

  /* ---------- Heini, der Narr: Rätsel mit wahren Tipps ---------- */
  NARR_SPOTS: [[68, 41], [91, 39], [82, 27], [61, 19], [110, 22], [45, 49], [88, 52], [70, 59]],
  RIDDLES: [
    ['Wie viele Jahre feiert die Zunft Heini von Uri im Jahr 2026?', ['100', '150', '200'], 1],
    ['In welcher Schlacht war der Narr Heini mit dem Herzog?', ['Morgarten', 'Sempach', 'Marignano'], 1],
    ['Seit wann tragen die Schläger an der Gansabhauet Sonnenmaske und roten Mantel?', ['1386', '1880', '1975'], 1],
    ['Wie gross ist das Gamma-Inseli?', ['18 m²', '184 m²', '1840 m²'], 1],
    ['Aus welchem See fliesst die Sure?', ['Baldeggersee', 'Sempachersee', 'Vierwaldstättersee'], 1],
    ['Wann wurde das Rathaus von Sursee gebaut?', ['1539 bis 1546', '1876', '1912'], 0],
    ['Wofür steht die 118 beim Kulturwerk?', ['Hausnummer', 'Feuerwehr-Notruf', 'Anzahl Plätze'], 1],
    ['Wie heisst die älteste Guuggenmusig von Sursee?', ['Guggsurruugger', 'Diebetormtöibeler', 'Alti Sieche'], 0],
  ],
  spawnNarr(m) {
    const s = this.st();
    const i = (Math.floor(G.S.time / 60) + 3) % this.NARR_SPOTS.length, p = this.NARR_SPOTS[i];
    G.npcs.push(new Actor({ id: 'su_narr', name: SU_P.narr.name, look: SU_P.narr.look, x: p[0] * 16 + 8, y: p[1] * 16 + 12, dir: 0, solid: true, keepDir: true, talk: () => this.narr(), label: 'Reden: Heini, der Narr', bubbleRand: ['?', 'note'], extra: drawNarrenkappe, wander: { x: p[0] - 2, y: p[1] - 1, w: 5, h: 2 } }));
  },
  async narr() {
    const s = this.st();
    s.narrQ = s.narrQ || 0;
    const R = this.RIDDLES[s.narrQ % this.RIDDLES.length];
    await sayP('narr', pick(['Hoppla! Ein Narr sagt immer die Wahrheit – aber nur dem, der ein Rätsel löst!', 'Klingeling! Der Narr weiss, was du suchst. Doch zuerst: ein Rätsel!', 'Heini bin ich, Narr von Beruf. Wahrheit gegen Wissen!']));
    const c = await askP('narr', R[0], R[1]);
    if (c === R[2]) {
      s.narrQ++; s.riddles++;
      Snd.sfx('ok');
      if (s.riddles >= 5) achieve('su_narr');
      await sayP('narr', `Richtig! Und hier die Wahrheit, gereimt für dich: ${this.narrHint()}`);
      mood(3);
    } else { Snd.sfx('error'); await sayP('narr', 'Falsch, falsch! Der Narr lacht. Komm ein andermal wieder – er steht nie lange am selben Ort.'); s.narrQ++; }
  },
  narrHint() {
    const t = this.hintText(1);
    return `„${t}“ – Klingeling!`;
  },
});
/* Narrenkappe mit Schellen */
function drawNarrenkappe(c, x, y, a) {
  const hy = y - 26 + (a.moving ? Math.floor(G.t * 8) % 2 : 0);
  R(c, x - 5, hy + 2, 10, 3, '#c8302a'); R(c, x - 5, hy + 2, 5, 3, '#e8c23a');
  line(c, x - 4, hy + 2, x - 9, hy - 4, '#c8302a'); line(c, x + 4, hy + 2, x + 9, hy - 4, '#e8c23a'); line(c, x, hy + 1, x, hy - 6, '#2f5fb8');
  const j = Math.floor(G.t * 5) % 2;
  E(c, x - 9, hy - 4 + j, 1.5, 1.5, '#ffd23d'); E(c, x + 9, hy - 4 - j, 1.5, 1.5, '#ffd23d'); E(c, x, hy - 7 + j, 1.5, 1.5, '#ffd23d');
}

/* ============ Freizeit in Sursee ============ */
Object.assign(Sur, {
  /* Minispiele aufrufen; fehlt eines (noch), läuft die Story mit einem fairen Standard-Ergebnis weiter */
  async mini(name, ...args) {
    if (typeof Mini !== 'undefined' && typeof Mini[name] === 'function') { try { return await Mini[name](...args); } catch (e) { console.error(e); } }
    const D = { fishing: { fish: 'felchen', cm: 34, felchen: true }, pedalo: { time: 42, ok: true }, motorboat: { time: 38, hits: 1, ok: true }, sup: { ok: true, dist: 120 }, sprung: { score: 14, figure: 'Köpfler' }, velo: { ok: true, time: 40 }, schiessbude: { hits: 7, prize: 'Rose' }, lukas: { best: 80, bell: false }, entenfischen: { ducks: 5, points: 40 }, buechsen: { cleared: true, cans: 6 }, achterbahn: { score: 70 }, riesenrad: { found: true }, gansabhauet: { hit: Math.random() < 0.5, quality: 0.5 }, sackgumpe: { place: 2 }, chaeszaenne: { score: 60, win: false }, stange: { top: true, height: 100 }, rhythm: { pct: 70 }, bootsjagd: { ok: true }, detektor: { found: true } }[name];
    await UI.card(`(${name})`, 600);
    return D || null;
  },
  async atm() {
    const d = dayOf(G.S.time);
    if (G.S.cashDay !== d) { G.S.cashDay = d; G.S.cashToday = 0; }
    const left = 1000 - G.S.cashToday, eur = G.S.money.eur;
    const opts = ['50 CHF', '100 CHF', '200 CHF', '500 CHF'];
    if (eur >= 5) opts.push(`Euro wechseln (${fmtEur(eur)} → ${fmtChf(Math.floor(eur * 0.93))})`);
    opts.push('Abbrechen');
    const c = await Story.ask(null, `Bankomat · Heute noch ${Math.max(0, left)} CHF möglich.`, opts);
    if (opts[c] === 'Abbrechen') return;
    if (opts[c].startsWith('Euro')) { const v = Math.floor(eur * 0.93); addMoney('eur', -eur); addMoney('chf', v); Snd.sfx('coin'); UI.toast(`${fmtEur(eur)} gewechselt: ${fmtChf(v)}.`); return; }
    if (left <= 0) { await Story.say(null, 'Tageslimit erreicht.'); return; }
    const v = Math.min(left, [50, 100, 200, 500][c]);
    G.S.cashToday += v; addMoney('chf', v); Snd.sfx('coin'); UI.toast(`${v} CHF abgehoben.`);
  },
  async veloRent() {
    const s = this.st();
    if (s.velo) { const c = await Story.ask(null, 'Velo zurückgeben?', ['Zurückgeben', 'Behalten']); if (c === 0) { s.velo = 0; G.player.velo = false; UI.toast('Velo zurückgegeben.'); } return; }
    const c = await Story.ask(null, 'Velostation: Mietvelo für den ganzen Tag, 15 CHF. Damit bist du draussen fast doppelt so schnell.', ['Mieten (15 CHF)', 'Lieber zu Fuss']);
    if (c !== 0) return;
    if (!pay('chf', 15)) { UI.toast('Zu wenig Franken.', 'warn'); return; }
    s.velo = 1; s.veloOff = 0; G.player.velo = true; achieve('su_velofahrer');
    UI.toast('🚲 Velo gemietet! Mit A steigst du ab und wieder auf, wenn gerade nichts anderes vor dir ist.');
    if (this.followOk()) await kidSay('timo', 'Papi, VELO! Ich fahr mit meinem eigenen! Ohne Stützräder! Schau, Elin, ohne Hände! … Fast.');
  },
  async chilbi(kind) {
    if (!isOpen('chilbi')) { await Story.say(null, 'Die Chilbi ist zu. Offen 10–24 Uhr.'); return; }
    const price = { schiessbude: 5, lukas: 3, entenfischen: 4, buechsen: 4, los: 2, putschi: 4 }[kind];
    const name = { schiessbude: 'Schiessbude', lukas: 'Hau den Lukas', entenfischen: 'Entenfischen', buechsen: 'Büchsenwerfen', los: 'Losbude', putschi: 'Putschibahn' }[kind];
    const c = await Story.ask(null, `${name}: ${price} Franken.`, ['Spielen', 'Weitergehen']);
    if (c !== 0) return;
    if (!pay('chf', price)) { UI.toast('Zu wenig Franken.', 'warn'); return; }
    if (kind === 'los') { const r = Math.random(); const prize = r < 0.55 ? null : r < 0.85 ? 'magenbrot' : r < 0.97 ? 'zuckerwatte' : 'schoko'; if (prize) { addInv(prize); UI.toast(`Gewonnen: ${ITEMS[prize].n}!`); } else UI.toast('Niete. „Nächstes Mal!“'); return; }
    if (kind === 'putschi') { const f = Object.keys(FRIENDS).find((id) => this.friendLoc(id) === 'chilbi'); await Scene.play('putschi', { text: f ? `Putschibahn mit ${fname(f)}! Rums – frontal.` : 'Putschibahn! Rums – ein Kind rammt dich frontal und lacht.', ms: 2600 }); mood(8); return; }
    const r = await this.mini(kind === 'schiessbude' ? 'schiessbude' : kind);
    if (!r) return;
    if (kind === 'schiessbude' && r.prize) { achieve('su_schiess'); UI.toast(`Preis: ${r.prize}!`); }
    if (kind === 'lukas' && r.bell) achieve('su_lukas');
    mood(5);
  },
  /* Band auf der Bühne: Stadthalle 20–23 Uhr Stubete Gäng (18–20 Soundcheck), Kulturwerk ab 20 Uhr Open-Stage-Band */
  spawnBand(m) {
    const h = hourOf(G.S.time), hall = m.id === 'stadthalle', sp = m.spots || {};
    const on = hall ? h >= 20 && h < 23 : h >= 20 || h < 3, sound = hall && h >= 18 && h < 20;
    if (!on && !sound) return;
    const roles = hall
      ? [['band1', 'Sängerin der Stubete Gäng', 'mikro', { hair: 16, hairCol: 3, beard: 0, top: 2, topCol: 12, glasses: 0, hat: 0 }], ['band2', 'Gitarrist der Stubete Gäng', 'gitarre', { hair: 4, hairCol: 1, beard: 1, beardCol: 1, top: 0, topCol: 16, hat: 0 }],
        ['band3', 'Örgeler der Stubete Gäng', 'oergeli', { hair: 7, hairCol: 4, beard: 2, beardCol: 4, top: 3, topCol: 3, hat: 3, hatCol: 2 }], ['band4', 'Schlagzeuger der Stubete Gäng', 'trommle', { hair: 2, hairCol: 0, beard: 0, top: 0, topCol: 2, hat: 0 }]]
      : [['band1', 'Sänger der Open Stage', 'mikro', { hair: 13, hairCol: 2, beard: 1, top: 0, topCol: 2 }], ['band2', 'Gitarristin der Open Stage', 'gitarre', { hair: 10, hairCol: 5, beard: 0, top: 2, topCol: 9 }], ['band4', 'Bassist der Open Stage', 'bass', { hair: 5, hairCol: 1, beard: 2, top: 0, topCol: 16 }]];
    const lines = on ? ['Psst – mir spiled grad! Nachher gern ein Autogramm.', 'Danke, Sursee! Ihr seid lauter als Luzern!', 'Nach der Pause kommt die Ballade. Taschentücher bereithalten.'] : ['Eins, zwei. Eins, zwei. Check.', 'Um acht geht\'s los. Hol dir ein Ticket an der Abendkasse.'];
    (sound ? [['band2', 'Tontechniker', 'tech', { hair: 2, hairCol: 1, beard: 1, top: 0, topCol: 2, hat: 2 }]] : roles).forEach(([spot, name, instr, lk], i) => {
      const p = sp[spot]; if (!p) return;
      G.npcs.push(new Actor({ id: 'su_band' + i, name, look: npcLook(5500 + i + (hall ? 0 : 20), lk), x: p[0] * 16 + 8, y: p[1] * 16 + 12, dir: 0, solid: true, keepDir: true, instr, live: on, extra: drawBandInstr, bubbleRand: on ? ['note'] : ['dots'], talk: () => Story.say(name, pick(lines)), label: 'Reden: ' + name }));
    });
  },
  async concertKasse() {
    const h = hourOf(G.S.time);
    if (hasInv('konzertticket')) { await Story.say('Abendkasse', 'Du hast schon ein Ticket. Viel Spass!'); return; }
    const c = await Story.ask('Abendkasse', h >= 18 ? 'Stubete Gäng, Samichlaus Tour! Abendkasse 49 Franken. Beginn 20 Uhr.' : 'Die Kasse öffnet um 18 Uhr.', h >= 18 ? ['Ticket kaufen (49 CHF)', 'Nein danke'] : ['Okay']);
    if (h < 18 || c !== 0) return;
    if (!pay('chf', 49)) { UI.toast('Zu wenig Franken.', 'warn'); return; }
    addInv('konzertticket'); UI.toast('🎫 Konzertticket! Vor die Bühne, sobald es losgeht (ab 20 Uhr).');
  },
  async concert() {
    const h = hourOf(G.S.time);
    if (!hasInv('konzertticket')) { await Story.say('Security', 'Ohne Ticket geht\'s nicht vor die Bühne. Abendkasse beim Eingang.'); return; }
    if (h >= 23 || h < 18) { await Story.say(null, 'Das Konzert ist vorbei. Die Roadies rollen die Kabel ein, auf dem Boden glitzert Konfetti.'); return; }
    if (h < 20) { await Story.say(null, 'Auf der Bühne wird noch Soundcheck gemacht. „Eins, zwei, eins, zwei.“ Um 20 Uhr geht\'s los.'); return; }
    await Story.say(null, 'Licht aus, Nebel, Jubel: Die Stubete Gäng stürmt auf die Bühne. Mundart, Schlager, Party – die ganze Stadthalle hüpft.');
    const r = await this.mini('rhythm', 'konzert');
    takeInv('konzertticket');
    achieve('su_konzert'); mood(12); energy(-6); passTime(90);
    if (r && r.pct >= 80) await Story.say(null, 'Die Sängerin zeigt auf dich: „Dä det vorne cha’s!“ Die ganze Halle klatscht.');
  },
  async galerie() {
    const s = this.st();
    if (suAt('s_faehrten') && !suAt('s_gans') && !s.ev.zeuge) {
      await Story.say(null, 'Von der Galerie siehst du über das ganze Publikum. Neben dir lehnt eine Frau am Geländer.');
      await Story.say('Frau auf der Galerie', 'Detektiv? Isa hat von dir erzählt. Ich wohne am Quai. In der Nacht vor dem Martinstag hab ich einen Mann gesehen – roter Mantel, Sousaphon-Koffer, Richtung See. Um elf Uhr nachts!');
      this.evid('zeuge'); this.note('zeuge', 'Zeugin auf der Galerie: Mann mit rotem Mantel und Sousaphon-Koffer, nachts Richtung See.');
      return;
    }
    await Story.say(null, 'Von der Galerie siehst du über die Halle. Lichter, Nebel, tausend Hände.');
  },
  async kulturwerk() {
    const s = this.st(), h = hourOf(G.S.time);
    const late = h >= 23 || h < 4;
    if (late && this.jungsDa() && !s.k118) {
      s.k118 = 1;
      await Story.say(null, 'Plötzlich geht das Licht aus. Spot an: Auf der kleinen Bühne stehen … die Jungs! Mit Gitarre, Kochtopf als Schlagzeug und viel zu viel Selbstvertrauen.');
      await Story.say(voice('party'), `Sursee! Wir sind die Innsbruck-Allstars, und wir holen jetzt jemanden auf die Bühne: ${G.S.name}!`);
      const r = await this.mini('rhythm', 'konzert');
      achieve('su_118'); mood(15);
      await Story.say(null, r && r.pct >= 60 ? 'Standing Ovations im Keller. Die Feuerwehr oben fragt, was los ist.' : 'Schräg. Laut. Unvergesslich.');
      return;
    }
    const c = await Story.ask(null, 'Open Stage im Kulturwerk 118. Willst du auf die Bühne?', ['Auf die Bühne', 'Lieber zuschauen']);
    if (c === 0) { const r = await this.mini('rhythm', 'konzert'); if (r && r.pct >= 60) achieve('su_118'); mood(8); }
  },
  canDetect() { return hasInv('detektor') && this.st().coins.length < 5; },
  async detector() {
    const s = this.st();
    const r = await this.mini('detektor');
    if (!(r && r.found)) { UI.toast('Piep … piep … nur ein Kronkorken.'); return; }
    s.coins.push(G.S.time);
    Snd.sfx('coin');
    const n = s.coins.length;
    await Story.say(null, `Eine römische Münze! Grün angelaufen, mit einem Kaiserkopf. (${n}/5)`);
    if (n >= 5) { achieve('su_roemer'); await Story.say(null, 'Alle fünf! Bring sie dem Museum Sankturbanhof – die Vitrine mit den leeren Münzplätzen wartet. (Die Münzen liegen jetzt dort, mit deinem Namen.)'); }
  },
  /* ---------- Familie: Sprüche, Rechnen, Kita, Gitarre, Kaffee, Bauernhof-Quiz ---------- */
  kidFact(k) {
    const wk = dayOf(G.S.time) % 7 > 2 && hourOf(G.S.time) < 12;
    const F = {
      elin: ['Ich geh in die zweite Klasse im Schulhaus St. Martin. Meine Lehrerin sagt, ich bin schnell im Kopfrechnen. Willst du mich testen?', 'Ich spiel Gitarre! G, C und D kann ich schon. Mit D tun mir noch die Finger weh.', playerIsCuche() ? 'Die besten Pizzas der Welt sind deine, Papi. Besser als in der Mühle. Aber sag das nicht dem Gino.' : 'Die besten Pizzas der Welt macht mein Papi. Besser als in der Mühle. Aber sag das nicht dem Gino.',
        'Wenn ich gross bin, werd ich Detektivin. Oder Gitarristin. Oder Detektivin mit Gitarre.', 'Timo hat heute wieder nur Teigwaren mit Käse gegessen. Zum Zmorge!', 'Mami trinkt so viel Kaffee, dass die Kaffeemaschine einen Namen hat. Sie heisst Bruno.',
        wk ? 'Eigentlich hätte ich jetzt Schule im St. Martin. Aber Mami sagt, Detektivarbeit ist auch Bildung.' : 'In der Pause im St. Martin spielen wir immer Detektiv. Jetzt bin ich eine echte!'],
      timo: ['Papi, weisst du was? Ich geh in die Kita Villa Luna beim Märtplatz! Mein bester Freund heisst Lejan.', 'Lejan kann ganz laut rülpsen. Ich auch, aber leiser.', 'Papi, ich mag Velo fahren! Ganz schnell! Ohne Stützräder!', 'Teigwaren mit Käse. Und dann noch mehr Käse. Das ist mein Lieblingsessen.',
        'Wenn ich gross bin, fahr ich Postauto. Und dann fahr ich auch in den Poller. KLONK!', 'Mami hat heute schon fünf Kaffee getrunken. Ich hab gezählt. Bis fünf kann ich.', 'Elin spielt Gitarre. Immer das gleiche Lied. Ich tanz trotzdem.'],
      thierry: ['Wir wohnen in Schenkon, gleich neben Sursee. Ich und Louve. Von uns aus sieht man den See!', 'Ein Kreiselheuer wirbelt das Gras durch die Luft, damit es schneller trocknet. Dann wird es Heu.', 'Ein Mähdrescher mäht das Korn und drischt es gleich. Zwei Maschinen in einer!',
        'Mit dem Schwader macht man aus dem Heu lange Reihen. Dann kommt die Ballenpresse und macht Ballen. Rund oder eckig!', 'Der Traktor vom Gänsehof hat einen Frontlader. Damit hebt er Siloballen wie nichts.', 'Mit dem Ladewagen holt man das Gras vom Feld. Mit dem Güllenfass bringt man … das riecht man dann.',
        'Ein Melkroboter melkt die Kühe, wann sie wollen. Auch um drei Uhr in der Nacht!'],
      louve: ['Wir wohnen in Schenkon. Thierry ist mein Bruder. Er redet die ganze Zeit von Traktoren. DIE GANZE ZEIT.', 'Im Sommer gehen wir in die Seebadi Schenkon. Ich kann schon tauchen!', 'Thierry hat seinem Velo einen Anhänger gebaut. Er sagt, das ist ein Ladewagen.'],
    };
    return pick(F[k] || ['…']);
  },
  async rechnen() {
    const task = () => {
      const plus = Math.random() < 0.5;
      let a, b, r;
      if (plus) { a = 1 + Math.floor(Math.random() * 15); b = 1 + Math.floor(Math.random() * (20 - a)); r = a + b; } else { a = 5 + Math.floor(Math.random() * 16); b = 1 + Math.floor(Math.random() * a); r = a - b; }
      const opts = new Set([r]); for (const d of [1, -1, 2, -2, 3, 10, -10]) { if (opts.size >= 4) break; const v = r + d; if (v >= 0 && v <= 20) opts.add(v); }
      return { q: `${a} ${plus ? '+' : '−'} ${b}`, r, opts: shuffle([...opts]) };
    };
    await sayP('elin', 'Okay, Papi! Ich bin die Lehrerin. Drei Rechnungen. Plus und Minus bis 20. Ohne Finger!');
    let ok = 0;
    for (let i = 0; i < 3; i++) {
      const t = task();
      const c = await askP('elin', `Rechnung ${i + 1}: Wie viel ist ${t.q}?`, t.opts.map(String));
      if (t.opts[c] === t.r) { ok++; await sayP('elin', pick(['Richtig, Papi! Goldsternli!', 'Stimmt! Du bist fast so schnell wie ich, Papi.', 'Bravo! Die Lehrerin vom St. Martin wär stolz.'])); }
      else await sayP('elin', `Nöö, Papi. ${t.q} gibt ${t.r}. Zähl nochmal mit den Fingern. Aber heimlich.`);
    }
    if (ok === 3) { achieve('su_rechnen'); mood(6); await sayP('elin', 'Drei von drei, Papi! Du darfst in die zweite Klasse. Ich mal dir ein Goldsternli auf die Hand.'); }
    else await sayP('elin', `${ok} von 3. Morgen üben wir nochmal. Timo, du bist der Nächste!`);
    if (this.followOk() && ok < 3) await kidSay('timo', 'Ich weiss eins: Eins plus eins gibt … KÄSE!');
  },
  async kita() {
    const s = this.st(), h = hourOf(G.S.time), open = dayOf(G.S.time) % 7 > 2 && h >= 7 && h < 18;
    if (!open) { await Story.say(null, 'Die Kita Villa Luna ist zu. Vor der Tür stehen kleine Gummistiefel in einer Reihe.'); if (this.followOk()) await kidSay('timo', 'Lejan ist bestimmt zu Hause. Am Montag zeig ich ihm meinen Detektivausweis!'); return; }
    await Story.say('Betreuerin der Villa Luna', 'Grüezi! Ah, Timos Familie. Lejan fragt schon den ganzen Tag, wo Timo ist.');
    if (this.followOk()) {
      await kidSay('timo', 'LEJAN!'); await sayP('lejan', 'TIMO! Bist du jetzt Detektiv? Hast du eine Lupe?');
      await kidSay('timo', playerIsCuche() ? 'Ich hab einen Papi mit einem Notizbuch. Das ist besser als eine Lupe.' : `Ich hab ${G.S.name} dabei. Mit Notizbuch! Das ist besser als eine Lupe.`);
      await sayP('lejan', 'Ich hab heute Teigwaren mit Käse gegessen!'); await kidSay('timo', 'ICH AUCH! Gestern! Und vorgestern!');
      achieve('su_kita'); mood(5);
      if (!s.lejanTip && suAt('s_faehrten') && !suAt('s_gans')) { s.lejanTip = 1; await sayP('lejan', 'Mein Papi hat gesagt, an der Chilbi hat einer ganz viele Jetons von der Achterbahn verloren. Ein Mann mit einem roten Mantel.'); this.note('lejan', 'Lejan (Kita): An der Chilbi hat ein Mann im roten Mantel viele Achterbahn-Jetons verloren.'); }
    } else await sayP('lejan', 'Wo ist Timo? Ich hab ihm ein Bild gemalt. Ein Postauto, das in einen Poller fährt!');
  },
  async gitarre() {
    const h = hourOf(G.S.time), home = h >= 18 || h < 8 || this.followOk();
    if (!home) { await Story.say(null, 'Elins Gitarre lehnt am Regal. Kleine Gitarre, grosse Pläne. Auf dem Hals kleben Sternli-Kleber.'); return; }
    await sayP('elin', 'Papi, hörst du mir zu? Ich spiel dir mein Lied vor. Es hat drei Akkorde!');
    for (const [k, f] of [[0, 196], [1, 262], [2, 294], [3, 196]]) { Snd.tone(f, 0.5, 'triangle', 0.08, k * 0.55); Snd.tone(f * 1.25, 0.5, 'triangle', 0.05, k * 0.55 + 0.02); Snd.tone(f * 1.5, 0.5, 'triangle', 0.05, k * 0.55 + 0.04); }
    await sleep(2400);
    await sayP('elin', 'G, C, D und nochmal G! Im St. Martin spiel ich das am Weihnachtssingen.');
    if (h < 20 || this.followOk()) await kidSay('timo', 'Papi, ich tanz dazu! Wie ein Traktor!');
    mood(6);
  },
  async kaffee(withIsa) {
    const s = this.st(); s.isaKaffee = (s.isaKaffee || 0) + 1;
    consume('kaffee'); Snd.sfx('gulp');
    const n = 3 + s.isaKaffee;
    if (withIsa || this.isaWhere().map === G.map.id) await sayP('isa', pick([`Für mich ist das heute der ${n}. Kaffee. Zähl nicht mit, Timo!`, 'Ohne Kaffee kein Homeoffice. Ohne Homeoffice kein Kaffee. Ein Teufelskreis. Ein schöner.', 'Bruno, die Kaffeemaschine, ist das zuverlässigste Teammitglied, das ich habe.']));
    else UI.toast('☕ Bruno, die Kaffeemaschine, brummt zufrieden.');
  },
  async bauernQuiz() {
    const Q = [
      ['Wozu braucht man einen Kreiselheuer?', 'Gras zum Trocknen wenden und verteilen', ['Kühe kämmen', 'Schnee räumen']],
      ['Was macht ein Schwader?', 'Heu zu langen Reihen zusammenrechen', ['Butter machen', 'Gänse zählen']],
      ['Womit holt man Gras vom Feld?', 'Mit dem Ladewagen', ['Mit dem Postauto', 'Mit dem Pedalo']],
      ['Was macht ein Mähdrescher?', 'Getreide mähen und dreschen', ['Gras mähen und duschen', 'Milch abfüllen']],
      ['Was hebt der Frontlader vorne am Traktor?', 'Ballen und schwere Lasten', ['Den Bauern ins Bett', 'Die Kühe zum Melken']],
      ['Was macht ein Melkroboter?', 'Die Kühe melken, wann sie wollen', ['Gänse füttern', 'Traktor fahren']],
      ['Was macht die Ballenpresse?', 'Heu oder Stroh zu Ballen pressen', ['Äpfel zu Saft pressen', 'Hosen bügeln']],
    ];
    await sayP('thierry', 'Bauernhof-Quiz! Drei Fragen. Ich weiss ALLES über Landmaschinen.');
    let ok = 0;
    for (const [q, r, w] of shuffle(Q.slice()).slice(0, 3)) {
      const opts = shuffle([r, ...w]);
      const c = await askP('thierry', q, opts);
      if (opts[c] === r) { ok++; await sayP('thierry', pick(['Richtig! Du könntest Bauer werden.', 'Genau! Das hat mir der Bauer vom Gänsehof gezeigt.', 'Stimmt! Ich hab das schon mit drei gewusst.'])); }
      else await sayP('thierry', `Falsch! ${r}. Das weiss doch jedes Kind. Also ich.`);
    }
    if (ok === 3) { achieve('su_bauer'); mood(5); await sayP('thierry', 'Alles richtig! Du darfst mal mit mir Traktor fahren. Also, auf dem Spielplatz. Auf dem Wipptraktor.'); }
    else await sayP('louve', 'Thierry, lass ihn. Nicht jeder muss wissen, was ein Schwader ist.');
  },
  async scheune() {
    await Story.say(null, 'Die Scheune vom Gänsehof: ein Traktor mit Frontlader, ein Ladewagen, ein Kreiselheuer und ein Schwader. Im Dezember ruhen die Maschinen.');
    await UI.say(SU_P.thierry, '📱 Bist du beim Gänsehof? Schau den Kreiselheuer an! Der hat sechs Kreisel! SECHS! … Ruf zurück, wenn du ein Quiz willst.');
  },
  /* ---------- Der Poller beim Untertor ---------- */
  pollerBroken() { return this.st().pollerDay === dayOf(G.S.time); },
  _poller: { up: 0 },
  /* Velo: Absteigen und Aufsteigen mit A, wenn nichts anderes vor dir ist */
  veloAction() {
    const s = this.active() ? this.st() : null;
    if (!s || !s.velo || G.map.indoor || !['sursee', 'sursee_see'].includes(G.map.id) || G.live) return null;
    return { trig: { act: () => this.veloToggle() }, label: G.player.velo ? 'Vom Velo absteigen' : 'Aufs Velo steigen' };
  },
  async veloToggle() {
    const s = this.st();
    G.player.velo = !G.player.velo; s.veloOff = G.player.velo ? 0 : 1;
    Snd.sfx('blip');
    UI.toast(G.player.velo ? '🚲 Aufgestiegen.' : '🚶 Abgestiegen – du schiebst das Velo neben dir her. Mit A steigst du wieder auf.');
  },
  /* Surseepark Obergeschoss: Läden mit Reaktion der Kinder */
  async ogShop(id) {
    const before = { pluschgans: hasInv('pluschgans'), legofeuerwehr: hasInv('legofeuerwehr'), kinderhelm: hasInv('kinderhelm'), plektren: hasInv('plektren'), bilderbuch: hasInv('bilderbuch'), krimi: hasInv('krimi') };
    await Story.shop(id);
    if (!this.followOk()) return;
    const neu = (k) => !before[k] && hasInv(k);
    if (neu('pluschgans')) await kidSay('timo', 'Eine Gans! Papi, darf ich sie haben? Ich nenn sie … Ruedi!');
    if (neu('legofeuerwehr')) await kidSay('timo', 'Ein Feuerwehrauto! Mit Leiter! Papi, du bist der Beste! TATÜTATA!');
    if (neu('kinderhelm')) await kidSay('timo', 'Ein Velohelm! Jetzt darf ich schneller fahren, oder Papi?');
    if (neu('plektren')) await kidSay('elin', 'Plektren! Danke, Papi! Jetzt klingt mein G noch besser.');
    if (neu('bilderbuch')) await kidSay('timo', '„Der kleine Traktor“! Thierry wird so neidisch sein!');
    if (neu('krimi')) await kidSay('elin', 'Ein Krimi? Papi, du liest doch schon einen. Den echten!');
  },
  async kinderparadies() {
    if (!this.followOk()) { await Story.say(null, 'Das Kinderparadies: Bällebad und Rutsche. Ein Schild: „Nur für Kinder bis 1,20 m“. Du bist knapp zu gross.'); return; }
    await kidSay('timo', 'BÄLLEBAD! Papi, schau! Ich bin ein Fisch!'); await kidSay('elin', 'Ich rutsch zehnmal. Nein, zwanzigmal!');
    await Story.say(null, 'Eine halbe Stunde lang fliegen bunte Bälle durch die Luft. Du sitzt auf dem Bänkli und schaust zu.');
    mood(8); energy(4); passTime(30);
    await kidSay('timo', 'Papi, ich hab einen Ball in der Hose gefunden. Er ist rot.');
  },
  async sportplatz() {
    const c = await Story.ask(null, 'Der rote Allwetterplatz neben der Stadthalle: Tartanbahn, Handballtore, ein paar vergessene Hütchen.', ['Sackgumpe-Rennen mit den Kindern', 'Ein paar Runden joggen', 'Weitergehen']);
    if (c === 0) {
      if (!this.followOk()) { await Story.say(null, 'Ohne Elin und Timo macht das keinen Spass. Die zwei sind gerade nicht dabei.'); return; }
      const r = await this.mini('sackgumpe', ['Elin', 'Timo', 'Thierry']);
      if (r && r.place === 1) { achieve('su_kinder'); UI.toast('Sieg auf dem Sportplatz!'); } else await kidSay('timo', 'Nomal, Papi! Nomal!');
      energy(-8); mood(6); passTime(15);
    } else if (c === 1) {
      await Story.say(null, 'Vier Runden auf der Tartanbahn. Die Lunge brennt, der Kopf wird klar.');
      energy(-12); mood(8); G.S.st.hang = Math.max(0, (G.S.st.hang || 0) - 20); passTime(25);
    }
  },
  async klosterbank() {
    const s = this.st();
    if (!this.hiddenOpen('trainingsplan')) { await Story.say(null, 'Eine Bank im Klostergarten. Still. Ein Rotkehlchen hüpft herum.'); return; }
    s.hidden.trainingsplan = 1;
    await Story.say(null, 'Unter der Bank klemmt ein zerknittertes Blatt: „TRAININGSPLAN GANSABHAUET. 1. Blind gehen. 2. Maske tragen (echte!). 3. Roter Mantel. 4. Vollmond. 5. Inseli – da sieht mich keiner.“');
    achieve('su_kloster'); this.evid('plan');
    this.note('plan', 'Im Klostergarten: ein Trainingsplan für die Gansabhauet – „echte Maske, roter Mantel, Inseli“.');
  },
  async sprung() {
    const c = await Story.ask(null, 'Der Sprungturm im Strandbad. Wasser: 6 Grad. Es ist Dezember.', ['1 Meter', '3 Meter', '5 Meter', 'Bist du verrückt?']);
    if (c === 3) return;
    const r = await this.mini('sprung', [1, 3, 5][c]);
    G.S.st.wet = 120; energy(10); mood(c === 2 ? 10 : 6);
    achieve('su_sprung');
    await Story.say('me', r && r.score >= 15 ? 'Kalt! KALT! Aber die Haltungsnoten waren super.' : 'Kaaaalt! Ich brauch sofort einen Glühwein.');
  },
  async sup() {
    const c = await Story.ask('Seebadi Schenkon', 'Stand-up-Paddle im Dezember? Mit Neopren, ja. 20 Franken für eine halbe Stunde.', ['Mieten (20 CHF)', 'Nein danke']);
    if (c !== 0) return;
    if (!pay('chf', 20)) { UI.toast('Zu wenig Franken.', 'warn'); return; }
    const r = await this.mini('sup');
    if (r && r.ok) { achieve('su_sup'); UI.toast('Trocken geblieben! Respekt.'); mood(8); }
    else { G.S.st.wet = 120; mood(-2); UI.toast('Platsch! Eiskalt.'); }
  },
  async sleep() {
    const c = await Story.ask(null, 'Das Gästebett bei Isa. Frisch bezogen, mit einer Wärmflasche.', [{ t: 'Kurz hinlegen', r: '1 Std.' }, { t: 'Powernap', r: '3 Std.' }, { t: 'Schlafen bis morgen früh', r: 'bis 8:00' }, { t: 'Lieber nicht' }]);
    if (c === 3) return;
    let mins = c === 0 ? 60 : c === 1 ? 180 : null;
    if (mins == null) { const t = G.S.time, d = dayOf(t), h = hourOf(t); mins = (h < 4 ? d : d + 1) * 1440 + 8 * 60 - t; }
    await Story.sleep(mins, 'isa');
  },
  async fridge() {
    const c = await Story.ask(null, 'Isas Kühlschrank: Rivella, Rüeblitorte, Joghurt, ein Rest Pizza.', ['Rivella', 'Rüeblitorte', 'Rest Pizza', 'Zu']);
    if (c === 3) return;
    consume(['rivella', 'ruebli', 'pizza'][c]);
    UI.toast(['Rivella! Schmeckt nach Heimat.', 'Isas Rüeblitorte. Himmlisch.', 'Kalte Pizza, das beste Frühstück.'][c]);
  },
  async wc() { await Story.toilet('isa'); },
  async shower() { await Story.shower(); },

  /* ---------- Zufallsereignisse in Sursee ---------- */
  EVENTS_SU: [
    { id: 'guuggen', cond: () => { const h = hourOf(G.S.time); return h >= 11 && h < 22; } },
    { id: 'gans', cond: () => { const h = hourOf(G.S.time); return h >= 9 && h < 17; } },
    { id: 'nebel', cond: () => { const h = hourOf(G.S.time); return h >= 6 && h < 11; } },
    { id: 'drohne', cond: () => { const h = hourOf(G.S.time); return h >= 10 && h < 16 && !!FRIENDS.roemu && !Sur.st().direct; } },
    { id: 'poller', cond: () => { const h = hourOf(G.S.time); return h >= 7 && h < 21 && !Sur.pollerBroken(); } },
    { id: 'brand', cond: () => { const h = hourOf(G.S.time); return h >= 8 && h < 23 && !!Sur.st().brandDone; } },
  ],
  maybeEvent() {
    const s = this.st();
    if (G.busy || G.live || G.map.id !== 'sursee' || !suAt('s_tatort') || G.mode !== 'play') return;
    const d = dayOf(G.S.time);
    s.evN = s.evN || {};
    if (!s.brandDone && suAt('s_strahl') && hourOf(G.S.time) >= 14 && hourOf(G.S.time) < 21 && (s.lastEv == null || G.S.time - s.lastEv >= 60) && Math.random() < 1 / 25) {
      s.evN[d] = (s.evN[d] || 0) + 1; s.lastEv = G.S.time;
      Story.announce('brand').then(() => this.ev_brand());
      return;
    }
    if ((s.evN[d] || 0) >= 2) return;
    if (s.lastEv != null && G.S.time - s.lastEv < 150) return;
    if (Math.random() > 1 / 90) return;
    const list = this.EVENTS_SU.filter((e) => e.cond());
    if (!list.length) return;
    const e = list[Math.floor(Math.random() * list.length)];
    s.evN[d] = (s.evN[d] || 0) + 1; s.lastEv = G.S.time;
    Story.announce(e.id).then(() => this['ev_' + e.id]());
  },
  shakeEvent() {
    if (G.map.id !== 'sursee' || !suAt('s_tatort')) { UI.toast('📳 Du schüttelst das Handy … aber hier passiert nichts. Versuch\'s draussen in der Altstadt von Sursee.'); return; }
    const s = this.st();
    const ids = this.EVENTS_SU.map((e) => e.id);
    const id = ids[(s.shakeIdx || 0) % ids.length]; s.shakeIdx = (s.shakeIdx || 0) + 1;
    achieve('schuettler');
    Story._viaShake = true;
    UI.toast('📳 Irgendetwas in Sursee hat dein Schütteln gespürt …', 'ach');
    Story.announce(id).then(() => this['ev_' + id]());
  },
  /* Eine Guugge zieht unangekündigt durch die Oberstadt */
  async ev_guuggen() {
    const p = G.player, y = 38 * 16 + 12;
    const band = [];
    for (let i = 0; i < 6; i++) band.push(Story.tempActor({ name: 'Guugger', look: npcLook(4200 + i, { top: 4, topCol: [0, 4, 9, 6, 12, 2][i], pants: 4, pantsCol: 2 }), x: (53 + i * 1.2) * 16, y: y + (i % 2) * 10, dir: 2, speed: 26, larve: ['#e8c23a', '#c8302a', '#3f8ec8', '#3f8e4b', '#e3589c', '#f4f0e6'][i], larve2: '#1a1a1a', instr: ['pauke', 'trompete', 'trompete', 'pauke', 'trompete', 'sousa'][i], extra: drawLarve, bubbleRand: ['note'] }));
    let t = 0, beat = 0, danced = false;
    G.live = {
      update: (dt) => {
        t += dt;
        for (const a of band) { a.x += 26 * dt; a.moving = true; a.walkT += dt; a.dir = 2; }
        if (Math.floor(t * 2.4) !== beat) { beat = Math.floor(t * 2.4); Snd.tone(beat % 4 === 0 ? 90 : 140, 0.12, 'triangle', 0.12); if (beat % 2) Snd.tone([392, 440, 523, 587][beat % 4], 0.18, 'square', 0.04); }
        if (!danced && band.some((a) => Math.hypot(a.x - p.x, a.y - p.y) < 30)) { danced = true; mood(10); UI.toast('Du tanzt mit der Guugge durch die Gasse!'); p.pose = 'danceA'; }
        if (band[0].x > 118 * 16 || t > 40) { for (const a of band) Story.dropActor(a); G.live = null; UI.toast('Die Guugge zieht weiter Richtung Märtplatz.'); }
      },
      hudText: () => 'Eine Guuggenmusig zieht durch die Oberstadt!',
    };
  },
  /* Eine Gans ist ausgebüxt */
  async ev_gans() {
    const p = G.player;
    const g = { x: p.x + 60, y: p.y - 10, vx: 0, vy: 0, t: 0 };
    let t = 0;
    UI.toast('Eine Gans rennt schnatternd durch das Städtli! Fang sie (lauf hinein)!');
    G.live = {
      update: (dt) => {
        t += dt; g.t += dt;
        const dx = g.x - p.x, dy = g.y - p.y, d = Math.hypot(dx, dy) || 1;
        const run = d < 70 ? 52 : 18;
        g.vx += ((dx / d) * run - g.vx) * dt * 2 + Math.sin(t * 3) * 6 * dt; g.vy += ((dy / d) * run - g.vy) * dt * 2 + Math.cos(t * 2.3) * 6 * dt;
        const nx = g.x + g.vx * dt, ny = g.y + g.vy * dt;
        if (!G.map.isSolid(Math.floor(nx / 16), Math.floor((ny - 2) / 16))) { g.x = nx; g.y = ny; } else { g.vx = -g.vx; g.vy = -g.vy; }
        if (Math.floor(t * 3) !== Math.floor((t - dt) * 3) && Math.random() < 0.4) Snd.tone(520, 0.08, 'square', 0.04, 0, 200);
        if (d < 12) { G.live = null; addMoney('chf', 20); mood(10); Snd.sfx('win'); UI.toast('Gefangen! Die Bäuerin vom Martigny-Platz gibt dir 20 Franken Finderlohn.'); }
        else if (t > 35) { G.live = null; UI.toast('Die Gans ist entwischt – Richtung Sure. Schnatter.'); }
      },
      draw: (c, cx, cy) => { const x = Math.round(g.x - cx), y = Math.round(g.y - cy), f = g.vx < 0, s = f ? -1 : 1; E(c, x, y + 1, 6, 2, 'rgba(0,0,0,0.2)'); E(c, x, y - 5, 6, 4, '#f4f0e6'); R(c, x + s * 3, y - 14, 2, 8, '#f4f0e6'); E(c, x + s * 4, y - 14, 2, 2, '#f4f0e6'); P(c, x + s * 6, y - 14, '#e8902a'); P(c, x + s * 7, y - 14, '#e8902a'); P(c, x + s * 4, y - 15, '#1a1a1a'); const l = Math.floor(G.t * 10) % 2; R(c, x - 2, y - 1, 1, 2 + l, '#e8902a'); R(c, x + 1, y - 1, 1, 3 - l, '#e8902a'); },
      hudText: () => 'Fang die Gans!',
    };
  },
  /* Nebel über Sursee */
  async ev_nebel() {
    let t = 0;
    UI.toast('Dichter Nebel zieht vom See herauf. Typisch Dezember.');
    G.live = {
      update: (dt) => { t += dt; if (t > 50) { G.live = null; UI.toast('Der Nebel lichtet sich.'); } },
      draw: (c, cx, cy, tt) => { const a = Math.min(0.55, t * 0.08, (50 - t) * 0.08); for (let k = 0; k < 7; k++) { const x = ((k * 97 + tt * 6) % (View.w + 120)) - 60, y = (k * 53) % View.h; c.fillStyle = `rgba(220,226,232,${a * 0.6})`; c.beginPath(); c.ellipse(x, y, 90, 40, 0, 0, 6.283); c.fill(); } c.fillStyle = `rgba(210,216,222,${a * 0.5})`; c.fillRect(0, 0, View.w, View.h); },
      hudText: () => 'Nebel über Sursee',
    };
  },
  /* Feuerwehreinsatz: Ein Haus in der Unterstadt (neben dem La Fuga) brennt. Notruf 118, Löschfahrzeug vom Depot durchs Untertor,
     Strahlrohr (A drücken, vor dem Haus stehen), Drehleiter, Rettung von Frau Wüest. Beim ersten Mal ein Hinweis zum Fall. */
  async ev_brand() {
    const s = this.st(), p = G.player, first = !s.brandDone;
    const HX = 66 * 16, HB = 50 * 16, HW = 64;
    const win = (k, f) => [HX + k * 16 + 8, HB - (f + 1) * 16 + 9];
    const B = this._brand = { phase: 'alarm', t: 0, fl: [1, 1, 0.8, 1, 0.9, 1, 1, 0.7], truck: { x: 12 * 16, y: 51 * 16, i: 0, go: 15 }, spray: 0, sprayK: 0, helped: 0, ladder: 0, person: 0, crew: [], said: false };
    const path = [[12, 51], [16.5, 51], [16.5, 38.5], [58.5, 38.5], [58.5, 51.3], [63, 51.3]].map(([x, y]) => [x * 16, y * 16]);
    const c0 = await Story.ask(null, 'Rauch über der Unterstadt! Aus einem Fenster neben dem La Fuga schlagen Flammen. Oben am Fenster winkt jemand.', ['📞 118 anrufen', 'Hinrennen und schauen']);
    if (c0 === 0) {
      Snd.sfx('ding');
      const c1 = await Story.ask('Feuerwehr-Notruf 118', 'Feuerwehr, Notruf 118. Wo brennt es genau?', ['Unterstadt, neben dem La Fuga', 'Am Märtplatz bei der Chilbi', 'Beim Bahnhof']);
      if (c1 === 0) { B.truck.go = 3; await Story.say('Feuerwehr-Notruf 118', 'Verstanden, Unterstadt. Wir rücken aus. Bringen Sie sich in Sicherheit und halten Sie die Gasse frei!'); }
      else { B.truck.go = 12; await Story.say('Feuerwehr-Notruf 118', 'Dort sehen wir nichts … Moment, ein Nachbar meldet Rauch in der Unterstadt. Wir fahren!'); }
    } else UI.toast('Irgendwer hat schon 118 gewählt – vom Feuerwehrdepot heult die Sirene.');
    const crewLook = (i) => npcLook(5300 + i, { top: 4, topCol: 2, pants: 4, pantsCol: 2, hat: 0 });
    const zone = () => Math.abs(p.x - (HX + HW / 2)) < 56 && p.y > HB - 4 && p.y < HB + 52;
    const finish = async (byPlayer) => {
      B.phase = 'done'; G.live = null;
      for (const a of B.crew) Story.dropActor(a);
      s.brandDone = 1; s.brandN = (s.brandN || 0) + 1;
      if (!byPlayer) { UI.toast('Die Feuerwehr Sursee hat den Brand gelöscht. Frau Wüest ist gerettet – ohne dich.'); return; }
      G.busy++;
      try {
        await Story.say('Feuerwehrkommandant', 'Feuer aus! Gute Arbeit mit dem Strahlrohr. Wenn Sie wollen: Die Feuerwehr Sursee sucht immer Leute.');
        await Story.say('Frau Wüest', first ? 'Merci vielmal! Ich hab nur Guetzli backen wollen … und dann der Ofen! Mimi, meine Katze, ist auch gerettet.' : 'Schon wieder ich! Jetzt kauf ich mir einen Feuerlöscher. Und keine Guetzli mehr.');
        if (first && !suAt('s_gans')) {
          await Story.say('Frau Wüest', 'Sagen Sie … Sie suchen doch die goldene Maske? In der Nacht vor der Gansabhauet hab ich vom Fenster aus einen Mann im roten Mantel gesehen. Er kam aus dem Waschhaus beim Diebenturm, mit einem Ruder unter dem Arm.');
          this.note('wueest', 'Frau Wüest (Unterstadt): Nachts ein Mann im roten Mantel mit einem Ruder, aus dem Waschhaus beim Diebenturm.');
        }
        achieve('su_feuer'); mood(15); energy(-10); G.S.st.smell = Math.min(100, (G.S.st.smell || 0) + 25);
        if (first) { addMoney('chf', 50); UI.toast('Frau Wüest drückt dir 50 Franken in die Hand. Du riechst nach Rauch.'); }
        passTime(20);
      } finally { G.busy--; }
    };
    G.live = {
      onLeave: () => { if (B.phase !== 'done') { s.brandDone = 1; s.brandN = (s.brandN || 0) + 1; } },
      update: (dt) => {
        B.t += dt; B.spray = Math.max(0, B.spray - dt);
        if (Math.floor(B.t * 2) !== Math.floor((B.t - dt) * 2) && B.phase !== 'rettung') Snd.tone(Math.floor(B.t * 2) % 2 ? 660 : 880, 0.4, 'sine', 0.035);
        const burning = B.fl.filter((v) => v > 0).length;
        for (let i = 0; i < 8; i++) if (B.fl[i] > 0 && B.phase !== 'rettung') B.fl[i] = Math.min(1, B.fl[i] + 0.015 * dt);
        /* Löschfahrzeug */
        const tr = B.truck;
        if (B.t > tr.go && tr.i < path.length - 1) {
          const [tx, ty] = path[tr.i + 1], dx = tx - tr.x, dy = ty - tr.y, d = Math.hypot(dx, dy), v = 95 * dt;
          if (d <= v) { tr.x = tx; tr.y = ty; tr.i++; } else { tr.x += dx / d * v; tr.y += dy / d * v; }
          tr.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 2 : 1) : (dy > 0 ? 0 : 3);
          if (tr.i === path.length - 1) {
            B.phase = 'loeschen'; B.tl = 0;
            for (let i = 0; i < 3; i++) B.crew.push(Story.tempActor({ name: 'Feuerwehrmann', look: crewLook(i), x: (60 + i * 1.5) * 16, y: 51.6 * 16, dir: 3, speed: 0, bubbleRand: ['!'] }));
            UI.toast('Die Feuerwehr ist da! Stell dich vor das Haus und drück A, um mit dem Strahlrohr zu löschen.');
          }
        }
        if (B.phase === 'loeschen') {
          B.tl += dt;
          /* die Feuerwehrleute löschen mit, langsamer als mit Hilfe */
          const mi = B.fl.indexOf(Math.max(...B.fl)); B.fl[mi] = Math.max(0, B.fl[mi] - 0.22 * dt);
          if (zone() && !B.said) {
            B.said = true;
            (async () => { G.busy++; try { await Story.say('Feuerwehrkommandant', 'Sie da! Nehmen Sie das zweite Strahlrohr – Wasser auf die Fenster, ich schick die Leiter hoch, sobald es geht!'); } finally { G.busy--; } })();
          }
          if (B.fl.every((v) => v <= 0)) { B.phase = 'rettung'; B.tr = 0; UI.toast('Feuer unter Kontrolle! Die Drehleiter fährt aus …'); }
          else if (B.tl > 120) { B.fl.fill(0); B.phase = 'rettung'; B.tr = 0; }
        } else if (B.phase === 'rettung') {
          B.tr += dt; B.ladder = Math.min(1, B.tr / 3); if (B.tr > 3) B.person = Math.min(1, (B.tr - 3) / 4);
          if (B.tr > 7.5) finish(B.helped >= 3 && Math.hypot(p.x - (HX + 32), p.y - HB) < 200);
        }
      },
      onAction: () => {
        if (B.phase !== 'loeschen' || !zone()) return false;
        const k = clamp(Math.round((p.x - HX - 8) / 16), 0, 3);
        B.sprayK = k; B.spray = 0.45; B.helped++;
        for (const i of [k, k + 4]) B.fl[i] = Math.max(0, B.fl[i] - 0.34);
        Snd.tone(220, 0.25, 'sawtooth', 0.03, 0, -120);
        return true;
      },
      draw: (c, cx, cy, tt) => {
        /* Rauch */
        for (let k = 0; k < 9; k++) { const a = ((tt * 0.25 + k / 9) % 1), sx = HX + 20 + k * 3 + Math.sin(tt + k) * 10 - cx, sy = HB - 150 - a * 90 - cy; const burning = B.fl.reduce((u, v) => u + v, 0) / 8; if (burning <= 0 && B.phase === 'rettung') continue; c.fillStyle = `rgba(70,70,74,${(0.45 - a * 0.4) * Math.max(0.25, burning)})`; c.beginPath(); c.ellipse(sx, sy, 10 + a * 18, 7 + a * 12, 0, 0, 6.283); c.fill(); }
        /* Flammen in den Fenstern */
        for (let i = 0; i < 8; i++) {
          const v = B.fl[i]; const [wx, wy] = win(i % 4, i < 4 ? 1 : 2); const x = Math.round(wx - cx), y = Math.round(wy - cy);
          if (v <= 0) { R(c, x - 4, y - 5, 8, 9, 'rgba(30,26,24,0.75)'); continue; }
          const fl = 0.7 + Math.sin(tt * 14 + i * 2) * 0.3, hgt = Math.round((8 + 10 * v) * fl);
          c.fillStyle = '#e8401a'; c.beginPath(); c.moveTo(x - 5, y + 4); c.lineTo(x, y + 4 - hgt); c.lineTo(x + 5, y + 4); c.closePath(); c.fill();
          c.fillStyle = '#ffb02a'; c.beginPath(); c.moveTo(x - 3, y + 4); c.lineTo(x + Math.sin(tt * 9 + i), y + 4 - hgt * 0.65); c.lineTo(x + 3, y + 4); c.closePath(); c.fill();
          R(c, x - 1, y, 2, 3, '#fff2a0');
        }
        /* Frau Wüest am Fenster bzw. auf der Leiter */
        const [px0, py0] = win(2, 3), [lx, ly] = [B.truck.x + 6, B.truck.y - 10];
        if (B.ladder > 0) { const ex = lx + (px0 - lx) * B.ladder, ey = ly + (py0 + 6 - ly) * B.ladder; for (let k = 0; k <= 10; k++) { const q = k / 10; R(c, Math.round(lx + (ex - lx) * q - cx) - 2, Math.round(ly + (ey - ly) * q - cy), 5, 1, '#c8c8cc'); } line(c, Math.round(lx - cx), Math.round(ly - cy), Math.round(ex - cx), Math.round(ey - cy), '#8a8e94'); }
        if (B.person < 1) {
          const q = B.person, x = Math.round(px0 + (lx - px0) * q - cx), y = Math.round(py0 + (ly - py0) * q - cy) - 2;
          E(c, x, y - 3, 3, 3, '#f0c8a0'); R(c, x - 2, y - 7, 5, 3, '#d8d8dc'); R(c, x - 3, y, 6, 6, '#7a3a5a');
          const w = Math.floor(tt * 6) % 2; line(c, x - 3, y + 1, x - 6, y - 3 - w * 2, '#f0c8a0'); line(c, x + 3, y + 1, x + 6, y - 3 - (1 - w) * 2, '#f0c8a0');
          if (B.phase !== 'rettung' && Math.floor(tt * 1.5) % 3 === 0) { R(c, x - 14, y - 20, 29, 9, '#ffffff'); pxText(c, 'HILFE!', x - 12, y - 18, '#c8302a'); }
        }
        /* Strahl */
        if (B.spray > 0) { const [wx, wy] = win(B.sprayK, 2), x0 = Math.round(p.x - cx), y0 = Math.round(p.y - cy) - 14, x1 = Math.round(wx - cx), y1 = Math.round(wy - cy); for (let k = 0; k < 12; k++) { const q = k / 12, j = Math.sin(tt * 40 + k) * 1.5; R(c, Math.round(x0 + (x1 - x0) * q + j), Math.round(y0 + (y1 - y0) * q - Math.sin(q * Math.PI) * 10), 2, 2, k % 2 ? '#bfe6ff' : '#7ac0f0'); } }
        /* Löschfahrzeug */
        const tr = B.truck, tx = Math.round(tr.x - cx), ty = Math.round(tr.y - cy), side = tr.dir === 1 || tr.dir === 2, fx = tr.dir === 1 ? -1 : 1;
        E(c, tx, ty + 2, side ? 20 : 10, 3, 'rgba(0,0,0,0.25)');
        if (side) { R(c, tx - 20, ty - 16, 40, 14, '#c8302a'); R(c, tx - 20, ty - 9, 40, 2, '#f4f0e6'); R(c, tx - 18, ty - 20, 30, 3, '#b8bcc2'); for (let k = 0; k < 6; k++) R(c, tx - 17 + k * 5, ty - 21, 1, 5, '#8a8e94'); const cxx = tx + fx * 14; R(c, cxx - 5, ty - 15, 10, 6, '#7ac0e0'); for (const wx of [-13, 10]) { E(c, tx + wx, ty - 1, 4, 4, '#1a1a1e'); E(c, tx + wx, ty - 1, 2, 2, '#8a8e94'); } }
        else { R(c, tx - 9, ty - 24, 18, 24, '#c8302a'); R(c, tx - 7, ty - 22, 14, 6, tr.dir === 0 ? '#7ac0e0' : '#a8282a'); R(c, tx - 9, ty - 12, 18, 2, '#f4f0e6'); R(c, tx - 4, ty - 20, 8, 16, '#b8bcc2'); }
        const bl = Math.floor(tt * 6) % 2; R(c, tx - 4, ty - (side ? 19 : 26), 3, 2, bl ? '#3a8aff' : '#1a2a6a'); R(c, tx + 1, ty - (side ? 19 : 26), 3, 2, bl ? '#1a2a6a' : '#3a8aff');
      },
      lights: () => { const L = []; const burn = B.fl.reduce((u, v) => u + v, 0); if (burn > 0) L.push({ x: HX + 32, y: HB - 26, r: 40 + burn * 8, c: '#ff8a3a' }); L.push({ x: B.truck.x, y: B.truck.y - 20, r: 26, c: Math.floor(G.t * 6) % 2 ? '#3a8aff' : '#ff5a5a' }); return L; },
      hudText: () => B.phase === 'alarm' ? (B.t < B.truck.go ? 'Feuer in der Unterstadt! Die Feuerwehr wird alarmiert …' : 'Das Löschfahrzeug ist unterwegs – lauf in die Unterstadt!') : B.phase === 'loeschen' ? `Löschen! Vor dem Haus A drücken · Flammen: ${B.fl.filter((v) => v > 0).length}/8` : 'Die Drehleiter fährt aus …',
    };
  },
  /* Das Postauto (oder ein Auto) fährt beim Untertor in den Versenkpoller */
  async ev_poller() {
    const s = this.st(), p = G.player, bus = Math.random() < 0.6;
    const V = { x: 20 * 16, y: 38.6 * 16, v: 70, hit: false, t: 0, back: 0 }, PX = 57 * 16 + 8;
    this._poller.up = 0; this._poller.v = V;
    const near = () => Math.hypot(p.x - PX, p.y - V.y) < 230;
    G.live = {
      update: (dt) => {
        V.t += dt;
        if (!V.hit) {
          V.x += V.v * dt;
          if (V.x > 49 * 16) this._poller.up = Math.min(1, this._poller.up + dt * 1.5);
          if (V.x + 26 >= PX - 6 && this._poller.up >= 1) {
            V.hit = true; Snd.sfx('hit'); Snd.tone(70, 0.4, 'square', 0.12); G.fx.shake = Math.max(G.fx.shake || 0, 0.5);
            s.pollerDay = dayOf(G.S.time); s.pollerN = (s.pollerN || 0) + 1;
            (async () => {
              G.busy++;
              try {
                if (near()) {
                  achieve('su_poller');
                  await Story.say(bus ? 'Postauto-Chauffeur' : 'Fahrer mit Zürcher Nummer', bus ? pick(['Jetzt chunnt dä Poller scho wieder ufe! Ich bi doch s Postauto!', 'Das isch dä dritt Poller die Wuche. Ich glaub, dä mag mi nöd.', 'Dä Poller isch neu? Dä Poller isch IMMER neu!']) : pick(['Das Navi hat gesagt: geradeaus!', 'Wieso steht da plötzlich ein Pfosten? Der war doch eben noch im Boden!', 'Ich wollte nur kurz in die Altstadt parkieren …']));
                  if (this.followOk()) { await kidSay('timo', 'KLONK! Papi, nochmal! Nochmal!'); await kidSay('elin', 'Mami sagt, dieser Poller hat mehr Unfälle als die Achterbahn.'); }
                  await Story.say('Mann vom Werkhof', pick(['(stellt ein Hütchen hin) Ich hab mir schon einen Stempel machen lassen: „Poller defekt“.', '(seufzt) Wir bestellen die Poller inzwischen im Zehnerpack.', '(notiert) Poller beim Untertor. Wieder. Ich nehm gleich zwei mit.']));
                } else UI.toast(bus ? '💥 KLONK! Beim Untertor ist das Postauto in den Poller gefahren. Schon wieder.' : '💥 KLONK! Beim Untertor ist ein Auto in den Poller gefahren. Schon wieder.');
              } finally { G.busy--; }
            })();
          }
        } else if (!G.busy) {
          V.back += dt; V.x -= 40 * dt;
          if (V.back > 5) { G.live = null; UI.toast(`🚧 Poller-Strichliste beim Untertor: ${11 + s.pollerN} Treffer. Der Werkhof ist unterwegs.`); }
        }
      },
      draw: (c, cx, cy, tt) => {
        const x = Math.round(V.x - cx), y = Math.round(V.y - cy);
        E(c, x, y + 2, bus ? 26 : 16, 3, 'rgba(0,0,0,0.25)');
        if (bus) {
          R(c, x - 26, y - 22, 52, 20, '#f2c200'); R(c, x - 26, y - 22, 52, 2, '#fff2a0'); R(c, x - 24, y - 18, 40, 6, '#2a3a4a'); for (let k = 0; k < 5; k++) R(c, x - 24 + k * 8, y - 18, 1, 6, '#f2c200');
          R(c, x + 18, y - 18, 6, 12, '#2a3a4a'); R(c, x - 20, y - 10, 34, 3, '#c8302a'); pxText(c, 'POSTAUTO', x - 18, y - 9, '#ffffff');
          for (const wx of [-16, 14]) { E(c, x + wx, y - 2, 4, 4, '#1a1a1e'); E(c, x + wx, y - 2, 2, 2, '#8a8e94'); }
          if (V.hit) R(c, x + 24, y - 12, 2, 4, '#5a5e64');
        } else {
          R(c, x - 16, y - 12, 32, 10, '#e8e4dc'); R(c, x - 10, y - 18, 18, 7, '#e8e4dc'); R(c, x - 8, y - 17, 6, 5, '#7ac0e0'); R(c, x + 1, y - 17, 6, 5, '#7ac0e0'); R(c, x + 14, y - 9, 2, 2, '#ffe080');
          for (const wx of [-10, 10]) { E(c, x + wx, y - 2, 3, 3, '#1a1a1e'); }
          pxText(c, 'ZH', x - 13, y - 9, '#2a2a2e');
        }
        if (V.hit && Math.floor(tt * 4) % 2 && V.back < 1) pxText(c, 'KLONK!', x + 10, y - 34, '#c8302a');
      },
      hudText: () => (V.hit ? 'KLONK! Der Poller beim Untertor …' : (bus ? 'Das Postauto fährt Richtung Untertor …' : 'Ein Auto fährt Richtung Untertor …')),
    };
  },
  /* Römus Drohne stürzt ab */
  async ev_drohne() {
    const p = G.player;
    const dr = { x: p.x - 40, y: p.y - 60, z: 40, t: 0, down: false };
    G.live = {
      update: (dt) => { dr.t += dt; if (!dr.down) { dr.x += Math.sin(dr.t * 2) * 30 * dt + 20 * dt; dr.y += Math.cos(dr.t * 1.5) * 20 * dt; if (dr.t > 4) dr.down = true; } else { dr.z = Math.max(0, dr.z - 40 * dt); if (dr.z === 0 && !dr.done) { dr.done = 1; Snd.sfx('hit'); } } },
      draw: (c, cx, cy, tt) => { const x = Math.round(dr.x - cx), y = Math.round(dr.y - cy - dr.z); if (dr.z > 0) E(c, x, Math.round(dr.y - cy), 4, 1, 'rgba(0,0,0,0.25)'); R(c, x - 4, y - 2, 8, 3, '#2a2a2e'); for (const s of [-1, 1]) { R(c, x + s * 6 - 2, y - 4, 4, 1, Math.floor(tt * 20) % 2 ? '#c9ccd2' : '#5a5e64'); } if (!dr.down) P(c, x, y + 1, '#e8302a'); },
      onAction: async () => { if (!dr.done) return; if (Math.hypot(dr.x - p.x, dr.y - p.y) > 26) { UI.toast('Geh zur Drohne und drück A.'); return; } G.live = null; await Story.say(FRIENDS.roemu ? 'roemu' : null, 'MEINE DROHNE! Danke! Die Aufnahmen sind noch drauf: die ganze Altstadt von oben. Komm, ich lad dich auf ein Bier ein!'); G.S.aff.roemu = clamp((G.S.aff.roemu || 50) + 10, 0, 100); consume('lager'); },
      hudText: () => (dr.done ? 'Die Drohne liegt am Boden – heb sie auf (A)' : 'Da oben surrt eine Drohne …'),
    };
    await sleep(500);
    UI.toast(`💬 ${fname('roemu')}: „Achtung, meine Drohne! Batterie leer!“`);
  },
});
