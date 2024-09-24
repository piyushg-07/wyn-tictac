"use client";

import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TicTacToe = () => {
  const [gridSize, setGridSize] = useState(3);
  const [winStreak, setWinStreak] = useState(3);
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [showSetup, setShowSetup] = useState(true);
  const [playerWins, setPlayerWins] = useState({ X: 0, O: 0 });
  const [gamesPlayed, setGamesPlayed] = useState(0);

  useEffect(() => {
    initializeBoard();
  }, [gridSize]);

  const initializeBoard = () => {
    const newBoard = Array(gridSize)
      .fill()
      .map(() => Array(gridSize).fill(""));
    setBoard(newBoard);
    setCurrentPlayer("X");
    setWinner(null);
    setIsDraw(false);
  };

  const handleCellClick = (row, col) => {
    if (board[row][col] === "" && !winner && !isDraw) {
      const newBoard = [...board];
      newBoard[row][col] = currentPlayer;
      setBoard(newBoard);

      if (checkWinner(row, col)) {
        setWinner(currentPlayer);
        setPlayerWins((prevWins) => ({
          ...prevWins,
          [currentPlayer]: prevWins[currentPlayer] + 1,
        }));
        setGamesPlayed((prevGames) => prevGames + 1);
      } else if (checkDraw()) {
        setIsDraw(true);
        setGamesPlayed((prevGames) => prevGames + 1);
      } else {
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      }
    }
  };

  const checkWinner = (row, col) => {
    const directions = [
      [1, 0],
      [0, 1],
      [1, 1],
      [1, -1],
    ];

    return directions.some(([dx, dy]) => {
      return (
        checkDirection(row, col, dx, dy) +
          checkDirection(row, col, -dx, -dy) -
          1 >=
        winStreak
      );
    });
  };

  const checkDirection = (row, col, dx, dy) => {
    let count = 0;
    while (
      row >= 0 &&
      row < gridSize &&
      col >= 0 &&
      col < gridSize &&
      board[row][col] === currentPlayer
    ) {
      count++;
      row += dx;
      col += dy;
    }
    return count;
  };

  const checkDraw = () => {
    return board.every((row) => row.every((cell) => cell !== ""));
  };

  const handleSetup = (e) => {
    e.preventDefault();
    setShowSetup(false);
    initializeBoard();
  };

  const resetGame = () => {
    setShowSetup(true);
    setGamesPlayed(0);
    setPlayerWins({ X: 0, O: 0 });
  };

  const playAgain = () => {
    if (gamesPlayed < winStreak) {
      initializeBoard();
    } else {
      resetGame();
    }
  };
  //   const startGame = () => {
  //     setShowSetup(true);
  //   };

  if (showSetup) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleSetup}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold mb-4">Tic-Tac-Toe Setup</h2>
          <div className="mb-4">
            <Label htmlFor="gridSize">Grid Size (3-10):</Label>
            <Input
              type="number"
              id="gridSize"
              value={gridSize}
              onChange={(e) =>
                setGridSize(
                  Math.max(3, Math.min(10, parseInt(e.target.value) || 3))
                )
              }
              min="3"
              max="10"
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="winStreak">Win Streak (3-{gridSize}):</Label>
            <Input
              type="number"
              id="winStreak"
              value={winStreak}
              onChange={(e) =>
                setWinStreak(
                  Math.max(3, Math.min(gridSize, parseInt(e.target.value) || 3))
                )
              }
              min="3"
              max={gridSize}
              required
            />
          </div>
          <Button type="submit">Start Game</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Tic-Tac-Toe</h1>
      <div className="mb-4">
        <p>Current Player: {currentPlayer}</p>
      </div>
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              className="w-12 h-12 text-xl font-bold"
              disabled={cell !== "" || winner || isDraw}
            >
              {cell}
            </Button>
          ))
        )}
      </div>
      {winner && <div className="text-xl font-bold">Winner: {winner}</div>}
      {isDraw && <div className="text-xl font-bold">Its a Draw!</div>}
      <div className="mt-4">
        <Button onClick={playAgain} className="mr-4">
          Play Again
        </Button>
        <Button onClick={resetGame}>Restart Game</Button>
      </div>
      <div className="shadow-md rounded-lg border-cyan-300 w-96">
        <div className="mt-4 p-4 bg-white  rounded-lg">
          <h3 className="text-xl font-bold">Player Wins</h3>
          <div>Player X: {playerWins.X} Wins</div>
          <div>Player O: {playerWins.O} Wins</div>
        </div>
      </div>
      <div className="shadow-md rounded-lg border-cyan-300 w-96">
        <div className="mt-4 p-4 bg-white  rounded-lg">
          <h3 className="text-xl font-bold">Games Played</h3>
          <div>
            {gamesPlayed} / {winStreak}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;
