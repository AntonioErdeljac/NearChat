export default (state={}, action) => {
    switch(action.type){
        case 'ADD_MESSAGE':
            return {
                ...state,
                messages: (state.messages || []).concat([action.message])
            };
        case 'CHAT_PAGE_LOADED':
            return {
                ...state,
                messages: action.payload[1].messages
            };
        case 'PRIVATE_CHAT_PAGE_LOADED':
            return {
                ...state,
                profile: action.payload.profile
            }
    }
    return state;
}