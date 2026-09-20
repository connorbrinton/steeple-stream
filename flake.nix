{
  description = "Steeple Stream development and media runtime packages";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
      pythonGst = pkgs: pkgs.python3.withPackages (pythonPackages: [
        pythonPackages.pygobject3
      ]);
      mediaPackages = pkgs: [
        pkgs.mediamtx
        pkgs.gst_all_1.gstreamer
        pkgs.gst_all_1.gst-plugins-base
        pkgs.gst_all_1.gst-plugins-good
        pkgs.gst_all_1.gst-plugins-bad
        pkgs.gst_all_1.gst-plugins-ugly
        pkgs.gst_all_1.gst-libav
        pkgs.gst_all_1.gst-rtsp-server
        pkgs.ndi
        (pythonGst pkgs)
      ];
      gstPluginPath = pkgs: gstPluginNdi:
        pkgs.lib.makeSearchPath "lib/gstreamer-1.0" [
          gstPluginNdi
          pkgs.gst_all_1.gstreamer.out
          pkgs.gst_all_1.gst-plugins-base
          pkgs.gst_all_1.gst-plugins-good
          pkgs.gst_all_1.gst-plugins-bad
          pkgs.gst_all_1.gst-plugins-ugly
          pkgs.gst_all_1.gst-libav
          pkgs.gst_all_1.gst-rtsp-server
        ];
      gstTypelibPath = pkgs:
        pkgs.lib.makeSearchPath "lib/girepository-1.0" [
          pkgs.gst_all_1.gstreamer.out
          pkgs.gst_all_1.gst-plugins-base
        ];
    in
    {
      packages = forAllSystems (system:
        let
          pkgs = import nixpkgs {
            inherit system;
            config.allowUnfree = true;
          };
          gstPluginNdi = pkgs.callPackage ./nix/gst-plugin-ndi.nix { };
        in
        {
          cloudflared = pkgs.cloudflared;
          gst-plugin-ndi = gstPluginNdi;
          steeple-stream = pkgs.buildNpmPackage {
            pname = "steeple-stream";
            version = "0.1.0";
            src = pkgs.lib.cleanSourceWith {
              src = ./.;
              filter = sourcePath: sourceType:
                let name = builtins.baseNameOf sourcePath;
                in !builtins.elem name [ ".git" "data" "node_modules" "result" ];
            };
            npmDepsHash = "sha256-p2MLgrDK4LHaRMbem8q2SSWHs7pubdpDVd3o2jd16II=";
            nativeBuildInputs = [ pkgs.makeWrapper ];
            preInstall = ''
              npm prune --omit=dev
            '';
            installPhase = ''
              runHook preInstall
              mkdir -p $out/share/steeple-stream $out/bin
              cp -R package.json src public node_modules $out/share/steeple-stream/
              makeWrapper ${pkgs.nodejs_22}/bin/node $out/bin/steeple-stream \
                --add-flags "$out/share/steeple-stream/src/server.js" \
                --prefix PATH : ${pkgs.lib.makeBinPath ([ pkgs.nodejs_22 ] ++ mediaPackages pkgs)} \
                --set-default STEEPLE_MEDIAMTX_RUNTIME system \
                --set-default STEEPLE_INGEST_RUNTIME system \
                --set-default GST_PLUGIN_PATH ${gstPluginPath pkgs gstPluginNdi} \
                --set-default GI_TYPELIB_PATH ${gstTypelibPath pkgs} \
                --set-default LD_LIBRARY_PATH ${pkgs.ndi}/lib
              runHook postInstall
            '';
          };
          default = self.packages.${system}.steeple-stream;
        });

      apps = forAllSystems (system: {
        steeple-stream = {
          type = "app";
          program = "${self.packages.${system}.steeple-stream}/bin/steeple-stream";
          meta.description = "Run the Steeple Stream broadcast server";
        };
        cloudflared = {
          type = "app";
          program = "${self.packages.${system}.cloudflared}/bin/cloudflared";
          meta.description = "Run cloudflared from the Steeple Stream flake";
        };
        default = self.apps.${system}.steeple-stream;
      });

      devShells = forAllSystems (system:
        let
          pkgs = import nixpkgs {
            inherit system;
            config.allowUnfree = true;
          };
          gstPluginNdi = self.packages.${system}.gst-plugin-ndi;
        in
        {
          default = pkgs.mkShell {
            packages = [ pkgs.nodejs_22 pkgs.cloudflared gstPluginNdi ] ++ mediaPackages pkgs;
            GST_PLUGIN_PATH = gstPluginPath pkgs gstPluginNdi;
            GI_TYPELIB_PATH = gstTypelibPath pkgs;
            LD_LIBRARY_PATH = "${pkgs.ndi}/lib";
          };
        });

      nixosModules.default = { config, lib, pkgs, ... }:
        let
          cfg = config.services.steeple-stream;
          tunnelCfg = cfg.cloudflareTunnel;
        in {
          options.services.steeple-stream = {
            enable = lib.mkEnableOption "Steeple Stream";
            package = lib.mkOption { type = lib.types.package; default = self.packages.${pkgs.stdenv.hostPlatform.system}.steeple-stream; };
            dataDir = lib.mkOption { type = lib.types.path; default = "/var/lib/steeple-stream"; };
            environmentFile = lib.mkOption { type = lib.types.nullOr lib.types.path; default = null; };
            host = lib.mkOption { type = lib.types.str; default = "127.0.0.1"; };
            port = lib.mkOption { type = lib.types.port; default = 8080; };
            publicBaseUrl = lib.mkOption {
              type = lib.types.nullOr lib.types.str;
              default = null;
              example = "https://broadcasts.example.org";
              description = "Externally visible base URL used for OAuth redirects and generated links.";
            };
            publicWebRtc = lib.mkOption {
              type = lib.types.bool;
              default = true;
              description = "Advertise WebRTC playback URLs to public clients.";
            };
            trustedProxy = lib.mkOption {
              type = lib.types.bool;
              default = false;
              description = "Trust Cloudflare/proxy client IP headers for rate limiting and metrics.";
            };
            cloudflareTunnel = {
              enable = lib.mkEnableOption "a Cloudflare Tunnel for Steeple Stream";
              tunnelName = lib.mkOption {
                type = lib.types.str;
                default = "steeple-stream";
                example = "steeple-stream-example";
                description = "Cloudflare Tunnel name or UUID.";
              };
              hostname = lib.mkOption {
                type = lib.types.nullOr lib.types.str;
                default = null;
                example = "broadcasts.example.org";
                description = "Public hostname routed through Cloudflare Tunnel.";
              };
              credentialsFile = lib.mkOption {
                type = lib.types.nullOr lib.types.path;
                default = null;
                example = "/var/lib/cloudflared/00000000-0000-0000-0000-000000000000.json";
                description = "Cloudflare Tunnel credentials JSON created by cloudflared.";
              };
              protocol = lib.mkOption {
                type = lib.types.enum [ "auto" "http2" "quic" ];
                default = "auto";
                description = "Protocol cloudflared uses to reach Cloudflare's edge.";
              };
            };
          };
          config = lib.mkIf cfg.enable {
            assertions = [
              {
                assertion = !tunnelCfg.enable || tunnelCfg.hostname != null;
                message = "services.steeple-stream.cloudflareTunnel.hostname is required when the tunnel is enabled.";
              }
              {
                assertion = !tunnelCfg.enable || tunnelCfg.credentialsFile != null;
                message = "services.steeple-stream.cloudflareTunnel.credentialsFile is required when the tunnel is enabled.";
              }
            ];
            users.users.steeple-stream = { isSystemUser = true; group = "steeple-stream"; home = cfg.dataDir; };
            users.groups.steeple-stream = {};
            systemd.services.steeple-stream = {
              description = "Steeple Stream broadcast appliance";
              wantedBy = [ "multi-user.target" ];
              after = [ "network-online.target" ];
              wants = [ "network-online.target" ];
              serviceConfig = {
                User = "steeple-stream";
                Group = "steeple-stream";
                StateDirectory = "steeple-stream";
                ExecStart = "${cfg.package}/bin/steeple-stream";
                Restart = "on-failure";
                RestartSec = 3;
              } // lib.optionalAttrs (cfg.environmentFile != null) { EnvironmentFile = cfg.environmentFile; };
              environment = {
                STEEPLE_DATA_DIR = cfg.dataDir;
                STEEPLE_HOST = cfg.host;
                STEEPLE_PORT = toString cfg.port;
                STEEPLE_PUBLIC_WEBRTC = if cfg.publicWebRtc then "1" else "0";
                STEEPLE_TRUSTED_PROXY = if cfg.trustedProxy || tunnelCfg.enable then "1" else "0";
              } // lib.optionalAttrs (cfg.publicBaseUrl != null) {
                STEEPLE_PUBLIC_BASE_URL = cfg.publicBaseUrl;
              } // lib.optionalAttrs tunnelCfg.enable {
                STEEPLE_PUBLIC_BASE_URL = "https://${tunnelCfg.hostname}";
                STEEPLE_PUBLIC_WEBRTC = "0";
              };
            };
            services.cloudflared = lib.mkIf tunnelCfg.enable {
              enable = true;
              package = pkgs.cloudflared;
              tunnels.${tunnelCfg.tunnelName} = {
                credentialsFile = tunnelCfg.credentialsFile;
                protocol = tunnelCfg.protocol;
                ingress.${tunnelCfg.hostname} = {
                  service = "http://${cfg.host}:${toString cfg.port}";
                  originRequest = {
                    connectTimeout = "10s";
                    httpHostHeader = tunnelCfg.hostname;
                  };
                };
                default = "http_status:404";
              };
            };
          };
        };
    };
}
