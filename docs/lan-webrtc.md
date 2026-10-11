# Low-latency WebRTC preview on the chapel LAN

The broadcaster preview uses MediaMTX WebRTC when a `webrtcUrl` is advertised and HLS otherwise. With both available, the browser attempts WebRTC first and falls back to HLS if signaling or media establishment fails.

## Traffic paths

- **Control, WebRTC signaling (WHEP), and HLS:** HTTPS to the existing Cloudflare Tunnel, proxied to Steeple Stream and local MediaMTX HTTP listeners.
- **WebRTC media:** browser ICE connects **directly to the Beelink's LAN IP via UDP 8189**. Cloudflare Tunnel does not carry the UDP media.
- MediaMTX's `webrtcIPsFromInterfaces` setting defaults to true. The generated configuration uses `webrtcLocalUDPAddress: :8189`. It advertises the Beelink's interface IPs as ICE candidates; no fixed LAN IP is required.

The deployment enables `services.steeple-stream.publicWebRtc = true` and opens **UDP 8189 in the NixOS firewall**. No internet router port-forward, public UDP exposure, TURN server, or external WebRTC relay is required for the intended LAN use case. HLS remains the fallback for offsite operators and LAN devices that cannot reach the Beelink directly.

## Verification

After deployment, open the normal `https://broadcasts.brintonium.com` broadcaster UI on chapel Wi-Fi. The preview overlay should display:

- `WebRTC · Connecting…` during ICE/signaling.
- `WebRTC · Direct` and ICE candidate type when the peer connection succeeds.
- `HLS · Higher latency`, optionally with a WebRTC failure reason, if the browser falls back.

If the indicator shows HLS on the chapel Wi-Fi, check the browser's `about:webrtc` (Firefox) or `chrome://webrtc-internals` (Chromium-based browsers) and confirm the Beelink LAN IP can be reached over UDP 8189. Some guest Wi-Fi networks use client isolation or VLAN ACLs that block direct access. Also check the NixOS firewall and MediaMTX ICE logs.

The indicator reports the transport selected _by the browser_, not simply whether the WebRTC API is enabled in server configuration. A host ICE candidate indicates a direct peer connection but isn't proof of the network's exact physical route.

Do not deploy or change the running configuration during an active broadcast.
