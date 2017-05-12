import {addForm,deleteForm,addFields,addError,changeValue} from "./action.js"
import {store} from "../store"
//添加form
export function setForm(form) {
    var validatorForm=store.getState().validatorForm;
    if(!validatorForm[form]){
        store.dispatch(addForm({[form]:{"fields":{},"valideMsg":{}}}));
    }
}
//删除form
export function delForm(form) {
    var validatorForm=store.getState().validatorForm;
    if(!validatorForm[form]){
        return;
    }
    store.dispatch(deleteForm(form));
}
//添加域
export function setFormFields(form,data){
    var validatorForm=store.getState().validatorForm;
    if(!validatorForm[form]){
        setForm(form);
    }
    store.dispatch(addFields(form,data));
}
//校验单个域
export function validateField(form,field,value,action){
    var isvalidated=true;
    var validatorForm=store.getState().validatorForm;
    var rule=validatorForm[form].fields[field].rule,msg=validatorForm[form].fields[field].msg,data={};
    //禁用不校验
    if(rule.disable){
        /*data={
            [field]:{"isValider":true,"error":""}
        };*/
        store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
    }
    //必填校验
    if(rule.required){
        if(!value){
            store.dispatch(changeValue(form,field,value,{"isValider":false,"error":msg.required?msg.required:"不能为空"},action));
            isvalidated=false;
            return false;
        }else{
            store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
        }
    }
    if(rule.callBack){
        if(!rule.callBack(value)){
            store.dispatch(changeValue(form,field,value,{"isValider":false,"error":msg.callBack?msg.callBack:"格式错误！"},action));
            isvalidated=false;
            return false;
        }else{
            store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
        }
    }
    //正则校验
    if(rule.regexp){
        if(!value){
            //store.dispatch(addError(form,data));
            store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
        }else{
            if(!rule.regexp.test(value)){
                store.dispatch(changeValue(form,field,value,{"isValider":false,"error":msg.regexp?msg.regexp:"格式错误！"},action));
                isvalidated=false;
                return false;
            }else{
               // store.dispatch(addError(form,data));
                store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
            }

        }
    }
    //最大长度
    if(rule.maxLen){
        if(!value){
            //store.dispatch(addError(form,data));
            store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
        }else{
            if(value.length>rule.maxLen){
                store.dispatch(changeValue(form,field,value,{"isValider":false,"error":msg.maxLen?msg.maxLen:"超出长度！"},action));
                isvalidated=false;
                return false;
            }else{
                //store.dispatch(addError(form,data));
                store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
            }

        }
    }
    //最小长度
    if(rule.minLen){
        if(!value){
            store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
        }else{
            if(value.length<rule.minLen){
                store.dispatch(changeValue(form,field,value,{"isValider":false,"error":msg.minLen?msg.minLen:"长度不够！"},action));
                isvalidated=false;
                return false;
            }else{
                store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
            }

        }
    }
    //长度范围
    if(rule.lenRange){
        if(!value){
            store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
        }else{
            if(value.length<rule.lenRange[0]||value.length>rule.lenRange[1]){
                store.dispatch(changeValue(form,field,value,{"isValider":false,"error":msg.lenRange?msg.lenRange:`长度必须在${rule.lenRange.join("-")}之间`},action));
                isvalidated=false;
                return false;
            }else{
                store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
            }

        }
    }
    //相同Field
    if(rule.sameField){
        if(!value){
            store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
        }else{
            var otherField=validatorForm[form].fields[rule.sameField];
            if(value!=otherField.value){
                store.dispatch(changeValue(form,field,value,{"isValider":false,"error":msg.sameField?msg.sameField:`输入不一致`},action));
                isvalidated=false;
                return false;
            }else{
                store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
            }

        }
    }
    //value不能等于某个值
    if(rule.notEqual){
        if(!value){
            store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
        }else{
            if(value==rule.notEqual){
                store.dispatch(changeValue(form,field,value,{"isValider":false,"error":msg.notEqual?msg.notEqual:`不能相同！`},action));
                isvalidated=false;
                return false;
            }else{
                store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
            }

        }
    }
    //value等于某个值
    if(rule.equal){
        if(!value){
            store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
        }else{
            if(value!=rule.equal){
                store.dispatch(changeValue(form,field,value,{"isValider":false,"error":msg.equal?msg.equal:`输入错误！`},action));
                isvalidated=false;
                return false;
            }else{
                store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
            }

        }
    }
    //ip校验
    if(rule.ip){
        if(!value){
            //store.dispatch(addError(form,data));
            store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
        }else{
            if(!IP.test(value)){
                store.dispatch(changeValue(form,field,value,{"isValider":false,"error":msg.regexp?msg.regexp:"IP格式错误！"},action));
                isvalidated=false;
                return false;
            }else{
                // store.dispatch(addError(form,data));
                store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
            }

        }
    }
    //email校验
    if(rule.email){
        if(!value){
            //store.dispatch(addError(form,data));
            store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
        }else{
            if(!EMAIL.test(value)){
                store.dispatch(changeValue(form,field,value,{"isValider":false,"error":msg.regexp?msg.regexp:"email格式错误！"},action));
                isvalidated=false;
                return false;
            }else{
                // store.dispatch(addError(form,data));
                store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
            }

        }
    }
    //手机校验
    if(rule.phone){
        if(!value){
            //store.dispatch(addError(form,data));
            store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
        }else{
            if(!PHONE.test(value)){
                store.dispatch(changeValue(form,field,value,{"isValider":false,"error":msg.regexp?msg.regexp:"手机号码格式错误！"},action));
                isvalidated=false;
                return false;
            }else{
                // store.dispatch(addError(form,data));
                store.dispatch(changeValue(form,field,value,{"isValider":true,"error":""},action));
            }

        }
    }

    return isvalidated;
}
//提交校验表单
export function validateFormFields(form){
    var allIsvalider=true,fields=store.getState().validatorForm[form].fields;
    //console.log(fields);
    for(var [k,v] of Object.entries(fields)){
        var isvalidated=validateField(form,k,v.value);
        if(!isvalidated){
            allIsvalider=false;
        }
    }
    return allIsvalider;
}



export const PHONE = /^1[34578]\d{9}$/;
export const IP= /^(((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))+))$/;
export const EMAIL=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

/*
 setFormFields("form",{"field":{
 "rule": {"required": true,"regexp": /[0-9]+$/},
 "msg": {"required": "设备名不能为空","regexp": "设备名格式错误！"}
 });
}*/