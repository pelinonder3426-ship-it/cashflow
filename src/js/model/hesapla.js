const hesaplaAylikFaiz = (bakiye, oran, stopaj) => {
  const aylikFaizOrani = (oran / 100) / 12;
  const brutGetiri = bakiye * aylikFaizOrani;
  return brutGetiri * (1 - stopaj / 100);
};

const hesaplaArtisliTutar = (tutar, artis, yilFarki) => {
  return tutar * Math.pow(1 + artis / 100, yilFarki);
};

const isGelirAktif = (ay, aylar) => {
  if (!aylar || typeof aylar !== 'string') return false;
  const val = aylar.trim().toLowerCase();
  if (val === "tum" || val === "tüm") return true;
  
  if (!val.includes("-")) return false;
  
  const parts = val.split("-");
  if (parts.length !== 2) return false;
  
  const bas = parseInt(parts[0]);
  const bit = parseInt(parts[1]);
  
  if (isNaN(bas) || isNaN(bit)) return false;

  if (bas <= bit) {
    return ay >= bas && ay <= bit;
  } else {
    return ay >= bas || ay <= bit;
  }
};

const isDonemselAktif = (ay, yil, d, temelYil) => {
  if (d.tekrar) {
    let diff = (ay - d.baslangic + 12) % 12;
    return diff < d.taksit;
  } else {
    const dStart = new Date(temelYil, d.baslangic - 1, 1);
    const current = new Date(yil, ay - 1, 1);
    const diffMonths = (current.getFullYear() - dStart.getFullYear()) * 12 + (current.getMonth() - dStart.getMonth());
    return diffMonths >= 0 && diffMonths < d.taksit;
  }
};

export const hesaplaProjeksiyon = (config) => {
  const { temel, faiz, gelirler, giderler, donemsel, yillik } = config;
  const sonuclar = [];
  let mevcutBakiye = temel.bakiye;
  let mevcutFaiz = faiz.oran;

  const baslangicTarihi = new Date(temel.yil, temel.ay - 1, 1);

  for (let i = 0; i < temel.sure; i++) {
    const tarih = new Date(baslangicTarihi.getFullYear(), baslangicTarihi.getMonth() + i, 1);
    const yil = tarih.getFullYear();
    const ay = tarih.getMonth() + 1;
    const yilFarki = yil - temel.yil;

    if (i > 0 && i % 2 === 0) {
      mevcutFaiz = Math.max(faiz.min, mevcutFaiz - faiz.dusus);
    }

    // Faiz Geliri Hesaplama
    const netFaizGetirisi = hesaplaAylikFaiz(mevcutBakiye, mevcutFaiz, faiz.stopaj);
    
    const ayGelirleri = { "Faiz Getirisi": netFaizGetirisi };
    let toplamGelir = netFaizGetirisi;

    // Sabit Gelirler
    gelirler.forEach(g => {
      if (isGelirAktif(ay, g.aylar)) {
        const tutar = hesaplaArtisliTutar(g.tutar, g.artis, yilFarki);
        toplamGelir += tutar;
        ayGelirleri[g.ad] = tutar;
      } else {
        ayGelirleri[g.ad] = 0;
      }
    });

    let toplamGider = 0;
    const ayGiderleri = {};

    // Sabit Giderler
    giderler.forEach(g => {
      const tutar = hesaplaArtisliTutar(g.tutar, g.artis, yilFarki);
      toplamGider += tutar;
      ayGiderleri[g.ad] = tutar;
    });

    // Dönemsel Giderler
    donemsel.forEach(d => {
      if (isDonemselAktif(ay, yil, d, temel.yil)) {
        const tutar = hesaplaArtisliTutar(d.tutar, d.artis, yilFarki);
        toplamGider += tutar;
        ayGiderleri[d.ad] = tutar;
      } else {
        ayGiderleri[d.ad] = 0;
      }
    });

    // Yıllık Giderler
    yillik.forEach(y => {
      if (ay === y.ay) {
        const tutar = hesaplaArtisliTutar(y.tutar, y.artis, yilFarki);
        toplamGider += tutar;
        ayGiderleri[y.ad] = tutar;
      } else {
        ayGiderleri[y.ad] = 0;
      }
    });

    const netAkis = toplamGelir - toplamGider;
    const oncekiBakiye = mevcutBakiye;
    mevcutBakiye += netAkis;

    sonuclar.push({
      index: i,
      yil,
      ay,
      faiz: mevcutFaiz,
      baslangicBakiye: oncekiBakiye,
      gelirler: ayGelirleri,
      giderler: ayGiderleri,
      toplamGelir,
      toplamGider,
      netAkis,
      bitisBakiye: mevcutBakiye
    });
  }

  return sonuclar;
};
