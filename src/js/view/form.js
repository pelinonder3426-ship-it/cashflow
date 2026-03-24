import { formatCurrency, parseCurrency } from '../utils/format.js';

export const initForm = (config, onUpdate) => {
  renderTemel(config, onUpdate);
  renderFaiz(config, onUpdate);
  renderGelirler(config, onUpdate);
  renderGiderler(config, onUpdate);
  renderDonemsel(config, onUpdate);
  renderYillik(config, onUpdate);
};

const setupInput = (input, obj, key, onUpdate, isCurrency = false) => {
  if (isCurrency) {
    input.value = formatCurrency(obj[key]);
    input.addEventListener('focus', () => {
      input.value = obj[key] === 0 ? "" : obj[key];
    });
    input.addEventListener('blur', () => {
      obj[key] = parseCurrency(input.value);
      input.value = formatCurrency(obj[key]);
      onUpdate();
    });
  } else {
    input.value = obj[key];
    input.addEventListener('input', () => {
      const val = input.type === 'number' ? parseFloat(input.value) : input.value;
      obj[key] = isNaN(val) ? 0 : val;
      onUpdate();
    });
  }
};

const renderTemel = (config, onUpdate) => {
  const container = document.getElementById('form-temel');
  container.innerHTML = `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div>
        <label class="label">Başlangıç Bakiye (₺)</label>
        <input type="text" id="in-bakiye" class="input text-right font-bold">
      </div>
      <div>
        <label class="label">Başlangıç Yılı</label>
        <input type="number" id="in-yil" class="input">
      </div>
      <div>
        <label class="label">Başlangıç Ayı</label>
        <input type="number" id="in-ay" min="1" max="12" class="input">
      </div>
      <div>
        <label class="label">Süre (Ay)</label>
        <input type="number" id="in-sure" class="input">
      </div>
    </div>
  `;
  setupInput(document.getElementById('in-bakiye'), config.temel, 'bakiye', onUpdate, true);
  setupInput(document.getElementById('in-yil'), config.temel, 'yil', onUpdate);
  setupInput(document.getElementById('in-ay'), config.temel, 'ay', onUpdate);
  setupInput(document.getElementById('in-sure'), config.temel, 'sure', onUpdate);
};

const renderFaiz = (config, onUpdate) => {
  const container = document.getElementById('form-faiz');
  container.innerHTML = `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
      <div>
        <label class="label">Yıllık Faiz %</label>
        <input type="number" id="in-faiz-oran" step="0.1" class="input">
      </div>
      <div>
        <label class="label">2 Ayda Düşüş (Puan)</label>
        <input type="number" id="in-faiz-dusus" step="0.1" class="input">
      </div>
      <div>
        <label class="label">Min Faiz %</label>
        <input type="number" id="in-faiz-min" step="0.1" class="input">
      </div>
      <div>
        <label class="label">Stopaj %</label>
        <input type="number" id="in-faiz-stopaj" class="input">
      </div>
    </div>
  `;
  setupInput(document.getElementById('in-faiz-oran'), config.faiz, 'oran', onUpdate);
  setupInput(document.getElementById('in-faiz-dusus'), config.faiz, 'dusus', onUpdate);
  setupInput(document.getElementById('in-faiz-min'), config.faiz, 'min', onUpdate);
  setupInput(document.getElementById('in-faiz-stopaj'), config.faiz, 'stopaj', onUpdate);
};

const renderList = (id, title, items, columns, onAdd, onUpdate) => {
  const container = document.getElementById(id);
  let html = `
    <div class="mt-6">
      <h3 class="text-xs font-extrabold uppercase text-gray-400 mb-2 tracking-wider">${title}</h3>
      <div class="grid gap-1">
        <div class="grid grid-cols-[1fr_100px_80px_100px_30px] gap-2 px-2">
          ${columns.map(c => `<span class="label">${c}</span>`).join('')}
          <span></span>
        </div>
        <div id="${id}-items"></div>
        <button id="${id}-add" class="text-left text-[11px] font-bold text-[#10b068] hover:underline p-2">+ ${title} Ekle</button>
      </div>
    </div>
  `;
  container.innerHTML = html;

  const itemsContainer = document.getElementById(`${id}-items`);
  const renderItems = () => {
    itemsContainer.innerHTML = '';
    items.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = "grid grid-cols-[1fr_100px_80px_100px_30px] gap-2 items-center bg-white p-1 rounded hover:bg-gray-50";
      
      const fields = columns.map((col, cIdx) => {
        const input = document.createElement('input');
        input.className = "input text-xs";
        if (cIdx === 1) input.classList.add('text-right');
        
        const keys = Object.keys(item).filter(k => k !== 'id');
        const key = keys[cIdx];
        
        setupInput(input, item, key, onUpdate, cIdx === 1);
        return input;
      });

      fields.forEach(f => row.appendChild(f));

      const delBtn = document.createElement('button');
      delBtn.innerHTML = '✕';
      delBtn.className = "text-red-400 hover:text-red-600 font-bold text-sm";
      delBtn.onclick = () => {
        items.splice(idx, 1);
        onUpdate();
        renderItems();
      };
      row.appendChild(delBtn);
      itemsContainer.appendChild(row);
    });
  };

  document.getElementById(`${id}-add`).onclick = () => {
    onAdd();
    onUpdate();
    renderItems();
  };

  renderItems();
};

