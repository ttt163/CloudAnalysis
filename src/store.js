import root from './reducers/root.js';
import thunk from "redux-thunk"
import { createStore,applyMiddleware } from 'redux';
//export let store = createStore(root);
export const store = createStore(
    root,
    applyMiddleware(thunk)  //3�����������м�����д���Ҫ����logger����������
);

