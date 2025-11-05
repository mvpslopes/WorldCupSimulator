import { useState } from 'react';
import { motion } from 'framer-motion';
import { getHistory, getTitles } from '../utils/storage';
import { getSettings, updateSetting, addFavorite, removeFavorite, isFavorite } from '../utils/settings';
import { exportAsJSON, exportAsCSV, exportFullStats } from '../utils/exportData';
import { teams } from '../teams';
import { getFlagImageUrl } from '../utils/flags';

const SettingsPanel = ({ onClose }) => {
  const [settings, setSettings] = useState(getSettings());
  const [activeTab, setActiveTab] = useState('speed'); // speed, favorites, export

  const handleSpeedChange = (speed) => {
    updateSetting('speed', speed);
    setSettings({ ...settings, speed });
  };

  const handleFavoriteToggle = (teamName) => {
    if (isFavorite(teamName)) {
      removeFavorite(teamName);
    } else {
      addFavorite(teamName);
    }
    setSettings(getSettings());
  };

  const handleExportJSON = () => {
    const history = getHistory();
    exportAsJSON(history);
  };

  const handleExportCSV = () => {
    const history = getHistory();
    exportAsCSV(history);
  };

  const handleExportFull = () => {
    const history = getHistory();
    const titles = getTitles();
    exportFullStats(history, titles);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
      >
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-yellow-400">⚙️ Configurações</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 p-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('speed')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'speed'
                ? 'bg-yellow-400 text-black'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            ⚡ Velocidade
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'favorites'
                ? 'bg-yellow-400 text-black'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            ⭐ Favoritos
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'export'
                ? 'bg-yellow-400 text-black'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            💾 Exportar
          </button>
        </div>

        <div className="p-6">
          {/* Velocidade */}
          {activeTab === 'speed' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Velocidade de Simulação</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleSpeedChange('fast')}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    settings.speed === 'fast'
                      ? 'border-yellow-400 bg-yellow-400/20'
                      : 'border-gray-700 bg-gray-700/50 hover:border-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-bold text-lg">⚡ Rápido</p>
                      <p className="text-gray-400 text-sm">Pula animações e mostra resultado direto</p>
                    </div>
                    {settings.speed === 'fast' && <span className="text-yellow-400">✓</span>}
                  </div>
                </button>

                <button
                  onClick={() => handleSpeedChange('normal')}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    settings.speed === 'normal'
                      ? 'border-yellow-400 bg-yellow-400/20'
                      : 'border-gray-700 bg-gray-700/50 hover:border-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-bold text-lg">▶️ Normal</p>
                      <p className="text-gray-400 text-sm">Velocidade padrão com animações</p>
                    </div>
                    {settings.speed === 'normal' && <span className="text-yellow-400">✓</span>}
                  </div>
                </button>

                <button
                  onClick={() => handleSpeedChange('detailed')}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    settings.speed === 'detailed'
                      ? 'border-yellow-400 bg-yellow-400/20'
                      : 'border-gray-700 bg-gray-700/50 hover:border-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-bold text-lg">🐌 Detalhado</p>
                      <p className="text-gray-400 text-sm">Animações mais lentas e detalhadas</p>
                    </div>
                    {settings.speed === 'detailed' && <span className="text-yellow-400">✓</span>}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Favoritos */}
          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Seleções Favoritas</h3>
              <p className="text-gray-400 text-sm mb-4">Marque suas seleções favoritas para acompanhar melhor</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {teams.map(team => (
                  <button
                    key={team.name}
                    onClick={() => handleFavoriteToggle(team.name)}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                      isFavorite(team.name)
                        ? 'border-yellow-400 bg-yellow-400/20'
                        : 'border-gray-700 bg-gray-700/50 hover:border-gray-600'
                    }`}
                  >
                    <img 
                      src={getFlagImageUrl(team.name, 'w20')} 
                      alt={team.name}
                      className="w-5 h-3.5 object-cover border border-gray-300 rounded"
                    />
                    <span className="text-white text-sm font-semibold">{team.name}</span>
                    {isFavorite(team.name) && <span className="text-yellow-400 ml-auto">⭐</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Exportar */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Exportar Dados</h3>
              <div className="space-y-3">
                <button
                  onClick={handleExportJSON}
                  className="w-full p-4 rounded-lg border-2 border-gray-700 bg-gray-700/50 hover:border-yellow-400 hover:bg-yellow-400/20 transition-all text-left"
                >
                  <p className="text-white font-bold">📄 Exportar como JSON</p>
                  <p className="text-gray-400 text-sm">Histórico completo em formato JSON</p>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="w-full p-4 rounded-lg border-2 border-gray-700 bg-gray-700/50 hover:border-yellow-400 hover:bg-yellow-400/20 transition-all text-left"
                >
                  <p className="text-white font-bold">📊 Exportar como CSV</p>
                  <p className="text-gray-400 text-sm">Tabela simples para Excel/Google Sheets</p>
                </button>

                <button
                  onClick={handleExportFull}
                  className="w-full p-4 rounded-lg border-2 border-gray-700 bg-gray-700/50 hover:border-yellow-400 hover:bg-yellow-400/20 transition-all text-left"
                >
                  <p className="text-white font-bold">💾 Exportar Estatísticas Completas</p>
                  <p className="text-gray-400 text-sm">Histórico + títulos + todas as estatísticas</p>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPanel;

