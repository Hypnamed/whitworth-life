// Builds a data-URL SVG for a pin with up to 3 colored rings.
// categories: array of strings; CAT_COLORS: record<string, hex>
export function buildPinDataUrl(categories, CAT_COLORS) {
  // choose up to 3 colors; fallback to slate if missing
  const cols = (categories || [])
    .slice(0, 3)
    .map((c) => CAT_COLORS[c] || "#64748b");
  while (cols.length < 3) cols.push("transparent");

  // Simple Google-like pin with ring(s) around the dot
  const svg = `
<svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
  <!-- Pin shape -->
  <path d="M16 0C9.372 0 4 5.372 4 12c0 8.074 8.567 17.842 11.203 20.667a1.08 1.08 0 0 0 1.594 0C19.433 29.842 28 20.074 28 12 28 5.372 22.628 0 16 0z"
        fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
  <!-- Center dot background -->
  <circle cx="16" cy="12" r="6.5" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
  <!-- Rings for categories -->
  <circle cx="16" cy="12" r="8.5" fill="none" stroke="${cols[0]}" stroke-width="2.8"/>
  <circle cx="16" cy="12" r="10.8" fill="none" stroke="${cols[1]}" stroke-width="2.8" />
  <circle cx="16" cy="12" r="13.1" fill="none" stroke="${cols[2]}" stroke-width="2.8" />
</svg>`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Convenience: build a Google Maps Icon object
export function pinIcon(categories, CAT_COLORS) {
  const url = buildPinDataUrl(categories, CAT_COLORS);

  return {
    url,
    scaledSize: new google.maps.Size(40, 52), // bigger box than before
    anchor: new google.maps.Point(20, 50), // bottom center = (width/2, height-2)
    labelOrigin: new google.maps.Point(20, 16), // center of circle
  };
}
