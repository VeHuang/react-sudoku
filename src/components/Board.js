import React, { Component } from 'react';
import Cell from './Cell';

class Board extends Component {
    render() {
        const stack = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        return (
            stack.map((item, i) => {
                return (
                    <div key={item} className='row' id={'row' + item} >
                        {
                            stack.map((item, j) => {
                                let index = i * 9 + j;
                                return (
                                    <Cell
                                        key={index}
                                        cellIndex={index}
                                        clickedIndex={this.props.clickedIndex}
                                        solved={this.props.puzzle[index] !== null}
                                        invalidIndex={this.props.invalidIndex}
                                        highlightNumber={this.props.highlightNumber}
                                        value={this.props.nextPuzzle[index] === null ? '' : this.props.nextPuzzle[index] + 1}
                                        onClick={() => { this.props.onClick(index) }}
                                        onKeyDown={(e) => { this.props.onKeyDown(e, index) }}
                                    />
                                );
                            })
                        }
                    </div>
                );
            })
        );
    }
}

export default Board;