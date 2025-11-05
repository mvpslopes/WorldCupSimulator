// Mapeamento completo de todas as 221 seleções para códigos de bandeira
// Baseado em ISO 3166-1 alpha-2 e códigos especiais para territórios

export const completeFlagMap = {
  // UEFA
  "Espanha": "es", "França": "fr", "Inglaterra": "gb-eng", "Portugal": "pt",
  "Holanda": "nl", "Bélgica": "be", "Itália": "it", "Alemanha": "de",
  "Croácia": "hr", "Suíça": "ch", "Dinamarca": "dk", "Polônia": "pl",
  "Sérvia": "rs", "Ucrânia": "ua", "Suécia": "se", "Turquia": "tr",
  "Áustria": "at", "Noruega": "no", "República Tcheca": "cz", "Grécia": "gr",
  "Islândia": "is", "Romênia": "ro", "Hungria": "hu", "Eslováquia": "sk",
  "Irlanda": "ie", "Escócia": "gb-sct", "Finlândia": "fi", "Bulgária": "bg",
  "Rússia": "ru", "Eslovênia": "si", "Bósnia e Herzegovina": "ba",
  "País de Gales": "gb-wls", "Montenegro": "me", "Albânia": "al",
  "Macedônia do Norte": "mk", "Chipre": "cy", "Luxemburgo": "lu",
  "Geórgia": "ge", "Azerbaijão": "az", "Kosovo": "xk", "Armênia": "am",
  "Estônia": "ee", "Lituânia": "lt", "Letônia": "lv", "Bielorrússia": "by",
  "Moldávia": "md", "Ilhas Feroe": "fo", "Malta": "mt", "Andorra": "ad",
  "San Marino": "sm", "Liechtenstein": "li", "Gibraltar": "gi", "Kazakhstan": "kz",
  "Macedônia": "mk",
  
  // CONMEBOL
  "Brasil": "br", "Argentina": "ar", "Uruguai": "uy", "Colômbia": "co",
  "Equador": "ec", "Peru": "pe", "Chile": "cl", "Paraguai": "py",
  "Venezuela": "ve", "Bolívia": "bo", "Suriname": "sr", "Guiana": "gy",
  
  // CONCACAF
  "EUA": "us", "México": "mx", "Canadá": "ca", "Costa Rica": "cr",
  "Panamá": "pa", "Jamaica": "jm", "Honduras": "hn", "El Salvador": "sv",
  "Guatemala": "gt", "Trinidad e Tobago": "tt", "Haiti": "ht", "Cuba": "cu",
  "Curaçao": "cw", "Martinica": "mq", "Antilhas Holandesas": "bq",
  "Nicarágua": "ni", "Guadalupe": "gp", "Guiana Francesa": "gf",
  "São Martinho": "sx", "Bonaire": "bq", "Belize": "bz",
  "São Cristóvão e Nevis": "kn", "Aruba": "aw", "Ilhas Cayman": "ky",
  "São Vicente e Granadinas": "vc", "Dominica": "dm", "Anguilla": "ai",
  "Barbados": "bb", "Granada": "gd", "São Bartolomeu": "bl", "Montserrat": "ms",
  "Ilhas Virgens Britânicas": "vg", "Ilhas Virgens Americanas": "vi",
  "Porto Rico": "pr", "Turcas e Caicos": "tc", "Bahamas": "bs", "Bermuda": "bm",
  "Santa Lúcia": "lc", "Antígua e Barbuda": "ag", "São Martinho Holandês": "sx",
  
  // CAF
  "Marrocos": "ma", "Senegal": "sn", "Nigéria": "ng", "Egito": "eg",
  "Tunísia": "tn", "Camarões": "cm", "Gana": "gh", "Costa do Marfim": "ci",
  "Argélia": "dz", "Mali": "ml", "Burkina Faso": "bf", "África do Sul": "za",
  "RD Congo": "cd", "Guiné": "gn", "Cabo Verde": "cv", "Zâmbia": "zm",
  "Uganda": "ug", "Benim": "bj", "Gabão": "ga", "Madagáscar": "mg",
  "Quênia": "ke", "Tanzânia": "tz", "Libya": "ly", "Angola": "ao",
  "Moçambique": "mz", "Zimbabwe": "zw", "Guiné-Bissau": "gw", "Congo": "cg",
  "Togo": "tg", "Ruanda": "rw", "Gâmbia": "gm", "Malawi": "mw",
  "Etiópia": "et", "Namíbia": "na", "Níger": "ne", "Burundi": "bi",
  "Lesoto": "ls", "Suazilândia": "sz", "Botswana": "bw", "São Tomé e Príncipe": "st",
  "Chade": "td", "Comores": "km", "Mauritânia": "mr", "Djibuti": "dj",
  "Somália": "so", "Eritreia": "er", "Seychelles": "sc", "Sudão do Sul": "ss",
  "Serra Leoa": "sl", "Libéria": "lr", "Guiné Equatorial": "gq", "Sudão": "sd",
  "Maurício": "mu", "República Centro-Africana": "cf", "República do Congo": "cg",
  
  // AFC
  "Japão": "jp", "Coreia do Sul": "kr", "Austrália": "au", "Irã": "ir",
  "Arábia Saudita": "sa", "Qatar": "qa", "Emirados Árabes": "ae",
  "China": "cn", "Iraque": "iq", "Omã": "om", "Uzbequistão": "uz",
  "Tailândia": "th", "Vietnã": "vn", "Jordânia": "jo", "Kuwait": "kw",
  "Bahrein": "bh", "Palestina": "ps", "Síria": "sy", "Indonésia": "id",
  "Malásia": "my", "Filipinas": "ph", "Singapura": "sg", "Índia": "in",
  "Bangladesh": "bd", "Mianmar": "mm", "Laos": "la", "Quirguistão": "kg",
  "Tajiquistão": "tj", "Afeganistão": "af", "Turcomenistão": "tm",
  "Cazaquistão": "kz", "Nepal": "np", "Butão": "bt", "Maldivas": "mv",
  "Sri Lanka": "lk", "Paquistão": "pk", "Iêmen": "ye", "Líbano": "lb",
  "Camboja": "kh", "Brunei": "bn", "Timor-Leste": "tl", "Mongólia": "mn",
  "Guam": "gu", "Macau": "mo", "Ilhas Marianas": "mp", "Taiwan": "tw",
  "Hong Kong": "hk",
  
  // OFC
  "Nova Zelândia": "nz", "Taiti": "pf", "Nova Caledônia": "nc", "Fiji": "fj",
  "Papua Nova Guiné": "pg", "Ilhas Salomão": "sb", "Vanuatu": "vu",
  "Samoa": "ws", "Samoa Americana": "as", "Tonga": "to", "Ilhas Cook": "ck",
  "Tuvalu": "tv", "Kiribati": "ki",
};

// Função melhorada para obter URL da bandeira
export const getFlagImageUrlComplete = (countryName, size = 'w20') => {
  const code = completeFlagMap[countryName];
  
  if (!code) {
    // Fallback: tenta usar o código existente
    const { getFlagImageUrl } = require('./flags');
    return getFlagImageUrl(countryName, size);
  }
  
  // Códigos especiais
  if (code === 'gb-eng' || code === 'GB-ENG') {
    return `https://flagcdn.com/${size}/gb-eng.png`;
  }
  if (code === 'gb-sct') {
    return `https://flagcdn.com/${size}/gb-sct.png`;
  }
  if (code === 'gb-wls') {
    return `https://flagcdn.com/${size}/gb-wls.png`;
  }
  if (code === 'xk') {
    // Kosovo - usa código alternativo
    return `https://flagcdn.com/${size}/xk.png`;
  }
  
  return `https://flagcdn.com/${size}/${code.toLowerCase()}.png`;
};

