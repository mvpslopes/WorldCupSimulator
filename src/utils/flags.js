// Importa mapeamento completo
import { completeFlagMap, getFlagImageUrlComplete } from './flagsComplete';

// Mapeamento de nomes de países para códigos ISO 3166-1 alpha-2 (mantido para compatibilidade)
export const countryCodes = {
  'Brasil': 'BR', 'França': 'FR', 'Argentina': 'AR', 'Inglaterra': 'GB-ENG',
  'Portugal': 'PT', 'Espanha': 'ES', 'Holanda': 'NL', 'Alemanha': 'DE',
  'Itália': 'IT', 'Croácia': 'HR', 'Uruguai': 'UY', 'Bélgica': 'BE',
  'Suíça': 'CH', 'Dinamarca': 'DK', 'EUA': 'US', 'México': 'MX',
  'Marrocos': 'MA', 'Japão': 'JP', 'Senegal': 'SN', 'Polônia': 'PL',
  'Sérvia': 'RS', 'Nigéria': 'NG', 'Coreia do Sul': 'KR', 'Austrália': 'AU',
  'Canadá': 'CA', 'Turquia': 'TR', 'Suécia': 'SE', 'Equador': 'EC',
  'Peru': 'PE', 'Colômbia': 'CO', 'Ucrânia': 'UA', 'Egito': 'EG',
};

// Mapeamento de códigos de países para bandeiras emoji (fallback)
export const countryFlags = {
  'Brasil': '🇧🇷', 'França': '🇫🇷', 'Argentina': '🇦🇷', 'Inglaterra': '🏴',
  'Portugal': '🇵🇹', 'Espanha': '🇪🇸', 'Holanda': '🇳🇱', 'Alemanha': '🇩🇪',
  'Itália': '🇮🇹', 'Croácia': '🇭🇷', 'Uruguai': '🇺🇾', 'Bélgica': '🇧🇪',
  'Suíça': '🇨🇭', 'Dinamarca': '🇩🇰', 'EUA': '🇺🇸', 'México': '🇲🇽',
  'Marrocos': '🇲🇦', 'Japão': '🇯🇵', 'Senegal': '🇸🇳', 'Polônia': '🇵🇱',
  'Sérvia': '🇷🇸', 'Nigéria': '🇳🇬', 'Coreia do Sul': '🇰🇷', 'Austrália': '🇦🇺',
  'Canadá': '🇨🇦', 'Turquia': '🇹🇷', 'Suécia': '🇸🇪', 'Equador': '🇪🇨',
  'Peru': '🇵🇪', 'Colômbia': '🇨🇴', 'Ucrânia': '🇺🇦', 'Egito': '🇪🇬',
    'Áustria': '🇦🇹', 'Noruega': '🇳🇴', 'República Tcheca': '🇨🇿', 'Grécia': '🇬🇷',
    'Islândia': '🇮🇸', 'Romênia': '🇷🇴', 'Hungria': '🇭🇺', 'Eslováquia': '🇸🇰',
    'Irlanda': '🇮🇪', 'Escócia': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Finlândia': '🇫🇮', 'Bulgária': '🇧🇬',
    'Rússia': '🇷🇺', 'Eslovênia': '🇸🇮', 'Bósnia e Herzegovina': '🇧🇦',
    'País de Gales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'Montenegro': '🇲🇪', 'Albânia': '🇦🇱',
    'Macedônia do Norte': '🇲🇰', 'Estônia': '🇪🇪', 'Lituânia': '🇱🇹', 'Letônia': '🇱🇻',
    'Chile': '🇨🇱', 'Paraguai': '🇵🇾',
    'Venezuela': '🇻🇪', 'Bolívia': '🇧🇴', 'Suriname': '🇸🇷', 'Guiana': '🇬🇾',
    'Costa Rica': '🇨🇷', 'Panamá': '🇵🇦',
  'Jamaica': '🇯🇲', 'Honduras': '🇭🇳', 'El Salvador': '🇸🇻', 'Guatemala': '🇬🇹',
    'Trinidad e Tobago': '🇹🇹', 'Haiti': '🇭🇹', 'Cuba': '🇨🇺', 'Curaçao': '🇨🇼',
    'Martinica': '🇲🇶', 'Antilhas Holandesas': '🇧🇶',
    'Tunísia': '🇹🇳', 'Camarões': '🇨🇲', 'Gana': '🇬🇭',
  'Costa do Marfim': '🇨🇮', 'Argélia': '🇩🇿', 'Mali': '🇲🇱', 'Burkina Faso': '🇧🇫',
    'África do Sul': '🇿🇦', 'RD Congo': '🇨🇩', 'Guiné': '🇬🇳', 'Cabo Verde': '🇨🇻',
    'Zâmbia': '🇿🇲', 'Uganda': '🇺🇬', 'Benim': '🇧🇯', 'Gabão': '🇬🇦',
    'Madagáscar': '🇲🇬', 'Quênia': '🇰🇪', 'Tanzânia': '🇹🇿', 'Libya': '🇱🇾',
    'Angola': '🇦🇴', 'Moçambique': '🇲🇿', 'Zimbabwe': '🇿🇼',
  'Irã': '🇮🇷', 'Arábia Saudita': '🇸🇦', 'Qatar': '🇶🇦', 'Emirados Árabes': '🇦🇪',
  'China': '🇨🇳', 'Iraque': '🇮🇶', 'Omã': '🇴🇲', 'Uzbequistão': '🇺🇿',
    'Tailândia': '🇹🇭', 'Vietnã': '🇻🇳', 'Jordânia': '🇯🇴', 'Kuwait': '🇰🇼',
    'Bahrein': '🇧🇭', 'Palestina': '🇵🇸', 'Síria': '🇸🇾', 'Indonésia': '🇮🇩',
    'Malásia': '🇲🇾', 'Filipinas': '🇵🇭', 'Singapura': '🇸🇬', 'Índia': '🇮🇳',
    'Bangladesh': '🇧🇩', 'Mianmar': '🇲🇲', 'Laos': '🇱🇦',
    'Nova Zelândia': '🇳🇿', 'Taiti': '🇵🇫', 'Nova Caledônia': '🇳🇨', 'Fiji': '🇫🇯',
    'Papua Nova Guiné': '🇵🇬', 'Ilhas Salomão': '🇸🇧', 'Vanuatu': '🇻🇺',
};

