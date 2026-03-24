import { getDemoData, getEmptyConfig } from '../model/config.js';
import { saveScenario, loadScenario, deleteScenario, listScenarios, getLastScenarioName } from '../model/storage.js';
import { hesaplaProjeksiyon } from '../model/hesapla.js';
import { initForm } from '../view/form.js';
import { renderCards, renderExtremes } from '../view/kartlar.js';
import { renderTable } from '../view/tablo.js';
import { drawChart } from '../view/grafik.js';
import { exportToCSV, downloadJSON } from '../utils/export.js';

let currentConfig = getDemoData();
let currentScenarioName = "Baz";

const showBanner = (msg, type = 'success') => {
  const banner = document.getElementById('banner');
  banner.textContent = msg;
  banner.className = `fixed top-0 left-0 w-full p-3 text-center text-white font-bold z-[100] transition-transform duration-300 ${type === 'success' ? 'bg-[#27ae60]' : 'bg-[#e74c3c]'}`;
  banner.style.transform = 'translateY(0)';
  setTimeout(() => {
    banner.style.transform = 'translateY(-100%)';
  }, 3000);
};

const showModal = (title, content, onConfirm) => {
  const overlay = document.getElementById('modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const confirmBtn = document.getElementById('modal-confirm');
  const cancelBtn = document.getElementById('modal-cancel');

  modalTitle.textContent = title;
  modalBody.innerHTML = content;
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');

  const close = () => {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
  };

  confirmBtn.onclick = () => {
    onConfirm();
    close();
  };
  cancelBtn.onclick = close;
  overlay.onclick = (e) => { if (e.target === overlay) close(); };
};

const updateAll = () => {
  const sonuclar = hesaplaProjeksiyon(currentConfig);
  renderCards(sonuclar, currentConfig.temel.bakiye);
  renderExtremes(sonuclar);
  renderTable(sonuclar, currentConfig);
  drawChart(sonuclar);
};

const switchTab = (tab) => {
  const btnVeri = document.getElementById('tab-veri');
  const btnSonuc = document.getElementById('tab-sonuc');
  const contentVeri = document.getElementById('content-veri');
  const contentSonuc = document.getElementById('content-sonuc');

  if (tab === 'veri') {
    btnVeri.classList.add('bg-white', 'text-[#0d7a4a]', 'shadow-sm');
    btnSonuc.classList.remove('bg-white', 'text-[#0d7a4a]', 'shadow-sm');
    contentVeri.classList.remove('hidden');
    contentSonuc.classList.add('hidden');
  } else {
    btnSonuc.classList.add('bg-white', 'text-[#0d7a4a]', 'shadow-sm');
    btnVeri.classList.remove('bg-white', 'text-[#0d7a4a]', 'shadow-sm');
    contentSonuc.classList.remove('hidden');
    contentVeri.classList.add('hidden');
    updateAll();
  }
};

const updateScenarioList = () => {
  const select = document.getElementById('scenario-select');
  const scenarios = listScenarios();
  if (!scenarios.includes("Baz")) scenarios.unshift("Baz");
  
  select.innerHTML = scenarios.map(s => `<option value="${s}" ${s === currentScenarioName ? 'selected' : ''}>${s}</option>`).join('');
};

const init = () => {
  currentScenarioName = getLastScenarioName();
  const saved = loadScenario(currentScenarioName);
  if (saved) currentConfig = saved;

  updateScenarioList();
  initForm(currentConfig, updateAll);
  updateAll();

  // Tab Events
  document.getElementById('tab-veri').onclick = () => switchTab('veri');
  document.getElementById('tab-sonuc').onclick = () => switchTab('sonuc');
  document.getElementById('btn-goto-sonuc').onclick = () => switchTab('sonuc');
  document.getElementById('btn-goto-veri').onclick = () => switchTab('veri');

  // Scenario Events
  document.getElementById('scenario-select').onchange = (e) => {
    currentScenarioName = e.target.value;
    const cfg = loadScenario(currentScenarioName);
    if (cfg) {
      currentConfig = cfg;
      initForm(currentConfig, updateAll);
      updateAll();
      showBanner(`${currentScenarioName} senaryosu yüklendi.`);
    }
  };

  document.getElementById('btn-save').onclick = () => {
    saveScenario(currentScenarioName, currentConfig);
    showBanner("Senaryo kaydedildi.");
  };

  document.getElementById('btn-save-as').onclick = () => {
    showModal("Farklı Kaydet", `
      <p class="text-sm text-gray-600 mb-2">Yeni senaryo adını girin:</p>
      <input type="text" id="new-scenario-name" class="input w-full" placeholder="Örn: İyimser">
    `, () => {
      const name = document.getElementById('new-scenario-name').value.trim();
      if (name) {
        currentScenarioName = name;
        saveScenario(name, currentConfig);
        updateScenarioList();
        showBanner(`"${name}" olarak kaydedildi.`);
      }
    });
  };

  document.getElementById('btn-delete').onclick = () => {
    if (currentScenarioName === "Baz") {
      showBanner("Baz senaryosu silinemez.", "error");
      return;
    }
    showModal("Senaryoyu Sil", `<p><b>${currentScenarioName}</b> senaryosunu silmek istediğinize emin misiniz?</p>`, () => {
      deleteScenario(currentScenarioName);
      currentScenarioName = "Baz";
      currentConfig = loadScenario("Baz") || getDemoData();
      updateScenarioList();
      initForm(currentConfig, updateAll);
      updateAll();
      showBanner("Senaryo silindi.");
    });
  };

  document.getElementById('btn-export-json').onclick = () => {
    downloadJSON({ ad: currentScenarioName, cfg: currentConfig }, `${currentScenarioName}_senaryo.json`);
  };

  document.getElementById('btn-import-json').onclick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (re) => {
        try {
          const data = JSON.parse(re.target.result);
          if (data.cfg) {
            currentConfig = data.cfg;
            currentScenarioName = data.ad || "İçe Aktarılan";
            saveScenario(currentScenarioName, currentConfig);
            updateScenarioList();
            initForm(currentConfig, updateAll);
            updateAll();
            showBanner("Senaryo başarıyla yüklendi.");
          }
        } catch (err) {
          showBanner("Geçersiz dosya formatı.", "error");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Bottom Buttons
  document.getElementById('btn-demo').onclick = () => {
    showModal("Demo Verileri Yükle", "<p>Mevcut verileriniz silinecek ve demo verileri yüklenecek. Onaylıyor musunuz?</p>", () => {
      currentConfig = getDemoData();
      initForm(currentConfig, updateAll);
      updateAll();
      showBanner("Demo verileri yüklendi.");
    });
  };

  document.getElementById('btn-clear').onclick = () => {
    showModal("Tüm Verileri Sil", "<p>Tüm girişleriniz sıfırlanacak. Bu işlem geri alınamaz. Onaylıyor musunuz?</p>", () => {
      currentConfig = getEmptyConfig();
      initForm(currentConfig, updateAll);
      updateAll();
      showBanner("Tüm veriler temizlendi.");
    });
  };

  document.getElementById('btn-export-csv').onclick = () => {
    const sonuclar = hesaplaProjeksiyon(currentConfig);
    const exportData = sonuclar.map(s => ({
      Ay: `${s.ay}/${s.yil}`,
      "Faiz %": s.faiz.toFixed(2),
      "Başlangıç Bakiye": s.baslangicBakiye.toFixed(0),
      "Toplam Gelir": s.toplamGelir.toFixed(0),
      "Toplam Gider": s.toplamGider.toFixed(0),
      Net: s.netAkis.toFixed(0),
      Bakiye: s.bitisBakiye.toFixed(0)
    }));
    exportToCSV(exportData, `Nakit_Akisi_${currentScenarioName}.csv`);
    showBanner("Excel dosyası indiriliyor...");
  };
};

window.onload = init;
window.onresize = () => drawChart(hesaplaProjeksiyon(currentConfig));
