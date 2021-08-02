import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

/* Import Reducers */
import web3 from './reducers/web3Reducer';
import token from './reducers/tokenReducer';
import exchange from './reducers/exchangeReducer';

const reducer = combineReducers({
    web3,
    token,
    exchange
});

const initalState = {

};

const loggerMiddleware = createLogger()

const middleware = [thunk];

const store = createStore(reducer, initalState, composeWithDevTools(applyMiddleware(...middleware, loggerMiddleware)));

export default store;