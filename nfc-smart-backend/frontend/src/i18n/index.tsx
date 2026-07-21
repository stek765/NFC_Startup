import { createContext, useContext, useState, type ReactNode } from 'react';
import { track } from '../lib/analytics';

export type Lang = 'it' | 'en' | 'de';
export const langs: Lang[] = ['it', 'en', 'de'];

const STORAGE_KEY = 'nfc-menu-lang';

export interface UiStrings {
  browseMenu: string;
  headlineChoose: string;
  headlineGlass: string;
  reviews: string;
  reviewSheetTitle: string;
  reviewSheetBody: string;
  reviewSheetCta: string;
  reviewSheetDismiss: string;
  menuHint: string;
  gotIt: string;
  askWaiter: string;
  ingredientsLabel: string;
  extrasLabel: string;
  withoutShort: string;
  withShort: string;
  reviewsHeadline: string;
  reviewsCta: string;
  ratingLine: (rating: string, count: string) => string;
  takeIt: string;
  inList: string;
  waiter: string;
  waiterCalled: string;
  wifiNetwork: string;
  copied: string;
  tapToCopy: string;
  close: string;
  back: string;
  searchAria: string;
  searchPlaceholder: string;
  tryWith: string;
  noResults: (q: string) => string;
  mySelection: string;
  yourSelection: string;
  selectionHint: string;
  houseTip: string;
  pairingFor: (dishes: string) => string;
  emptySelection: string;
  clearList: string;
  removeItem: (name: string) => string;
  addToSelection: string;
  removeFromSelection: string;
  closeSearch: string;
  groups: Record<'pizze' | 'cucina' | 'bevande', string>;
  signOff: string;
  footer: string;
  suggestions: string[];
}

