import root from './reducers/root.js';
import thunk from "redux-thunk"
import { createStore,applyMiddleware } from 'redux';
//export let store = createStore(root);
export const store = createStore(
    root,
    applyMiddleware(thunk)  //3个参数就是中间件，有次序要求，如logger必须放在最后
);

