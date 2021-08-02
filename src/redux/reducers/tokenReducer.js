const token = (state = {}, action) => {
    switch (action.type) {
        case 'TOKEN_LOADED':
            return {
                ...state,
                contract: action.token
            }

        default:
            return state
    }
}

export default token