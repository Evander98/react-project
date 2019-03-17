const INITIAL_STATE = {id : 0, username : "", role : "", error : "", loading : false}

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'LOADING' :
            return {...INITIAL_STATE, loading : true}
        case 'LOGIN_SUCCESS' :
            return {...INITIAL_STATE, id : action.payload.id, username : action.payload.username, role : action.payload.role}
        case 'USER_NOT_FOUND' :
            return {...INITIAL_STATE, error : 'Username or password wrong'}
        case 'USERNAME_NOT_AVAILABLE' :
            return {...INITIAL_STATE, error : 'Username not available'}
        case 'SERVER_ERROR' :
            return {...INITIAL_STATE, error : 'System Error'}
        case 'RESET_USER' :
            return INITIAL_STATE
        default :
            return state
    }

}