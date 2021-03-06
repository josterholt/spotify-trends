import React from 'react';

const ComplexCompContext = React.createContext({ value: "" });

const ComplexCompProvider = function (props:any) {
    return <ComplexCompContext.Provider value={ { value:"Orange" }}>
        {props.children}
        </ComplexCompContext.Provider>
}

export { ComplexCompContext, ComplexCompProvider };