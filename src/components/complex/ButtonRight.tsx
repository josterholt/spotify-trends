import React, { useContext } from 'react';
import {ComplexCompContext} from './ComplexCompContext';

const ButtonRight
 = function () {
    const context:any = useContext(ComplexCompContext);
    return (<div>
        <button>{context.value}</button>
    </div>);


}

export default ButtonRight;