export const ui: Record<Lang, UiStrings> = {
  it: {
    browseMenu: 'Sfoglia il menu',
    headlineChoose: 'Manca solo il profumo.',
    headlineGlass: 'Ogni piatto ha il suo bicchiere.',
    reviews: 'Recensioni',
    reviewSheetTitle: 'Ti è piaciuta la serata?',
    reviewSheetBody: 'Una recensione su Google è il modo più semplice per ringraziare la cucina: bastano due tocchi.',
    reviewSheetCta: 'Lascia una recensione',
    reviewSheetDismiss: 'Magari dopo',
    menuHint: 'Tocca i piatti per ricordarteli: l’ordine lo prende il cameriere.',
    gotIt: 'Ho capito',
    askWaiter: 'Da chiedere al cameriere, se vi va',
    ingredientsLabel: 'Ingredienti',
    extrasLabel: 'Aggiunte',
    withoutShort: 'senza',
    withShort: 'con',
    reviewsHeadline: 'Dicono di noi',
    reviewsCta: 'Valuta anche tu su Google',
    ratingLine: (rating, count) => `${rating} su 5 · ${count} recensioni su Google`,
    takeIt: 'Lo prendo',
    inList: 'Nella lista',
    waiter: 'Cameriere',
    waiterCalled: 'In arrivo',
    wifiNetwork: 'Rete Wi-Fi',
    copied: 'Copiata negli appunti',
    tapToCopy: 'Tocca per copiare',
    close: 'Chiudi',
    back: 'Torna indietro',
    searchAria: 'Cerca per ingrediente',
    searchPlaceholder: 'Cerca un ingrediente…',
    tryWith: 'Prova con',
    noResults: (q) => `Nessun piatto con "${q}" — prova con un altro ingrediente.`,
    mySelection: 'La mia selezione',
    yourSelection: 'La tua selezione',
    selectionHint: 'Quello che ti è piaciuto, a portata di mano — senza risfogliare il menu.',
    houseTip: 'Il consiglio della casa',
    pairingFor: (dishes) => `Per ${dishes}`,
    emptySelection: 'Spunta i piatti che ti tentano: li ritrovi qui, senza risfogliare il menu.',
    clearList: 'Svuota lista',
    removeItem: (name) => `Rimuovi ${name}`,
    addToSelection: 'Aggiungi alla selezione',
    removeFromSelection: 'Rimuovi dalla selezione',
    closeSearch: 'Chiudi ricerca',
    groups: { pizze: 'Pizze', cucina: 'Cucina', bevande: 'Da Bere' },
    signOff: 'Nella certezza che passerete un’ottima serata, vi auguriamo buon appetito.',
    footer: 'Prezzi in euro · Coperto €2,00',
    suggestions: ['Tartufo', 'Nduja', 'Bufala', 'Porcini', 'Gorgonzola', 'Acciughe', 'Pistacchio', 'Friarielli'],
  },
  en: {
    browseMenu: 'Browse the menu',
    headlineChoose: 'Only the smell is missing.',
    headlineGlass: 'Every dish has its glass.',
    reviews: 'Reviews',
    reviewSheetTitle: 'Enjoyed your evening?',
    reviewSheetBody: 'A Google review is the easiest way to thank the kitchen — it takes two taps.',
    reviewSheetCta: 'Leave a review',
    reviewSheetDismiss: 'Maybe later',
    menuHint: "Tap the dishes to remember them — your waiter takes the actual order.",
    gotIt: 'Got it',
    askWaiter: 'Just ask your waiter, if you like',
    ingredientsLabel: 'Ingredients',
    extrasLabel: 'Extras',
    withoutShort: 'no',
    withShort: 'with',
    reviewsHeadline: 'What guests say',
    reviewsCta: 'Rate us on Google too',
    ratingLine: (rating, count) => `${rating} out of 5 · ${count} Google reviews`,
    takeIt: "I'll have it",
    inList: 'In your list',
    waiter: 'Waiter',
    waiterCalled: 'On the way',
    wifiNetwork: 'Wi-Fi network',
    copied: 'Copied to clipboard',
    tapToCopy: 'Tap to copy',
    close: 'Close',
    back: 'Go back',
    searchAria: 'Search by ingredient',
    searchPlaceholder: 'Search for an ingredient…',
    tryWith: 'Try',
    noResults: (q) => `No dishes with "${q}" — try another ingredient.`,
    mySelection: 'My selection',
    yourSelection: 'Your selection',
    selectionHint: 'Everything you liked, at hand — no browsing back through the menu.',
    houseTip: 'The house recommendation',
    pairingFor: (dishes) => `For ${dishes}`,
    emptySelection: "Tick the dishes you fancy: they'll be right here, no need to browse again.",
    clearList: 'Clear list',
    removeItem: (name) => `Remove ${name}`,
    addToSelection: 'Add to selection',
    removeFromSelection: 'Remove from selection',
    closeSearch: 'Close search',
    groups: { pizze: 'Pizzas', cucina: 'Kitchen', bevande: 'Drinks' },
    signOff: 'Certain you’ll have a wonderful evening, we wish you buon appetito.',
    footer: 'Prices in euros · Cover charge €2.00',
    suggestions: ['Truffle', 'Nduja', 'Buffalo', 'Porcini', 'Gorgonzola', 'Anchovies', 'Pistachio', 'Friarielli'],
  },
  de: {
    browseMenu: 'Zur Speisekarte',
    headlineChoose: 'Nur der Duft fehlt.',
    headlineGlass: 'Jedes Gericht hat sein Glas.',
    reviews: 'Bewertungen',
    reviewSheetTitle: 'War es ein schöner Abend?',
    reviewSheetBody: 'Eine Google-Bewertung ist der einfachste Dank an die Küche — zwei Fingertipps genügen.',
    reviewSheetCta: 'Bewertung schreiben',
    reviewSheetDismiss: 'Vielleicht später',
    menuHint: 'Tippen Sie Gerichte an, um sie sich zu merken – die Bestellung nimmt Ihr Kellner auf.',
    gotIt: 'Verstanden',
    askWaiter: 'Fragen Sie einfach den Kellner',
    ingredientsLabel: 'Zutaten',
    extrasLabel: 'Extras',
    withoutShort: 'ohne',
    withShort: 'mit',
    reviewsHeadline: 'Das sagen unsere Gäste',
    reviewsCta: 'Bewerten Sie uns auf Google',
    ratingLine: (rating, count) => `${rating} von 5 · ${count} Google-Rezensionen`,
    takeIt: 'Nehme ich',
    inList: 'In der Liste',
    waiter: 'Kellner',
    waiterCalled: 'Kommt gleich',
    wifiNetwork: 'WLAN-Netzwerk',
    copied: 'Kopiert',
    tapToCopy: 'Zum Kopieren tippen',
    close: 'Schließen',
    back: 'Zurück',
    searchAria: 'Nach Zutat suchen',
    searchPlaceholder: 'Zutat suchen…',
    tryWith: 'Versuch es mit',
    noResults: (q) => `Keine Gerichte mit "${q}" — versuch eine andere Zutat.`,
    mySelection: 'Meine Auswahl',
    yourSelection: 'Deine Auswahl',
    selectionHint: 'Alles, was Ihnen gefallen hat, auf einen Blick — ohne erneutes Blättern.',
    houseTip: 'Die Empfehlung des Hauses',
    pairingFor: (dishes) => `Für ${dishes}`,
    emptySelection: 'Haken Sie an, was Sie reizt: Sie finden es hier wieder, ohne erneut zu blättern.',
    clearList: 'Liste leeren',
    removeItem: (name) => `${name} entfernen`,
    addToSelection: 'Zur Auswahl hinzufügen',
    removeFromSelection: 'Aus der Auswahl entfernen',
    closeSearch: 'Suche schließen',
    groups: { pizze: 'Pizzen', cucina: 'Küche', bevande: 'Getränke' },
    signOff: 'Wir sind sicher, dass ihr einen wunderbaren Abend verbringt: buon appetito.',
    footer: 'Preise in Euro · Gedeck €2,00',
    suggestions: ['Trüffel', 'Nduja', 'Büffel', 'Steinpilze', 'Gorgonzola', 'Sardellen', 'Pistazie', 'Friarielli'],
  },
};

function detectLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'it' || stored === 'en' || stored === 'de') return stored;
  } catch {
  }
  const nav = (navigator.language || '').toLowerCase();
  if (nav.startsWith('it')) return 'it';
  if (nav.startsWith('de')) return 'de';
  return 'en';
}

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: UiStrings;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  function setLang(next: Lang) {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
    }
    track('lang', { lang: next });
  }

  return <LangContext.Provider value={{ lang, setLang, t: ui[lang] }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
