const token = (state = { loaded: false, contract: {} }, action) => {
    switch (action.type) {
        case 'TOKEN_LOADED':
            return {
                ...state,
                loaded: true,
                contract: action.token
            }

        default:
            return state
    }
}

export default token