import "../client.css"
import React,{Component} from 'react';
import { render } from 'react-dom';
export default class Client extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>{this.props.children}</div>
        )
    }
}

