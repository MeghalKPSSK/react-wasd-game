import React, { useState, useEffect, useRef } from "react";
import "./game.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp, faVolumeMute } from "@fortawesome/free-solid-svg-icons";

// Audio
const gameOverSound1 = new Audio("/game-over-1.mp3");
const gameOverSound2 = new Audio("/game-over-2.mp3");
const eatSound = new Audio("/snake-eat.mp3");
const eatMegaSound = new Audio("/snake-eat-mega.mp3");

const Game = () => {
    const [snake, setSnake] = useState([[10, 10], [10, 9], [10, 8]]);
    const [food, setFood] = useState([15, 15]);
    const [megaMeal, setMegaMeal] = useState(null);
    const [direction, setDirection] = useState("RIGHT");
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [musicOn, setMusicOn] = useState(false);
    const [foodCount, setFoodCount] = useState(0);

    const megaMealTimeout = useRef(null);

    const spawnFood = () => {
        return [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)];
    };

    const spawnMegaMeal = () => {
        const newMega = spawnFood();
        setMegaMeal(newMega);

        // Clear previous timeout if exists
        if (megaMealTimeout.current) clearTimeout(megaMealTimeout.current);

        // Set timeout to remove after 5 seconds
        megaMealTimeout.current = setTimeout(() => {
            setMegaMeal(null);
            megaMealTimeout.current = null;
        }, 10000);
    };

    const moveSnake = () => {
        const newSnake = [...snake];
        const head = [...newSnake[newSnake.length - 1]];

        switch (direction) {
            case "UP":
                head[1] -= 1;
                break;
            case "DOWN":
                head[1] += 1;
                break;
            case "LEFT":
                head[0] -= 1;
                break;
            case "RIGHT":
                head[0] += 1;
                break;
            default:
                break;
        }

        head[0] = (head[0] + 20) % 20;
        head[1] = (head[1] + 20) % 20;
        newSnake.push(head);

        const ateFood = head[0] === food[0] && head[1] === food[1];
        const ateMega = megaMeal && head[0] === megaMeal[0] && head[1] === megaMeal[1];

        if (ateFood) {
            if (musicOn) eatSound.play();
            setFood(spawnFood());
            setScore(prev => prev + 10);
            setFoodCount(prev => {
                const newCount = prev + 1;
                if (newCount % 5 === 0) spawnMegaMeal();
                return newCount;
            });
        } else if (ateMega) {
            if (musicOn) eatMegaSound.play();
            setMegaMeal(null);
            setScore(prev => prev + 50);

            // Clear mega meal timeout
            if (megaMealTimeout.current) {
                clearTimeout(megaMealTimeout.current);
                megaMealTimeout.current = null;
            }
        } else {
            newSnake.shift();
        }

        const collided = newSnake.slice(0, -1).some(seg => seg[0] === head[0] && seg[1] === head[1]);
        if (collided) {
            setGameOver(true);
            if (musicOn) {
                const randomSound = Math.random() < 0.5 ? gameOverSound1 : gameOverSound2;
                randomSound.play();
            }
        } else {
            setSnake(newSnake);
        }
    };

    const Restart = () => {
        setSnake([[10, 10], [10, 9], [10, 8]]);
        setFood(spawnFood());
        setMegaMeal(null);
        setDirection("RIGHT");
        setGameOver(false);
        setScore(0);
        setFoodCount(0);
        setGameStarted(true);

        if (megaMealTimeout.current) {
            clearTimeout(megaMealTimeout.current);
            megaMealTimeout.current = null;
        }
    };

    const changeDirection = (e) => {
        const key = e.key.toLowerCase();
        const newDirection = {
            w: "UP",
            s: "DOWN",
            a: "LEFT",
            d: "RIGHT"
        }[key];

        const opposite = {
            UP: "DOWN",
            DOWN: "UP",
            LEFT: "RIGHT",
            RIGHT: "LEFT"
        };

        if (newDirection && newDirection !== opposite[direction]) {
            setDirection(newDirection);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", changeDirection);
        return () => document.removeEventListener("keydown", changeDirection);
    }, [direction]);

    useEffect(() => {
        if (gameStarted && !gameOver) {
            const interval = setInterval(moveSnake, 200);
            return () => clearInterval(interval);
        }
    }, [snake, direction, gameOver, gameStarted]);

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            if (megaMealTimeout.current) clearTimeout(megaMealTimeout.current);
        };
    }, []);

    return (
        <div id="snake-game" className="game-area">
            {!gameStarted ? (
                <div className="start-screen" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <button onClick={() => setGameStarted(true)}>Start Game</button>
                    <div style={{ marginTop: "10px" }}>
                        <i className="icon" onClick={() => setMusicOn(!musicOn)}>
                            <FontAwesomeIcon icon={musicOn ? faVolumeUp : faVolumeMute} />
                        </i>
                    </div>
                </div>
            ) : gameOver ? (
                <>
                    <div className="game-over">Game Over</div>
                    <div className="score">Score: {score}</div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <button onClick={Restart}>Play Again</button>
                        <div style={{ marginTop: "10px" }}>
                            <i className="icon" onClick={() => setMusicOn(!musicOn)}>
                                <FontAwesomeIcon icon={musicOn ? faVolumeUp : faVolumeMute} />
                            </i>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="snake">
                        {snake.map((segment, index) => (
                            <div
                                key={index}
                                className={index === snake.length - 1 ? "snake-head" : "snake-segment"}
                                style={{
                                    left: `${segment[0] * 20}px`,
                                    top: `${segment[1] * 20}px`,
                                }}
                            ></div>
                        ))}
                    </div>
                    <div
                        className="food"
                        style={{
                            left: `${food[0] * 20}px`,
                            top: `${food[1] * 20}px`,
                        }}
                    ></div>
                    {megaMeal && (
                        <div
                            className="mega-meal"
                            style={{
                                left: `${megaMeal[0] * 20}px`,
                                top: `${megaMeal[1] * 20}px`,
                            }}
                        ></div>
                    )}
                </>
            )}
        </div>
    );
};

export default Game;