const renderGelirler = (config, onUpdate) => {
  renderList('form-gelirler', 'Sabit Gelirler', config.gelirler, ['Ad', 'Tutar (₺)', 'Artış %', 'Aktif Aylar'], () => {
    config.gelirler.push({ id: Date.now(), ad: "Yeni Gelir", tutar: 0, artis: 0, aylar: "tum" });
  }, onUpdate);
};

const renderGiderler = (config, onUpdate) => {
  // Giderlerin 4. sütunu yok, grid'i ayarla
  const id = 'form-giderler';
  const container = document.getElementById(id);
  container.innerHTML = `
    <div class="mt-6">
      <h3 class="text-xs font-extrabold uppercase text-gray-400 mb-2 tracking-wider">Sabit Giderler</h3>
      <div class="grid gap-1">
        <div class="grid grid-cols-[1fr_100px_80px_30px] gap-2 px-2">
          <span class="label">Ad</span>
          <span class="label">Tutar (₺)</span>
          <span class="label">Artış %</span>
          <span></span>
        </div>
        <div id="${id}-items"></div>
        <button id="${id}-add" class="text-left text-[11px] font-bold text-[#10b068] hover:underline p-2">+ Gider Ekle</button>
      </div>
    </div>
  `;

  const itemsContainer = document.getElementById(`${id}-items`);
  const renderItems = () => {
    itemsContainer.innerHTML = '';
    config.giderler.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = "grid grid-cols-[1fr_100px_80px_30px] gap-2 items-center bg-white p-1 rounded hover:bg-gray-50";
      
      const inAd = document.createElement('input'); inAd.className = "input text-xs";
      const inTutar = document.createElement('input'); inTutar.className = "input text-xs text-right";
      const inArtis = document.createElement('input'); inArtis.className = "input text-xs";
      
      setupInput(inAd, item, 'ad', onUpdate);
      setupInput(inTutar, item, 'tutar', onUpdate, true);
      setupInput(inArtis, item, 'artis', onUpdate);

      row.append(inAd, inTutar, inArtis);

      const delBtn = document.createElement('button');
      delBtn.innerHTML = '✕';
      delBtn.className = "text-red-400 hover:text-red-600 font-bold text-sm";
      delBtn.onclick = () => { config.giderler.splice(idx, 1); onUpdate(); renderItems(); };
      row.appendChild(delBtn);
      itemsContainer.appendChild(row);
    });
  };
  document.getElementById(`${id}-add`).onclick = () => {
    config.giderler.push({ id: Date.now(), ad: "Yeni Gider", tutar: 0, artis: 0 });
    onUpdate(); renderItems();
  };
  renderItems();
};

