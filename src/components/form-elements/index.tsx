import React, { useState, useEffect } from 'react';
import { useOnChangeFnHook, useOnSubmitFnHook } from './form-hooks';

/**
 * All field elements will have the following state structure:
 * {
 *     isDirty: bool,
 *     isValid: enum, (true, false, N/A)
 *     errors: [
 *         {
 *             type: error_enum,
 *             code: string, // number or error code
 *             message: string // human readable
 *         }
 *     ]
 * }
 * 
 * Input will fire events:
 * - onChange
 * - onFocus
 * - onBlur
 * 
 * Buttons will fire events:
 * - on____
 * - onSave
 * - onCancel
 * 
 * Phase 1: parent will pass in a "on____" function and child will pass up all on_____ events up to parent.
 * Phase 2: a more defined pub/sub design
 */

//  const FormContainer = class extends React.Component<any, any> {
//     constructor(props:any) {
//         super(props);
//         this.onChangeHandler = this.onChangeHandler.bind(this);
//         this.state = {

//         }
//     }

//     onChangeHandler() {
//         console.log("Change");
//     }

//     render() {
//         console.log("foo");
//         let i:number = 0;
//         /*
//         return this.props.children.map(function (WrappedChild:any) {
//             console.log(WrappedChild)
//             return <WrappedChild key={i} {...props as any} />;
//             i++;
//         })
//         */
//     }
// }
 


/**
 * 
 * @param props 
 */
const InputField = function (props:any) {
    const onChangeFn = useOnChangeFnHook(props);

    return <div>
            {props.label ? <label htmlFor={props.name}>{props.label}:</label> : null }
            <input name={props.name} type={props.type} value={props.defaultValue} placeholder={props.placeholder} onChange={(evt) => onChangeFn(evt)}  />
        </div>
}

const TextField = function (props:any) {
    return <InputField type={'text'} {...props} />;
}


const NumberField = function (props:any) {
    return <InputField  type={'number'} {...props} />;
}

enum SUBMIT_BUTTON_STATES {
    SUBMIT = "SUBMIT",
    PROCESSING = "PROCESSING"
};

const SubmitButton = function (props:any) {
    const [buttonState, setButtonState] = useState(SUBMIT_BUTTON_STATES.SUBMIT);
    const onSubmitFn = useOnSubmitFnHook(props);

    const _onClickHandler = function () {
        // tell parent this is processing something long -- mabe?

        // change button state to processing
        setButtonState(SUBMIT_BUTTON_STATES.PROCESSING);

        console.log("Calling on submit parent");

        // run props.onClickHandler
        if(onSubmitFn) {
            onSubmitFn();
        }
    }
    
    const getButton = function () {
        if(buttonState == 'PROCESSING') {
            return <button>Processing...</button>;
        } else {
            return <button onClick={_onClickHandler}>Submit</button>;
        }
    }

    return <div>
        { getButton() }
    </div>
}

export { TextField, NumberField, SubmitButton }