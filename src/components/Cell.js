import React from 'react';

function Cell(props) {
    let bgColor = props.invalidIndex === props.cellIndex ? 'red' : 'white';
    let className;

    if (props.solved) {
        className = props.highlightNumber === props.value
            ? 'cell solved highlighted'
            : 'cell solved';
    } else {
        className = 'cell empty';
    }

    let divContent;
    if (props.clickedIndex === props.cellIndex) {
        divContent = <input
            readOnly
            autoFocus
            type='text'
            value={props.value}
            style={{ backgroundColor: bgColor }}
        />;
    } else {
        divContent = props.value
    }

    return (
        <div
            className={className}
            onClick={props.onClick}
            onKeyDown={props.onKeyDown}>
            {divContent}
        </div>
    );
}

export default Cell;