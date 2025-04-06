import './App.css';
import Game from './components/game';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src='/favicon.png' className="App-logo" alt="logo" />
        <p style={{ marginTop: '-1%' }}>Hello, Welcome to Snake Game! Please use WASD keys to control the snake!</p>
        <Game />
      </header>
    </div>
  );
}

export default App;
