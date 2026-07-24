import { createContext, useContext, useState, type ReactNode } from 'react';
import { track } from '../lib/analytics';

export type Lang = 'it' | 'en' | 'de';
export const langs: Lang[] = ['it', 'en', 'de'];

const STORAGE_KEY = 'nfc-menu-lang';

export interface UiStrings {
  browseMenu: string;
  heroMotto: string;
  headlineChoose: string;
  headlineGlass: string;
  reviews: string;
  moreOptions: string;
  moreOptionsHint: string;
  reviewSheetTitle: string;
  reviewSheetBody: string;
  reviewSheetCta: string;
  reviewSheetDismiss: string;
  menuHint: string;
  gotIt: string;
  askWaiter: string;
  ingredientsLabel: string;
  tapToRemove: string;
  extrasLabel: string;
  withoutShort: string;
  withShort: string;
  reviewsHeadline: string;
  reviewsCta: string;
  ratingLine: (rating: string, count: string) => string;
  takeIt: string;
  discover: string;
  edit: string;
  addShort: string;
  inList: string;
  waiter: string;
  waiterCalled: string;
  readyCallWaiter: string;
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
  noMorePairings: string;
  pairingFor: (dishes: string) => string;
  emptySelection: string;
  clearList: string;
  removeItem: (name: string) => string;
  addToSelection: string;
  closeSearch: string;
  groups: Record<'pizze' | 'cucina' | 'bevande', string>;
  signOff: string;
  footer: string;
  suggestions: string[];
}

