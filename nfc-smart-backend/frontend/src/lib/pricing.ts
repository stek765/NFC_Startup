import { EXTRA_INGREDIENTS, type MenuItem } from '../data/menu';
import type { DishMods } from '../context/SelectionContext';

export function extraPrice(name: string): number {
  return EXTRA_INGREDIENTS.find((e) => e.name === name)?.price ?? 0;
}

export function dishTotal(item: MenuItem, mods: DishMods): number {
  return item.price + mods.added.reduce((sum, name) => sum + extraPrice(name), 0);
}
