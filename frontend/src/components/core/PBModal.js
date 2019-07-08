import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import {ShowModal, HideModal} from '../../actions'

class PBModal extends React.Component {
  state = { 
    visible: false 
  };

  showModal = () => {
    this.props.ShowModal("Show modal Click.");
  };

  handleOk = e => {
    //console.log(e);
    this.props.HideModal();
  };

  handleCancel = e => {
    //console.log(e);
    this.props.HideModal();
  };

  render() {
    //console.log("Modal props", this.props);
    this.createMarkup = ()=> { return {__html: decodeURI(this.props.content) }; };
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          Open Modal
        </Button>
        <Modal
          title="Basic Modal"
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div dangerouslySetInnerHTML={this.createMarkup()} />
          
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state =>{
    return { ...state.modal }
}

export default connect(mapStateToProps,{ShowModal, HideModal})(PBModal);