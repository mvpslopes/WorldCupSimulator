const STORAGE_KEYS = {
  HISTORY: 'worldcup_history',
  TITLES: 'worldcup_titles',
  CURRENT_YEAR: 'worldcup_current_year',
  DETAILED_DATA: 'worldcup_detailed_data', // Dados completos separados
  USE_FILE_STORAGE: 'worldcup_use_file_storage', // Preferência de usar arquivo
};

// Limita o tamanho do histórico mantendo apenas os últimos N registros
const MAX_HISTORY_ITEMS = 50; // Reduzido para evitar problemas de quota

// Função para otimizar dados antes de salvar (remove dados detalhados)
const optimizeHistoryEntry = (entry) => {
  return {
    year: entry.year,
    champion: entry.champion ? {
      name: entry.champion.name,
      rating: entry.champion.rating
    } : null,
    runnerUp: entry.runnerUp ? {
      name: entry.runnerUp.name,
      rating: entry.runnerUp.rating
    } : null,
    championGoals: entry.championGoals || 0,
    // Mantém apenas um resumo dos qualificados (sem dados completos)
    qualifiedTeams: entry.qualifiersData?.qualified?.map(t => ({
      name: t.name,
      rating: t.rating,
      confederation: t.confederation
    })) || []
  };
};

// Função para salvar dados detalhados separadamente (opcional)
const saveDetailedData = (year, fullData, qualifiersData) => {
  try {
    const detailed = JSON.parse(localStorage.getItem(STORAGE_KEYS.DETAILED_DATA) || '{}');
    detailed[year] = {
      fullData,
      qualifiersData,
      timestamp: Date.now()
    };
    
    // Limita a 50 registros detalhados mais recentes
    const entries = Object.entries(detailed)
      .sort((a, b) => b[1].timestamp - a[1].timestamp)
      .slice(0, 50);
    
    const limitedDetailed = Object.fromEntries(entries);
    localStorage.setItem(STORAGE_KEYS.DETAILED_DATA, JSON.stringify(limitedDetailed));
  } catch (error) {
    console.warn('Não foi possível salvar dados detalhados:', error);
  }
};

export const getHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Erro ao ler histórico:', error);
    return [];
  }
};

export const saveHistory = async (history) => {
  try {
    const useFileStorage = localStorage.getItem(STORAGE_KEYS.USE_FILE_STORAGE) === 'true';
    
    // Otimiza cada entrada do histórico
    const optimized = history.map(entry => optimizeHistoryEntry(entry));
    
    // Se usar arquivo, salva tudo (sem limite de tamanho)
    // Mas durante simulação em massa, não pede confirmação a cada copa
    if (useFileStorage) {
      // Durante simulação em massa, apenas salva no localStorage e deixa salvar arquivo depois
      // Isso evita travar esperando confirmação do usuário
      const dataStr = JSON.stringify(optimized);
      if (new Blob([dataStr]).size < 4 * 1024 * 1024) {
        localStorage.setItem(STORAGE_KEYS.HISTORY, dataStr);
      } else {
        // Se muito grande, mantém apenas os últimos no localStorage
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(optimized.slice(-20)));
      }
      return;
    }
    
    // Fallback para localStorage (com otimização)
    // Limpa dados detalhados antigos primeiro (sem await para não bloquear)
    try {
      cleanOldDetailedData(7);
    } catch (e) {
      // Ignora erro na limpeza
    }
    
    // Limita o tamanho do histórico (reduzido para 50 para garantir espaço)
    let limited = optimized.slice(-50);
    
    // Tenta salvar com tamanho progressivamente menor se necessário
    let dataStr = JSON.stringify(limited);
    let size = new Blob([dataStr]).size;
    
    // Se ainda for muito grande, reduz ainda mais
    if (size > 2 * 1024 * 1024) { // 2MB
      limited = optimized.slice(-30);
      dataStr = JSON.stringify(limited);
      size = new Blob([dataStr]).size;
    }
    
    if (size > 1 * 1024 * 1024) { // 1MB
      limited = optimized.slice(-20);
      dataStr = JSON.stringify(limited);
      size = new Blob([dataStr]).size;
    }
    
    if (size > 500 * 1024) { // 500KB
      limited = optimized.slice(-10);
      dataStr = JSON.stringify(limited);
    }
    
    // Tenta salvar
    localStorage.setItem(STORAGE_KEYS.HISTORY, dataStr);
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      // Limpa tudo e tenta novamente com apenas os últimos 10
      try {
        localStorage.removeItem(STORAGE_KEYS.DETAILED_DATA);
        const minimal = history.slice(-10).map(entry => optimizeHistoryEntry(entry));
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(minimal));
        console.warn('Limite de armazenamento excedido, mantendo apenas os últimos 10 registros e limpando dados detalhados');
      } catch (e) {
        // Se ainda falhar, mantém apenas os últimos 5
        try {
          const ultraMinimal = history.slice(-5).map(entry => optimizeHistoryEntry(entry));
          localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(ultraMinimal));
          console.warn('Armazenamento crítico, mantendo apenas os últimos 5 registros');
        } catch (finalError) {
          console.error('Não foi possível salvar histórico. Use salvamento em arquivo nas configurações.');
        }
      }
    } else {
      console.error('Erro ao salvar histórico:', error);
    }
  }
};

