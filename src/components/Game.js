import React, { Component } from 'react';
import Board from './Board';
import Legend from './Legend';
var sudoku = require('../utils/sudoku');
var _ = require('lodash');

class Game extends Component {
    constructor(props) {
        super(props);
        const puzzle = sudoku.makepuzzle();
        this.state = {
            history: [{
                puzzle: puzzle,
                location: Array(2).fill(null),
                invalidIndex: null
            }],
            solvePuzzle: sudoku.solvepuzzle(puzzle),
            clickedIndex: null,
            highlightNumber: null,
            stepNumber: 0
        };
    }

    handleBoardClick(index) {
        if (this.state.history[this.state.stepNumber].invalidIndex !== null
            || _.isEqual(this.state.history[this.state.stepNumber].puzzle, this.state.solvePuzzle)) {
            return;
        }

        const puzzle = this.state.history[0].puzzle;
        if (puzzle[index] !== null) {
            this.setState({
                highlightNumber: puzzle[index] + 1,
                clickedIndex: null
            });
        } else {
            this.setState({
                highlightNumber: null,
                clickedIndex: index
            });
        }
    }

    handleLegendClick(value) {
        this.setState({
            highlightNumber: value,
            clickedIndex: null
        });
    }

    handleKeyDown(e, index) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const currentPuzzle = current.puzzle.slice();
        let location = current.location.slice();

        //backspace, delete
        if (e.keyCode == 8 || e.keyCode == 46) {
            currentPuzzle[index] = null;
            location = [Math.floor(index / 9) + 1, (index % 9) + 1];
            current.puzzle = currentPuzzle;
            current.location = location;
            current.invalidIndex = null;
            this.setState({
                history: history
            });
        }
        // ENTER, ESC
        else if (e.keyCode == 13 || e.keyCode == 27) {
            this.setState({
                clickedIndex: null
            });
        }// digits between 1-9
        else if (e.keyCode >= 49 && e.keyCode <= 57) {
            let number = e.keyCode - 48;
            currentPuzzle[index] = number - 1;
            location = [Math.floor(index / 9) + 1, (index % 9) + 1];
            let invalidIndex = this.validateCell(index, currentPuzzle[index]) ? null : index;
            if (_.isEqual(current.location, location)) {
                current.puzzle = currentPuzzle;
                current.invalidIndex = invalidIndex;
                this.setState({
                    history: history
                });
            } else {
                this.setState({

                    history: history.concat([{
                        puzzle: currentPuzzle,
                        location: location,
                        invalidIndex: invalidIndex
                    }]),
                    stepNumber: history.length
                });
            }

            if (_.isEqual(currentPuzzle, this.state.solvePuzzle)) {
                alert("Congratulation! It was solved.")
            }
        }
    }

    validateCell(index, number) {
        if (number === null) {
            return true;
        }
        let row = Math.floor(index / 9),
            col = index % 9,
            squareRow = Math.floor(row / 3),
            squareCol = Math.floor(col / 3);
        let squareUnits = [],
            verticalUnits = [],
            horizontalUnits = [];
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const nextPuzzle = current.puzzle.slice();
        for (let i = 0; i < 9; i++) {
            horizontalUnits.push(nextPuzzle[row * 9 + i]);
            verticalUnits.push(nextPuzzle[i * 9 + col]);
        }

        for (let i = squareRow * 3; i < (squareRow + 1) * 3; i++) {
            for (let j = squareCol * 3; j < (squareCol + 1) * 3; j++) {
                squareUnits.push(nextPuzzle[i * 9 + j]);
            }
        }
        return _.indexOf(_.union(squareUnits, verticalUnits, horizontalUnits), number) < 0;
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step
        });
    }

    render() {
        const legend = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + ' location: (' + step.location[0] + ', ' + step.location[1] + ')' :
                'Go to game start';

            return (
                <li key={move}>
                    <button style={{ fontWeight: (this.state.stepNumber === move ? 'bold' : 'normal') }} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="board">
                    <Board
                        puzzle={history[0].puzzle}
                        nextPuzzle={current.puzzle}
                        clickedIndex={this.state.clickedIndex}
                        invalidIndex={current.invalidIndex}
                        highlightNumber={this.state.highlightNumber}
                        onClick={(i) => { this.handleBoardClick(i) }}
                        onKeyDown={(e, i) => { this.handleKeyDown(e, i) }}
                    />
                </div>
                <div className="legend">
                    <div className="row">
                        {
                            legend.map((item, index) => {
                                return (
                                    <Legend key={index}
                                        value={item}
                                        onClick={() => { this.handleLegendClick(item) }}
                                    />
                                );
                            })
                        }
                    </div>
                </div>
                <div className="game-info">
                    <ol>{moves}</ol>
                </div>
            </div>

        );
    }
}

export default Game;