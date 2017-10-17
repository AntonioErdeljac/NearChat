export default (state={}, action) => {
    switch(action.type){
        case 'UPDATE_FIELD_AUTH':
            console.log(action.key, action.value);
            return {
                ...state,
                [action.key]: action.value
            };
        case 'LOGIN':
        case 'REGISTER':
            console.log(action.error);
            return {
                ...state,
                inProgress: false,
                errors: action.error ? action.payload.errors : null
            };
        case 'ASYNC_START':
            if(action.subtype === 'LOGIN' || action.subtype === 'REGISTER'){

                console.log('ive ben called', action.subtype);
                return {
                    ...state,
                    inProgress: true
                }
            }
    }
    return state;
}