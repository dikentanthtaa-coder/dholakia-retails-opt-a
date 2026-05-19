#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# optimize-videos.sh — shrink the public/media/**/*.mp4 hero/background loops.
#
# Why this exists
#   The site ships ~78 MB of video in public/. On Slow 3G that's hours of
#   download; even on fast 4G it dominates LCP and TTI. This script
#   re-encodes each .mp4 in place (with a .bak/ backup) to:
#     • 1920x1080 max (downscales 4K → 1080p; phones never see >1280px anyway)
#     • H.264 high profile, CRF 26 (visually transparent for muted loops)
#     • +faststart so the moov atom is at the front of the file → the
#       browser can begin decoding after a small range request instead of
#       waiting for the whole file
#     • No audio track (hero loops are muted — drop ~64–128 kbps for free)
#   Optional WebM/VP9 sibling is emitted for ~25–35% extra savings on
#   browsers that support it (we serve via <source type="video/webm"> in
#   HeroVideo and LazyBackgroundVideo).
#
# Requirements
#   • ffmpeg ≥ 4.4 on PATH (brew install ffmpeg)
#
# Usage
#   chmod +x scripts/optimize-videos.sh
#   ./scripts/optimize-videos.sh                 # all .mp4 under public/media
#   ./scripts/optimize-videos.sh path/to/x.mp4   # one file
#   WEBM=1 ./scripts/optimize-videos.sh          # also emit .webm sibling
#
# Safety
#   Original files are moved to public/media/_originals/ before re-encoding.
#   Re-running is idempotent (skips files already smaller than the threshold).
# ──────────────────────────────────────────────────────────────────────────────

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MEDIA_DIR="${ROOT_DIR}/public/media"
BACKUP_DIR="${MEDIA_DIR}/_originals"

# Files smaller than this (in bytes) are left alone — already optimised.
SIZE_THRESHOLD=1500000   # 1.5 MB

# H.264 quality (lower = better, larger; 23 default, 26 = good for muted loops)
CRF="${CRF:-26}"
# Max width — we never display above this even on 4K screens.
MAX_W="${MAX_W:-1920}"
# Emit VP9 .webm sibling? Slower to encode but smaller. Off by default.
WEBM="${WEBM:-0}"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "error: ffmpeg not found. Install with: brew install ffmpeg" >&2
  exit 1
fi

mkdir -p "${BACKUP_DIR}"

# Collect targets (passed arg or all .mp4 under public/media, excluding _originals).
targets=()
if [[ $# -gt 0 ]]; then
  targets=("$@")
else
  while IFS= read -r -d '' f; do
    targets+=("$f")
  done < <(find "${MEDIA_DIR}" -type f -name "*.mp4" ! -path "${BACKUP_DIR}/*" -print0)
fi

if [[ ${#targets[@]} -eq 0 ]]; then
  echo "No .mp4 files found under ${MEDIA_DIR}"
  exit 0
fi

before_total=0
after_total=0

for src in "${targets[@]}"; do
  if [[ ! -f "${src}" ]]; then
    echo "skip (missing): ${src}"
    continue
  fi

  src_size=$(stat -f%z "${src}" 2>/dev/null || stat -c%s "${src}")
  if [[ "${src_size}" -lt "${SIZE_THRESHOLD}" ]]; then
    echo "skip (≤ ${SIZE_THRESHOLD}B already): ${src} (${src_size} bytes)"
    continue
  fi

  rel="${src#${MEDIA_DIR}/}"
  backup="${BACKUP_DIR}/${rel}"
  mkdir -p "$(dirname "${backup}")"

  # Keep one backup; if backup already exists, the previous run owns the
  # original — don't overwrite it with the (already re-encoded) current file.
  if [[ ! -f "${backup}" ]]; then
    cp "${src}" "${backup}"
  fi

  tmp_out="${src}.tmp.mp4"

  echo ""
  echo "→ Encoding: ${rel}"
  ffmpeg -hide_banner -loglevel warning -y \
    -i "${backup}" \
    -an \
    -vf "scale='min(${MAX_W},iw)':-2:flags=lanczos" \
    -c:v libx264 -profile:v high -level 4.1 \
    -preset slow -crf "${CRF}" \
    -pix_fmt yuv420p \
    -movflags +faststart \
    "${tmp_out}"

  mv "${tmp_out}" "${src}"
  new_size=$(stat -f%z "${src}" 2>/dev/null || stat -c%s "${src}")

  printf "   %s → %s (%.1f%% smaller)\n" \
    "$(numfmt --to=iec --suffix=B ${src_size} 2>/dev/null || echo ${src_size})" \
    "$(numfmt --to=iec --suffix=B ${new_size} 2>/dev/null || echo ${new_size})" \
    "$(awk "BEGIN { printf \"%.1f\", (1 - ${new_size}/${src_size}) * 100 }")"

  before_total=$((before_total + src_size))
  after_total=$((after_total + new_size))

  if [[ "${WEBM}" == "1" ]]; then
    webm_out="${src%.mp4}.webm"
    echo "   + WebM/VP9 sibling"
    ffmpeg -hide_banner -loglevel warning -y \
      -i "${backup}" \
      -an \
      -vf "scale='min(${MAX_W},iw)':-2:flags=lanczos" \
      -c:v libvpx-vp9 -crf 34 -b:v 0 \
      -row-mt 1 -deadline good -cpu-used 2 \
      "${webm_out}"
  fi
done

if [[ "${before_total}" -gt 0 ]]; then
  echo ""
  echo "──────────────────────────────────────────────"
  printf "Total: %s → %s (%.1f%% saved)\n" \
    "$(numfmt --to=iec --suffix=B ${before_total} 2>/dev/null || echo ${before_total})" \
    "$(numfmt --to=iec --suffix=B ${after_total} 2>/dev/null || echo ${after_total})" \
    "$(awk "BEGIN { printf \"%.1f\", (1 - ${after_total}/${before_total}) * 100 }")"
  echo "Originals: ${BACKUP_DIR}"
fi
