import agent from "./agent";

const promiseMiddleware = store => next => action => {
    if(isPromise(action.payload)){
        store.dispatch({type: 'ASYNC_START', subtype: action.type});
        action.payload.then(
            res => {
                action.payload = res;
                store.dispatch(action);
            },
            error => {
                action.error = true;
                action.payload = error.response.body;
                store.dispatch(action);
            }
        );
        return;
    }
    next(action);
};

function isPromise(v){
    return v && typeof v.then === 'function';
}

const localStorageMiddleware = store => next => action => {
    if(action.type === 'LOGIN' || action.type === 'REGISTER'){
        if(!action.error){
            window.localStorage.setItem('jwt', action.payload.user.token);
            agent.setToken(action.payload.user.token);
        }
    }
    next(action);
};

export {
    promiseMiddleware,
    localStorageMiddleware
}