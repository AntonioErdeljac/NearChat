import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import App from "./components/App";
import Chat from "./components/Chat";
import Login from "./components/Login";
import {Provider} from "react-redux";
import store from "./store";
import {BrowserRouter,IndexRoute, Route} from "react-router-dom";



ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App>
                <Route exact path="/" component={Chat}/>
                <Route path="/login" component={Login}/>
            </App>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
