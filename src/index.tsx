import React from "react";
import ReactDOM from "react-dom";
import { createHook, Provider } from "overmind-react";
import { createOvermind } from 'overmind';
import Homepage from './pages/homepage';

const config = {
    state: {
        "title": "My App"
    }
};

const overmind = createOvermind(config, {
    devtools: true
});

ReactDOM.render(<Provider value={overmind}><Homepage /></Provider>, document.getElementById('app'));