import type { Lang } from './index';
import type { MenuCategory, MenuItem } from '../data/menu';

type L10nPair = { en: string; de: string };
interface DishL10n {
  d?: L10nPair;
  n?: L10nPair;
}

export const categoryL10n: Record<string, L10nPair> = {
  bianche: { en: 'White Pizzas', de: 'Weiße Pizzen' },
  tradizionali: { en: 'The Classics', de: 'Die Klassiker' },
  antipasti: { en: 'Starters', de: 'Vorspeisen' },
  primi: { en: 'Pasta & Risotto', de: 'Pasta & Risotto' },
  secondi: { en: 'Main Courses', de: 'Hauptgerichte' },
  insalatone: { en: 'Salads', de: 'Salate' },
  birre: { en: 'Beers', de: 'Biere' },
  'vini-amari-distillati': { en: 'Wines & Spirits', de: 'Weine & Spirituosen' },
  'aperitivi-bibite-caffe': { en: 'Aperitifs, Drinks & Coffee', de: 'Aperitifs, Getränke & Kaffee' },
};

export const dishL10n: Record<string, DishL10n> = {
  bronte: {
    d: { en: 'Fior di latte mozzarella, mortadella, buffalo stracciatella, Bronte pistachio, basil', de: 'Fior-di-Latte-Mozzarella, Mortadella, Büffel-Stracciatella, Bronte-Pistazie, Basilikum' },
    n: { en: 'The sweetness of pistachio stands up to a malty beer', de: 'Die Süße der Pistazie verträgt ein malziges Bier' },
  },
  ligure: {
    d: { en: 'Fior di latte mozzarella, tomato, datterino cherry tomatoes, buffalo stracciatella, homemade pesto, Cantabrian anchovies', de: 'Fior-di-Latte-Mozzarella, Tomate, Datterino-Kirschtomaten, Büffel-Stracciatella, hausgemachtes Pesto, kantabrische Sardellen' },
    n: { en: 'Pesto and anchovy call for a cleansing white', de: 'Pesto und Sardelle verlangen einen klaren Weißwein' },
  },
  taggiasca: {
    d: { en: 'Tomato, braised red onion, Taggiasca olives, flame-grilled ham, buffalo mozzarella, basil', de: 'Tomate, geschmorte rote Zwiebel, Taggiasca-Oliven, gegrillter Kochschinken, Büffelmozzarella, Basilikum' },
    n: { en: 'Well balanced — a light lager is enough', de: 'Ausgewogen — ein leichtes Helles genügt' },
  },
  virtuosa: {
    d: { en: 'Fior di latte mozzarella, flame-grilled ham, buffalo stracciatella, truffle from our own production', de: 'Fior-di-Latte-Mozzarella, gegrillter Kochschinken, Büffel-Stracciatella, Trüffel aus eigener Herstellung' },
    n: { en: 'Truffle asks for a red with structure', de: 'Trüffel verlangt einen strukturierten Rotwein' },
  },
  'marinara-2': {
    d: { en: 'Tomato, oregano, datterino confit cherry tomatoes, chopped garlic, extra virgin olive oil, Cantabrian anchovies, basil', de: 'Tomate, Oregano, confierte Datterino-Kirschtomaten, gehackter Knoblauch, natives Olivenöl extra, kantabrische Sardellen, Basilikum' },
    n: { en: 'Tomato and anchovy, a classic for white wine', de: 'Tomate und Sardelle, der Klassiker zum Weißwein' },
  },
  lunedi: {
    d: { en: 'Artichoke cream, smoked buffalo provola, bresaola, walnuts, Parmigiano Reggiano shavings', de: 'Artischockencreme, geräucherte Büffel-Provola, Bresaola, Walnüsse, Parmigiano-Reggiano-Späne' },
    n: { en: 'Smoky flavours call for a dark beer', de: 'Rauchige Aromen verlangen ein dunkles Bier' },
  },
  salmonata: {
    d: { en: 'Fior di latte mozzarella, datterino cherry tomatoes, smoked salmon, Philadelphia, chives', de: 'Fior-di-Latte-Mozzarella, Datterino-Kirschtomaten, Räucherlachs, Philadelphia, Schnittlauch' },
    n: { en: 'A white cuts through the creaminess of the Philadelphia', de: 'Ein Weißwein durchbricht die Cremigkeit des Philadelphia' },
  },
  'romeo-giulietta': {
    d: { en: 'Tomato, datterino cherry tomatoes, prawn tails, our own pesto, buffalo stracciatella, basil', de: 'Tomate, Datterino-Kirschtomaten, Garnelenschwänze, hausgemachtes Pesto, Büffel-Stracciatella, Basilikum' },
    n: { en: 'Prawns and pesto stay light on a white', de: 'Garnelen und Pesto bleiben leicht zu einem Weißwein' },
  },

  boscaiola: {
    d: { en: 'Tomato, fior di latte mozzarella, mixed wild mushrooms, Grana, speck', de: 'Tomate, Fior-di-Latte-Mozzarella, Waldpilzmischung, Grana, Speck' },
    n: { en: 'Mushrooms and speck — dark beer, as usual', de: 'Pilze und Speck — Dunkelbier, wie es sich gehört' },
  },
  bufalina: {
    d: { en: 'Tomato, buffalo mozzarella, datterino cherry tomatoes, basil', de: 'Tomate, Büffelmozzarella, Datterino-Kirschtomaten, Basilikum' },
    n: { en: 'Simple and fresh — a light lager', de: 'Einfach und frisch — ein leichtes Helles' },
  },
  carbonara: {
    d: { en: 'Tomato, fior di latte mozzarella, egg, guanciale, pecorino', de: 'Tomate, Fior-di-Latte-Mozzarella, Ei, Guanciale, Pecorino' },
    n: { en: 'The fat of the guanciale wants a beer that cuts it', de: 'Das Fett des Guanciale braucht ein Bier, das es durchschneidet' },
  },
  casereccia: {
    d: { en: 'Tomato, fior di latte mozzarella, Philadelphia, potatoes, sausage', de: 'Tomate, Fior-di-Latte-Mozzarella, Philadelphia, Kartoffeln, Salsiccia' },
    n: { en: 'Homey and hearty — an easy-drinking lager', de: 'Deftig und bodenständig — ein süffiges Helles' },
  },
  coccio: {
    d: { en: 'Tomato, fior di latte mozzarella, gorgonzola, porcini, scamorza, walnuts, crust stuffed with smoked scamorza', de: 'Tomate, Fior-di-Latte-Mozzarella, Gorgonzola, Steinpilze, Scamorza, Walnüsse, Rand gefüllt mit geräucherter Scamorza' },
    n: { en: 'Gorgonzola and porcini want a structured red', de: 'Gorgonzola und Steinpilze verlangen einen strukturierten Rotwein' },
  },
  completa: {
    d: { en: 'Tomato, fior di latte mozzarella, ham, mushrooms, artichokes, salami, sausage, frankfurter, Grana, black olives', de: 'Tomate, Fior-di-Latte-Mozzarella, Schinken, Pilze, Artischocken, Salami, Salsiccia, Würstchen, Grana, schwarze Oliven' },
    n: { en: 'Many different cured meats — a malty red ale', de: 'Viele verschiedene Wurstwaren — ein malziges Rotbier' },
  },
  estate: {
    d: { en: 'Tomato, fior di latte mozzarella, Philadelphia, datterino cherry tomatoes, rocket', de: 'Tomate, Fior-di-Latte-Mozzarella, Philadelphia, Datterino-Kirschtomaten, Rucola' },
    n: { en: 'Fresh and green — follows a light white', de: 'Frisch und pflanzlich — passt zu einem leichten Weißwein' },
  },
  fattoria: {
    d: { en: 'Tomato, fior di latte mozzarella, salami, sausage, onion, smoked provola', de: 'Tomate, Fior-di-Latte-Mozzarella, Salami, Salsiccia, Zwiebel, geräucherte Provola' },
    n: { en: 'Smoked provola — dark beer again', de: 'Geräucherte Provola — wieder Dunkelbier' },
  },
  inferno: {
    d: { en: 'Tomato, black olives, anchovies, salami, peppers, garlic oil, nduja', de: 'Tomate, schwarze Oliven, Sardellen, Salami, Paprika, Knoblauchöl, Nduja' },
    n: { en: 'The heat of nduja should be tamed, not fought', de: 'Die Schärfe der Nduja will gezähmt, nicht bekämpft werden' },
  },
  montanara: {
    d: { en: 'Tomato, fior di latte mozzarella, mixed wild mushrooms, gorgonzola, soppressa, Grana shavings', de: 'Tomate, Fior-di-Latte-Mozzarella, Waldpilzmischung, Gorgonzola, Soppressa, Grana-Späne' },
    n: { en: 'Wild mushrooms and gorgonzola — earthy and intense', de: 'Waldpilze und Gorgonzola — erdig und intensiv' },
  },
  'notte-e-di': {
    d: { en: 'Tomato, fior di latte mozzarella, courgettes, smoked provola, salami, mushrooms, baked-in Grana', de: 'Tomate, Fior-di-Latte-Mozzarella, Zucchini, geräucherte Provola, Salami, Pilze, mitgebackener Grana' },
    n: { en: 'The house pizza — same dark beer as the other smoky ones', de: 'Die Pizza des Hauses — dasselbe Dunkelbier wie bei den anderen Geräucherten' },
  },
  patatona: {
    d: { en: 'Tomato, fior di latte mozzarella, Grana, guanciale, potatoes', de: 'Tomate, Fior-di-Latte-Mozzarella, Grana, Guanciale, Kartoffeln' },
    n: { en: 'Guanciale and potatoes — rich and comforting', de: 'Guanciale und Kartoffeln — üppig und wohltuend' },
  },
  pugliese: {
    d: { en: 'Tomato, fior di latte mozzarella, Parma raw ham, stracciatella', de: 'Tomate, Fior-di-Latte-Mozzarella, Parma-Rohschinken, Stracciatella' },
    n: { en: 'Raw ham and stracciatella are delicate — a white won’t cover them', de: 'Rohschinken und Stracciatella sind zart — ein Weißwein überdeckt sie nicht' },
  },
  saporita: {
    d: { en: 'Tomato, fior di latte mozzarella, salami, gorgonzola, porcini, Parma raw ham', de: 'Tomate, Fior-di-Latte-Mozzarella, Salami, Gorgonzola, Steinpilze, Parma-Rohschinken' },
    n: { en: 'Gorgonzola and porcini together — the red again', de: 'Gorgonzola und Steinpilze zusammen — wieder der Rotwein' },
  },
  sfiziosa: {
    d: { en: 'Tomato, fior di latte mozzarella, radicchio, gorgonzola, Grana shavings', de: 'Tomate, Fior-di-Latte-Mozzarella, Radicchio, Gorgonzola, Grana-Späne' },
    n: { en: 'The bitterness of radicchio against the sweetness of gorgonzola', de: 'Die Bitterkeit des Radicchio gegen die Süße des Gorgonzola' },
  },
  trentina: {
    d: { en: 'Tomato, fior di latte mozzarella, gorgonzola, walnuts, speck', de: 'Tomate, Fior-di-Latte-Mozzarella, Gorgonzola, Walnüsse, Speck' },
    n: { en: 'Smoked speck — same family, dark beer', de: 'Geräucherter Speck — gleiche Familie, Dunkelbier' },
  },
  'nonno-berto': {
    d: { en: 'Tomato, fior di latte mozzarella, salami, gorgonzola, Emmental, peppers, Grana, speck', de: 'Tomate, Fior-di-Latte-Mozzarella, Salami, Gorgonzola, Emmentaler, Paprika, Grana, Speck' },
    n: { en: 'The richest on the menu — the most structured beer', de: 'Die üppigste der Karte — das kräftigste Bier' },
  },
  'frutti-di-mare': {
    d: { en: 'Tomato, mixed seafood, parsley', de: 'Tomate, Meeresfrüchte, Petersilie' },
    n: { en: 'Seafood — white, always', de: 'Meeresfrüchte — immer Weißwein' },
  },
  gisa: {
    d: { en: 'Tomato, fior di latte mozzarella, rocket, bresaola', de: 'Tomate, Fior-di-Latte-Mozzarella, Rucola, Bresaola' },
    n: { en: 'Light — a simple lager will do', de: 'Leicht — ein einfaches Helles genügt' },
  },

  andrea: {
    d: { en: 'Fior di latte mozzarella, buffalo mozzarella, aubergines, datterino cherry tomatoes, basil, extra virgin olive oil, grated lemon zest', de: 'Fior-di-Latte-Mozzarella, Büffelmozzarella, Auberginen, Datterino-Kirschtomaten, Basilikum, natives Olivenöl extra, geriebene Zitronenschale' },
    n: { en: 'The lemon calls for an equally citrusy white', de: 'Die Zitrone verlangt einen ebenso zitrischen Weißwein' },
  },
  bea: {
    d: { en: 'Fior di latte mozzarella, courgettes, Brie, truffle from our own production', de: 'Fior-di-Latte-Mozzarella, Zucchini, Brie, Trüffel aus eigener Herstellung' },
    n: { en: 'Brie and truffle — an intense profile for a red', de: 'Brie und Trüffel — ein intensives Profil für Rotwein' },
  },
  bonny: {
    d: { en: 'Fior di latte mozzarella, salami, potatoes, truffle from our own production, Grana', de: 'Fior-di-Latte-Mozzarella, Salami, Kartoffeln, Trüffel aus eigener Herstellung, Grana' },
    n: { en: 'Salami and truffle confirm the structured red', de: 'Salami und Trüffel bestätigen den strukturierten Rotwein' },
  },
  digi: {
    d: { en: 'Fior di latte mozzarella, spinach, gorgonzola, salami', de: 'Fior-di-Latte-Mozzarella, Spinat, Gorgonzola, Salami' },
    n: { en: 'Gorgonzola and salami — bold, it needs the red ale', de: 'Gorgonzola und Salami — kräftig, das braucht das Rotbier' },
  },
  zeus: {
    d: { en: 'Fior di latte mozzarella, radicchio, Brie, truffle from our own production', de: 'Fior-di-Latte-Mozzarella, Radicchio, Brie, Trüffel aus eigener Herstellung' },
    n: { en: 'Truffle and soft cheese again — same red', de: 'Wieder Trüffel und Weichkäse — derselbe Rotwein' },
  },
  'la-bomba': {
    d: { en: 'Fior di latte mozzarella, potatoes, nduja, guanciale, braised onion, Grana', de: 'Fior-di-Latte-Mozzarella, Kartoffeln, Nduja, Guanciale, geschmorte Zwiebel, Grana' },
    n: { en: 'Spicy nduja — the unfiltered one tames it', de: 'Scharfe Nduja — das Naturtrübe zähmt sie' },
  },
  'la-migliore': {
    d: { en: 'Fior di latte mozzarella, sausage, peppers, gorgonzola, sliced tomato', de: 'Fior-di-Latte-Mozzarella, Salsiccia, Paprika, Gorgonzola, Tomatenscheiben' },
    n: { en: 'Sausage and peppers — simple territory, lager', de: 'Salsiccia und Paprika — einfaches Terrain, Helles' },
  },
  stube: {
    d: { en: 'Fior di latte mozzarella, baked-in speck, Brie, red onion, pepper', de: 'Fior-di-Latte-Mozzarella, mitgebackener Speck, Brie, rote Zwiebel, Pfeffer' },
    n: { en: 'Speck and pepper — dark beer', de: 'Speck und Pfeffer — Dunkelbier' },
  },
  luna: {
    d: { en: 'Fior di latte mozzarella, buffalo mozzarella, Philadelphia, truffle from our own production, Grana', de: 'Fior-di-Latte-Mozzarella, Büffelmozzarella, Philadelphia, Trüffel aus eigener Herstellung, Grana' },
    n: { en: 'Double creamy cheese and truffle — structured red', de: 'Doppelt cremiger Käse und Trüffel — strukturierter Rotwein' },
  },
  'salsiccia-friarielli': {
    d: { en: 'Fior di latte mozzarella, friarielli, sausage, basil', de: 'Fior-di-Latte-Mozzarella, Friarielli, Salsiccia, Basilikum' },
    n: { en: 'The bitterness of friarielli against the savoury — a malty beer', de: 'Die Bitterkeit der Friarielli gegen das Herzhafte — ein malziges Bier' },
  },

  garda: {
    d: { en: 'Grana, extra virgin olive oil, rosemary', de: 'Grana, natives Olivenöl extra, Rosmarin' },
    n: { en: 'A light opener — a fresh white starts things well', de: 'Ein leichter Auftakt — ein frischer Weißwein eröffnet gut' },
  },
  'nord-sud': {
    d: { en: 'Datterino cherry tomatoes, Grana, oregano, garlic oil', de: 'Datterino-Kirschtomaten, Grana, Oregano, Knoblauchöl' },
    n: { en: 'Simple, for the table — fresh white', de: 'Einfach, für den Tisch — frischer Weißwein' },
  },
  'schiacciata-maestro': {
    d: { en: 'Extra virgin olive oil, red onion, Grana, parsley, salami', de: 'Natives Olivenöl extra, rote Zwiebel, Grana, Petersilie, Salami' },
    n: { en: 'The salami points to a simple lager', de: 'Die Salami zeigt Richtung einfaches Helles' },
  },
  antonio: {
    d: { en: 'Nduja, Taggiasca olives, Grana', de: 'Nduja, Taggiasca-Oliven, Grana' },
    n: { en: 'Spicy nduja — the unfiltered one again', de: 'Scharfe Nduja — wieder das Naturtrübe' },
  },

  margherita: {
    d: { en: 'Tomato, fior di latte mozzarella, basil, extra virgin olive oil', de: 'Tomate, Fior-di-Latte-Mozzarella, Basilikum, natives Olivenöl extra' },
    n: { en: 'The most classic pizza, the most classic pairing', de: 'Die klassischste Pizza, die klassischste Begleitung' },
  },
  marinara: {
    d: { en: 'Tomato, chopped garlic, oregano, basil', de: 'Tomate, gehackter Knoblauch, Oregano, Basilikum' },
    n: { en: 'Tomato and garlic, clean on a fresh white', de: 'Tomate und Knoblauch, klar zu einem frischen Weißwein' },
  },
  napoletana: {
    d: { en: 'Tomato, fior di latte mozzarella, anchovies, capers, oregano', de: 'Tomate, Fior-di-Latte-Mozzarella, Sardellen, Kapern, Oregano' },
    n: { en: 'Savoury anchovies and capers — a white balances them', de: 'Würzige Sardellen und Kapern — ein Weißwein gleicht aus' },
  },
  romana: {
    d: { en: 'Tomato, fior di latte mozzarella, anchovies, oregano', de: 'Tomate, Fior-di-Latte-Mozzarella, Sardellen, Oregano' },
    n: { en: 'Same logic as the Napoletana', de: 'Gleiche Logik wie bei der Napoletana' },
  },
  viennese: {
    d: { en: 'Tomato, fior di latte mozzarella, frankfurter', de: 'Tomate, Fior-di-Latte-Mozzarella, Würstchen' },
    n: { en: 'Frankfurter and tomato — a simple lager', de: 'Würstchen und Tomate — ein einfaches Helles' },
  },
  calzone: {
    d: { en: 'Fior di latte mozzarella, ham, mushrooms, tomato, baked-in Grana', de: 'Fior-di-Latte-Mozzarella, Schinken, Pilze, Tomate, mitgebackener Grana' },
    n: { en: 'Filled and hearty — it stands up to the red ale', de: 'Gefüllt und deftig — das verträgt das Rotbier' },
  },
  capricciosa: {
    d: { en: 'Tomato, fior di latte mozzarella, artichokes, ham, mushrooms, capers, black olives, oregano', de: 'Tomate, Fior-di-Latte-Mozzarella, Artischocken, Schinken, Pilze, Kapern, schwarze Oliven, Oregano' },
    n: { en: 'Many different ingredients — a more structured beer', de: 'Viele verschiedene Zutaten — ein kräftigeres Bier' },
  },
  salamino: {
    d: { en: 'Tomato, fior di latte mozzarella, salami', de: 'Tomate, Fior-di-Latte-Mozzarella, Salami' },
    n: { en: 'Simple cured meat, simple beer', de: 'Einfache Wurst, einfaches Bier' },
  },
  otello: {
    d: { en: 'Tomato, fior di latte mozzarella, porcini, mortadella', de: 'Tomate, Fior-di-Latte-Mozzarella, Steinpilze, Mortadella' },
    n: { en: 'Porcini and mortadella — an earthy profile for a red', de: 'Steinpilze und Mortadella — ein erdiges Profil für Rotwein' },
  },
  vegetariana: {
    d: { en: 'Tomato, fior di latte mozzarella, courgettes, aubergines, spinach, potatoes, peppers, datterino cherry tomatoes, Grana', de: 'Tomate, Fior-di-Latte-Mozzarella, Zucchini, Auberginen, Spinat, Kartoffeln, Paprika, Datterino-Kirschtomaten, Grana' },
    n: { en: 'Many different vegetables — a white ties them together', de: 'Viel verschiedenes Gemüse — ein Weißwein verbindet alles' },
  },
  parma: {
    d: { en: 'Tomato, fior di latte mozzarella, Parma raw ham', de: 'Tomate, Fior-di-Latte-Mozzarella, Parma-Rohschinken' },
    n: { en: 'Raw ham is delicate — the white won’t cover it', de: 'Rohschinken ist zart — der Weißwein überdeckt ihn nicht' },
  },
  parmigiana: {
    d: { en: 'Tomato, fior di latte mozzarella, aubergines, Grana, basil', de: 'Tomate, Fior-di-Latte-Mozzarella, Auberginen, Grana, Basilikum' },
    n: { en: 'Aubergine and basil stay light', de: 'Aubergine und Basilikum bleiben leicht' },
  },
  'prosciutto-funghi': {
    d: { en: 'Tomato, fior di latte mozzarella, cooked ham, mushrooms', de: 'Tomate, Fior-di-Latte-Mozzarella, Kochschinken, Pilze' },
    n: { en: 'The classic ham & mushrooms — an everyday lager', de: 'Der Klassiker Schinken-Pilze — ein Helles für jeden Tag' },
  },
  'quattro-formaggi': {
    d: { en: 'Tomato, fior di latte mozzarella, ricotta, Grana, Emmental, gorgonzola, basil', de: 'Tomate, Fior-di-Latte-Mozzarella, Ricotta, Grana, Emmentaler, Gorgonzola, Basilikum' },
    n: { en: 'Four cheeses — a rich mouthful', de: 'Vier Käsesorten — ein üppiger Bissen' },
  },
  'quattro-stagioni': {
    d: { en: 'Tomato, fior di latte mozzarella, mushrooms, cooked ham, artichokes, black olives', de: 'Tomate, Fior-di-Latte-Mozzarella, Pilze, Kochschinken, Artischocken, schwarze Oliven' },
    n: { en: 'Four different ingredients — the red ale keeps up', de: 'Vier verschiedene Zutaten — das Rotbier hält mit' },
  },
  siciliana: {
    d: { en: 'Tomato, aubergines, oregano, capers, black olives, anchovies', de: 'Tomate, Auberginen, Oregano, Kapern, schwarze Oliven, Sardellen' },
    n: { en: 'Savoury capers and anchovies — fresh white', de: 'Würzige Kapern und Sardellen — frischer Weißwein' },
  },
  'tonno-cipolla': {
    d: { en: 'Tomato, fior di latte mozzarella, tuna, red onion', de: 'Tomate, Fior-di-Latte-Mozzarella, Thunfisch, rote Zwiebel' },
    n: { en: 'Tuna is fish — the white stays', de: 'Thunfisch ist Fisch — es bleibt beim Weißwein' },
  },
  prosciutto: {
    d: { en: 'Tomato, fior di latte mozzarella, cooked ham', de: 'Tomate, Fior-di-Latte-Mozzarella, Kochschinken' },
    n: { en: 'The simplest pizza, the simplest pairing', de: 'Die einfachste Pizza, die einfachste Begleitung' },
  },

  caprese: {
    d: { en: 'Campania buffalo mozzarella, basil, salt and pepper', de: 'Büffelmozzarella aus Kampanien, Basilikum, Salz und Pfeffer' },
    n: { en: 'Fresh buffalo mozzarella, an equally fresh white', de: 'Frischer Büffelmozzarella, ein ebenso frischer Weißwein' },
  },
  gamberoni: {
    d: { en: '4 pieces', de: '4 Stück' },
    n: { en: 'The classic white for shellfish', de: 'Der klassische Weißwein zu Krustentieren' },
  },
  'acciughe-cantabrico': {
    d: { en: 'Warm bruschetta, butter curls, confit cherry tomatoes', de: 'Warme Bruschetta, Butterlocken, confierte Kirschtomaten' },
    n: { en: 'Anchovy and butter — you need acidity', de: 'Sardelle und Butter — da braucht es Säure' },
  },
  cozze: {
    d: { en: 'With warm bruschetta', de: 'Mit warmen Bruschette' },
    n: { en: 'Mussels marinara — a classic for white', de: 'Miesmuscheln marinara — ein Klassiker zum Weißwein' },
  },
  'insalatina-gamberi': {
    d: { en: 'Rocket, balsamic glaze, datterino cherry tomatoes, Parmigiano Reggiano shavings', de: 'Rucola, Balsamico-Glasur, Datterino-Kirschtomaten, Parmigiano-Reggiano-Späne' },
    n: { en: 'Prawns and rocket — fresh white', de: 'Garnelen und Rucola — frischer Weißwein' },
  },
  'tagliere-salumi': {
    d: { en: 'With Campania buffalo mozzarella', de: 'Mit Büffelmozzarella aus Kampanien' },
    n: { en: 'A board of mixed cured meats — a more structured beer', de: 'Ein Brett gemischter Wurstwaren — ein kräftigeres Bier' },
  },
  'tartare-fassona': {
    d: { en: 'Braised red onion, truffle from our own production, Parmigiano Reggiano shavings', de: 'Geschmorte rote Zwiebel, Trüffel aus eigener Herstellung, Parmigiano-Reggiano-Späne' },
    n: { en: 'Truffle tartare — a dish for red', de: 'Tatar mit Trüffel — ein Gericht für Rotwein' },
  },

  'agnoli-brasato': {
    d: { en: 'Tossed in alpine butter', de: 'In Almbutter geschwenkt' },
    n: { en: 'Braised beef wants the house red', de: 'Geschmortes Rind verlangt den Hauswein in Rot' },
  },
  'maccheroncini-coniglio': {
    n: { en: 'A white-meat ragù, but a structured one', de: 'Ein Ragù vom hellen Fleisch, aber mit Struktur' },
  },
  'bigoli-fassona': {
    d: { en: 'Hand-chopped', de: 'Mit dem Messer gehackt' },
    n: { en: 'Beef ragù — an almost obligatory pairing', de: 'Rinderragù — eine fast zwingende Kombination' },
  },
  'fettuccine-porcini-tartufo': {
    n: { en: 'Porcini and truffle — structured red again', de: 'Steinpilze und Trüffel — wieder strukturierter Rotwein' },
  },
  'risotto-amarone': {
    n: { en: 'Cooked in red wine, served with a red', de: 'In Rotwein gekocht, mit Rotwein serviert' },
  },
  'spaghetti-vongole': {
    d: { en: 'Datterino cherry tomatoes', de: 'Datterino-Kirschtomaten' },
    n: { en: 'Clams — an almost automatic white pairing', de: 'Venusmuscheln — fast automatisch Weißwein' },
  },
  'spaghetti-scoglio': {
    d: { en: 'Mixed fish and shellfish', de: 'Fisch und Meeresfrüchte gemischt' },
    n: { en: 'A mixed seafood dish — white, no discussion', de: 'Ein gemischtes Meeresgericht — Weißwein, keine Diskussion' },
  },
  'risotto-pescatora': {
    d: { en: 'Mixed fish and shellfish', de: 'Fisch und Meeresfrüchte gemischt' },
    n: { en: 'Seafood risotto — white on the table', de: 'Meeresfrüchte-Risotto — Weißwein auf den Tisch' },
  },
  'tortello-nero-seppia': {
    d: { en: 'Filled with sea bass, datterino cherry tomatoes, extra virgin olive oil and basil', de: 'Gefüllt mit Wolfsbarsch, Datterino-Kirschtomaten, nativem Olivenöl extra und Basilikum' },
    n: { en: 'Sea bass and squid ink — white wine territory', de: 'Wolfsbarsch und Sepia-Tinte — Weißwein-Terrain' },
  },
  calamarata: {
    d: { en: 'Calamarata pasta with seafood', de: 'Calamarata-Nudeln mit Meeresfrüchten' },
    n: { en: 'Another seafood pasta — white, naturally', de: 'Noch eine Pasta aus dem Meer — natürlich Weißwein' },
  },

  'costata-scottona': {
    d: { en: 'Served with oven-roasted potatoes — price per 100 g', de: 'Mit Ofenkartoffeln — Preis pro 100 g' },
    n: { en: 'Beef rib steak — the red pairing par excellence', de: 'Rinderkotelett — die Rotwein-Kombination schlechthin' },
  },
  'tagliata-scottona': {
    d: { en: 'Served with oven-roasted potatoes', de: 'Mit Ofenkartoffeln' },
    n: { en: 'Beef and porcini — a structured red is a must', de: 'Rind und Steinpilze — ein strukturierter Rotwein ist Pflicht' },
  },
  'tagliata-pollo': {
    d: { en: 'Rocket, datterino cherry tomatoes, balsamic glaze, Grana shavings', de: 'Rucola, Datterino-Kirschtomaten, Balsamico-Glasur, Grana-Späne' },
    n: { en: 'Light chicken with rocket and balsamic — it sits well on a white', de: 'Leichtes Huhn mit Rucola und Balsamico — passt gut zu Weißwein' },
  },
  'branzino-mediterranea': {
    d: { en: 'Sautéed spinach and grilled peppers', de: 'Sautierter Spinat und gegrillte Paprika' },
    n: { en: 'Mediterranean white fish — fresh white', de: 'Mediterraner weißer Fisch — frischer Weißwein' },
  },
  'fritto-misto': {
    d: { en: 'Anchovies, calamari rings, peeled prawn tails, calamari tentacles', de: 'Sardellen, Calamari-Ringe, geschälte Garnelenschwänze, Calamari-Arme' },
    n: { en: 'Fried seafood always wants a white', de: 'Frittiertes aus dem Meer verlangt immer Weißwein' },
  },
  'salmone-soia': {
    d: { en: 'Braised red onion and sautéed friarielli', de: 'Geschmorte rote Zwiebel und sautierte Friarielli' },
    n: { en: 'Salmon carries a white well', de: 'Lachs trägt einen Weißwein gut' },
  },

  'insalata-pollo': {
    d: { en: 'Datterino cherry tomatoes, buffalo stracciatella, balsamic glaze', de: 'Datterino-Kirschtomaten, Büffel-Stracciatella, Balsamico-Glasur' },
    n: { en: 'A light salad — never a red on a cold dish', de: 'Ein leichter Salat — niemals Rotwein zu einem kalten Gericht' },
  },
  'insalata-gamberi': {
    d: { en: 'Calamari, orange', de: 'Calamari, Orange' },
    n: { en: 'Prawns and calamari — fresh white', de: 'Garnelen und Calamari — frischer Weißwein' },
  },
  'insalata-carciofi': {
    d: { en: 'Oven-roasted potatoes, buffalo mozzarella, bresaola', de: 'Ofenkartoffeln, Büffelmozzarella, Bresaola' },
    n: { en: 'Mixed but light — the white stays versatile', de: 'Gemischt, aber leicht — der Weißwein bleibt vielseitig' },
  },
  'insalata-tonno': {
    d: { en: 'Sweetcorn, carrots, capers, black olives', de: 'Mais, Karotten, Kapern, schwarze Oliven' },
    n: { en: 'Tuna salad — consistent with the others', de: 'Thunfischsalat — konsequent wie die anderen' },
  },

  fosters: { d: { en: 'Lager, 5% — Small €3.00 · Medium €5.00 · Large €12.00', de: 'Helles, 5% — Klein €3,00 · Mittel €5,00 · Groß €12,00' } },
  'moretti-rossa': { d: { en: 'Red ale, 7.2% — Small €3.50 · Medium €5.50 · Large €13.00', de: 'Rotbier, 7,2% — Klein €3,50 · Mittel €5,50 · Groß €13,00' } },
  ichnusa: { d: { en: 'Unfiltered, 5% — Small €3.50 · Medium €5.50 · Large €13.00', de: 'Naturtrüb, 5% — Klein €3,50 · Mittel €5,50 · Groß €13,00' } },

  'vino-bianco-verdicchio': { d: { en: '1/4 l €3.20 · 1/2 l €5.20 · 1 litre €11.00', de: '1/4 l €3,20 · 1/2 l €5,20 · 1 Liter €11,00' } },
  'vino-rosso-cabernet': { d: { en: '1/4 l €3.20 · 1/2 l €5.20 · 1 litre €11.00', de: '1/4 l €3,20 · 1/2 l €5,20 · 1 Liter €11,00' } },
  'glenfiddich-12': { d: { en: 'Whisky — served with dark chocolate and iced water', de: 'Whisky — serviert mit Zartbitterschokolade und Eiswasser' } },
  'laphroaig-10': { d: { en: 'Whisky — served with dark chocolate and iced water', de: 'Whisky — serviert mit Zartbitterschokolade und Eiswasser' } },
  'caol-ila-12': { d: { en: 'Whisky — served with dark chocolate and iced water', de: 'Whisky — serviert mit Zartbitterschokolade und Eiswasser' } },
  'lagavulin-16': { d: { en: 'Whisky — served with dark chocolate and iced water', de: 'Whisky — serviert mit Zartbitterschokolade und Eiswasser' } },
  'diplomatico-riserva': { d: { en: 'Rum', de: 'Rum' } },
  zacapa: { d: { en: 'Rum', de: 'Rum' } },
  'don-papa-masskara': { d: { en: 'Rum', de: 'Rum' } },

  'bibite-vetro-33': { d: { en: 'Glass bottle, 33 cl', de: 'Glasflasche, 33 cl' } },
  'bibite-vetro-1lt': { d: { en: 'Glass bottle, 1 litre', de: 'Glasflasche, 1 Liter' } },
  'bibite-lattina': { d: { en: 'Can, 33 cl', de: 'Dose, 33 cl' } },
  'coca-cola-spina': { d: { en: 'Draught — Small €2.80 · Medium €4.20 · 1 litre €9.00', de: 'Vom Fass — Klein €2,80 · Mittel €4,20 · 1 Liter €9,00' } },
  acqua: { d: { en: 'Still or sparkling — Goccia di Carnia, 75 cl', de: 'Still oder sprudelnd — Goccia di Carnia, 75 cl' } },
};

export function localizeCategoryName(category: MenuCategory, lang: Lang): string {
  if (lang === 'it') return category.name;
  return categoryL10n[category.id]?.[lang] ?? category.name;
}

export function localizeDescription(item: MenuItem, lang: Lang): string {
  if (lang === 'it') return item.description;
  return dishL10n[item.id]?.d?.[lang] ?? item.description;
}

export function localizeNote(item: MenuItem, lang: Lang): string {
  const note = item.pairing?.note ?? '';
  if (lang === 'it') return note;
  return dishL10n[item.id]?.n?.[lang] ?? note;
}
