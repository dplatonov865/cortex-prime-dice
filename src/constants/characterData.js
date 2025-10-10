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
  'Атлетизм': 'd4',
  'Координация': 'd6', 
  'Хитрость': 'd8',
  'Эрудиция': 'd10',
  'Чутьё': 'd12',
  'Убеждённость': 'd6'
};

export const DEFAULT_ROLES = {
  'Солдат': 'd4',
  'Дипломат': 'd6',
  'Эксперт': 'd8',
  'Мастер': 'd10',
  'Преступник': 'd12',
  'Детектив': 'd6'
};

export const DEFAULT_COMPLICATIONS = {
  'Ослаблен': '0',
  'Дезориентирован': '0',
  'Подозрителен': '0', 
  'Забывчив': '0',
  'Рассеян': '0',
  'В сомнениях': '0'
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