import http from "node:http";
import { ObsWebSocketServer } from "./obsWebSocket.js";

export class ObsEndpointManager {
  declare store: any;
  declare service: any;
  declare coordinator: any;
  declare host: string;
  declare servers: Map<string, http.Server>;

  constructor({ store, service, coordinator, host = "127.0.0.1" }) {
    this.store = store;
    this.service = service;
    this.coordinator = coordinator;
    this.host = host;
    this.servers = new Map();
  }

  async reload() {
    await this.stop();
    for (const credential of this.store.listObsCredentials().filter((entry) => entry.enabled)) {
      const server = http.createServer((_req, res) => { res.writeHead(404); res.end(); });
      new ObsWebSocketServer({
        server,
        service: this.service,
        coordinator: this.coordinator,
        credential,
        actor: { type: "unit", id: credential.id, name: credential.unitName, role: "operator" }
      });
      await new Promise<void>((resolve, reject) => {
        server.once("error", reject);
        server.listen(credential.port, this.host, () => resolve());
      });
      this.servers.set(credential.id, server);
    }
  }

  async stop() {
    await Promise.all([...this.servers.values()].map((server) => new Promise<void>((resolve) => server.close(() => resolve()))));
    this.servers.clear();
  }
}
