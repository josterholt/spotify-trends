import React from 'react';
import {ComplexCompProvider} from './ComplexCompContext';
import ButtonLeft from './ButtonLeft';
import ButtonRight from './ButtonRight';

const complexComp = function () {
    return <div>
        <h3>Complex Comp Test</h3>
        <ComplexCompProvider>
            <ButtonLeft />
            <ButtonRight />
        </ComplexCompProvider>
    </div>
}

export default complexComp;