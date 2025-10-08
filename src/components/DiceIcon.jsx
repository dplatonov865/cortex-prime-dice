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
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        color: 'white',
      },
      d12: {
        width: '24px',
        height: '24px',
        backgroundColor: '#9d4edd',
        clipPath: 'polygon(50% 0%, 85% 10%, 100% 40%, 85% 70%, 50% 100%, 15% 70%, 0% 40%, 15% 10%)',
        color: 'white',
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