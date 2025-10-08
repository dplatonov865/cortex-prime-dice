import React from 'react';
import CharacterSheet from './components/CharacterSheet';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Cortex Character Sheet</h1>
        <p>Лист персонажа для настольной ролевой игры</p>
      </header>
      <main>
        <CharacterSheet />
      </main>
    </div>
  );
}

export default App;