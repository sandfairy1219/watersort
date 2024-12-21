type Difficulty = {
    colors: string[];
    bottles: number;
    emptyBottles: number;
  };
  
  const difficulties: Record<string, Difficulty> = {
    easy: { colors: ['red', 'blue', 'green', 'yellow'], bottles: 4, emptyBottles: 1 },
    medium: { colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'], bottles: 6, emptyBottles: 2 },
    hard: { colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'lightblue', 'pink'], bottles: 8, emptyBottles: 2 },
  };
  
  let selectedDifficulty: string | null = null;
  let selectedBottle: HTMLDivElement | null = null;
  let moveHistory: {
    fromBottle: HTMLDivElement;
    toBottle: HTMLDivElement;
    colors: HTMLDivElement[];
  }[] = [];
  
  document.querySelectorAll<HTMLButtonElement>('.difficulty-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll<HTMLButtonElement>('.difficulty-button').forEach(btn => btn.classList.remove('toggled'));
      button.classList.toggle('toggled');
  
      selectedDifficulty = button.id;
    });
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start') as HTMLButtonElement;
    const undoButton = document.getElementById('undo') as HTMLButtonElement;
  
    startButton.addEventListener('click', () => {
      if (!selectedDifficulty) {
        alert('Please select a difficulty level.');
        return;
      }
      startGame(difficulties[selectedDifficulty]);
    });
  
    undoButton.addEventListener('click', undoMove);
  });
  
  function startGame(difficulty: Difficulty): void {
    const gameBoard = document.getElementById('game-board') as HTMLDivElement;
    gameBoard.innerHTML = '';
    const colors = [...difficulty.colors];
    const bottles: HTMLDivElement[] = [];
    gameBoard.style.display = 'flex';
  
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
      bottles.push(createBottle(bottleColors));
    }
  
    for (let i = 0; i < difficulty.emptyBottles; i++) {
      bottles.push(createBottle([]));
    }
  
    bottles.forEach(bottle => {
      gameBoard.appendChild(bottle);
    });
  
    moveHistory = [];
    checkGameClear();
  }
  
  function createBottle(colors: string[]): HTMLDivElement {
    const bottle = document.createElement('div');
    bottle.classList.add('bottle');
    bottle.addEventListener('click', () => selectBottle(bottle, colors));
  
    colors.forEach((color, index) => {
      const colorDiv = document.createElement('div');
      colorDiv.classList.add('color');
      colorDiv.style.backgroundColor = color;
      colorDiv.style.bottom = `${index * 25}%`;
      bottle.appendChild(colorDiv);
    });
  
    return bottle;
  }
  
  function selectBottle(bottle: HTMLDivElement, bottleColors: string[]): void {
    if (selectedBottle) {
      if (selectedBottle === bottle) {
        selectedBottle.classList.remove('selected');
        selectedBottle = null;
      } else {
        moveColor(selectedBottle, bottle);
        selectedBottle.classList.remove('selected');
        selectedBottle = null;
      }
    } else {
      selectedBottle = bottle;
      bottle.classList.add('selected');
    }
  }
  
  function moveColor(fromBottle: HTMLDivElement, toBottle: HTMLDivElement): void {
    const fromColors = Array.from(fromBottle.children) as HTMLDivElement[];
    const toColors = Array.from(toBottle.children) as HTMLDivElement[];
  
    if (fromColors.length === 0 || toColors.length >= 4) return;
  
    const colorToMove = fromColors[fromColors.length - 1].style.backgroundColor;
  
    if (toColors.length === 0 || toColors[toColors.length - 1].style.backgroundColor === colorToMove) {
      let moveCount = 0;
      for (let i = fromColors.length - 1; i >= 0; i--) {
        if (fromColors[i].style.backgroundColor === colorToMove) {
          moveCount++;
        } else {
          break;
        }
      }
  
      const move = {
        fromBottle,
        toBottle,
        colors: [] as HTMLDivElement[],
      };
  
      for (let i = 0; i < moveCount; i++) {
        if (toColors.length + i >= 4) break;
        const colorDiv = fromBottle.removeChild(fromBottle.lastChild!) as HTMLDivElement;
        move.colors.push(colorDiv);
        toBottle.appendChild(colorDiv);
        colorDiv.style.bottom = `${(toColors.length + i) * 25}%`;
      }
  
      moveHistory.push(move);
    }
  }
  
  function undoMove(): void {
    if (moveHistory.length === 0) return;
  
    const lastMove = moveHistory.pop()!;
    const { fromBottle, toBottle, colors } = lastMove;
  
    colors.reverse().forEach(colorDiv => {
      toBottle.removeChild(colorDiv);
      fromBottle.appendChild(colorDiv);
      colorDiv.style.bottom = `${(fromBottle.children.length - 1) * 25}%`;
    });
  }
  
  function checkGameClear(): void {
    // 게임 종료 조건을 체크하는 로직 추가 (현재 구현 필요)
  }
  