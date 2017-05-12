import {clientCont,messageCont} from "./Content.js"
export function addClientData(data) {
    return { type: clientCont.ADD_DATA,data}
}
export function addClientQuery(data) {
    return { type: clientCont.ADD_QUERY_DATA,data}
}
export function clearClientQuery() {
    return { type: clientCont.CLEAR_QUERY_DATA}
}
/*消息中心*/
export function addMassgeData(data) {
    return { type: messageCont.ADD_DATA,data}
}
export function addMassgeQuery(data) {
    return { type: messageCont.ADD_QUERY_DATA,data}
}

/*export function incrementAsync(data) {
    return { type: clientCont..
    .2,data}
}*/
/*export function incrementAsync(action) {
    return (dispatch,getState) => {
        dispatch(addData({"ccc":"111"}));
        setTimeout(() => {
            // Yay! Can invoke sync or async actions with `dispatch`
            console.log(getState());
            dispatch(action);
        }, 1000);
        dispatch(addData({"bbb":"222"}));
    };
}*/

