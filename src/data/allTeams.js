// Todas as seleções do mundo organizadas por confederação
// Ratings baseados em posições aproximadas do Ranking FIFA

export const allTeams = {
  // UEFA (Europa) - 13 vagas
  UEFA: [
    { name: "França", flag: "🇫🇷", rating: 91, confederation: "UEFA" },
    { name: "Inglaterra", flag: "🏴", rating: 89, confederation: "UEFA" },
    { name: "Portugal", flag: "🇵🇹", rating: 88, confederation: "UEFA" },
    { name: "Espanha", flag: "🇪🇸", rating: 87, confederation: "UEFA" },
    { name: "Holanda", flag: "🇳🇱", rating: 86, confederation: "UEFA" },
    { name: "Alemanha", flag: "🇩🇪", rating: 85, confederation: "UEFA" },
    { name: "Itália", flag: "🇮🇹", rating: 84, confederation: "UEFA" },
    { name: "Croácia", flag: "🇭🇷", rating: 83, confederation: "UEFA" },
    { name: "Bélgica", flag: "🇧🇪", rating: 81, confederation: "UEFA" },
    { name: "Suíça", flag: "🇨🇭", rating: 80, confederation: "UEFA" },
    { name: "Dinamarca", flag: "🇩🇰", rating: 79, confederation: "UEFA" },
    { name: "Polônia", flag: "🇵🇱", rating: 75, confederation: "UEFA" },
    { name: "Sérvia", flag: "🇷🇸", rating: 75, confederation: "UEFA" },
    { name: "Ucrânia", flag: "🇺🇦", rating: 69, confederation: "UEFA" },
    { name: "Suécia", flag: "🇸🇪", rating: 72, confederation: "UEFA" },
    { name: "Turquia", flag: "🇹🇷", rating: 72, confederation: "UEFA" },
    { name: "Áustria", flag: "🇦🇹", rating: 71, confederation: "UEFA" },
    { name: "Noruega", flag: "🇳🇴", rating: 70, confederation: "UEFA" },
    { name: "República Tcheca", flag: "🇨🇿", rating: 70, confederation: "UEFA" },
    { name: "Grécia", flag: "🇬🇷", rating: 69, confederation: "UEFA" },
    { name: "Islândia", flag: "🇮🇸", rating: 68, confederation: "UEFA" },
    { name: "Romênia", flag: "🇷🇴", rating: 67, confederation: "UEFA" },
    { name: "Hungria", flag: "🇭🇺", rating: 67, confederation: "UEFA" },
    { name: "Eslováquia", flag: "🇸🇰", rating: 66, confederation: "UEFA" },
    { name: "Irlanda", flag: "🇮🇪", rating: 66, confederation: "UEFA" },
    { name: "Escócia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", rating: 65, confederation: "UEFA" },
    { name: "Finlândia", flag: "🇫🇮", rating: 64, confederation: "UEFA" },
    { name: "Bulgária", flag: "🇧🇬", rating: 63, confederation: "UEFA" },
    { name: "Rússia", flag: "🇷🇺", rating: 62, confederation: "UEFA" },
    { name: "Eslovênia", flag: "🇸🇮", rating: 62, confederation: "UEFA" },
    { name: "Bósnia e Herzegovina", flag: "🇧🇦", rating: 61, confederation: "UEFA" },
    { name: "País de Gales", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", rating: 61, confederation: "UEFA" },
    { name: "Montenegro", flag: "🇲🇪", rating: 60, confederation: "UEFA" },
    { name: "Albânia", flag: "🇦🇱", rating: 60, confederation: "UEFA" },
    { name: "Macedônia do Norte", flag: "🇲🇰", rating: 59, confederation: "UEFA" },
    { name: "Estônia", flag: "🇪🇪", rating: 58, confederation: "UEFA" },
    { name: "Lituânia", flag: "🇱🇹", rating: 57, confederation: "UEFA" },
    { name: "Letônia", flag: "🇱🇻", rating: 57, confederation: "UEFA" },
  ],

  // CONMEBOL (América do Sul) - 4-5 vagas
  CONMEBOL: [
    { name: "Brasil", flag: "🇧🇷", rating: 92, confederation: "CONMEBOL" },
    { name: "Argentina", flag: "🇦🇷", rating: 90, confederation: "CONMEBOL" },
    { name: "Uruguai", flag: "🇺🇾", rating: 82, confederation: "CONMEBOL" },
    { name: "Equador", flag: "🇪🇨", rating: 71, confederation: "CONMEBOL" },
    { name: "Peru", flag: "🇵🇪", rating: 70, confederation: "CONMEBOL" },
    { name: "Colômbia", flag: "🇨🇴", rating: 70, confederation: "CONMEBOL" },
    { name: "Chile", flag: "🇨🇱", rating: 69, confederation: "CONMEBOL" },
    { name: "Paraguai", flag: "🇵🇾", rating: 68, confederation: "CONMEBOL" },
    { name: "Venezuela", flag: "🇻🇪", rating: 67, confederation: "CONMEBOL" },
    { name: "Bolívia", flag: "🇧🇴", rating: 65, confederation: "CONMEBOL" },
    { name: "Suriname", flag: "🇸🇷", rating: 60, confederation: "CONMEBOL" },
    { name: "Guiana", flag: "🇬🇾", rating: 58, confederation: "CONMEBOL" },
  ],

  // CONCACAF (América do Norte/Central) - 3-4 vagas
  CONCACAF: [
    { name: "EUA", flag: "🇺🇸", rating: 78, confederation: "CONCACAF" },
    { name: "México", flag: "🇲🇽", rating: 78, confederation: "CONCACAF" },
    { name: "Canadá", flag: "🇨🇦", rating: 73, confederation: "CONCACAF" },
    { name: "Costa Rica", flag: "🇨🇷", rating: 68, confederation: "CONCACAF" },
    { name: "Panamá", flag: "🇵🇦", rating: 67, confederation: "CONCACAF" },
    { name: "Jamaica", flag: "🇯🇲", rating: 66, confederation: "CONCACAF" },
    { name: "Honduras", flag: "🇭🇳", rating: 65, confederation: "CONCACAF" },
    { name: "El Salvador", flag: "🇸🇻", rating: 64, confederation: "CONCACAF" },
    { name: "Guatemala", flag: "🇬🇹", rating: 63, confederation: "CONCACAF" },
    { name: "Trinidad e Tobago", flag: "🇹🇹", rating: 62, confederation: "CONCACAF" },
    { name: "Haiti", flag: "🇭🇹", rating: 61, confederation: "CONCACAF" },
    { name: "Cuba", flag: "🇨🇺", rating: 60, confederation: "CONCACAF" },
    { name: "Curaçao", flag: "🇨🇼", rating: 59, confederation: "CONCACAF" },
    { name: "Martinica", flag: "🇲🇶", rating: 58, confederation: "CONCACAF" },
    { name: "Antilhas Holandesas", flag: "🇧🇶", rating: 57, confederation: "CONCACAF" },
  ],

  // CAF (África) - 5 vagas
  CAF: [
    { name: "Marrocos", flag: "🇲🇦", rating: 77, confederation: "CAF" },
    { name: "Senegal", flag: "🇸🇳", rating: 76, confederation: "CAF" },
    { name: "Nigéria", flag: "🇳🇬", rating: 74, confederation: "CAF" },
    { name: "Egito", flag: "🇪🇬", rating: 69, confederation: "CAF" },
    { name: "Tunísia", flag: "🇹🇳", rating: 68, confederation: "CAF" },
    { name: "Camarões", flag: "🇨🇲", rating: 67, confederation: "CAF" },
    { name: "Gana", flag: "🇬🇭", rating: 67, confederation: "CAF" },
    { name: "Costa do Marfim", flag: "🇨🇮", rating: 66, confederation: "CAF" },
    { name: "Argélia", flag: "🇩🇿", rating: 65, confederation: "CAF" },
    { name: "Mali", flag: "🇲🇱", rating: 64, confederation: "CAF" },
    { name: "Burkina Faso", flag: "🇧🇫", rating: 63, confederation: "CAF" },
    { name: "África do Sul", flag: "🇿🇦", rating: 63, confederation: "CAF" },
    { name: "RD Congo", flag: "🇨🇩", rating: 62, confederation: "CAF" },
    { name: "Guiné", flag: "🇬🇳", rating: 61, confederation: "CAF" },
    { name: "Cabo Verde", flag: "🇨🇻", rating: 61, confederation: "CAF" },
    { name: "Zâmbia", flag: "🇿🇲", rating: 60, confederation: "CAF" },
    { name: "Uganda", flag: "🇺🇬", rating: 60, confederation: "CAF" },
    { name: "Benim", flag: "🇧🇯", rating: 59, confederation: "CAF" },
    { name: "Gabão", flag: "🇬🇦", rating: 59, confederation: "CAF" },
    { name: "Madagáscar", flag: "🇲🇬", rating: 58, confederation: "CAF" },
    { name: "Quênia", flag: "🇰🇪", rating: 58, confederation: "CAF" },
    { name: "Tanzânia", flag: "🇹🇿", rating: 57, confederation: "CAF" },
    { name: "Libya", flag: "🇱🇾", rating: 57, confederation: "CAF" },
    { name: "Angola", flag: "🇦🇴", rating: 56, confederation: "CAF" },
    { name: "Moçambique", flag: "🇲🇿", rating: 56, confederation: "CAF" },
    { name: "Zimbabwe", flag: "🇿🇼", rating: 55, confederation: "CAF" },
  ],

  // AFC (Ásia) - 4-5 vagas
  AFC: [
    { name: "Japão", flag: "🇯🇵", rating: 77, confederation: "AFC" },
    { name: "Coreia do Sul", flag: "🇰🇷", rating: 74, confederation: "AFC" },
    { name: "Austrália", flag: "🇦🇺", rating: 73, confederation: "AFC" },
    { name: "Irã", flag: "🇮🇷", rating: 72, confederation: "AFC" },
    { name: "Arábia Saudita", flag: "🇸🇦", rating: 71, confederation: "AFC" },
    { name: "Qatar", flag: "🇶🇦", rating: 70, confederation: "AFC" },
    { name: "Emirados Árabes", flag: "🇦🇪", rating: 69, confederation: "AFC" },
    { name: "China", flag: "🇨🇳", rating: 68, confederation: "AFC" },
    { name: "Iraque", flag: "🇮🇶", rating: 67, confederation: "AFC" },
    { name: "Omã", flag: "🇴🇲", rating: 66, confederation: "AFC" },
    { name: "Uzbequistão", flag: "🇺🇿", rating: 65, confederation: "AFC" },
    { name: "Tailândia", flag: "🇹🇭", rating: 64, confederation: "AFC" },
    { name: "Vietnã", flag: "🇻🇳", rating: 63, confederation: "AFC" },
    { name: "Jordânia", flag: "🇯🇴", rating: 62, confederation: "AFC" },
    { name: "Kuwait", flag: "🇰🇼", rating: 61, confederation: "AFC" },
    { name: "Bahrein", flag: "🇧🇭", rating: 60, confederation: "AFC" },
    { name: "Palestina", flag: "🇵🇸", rating: 60, confederation: "AFC" },
    { name: "Síria", flag: "🇸🇾", rating: 59, confederation: "AFC" },
    { name: "Indonésia", flag: "🇮🇩", rating: 59, confederation: "AFC" },
    { name: "Malásia", flag: "🇲🇾", rating: 58, confederation: "AFC" },
    { name: "Filipinas", flag: "🇵🇭", rating: 58, confederation: "AFC" },
    { name: "Singapura", flag: "🇸🇬", rating: 57, confederation: "AFC" },
    { name: "Índia", flag: "🇮🇳", rating: 57, confederation: "AFC" },
    { name: "Bangladesh", flag: "🇧🇩", rating: 56, confederation: "AFC" },
    { name: "Mianmar", flag: "🇲🇲", rating: 55, confederation: "AFC" },
    { name: "Laos", flag: "🇱🇦", rating: 54, confederation: "AFC" },
  ],

  // OFC (Oceania) - 0-1 vaga
  OFC: [
    { name: "Nova Zelândia", flag: "🇳🇿", rating: 66, confederation: "OFC" },
    { name: "Taiti", flag: "🇵🇫", rating: 60, confederation: "OFC" },
    { name: "Nova Caledônia", flag: "🇳🇨", rating: 59, confederation: "OFC" },
    { name: "Fiji", flag: "🇫🇯", rating: 58, confederation: "OFC" },
    { name: "Papua Nova Guiné", flag: "🇵🇬", rating: 57, confederation: "OFC" },
    { name: "Ilhas Salomão", flag: "🇸🇧", rating: 55, confederation: "OFC" },
    { name: "Vanuatu", flag: "🇻🇺", rating: 54, confederation: "OFC" },
  ],
};

// Todas as seleções em um único array
export const getAllTeams = () => {
  return Object.values(allTeams).flat();
};

// Importa versão completa com todas as 211 seleções
export { allTeamsComplete as allTeamsFull, getAllTeamsComplete } from './allTeamsComplete';

// Vagas por confederação para Copa do Mundo (32 times)
export const worldCupQuotas = {
  UEFA: 13,
  CONMEBOL: 4,
  CONCACAF: 4,
  CAF: 5,
  AFC: 4,
  OFC: 1,
  HOST: 1, // País sede (se aplicável)
};

