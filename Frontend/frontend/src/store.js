import {createStore, applyMiddleware, combineReducers} from "redux";
import {promiseMiddleware, localStorageMiddleware} from "./middleware";

import common from "./reducers/common";
import auth from "./reducers/auth";
import chat from "./reducers/chat";

const reducer = combineReducers({
    common,
    auth,
    chat
});

const store = createStore(reducer, applyMiddleware(promiseMiddleware, localStorageMiddleware));

export default store;