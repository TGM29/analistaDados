import { handleAuth } from './routes/auth';
import { handleUpload } from './routes/upload';
import { handleData } from './routes/data';

export interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/auth')) {
      return handleAuth(request, env);
    }
    if (url.pathname.startsWith('/api/upload')) {
      return handleUpload(request, env);
    }
    if (url.pathname.startsWith('/api/data')) {
      return handleData(request, env);
    }
    return new Response('Not found', { status: 404 });
  },
};
