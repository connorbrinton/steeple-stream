# Cloudflare Tunnel Deployment

This is the recommended first public deployment shape for Steeple Stream.

## Recommendation

Use a named Cloudflare Tunnel with a dedicated hostname:

```text
https://broadcasts.example.org
```

That hostname should point at the local Steeple Stream HTTP service:

```text
http://127.0.0.1:8080
```

The app remains bound to loopback. `cloudflared` is the only public ingress
path, so the broadcast appliance does not need inbound firewall ports.

## Why HLS First

Cloudflare Tunnel is a good fit for the Steeple Stream web app, admin API,
Server-Sent Events, HLS playlists, HLS segments, and OBS WebSocket-compatible
control endpoints. It is not the first-version answer for public low-latency
WebRTC media, because the WHEP signaling request is HTTP but the media path
still depends on ICE connectivity to MediaMTX.

For the initial hosted version, set:

```bash
STEEPLE_PUBLIC_BASE_URL=https://broadcasts.example.org
STEEPLE_PUBLIC_WEBRTC=0
```

That makes public viewers use HLS immediately instead of trying WebRTC and then
falling back. Local/LAN operators can still use the low-latency path by running
a local deployment with `STEEPLE_PUBLIC_WEBRTC` left enabled.

## Locally Managed Tunnel

`cloudflared` is exposed by the Steeple Stream flake for production/manual use:

```bash
nix run .#cloudflared -- --version
```

It is also included in the development shell as a convenience. Authenticate it,
create a named tunnel, and route DNS:

```bash
nix run .#cloudflared -- tunnel login
nix run .#cloudflared -- tunnel create steeple-stream-example
nix run .#cloudflared -- tunnel route dns steeple-stream-example broadcasts.example.org
```

This creates a tunnel credentials JSON file. Keep that file out of Git and copy
it to a root-readable location on the broadcast host, for example:

```text
/var/lib/cloudflared/<tunnel-id>.json
```

## NixOS Module

On NixOS, the Steeple Stream module can also manage the Cloudflare Tunnel
service through Nixpkgs' native `services.cloudflared` module:

```nix
{
  imports = [
    inputs.steeple-stream.nixosModules.default
  ];

  services.steeple-stream = {
    enable = true;
    cloudflareTunnel = {
      enable = true;
      tunnelName = "steeple-stream-example";
      hostname = "broadcasts.example.org";
      credentialsFile = "/var/lib/cloudflared/<tunnel-id>.json";
    };
    environmentFile = "/run/secrets/steeple-stream.env";
  };
}
```

When `cloudflareTunnel.enable` is set, the module automatically:

- runs Steeple Stream on loopback
- sets `STEEPLE_PUBLIC_BASE_URL=https://<hostname>`
- sets `STEEPLE_PUBLIC_WEBRTC=0`
- enables `services.cloudflared`
- routes the tunnel hostname to `http://127.0.0.1:8080`

## Manual Config

For non-NixOS systems, create a config based on:

```text
deploy/cloudflared-config.example.yml
```

Then run:

```bash
nix run .#cloudflared -- tunnel --config /path/to/config.yml run steeple-stream-example
```

Validate the ingress file before installing it as a service:

```bash
nix run .#cloudflared -- tunnel ingress validate --config /path/to/config.yml
nix run .#cloudflared -- tunnel ingress rule --config /path/to/config.yml https://broadcasts.example.org/broadcasts/stakecenter
```

## Steeple Stream Environment

Minimal production-like environment:

```bash
STEEPLE_HOST=127.0.0.1
STEEPLE_PORT=8080
STEEPLE_PUBLIC_BASE_URL=https://broadcasts.example.org
STEEPLE_PUBLIC_WEBRTC=0
STEEPLE_GOOGLE_CLIENT_ID=...
STEEPLE_GOOGLE_CLIENT_SECRET=...
STEEPLE_ADMIN_EMAILS=...
STEEPLE_OPERATOR_EMAILS=...
STEEPLE_SESSION_SECRET=...
```

Register this Google OAuth redirect URI:

```text
https://broadcasts.example.org/auth/google/callback
```

## Later WebRTC Options

When public low-latency viewing becomes a requirement, choose one of these
paths instead of assuming Cloudflare Tunnel alone solves media transport:

- Expose MediaMTX WebRTC directly with a public UDP path and a correctly
  advertised ICE hostname.
- Add a relay service designed for WebRTC media, such as a TURN relay or a
  managed SFU/egress layer.
- Keep HLS for broad public viewing and reserve WebRTC for local translation
  operators on the building LAN.
