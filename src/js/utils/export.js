export const exportToCSV = (data, filename) => {
  if (!data || !data.length) return;

  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(header => row[header]).join('\t'));
  const csvContent = [headers.join('\t'), ...rows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename || "nakit_akisi.csv");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "senaryo.json";
  link.click();
  URL.revokeObjectURL(url);
};
