import http from "node:http";
import { ObsWebSocketServer } from "./obsWebSocket.js";
import type { BroadcastService } from "./broadcastService.js";
import type { LocationCommandCoordinator } from "./commandCoordinator.js";
import type { ObsCredential } from "./domain.js";

interface ObsStore {
  listObsCredentials(): ObsCredential[];
}

interface ObsEndpointOptions {
  store: ObsStore;
  service: BroadcastService;
  coordinator: LocationCommandCoordinator;
  host?: string;
}

export class ObsEndpointManager {
  declare store: ObsStore;
  declare service: BroadcastService;
  declare coordinator: LocationCommandCoordinator;
  declare host: string;
  declare servers: Map<string, http.Server>;

  constructor({ store, service, coordinator, host = "127.0.0.1" }: ObsEndpointOptions) {
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
        actor: { type: "unit", id: credential.id, name: credential.unitName }
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
