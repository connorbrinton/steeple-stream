# Cloudflare Tunnel Deployment

This is the recommended first public deployment shape for Steeple Stream on
`brintonium.com`.

## Recommendation

Use a named Cloudflare Tunnel with a dedicated hostname:

```text
https://broadcasts.brintonium.com
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
STEEPLE_PUBLIC_BASE_URL=https://broadcasts.brintonium.com
STEEPLE_PUBLIC_WEBRTC=0
```

That makes public viewers use HLS immediately instead of trying WebRTC and then
falling back. Local/LAN operators can still use the low-latency path by running
a local deployment with `STEEPLE_PUBLIC_WEBRTC` left enabled.

## Locally Managed Tunnel

`cloudflared` is included in the Steeple Stream flake development shell:

```bash
nix develop
cloudflared --version
```

Authenticate it, create a named tunnel, and route DNS:

```bash
cloudflared tunnel login
cloudflared tunnel create steeple-stream-brintonium
cloudflared tunnel route dns steeple-stream-brintonium broadcasts.brintonium.com
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
      tunnelName = "steeple-stream-brintonium";
      hostname = "broadcasts.brintonium.com";
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
cloudflared tunnel --config /path/to/config.yml run steeple-stream-brintonium
```

Validate the ingress file before installing it as a service:

```bash
cloudflared tunnel ingress validate --config /path/to/config.yml
cloudflared tunnel ingress rule --config /path/to/config.yml https://broadcasts.brintonium.com/broadcasts/stakecenter
```

## Steeple Stream Environment

Minimal production-like environment:

```bash
STEEPLE_HOST=127.0.0.1
STEEPLE_PORT=8080
STEEPLE_PUBLIC_BASE_URL=https://broadcasts.brintonium.com
STEEPLE_PUBLIC_WEBRTC=0
STEEPLE_GOOGLE_CLIENT_ID=...
STEEPLE_GOOGLE_CLIENT_SECRET=...
STEEPLE_ADMIN_EMAILS=...
STEEPLE_OPERATOR_EMAILS=...
STEEPLE_SESSION_SECRET=...
```

Register this Google OAuth redirect URI:

```text
https://broadcasts.brintonium.com/auth/google/callback
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
