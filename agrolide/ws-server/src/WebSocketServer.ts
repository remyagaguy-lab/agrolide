export class WebSocketServer {
  state: DurableObjectState;
  sessions: Map<WebSocket, any>;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.sessions = new Map();
  }

  async fetch(request: Request) {
    const url = new URL(request.url);
    if (url.pathname === '/broadcast' && request.method === 'POST') {
      const body = await request.text();
      return this.broadcast(body);
    }

    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      return new Response('Expected Upgrade: websocket', { status: 426 });
    }

    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    this.state.acceptWebSocket(server);
    this.sessions.set(server, { connectedAt: Date.now() });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    // Si c'est un message du client (ex: ping) on peut répondre
    try {
      const data = JSON.parse(message as string);
      if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
      }
    } catch (e) {
      // Ignorer les erreurs de parsing
    }
  }

  async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
    this.sessions.delete(ws);
  }

  async webSocketError(ws: WebSocket, error: any) {
    this.sessions.delete(ws);
  }

  // Méthode custom appelée via un appel RPC / fetch interne depuis l'index.ts
  async broadcast(message: string) {
    const webSockets = this.state.getWebSockets();
    for (const ws of webSockets) {
      try {
        ws.send(message);
      } catch (err) {
        // Ignorer les erreurs d'envoi sur les sockets morts
      }
    }
    return new Response('Broadcast success');
  }
}

export interface Env {
  WEBSOCKET_SERVER: DurableObjectNamespace;
}
