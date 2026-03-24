import { formatCurrency } from '../utils/format.js';

export const renderCards = (sonuclar, temelBakiye) => {
  const container = document.getElementById('summary-cards');
  if (!container) return;

  const bitisBakiye = sonuclar[sonuclar.length - 1].bitisBakiye;
  const yesilAySayisi = sonuclar.filter(s => s.bitisBakiye > 0).length;
  
  const kritikAyObj = sonuclar.find(s => s.bitisBakiye < 0);
  const kritikAy = kritikAyObj ? `${kritikAyObj.ay}/${kritikAyObj.yil}` : "Yok";

  const toplamGelir = sonuclar.reduce((acc, s) => acc + s.toplamGelir, 0);
  const toplamGider = sonuclar.reduce((acc, s) => acc + s.toplamGider, 0);

  container.innerHTML = `
    <div class="card p-4 flex flex-col items-center justify-center text-center">
      <span class="text-[10px] uppercase text-gray-500 font-bold">Başlangıç Bakiye</span>
      <span class="text-lg font-extrabold text-gray-800">${formatCurrency(temelBakiye)} ₺</span>
    </div>
    <div class="card p-4 flex flex-col items-center justify-center text-center">
      <span class="text-[10px] uppercase text-gray-500 font-bold">Bitiş Bakiye</span>
      <span class="text-lg font-extrabold ${bitisBakiye >= 0 ? 'text-green-600' : 'text-red-600'}">${formatCurrency(bitisBakiye)} ₺</span>
    </div>
    <div class="card p-4 flex flex-col items-center justify-center text-center">
      <span class="text-[10px] uppercase text-gray-500 font-bold">Toplam Gelir (Faiz Dahil)</span>
      <span class="text-lg font-extrabold text-[#148c4f]">${formatCurrency(toplamGelir)} ₺</span>
    </div>
    <div class="card p-4 flex flex-col items-center justify-center text-center">
      <span class="text-[10px] uppercase text-gray-500 font-bold">Toplam Gider</span>
      <span class="text-lg font-extrabold text-[#c0392b]">${formatCurrency(toplamGider)} ₺</span>
    </div>
    <div class="card p-4 flex flex-col items-center justify-center text-center">
      <span class="text-[10px] uppercase text-gray-500 font-bold">Yeşil Ay Sayısı</span>
      <span class="text-lg font-extrabold text-blue-600">${yesilAySayisi} / ${sonuclar.length}</span>
    </div>
    <div class="card p-4 flex flex-col items-center justify-center text-center">
      <span class="text-[10px] uppercase text-gray-500 font-bold">Kritik Ay</span>
      <span class="text-lg font-extrabold ${kritikAy === 'Yok' ? 'text-green-600' : 'text-red-600'}">${kritikAy}</span>
    </div>
  `;
};

export const renderExtremes = (sonuclar) => {
  const container = document.getElementById('extreme-cards');
  if (!container) return;

  const maxBakiye = Math.max(...sonuclar.map(s => s.bitisBakiye));
  const minBakiye = Math.min(...sonuclar.map(s => s.bitisBakiye));

  container.innerHTML = `
    <div class="flex gap-4 mt-4">
      <div class="flex-1 bg-green-50 p-3 rounded-lg border border-green-100">
        <div class="text-[10px] text-green-700 font-bold uppercase">En Yüksek Bakiye</div>
        <div class="text-sm font-bold text-green-800">${formatCurrency(maxBakiye)} ₺</div>
      </div>
      <div class="flex-1 bg-red-50 p-3 rounded-lg border border-red-100">
        <div class="text-[10px] text-red-700 font-bold uppercase">En Düşük Bakiye</div>
        <div class="text-sm font-bold text-red-800">${formatCurrency(minBakiye)} ₺</div>
      </div>
    </div>
    ${minBakiye < 0 ? `
      <div class="mt-4 bg-red-600 text-white p-3 rounded-lg text-xs font-bold animate-pulse">
        ⚠️ DİKKAT: Projeksiyon süresince bakiyeniz negatife düşmektedir!
      </div>
    ` : ''}
  `;
};
