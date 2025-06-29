import { Env } from '../index';
import { SignJWT } from 'jose';

async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
  const hashed = await hashPassword(password);
  return hashed === hash;
}

export async function handleAuth(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  if (request.method === 'POST' && url.pathname.endsWith('/register')) {
    const { email, password } = await request.json();
    if (!email || !password) return new Response('Missing fields', { status: 400 });
    const hash = await hashPassword(password);
    const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
    if (existing) return new Response('Email already registered', { status: 409 });
    await env.DB.prepare('INSERT INTO users (email, senha_hash) VALUES (?, ?)').bind(email, hash).run();
    return new Response('Registered', { status: 201 });
  }
  if (request.method === 'POST' && url.pathname.endsWith('/login')) {
    const { email, password } = await request.json();
    if (!email || !password) return new Response('Missing fields', { status: 400 });
    const user = await env.DB.prepare('SELECT id, senha_hash FROM users WHERE email = ?').bind(email).first();
    if (!user) return new Response('Invalid credentials', { status: 401 });
    const valid = await comparePassword(password, user.senha_hash);
    if (!valid) return new Response('Invalid credentials', { status: 401 });
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const token = await new SignJWT({ userId: user.id, email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(secret);
    return new Response(JSON.stringify({ token }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response('Not found', { status: 404 });
}
