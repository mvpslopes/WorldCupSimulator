const STORAGE_KEYS = {
  HISTORY: 'worldcup_history',
  TITLES: 'worldcup_titles',
  CURRENT_YEAR: 'worldcup_current_year',
};

export const getHistory = () => {
  const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
  return history ? JSON.parse(history) : [];
};

export const saveHistory = (history) => {
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
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
};

