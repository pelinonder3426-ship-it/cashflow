export const getDemoData = () => ({
  temel: {
    bakiye: 1000000,
    yil: 2026,
    ay: 3,
    sure: 40
  },
  faiz: {
    oran: 37,
    dusus: 1.5,
    min: 15,
    stopaj: 20
  },
  gelirler: [
    { id: 1, ad: "Ali Maaş", tutar: 45000, artis: 25, aylar: "tum" },
    { id: 2, ad: "Ayşe Maaş", tutar: 35000, artis: 25, aylar: "tum" },
    { id: 3, ad: "Kira Geliri", tutar: 15000, artis: 20, aylar: "tum" },
    { id: 4, ad: "Ek Gelir", tutar: 5000, artis: 20, aylar: "10-5" }
  ],
  giderler: [
    { id: 1, ad: "Mutfak", tutar: 30000, artis: 35 },
    { id: 2, ad: "Aile Harcama", tutar: 25000, artis: 35 },
    { id: 3, ad: "Aidat", tutar: 2750, artis: 30 },
    { id: 4, ad: "Yakıt", tutar: 3000, artis: 30 },
    { id: 5, ad: "Kredi Kartı", tutar: 20000, artis: 35 },
    { id: 6, ad: "Kira", tutar: 12000, artis: 30 }
  ],
  donemsel: [
    { id: 1, ad: "Okul Ücreti", tutar: 95000, taksit: 5, baslangic: 9, artis: 30, tekrar: true },
    { id: 2, ad: "Yurt Güz", tutar: 50000, taksit: 6, baslangic: 9, artis: 20, tekrar: true },
    { id: 3, ad: "Yurt Bahar", tutar: 55000, taksit: 4, baslangic: 3, artis: 20, tekrar: true }
  ],
  yillik: [
    { id: 1, ad: "MTV", tutar: 15000, ay: 1, artis: 30 },
    { id: 2, ad: "Araba Sigorta", tutar: 20000, ay: 1, artis: 30 },
    { id: 3, ad: "Araba Bakım", tutar: 15000, ay: 7, artis: 25 },
    { id: 4, ad: "Gelir Vergisi", tutar: 25000, ay: 3, artis: 25 }
  ]
});

export const getEmptyConfig = () => {
  const now = new Date();
  return {
    temel: {
      bakiye: 0,
      yil: now.getFullYear(),
      ay: now.getMonth() + 1,
      sure: 12
    },
    faiz: {
      oran: 0,
      dusus: 0,
      min: 0,
      stopaj: 0
    },
    gelirler: [],
    giderler: [],
    donemsel: [],
    yillik: []
  };
};
