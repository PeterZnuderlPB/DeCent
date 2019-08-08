import React from 'react';
import con from '../../apis';
import { USER_SETTINGS_USERPERMISSIONS_LIST } from '../../constants';
import { connect } from 'react-redux';
import { Select, Button } from 'antd';

const { Option } = Select;

// TODO: 
// Add fetching user data on page refresh
// After completing the page -> refactor it in redux style
class UserSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            organizationsLoading: true,
            organizations: []
        };
    }

    fetchUserOrganizations = () => {
      let params = {
        results: 1000,
        page: 1,
        sortOrder: [],
        sortField: [],
        visibleFields: [],
        filters: {
            account__id: this.props.user.userInfo.id
        }
      };
  
      params.visibleFields = params.visibleFields.concat(USER_SETTINGS_USERPERMISSIONS_LIST);
  
      let settings = JSON.stringify(params);
  
      con.get('/api/userpermission/', {
        params: {
          settings
        },
        headers: {
          Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
        }
      })
      .then(res => {
          this.setState({
              organizations: res.data.data,
              organizationsLoading: false
          });
      })
      .catch(err => console.log("[UserSettings] UserPermission fetch error: ", err));
    }

    renderUserOrganizations = () => {
        if (this.state.organizationsLoading) {
            return <Option value="NULL" disabled>Loading...</Option>
        } else {
            return this.state.organizations.map(el => {
                return <Option key={el.id} value={el.id}>{el.organization__name}</Option>
            })
        }
    }

    render() {
        return (
            <div>
                <h3 style={{ textAlign: 'center' }}>Choose organization: </h3>
                <Select onFocus={this.fetchUserOrganizations} style={{ width: '100%'}}>
                    {this.renderUserOrganizations()}
                </Select>
                <Button onClick={this.fetchUserOrganizations} style={{ marginTop: '1%' }} type="primary" block>Confirm</Button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.auth
    }
}

export default connect(mapStateToProps)(UserSettings);