"use client";
import { useEffect, useState } from 'react';

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultyConfig {
  colors: string[];
  bottles: number;
  emptyBottles: number;
}

const difficulties: Record<Difficulty, DifficultyConfig> = {
  easy: { colors: ['red', 'blue', 'green', 'yellow'], bottles: 4, emptyBottles: 2 },
  medium: { colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'], bottles: 6, emptyBottles: 2 },
  hard: { colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'lightblue', 'pink'], bottles: 8, emptyBottles: 2 }
};

interface Move {
  fromIndex: number;
  toIndex: number;
  colors: string[];
}

const isGameComplete = (bottles: string[][]): boolean => {
  return bottles.every(bottle => bottle.length === 0 || (new Set(bottle).size === 1 && bottle.length === 4));
};

export default function Home() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [bottles, setBottles] = useState<string[][]>([]);
  const [selectedBottle, setSelectedBottle] = useState<number | null>(null);
  const [time, setTime] = useState<number>(0);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isGameStarted && isGameComplete(bottles)) {
      let baseScore = 0;
      if (selectedDifficulty === 'easy') {
        baseScore = 40;
      } else if (selectedDifficulty === 'medium') {
        baseScore = 50;
      } else if (selectedDifficulty === 'hard') {
        baseScore = 60;
      }
      const finalScore = baseScore - time;
      alert(`게임 종료. 점수는 ${finalScore}입니다.`);
    }
  }, [bottles, isGameStarted]);

  const startGame = (difficulty: DifficultyConfig | null) => {
    if (!difficulty) {
      alert('난이도를 선택해주세요.');
      return;
    }
    console.log('game loaded');
    const colors = [...difficulty.colors];
    const newBottles: string[][] = [];

    const colorPool: string[] = [];
    colors.forEach(color => {
      for (let i = 0; i < 4; i++) {
        colorPool.push(color);
      }
    });

    for (let i = colorPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colorPool[i], colorPool[j]] = [colorPool[j], colorPool[i]];
    }

    for (let i = 0; i < difficulty.bottles; i++) {
      const bottleColors = colorPool.splice(0, 4);
      newBottles.push(bottleColors);
    }

    for (let i = 0; i < difficulty.emptyBottles; i++) {
      newBottles.push([]);
    }

    setBottles(newBottles);
    setMoveHistory([]);
    setTime(0);
    setIsGameStarted(true);
  };

  const moveColor = (fromIndex: number, toIndex: number) => {
    const newBottles = [...bottles];
    const fromBottle = newBottles[fromIndex];
    const toBottle = newBottles[toIndex];

    if (fromBottle.length === 0 || toBottle.length >= 4) return;

    const colorToMove = fromBottle[fromBottle.length - 1];

    // 이동할 병의 맨 위 색과 이동할 색이 같은지 확인
    if (toBottle.length > 0 && toBottle[toBottle.length - 1] !== colorToMove) return;

    let moveCount = 0;

    for (let i = fromBottle.length - 1; i >= 0; i--) {
      if (fromBottle[i] === colorToMove) {
        moveCount++;
      } else {
        break;
      }
    }

    const move: Move = {
      fromIndex,
      toIndex,
      colors: []
    };

    for (let i = 0; i < moveCount; i++) {
      if (toBottle.length >= 4) break;
      move.colors.push(fromBottle.pop()!);
      toBottle.push(colorToMove);
    }

    setMoveHistory([...moveHistory, move]);
    setBottles(newBottles);
  };

  const selectBottle = (bottleIndex: number) => {
    if (selectedBottle !== null) {
      if (selectedBottle === bottleIndex) {
        setSelectedBottle(null);
      } else {
        moveColor(selectedBottle, bottleIndex);
        setSelectedBottle(null);
      }
    } else {
      setSelectedBottle(bottleIndex);
    }
  };

  const undoMove = () => {
    if (moveHistory.length === 0) return;

    const lastMove = moveHistory.pop()!;
    const { fromIndex, toIndex, colors } = lastMove;

    const newBottles = [...bottles];
    const fromBottle = newBottles[fromIndex];
    const toBottle = newBottles[toIndex];

    colors.reverse().forEach(() => {
      fromBottle.push(toBottle.pop()!);
    });

    setMoveHistory([...moveHistory]);
    setBottles(newBottles);
  };

  useEffect(() => {
    const handleDifficultyClick = (event: Event) => {
      const target = event.target as HTMLButtonElement; // target을 HTMLButtonElement로 캐스팅
      document.querySelectorAll('.difficulty-button').forEach(btn => btn.classList.remove('toggled'));
      target.classList.toggle('toggled');
      setSelectedDifficulty(target.id as Difficulty); // id를 Difficulty 타입으로 캐스팅
    };
  
    const buttons = document.querySelectorAll<HTMLButtonElement>('.difficulty-button'); // 버튼 목록에 타입 지정
    buttons.forEach(button => {
      button.addEventListener('click', handleDifficultyClick as EventListener); // 핸들러를 EventListener로 캐스팅
    });
  
    return () => {
      buttons.forEach(button => {
        button.removeEventListener('click', handleDifficultyClick as EventListener); // 제거 시에도 동일하게 캐스팅
      });
    };
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-16 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]" id='bod'>
      <p className="text-center" id='title'>Water Sort Game</p>
      <div id="game-board">
        {bottles.map((bottleColors, index) => (
          <div key={index} className={`bottle ${selectedBottle === index ? 'selected' : ''}`} onClick={() => selectBottle(index)}>
            {bottleColors.map((color, colorIndex) => (
              <div key={colorIndex} className="color" style={{ backgroundColor: color, bottom: `${colorIndex * 25}%` }}></div>
            ))}
          </div>
        ))}
      </div>
      <div id="btncontainer">
        <button className="difficulty-button btn btn-success" id="easy">Easy</button>
        <button className="difficulty-button btn btn-warning" id="medium">Medium</button>
        <button className="difficulty-button btn btn-danger" id='hard'>Hard</button>
        <button id="start" onClick={() => {
          if (!selectedDifficulty) {
            alert('난이도를 선택해주세요.');
            return;
          }
          startGame(difficulties[selectedDifficulty]);
        }}>Start</button>
        <button id="undo" onClick={undoMove}>Undo</button>
      </div>
    </div>
  );
}
