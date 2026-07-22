import { images } from './images';

export interface DrinkInfo {
  label: string;
  image: string;
  description: string;
}

export const drinkInfo: Record<string, DrinkInfo> = {
  Verdicchio: {
    label: 'Verdicchio',
    image: images.whiteWineLarge,
    description:
      "Il Verdicchio è un vitigno bianco autoctono delle Marche, coltivato soprattutto nella zona dei Castelli di Jesi. Dà un vino dal colore paglierino chiaro, con note di mandorla e agrumi e un'acidità che pulisce il palato — il compagno naturale dei piatti di mare.",
  },
  'Cabernet Franc': {
    label: 'Cabernet Franc',
    image: images.redWineLarge,
    description:
      'Il Cabernet Franc è un vitigno a bacca rossa di origine francese, oggi coltivato anche in Veneto. Dà un vino di corpo medio, con note di frutti di bosco e una nota erbacea che lo rende sincero e riconoscibile — la scelta naturale per i piatti più strutturati.',
  },
  'Moretti la rossa': {
    label: 'Moretti la rossa',
    image: images.darkBeerLarge,
    description:
      'La Rossa è la birra a doppio malto di Birra Moretti, con una gradazione del 7,2% e un colore ambrato intenso. Il doppio malto le regala un corpo pieno e una dolcezza rotonda, pensata per accompagnare i piatti più ricchi.',
  },
  "Foster's": {
    label: "Foster's",
    image: images.beerLarge,
    description:
      "Foster's è una lager in stile australiano, prodotta su licenza anche in Europa, con una gradazione del 5%. Leggera e beverina, è la birra che non copre mai il piatto che accompagna.",
  },
  'Ichnusa non filtrata': {
    label: 'Ichnusa non filtrata',
    image: images.darkBeerLarge,
    description:
      "L'Ichnusa non filtrata nasce nel birrificio di Assemini, in Sardegna, e mantiene i lieviti in sospensione invece di rimuoverli con la filtrazione. Il risultato è una birra dal colore opaco e dal gusto più pieno, con una gradazione del 5%.",
  },
  'Birra scura': {
    label: 'Birra scura',
    image: images.darkBeerLarge,
    description:
      'Le birre scure devono il loro colore ai malti tostati, che portano con sé note di caramello e di pane bruciato. Sono la scelta che regge meglio i piatti affumicati o robusti, senza risultare pesante.',
  },
};

export function getDrinkInfo(label: string): DrinkInfo | undefined {
  return drinkInfo[label];
}
