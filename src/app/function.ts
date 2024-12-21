type Difficulty = {     // 난이도 타입 지정
    colors: string[];
    bottles: number;
    emptyBottles: number;
  };
  
  const difficulties: Record<string, Difficulty> = {   // 난이도 설정
    easy: { colors: ['red', 'blue', 'green', 'yellow'], bottles: 4, emptyBottles: 1 },
    medium: { colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'], bottles: 6, emptyBottles: 2 },
    hard: { colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'lightblue', 'pink'], bottles: 8, emptyBottles: 2 },
  };
  
  let selectedDifficulty: string | null = null; // 선택된 난이도
  let selectedBottle: HTMLDivElement | null = null; // 선택된 병
  let moveHistory: { // 이동 기록
    fromBottle: HTMLDivElement;
    toBottle: HTMLDivElement;
    colors: HTMLDivElement[];
  }[] = [];
  
  document.querySelectorAll<HTMLButtonElement>('.difficulty-button').forEach(button => { // 난이도 버튼 토글속성 추가, 난이도 설정
    button.addEventListener('click', () => {
      document.querySelectorAll<HTMLButtonElement>('.difficulty-button').forEach(btn => btn.classList.remove('toggled'));
      button.classList.toggle('toggled');
  
      selectedDifficulty = button.id;
    });
  });
  
  document.addEventListener('DOMContentLoaded', () => { // 게임 시작, 이동 취소 버튼 이벤트 추가
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
  
  function startGame(difficulty: Difficulty): void { //
    const gameBoard = document.getElementById('game-board') as HTMLDivElement; // 게임 보드 불러오기
    gameBoard.innerHTML = '';  // 게임 보드 초기화
    const colors = [...difficulty.colors]; // 난이도에 따른 색상 설정
    const bottles: HTMLDivElement[] = []; // 병 설정
    gameBoard.style.display = 'flex';
  
    const colorPool: string[] = [];
    colors.forEach(color => {   // 색상 설정
      for (let i = 0; i < 4; i++) {
        colorPool.push(color);
      }
    });
  
    for (let i = colorPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));    // 색상 섞기
      [colorPool[i], colorPool[j]] = [colorPool[j], colorPool[i]];
    }
  
    for (let i = 0; i < difficulty.bottles; i++) {
      const bottleColors = colorPool.splice(0, 4); // 병 색상 설정
      bottles.push(createBottle(bottleColors));
    }
  
    for (let i = 0; i < difficulty.emptyBottles; i++) {
      bottles.push(createBottle([]));   // 빈 병 설정
    }
  
    bottles.forEach(bottle => {
      gameBoard.appendChild(bottle);    // 병 추가
    });
  
    moveHistory = [];
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
  
 
  
