import { useEffect } from 'react';

const useGameLogic = () => {
    useEffect(() => {
        const gameContainer = document.getElementById('game-container') as HTMLElement;
        const waitingScreen = document.getElementById('waiting-screen') as HTMLElement;
        const startButton = document.getElementById('start-button') as HTMLButtonElement;
        const resetButton = document.getElementById('reset-button') as HTMLButtonElement;
        const clearMessage = document.getElementById('clear-message') as HTMLElement;
        const bottlesContainer = document.getElementById('bottles-container') as HTMLElement;
        let selectedBottle: HTMLElement | null = null;
        let gameActive = true;

        // Example bottles data with two empty bottles
        let bottles: string[][] = [
            ['red', 'blue', 'green', 'yellow'],
            ['blue', 'green', 'yellow', 'red'],
            ['green', 'yellow', 'red', 'blue'],
            ['yellow', 'red', 'blue', 'green'],
            [], // Empty bottle
            []  // Empty bottle
        ];

        // Function to create a bottle element
        function createBottle(colors: string[]): HTMLElement {
            const bottle = document.createElement('div');
            bottle.classList.add('bottle');

            colors.forEach(color => {
                const water = document.createElement('div');
                water.classList.add('water');
                water.style.backgroundColor = color;
                water.style.height = '25%';
                bottle.appendChild(water);
            });

            bottle.addEventListener('click', () => {
                if (gameActive) handleBottleClick(bottle);
            });
            return bottle;
        }

        // Handle bottle click
        function handleBottleClick(bottle: HTMLElement): void {
            if (selectedBottle) {
                if (selectedBottle !== bottle) {
                    pourWater(selectedBottle, bottle);
                }
                selectedBottle.classList.remove('selected');
                selectedBottle = null;
            } else {
                selectedBottle = bottle;
                selectedBottle.classList.add('selected');
            }
        }

        // Pour water from one bottle to another
        function pourWater(fromBottle: HTMLElement, toBottle: HTMLElement): void {
            const fromWaters = Array.from(fromBottle.querySelectorAll('.water')) as HTMLElement[];
            const toWaters = Array.from(toBottle.querySelectorAll('.water')) as HTMLElement[];
            const toBottleWaterCount = toWaters.length;

            if (fromWaters.length === 0 || toBottleWaterCount >= 4) return;

            const fromColor = fromWaters[fromWaters.length - 1].style.backgroundColor;
            const toColor = toWaters.length > 0 ? toWaters[toWaters.length - 1].style.backgroundColor : null;

            if (toColor && fromColor !== toColor) return;

            let moveCount = 0;

            for (let i = fromWaters.length - 1; i >= 0; i--) {
                if (fromWaters[i].style.backgroundColor === fromColor) {
                    moveCount++;
                } else {
                    break;
                }
            }

            if (toBottleWaterCount + moveCount > 4) return;

            for (let i = 0; i < moveCount; i++) {
                const water = fromBottle.querySelector('.water:last-child') as HTMLElement;
                fromBottle.removeChild(water);
                toBottle.appendChild(water);
            }

            checkGameCompletion();
        }

        // Check if the game is completed
        function checkGameCompletion(): void {
            let completed = true;
            bottles.forEach(colors => {
                if (colors.length > 0 && new Set(colors).size !== 1) {
                    completed = false;
                }
            });

            if (completed) {
                gameActive = false;
                clearMessage.style.display = 'block';
            }
        }

        // Shuffle array
        function shuffle(array: any[]): void {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        // Reset game
        function resetGame(): void {
            gameActive = true;
            clearMessage.style.display = 'none';
            bottles = [
                ['red', 'blue', 'green', 'yellow'],
                ['blue', 'green', 'yellow', 'red'],
                ['green', 'yellow', 'red', 'blue'],
                ['yellow', 'red', 'blue', 'green'],
                [], // Empty bottle
                []  // Empty bottle
            ];

            // Flatten and shuffle colors
            const colors = bottles.flat().filter(color => color);
            shuffle(colors);

            // Reassign shuffled colors to bottles
            let colorIndex = 0;
            for (let i = 0; i < bottles.length; i++) {
                if (bottles[i].length > 0) {
                    for (let j = 0; j < bottles[i].length; j++) {
                        bottles[i][j] = colors[colorIndex++];
                    }
                }
            }

            // Clear and render bottles
            bottlesContainer.innerHTML = '';
            bottles.forEach(colors => {
                const bottle = createBottle(colors);
                bottlesContainer.appendChild(bottle);
            });
        }

        // Start game
        function startGame(): void {
            waitingScreen.style.display = 'none';
            gameContainer.style.display = 'flex';
            resetGame();
        }

        // Add event listener to start button
        startButton.addEventListener('click', startGame);

        // Add event listener to reset button
        resetButton.addEventListener('click', resetGame);

        // Add event listeners to difficulty buttons
        document.querySelectorAll('.difficulty-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const target = event.target as HTMLElement;
                const difficulty = target.getAttribute('data-difficulty');
                console.log(`Selected difficulty: ${difficulty}`);
                // Adjust game settings based on difficulty if needed

                // Toggle active class
                document.querySelectorAll('.difficulty-button').forEach(btn => btn.classList.remove('active'));
                target.classList.add('active');
            });
        });
    }, []);

    return null;
};

export default useGameLogic;
