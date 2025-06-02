import { Env } from '../index';
import { jwtVerify } from 'jose';

function parseCSV(text: string): any[] {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = values[i]?.trim() ?? ''; });
    return obj;
  });
}

async function getUserIdFromRequest(request: Request, env: Env): Promise<number | null> {
  const auth = request.headers.get('authorization');
  if (!auth) return null;
  const token = auth.replace('Bearer ', '');
  try {
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return (payload as any).userId;
  } catch {
    return null;
  }
}

export async function handleUpload(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const userId = await getUserIdFromRequest(request, env);
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file') as File;
  if (!file) return new Response('No file uploaded', { status: 400 });
  const text = await file.text();
  let records;
  try {
    records = parseCSV(text);
  } catch (e) {
    return new Response('Invalid CSV', { status: 400 });
  }
  const filename = file.name || 'uploaded.csv';
  const { meta } = await env.DB.prepare('INSERT INTO csv_files (user_id, filename, uploaded_at) VALUES (?, ?, datetime())').bind(userId, filename).run();
  const fileId = meta.last_row_id;
  for (const row of records) {
    await env.DB.prepare('INSERT INTO csv_data (file_id, row_data) VALUES (?, ?)').bind(fileId, JSON.stringify(row)).run();
  }
  return new Response('File uploaded', { status: 201 });
}