// Função auxiliar para obter todos os dados detalhados
export const getAllDetailedData = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DETAILED_DATA) || '{}');
  } catch {
    return {};
  }
};

// Salva histórico completo (otimizado) com dados detalhados separados
export const saveHistoryWithDetails = (history, fullData, qualifiersData, year) => {
  // Salva dados básicos otimizados
  saveHistory(history);
  
  // Salva dados detalhados separadamente (opcional, pode falhar silenciosamente)
  if (fullData && qualifiersData) {
    saveDetailedData(year, fullData, qualifiersData);
  }
};

// Recupera dados detalhados de um ano específico
export const getDetailedData = (year) => {
  try {
    const detailed = JSON.parse(localStorage.getItem(STORAGE_KEYS.DETAILED_DATA) || '{}');
    return detailed[year] || null;
  } catch (error) {
    console.error('Erro ao ler dados detalhados:', error);
    return null;
  }
};

export const getTitles = () => {
  const titles = localStorage.getItem(STORAGE_KEYS.TITLES);
  return titles ? JSON.parse(titles) : {};
};

export const saveTitles = (titles) => {
  localStorage.setItem(STORAGE_KEYS.TITLES, JSON.stringify(titles));
};

export const getCurrentYear = () => {
  const year = localStorage.getItem(STORAGE_KEYS.CURRENT_YEAR);
  return year ? parseInt(year) : 1930;
};

export const saveCurrentYear = (year) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_YEAR, year.toString());
};

export const resetAll = () => {
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
  localStorage.removeItem(STORAGE_KEYS.TITLES);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_YEAR);
  localStorage.removeItem(STORAGE_KEYS.DETAILED_DATA);
};

// Limpa dados detalhados antigos (mantém apenas os últimos N dias)
export const cleanOldDetailedData = (keepDays = 7) => {
  try {
    const detailed = JSON.parse(localStorage.getItem(STORAGE_KEYS.DETAILED_DATA) || '{}');
    const cutoff = Date.now() - (keepDays * 24 * 60 * 60 * 1000);
    
    const cleaned = Object.fromEntries(
      Object.entries(detailed).filter(([_, data]) => data.timestamp > cutoff)
    );
    
    localStorage.setItem(STORAGE_KEYS.DETAILED_DATA, JSON.stringify(cleaned));
  } catch (error) {
    console.error('Erro ao limpar dados antigos:', error);
  }
};

// Configura uso de arquivo
export const setUseFileStorage = (useFile) => {
  localStorage.setItem(STORAGE_KEYS.USE_FILE_STORAGE, useFile ? 'true' : 'false');
};

export const getUseFileStorage = () => {
  return localStorage.getItem(STORAGE_KEYS.USE_FILE_STORAGE) === 'true';
};

// Carrega dados do arquivo
export const loadFromFile = async () => {
  try {
    const { loadFromDisk } = await import('./fileStorage');
    const data = await loadFromDisk();
    
    if (data.history) {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(data.history));
    }
    if (data.titles) {
      localStorage.setItem(STORAGE_KEYS.TITLES, JSON.stringify(data.titles));
    }
    if (data.currentYear) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_YEAR, data.currentYear.toString());
    }
    if (data.detailedData) {
      localStorage.setItem(STORAGE_KEYS.DETAILED_DATA, JSON.stringify(data.detailedData));
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao carregar do arquivo:', error);
    throw error;
  }
};

