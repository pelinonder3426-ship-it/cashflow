export const formatCurrency = (val) => {
  if (val === 0) return "-";
  return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);
};

export const parseCurrency = (str) => {
  if (!str) return 0;
  // Remove dots (thousands separator) and replace comma if any
  const cleanStr = str.toString().replace(/\./g, '').replace(',', '.');
  const num = parseFloat(cleanStr);
  return isNaN(num) ? 0 : num;
};

export const formatDate = (year, month) => {
  const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  return `${months[month - 1]} ${year}`;
};
