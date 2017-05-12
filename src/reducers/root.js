import {combineReducers} from 'redux'
import client from "./client.js"
import configData from "./config.js"
import validatorForm from "../validate/reducers"
const root = combineReducers({
        client,
        configData,
        validatorForm
    }
);
export default root

