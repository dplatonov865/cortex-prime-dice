import React from 'react';
import CharacterSheet from './components/CharacterSheet';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Лист персонажа для моей настольной игры. Эксклюзивно для Ильи, Матвея и Лизы</h1>
      </header>
      <main>
        <CharacterSheet />
      </main>
    </div>
  );
}

export default App;