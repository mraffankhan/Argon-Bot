import { NextResponse } from 'next/server';

const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || process.env.DISCORD_CLIENT_ID || '1470031097357140063';
const DISCORD_OAUTH_URL = 'https://discord.com/oauth2/authorize';
const REDIRECT_URI = (process.env.NODE_ENV === 'production'
    ? 'https://ravonixx.xyz/api/auth/callback'
    : 'http://localhost:3000/api/auth/callback').trim();

export async function GET() {
    const clientId = DISCORD_CLIENT_ID.trim();
    const scope = 'identify email guilds'; // Required scopes: identify, email, guilds
    const redirectUri = REDIRECT_URI;

    const authUrl = new URL(DISCORD_OAUTH_URL);
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', scope);
    // Added prompt=consent to ensure the user is always prompted (optional, but good for debugging)
    // authUrl.searchParams.set('prompt', 'consent');

    return NextResponse.redirect(authUrl.toString());
}
