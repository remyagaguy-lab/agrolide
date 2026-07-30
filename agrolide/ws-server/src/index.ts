import { WebSocketServer, Env } from './WebSocketServer';

export { WebSocketServer };

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Check if the request is trying to connect to a channel via websocket
    if (path.startsWith('/ws/')) {
      const channelId = path.split('/')[2];
      if (!channelId) {
        return new Response('Missing channel ID', { status: 400 });
      }

      // We use the channelId to create a unique DO for this channel
      const id = env.WEBSOCKET_SERVER.idFromName(channelId);
      const stub = env.WEBSOCKET_SERVER.get(id);

      return stub.fetch(request);
    }
    
    // Check if the request is an internal broadcast request (API route in Next.js calling this)
    if (path.startsWith('/broadcast/') && request.method === 'POST') {
      const channelId = path.split('/')[2];
      if (!channelId) {
        return new Response('Missing channel ID', { status: 400 });
      }

      // Security check could be added here (e.g., verifying a secret token)
      
      const body = await request.text();
      const id = env.WEBSOCKET_SERVER.idFromName(channelId);
      const stub = env.WEBSOCKET_SERVER.get(id);
      
      // In Durable Objects RPC or fetch, we can just call a custom route on the DO
      // However, we didn't route it inside DO fetch, we can just pass a specific URL
      const req = new Request(`http://do/broadcast`, { method: 'POST', body });
      return stub.fetch(req);
    }

    return new Response('WebSocket Server is running. Connect to /ws/:channelId', { status: 200 });
  }
};