export const ui: Record<Lang, UiStrings> = {
  it: {
    browseMenu: 'Sfoglia il menu',
    heroMotto: 'Ingredienti scelti, lunga lievitazione, per un’esperienza leggera e piena di gusto.',
    headlineChoose: 'Manca solo il profumo.',
    headlineGlass: 'Ogni piatto ha il suo bicchiere.',
    reviews: 'Recensioni',
    moreOptions: 'Altre opzioni',
    moreOptionsHint: 'Wi-Fi, recensioni, cameriere: sempre a portata di tocco.',
    reviewSheetTitle: 'Ti è piaciuta la serata?',
    reviewSheetBody: 'Una recensione su Google è il modo più semplice per ringraziare la cucina: bastano due tocchi.',
    reviewSheetCta: 'Lascia una recensione',
    reviewSheetDismiss: 'Magari dopo',
    menuHint: 'Il menu è solo un promemoria. L’ordine lo prende il cameriere.',
    gotIt: 'Ho capito',
    askWaiter: 'Da chiedere al cameriere, se vi va',
    ingredientsLabel: 'Ingredienti',
    tapToRemove: 'tocca per rimuovere',
    extrasLabel: 'Aggiunte',
    withoutShort: 'senza',
    withShort: 'con',
    reviewsHeadline: 'Dicono di noi',
    reviewsCta: 'Valuta anche tu su Google',
    ratingLine: (rating, count) => `${rating} su 5 · ${count} recensioni su Google`,
    takeIt: 'Lo prendo',
    discover: 'Scopri',
    edit: 'Modifica',
    addShort: 'Aggiungi',
    inList: 'Nella lista',
    waiter: 'Cameriere',
    waiterCalled: 'In arrivo',
    readyCallWaiter: 'Sono pronto, chiama cameriere',
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
    noMorePairings: 'Nessun altro abbinamento da proporre, per ora.',
    pairingFor: (dishes) => `Per ${dishes}`,
    emptySelection: 'Spunta i piatti che ti tentano: li ritrovi qui, senza risfogliare il menu.',
    clearList: 'Svuota lista',
    removeItem: (name) => `Rimuovi ${name}`,
    addToSelection: 'Aggiungi alla selezione',
    closeSearch: 'Chiudi ricerca',
    groups: { pizze: 'Pizze', cucina: 'Cucina', bevande: 'Da Bere' },
    signOff: 'Nella certezza che passerete un’ottima serata, vi auguriamo buon appetito.',
    footer: 'Prezzi in euro · Coperto €2,00',
    suggestions: ['Tartufo', 'Nduja', 'Bufala', 'Porcini', 'Gorgonzola', 'Acciughe', 'Pistacchio', 'Friarielli'],
  },
  en: {
    browseMenu: 'Browse the menu',
    heroMotto: "Selected ingredients, long fermentation, for a dish that's light and full of flavour.",
    headlineChoose: 'Only the smell is missing.',
    headlineGlass: 'Every dish has its glass.',
    reviews: 'Reviews',
    moreOptions: 'More options',
    moreOptionsHint: 'Wi-Fi, reviews, waiter: always one tap away.',
    reviewSheetTitle: 'Enjoyed your evening?',
    reviewSheetBody: 'A Google review is the easiest way to thank the kitchen — it takes two taps.',
    reviewSheetCta: 'Leave a review',
    reviewSheetDismiss: 'Maybe later',
    menuHint: 'The menu is just a memory aid. The waiter takes your actual order.',
    gotIt: 'Got it',
    askWaiter: 'Just ask your waiter, if you like',
    ingredientsLabel: 'Ingredients',
    tapToRemove: 'tap to remove',
    extrasLabel: 'Extras',
    withoutShort: 'no',
    withShort: 'with',
    reviewsHeadline: 'What guests say',
    reviewsCta: 'Rate us on Google too',
    ratingLine: (rating, count) => `${rating} out of 5 · ${count} Google reviews`,
    takeIt: "I'll have it",
    discover: 'Discover',
    edit: 'Edit',
    addShort: 'Add',
    inList: 'In your list',
    waiter: 'Waiter',
    waiterCalled: 'On the way',
    readyCallWaiter: "I'm ready, call the waiter",
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
    noMorePairings: 'No other pairing to suggest, for now.',
    pairingFor: (dishes) => `For ${dishes}`,
    emptySelection: "Tick the dishes you fancy: they'll be right here, no need to browse again.",
    clearList: 'Clear list',
    removeItem: (name) => `Remove ${name}`,
    addToSelection: 'Add to selection',
    closeSearch: 'Close search',
    groups: { pizze: 'Pizzas', cucina: 'Kitchen', bevande: 'Drinks' },
    signOff: 'Certain you’ll have a wonderful evening, we wish you buon appetito.',
    footer: 'Prices in euros · Cover charge €2.00',
    suggestions: ['Truffle', 'Nduja', 'Buffalo', 'Porcini', 'Gorgonzola', 'Anchovies', 'Pistachio', 'Friarielli'],
  },
  de: {
    browseMenu: 'Zur Speisekarte',
    heroMotto: 'Ausgewählte Zutaten, lange Teigreife, für ein leichtes Erlebnis voller Geschmack.',
    headlineChoose: 'Nur der Duft fehlt.',
    headlineGlass: 'Jedes Gericht hat sein Glas.',
    reviews: 'Bewertungen',
    moreOptions: 'Weitere Optionen',
    moreOptionsHint: 'WLAN, Bewertungen, Kellner: immer nur einen Fingertipp entfernt.',
    reviewSheetTitle: 'War es ein schöner Abend?',
    reviewSheetBody: 'Eine Google-Bewertung ist der einfachste Dank an die Küche — zwei Fingertipps genügen.',
    reviewSheetCta: 'Bewertung schreiben',
    reviewSheetDismiss: 'Vielleicht später',
    menuHint: 'Die Karte ist nur eine Gedächtnisstütze. Die Bestellung nimmt der Kellner auf.',
    gotIt: 'Verstanden',
    askWaiter: 'Fragen Sie einfach den Kellner',
    ingredientsLabel: 'Zutaten',
    tapToRemove: 'zum Entfernen tippen',
    extrasLabel: 'Extras',
    withoutShort: 'ohne',
    withShort: 'mit',
    reviewsHeadline: 'Das sagen unsere Gäste',
    reviewsCta: 'Bewerten Sie uns auf Google',
    ratingLine: (rating, count) => `${rating} von 5 · ${count} Google-Rezensionen`,
    takeIt: 'Nehme ich',
    discover: 'Entdecken',
    edit: 'Bearbeiten',
    addShort: 'Hinzufügen',
    inList: 'In der Liste',
    waiter: 'Kellner',
    waiterCalled: 'Kommt gleich',
    readyCallWaiter: 'Bereit, Kellner rufen',
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
    noMorePairings: 'Im Moment keine weitere Empfehlung.',
    pairingFor: (dishes) => `Für ${dishes}`,
    emptySelection: 'Haken Sie an, was Sie reizt: Sie finden es hier wieder, ohne erneut zu blättern.',
    clearList: 'Liste leeren',
    removeItem: (name) => `${name} entfernen`,
    addToSelection: 'Zur Auswahl hinzufügen',
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
