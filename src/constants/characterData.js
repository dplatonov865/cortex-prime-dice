// Базовые настройки персонажа по умолчанию
export const DEFAULT_CHARACTER_INFO = {
  name: '',
  player: '',
  campaign: '',
  race: '',
  age: '',
  description: ''
};

// ЕДИНЫЙ ФОРМАТ ДЛЯ ВСЕХ ТИПОВ ТРЕЙТОВ:
// {
//   [id]: {
//     name: string,
//     diceType: string // 'd4', 'd6', 'd8', 'd10', 'd12', '0'
//   }
// }

export const DEFAULT_ATTRIBUTES = {
  '1': { name: 'Мощь', diceType: 'd8' },
  '2': { name: 'Ловкость', diceType: 'd8' },
  '3': { name: 'Чутьё', diceType: 'd8' },
  '4': { name: 'Разум', diceType: 'd8' },
  '5': { name: 'Убеждённость', diceType: 'd8' },
  '6': { name: 'Воля', diceType: 'd8' }
};

export const DEFAULT_ROLES = {
  '1': { name: 'Атлетика', diceType: 'd4' },
  '2': { name: 'Бой', diceType: 'd4' },
  '3': { name: 'Выживание', diceType: 'd4' },
  '4': { name: 'Знание', diceType: 'd4' },
  '5': { name: 'Медицина', diceType: 'd4' },
  '6': { name: 'Общение', diceType: 'd4' },
  '7': { name: 'Расследование', diceType: 'd4' },
  '8': { name: 'Ремесло', diceType: 'd4' },
  '9': { name: 'Скрытность', diceType: 'd4' },
  '10': { name: 'Стойкость', diceType: 'd4' }
};

export const DEFAULT_COMPLICATIONS = {
};

// Отличия теперь тоже в едином формате
// Для отличий можно использовать d8 как основной тип
export const DEFAULT_DISTINCTIONS = {
  '1': { name: '', diceType: 'd8' },
  '2': { name: '', diceType: 'd8' },
  '3': { name: '', diceType: 'd8' }
};

// Специальности и ресурсы теперь с diceType
export const DEFAULT_SPECIALTIES = {
};

export const DEFAULT_RESOURCES = {
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

// Типы трейтов для универсальной обработки
export const TRAIT_TYPES = {
  ATTRIBUTES: 'attributes',
  ROLES: 'roles',
  COMPLICATIONS: 'complications',
  DISTINCTIONS: 'distinctions',
  SPECIALTIES: 'specialties',
  RESOURCES: 'resources'
};