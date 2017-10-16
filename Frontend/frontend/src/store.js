import {createStore, applyMiddleware, combineReducers} from "redux";
import {promiseMiddleware} from "./middleware";

const reducer = (state={profiles: null}, action) => {
    switch(action.type){
        case 'CHAT_PAGE_LOADED':
            console.log(action.payload.profiles);
            return {
                ...state,
                profiles: action.payload.profiles
            }
    }
    return state;
};

const store = createStore(reducer, applyMiddleware(promiseMiddleware));

export default store;