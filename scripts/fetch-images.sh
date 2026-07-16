#!/usr/bin/env bash
set -euo pipefail
BASE="https://www.stavbyprochazka.cz/wp-content/uploads/2025/07"
OUT="public/images"
mkdir -p "$OUT"

get() { curl -fsSL "$BASE/$1" -o "$OUT/$2" && echo "ok  $2"; }

get "Logo-PROCHAZKA.png" "logo.png"
for n in 01 02 03 04 05 06 07 08 09; do get "Pozemni-prace-Stavby-Prochazka-$n.jpg" "zemni-$n.jpg"; done
get "Zemni-prace-Prochazka-05.jpeg" "zemni-hero-a.jpg"
get "Zemni-prace-Prochazka-06.jpeg" "zemni-hero-b.jpg"
for n in 01 02 03 04 05 06; do get "Stavebni-prace-Stavby-Prochazka-$n.jpg" "stavebni-$n.jpg"; done
get "Stavebni-prace-B.jpeg" "stavebni-hero.jpg"
i=1; for n in 12 15 16 17 19 20 21 26 27; do printf -v p "%02d" "$i"; get "Sutove-kontejnery-Stavby-Prochazka-$n.jpg" "kontejner-$p.jpg"; i=$((i+1)); done

echo "Downloaded $(ls -1 "$OUT" | wc -l) files."
