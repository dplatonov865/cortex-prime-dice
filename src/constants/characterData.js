// Базовые настройки персонажа по умолчанию
export const DEFAULT_CHARACTER_INFO = {
  name: '',
  player: '',
  campaign: '',
  race: '',
  age: '',
  description: ''
};

export const DEFAULT_ATTRIBUTES = {
  'Атлетизм': 'd6',
  'Координация': 'd6', 
  'Хитрость': 'd6',
  'Эрудиция': 'd6',
  'Чутьё': 'd6',
  'Убеждённость': 'd6'
};

export const DEFAULT_ROLES = {
  'Солдат': 'd6',
  'Дипломат': 'd6',
  'Эксперт': 'd6',
  'Мастер': 'd6',
  'Преступник': 'd6',
  'Детектив': 'd6'
};

export const DEFAULT_COMPLICATIONS = {
  'Ослабление': '0',
  'Дезориентация': '0',
  'Подозрительность': '0', 
  'Забывчивость': '0',
  'Рассеянность': '0',
  'Сомнения': '0'
};

export const DEFAULT_DISTINCTIONS = {
  'past': { name: 'Ботаник' },
  'trait': { name: 'Хладнокровный' },
  'value': { name: 'Дружба' }
};

export const DEFAULT_SPECIALTIES = {
  '1': { name: 'Стрельба из пистолета' },
  '2': { name: 'Вождение автомобиля' },
  '3': { name: 'Первая помощь' }
};

// Настройки лимитов
export const LIMITS = {
  MAX_SPECIALTIES: 10,
  MAX_SELECTED_DICE: 2,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_NAME_LENGTH: 50
};

// Порядок рангов
export const RANK_ORDER = {
  ATTRIBUTES: ['d4', 'd6', 'd8', 'd10', 'd12'],
  COMPLICATIONS: ['0', 'd4', 'd6', 'd8', 'd10', 'd12']
};