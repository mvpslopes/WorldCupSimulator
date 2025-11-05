import { useState } from 'react';
import { motion } from 'framer-motion';
import { getHistory, getTitles, setUseFileStorage, getUseFileStorage, loadFromFile } from '../utils/storage';
import { getSettings, updateSetting, addFavorite, removeFavorite, isFavorite } from '../utils/settings';
import { exportAsJSON, exportAsCSV, exportFullStats } from '../utils/exportData';
import { saveToDisk } from '../utils/fileStorage';
import { teams } from '../teams';
import { getFlagImageUrl } from '../utils/flags';

const SettingsPanel = ({ onClose }) => {
  const [settings, setSettings] = useState(getSettings());
  const [activeTab, setActiveTab] = useState('speed'); // speed, favorites, export, storage
  const [useFileStorage, setUseFileStorageState] = useState(getUseFileStorage());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  // Função para atualizar a configuração de armazenamento
  const updateFileStorageSetting = (checked) => {
    setUseFileStorage(checked); // Salva no localStorage
    setUseFileStorageState(checked); // Atualiza o estado local
  };

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
          <button
            onClick={() => setActiveTab('storage')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'storage'
                ? 'bg-yellow-400 text-black'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            💿 Armazenamento
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

          {/* Armazenamento */}
          {activeTab === 'storage' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">💿 Armazenamento</h3>
              
              {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'}`}>
                  <p className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
                    {message.text}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div className="p-4 rounded-lg border-2 border-gray-700 bg-gray-700/50">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-white font-bold">💾 Salvar no Disco</p>
                      <p className="text-gray-400 text-sm">Ativa salvamento em arquivo no disco do computador (sem limite de tamanho)</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useFileStorage}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          updateFileStorageSetting(checked);
                          setMessage({ type: 'success', text: checked ? 'Salvamento em arquivo ativado!' : 'Salvamento em arquivo desativado. Usando localStorage.' });
                          setTimeout(() => setMessage(null), 3000);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                    </label>
                  </div>
                  {useFileStorage && (
                    <p className="text-yellow-400 text-sm mt-2">
                      ⚠️ Quando ativado, será solicitado salvar um arquivo no disco a cada simulação. 
                      Isso evita problemas de limite de armazenamento do navegador.
                    </p>
                  )}
                </div>

                <button
                  onClick={async () => {
                    setLoading(true);
                    setMessage(null);
                    try {
                      const history = getHistory();
                      const titles = getTitles();
                      const currentYear = getCurrentYear();
                      const { getAllDetailedData } = await import('../utils/storage');
                      const detailedData = getAllDetailedData();
                      
                      const allData = {
                        history,
                        titles,
                        currentYear,
                        detailedData,
                        version: '1.0',
                        lastUpdate: new Date().toISOString()
                      };
                      
                      await saveToDisk(allData);
                      setMessage({ type: 'success', text: 'Dados salvos no disco com sucesso!' });
                    } catch (error) {
                      if (error.message?.includes('cancel')) {
                        setMessage({ type: 'error', text: 'Operação cancelada' });
                      } else {
                        setMessage({ type: 'error', text: `Erro ao salvar: ${error.message}` });
                      }
                    } finally {
                      setLoading(false);
                      setTimeout(() => setMessage(null), 5000);
                    }
                  }}
                  disabled={loading}
                  className="w-full p-4 rounded-lg border-2 border-gray-700 bg-gray-700/50 hover:border-yellow-400 hover:bg-yellow-400/20 transition-all text-left disabled:opacity-50"
                >
                  <p className="text-white font-bold">💿 Salvar Manualmente no Disco</p>
                  <p className="text-gray-400 text-sm">Salva todos os dados atuais em um arquivo JSON no disco</p>
                </button>

                <button
                  onClick={async () => {
                    setLoading(true);
                    setMessage(null);
                    try {
                      await loadFromFile();
                      setMessage({ type: 'success', text: 'Dados carregados do disco com sucesso! Recarregue a página para ver as mudanças.' });
                    } catch (error) {
                      if (error.message?.includes('cancel') || error.message?.includes('Seleção cancelada')) {
                        setMessage({ type: 'error', text: 'Operação cancelada' });
                      } else {
                        setMessage({ type: 'error', text: `Erro ao carregar: ${error.message}` });
                      }
                    } finally {
                      setLoading(false);
                      setTimeout(() => setMessage(null), 5000);
                    }
                  }}
                  disabled={loading}
                  className="w-full p-4 rounded-lg border-2 border-gray-700 bg-gray-700/50 hover:border-yellow-400 hover:bg-yellow-400/20 transition-all text-left disabled:opacity-50"
                >
                  <p className="text-white font-bold">📂 Carregar do Disco</p>
                  <p className="text-gray-400 text-sm">Carrega dados salvos anteriormente de um arquivo JSON</p>
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

