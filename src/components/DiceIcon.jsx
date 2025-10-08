import React from 'react';

const DiceIcon = ({ type, value, onClick, clickable = false }) => {
  const getDiceStyles = () => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '14px',
      margin: '2px 4px',
      position: 'relative',
    };

    const typeStyles = {
      d4: {
        width: '24px',
        height: '24px',
        backgroundColor: '#ff6b6b',
        clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
        color: 'white',
      },
      d6: {
        width: '24px',
        height: '24px',
        backgroundColor: '#ffd93d',
        borderRadius: '4px',
        color: '#333',
      },
      d8: {
        width: '24px',
        height: '24px',
        backgroundColor: '#6bcf7f',
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        color: 'white',
      },
      d10: {
        width: '24px',
        height: '24px',
        backgroundColor: '#4d96ff',
        clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
        color: 'white',
      },
      d12: {
        width: '26px',
        height: '26px',
        backgroundColor: '#9d4edd',
        // Правильный десятиугольник (decagon)
        clipPath: 'polygon(50% 0%, 80% 10%, 95% 35%, 95% 65%, 80% 90%, 50% 100%, 20% 90%, 5% 65%, 5% 35%, 20% 10%)',
        color: 'white',
        fontSize: '12px', // Чуть меньше текст для лучшего отображения
      },
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  const handleClick = () => {
    if (clickable && onClick) {
      onClick(type);
    }
  };

  return (
    <span
      style={getDiceStyles()}
      onClick={handleClick}
      className={clickable ? 'dice-clickable' : ''}
      title={`Бросок ${type}`}
    >
      {value}
    </span>
  );
};

export default DiceIcon;