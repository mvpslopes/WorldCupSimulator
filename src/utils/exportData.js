// Exporta histórico como JSON
export const exportAsJSON = (history) => {
  const dataStr = JSON.stringify(history, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `worldcup-history-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

// Exporta histórico como CSV
export const exportAsCSV = (history) => {
  const headers = ['Ano', 'Campeão', 'Vice', 'Gols do Campeão'];
  const rows = history.map(cup => [
    cup.year,
    cup.champion.name,
    cup.runnerUp.name,
    cup.championGoals
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = `worldcup-history-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

// Exporta estatísticas completas
export const exportFullStats = (history, titles) => {
  const data = {
    history,
    titles,
    exportDate: new Date().toISOString(),
    totalCups: history.length
  };
  
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `worldcup-full-stats-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

