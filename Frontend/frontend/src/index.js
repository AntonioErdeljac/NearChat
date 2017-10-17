import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import App from "./components/App";
import Chat from "./components/Chat";
import Home from "./components/Home";
import Login from "./components/Login";
import {Provider} from "react-redux";
import store from "./store";
import {BrowserRouter, Route} from "react-router-dom";



ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
