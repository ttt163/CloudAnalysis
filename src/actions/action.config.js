import {configCont,pageCont,accountCont} from "./Content.js"
import { message } from 'antd';
export function addConfigData(data) {
    return { type: configCont.ADD_DATA,data}
}
export function changeCheckData(data) {
    return { type: configCont.ADD_CHECK_DATA,data}
}
export function editCheckData(data) {
    return { type: configCont.EDIT_CHECK_DATA,data}
}
export function  checkAllData(data,list){
    return { type: configCont.CHECK_ALL_DATA,data,list}
}
export function clearCheckData() {
    return { type: configCont.CLEAR_CHECK_DATA}
}
export function addAccountData(data) {
    return { type: accountCont.ADD_DATA,data}
}
export function clearAccountData() {
    return { type: accountCont.CLEAR_DATA}
}
//分页
export function addPageData(data) {
    return { type: pageCont.ADD_DATA,data}
}
//ajax
export function ajaxSearch(data,callBack) {
    return (dispatch,getState) => {
        $.ajax({
            "url":data.url,
            "data":data.sendData,
            "async":true,
            "type":"post",
            "error":function(error){
                console.log(error);
                dispatch(callBack({"list":[]}));
            },
            "success":function(res){
                if(!res){
                    dispatch(callBack({"list":[]}));
                }else{
                    var resDara=$.parseJSON(res);
                    if(!resDara.code){
                        dispatch(callBack({"list":[]}));
                    }else{
                        if(!Array.isArray(resDara.data)){
                            dispatch(callBack({"list":resDara.data.data}));
                            if(resDara.data.total){
                                dispatch(addPageData({"total":resDara.data.total}));
                            }
                        }else{
                            dispatch(callBack({"list":resDara.data}));
                        }

                    }

                }
            }
        })
    };
}
export function ajax(data,showTip,callBack) {
    return (dispatch,getState) => {
        dispatch(addConfigData({"btnDisable":true}));
        $.ajax({
            "url":data.url,
            "data":data.sendData,
            "type":"post",
            "async":true,
            "error":function(error){
                if(showTip){
                    //  message.success(content, duration, onClose);
                    dispatch(addConfigData({"btnDisable":false}));
                    message.error("操作失败！");
                }
            },
            "success":function(res){
               // console.log(res);
                dispatch(addConfigData({"btnDisable":false}));
                if(!res){
                    if(showTip){
                        message.error("操作失败！");
                    }
                }else{
                   var resDara=$.parseJSON(res);
                    if(!resDara.code){
                        if(showTip){
                            message.error(!resDara.msg?"操作失败！":resDara.msg);
                        }
                    }else{
                        if(showTip){
                            message.success(!resDara.msg?"操作成功！":resDara.msg);
                        }
                        if(callBack){
                            callBack();
                        }

                    }

                }
            }
        })
    };
}
export function getAjaxData(data,showTip,action) {
    return (dispatch,getState) => {
        $.ajax({
            "url":data.url,
            "data":data.sendData,
            "async":true,
            "type":"post",
            "error":function(error){
                if(showTip){
                    //  message.success(content, duration, onClose);
                    message.error("操作失败！");
                }
            },
            "success":function(res){
                //console.log(res);
                if(!res){
                    if(showTip){
                        message.error("操作失败！");
                    }
                }else{
                    var resDara=$.parseJSON(res);
                    if(!resDara.code){
                        if(showTip){
                            message.error(!resDara.msg?"操作失败！":resDara.msg);
                        }
                    }else{
                        if(showTip){
                            message.success(!resDara.msg?"操作成功！":resDara.msg);
                        }
                        dispatch(action({"data":resDara}));
                    }
                }
            }
        })
    };
}
