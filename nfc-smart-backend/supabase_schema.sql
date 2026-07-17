-- Esegui questo script nell'SQL Editor di Supabase (progetto nuovo, da zero)

CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    telegram_chat_id BIGINT UNIQUE, -- Se vuoi collegarlo via Telegram
    google_maps_url TEXT,
    google_place_id TEXT, -- Place ID Google: abilita il deep link "scrivi recensione" 1-tap (search.google.com/local/writereview?placeid=...)
    menu_url TEXT,
    wifi_password TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- RLS (Row Level Security) per permettere la lettura anonima
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ristoranti visibili a tutti" ON restaurants
    FOR SELECT USING (true);

-- Nessuna policy INSERT/UPDATE/DELETE per il ruolo anon: di default RLS le nega.
-- Il Worker scrive usando la SUPABASE_SECRET_KEY (service_role), che bypassa la RLS
-- ed è definita solo come secret del Worker, mai esposta al client.

-- Bucket Storage per i Menu
INSERT INTO storage.buckets (id, name, public)
VALUES ('menus', 'menus', true);

CREATE POLICY "Menu leggibili da tutti" ON storage.objects
    FOR SELECT USING (bucket_id = 'menus');

-- Nessuna policy INSERT per anon qui: gli upload li fa solo il Worker con la
-- service_role key (vedi sopra). Chiunque avesse la sola publishable/anon key
-- può leggere i menu ma non può più caricarne di nuovi.

-- Analytics: eventi grezzi (scan NFC, ricerche, selezioni, ...). Scrive solo il
-- Worker con la service_role key; nessuna policy anon = né lettura né scrittura
-- pubblica. Consultazione: SQL editor di Supabase (per ora).
CREATE TABLE events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX events_restaurant_created_idx ON events (restaurant_id, created_at DESC);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- MIGRAZIONE (12/07/2026) — da eseguire su un progetto già esistente che aveva
-- lo schema vecchio (policy INSERT pubbliche + niente updated_at). Idempotente.
-- ============================================================================

ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;

DROP POLICY IF EXISTS "Menu caricabili da chiunque" ON storage.objects;

-- Se in futuro serve dare scrittura pubblica limitata (es. senza passare dal
-- Worker), ricreala con un WITH CHECK più stretto — non "bucket_id = 'menus'"
-- da solo, che permette di sovrascrivere il file di qualsiasi altro ristorante.

-- ============================================================================
-- MIGRAZIONE (15/07/2026) — analytics + recensioni 1-tap. Idempotente.
-- ============================================================================

ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS google_place_id TEXT;

CREATE TABLE IF NOT EXISTS events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS events_restaurant_created_idx ON events (restaurant_id, created_at DESC);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Per trovare il Place ID di un ristorante: https://developers.google.com/maps/documentation/places/web-service/place-id
-- (Place ID Finder) — cerca il locale, copia l'ID (inizia con "ChIJ..."), poi:
-- UPDATE restaurants SET google_place_id = 'ChIJ...' WHERE name = 'Notte Dì';
