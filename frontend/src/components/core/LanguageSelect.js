import React from 'react';
import { connect } from 'react-redux';
import {Menu, Dropdown, Button, Icon} from 'antd'
import { FormattedMessage } from 'react-intl';

import { ChangeLangAction } from '../../actions/langActions';

class LanguageSelect extends React.Component {

    handleMenuClick = (e) =>{
        if(!e.key)
            return
        console.log('Click on item: '+  e.key);
        this.props.ChangeLangAction(e.key)
      }

    render(){
        const menu = (
            <Menu onClick={this.handleMenuClick}>
              <Menu.Item key="en">
                <Icon type="caret-right" />
                English
              </Menu.Item>
              <Menu.Item key="si">
                <Icon type="caret-right" />
                Slovenščina
              </Menu.Item>
            </Menu>
          );
        return(
            <Dropdown overlay={menu}>
                <Button>
                    <FormattedMessage id="lang.language" defaultMessage="Language" /> <Icon type="bars" />
                </Button>
            </Dropdown>
        );
    }
    
}

const mapStateToProps = state =>{
    return { }
}

export default connect(mapStateToProps,{ChangeLangAction})(LanguageSelect)