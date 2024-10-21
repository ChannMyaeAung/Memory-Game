import React, { useEffect, useState } from "react";

export default function MemoryGame() {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);

  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);

  const [disabled, setDisabled] = useState(false);

  const [moves, setMoves] = useState(0); // State to track the number of moves
  const [maxMoves, setMaxMoves] = useState(16);

  const [won, setWon] = useState(false);

  const handleGridSizeChange = (e) => {
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 10) {
      // Ensure the grid size is within valid range

      // Update the grid size state
      setGridSize(size);
    }
  };

  const initializeGame = () => {
    // the total cards will be the same as the double grid size (4 row x 4 col = 8)
    const totalCards = gridSize * gridSize;

    // We are going to have 2 same values so the total pair count will be half the total cards
    const pairCount = Math.floor(totalCards / 2);

    // We don't want to start from 0, so n + 1 for each number in the array.
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);

    // To shuffle the cards. Math.random() - 0.5 will generate random numbers on every run.
    // Will generate an array with objects including {id: 1, number: 1} in this format.
    const shuffledCards = [...numbers, ...numbers] // Duplicate numbers for pairs
      .sort(() => Math.random() - 0.5) // Shuffle the cards
      .slice(0, totalCards) // Ensure the total number of cards matches grid size
      .map((number, index) => ({
        id: index, // Assign unique ID to each card
        number, // Assign number to each card
      }));

    setCards(shuffledCards); // Update the cards state

    // reset all when a new game start
    setFlipped([]);
    setSolved([]);
    setWon(false);
    setMoves(0);
    setMaxMoves(gridSize * gridSize + 2);
  };

  const checkMatch = (secondId) => {
    const [firstId] = flipped; // Get the first flipped card ID

    // Check if cards match
    if (cards[firstId].number === cards[secondId].number) {
      // if they do, update solved cards state
      setSolved((prevSolved) => [...prevSolved, firstId, secondId]);
      setFlipped([]); // Reset flipped cards state
      setDisabled(false); // Enable clicks
    } else {
      // if they don't reset flipped cards state and enable clicks after 1 second delay
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };

  const handleClick = (id) => {
    // Ignore clicks if disabled or game is won or maximum moves is reached
    if (disabled || won || moves >= maxMoves) return;

    if (flipped.length === 0) {
      setFlipped([id]);
      setMoves((prevMoves) => prevMoves + 1);
      return;
    }

    if (flipped.length === 1) {
      setDisabled(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        setMoves((prevMoves) => prevMoves + 1);
        // check match logic
        checkMatch(id);
      } else {
        // if we click on the same button twice, flip the card again.
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  const handleMaxMoves = (e) => {
    const totalMoves = parseInt(e.target.value);
    if (totalMoves >= 4 && totalMoves <= 100) {
      setMaxMoves(totalMoves);
    }
  };

  // check if card is flipped or solved and moves are within limit
  const isFlipped = (id) =>
    (moves < maxMoves && flipped.includes(id)) || solved.includes(id);

  const isSolved = (id) => solved.includes(id);

  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  useEffect(() => {
    // if all the cards in the solved array
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
    }
  }, [solved, cards]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold">Memory Game</h1>
      {/* Input */}
      <div>
        <label htmlFor="gridSize" className="mr-2 text-base">
          Grid Size: (max 10)
        </label>
        <input
          type="number"
          id="gridSize"
          min="2"
          max="10"
          value={gridSize}
          onChange={handleGridSizeChange}
          className="px-2 py-1 border-2 border-gray-300 rounded"
        />

        <label htmlFor="maxMoves" className="ml-2 text-base">
          Maximum Moves Allowed:{" "}
        </label>
        <input
          type="number"
          id="maxMoves"
          min="4"
          max="100"
          value={maxMoves}
          onChange={handleMaxMoves}
          className="px-2 py-1 border-2 border-gray-300 rounded"
        />
      </div>
      <div className="mt-4 text-xl">
        Moves: {moves} / {maxMoves}
      </div>
      {/* Game Board */}
      <div
        className={`grid gap-2 mt-4`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          width: `min(100%, ${gridSize * 5.5}rem)`,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleClick(card.id)}
            className={`flex items-center justify-center text-xl font-bold  transition-all duration-300  rounded-lg cursor-pointer aspect-square ${
              isFlipped(card.id)
                ? isSolved(card.id)
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white"
                : "text-gray-400 bg-gray-300"
            } `}
          >
            {isFlipped(card.id) ? card.number : "?"}
          </div>
        ))}
      </div>
      {/* Result */}
      {won && (
        <div className="mt-4 text-4xl font-bold text-green-600 animate-bounce">
          You Won!
        </div>
      )}
      {/* If max moves is reached and is not won yet */}
      {moves >= maxMoves && !won && (
        <div className="mt-4 text-4xl font-bold text-red-600">
          Game Over! Maximum moves reached.
        </div>
      )}
      {/* Reset/Play again Btn */}
      <button
        onClick={initializeGame}
        className="px-4 py-2 mt-4 text-white transition-all bg-green-500 rounded hover:bg-green-600"
      >
        {won || moves >= maxMoves ? "Play Again" : "Reset"}
      </button>
    </div>
  );
}
