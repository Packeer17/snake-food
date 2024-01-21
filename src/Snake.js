import React, { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 20;
const DEFAULT_SPEED = 200;


function generateRandomPosition() {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }

const SnakeGame = () => {
  let gridArray = Array(GRID_SIZE).fill(0).map(el=>Array(GRID_SIZE).fill(false))
  const [grid, setGrid] = useState(gridArray);
  const [snake, setSnake] = useState([{ x: 6, y: 6 }, { x: 6, y: 6 }, { x: 6, y: 6 }]);
  const [food, setFood] = useState(generateRandomPosition());
  const [direction, setDirection] = useState('RIGHT');
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [speedCounter, setSpeedCounter] = useState(0);
  const foodCounter = useRef(0);
  const X = 5;

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, speed);

    return () => clearInterval(gameInterval);
  }, [snake, speed]);

  useEffect(() => {
    handleKeyPress();
  }, [direction]);

  function moveSnake() {
    const newSnake = snake.map((seg) => ({ ...seg }));
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'UP':
        head.y = (head.y - 1 + GRID_SIZE) % GRID_SIZE;
        break;
      case 'DOWN':
        head.y = (head.y + 1) % GRID_SIZE;
        break;
      case 'LEFT':
        head.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE;
        break;
      case 'RIGHT':
        head.x = (head.x + 1) % GRID_SIZE;
        break;
      default:
        break;
    }

    if (checkCollision(newSnake) || checkBorderCollision(head)) {
      alert('Game Over! Collided with border or snake');
      initializeGame();
      setSpeed(DEFAULT_SPEED);
      foodCounter.current = 0;
      setSpeedCounter(0);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood(generateRandomPosition());
      foodCounter.current += 1;
      setSpeedCounter((prev) => prev + 1);

      if (speedCounter === X) {
        setSpeed((prev) => Math.max(50, prev - 20));
        setSpeedCounter(0);
      }
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }

  function checkCollision(snake) {
    const head = snake[0];
    return snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y);
  }

  function checkBorderCollision(head) {
    return head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
  }

  function handleKeyPress() {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection('UP');
          break;
        case 'ArrowDown':
          setDirection('DOWN');
          break;
        case 'ArrowLeft':
          setDirection('LEFT');
          break;
        case 'ArrowRight':
          setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }

  function initializeGame() {
    setSnake([{ x: 5, y: 5 }, { x: 5, y: 5 }, { x: 5, y: 5 }]);
    setFood(generateRandomPosition());
  }

  return (
    <div>
      <table>
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  className={`cell ${snake.some((segment) => segment.x === colIndex && segment.y === rowIndex) ? 'snake' : ''} ${
                    food.x === colIndex && food.y === rowIndex ? 'food' : ''
                  }`}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SnakeGame;
