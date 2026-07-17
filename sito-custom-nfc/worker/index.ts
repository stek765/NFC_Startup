import { createClient } from '@supabase/supabase-js';

// Worker DEDICATO al sito custom NFC — indipendente dal backend del menu ristoranti.
// Punta a un progetto Supabase proprio (secrets separati), non a quello del menu.
export interface Env {
    SUPABASE_URL: string;
    SUPABASE_SECRET_KEY: string;
    TELEGRAM_BOT_TOKEN?: string;
    ADMIN_TELEGRAM_CHAT_ID?: string;
    CONFIGURATOR_ORIGIN?: string;
    ASSETS: Fetcher;
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);

        if (url.pathname === '/api/quote' && (request.method === 'POST' || request.method === 'OPTIONS')) {
            return await handleQuote(request, env, ctx);
        }

        return env.ASSETS.fetch(request);
    },
};

const QUOTE_DEV_ORIGINS = new Set(['http://localhost:5184', 'http://127.0.0.1:5184']);

function quoteCorsHeaders(request: Request, env: Env): Record<string, string> | null {
    const origin = request.headers.get('Origin') ?? '';
    // Nessun header Origin = richiesta same-origin (frontend servito da questo stesso Worker): ok senza CORS.
    if (origin === '') return {};
    const allowed = QUOTE_DEV_ORIGINS.has(origin) || (!!env.CONFIGURATOR_ORIGIN && origin === env.CONFIGURATOR_ORIGIN);
    if (!allowed) return null;
    return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    };
}

async function handleQuote(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const cors = quoteCorsHeaders(request, env);
    if (!cors) return new Response('Forbidden', { status: 403 });
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    try {
        const raw = await request.text();
        if (raw.length > 1_500_000) return new Response('Payload too large', { status: 413, headers: cors });
        const body = JSON.parse(raw) as any;

        const name = typeof body?.restaurant_name === 'string' ? body.restaurant_name.trim().slice(0, 120) : '';
        const contact = typeof body?.contact === 'string' ? body.contact.trim().slice(0, 120) : '';
        const notes = typeof body?.notes === 'string' ? body.notes.trim().slice(0, 500) : '';
        const price = typeof body?.price === 'number' && Number.isFinite(body.price) ? body.price : null;
        const config =
            body?.config && typeof body.config === 'object' && !Array.isArray(body.config) && JSON.stringify(body.config).length <= 4000
                ? body.config
                : null;
        const configFieldsValid =
            config !== null &&
            typeof config.shape === 'string' && config.shape.length > 0 &&
            typeof config.size === 'string' && config.size.length > 0 &&
            typeof config.baseColor === 'string' && config.baseColor.length > 0 &&
            typeof config.printColor === 'string' && config.printColor.length > 0 &&
            typeof config.font === 'string' && config.font.length > 0 &&
            typeof config.qr === 'boolean';
        if (!name || !contact || price === null || !config || !configFieldsValid) {
            return new Response('Bad request', { status: 400, headers: cors });
        }

        const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY);

        let logoUrl: string | null = null;
        const PNG_PREFIX = 'data:image/png;base64,';
        if (typeof body?.logo === 'string' && body.logo.startsWith(PNG_PREFIX)) {
            const bytes = Uint8Array.from(atob(body.logo.slice(PNG_PREFIX.length)), (c) => c.charCodeAt(0));
            const fileName = `quote_${crypto.randomUUID()}.png`;
            const { error: logoError } = await supabase.storage.from('logos').upload(fileName, bytes, { contentType: 'image/png' });
            if (!logoError) logoUrl = supabase.storage.from('logos').getPublicUrl(fileName).data.publicUrl;
        }

        const { error: insertError } = await supabase.from('quotes').insert({
            restaurant_name: name,
            contact,
            notes: notes || null,
            config,
            price_shown: price,
            logo_url: logoUrl,
        });
        if (insertError) return new Response('Storage error', { status: 500, headers: cors });

        if (env.TELEGRAM_BOT_TOKEN && env.ADMIN_TELEGRAM_CHAT_ID) {
            const summary =
                `🧾 Nuovo preventivo!\n${name} — ${contact}\nTotale mostrato: €${price}\n` +
                `Forma ${config.shape} ${String(config.size).toUpperCase()}, base ${config.baseColor}, stampa ${config.printColor}, font ${config.font}\n` +
                `QR: ${config.qr ? 'sì' : 'no'} · Logo: ${logoUrl ? 'sì' : 'no'}` +
                (notes ? `\nNote: ${notes}` : '');
            ctx.waitUntil(sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, env.ADMIN_TELEGRAM_CHAT_ID, summary));
        }

        return new Response(JSON.stringify({ ok: true }), {
            status: 201,
            headers: { ...cors, 'Content-Type': 'application/json' },
        });
    } catch {
        return new Response('Bad request', { status: 400, headers: cors });
    }
}

async function sendTelegramMessage(botToken: string, chatId: string, text: string) {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text }),
    });
}
