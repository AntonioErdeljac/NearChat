export default (state={profiles: null}, action) => {
    switch(action.type){
        case 'APP_LOAD':
            return {
                ...state,
                token: action.token || null,
                currentUser: action.payload ? action.payload.user : null,
                appLoaded: true
            };
        case 'LOGIN':
            return {
                ...state,
                currentUser: action.error ? null : action.payload.user,
                token: action.error ? null : action.payload.user.token,
                redirectTo: action.error ? null : '/'
            };
        case 'REDIRECT':
            return {
                ...state,
                redirectTo: null
            };
        case 'CHAT_PAGE_LOADED':
            console.log(action.payload.profiles);
            return {
                ...state,
                profiles: action.payload.profiles
            }
    }
    return state;
};