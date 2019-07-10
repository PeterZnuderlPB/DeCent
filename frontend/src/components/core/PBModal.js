import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import {ShowModal, HideModal} from '../../actions'
import { FormattedMessage } from 'react-intl';
import lang from '../../translations/translations';

class PBModal extends React.Component {
  state = { 
    visible: false 
  };

  showModal = () => {
    this.props.ShowModal(lang[this.props.lang]['modal.title']);
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
          <FormattedMessage id="modal.open" defaultMessage="Open modal" />
        </Button>
        <Modal
          title={ <FormattedMessage id="modal.title" defaultMessage="Modal" /> }
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="return" onClick={this.handleCancel}>
              <FormattedMessage id="modal.cancel" defaultMessage="Cancel" />
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              <FormattedMessage id="modal.ok" defaultMessage="Ok" />
            </Button>
          ]}
        >
          <div dangerouslySetInnerHTML={this.createMarkup()} />
          
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state =>{
    return { ...state.modal, lang: state.lang }
}

export default connect(mapStateToProps,{ShowModal, HideModal})(PBModal);