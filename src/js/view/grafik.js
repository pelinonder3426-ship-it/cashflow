export const drawChart = (sonuclar) => {
  const container = document.getElementById('chart-container');
  if (!container) return;

  const width = container.clientWidth || 800;
  const height = 300;
  const padding = 40;

  const bakiyeler = sonuclar.map(s => s.bitisBakiye);
  const maxVal = Math.max(...bakiyeler, 0);
  const minVal = Math.min(...bakiyeler, 0);
  const range = maxVal - minVal || 1;

  const getX = (i) => padding + (i / (sonuclar.length - 1)) * (width - 2 * padding);
  const getY = (v) => height - padding - ((v - minVal) / range) * (height - 2 * padding);

  const points = sonuclar.map((s, i) => `${getX(i)},${getY(s.bitisBakiye)}`).join(' ');
  
  const zeroY = getY(0);

  let svg = `
    <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" class="overflow-visible">
      <!-- Sıfır Çizgisi -->
      <line x1="${padding}" y1="${zeroY}" x2="${width - padding}" y2="${zeroY}" stroke="#e74c3c" stroke-width="1" stroke-dasharray="4,4" />
      
      <!-- Ana Çizgi -->
      <polyline points="${points}" fill="none" stroke="#10b068" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
      
      <!-- Noktalar -->
      ${sonuclar.map((s, i) => `
        <circle cx="${getX(i)}" cy="${getY(s.bitisBakiye)}" r="3" fill="${s.bitisBakiye >= 0 ? '#10b068' : '#e74c3c'}" />
      `).join('')}

      <!-- Eksen Etiketleri (Basit) -->
      <text x="${padding}" y="${height - 5}" font-size="10" fill="#888">${sonuclar[0].ay}/${sonuclar[0].yil}</text>
      <text x="${width - padding}" y="${height - 5}" font-size="10" fill="#888" text-anchor="end">${sonuclar[sonuclar.length - 1].ay}/${sonuclar[sonuclar.length - 1].yil}</text>
    </svg>
  `;

  container.innerHTML = svg;
};
