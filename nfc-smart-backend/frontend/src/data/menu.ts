import { images } from './images';

export interface Pairing {
  label: string;
  note: string;
  image: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  pairing?: Pairing;
}

export interface MenuCategory {
  id: string;
  name: string;
  group: 'pizze' | 'cucina' | 'bevande';
  items: MenuItem[];
}

export const restaurantName = 'Notte Dì';
export const restaurantTagline = 'Pizzeria, Verona';
export const restaurantSignature = 'Pizzeria Notte Dì · Verona';

const verdicchio: (note: string) => Pairing = (note) => ({ label: 'Verdicchio', note, image: images.whiteWine, price: 3.2 });
const cabernet: (note: string) => Pairing = (note) => ({ label: 'Cabernet Franc', note, image: images.redWine, price: 3.2 });
const rossa: (note: string) => Pairing = (note) => ({ label: 'Moretti la rossa', note, image: images.darkBeer, price: 3.5 });
const bionda: (note: string) => Pairing = (note) => ({ label: "Foster's", note, image: images.beer, price: 3 });
const nonFiltrata: (note: string) => Pairing = (note) => ({ label: 'Ichnusa non filtrata', note, image: images.darkBeer, price: 3.5 });
const scura: (note: string) => Pairing = (note) => ({ label: 'Birra scura', note, image: images.darkBeer, price: 3.5 });

export interface ExtraIngredient {
  name: string;
  price: number;
}

export const EXTRA_INGREDIENTS: ExtraIngredient[] = [
  { name: 'Mozzarella di bufala', price: 2 },
  { name: 'Stracciatella di bufala', price: 2.5 },
  { name: 'Nduja', price: 1.5 },
  { name: 'Salamella', price: 1.5 },
  { name: 'Prosciutto crudo', price: 2.5 },
  { name: 'Gorgonzola', price: 1.5 },
  { name: 'Funghi porcini', price: 2.5 },
  { name: 'Friarielli', price: 1.5 },
  { name: 'Acciughe', price: 1.5 },
  { name: 'Scamorza affumicata', price: 1.5 },
];

