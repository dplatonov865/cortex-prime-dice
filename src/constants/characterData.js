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
  '1': { name: 'Мощь', diceType: 'd6' },
  '2': { name: 'Ловкость', diceType: 'd8' },
  '3': { name: 'Нюх', diceType: 'd10' },
  '4': { name: 'Ум', diceType: 'd6' },
  '5': { name: 'Сердце', diceType: 'd8' },
  '6': { name: 'Яйца', diceType: 'd10' }
};

export const DEFAULT_ROLES = {
  '1': { name: 'Атлетика', diceType: 'd10' },
  '2': { name: 'Бой', diceType: 'd8' },
  '3': { name: 'Выживание', diceType: 'd8' },
  '4': { name: 'Знание', diceType: 'd6' },
  '5': { name: 'Медицина', diceType: 'd6' },
  '6': { name: 'Общение', diceType: 'd6' },
  '7': { name: 'Расследование', diceType: 'd4' },
  '8': { name: 'Ремесло', diceType: 'd4' },
  '9': { name: 'Скрытность', diceType: 'd4' }
};

export const DEFAULT_COMPLICATIONS = {
  '1': { name: 'Опутан', diceType: '0' },
  '2': { name: 'Оглохший', diceType: '0' },
  '3': { name: 'Ослеплённый', diceType: '0' },
  '4': { name: 'Ошеломлён', diceType: '0' },
  '5': { name: 'Физический стресс', diceType: '0' },
  '6': { name: 'Ментальный стресс', diceType: '0' },
  '7': { name: 'Духовный стресс', diceType: '0' }
};

// Отличия теперь тоже в едином формате
// Для отличий можно использовать d8 как основной тип
export const DEFAULT_DISTINCTIONS = {
  '1': { name: 'Любопытный', diceType: 'd8' },
  '2': { name: 'Власть', diceType: 'd8' },
  '3': { name: 'Свобода', diceType: 'd8' }
};

// Специальности и ресурсы теперь с diceType
export const DEFAULT_SPECIALTIES = {
  '1': { name: 'Паркур', diceType: 'd6' },
  '2': { name: 'Плавание', diceType: 'd6' },
  '3': { name: 'Рукопашный бой', diceType: 'd6' },
  '4': { name: 'Выслеживание', diceType: 'd6' }
};

export const DEFAULT_RESOURCES = {
  '1': { name: 'Наградной кольт отца', diceType: 'd6' },
  '2': { name: 'Знакомый коронер', diceType: 'd6' }
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