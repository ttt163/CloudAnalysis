import React,{Component} from 'react';
import { render } from 'react-dom';
import {connect} from 'react-redux';
import {addModalData} from "../../actions/action.modal";
class ImgModal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {modalData,dispatch}=this.props;
        return (
        <div style={{"display":!modalData.imgModal?"none":"block"}}>
            <div className="mask" style={{"display":"block","opacity":"0.2","filter":"alpha(opacity=20)"}}></div>
            <div className="img-modal-body" style={{"top":modalData.top,"left":modalData.left}}>
                <div><i className="iconfont img-modal-close" onClick={()=>dispatch(addModalData({"imgModal":false}))}>&#xe726;</i></div>
                <img src={modalData.imgSrc} />
            </div>
        </div>

        )
    }
}
function mapStateToProps(state) {
    return {"modalData": state.configData.modal}
}
export default connect(mapStateToProps)(ImgModal)
