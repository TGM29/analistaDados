import { Env } from '../index';
import jwt from 'jsonwebtoken';

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

export async function handleData(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'GET') return new Response('Method not allowed', { status: 405 });
  const userId = await getUserIdFromRequest(request, env);
  if (!userId) return new Response('Unauthorized', { status: 401 });
  // Busca todos os dados dos arquivos do usuário
  const files = await env.DB.prepare('SELECT id, filename, uploaded_at FROM csv_files WHERE user_id = ?').bind(userId).all();
  const result = [];
  for (const file of files.results) {
    const rows = await env.DB.prepare('SELECT row_data FROM csv_data WHERE file_id = ?').bind(file.id).all();
    result.push({
      file: file.filename,
      uploaded_at: file.uploaded_at,
      data: rows.results.map((r: any) => JSON.parse(r.row_data)),
    });
  }
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
  });
}