export const menu: MenuCategory[] = [
  {
    id: 'antipasti',
    name: 'Antipasti',
    group: 'cucina',
    items: [
      { id: 'caprese', name: 'Caprese', description: 'Mozzarella di bufala campana, basilico, sale e pepe', price: 11, pairing: verdicchio('Bufala fresca, bianco altrettanto fresco') },
      { id: 'gamberoni', name: 'Gamberoni alla piastra', description: '4 pezzi', price: 13, pairing: verdicchio('Il classico bianco da crostacei') },
      { id: 'acciughe-cantabrico', name: 'Acciughe del Mar Cantabrico', description: 'Bruschettina calda, riccioli di burro, pomodorini confit', price: 13, pairing: verdicchio('Acciuga e burro, serve acidità') },
      { id: 'cozze', name: 'Sautè di Cozze alla Marinara', description: 'Con bruschette calde', price: 15, pairing: verdicchio('Cozze alla marinara, classico da bianco') },
      { id: 'insalatina-gamberi', name: 'Insalatina di Gamberi', description: 'Rucola, glassa di aceto balsamico, pomodorini datterino, scaglie di Parmigiano Reggiano', price: 14, pairing: verdicchio('Gamberi e rucola, bianco fresco') },
      { id: 'tagliere-salumi', name: 'Tagliere di Salumi', description: 'Con mozzarella di bufala campana', price: 17.5, pairing: rossa('Tagliere di salumi misti, birra più strutturata') },
      { id: 'tartare-fassona', name: 'Tartare di Fassona Piemontese', description: 'Cipolla rossa brasata, tartufo di nostra produzione, scaglie di Parmigiano Reggiano', price: 15, pairing: cabernet('Tartare al tartufo, piatto da rosso') },
    ],
  },
  {
    id: 'primi',
    name: 'Primi Piatti',
    group: 'cucina',
    items: [
      { id: 'agnoli-brasato', name: 'Agnoli al Brasato', description: 'Saltati con burro di malga', price: 14.5, pairing: cabernet('Il brasato vuole il rosso della casa') },
      { id: 'maccheroncini-coniglio', name: 'Maccheroncini al Ragù di Coniglio', description: '', price: 12, pairing: cabernet('Ragù di carne bianca ma strutturato') },
      { id: 'bigoli-fassona', name: 'Bigoli al Ragù di Fassona Piemontese', description: 'Battuto al coltello', price: 13.5, pairing: cabernet('Ragù di manzo, abbinamento quasi obbligato') },
      { id: 'fettuccine-porcini-tartufo', name: 'Fettuccine Porcini e Tartufo', description: '', price: 16, pairing: cabernet('Porcini e tartufo, ancora rosso strutturato') },
      { id: 'risotto-amarone', name: "Risotto all'Amarone", description: '', price: 16, pairing: cabernet('Cucinato al vino rosso, si serve con un rosso') },
      { id: 'spaghetti-vongole', name: 'Spaghetti alle Vongole Veraci', description: 'Pomodorini datterino', price: 18, pairing: verdicchio('Vongole, abbinamento da bianco quasi automatico') },
      { id: 'spaghetti-scoglio', name: 'Spaghetti allo Scoglio', description: 'Misto di pesce e crostacei', price: 18, pairing: verdicchio('Piatto di mare misto, bianco senza discussione') },
      { id: 'risotto-pescatora', name: 'Risotto alla Pescatora', description: 'Misto di pesce e crostacei', price: 17, pairing: verdicchio('Risotto di mare, bianco in tavola') },
      { id: 'tortello-nero-seppia', name: 'Tortello al Nero di Seppia', description: 'Ripieno di branzino, pomodorini datterino, olio EVO e basilico', price: 14.5, pairing: verdicchio('Branzino e nero di seppia, territorio del bianco') },
      { id: 'calamarata', name: 'Calamarata', description: 'Pasta calamarata di mare', price: 15.5, pairing: verdicchio('Altro primo di mare, bianco naturale') },
    ],
  },
  {
    id: 'secondi',
    name: 'Secondi Piatti',
    group: 'cucina',
    items: [
      { id: 'costata-scottona', name: 'Costata di Scottona', description: 'Servita con patate al forno — prezzo all\'etto', price: 4.7, pairing: cabernet("Costata di manzo, l'abbinamento da rosso per eccellenza") },
      { id: 'tagliata-scottona', name: 'Tagliata di Scottona ai Funghi Porcini', description: 'Servita con patate al forno', price: 20, pairing: cabernet('Manzo e porcini, rosso strutturato necessario') },
      { id: 'tagliata-pollo', name: 'Tagliata di Pollo', description: 'Rucola, pomodorini datterino, glassa di aceto balsamico, scaglie di grana', price: 13, pairing: verdicchio('Pollo leggero con rucola e balsamico, sta bene su un bianco') },
      { id: 'branzino-mediterranea', name: 'Filetto di Branzino alla Mediterranea', description: 'Spinaci saltati e peperoni grigliati', price: 15, pairing: verdicchio('Pesce bianco alla mediterranea, bianco fresco') },
      { id: 'fritto-misto', name: 'Fritto Misto', description: 'Alici, anelli, code di gambero sgusciate, ciuffi di calamaro', price: 18, pairing: verdicchio('Un fritto di mare vuole sempre un bianco') },
      { id: 'salmone-soia', name: 'Trancio di Salmone Marinato alla Soia', description: 'Cipolla rossa brasata e friarielli saltati', price: 18, pairing: verdicchio('Il salmone regge bene un bianco') },
    ],
  },
  {
    id: 'insalatone',
    name: 'Insalatone',
    group: 'cucina',
    items: [
      { id: 'insalata-pollo', name: 'Insalata Verde, Straccetti di Pollo', description: 'Pomodorini datterino, stracciatella di bufala, glassa di aceto balsamico', price: 14, pairing: verdicchio('Insalatona leggera, mai un rosso su un piatto freddo') },
      { id: 'insalata-gamberi', name: 'Insalata Verde, Code di Gambero', description: 'Calamari, arancia', price: 13.5, pairing: verdicchio('Gamberi e calamari, bianco fresco') },
      { id: 'insalata-carciofi', name: 'Insalata Verde, Carciofi', description: 'Patate al forno, bufala, bresaola', price: 13, pairing: verdicchio('Piatto misto ma leggero, il bianco resta versatile') },
      { id: 'insalata-tonno', name: 'Insalata Verde, Tonno', description: 'Mais, carote, capperi, olive nere', price: 10, pairing: verdicchio('Tonno in insalata, coerente con le altre') },
    ],
  },
  {
    id: 'pazzesche',
    name: 'Le Pazzesche',
    group: 'pizze',
    items: [
      { id: 'bronte', name: 'Bronte', description: 'Mozzarella fiordilatte, mortadella, stracciatella di bufala, pistacchio di Bronte, basilico', price: 15, pairing: rossa('Il dolce del pistacchio regge una birra maltata') },
      { id: 'ligure', name: 'Ligure', description: 'Mozzarella fiordilatte, pomodoro, pomodorini datterino, stracciatella di bufala, pesto fatto in casa, acciughe del mar Cantabrico', price: 15, pairing: verdicchio('Pesto e acciuga vogliono un bianco che pulisca') },
      { id: 'taggiasca', name: 'Taggiasca', description: 'Pomodoro, cipolla rossa brasata, olive taggiasche, prosciutto cotto alla brace, bufala, basilico', price: 15, pairing: bionda('Equilibrata, basta una bionda leggera') },
      { id: 'virtuosa', name: 'Virtuosa', description: 'Mozzarella fiordilatte, prosciutto cotto alla brace, stracciatella di bufala, tartufo di nostra produzione', price: 15, pairing: cabernet('Il tartufo chiede un rosso con struttura') },
      { id: 'marinara-2', name: 'Marinara 2.0', description: 'Pomodoro, origano, pomodorini datterino confit, aglio a pezzettini, olio EVO, acciughe del mar Cantabrico, basilico', price: 11, pairing: verdicchio('Pomodoro e acciuga, il classico da bianco') },
      { id: 'lunedi', name: 'Lunedì', description: 'Crema di carciofi, provola affumicata di bufala, bresaola, noci, scaglie di Parmigiano Reggiano', price: 15, pairing: scura("L'affumicato chiama una birra scura") },
      { id: 'salmonata', name: 'Salmonata', description: 'Mozzarella fiordilatte, pomodorini datterino, salmone affumicato, Philadelphia, erba cipollina', price: 15, pairing: verdicchio('Il bianco sgrassa la cremosità del Philadelphia') },
      { id: 'romeo-giulietta', name: 'Romeo e Giulietta', description: 'Pomodoro, pomodorini datterino, code di gambero, pesto di nostra produzione, stracciatella di bufala, basilico', price: 15, pairing: verdicchio('Gamberi e pesto restano leggeri su un bianco') },
    ],
  },
  {
    id: 'speciali',
    name: 'Le Speciali',
    group: 'pizze',
    items: [
      { id: 'boscaiola', name: 'Boscaiola', description: 'Pomodoro, mozzarella fiordilatte, funghi misto bosco, grana, speck', price: 9.5, pairing: scura('Funghi e speck, birra scura d\'ordinanza') },
      { id: 'bufalina', name: 'Bufalina', description: 'Pomodoro, bufala, pomodorini datterino, basilico', price: 9, pairing: bionda('Semplice e fresca, bionda leggera') },
      { id: 'carbonara', name: 'Carbonara', description: 'Pomodoro, mozzarella fiordilatte, uovo, guanciale, pecorino', price: 10, pairing: rossa('Il grasso del guanciale vuole una birra che lo tagli') },
      { id: 'casereccia', name: 'Casereccia', description: 'Pomodoro, mozzarella fiordilatte, Philadelphia, patate, salsiccia', price: 9, pairing: bionda('Casalinga e sostanziosa, bionda beverina') },
      { id: 'coccio', name: 'Coccio', description: 'Pomodoro, mozzarella fiordilatte, gorgonzola, porcini, scamorza, noci, bordo ripieno di scamorza affumicata', price: 10, pairing: cabernet('Gorgonzola e porcini vogliono un rosso strutturato') },
      { id: 'completa', name: 'Completa', description: 'Pomodoro, mozzarella fiordilatte, prosciutto, funghi, carciofi, salamino, salsiccia, wurstel, grana, olive nere', price: 12, pairing: rossa('Tanti salumi diversi, birra rossa maltata') },
      { id: 'estate', name: 'Estate', description: 'Pomodoro, mozzarella fiordilatte, Philadelphia, pomodorini datterino, rucola', price: 8.5, pairing: verdicchio('Fresca e vegetale, segue un bianco leggero') },
      { id: 'fattoria', name: 'Fattoria', description: 'Pomodoro, mozzarella fiordilatte, salamino, salsiccia, cipolla, provola affumicata', price: 10, pairing: scura('Provola affumicata, ancora birra scura') },
      { id: 'inferno', name: 'Inferno', description: 'Pomodoro, olive nere, acciughe, salamino, peperoni, olio all\'aglio, nduja', price: 9.5, pairing: nonFiltrata('Il piccante della nduja va domato, non affrontato') },
      { id: 'montanara', name: 'Montanara', description: 'Pomodoro, mozzarella fiordilatte, funghi misto bosco, gorgonzola, soppressa, scaglie di grana', price: 10.5, pairing: cabernet('Funghi di bosco e gorgonzola, terroso e intenso') },
      { id: 'notte-e-di', name: 'Notte e Dì', description: 'Pomodoro, mozzarella fiordilatte, zucchine, provola affumicata, salamino, funghi, grana in cottura', price: 10.5, pairing: scura('La pizza della casa, stessa birra scura delle affumicate') },
      { id: 'patatona', name: 'Patatona', description: 'Pomodoro, mozzarella fiordilatte, grana, guanciale, patate', price: 9.5, pairing: rossa('Guanciale e patate, grassa e confortante') },
      { id: 'pugliese', name: 'Pugliese', description: 'Pomodoro, mozzarella fiordilatte, prosciutto crudo di Parma, stracciatella', price: 10.5, pairing: verdicchio('Crudo e stracciatella sono delicati, il bianco non li copre') },
      { id: 'saporita', name: 'Saporita', description: 'Pomodoro, mozzarella fiordilatte, salamino, gorgonzola, porcini, prosciutto crudo di Parma', price: 11.5, pairing: cabernet('Gorgonzola e porcini insieme, di nuovo il rosso') },
      { id: 'sfiziosa', name: 'Sfiziosa', description: 'Pomodoro, mozzarella fiordilatte, radicchio, gorgonzola, grana a scaglie', price: 9.5, pairing: verdicchio("L'amaro del radicchio contro il dolce del gorgonzola") },
      { id: 'trentina', name: 'Trentina', description: 'Pomodoro, mozzarella fiordilatte, gorgonzola, noci, speck', price: 9, pairing: scura('Speck affumicato, stessa famiglia delle altre birra scura') },
      { id: 'nonno-berto', name: 'Nonno Berto', description: 'Pomodoro, mozzarella fiordilatte, salamino, gorgonzola, Emmental, peperoni, grana, speck', price: 12, pairing: rossa('La più ricca del menu, la birra più strutturata') },
      { id: 'frutti-di-mare', name: 'Frutti di Mare', description: 'Pomodoro, frutti di mare, prezzemolo', price: 13, pairing: verdicchio('Frutti di mare, bianco sempre') },
      { id: 'gisa', name: 'Gisa', description: 'Pomodoro, mozzarella fiordilatte, rucola, bresaola', price: 8.5, pairing: bionda('Leggera, una bionda semplice basta') },
    ],
  },
  {
    id: 'bianche',
    name: 'Le Bianche',
    group: 'pizze',
    items: [
      { id: 'andrea', name: 'Andrea', description: 'Mozzarella fiordilatte, bufala, melanzane, pomodorini datterino, basilico, olio EVO, limone grattugiato', price: 9.5, pairing: verdicchio('Il limone chiama un bianco altrettanto agrumato') },
      { id: 'bea', name: 'Bea', description: 'Mozzarella fiordilatte, zucchine, Brie, tartufo di nostra produzione', price: 12, pairing: cabernet('Brie e tartufo, profilo intenso da rosso') },
      { id: 'bonny', name: 'Bonny', description: 'Mozzarella fiordilatte, salamino, patate, tartufo di nostra produzione, grana', price: 13, pairing: cabernet('Salamino e tartufo confermano il rosso strutturato') },
      { id: 'digi', name: 'Digi', description: 'Mozzarella fiordilatte, spinaci, gorgonzola, salamino', price: 10, pairing: rossa('Gorgonzola e salamino, decisa, serve la rossa') },
      { id: 'zeus', name: 'Zeus', description: 'Mozzarella fiordilatte, radicchio, Brie, tartufo di nostra produzione', price: 12, pairing: cabernet('Ancora tartufo e formaggio morbido, stesso rosso') },
      { id: 'la-bomba', name: 'La Bomba', description: 'Mozzarella fiordilatte, patate, nduja, guanciale, cipolla brasata, grana', price: 12, pairing: nonFiltrata('Nduja piccante, la non filtrata la doma') },
      { id: 'la-migliore', name: 'La Migliore', description: 'Mozzarella fiordilatte, salsiccia, peperoni, gorgonzola, pomodoro a fette', price: 10, pairing: bionda('Salsiccia e peperoni, registro semplice da bionda') },
      { id: 'stube', name: 'Stube', description: 'Mozzarella fiordilatte, speck in cottura, Brie, cipolla rossa, pepe', price: 9, pairing: scura('Speck e pepe, birra scura') },
      { id: 'luna', name: 'Luna', description: 'Mozzarella fiordilatte, mozzarella di bufala, Philadelphia, tartufo di nostra produzione, grana', price: 12, pairing: cabernet('Doppio formaggio cremoso e tartufo, rosso strutturato') },
      { id: 'salsiccia-friarielli', name: 'Salsiccia e Friarielli', description: 'Mozzarella fiordilatte, friarielli, salsiccia, basilico', price: 9, pairing: rossa("L'amaro dei friarielli contro la sapidità, birra maltata") },
    ],
  },
  {
    id: 'schiacciate',
    name: 'Le Schiacciate',
    group: 'pizze',
    items: [
      { id: 'garda', name: 'Garda', description: 'Grana, olio EVO, rosmarino', price: 4.5, pairing: verdicchio('Apertura leggera, un bianco fresco apre bene') },
      { id: 'nord-sud', name: 'Nord/Sud', description: 'Pomodorini datterino, grana, origano, olio all\'aglio', price: 4.7, pairing: verdicchio('Semplice da tavolo, bianco fresco') },
      { id: 'schiacciata-maestro', name: 'Schiacciata del Maestro', description: 'Olio EVO, cipolla rossa, grana, prezzemolo, salamino', price: 6, pairing: bionda('Il salamino sposta verso una bionda semplice') },
      { id: 'antonio', name: 'Antonio', description: 'Nduja, olive taggiasche, grana', price: 6, pairing: nonFiltrata('Nduja piccante, ancora la non filtrata') },
    ],
  },
  {
    id: 'tradizionali',
    name: 'Le Tradizionali',
    group: 'pizze',
    items: [
      { id: 'margherita', name: 'Margherita', description: 'Pomodoro, mozzarella fiordilatte, basilico, olio EVO', price: 6, pairing: bionda("La più classica, l'abbinamento più classico") },
      { id: 'marinara', name: 'Marinara', description: 'Pomodoro, aglio a pezzi, origano, basilico', price: 5, pairing: verdicchio('Pomodoro e aglio puliti su un bianco fresco') },
      { id: 'napoletana', name: 'Napoletana', description: 'Pomodoro, mozzarella fiordilatte, acciughe, capperi, origano', price: 7, pairing: verdicchio('Acciughe e capperi sapidi, bianco che bilancia') },
      { id: 'romana', name: 'Romana', description: 'Pomodoro, mozzarella fiordilatte, acciughe, origano', price: 6.5, pairing: verdicchio('Stessa logica della Napoletana') },
      { id: 'viennese', name: 'Viennese', description: 'Pomodoro, mozzarella fiordilatte, wurstel', price: 6.5, pairing: bionda('Wurstel e pomodoro, bionda semplice') },
      { id: 'calzone', name: 'Calzone', description: 'Mozzarella fiordilatte, prosciutto, funghi, pomodoro, grana in cottura', price: 9, pairing: rossa('Ripieno e sostanzioso, regge la rossa') },
      { id: 'capricciosa', name: 'Capricciosa', description: 'Pomodoro, mozzarella fiordilatte, carciofi, prosciutto, funghi, capperi, olive nere, origano', price: 9, pairing: rossa('Tanti ingredienti diversi, birra più strutturata') },
      { id: 'salamino', name: 'Salamino', description: 'Pomodoro, mozzarella fiordilatte, salamino', price: 7, pairing: bionda('Salume semplice, birra semplice') },
      { id: 'otello', name: 'Otello', description: 'Pomodoro, mozzarella fiordilatte, porcini, mortadella', price: 8.5, pairing: cabernet('Porcini e mortadella, profilo terroso da rosso') },
      { id: 'vegetariana', name: 'Vegetariana', description: 'Pomodoro, mozzarella fiordilatte, zucchine, melanzane, spinaci, patate, peperoni, pomodorini datterino, grana', price: 9.5, pairing: verdicchio('Tante verdure diverse, un bianco le lega') },
      { id: 'parma', name: 'Parma', description: 'Pomodoro, mozzarella fiordilatte, prosciutto crudo di Parma', price: 8.5, pairing: verdicchio('Il crudo è delicato, il bianco non lo copre') },
      { id: 'parmigiana', name: 'Parmigiana', description: 'Pomodoro, mozzarella fiordilatte, melanzane, grana, basilico', price: 7.5, pairing: verdicchio('Melanzane e basilico restano leggeri') },
      { id: 'prosciutto-funghi', name: 'Prosciutto e Funghi', description: 'Pomodoro, mozzarella fiordilatte, prosciutto cotto, funghi', price: 7.5, pairing: bionda('Il classico prosciutto-funghi, bionda di tutti i giorni') },
      { id: 'quattro-formaggi', name: 'Quattro Formaggi', description: 'Pomodoro, mozzarella fiordilatte, ricotta, grana, Emmental, gorgonzola, basilico', price: 9, pairing: rossa('Quattro formaggi, un boccone ricco') },
      { id: 'quattro-stagioni', name: 'Quattro Stagioni', description: 'Pomodoro, mozzarella fiordilatte, funghi, prosciutto cotto, carciofi, olive nere', price: 8, pairing: rossa('Quattro ingredienti diversi, la rossa tiene il passo') },
      { id: 'siciliana', name: 'Siciliana', description: 'Pomodoro, melanzane, origano, capperi, olive nere, acciughe', price: 8, pairing: verdicchio('Capperi e acciughe sapidi, bianco fresco') },
      { id: 'tonno-cipolla', name: 'Tonno e Cipolla', description: 'Pomodoro, mozzarella fiordilatte, tonno, cipolla rossa', price: 7, pairing: verdicchio('Il tonno è pesce, resta il bianco') },
      { id: 'prosciutto', name: 'Prosciutto', description: 'Pomodoro, mozzarella fiordilatte, prosciutto cotto', price: 7, pairing: bionda("La più semplice, l'abbinamento più semplice") },
    ],
  },
  {
    id: 'birre',
    name: 'Birre',
    group: 'bevande',
    items: [
      { id: 'fosters', name: "Foster's", description: 'Bionda, 5% — Piccola €3,00 · Media €5,00 · Grande €12,00', price: 3 },
      { id: 'moretti-rossa', name: 'Moretti la Rossa', description: 'Rossa, 7,2% — Piccola €3,50 · Media €5,50 · Grande €13,00', price: 3.5 },
      { id: 'ichnusa', name: 'Ichnusa', description: 'Non filtrata, 5% — Piccola €3,50 · Media €5,50 · Grande €13,00', price: 3.5 },
      { id: 'hacker-pschorr', name: 'Hacker-Pschorr', description: '50 cl', price: 5.5 },
      { id: 'weizen-kapuziner', name: 'Weizen Kapuziner', description: '50 cl', price: 5.5 },
      { id: 'white-ipa-hibu', name: 'White IPA Hibu', description: '33 cl', price: 5 },
      { id: 'silly', name: 'Silly', description: '75 cl', price: 13 },
      { id: 'gotha-hibu', name: 'Gotha Hibu', description: '33 cl', price: 5 },
      { id: 'apa-vaitra-hibu', name: 'Apa Vaitrà Hibu', description: '33 cl', price: 5 },
      { id: 'ioi-gluten-free', name: 'IOI Gluten Free', description: '33 cl', price: 5.5 },
      { id: 'heineken-analcolica', name: 'Heineken Analcolica', description: '33 cl', price: 3.5 },
    ],
  },
  {
    id: 'vini-amari-distillati',
    name: 'Vini, Amari e Distillati',
    group: 'bevande',
    items: [
      { id: 'vino-bianco-verdicchio', name: 'Vino Bianco Verdicchio', description: '1/4 €3,20 · 1/2 €5,20 · 1 litro €11,00', price: 3.2 },
      { id: 'vino-rosso-cabernet', name: 'Vino Rosso Cabernet Franc', description: '1/4 €3,20 · 1/2 €5,20 · 1 litro €11,00', price: 3.2 },
      { id: 'amari', name: 'Amari', description: '', price: 3.5 },
      { id: 'grappa-bianca-bocchino', name: 'Grappa Bianca Bocchino', description: '', price: 3.5 },
      { id: 'grappa-bianca-poli', name: 'Grappa Bianca Poli', description: '', price: 4 },
      { id: 'grappa-invecchiata-piave', name: 'Grappa Invecchiata Piave', description: '', price: 4 },
      { id: 'grappa-invecchiata-bocchino', name: 'Grappa Invecchiata Bocchino', description: '', price: 4.5 },
      { id: 'glenfiddich-12', name: 'Glenfiddich 12', description: 'Whisky — servito con cioccolato fondente e acqua con ghiaccio', price: 7 },
      { id: 'laphroaig-10', name: 'Laphroaig 10', description: 'Whisky — servito con cioccolato fondente e acqua con ghiaccio', price: 7 },
      { id: 'caol-ila-12', name: 'Caol Ila 12', description: 'Whisky — servito con cioccolato fondente e acqua con ghiaccio', price: 8 },
      { id: 'lagavulin-16', name: 'Lagavulin 16', description: 'Whisky — servito con cioccolato fondente e acqua con ghiaccio', price: 12 },
      { id: 'diplomatico-riserva', name: 'Diplomatico Riserva', description: 'Rhum', price: 8 },
      { id: 'zacapa', name: 'Zacapa', description: 'Rhum', price: 9 },
      { id: 'rhum-agricole', name: 'Rhum Agricole', description: '', price: 7.5 },
      { id: 'don-papa-masskara', name: 'Don Papa Masskara', description: 'Rhum', price: 8 },
    ],
  },
  {
    id: 'aperitivi-bibite-caffe',
    name: 'Aperitivi, Bibite e Caffè',
    group: 'bevande',
    items: [
      { id: 'gingerino-crodino', name: 'Gingerino / Crodino', description: '', price: 3 },
      { id: 'spritz', name: 'Spritz Aperol / Campari / Bianco', description: '', price: 4 },
      { id: 'gingerino-vino-bianco', name: 'Gingerino con Vino Bianco', description: '', price: 3.5 },
      { id: 'bibite-vetro-33', name: 'Coca Cola, Coca Zero, Fanta, Sprite', description: 'Bottiglia in vetro 33 cl', price: 3 },
      { id: 'bibite-vetro-1lt', name: 'Coca Cola, Fanta', description: 'Bottiglia in vetro 1 litro', price: 9.7 },
      { id: 'bibite-lattina', name: 'Chinotto, Lemonsoda, Tè Limone/Pesca', description: 'Lattina 33 cl', price: 3 },
      { id: 'coca-cola-spina', name: 'Coca Cola alla Spina', description: 'Piccola €2,80 · Media €4,20 · 1 litro €9,00', price: 2.8 },
      { id: 'caffe', name: 'Caffè / Caffè Macchiato', description: '', price: 1.3 },
      { id: 'caffe-decaffeinato', name: 'Caffè Decaffeinato', description: '', price: 1.4 },
      { id: 'caffe-corretto', name: 'Caffè Corretto', description: '', price: 1.6 },
      { id: 'macchiatone', name: 'Macchiatone', description: '', price: 1.4 },
      { id: 'ginseng-orzo', name: 'Ginseng / Orzo', description: '', price: 1.6 },
      { id: 'acqua', name: 'Acqua Naturale o Gasata', description: 'Goccia di Carnia, 75 cl', price: 2.7 },
    ],
  },
];
