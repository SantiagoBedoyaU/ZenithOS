import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Layout, Space, notification } from 'antd';
import { RedoOutlined, TrophyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Content } = Layout;

type Board = number[][];
type Direction = 'up' | 'down' | 'left' | 'right';
type Position = {
    i: number;
    j: number;
};

const Game2048: React.FC = () => {
    const [board, setBoard] = useState<Board>(getInitialBoard());
    const [score, setScore] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(false);

    // Initialize empty board and add two random tiles
    function getInitialBoard(): Board {
        const board: Board = Array(4).fill(null).map(() => Array(4).fill(0));
        return addRandomTile(addRandomTile(board));
    }

    // Add a new tile (2 or 4) to a random empty cell
    function addRandomTile(currentBoard: Board): Board {
        const emptyCells: Position[] = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (currentBoard[i][j] === 0) {
                    emptyCells.push({ i, j });
                }
            }
        }

        if (emptyCells.length > 0) {
            const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const newBoard: Board = currentBoard.map(row => [...row]);
            newBoard[i][j] = Math.random() < 0.9 ? 2 : 4;
            return newBoard;
        }
        return currentBoard;
    }

    // Check if any moves are possible
    function isGameOver(board: Board): boolean {
        // Check for empty cells
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] === 0) return false;
            }
        }

        // Check for possible merges
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (
                    (i < 3 && board[i][j] === board[i + 1][j]) ||
                    (j < 3 && board[i][j] === board[i][j + 1])
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    // Move and merge tiles in a given direction
    function moveTiles(direction: Direction): void {
        let newBoard: Board = board.map(row => [...row]);
        let moved = false;
        let newScore = score;

        const moveLeft = (board: Board): Board => {
            for (let i = 0; i < 4; i++) {
                let row = board[i].filter(cell => cell !== 0);
                for (let j = 0; j < row.length - 1; j++) {
                    if (row[j] === row[j + 1]) {
                        row[j] *= 2;
                        newScore += row[j];
                        row.splice(j + 1, 1);
                    }
                }
                const newRow = row.concat(Array(4 - row.length).fill(0));
                if (JSON.stringify(newRow) !== JSON.stringify(board[i])) {
                    moved = true;
                }
                board[i] = newRow;
            }
            return board;
        };

        const rotate = (board: Board): Board => {
            return board[0].map((_, index) =>
                board.map(row => row[index]).reverse()
            );
        };

        // Handle different directions by rotating the board
        if (direction === 'left') {
            newBoard = moveLeft(newBoard);
        } else if (direction === 'right') {
            newBoard = rotate(rotate(moveLeft(rotate(rotate(newBoard)))));
        } else if (direction === 'up') {
            newBoard = rotate(rotate(rotate(moveLeft(rotate(newBoard)))));
        } else if (direction === 'down') {
            newBoard = rotate(moveLeft(rotate(rotate(rotate(newBoard)))));
        }

        if (moved) {
            newBoard = addRandomTile(newBoard);
            setScore(newScore);
            setBoard(newBoard);
            if (isGameOver(newBoard)) {
                setGameOver(true);
                notification.info({
                    message: 'Game Over!',
                    description: `Final score: ${newScore}`,
                    placement: 'top',
                    duration: 0,
                });
            }
        }
    }

    // Handle keyboard events
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent): void => {
            if (gameOver) return;

            switch (e.key) {
                case 'ArrowLeft':
                    moveTiles('left');
                    break;
                case 'ArrowRight':
                    moveTiles('right');
                    break;
                case 'ArrowUp':
                    moveTiles('up');
                    break;
                case 'ArrowDown':
                    moveTiles('down');
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [board, gameOver]);

    // Reset game
    const resetGame = (): void => {
        setBoard(getInitialBoard());
        setScore(0);
        setGameOver(false);
        notification.destroy(); // Clear any existing notifications
    };

    // Get styles based on tile value
    const getTileStyles = (value: number): React.CSSProperties => {
        const colors: Record<number, { background: string; color: string }> = {
            2: { background: '#eee4da', color: '#776e65' },
            4: { background: '#ede0c8', color: '#776e65' },
            8: { background: '#f2b179', color: '#f9f6f2' },
            16: { background: '#f59563', color: '#f9f6f2' },
            32: { background: '#f67c5f', color: '#f9f6f2' },
            64: { background: '#f65e3b', color: '#f9f6f2' },
            128: { background: '#edcf72', color: '#f9f6f2' },
            256: { background: '#edcc61', color: '#f9f6f2' },
            512: { background: '#edc850', color: '#f9f6f2' },
            1024: { background: '#edc53f', color: '#f9f6f2' },
            2048: { background: '#edc22e', color: '#f9f6f2' },
        };

        const defaultStyle = { background: '#3c3a32', color: '#f9f6f2' };
        const styleForValue = colors[value] || defaultStyle;

        return {
            ...styleForValue,
            height: '80px',
            width: '80px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '4px',
            fontSize: value >= 100 ? '24px' : '28px',
            fontWeight: 'bold',
            transition: 'all 0.1s ease-in-out',
        };
    };

    return (
        <Content style={{ padding: '24px' }}>
            <Card
                style={{ maxWidth: 480, margin: '0 auto', background: '#bbada0' }}
                bodyStyle={{ padding: '16px' }}
            >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title level={2} style={{ margin: 0, color: '#776e65' }}>2048</Title>
                        <Space>
                            <Card size="small" style={{ background: '#bbada0' }}>
                                <Space align="center">
                                    <TrophyOutlined style={{ color: '#eee4da' }} />
                                    <Text strong style={{ color: '#eee4da' }}>Score: {score}</Text>
                                </Space>
                            </Card>
                            <Button
                                type="primary"
                                icon={<RedoOutlined />}
                                onClick={resetGame}
                                style={{ background: '#8f7a66', borderColor: '#8f7a66' }}
                            >
                                New Game
                            </Button>
                        </Space>
                    </div>

                    <div style={{
                        background: '#bbada0',
                        padding: '8px',
                        borderRadius: '6px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '8px',
                    }}>
                        {board.map((row, i) =>
                            row.map((cell, j) => (
                                <div
                                    key={`${i}-${j}`}
                                    style={getTileStyles(cell)}
                                >
                                    {cell !== 0 && cell}
                                </div>
                            ))
                        )}
                    </div>

                    <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                        Use arrow keys to move tiles. Combine similar numbers to reach 2048!
                    </Text>
                </Space>
            </Card>
        </Content>
    );
};

export default Game2048;