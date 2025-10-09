// Функция для экспорта данных персонажа в файл
export const exportCharacter = (characterData) => {
  const dataStr = JSON.stringify(characterData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${characterData.characterInfo.name || 'character'}_sheet.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Функция для импорта данных персонажа из файла
export const importCharacter = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Неверный формат файла'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Ошибка чтения файла'));
    };
    
    reader.readAsText(file);
  });
};

// Функция для валидации импортированных данных
export const validateCharacterData = (data) => {
  const requiredFields = [
    'characterInfo',
    'attributes', 
    'roles',
    'complications',
    'distinctions',
    'specialties'
  ];
  
  return requiredFields.every(field => data.hasOwnProperty(field));
};