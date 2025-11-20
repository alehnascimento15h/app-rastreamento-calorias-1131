import { UserProfile } from '@/types/user';

// Calcular Taxa Metabólica Basal (TMB) usando fórmula de Mifflin-St Jeor
export function calculateBMR(profile: UserProfile): number {
  if (!profile.weight || !profile.height || !profile.birthDate) return 0;
  
  const age = calculateAge(profile.birthDate);
  const weight = profile.weight;
  const height = profile.height;
  
  let bmr = 0;
  
  if (profile.gender === 'masculino') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (profile.gender === 'feminino') {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    // Para "outro", usar média
    bmr = 10 * weight + 6.25 * height - 5 * age - 78;
  }
  
  return Math.round(bmr);
}

// Calcular Gasto Energético Diário Total (TDEE)
export function calculateTDEE(bmr: number, workoutsPerWeek: string): number {
  let activityMultiplier = 1.2; // Sedentário
  
  switch (workoutsPerWeek) {
    case '0-2':
      activityMultiplier = 1.375; // Levemente ativo
      break;
    case '3-5':
      activityMultiplier = 1.55; // Moderadamente ativo
      break;
    case '6+':
      activityMultiplier = 1.725; // Muito ativo
      break;
  }
  
  return Math.round(bmr * activityMultiplier);
}

// Calcular meta de calorias diárias baseado no objetivo
export function calculateDailyCalories(
  tdee: number,
  goal: string,
  weeklyWeightChange: number
): number {
  let dailyCalories = tdee;
  
  // 1 kg de gordura = ~7700 calorias
  // Déficit/superávit diário = (7700 * kg por semana) / 7 dias
  const dailyCalorieAdjustment = (7700 * weeklyWeightChange) / 7;
  
  if (goal === 'perder') {
    dailyCalories = tdee - dailyCalorieAdjustment;
  } else if (goal === 'ganhar') {
    dailyCalories = tdee + dailyCalorieAdjustment;
  }
  
  // Limites de segurança
  if (dailyCalories < 1200) dailyCalories = 1200;
  if (dailyCalories > 4000) dailyCalories = 4000;
  
  return Math.round(dailyCalories);
}

// Calcular idade a partir da data de nascimento
export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// Gerar frase motivacional personalizada
export function generateMotivationalPhrase(profile: UserProfile): string {
  const phrases = [
    `Você está prestes a transformar ${Math.abs((profile.targetWeight || 0) - (profile.weight || 0))}kg em pura determinação!`,
    `Sua jornada para ${profile.goal === 'perder' ? 'perder' : profile.goal === 'ganhar' ? 'ganhar' : 'manter'} peso começa agora. Vamos juntos!`,
    `Com ${profile.workoutsPerWeek} treinos por semana, você já está no caminho certo!`,
    `Cada dia é uma nova oportunidade de se aproximar dos seus ${profile.targetWeight}kg!`,
    `Seu objetivo de ${profile.goal} peso está mais perto do que você imagina!`
  ];
  
  return phrases[Math.floor(Math.random() * phrases.length)];
}

// Estimar tempo para atingir meta
export function estimateTimeToGoal(
  currentWeight: number,
  targetWeight: number,
  weeklyChange: number
): number {
  const totalWeightChange = Math.abs(targetWeight - currentWeight);
  const weeks = totalWeightChange / weeklyChange;
  return Math.ceil(weeks);
}
