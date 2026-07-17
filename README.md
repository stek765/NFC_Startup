# NFC_Startup

Tre prodotti indipendenti, ognuno nella propria cartella. Non condividono backend, database o secret.

## 1. Menu digitale per il locale — `nfc-smart-backend/`

Landing page NFC per un ristorante: menu con abbinamenti bevande, WiFi, chiamata cameriere, recensioni Google. Cloudflare Worker + Supabase + bot Telegram per l'aggiornamento menu. **In produzione, con clienti paganti reali** (pilota: Pizzeria Notte Dì, Verona).

```bash
cd nfc-smart-backend
npm install
npm run dev              # Worker su http://localhost:8787

# lavoro solo sul frontend, con hot reload
cd frontend && npm install && npm run dev
```

Dettagli: [`nfc-smart-backend/CLAUDE.md`](nfc-smart-backend/CLAUDE.md).

## 2. Configuratore targhette NFC custom — `sito-custom-nfc/`

Sito dove un cliente compone visivamente la targhetta NFC 3D-stampata (forma, colori, testi, logo, QR), vede il prezzo live e chiude con una richiesta di preventivo. Worker e Supabase **dedicati**, separati dal progetto menu. Non ancora deployato (scelta deliberata, v1 senza checkout online — vedi il suo CLAUDE.md per il perché fiscale).

```bash
cd sito-custom-nfc
npm install
npm run dev              # frontend Vite, :5184
npm run dev:worker       # Worker dedicato, :8788 (serve .dev.vars)
npm test                 # test unitari (prezzo, leggibilità, config, immagini)
```

Dettagli: [`sito-custom-nfc/CLAUDE.md`](sito-custom-nfc/CLAUDE.md).

## 3. Pagina sponsor / vetrina — `nfc-sponsor-page/`

Pagina statica di presentazione ("NFC Smart Solutions") verso potenziali clienti o sponsor. Un solo file HTML, nessuna build, nessun backend.

```bash
open nfc-sponsor-page/index.html
```

Dettagli: [`nfc-sponsor-page/CLAUDE.md`](nfc-sponsor-page/CLAUDE.md).

## Separazione tra progetti

Ogni progetto ha il proprio Worker Cloudflare, il proprio Supabase (dove presente), i propri secret. Non ci sono endpoint condivisi né import cross-progetto tra le tre cartelle — è intenzionale.
