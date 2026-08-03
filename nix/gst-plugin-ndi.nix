{ lib
, rustPlatform
, fetchCrate
, pkg-config
, gst_all_1
}:

rustPlatform.buildRustPackage rec {
  pname = "gst-plugin-ndi";
  version = "0.15.3";

  src = fetchCrate {
    inherit pname version;
    hash = "sha256-w0bcR19WmBy6LYBCd6enZ2dFwOCNlNfdM/telaumv0s=";
  };

  cargoHash = "sha256-Bj5Tb8H+tQQeI0jcoC/zv3rynUlmlyMxeQ8J2YjT1UU=";

  nativeBuildInputs = [
    pkg-config
  ];

  buildInputs = [
    gst_all_1.gstreamer
    gst_all_1.gst-plugins-base
  ];

  buildFeatures = [ "capi" ];

  postInstall = ''
    mkdir -p $out/lib/gstreamer-1.0
    find target -name 'libgstndi.so' -exec cp {} $out/lib/gstreamer-1.0/ \;
  '';

  meta = {
    description = "GStreamer NDI source plugin";
    homepage = "https://gitlab.freedesktop.org/gstreamer/gst-plugins-rs";
    license = lib.licenses.mpl20;
    platforms = lib.platforms.linux;
  };
}
