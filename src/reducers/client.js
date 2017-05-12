import { combineReducers } from 'redux'
import {clientCont,messageCont} from "../actions/Content.js"
function clientData(state = {"list":[],"query":{},"data":{}}, action) {
    switch (action.type) {
        case clientCont.ADD_DATA:
            var _data=action.data;
            return {...state,..._data};
        case clientCont.ADD_QUERY_DATA:
            var _data=action.data,query=state.query;
            query={...query,..._data};
            return {...state,"query":query};
        case clientCont.CLEAR_QUERY_DATA:
            return {...state,"query":{}};
        default:
            return state
    }
}
//消息模块
function messageData(state = {"list":[],"query":{}}, action) {
    switch (action.type) {
        case messageCont.ADD_DATA:
            var _data=action.data;
            return {...state,..._data};
        case messageCont.ADD_QUERY_DATA:
            var _data=action.data,query=state.query;
            query={...query,..._data};
            return {...state,"query":query};
        default:
            return state
    }
}
const client = combineReducers({
        clientData,
    messageData
    }
);
export default client;