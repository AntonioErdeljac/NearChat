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
        case 'REGISTER':
            return {
                ...state,
                currentUser: action.error ? null : action.payload.user,
                token: action.error ? null : action.payload.user.token,
                redirectTo: action.error ? null : '/'
            };
        case 'LOGOUT':
            return {
                ...state,
                currentUser: null,
                token: null,
                redirectTo: '/'
            };
        case 'REDIRECT':
            return {
                ...state,
                redirectTo: null
            };
        case 'CHAT_PAGE_LOADED':
            return {
                ...state,
                profiles: action.payload[0] ? action.payload[0].profiles : [],
                nearProfiles: action.payload[2] ? action.payload[2].profiles : []
            };
        case 'LOCATION_UPDATE':
            return {
                ...state,
                nearProfiles: action.profiles

            };
        case 'SET_POSITION':
            return {
                ...state
            }
    }
    return state;
};