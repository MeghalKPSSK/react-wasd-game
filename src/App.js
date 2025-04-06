import logo from './logo.svg';
import './App.css';
import Game from './components/game';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Hello, Snake Game! Get ready to play!</p>
        <p>Press the arrow keys to control the snake!</p>
        <Game />
      </header>
    </div>
  );
}

export default App;
