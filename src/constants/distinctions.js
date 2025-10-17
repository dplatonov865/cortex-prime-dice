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
    }
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