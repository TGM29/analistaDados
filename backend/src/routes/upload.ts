import { Env } from '../index';
import jwt from 'jsonwebtoken';
import { parse } from 'csv-parse/sync';

async function getUserIdFromRequest(request: Request, env: Env): Promise<number | null> {
  const auth = request.headers.get('authorization');
  if (!auth) return null;
  const token = auth.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as any;
    return payload.userId;
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
    records = parse(text, { columns: true });
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
