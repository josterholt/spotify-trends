import React, {useState, SyntheticEvent} from 'react';
import {TextField, NumberField, SubmitButton} from '../../components/form-elements';
import { any } from 'prop-types';

interface IFormValues {
    [fieldName: string]: any
};

const form = function () {
    const [formValues, setFormValues] = useState<IFormValues | undefined>({});
    const onChangeParentHandler = function (fieldName:string, value:any) {
        formValues[fieldName] = value;
        setFormValues(formValues);

        console.log(formValues);
    };

    const onSubmitParentHandler = () => {
        //const [formValues, setFormValues] = useState<IFormValues | undefined>({});
        console.log(formValues);
    }

    return <div>
        <TextField label='First Name' name='first_name' placeholderText='Enter First Name...' eventHandlers={{'onChange': onChangeParentHandler }} />
        <TextField label='Last Name' name='last_name' placeholderText='Enter Last Name...' eventHandlers={{'onChange': onChangeParentHandler }} />
        <TextField label='Phone' name='phone' placeholderText='Enter Phone Number...' eventHandlers={{'onChange': onChangeParentHandler }} />
        <NumberField label='Number' name='number' placeholderText='Enter Number...' eventHandlers={{'onChange': onChangeParentHandler }} />
        <SubmitButton eventHandlers={{ 'onSubmit': onSubmitParentHandler }} />
    </div>

}

export default form;