// Função para obter o código do país (usa mapeamento completo)
export const getCountryCode = (countryName) => {
  // Tenta primeiro o mapeamento completo
  if (completeFlagMap[countryName]) {
    const code = completeFlagMap[countryName].toUpperCase();
    // Códigos especiais
    if (code === 'GB-ENG' || code === 'GB-SCT' || code === 'GB-WLS') {
      return code;
    }
    return code;
  }
  // Fallback para código antigo
  return countryCodes[countryName] || 'XX';
};

// Função para obter a bandeira emoji (fallback)
export const getFlag = (countryName) => {
  return countryFlags[countryName] || '🏳️';
};

// Função para obter URL da bandeira como imagem
// Agora usa o mapeamento completo primeiro
export const getFlagImageUrl = (countryName, size = 'w20') => {
  // Usa o mapeamento completo
  const url = getFlagImageUrlComplete(countryName, size);
  if (url && !url.includes('un.png')) {
    return url;
  }
  
  // Fallback para código antigo se não encontrar no mapeamento completo
  const code = getCountryCode(countryName);
  if (code === 'GB-ENG' || code === 'gb-eng') {
    return `https://flagcdn.com/${size}/gb-eng.png`;
  }
  if (code && code !== 'XX') {
    return `https://flagcdn.com/${size}/${code.toLowerCase()}.png`;
  }
  return `https://flagcdn.com/${size}/un.png`; // Fallback for unknown flags
};
