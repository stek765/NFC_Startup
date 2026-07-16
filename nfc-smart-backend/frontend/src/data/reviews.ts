// REGOLA: solo recensioni VERE, copiate parola per parola dalla scheda Google
// (nome, stelle, testo). Mai inventate o "migliorate".
export interface CuratedReview {
  name: string;
  stars: 1 | 2 | 3 | 4 | 5;
  text: string;
}

export const googleRating = '4,2';
export const googleReviewCount = '1.500+';

export const curatedReviews: CuratedReview[] = [
];
