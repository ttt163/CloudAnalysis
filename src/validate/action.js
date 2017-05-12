export const ADD_FORM="ADD_FORM";
export const DELETE_FORM="DELETE_FORM";
export const ADD_FIELDS="ADD_FIELDS";
export const EDIT_FIELDS="EDIT_FIELDS";
export const ADD_VALIDATE_MSG="ADD_VALIDATE_MSG";
export function addForm(data){
    return { type: ADD_FORM,data}
}
export function deleteForm(form){
    return { type: DELETE_FORM,form}
}
export function addFields(form,data) {
    return { type: ADD_FIELDS,data,form}
}
export function editFields(form,field,data) {
    return { type: EDIT_FIELDS,data,form,field}
}
export function addError(form,field,data) {
    return { type: ADD_VALIDATE_MSG,data,form,field}
}
export function changeValue(form,field,value,errordata,action) {
    return (dispatch,getState) => {
        dispatch(editFields(form,field,{"value":value}));
        dispatch(addError(form,field,errordata));
        if(!action){
            return;
        }
        dispatch(action);

    };
}