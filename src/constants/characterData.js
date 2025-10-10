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
  'Ловкость': 'd6',
  'Мощь': 'd8',
  'Убеждённость': 'd10',
  'Хитрость': 'd6',
  'Чутьё': 'd8',
  'Эрудиция': 'd10'
};

export const DEFAULT_ROLES = {
  'Артист': 'd4',
  'Атлет': 'd6',
  'Врач': 'd8',
  'Детектив': 'd10',
  'Дипломат': 'd12',
  'Плут': 'd4',
  'Рейнджер': 'd6',
  'Солдат': 'd8',
  'Умелец': 'd10',
  'Учёный': 'd12'
};

export const DEFAULT_COMPLICATIONS = {
  'Ослаблен': '0',
  'Ограничен': '0',
  'Подозрителен': '0',
  'Забывчив': '0',
  'Рассеян': '0',
  'В сомнениях': '0'
};

export const DEFAULT_DISTINCTIONS = {
  'past': { name: 'Любопытный' },
  'trait': { name: 'Власть' },
  'value': { name: 'Свобода' }
};

export const DEFAULT_SPECIALTIES = {
  '1': { name: 'Кольт отца' },
  '2': { name: 'Мой старенький жучок' },
  '3': { name: 'Знакомый коронер' }
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