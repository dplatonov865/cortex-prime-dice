export const DISTINCTION_GROUPS = {
    physical: {
        name: 'Физические',
        options: [
            { value: 'Здоровяк', label: 'Здоровяк' },
            { value: 'Проныра', label: 'Проныра' },
            { value: 'Спортсмен', label: 'Спортсмен' },
            { value: 'Красавчик', label: 'Красавчик' },
            { value: 'Золотые руки', label: 'Золотые руки' }
        ]
    },
    spiritual: {
        name: 'Духовные',
        options: [
            { value: 'Прожжённый циник', label: 'Прожжённый циник' },
            { value: 'Наивный идеалист', label: 'Наивный идеалист' },
            { value: 'Праведный', label: 'Праведный' },
            { value: 'Авантюрист', label: 'Авантюрист' },
            { value: 'Преданный', label: 'Преданный' }
        ]
    },
    mental: {
        name: 'Ментальные',
        options: [
            { value: 'Эрудит', label: 'Эрудит' },
            { value: 'Бдительный', label: 'Бдительный' },
            { value: 'Дилетант', label: 'Дилетант' },
            { value: 'Планировщик', label: 'Планировщик' },
            { value: 'Творческая натура', label: 'Творческая натура' }
        ]
    },
    social: {
        name: 'Социальные',
        options: [
            { value: 'Душа компании', label: 'Душа компании' },
            { value: 'Кукловод', label: 'Кукловод' },
            { value: 'Наставник', label: 'Наставник' },
            { value: 'Артист', label: 'Артист' },
            { value: 'Брутальный', label: 'Брутальный' }
        ]
    },
    mystical: {
        name: 'Мистические',
        options: [
            { value: 'Дьявольски везучий', label: 'Дьявольски везучий' },
            { value: 'Отмеченный судьбой', label: 'Отмеченный судьбой' },
            { value: 'Видящий духов', label: 'Видящий духов' },
            { value: 'Менталист', label: 'Менталист' },
            { value: 'Провидец', label: 'Провидец' }
        ]
    },
    truth: {
        name: "Истина",
        options: [
            { value: "Истина", label: "Истина"}
        ]
    },
    justice: {
        name: "Справедливость",
        options: [
            { value: "Справедливость", label: "Справедливость"}
        ]
    },
    love: {
        name: "Любовь",
        options: [
            { value: "Любовь", label: "Любовь"}
        ]
    },
    friendship: {
        name: "Дружба",
        options: [
            { value: "Дружба", label: "Дружба"}
        ]
    },
    faith: {
        name: "Вера",
        options: [
            { value: "Вера", label: "Вера"}
        ]
    },
    mercy: {
        name: "Милосердие",
        options: [
            { value: "Милосердие", label: "Милосердие"}
        ]
    },
    power: {
        name: "Власть",
        options: [
            { value: "Власть", label: "Власть"}
        ]
    },
    prestige: {
        name: "Престиж",
        options: [
            { value: "Престиж", label: "Престиж"}
        ]
    },
    thrill: {
        name: "Острые ощущения",
        options: [
            { value: "Острые ощущения", label: "Острые ощущения"}
        ]
    },
    freedom: {
        name: "Свобода",
        options: [
            { value: "Свобода", label: "Свобода"}
        ]
    },
};

// Вспомогательная функция для получения всех опций в плоском виде (для обратной совместимости)
export const DISTINCTION_OPTIONS = Object.values(DISTINCTION_GROUPS).flatMap(group => group.options);

// Функция для получения группы по значению отличия
export const getDistinctionGroup = (distinctionValue) => {
    for (const [groupKey, group] of Object.entries(DISTINCTION_GROUPS)) {
        if (group.options.some(option => option.value === distinctionValue)) {
            return groupKey;
        }
    }
    return null;
};

// Функция для получения названия группы по значению отличия
export const getDistinctionGroupName = (distinctionValue) => {
    const groupKey = getDistinctionGroup(distinctionValue);
    return groupKey ? DISTINCTION_GROUPS[groupKey].name : null;
};