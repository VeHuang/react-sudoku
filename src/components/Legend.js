import React from 'react';

function Legend(props) {
    return (
        <div
            className='cell'
            onClick={props.onClick}>
            {props.value}
        </div>
    );

}

export default Legend;