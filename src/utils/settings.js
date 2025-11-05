const SETTINGS_KEY = 'worldcup_settings';

export const getSettings = () => {
  const settings = localStorage.getItem(SETTINGS_KEY);
  return settings ? JSON.parse(settings) : {
    speed: 'normal', // 'fast', 'normal', 'detailed'
    favorites: []
  };
};

export const saveSettings = (settings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const updateSetting = (key, value) => {
  const settings = getSettings();
  settings[key] = value;
  saveSettings(settings);
};

export const addFavorite = (teamName) => {
  const settings = getSettings();
  if (!settings.favorites.includes(teamName)) {
    settings.favorites.push(teamName);
    saveSettings(settings);
  }
};

export const removeFavorite = (teamName) => {
  const settings = getSettings();
  settings.favorites = settings.favorites.filter(f => f !== teamName);
  saveSettings(settings);
};

export const isFavorite = (teamName) => {
  const settings = getSettings();
  return settings.favorites.includes(teamName);
};

