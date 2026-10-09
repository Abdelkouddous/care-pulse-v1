#!/usr/bin/env bash
# Generate all VitalBook raster icons from the SVG masters. Run from repo root.
set -euo pipefail

OUT="${TMPDIR:-/tmp}/vitalbook-icons"
mkdir -p "$OUT"
ROUNDED=apps/web/public/favicon.svg

# Full-bleed square variant (iOS masks corners itself; also used for maskable/apple-touch).
sed -e 's/<rect width="1024" height="1024" rx="232"/<rect width="1024" height="1024"/' \
    -e '/stroke="#33CCCC"/d' "$ROUNDED" > "$OUT/fullbleed.svg"

sips -s format png "$ROUNDED"           --out "$OUT/rounded.png"   >/dev/null
sips -s format png "$OUT/fullbleed.svg" --out "$OUT/fullbleed.png" >/dev/null

png() { # png <src.png> <size> <dest>
  mkdir -p "$(dirname "$3")"
  sips -z "$2" "$2" "$1" --out "$3" >/dev/null
}
flatten() { # remove alpha (App Store rejects transparent iOS icons)
  sips -s format jpeg "$1" --out "$1.jpg" >/dev/null && sips -s format png "$1.jpg" --out "$1" >/dev/null && rm "$1.jpg"
}

# ---- Frontend (Next.js) ----
png "$OUT/rounded.png"   16  apps/web/public/favicon-16x16.png
png "$OUT/rounded.png"   32  apps/web/public/favicon-32x32.png
png "$OUT/fullbleed.png" 180 apps/web/public/apple-touch-icon.png
png "$OUT/rounded.png"   16  "$OUT/ico16.png"
png "$OUT/rounded.png"   32  "$OUT/ico32.png"
png "$OUT/rounded.png"   48  "$OUT/ico48.png"
/usr/bin/python3 - "$OUT" <<'PY'
import struct, sys, pathlib
out = pathlib.Path(sys.argv[1]); sizes = [16, 32, 48]
blobs = [(out / f"ico{s}.png").read_bytes() for s in sizes]
header = struct.pack("<HHH", 0, 1, len(sizes)); offset = 6 + 16 * len(sizes); entries = b""
for s, b in zip(sizes, blobs):
    entries += struct.pack("<BBBBHHII", s % 256, s % 256, 0, 0, 1, 32, len(b), offset); offset += len(b)
pathlib.Path("apps/web/app/favicon.ico").write_bytes(header + entries + b"".join(blobs))
PY

# ---- Android launcher ----
for pair in mdpi:48 hdpi:72 xhdpi:96 xxhdpi:144 xxxhdpi:192; do
  png "$OUT/rounded.png" "${pair#*:}" "apps/mobile/android/app/src/main/res/mipmap-${pair%%:*}/ic_launcher.png"
done

# ---- iOS AppIcon (opaque, full-bleed) ----
IOS=apps/mobile/ios/Runner/Assets.xcassets/AppIcon.appiconset
for spec in 20:1 20:2 20:3 29:1 29:2 29:3 40:1 40:2 40:3 60:2 60:3 76:1 76:2 83.5:2 1024:1; do
  pt="${spec%%:*}"; scale="${spec#*:}"
  px=$(/usr/bin/python3 -c "print(int(round($pt*$scale)))")
  f="$IOS/Icon-App-${pt}x${pt}@${scale}x.png"
  png "$OUT/fullbleed.png" "$px" "$f"; flatten "$f"
done

# ---- macOS AppIcon ----
for s in 16 32 64 128 256 512 1024; do
  png "$OUT/rounded.png" "$s" "apps/mobile/macos/Runner/Assets.xcassets/AppIcon.appiconset/app_icon_${s}.png"
done

# ---- Flutter web ----
png "$OUT/rounded.png"   32  apps/mobile/web/favicon.png
png "$OUT/rounded.png"   192 apps/mobile/web/icons/Icon-192.png
png "$OUT/rounded.png"   512 apps/mobile/web/icons/Icon-512.png
png "$OUT/fullbleed.png" 192 apps/mobile/web/icons/Icon-maskable-192.png
png "$OUT/fullbleed.png" 512 apps/mobile/web/icons/Icon-maskable-512.png

echo "Icons generated."
