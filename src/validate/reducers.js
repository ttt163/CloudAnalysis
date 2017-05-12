import { ADD_FORM,DELETE_FORM,ADD_FIELDS,ADD_VALIDATE_MSG,EDIT_FIELDS} from './action.js'
export default function validatorForm(state = {}, action) {
    switch (action.type) {
        case ADD_FORM:
            var _data=action.data;
            return {...state,..._data};
        case DELETE_FORM:
            var form=action.form;
            delete (state[form]);
            return {...state};
        case ADD_FIELDS:
            var thisForm=state[action.form], _data = action.data,fields=thisForm.fields;
            state[action.form].fields={...fields,..._data};
            return {...state};
        case EDIT_FIELDS:
            var thisForm=state[action.form], _data = action.data,field=thisForm.fields[action.field];
            field={...field,..._data};
            state[action.form].fields[action.field]={...field};
            return {...state};
        case ADD_VALIDATE_MSG:
            var thisForm=state[action.form], _data = action.data,valMsg=thisForm.valideMsg,fieldMsg=valMsg[action.field];
            if(!fieldMsg){
                state[action.form].valideMsg={...valMsg,[action.field]:_data};
            }else{
                state[action.form].valideMsg[action.field]={..._data};
            }
            return {...state};
        default:
            return state
    }
}