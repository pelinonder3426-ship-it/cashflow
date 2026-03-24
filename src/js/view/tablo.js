import { formatCurrency } from '../utils/format.js';

export const renderTable = (sonuclar, config) => {
  const container = document.getElementById('table-container');
  if (!container) return;

  const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

  // Sütun başlıklarını belirle
  const gelirAdlari = ["Faiz Getirisi", ...config.gelirler.map(g => g.ad)];
  const giderAdlari = config.giderler.map(g => g.ad);
  const donemselAdlari = config.donemsel.map(d => d.ad);
  const yillikAdlari = config.yillik.map(y => y.ad);

  let html = `
    <div class="overflow-x-auto">
      <table class="w-full text-[10px] border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="sticky left-0 bg-gray-100 z-10 p-1 border border-gray-200 min-w-[60px]">Ay</th>
            <th class="p-1 border border-gray-200">Faiz %</th>
            ${gelirAdlari.map(n => `<th class="p-1 border border-gray-200 text-white bg-[#148c4f]">${n}</th>`).join('')}
            <th class="p-1 border border-gray-200 text-white bg-[#0a5c38]">Top. Gelir</th>
            ${giderAdlari.map(n => `<th class="p-1 border border-gray-200 text-white bg-[#c0392b]">${n}</th>`).join('')}
            ${donemselAdlari.map(n => `<th class="p-1 border border-gray-200 text-white bg-[#7b1fa2]">${n}</th>`).join('')}
            ${yillikAdlari.map(n => `<th class="p-1 border border-gray-200 text-white bg-[#e65100]">${n}</th>`).join('')}
            <th class="p-1 border border-gray-200 text-white bg-[#8b0000]">Top. Gider</th>
            <th class="p-1 border border-gray-200 text-white bg-[#1a237e]">Net</th>
            <th class="p-1 border border-gray-200 bg-gray-200">Bakiye</th>
          </tr>
        </thead>
        <tbody>
  `;

  sonuclar.forEach((s, i) => {
    const isYearChange = i > 0 && s.ay === 1;
    const isNegative = s.bitisBakiye < 0;
    const rowClass = `${isYearChange ? 'border-t-4 border-t-[#0d7a4a]' : ''} ${isNegative ? 'bg-[#fdf0f0]' : ''}`;

    html += `
      <tr class="${rowClass} hover:bg-gray-50">
        <td class="sticky left-0 bg-inherit z-10 p-1 border border-gray-200 font-bold">${months[s.ay - 1]} ${s.yil}</td>
        <td class="p-1 border border-gray-200 text-center text-gray-500">${s.faiz.toFixed(1)}</td>
        
        ${gelirAdlari.map(n => {
          const val = s.gelirler[n] || 0;
          return `<td class="p-1 border border-gray-200 text-right ${val === 0 ? 'text-[#ddd]' : ''}">${formatCurrency(val)}</td>`;
        }).join('')}
        
        <td class="p-1 border border-gray-200 text-right font-bold text-[#0a5c38]">${formatCurrency(s.toplamGelir)}</td>
        
        ${giderAdlari.map(n => {
          const val = s.giderler[n] || 0;
          return `<td class="p-1 border border-gray-200 text-right ${val === 0 ? 'text-[#ddd]' : ''}">${formatCurrency(val)}</td>`;
        }).join('')}

        ${donemselAdlari.map(n => {
          const val = s.giderler[n] || 0;
          const isAktif = val > 0;
          return `<td class="p-1 border border-gray-200 text-right ${isAktif ? 'bg-[#fce4ec]' : 'text-[#ddd]'}">${formatCurrency(val)}</td>`;
        }).join('')}

        ${yillikAdlari.map(n => {
          const val = s.giderler[n] || 0;
          const isAktif = val > 0;
          return `<td class="p-1 border border-gray-200 text-right ${isAktif ? 'bg-[#fff9c4]' : 'text-[#ddd]'}">${formatCurrency(val)}</td>`;
        }).join('')}

        <td class="p-1 border border-gray-200 text-right font-bold text-[#8b0000]">${formatCurrency(s.toplamGider)}</td>
        <td class="p-1 border border-gray-200 text-right font-bold text-[#1a237e]">${formatCurrency(s.netAkis)}</td>
        <td class="p-1 border border-gray-200 text-right font-bold ${s.bitisBakiye >= 0 ? 'text-gray-800' : 'text-red-600'}">${formatCurrency(s.bitisBakiye)}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;
};
