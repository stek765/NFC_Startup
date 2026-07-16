export interface Restaurant {
  id: string;
  name: string;
  google_maps_url?: string | null;
  google_place_id?: string | null;
  menu_url?: string | null;
  wifi_password?: string | null;
}
