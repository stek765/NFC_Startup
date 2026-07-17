import { createClient } from '@supabase/supabase-js';

export interface Env {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
    SUPABASE_SECRET_KEY: string;
    TELEGRAM_BOT_TOKEN: string;
    ADMIN_TELEGRAM_CHAT_ID?: string;
    CONFIGURATOR_ORIGIN?: string;
    ASSETS: Fetcher;
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);

        if (url.pathname === '/webhook/telegram' && request.method === 'POST') {
            return await handleTelegramWebhook(request, env);
        }

        if (url.pathname.startsWith('/t/')) {
            const uuid = url.pathname.replace('/t/', '');
            return await handleNfcLandingPage(uuid, env, request, ctx);
        }

        if (url.pathname === '/api/event' && request.method === 'POST') {
            return await handleEvent(request, env, ctx);
        }

        if (url.pathname === '/api/quote' && (request.method === 'POST' || request.method === 'OPTIONS')) {
            return await handleQuote(request, env, ctx);
        }

        if (url.pathname === '/test') {
            return await handleNfcLandingPage('test-mock', env, request, ctx);
        }

        return new Response('Visita /t/<id-ristorante> per accedere al menu.', { status: 200 });
    }
};

async function handleTelegramWebhook(request: Request, env: Env) {
    try {
        const body = await request.json() as any;
        if (!body.message) return new Response('OK');

        const chatId = body.message.chat.id;
        const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY);

        if (body.message.document) {
            const fileId = body.message.document.file_id;
            const fileRes = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`);
            const fileData = await fileRes.json() as any;
            const downloadUrl = `https://api.telegram.org/file/bot${env.TELEGRAM_BOT_TOKEN}/${fileData.result.file_path}`;

            const fileContentRes = await fetch(downloadUrl);
            const fileBlob = await fileContentRes.blob();
            const fileName = `${chatId}_menu.${fileData.result.file_path.split(".").pop()}`;

            const { error: storageError } = await supabase.storage.from("menus").upload(fileName, fileBlob, { upsert: true });

            if (storageError) {
                await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, "❌ Errore storage.");
            } else {
                const { data: urlData } = supabase.storage.from("menus").getPublicUrl(fileName);
                const { error: updateError } = await supabase.from("restaurants").update({
                    menu_url: urlData.publicUrl,
                    updated_at: new Date().toISOString()
                }).eq("telegram_chat_id", chatId);

                if (updateError) {
                    await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, "❌ Menu caricato ma non collegato al ristorante (chat non registrata).");
                } else {
                    await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, "✅ Menu aggiornato e online!");
                }
            }
        } else if (body.message.text === '/start') {
            await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, "Benvenuto! Inviaci un PDF per aggiornare il menu.");
        }
        return new Response('OK');
    } catch (e) {
        return new Response('Error', { status: 500 });
    }
}

const CLIENT_EVENT_TYPES = new Set(['search', 'select_add', 'call_waiter', 'wifi_open', 'review_click', 'lang']);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function logEvent(env: Env, ctx: ExecutionContext, restaurantId: string, type: string, payload: unknown = {}) {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY);
    ctx.waitUntil(
        Promise.resolve(supabase.from('events').insert({ restaurant_id: restaurantId, type, payload })).then(
            () => {},
            () => {},
        ),
    );
}

async function handleEvent(request: Request, env: Env, ctx: ExecutionContext) {
    try {
        const body = (await request.json()) as any;
        const { restaurant_id, type, payload } = body ?? {};
        if (typeof restaurant_id !== 'string' || !UUID_RE.test(restaurant_id)) {
            return new Response('Bad request', { status: 400 });
        }
        if (typeof type !== 'string' || !CLIENT_EVENT_TYPES.has(type)) {
            return new Response('Bad request', { status: 400 });
        }
        const safePayload =
            payload && typeof payload === 'object' && !Array.isArray(payload) && JSON.stringify(payload).length <= 500
                ? payload
                : {};
        logEvent(env, ctx, restaurant_id, type, safePayload);
        return new Response(null, { status: 204 });
    } catch {
        return new Response('Bad request', { status: 400 });
    }
}

async function handleNfcLandingPage(uuid: string, env: Env, request: Request, ctx: ExecutionContext) {
    let restaurant: any;

    if (uuid === 'test-mock') {
        restaurant = {
            id: 'test-mock',
            name: 'Pizzeria da Stefano',
            google_maps_url: 'https://maps.google.com/?q=Pizzeria+da+Stefano',
            menu_url: 'https://example.com/menu.pdf',
            wifi_password: 'TestPass2024!'
        };
    } else {
        const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
        const { data } = await supabase.from('restaurants').select('*').eq('id', uuid).single();
        restaurant = data;
    }

    if (!restaurant) return new Response('Ristorante non trovato.', { status: 404 });

    if (restaurant.id !== 'test-mock') {
        logEvent(env, ctx, restaurant.id, 'scan');
    }

    const assetUrl = new URL('/index.html', request.url);
    const assetResponse = await env.ASSETS.fetch(assetUrl);
    let html = await assetResponse.text();

    const safeRestaurantJson = JSON.stringify(restaurant).replace(/</g, '\\u003c');
    const dataScript = `<script>window.__RESTAURANT__ = ${safeRestaurantJson};</script>`;
    html = html.replace('</head>', `${dataScript}</head>`);

    return new Response(html, {
        headers: {
            'Content-Type': 'text/html;charset=UTF-8',
            'Cache-Control': 'public, max-age=3600'
        }
    });
}

async function sendTelegramMessage(botToken: string, chatId: string, text: string) {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text })
    });
}

const QUOTE_DEV_ORIGINS = new Set(['http://localhost:5184', 'http://127.0.0.1:5184']);

function quoteCorsHeaders(request: Request, env: Env): Record<string, string> | null {
    const origin = request.headers.get('Origin') ?? '';
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

        if (env.ADMIN_TELEGRAM_CHAT_ID) {
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