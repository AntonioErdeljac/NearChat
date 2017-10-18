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
                profile: action.payload.profile,
                chatLoaded: false
            };
        case 'ADD_PRIVATE_MESSAGE':
            return {
                ...state,
                privateMessages: (state.privateMessages || []).concat([action.message])
            };
        case 'PRIVATE_CHAT_MESSAGES_LOADED':
            return {
                ...state,
                privateMessages: action.payload ? action.payload.messages : [],
                chatLoaded: true
            };
    }
    return state;
}