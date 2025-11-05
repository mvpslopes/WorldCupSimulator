// Sistema de armazenamento em arquivo no disco do computador
// Usa File System Access API quando disponível, fallback para download de arquivo

const STORAGE_FILE_NAME = 'WorldCupSimulator_Data.json';

// Verifica se File System Access API está disponível
const isFileSystemAvailable = () => {
  return 'showSaveFilePicker' in window && 'showOpenFilePicker' in window;
};

// Salva dados no disco usando File System Access API
export const saveToDisk = async (data) => {
  try {
    if (isFileSystemAvailable()) {
      // Usa File System Access API
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: STORAGE_FILE_NAME,
        types: [{
          description: 'JSON files',
          accept: { 'application/json': ['.json'] }
        }]
      });
      
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();
      
      // Salva referência do arquivo para carregar automaticamente depois
      localStorage.setItem('worldcup_file_handle', JSON.stringify({
        name: fileHandle.name,
        kind: fileHandle.kind
      }));
      
      return true;
    } else {
      // Fallback: faz download do arquivo
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = STORAGE_FILE_NAME;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      // Usuário cancelou
      return false;
    }
    console.error('Erro ao salvar no disco:', error);
    throw error;
  }
};

// Carrega dados do disco usando File System Access API
export const loadFromDisk = async () => {
  try {
    if (isFileSystemAvailable()) {
      // Usa File System Access API
      const [fileHandle] = await window.showOpenFilePicker({
        types: [{
          description: 'JSON files',
          accept: { 'application/json': ['.json'] }
        }],
        multiple: false
      });
      
      const file = await fileHandle.getFile();
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Salva referência do arquivo
      localStorage.setItem('worldcup_file_handle', JSON.stringify({
        name: fileHandle.name,
        kind: fileHandle.kind
      }));
      
      return data;
    } else {
      // Fallback: mostra input de arquivo
      return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (!file) {
            reject(new Error('Nenhum arquivo selecionado'));
            return;
          }
          
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const data = JSON.parse(event.target.result);
              resolve(data);
            } catch (error) {
              reject(new Error('Erro ao ler arquivo: ' + error.message));
            }
          };
          reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
          reader.readAsText(file);
        };
        input.oncancel = () => reject(new Error('Seleção cancelada'));
        input.click();
      });
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Seleção cancelada');
    }
    console.error('Erro ao carregar do disco:', error);
    throw error;
  }
};

// Salva automaticamente no disco (usa referência salva se disponível)
export const autoSaveToDisk = async (data) => {
  try {
    const savedHandle = localStorage.getItem('worldcup_file_handle');
    if (savedHandle && isFileSystemAvailable()) {
      // Tenta usar o arquivo salvo anteriormente
      // Nota: File System Access API não permite salvar automaticamente sem interação do usuário
      // Então sempre pede confirmação
      return await saveToDisk(data);
    } else {
      // Sem referência, salva normalmente
      return await saveToDisk(data);
    }
  } catch (error) {
    console.error('Erro no salvamento automático:', error);
    return false;
  }
};

// Verifica se há um arquivo salvo anteriormente
export const hasSavedFile = () => {
  return !!localStorage.getItem('worldcup_file_handle');
};

// Limpa referência do arquivo
export const clearSavedFile = () => {
  localStorage.removeItem('worldcup_file_handle');
};

// Função auxiliar corrigida
const isFileSystemAccessAPI = () => {
  return 'showSaveFilePicker' in window && 'showOpenFilePicker' in window;
};

