#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
echo "KodBuster FOMO NEXT: http://127.0.0.1:8765/"
echo "Form submissions are disabled in preview mode."
python3 -m http.server 8765 --bind 127.0.0.1 --directory site
