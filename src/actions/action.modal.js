import {mondalCont} from "./Content.js"

export function addModalData(data) {
    return { type: mondalCont.ADD_DATA,data}
}
/*export function showTipModal(data) {
    return (dispatch,getState) => {
        dispatch(addModalData({"type":data.type,"msg":data.msg,"duration":!data.duration?1.5:data.duration}));
        setTimeout(() => {
            dispatch(addModalData({"isShow":false,"type":data.type}));
        }, data.time);
    };
}*/

