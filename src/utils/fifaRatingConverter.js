// Converte pontos FIFA em rating para o simulador (escala 50-100)
// Pontos FIFA tipicamente variam de ~300 (mais baixo) a ~1900 (mais alto)
export const convertFifaPointsToRating = (fifaPoints) => {
  // Normaliza pontos FIFA para rating de 50-100
  // Assumindo que pontos variam de 300 a 1900
  const minPoints = 300;
  const maxPoints = 1900;
  
  // Garante que está dentro dos limites
  const normalized = Math.max(minPoints, Math.min(maxPoints, fifaPoints));
  
  // Converte para escala 50-100
  const rating = 50 + ((normalized - minPoints) / (maxPoints - minPoints)) * 50;
  
  return Math.round(rating);
};

// Converte posição no ranking FIFA em rating aproximado
// Baseado em distribuição típica do ranking FIFA
export const convertFifaPositionToRating = (position) => {
  // Top 10: 85-100
  // Top 20: 75-85
  // Top 50: 65-75
  // Top 100: 55-65
  // Resto: 50-55
  
  if (position <= 10) {
    return 90 + (11 - position); // 90-100
  } else if (position <= 20) {
    return 80 + Math.floor((21 - position) / 2); // 75-85
  } else if (position <= 50) {
    return 65 + Math.floor((51 - position) / 3); // 65-75
  } else if (position <= 100) {
    return 55 + Math.floor((101 - position) / 10); // 55-65
  } else {
    return 50 + Math.floor((211 - position) / 20); // 50-55
  }
};

