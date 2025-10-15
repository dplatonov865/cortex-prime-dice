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
  'Мощь': 'd6',
  'Ловкость': 'd8',
  'Нюх': 'd10',
  'Ум': 'd6',
  'Сердце': 'd8',
  'Яйца': 'd10'
};

export const DEFAULT_ROLES = {
  'Атлетика': 'd10',
  'Бой': 'd8',
  'Выживание': 'd8',
  'Знание': 'd6',
  'Медицина': 'd6',
  'Общение': 'd6',
  'Расследование': 'd4',
  'Ремесло': 'd4',
  'Скрытность': 'd4',
  'Творчество': 'd4'
};

export const DEFAULT_COMPLICATIONS = {
  'Опутан': '0',
  'Оглохший': '0',
  'Ослеплённый': '0',
  'Ошеломлён': '0',
  'Физический стресс': '0',
  'Ментальный стресс': '0',
  'Духовный стресс': '0'
};

export const DEFAULT_DISTINCTIONS = {
  'past': { name: 'Любопытный' },
  'trait': { name: 'Власть' },
  'value': { name: 'Свобода' }
};

export const DEFAULT_SPECIALTIES = {
  '1': { name: 'Паркур' },
  '2': { name: 'Плавание' },
  '3': { name: 'Рукопашный бой' },
  '4': { name: 'Выслеживание' }
};

export const DEFAULT_RESOURCES = {
  '1': { name: 'Наградной кольт отца' },
  '2': { name: 'Знакомый коронер' }
};

// Настройки лимитов
export const LIMITS = {
  MAX_SPECIALTIES: 10,
  MAX_RESOURCES: 10,
  MAX_SELECTED_DICE: 2,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_NAME_LENGTH: 50
};

// Порядок рангов
export const RANK_ORDER = {
  ATTRIBUTES: ['d4', 'd6', 'd8', 'd10', 'd12'],
  COMPLICATIONS: ['0', 'd4', 'd6', 'd8', 'd10', 'd12']
};