const renderDonemsel = (config, onUpdate) => {
  const id = 'form-donemsel';
  const container = document.getElementById(id);
  container.innerHTML = `
    <div class="mt-6">
      <h3 class="text-xs font-extrabold uppercase text-gray-400 mb-2 tracking-wider">Dönemsel Giderler</h3>
      <div class="grid gap-1">
        <div class="grid grid-cols-[1fr_80px_60px_60px_60px_60px_30px] gap-2 px-2">
          <span class="label">Ad</span>
          <span class="label">Tutar (₺)</span>
          <span class="label">Taksit</span>
          <span class="label">Ay</span>
          <span class="label">Artış %</span>
          <span class="label">Tekrar</span>
          <span></span>
        </div>
        <div id="${id}-items"></div>
        <button id="${id}-add" class="text-left text-[11px] font-bold text-[#10b068] hover:underline p-2">+ Dönemsel Ekle</button>
      </div>
    </div>
  `;

  const itemsContainer = document.getElementById(`${id}-items`);
  const renderItems = () => {
    itemsContainer.innerHTML = '';
    config.donemsel.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = "grid grid-cols-[1fr_80px_60px_60px_60px_60px_30px] gap-2 items-center bg-white p-1 rounded hover:bg-gray-50";
      
      const inAd = document.createElement('input'); inAd.className = "input text-xs";
      const inTutar = document.createElement('input'); inTutar.className = "input text-xs text-right";
      const inTaksit = document.createElement('input'); inTaksit.className = "input text-xs"; inTaksit.type="number";
      const inBas = document.createElement('input'); inBas.className = "input text-xs"; inBas.type="number";
      const inArtis = document.createElement('input'); inArtis.className = "input text-xs";
      const inTekrar = document.createElement('input'); inTekrar.type = "checkbox"; inTekrar.className = "w-4 h-4 mx-auto";
      
      setupInput(inAd, item, 'ad', onUpdate);
      setupInput(inTutar, item, 'tutar', onUpdate, true);
      setupInput(inTaksit, item, 'taksit', onUpdate);
      setupInput(inBas, item, 'baslangic', onUpdate);
      setupInput(inArtis, item, 'artis', onUpdate);
      
      inTekrar.checked = item.tekrar;
      inTekrar.onchange = () => { item.tekrar = inTekrar.checked; onUpdate(); };

      row.append(inAd, inTutar, inTaksit, inBas, inArtis, inTekrar);

      const delBtn = document.createElement('button');
      delBtn.innerHTML = '✕';
      delBtn.className = "text-red-400 hover:text-red-600 font-bold text-sm";
      delBtn.onclick = () => { config.donemsel.splice(idx, 1); onUpdate(); renderItems(); };
      row.appendChild(delBtn);
      itemsContainer.appendChild(row);
    });
  };
  document.getElementById(`${id}-add`).onclick = () => {
    config.donemsel.push({ id: Date.now(), ad: "Yeni Dönemsel", tutar: 0, taksit: 1, baslangic: 1, artis: 0, tekrar: false });
    onUpdate(); renderItems();
  };
  renderItems();
};

const renderYillik = (config, onUpdate) => {
  const id = 'form-yillik';
  const container = document.getElementById(id);
  container.innerHTML = `
    <div class="mt-6">
      <h3 class="text-xs font-extrabold uppercase text-gray-400 mb-2 tracking-wider">Yıllık Giderler</h3>
      <div class="grid gap-1">
        <div class="grid grid-cols-[1fr_100px_60px_80px_30px] gap-2 px-2">
          <span class="label">Ad</span>
          <span class="label">Tutar (₺)</span>
          <span class="label">Ay</span>
          <span class="label">Artış %</span>
          <span></span>
        </div>
        <div id="${id}-items"></div>
        <button id="${id}-add" class="text-left text-[11px] font-bold text-[#10b068] hover:underline p-2">+ Yıllık Ekle</button>
      </div>
    </div>
  `;

  const itemsContainer = document.getElementById(`${id}-items`);
  const renderItems = () => {
    itemsContainer.innerHTML = '';
    config.yillik.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = "grid grid-cols-[1fr_100px_60px_80px_30px] gap-2 items-center bg-white p-1 rounded hover:bg-gray-50";
      
      const inAd = document.createElement('input'); inAd.className = "input text-xs";
      const inTutar = document.createElement('input'); inTutar.className = "input text-xs text-right";
      const inAy = document.createElement('input'); inAy.className = "input text-xs"; inAy.type="number";
      const inArtis = document.createElement('input'); inArtis.className = "input text-xs";
      
      setupInput(inAd, item, 'ad', onUpdate);
      setupInput(inTutar, item, 'tutar', onUpdate, true);
      setupInput(inAy, item, 'ay', onUpdate);
      setupInput(inArtis, item, 'artis', onUpdate);

      row.append(inAd, inTutar, inAy, inArtis);

      const delBtn = document.createElement('button');
      delBtn.innerHTML = '✕';
      delBtn.className = "text-red-400 hover:text-red-600 font-bold text-sm";
      delBtn.onclick = () => { config.yillik.splice(idx, 1); onUpdate(); renderItems(); };
      row.appendChild(delBtn);
      itemsContainer.appendChild(row);
    });
  };
  document.getElementById(`${id}-add`).onclick = () => {
    config.yillik.push({ id: Date.now(), ad: "Yeni Yıllık", tutar: 0, ay: 1, artis: 0 });
    onUpdate(); renderItems();
  };
  renderItems();
};
