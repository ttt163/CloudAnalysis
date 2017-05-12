import {innerNavCont,mondalCont,configCont,pageCont,accountCont} from "../actions/Content.js"
import { combineReducers } from 'redux'
function data(state = {"navIsShow":true,"tabIndex":0,"innerTabIndex":0,"showProd":true,"showCase":true,"chkData":[]}, action) {
    switch (action.type) {
        case innerNavCont.ADD_DATA:
            var _data=action.data;
            return {...state,..._data};
        case configCont.ADD_DATA:
            var _data=action.data;
            return {...state,..._data};
            //全选123
        case configCont.CHECK_ALL_DATA:
            let _data=action.data,list=action.list,chkData=[];
            if(!_data.isCheck){
                // 取消
                chkData=[]
            }else{
                //选中
                chkData=list.map((item)=>{
                    return {"id":item.id,"name":item.name,..._data}
                })
            }
            return {...state,"chkData":chkData};
            //单选
        case configCont.ADD_CHECK_DATA:
            var _data=action.data,chkData=state.chkData;
            if(!_data.isCheck){
                // 取消
                var _index=chkData.findIndex((obj,index)=>{return obj.id==_data.id});
                if(_index!=-1){
                    chkData=[
                        ...chkData.slice(0,_index),
                        ...chkData.slice(_index+1),
                    ]
                }
            }else{
                //选中
                chkData.push(_data);
            }
            return {...state,"chkData":chkData};
        case configCont.EDIT_CHECK_DATA:
            var _data=action.data,choseData=!state.choseData?[]:state.choseData;
            var _index=choseData.findIndex((obj,index)=>{return obj.id==_data.id});
            if(_index!=-1){
                var _thisChkData=choseData[_index];
                _thisChkData={..._thisChkData,..._data}

            }
            choseData=[
                ...choseData.slice(0,_index),
                _thisChkData,
                ...choseData.slice(_index+1),
            ];
            return {...state,"choseData":choseData};
        case configCont.CLEAR_CHECK_DATA:
            return {...state,"chkData":[]};
        default:
            return state
    }
}
function modal(state = {"isShow":false}, action) {
    switch (action.type) {
        case mondalCont.ADD_DATA:
            var _data=action.data;
            return {...state,..._data};
        default:
            return state
    }
}
function userQuery(state = {}, action) {
    switch (action.type) {
        case accountCont.ADD_DATA:
            var _data=action.data;
            return {...state,..._data};
        case accountCont.CLEAR_DATA:
            state={};
            return state;
        default:
            return state
    }
}
function pageData(state = {"currPage":1,"pageSize":10,"total":0}, action) {
    switch (action.type) {
        case pageCont.ADD_DATA:
            var _data=action.data;
            return {...state,..._data};
        default:
            return state
    }
}
const configData = combineReducers({
    data,
    modal,
    userQuery,
    pageData
    }
);
export default configData;