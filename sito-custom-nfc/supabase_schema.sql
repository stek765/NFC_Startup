-- ============================================================
-- SITO CUSTOM NFC — schema per il progetto Supabase DEDICATO
-- (NON è il progetto Supabase del menu ristoranti: quando il sito
--  avrà il suo spazio, creare un nuovo progetto Supabase e
--  eseguire questo file nel suo SQL Editor.)
-- Eseguibile più volte senza danni (idempotente).
-- ============================================================

create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  restaurant_name text not null,
  contact text not null,
  notes text,
  config jsonb not null,
  price_shown numeric not null,
  logo_url text
);

-- RLS attiva senza policy: nessun accesso anon; scrive/legge solo il Worker (secret key).
alter table quotes enable row level security;

-- Bucket pubblico per i loghi allegati ai preventivi.
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;
