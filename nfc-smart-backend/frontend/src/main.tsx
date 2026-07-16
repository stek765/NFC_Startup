import { createRoot } from 'react-dom/client';
import type { Restaurant } from './types';
import { mockRestaurant } from './mockData';
import { App } from './App';
import './index.css';

declare global {
  interface Window {
    __RESTAURANT__?: Restaurant;
  }
}

const restaurant = window.__RESTAURANT__ ?? mockRestaurant;

createRoot(document.getElementById('root')!).render(<App restaurant={restaurant} />);
