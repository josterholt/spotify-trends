import React, {useContext} from 'react';
import {ComplexCompContext} from './ComplexCompContext';

const ButtonLeft:any = function () {
    const context = useContext(ComplexCompContext);
    return (<div>
            <button>{context.value}</button>
        </div>);
}

export default ButtonLeft;