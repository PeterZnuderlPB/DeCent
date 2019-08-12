import React from 'react';
import con from '../../apis';
import {
    USER_SETTINGS_USERPERMISSIONS_LIST,
    USER_SETTINGS_PRIMARY_ORGANIZATION_LIST
} from '../../constants';
import { connect } from 'react-redux';
import { Select, Button } from 'antd';
import { FetchUserStart } from '../../actions/index';

const { Option } = Select;

// TODO: 
// Add fetching user data on page refresh DONE
// After completing the page -> refactor it in redux style
class UserSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            organizationsLoading: true,
            organizations: [],
            selectedOrganization: null
        };
    }

    fetchPrimaryOrganization = () => {
        this.setState({ organizationsLoading: true });

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
      
          params.visibleFields = params.visibleFields.concat(USER_SETTINGS_PRIMARY_ORGANIZATION_LIST);
      
          let settings = JSON.stringify(params);

        con.get('/api/organization/', {
            params: {
                settings
            },
            headers: {
              Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
            }
          })
          .then(res => {
              let tempCompanyDictionary = {};
              tempCompanyDictionary['id'] = 0;
              tempCompanyDictionary['organization__id'] = res.data.data[0].id;
              tempCompanyDictionary['organization__organization_type'] = res.data.data[0].organization_type__id;
              tempCompanyDictionary['organization__name'] = res.data.data[0].name;
              tempCompanyDictionary['permissions'] = "CREATE;READ;UPDATE;DELETE";

              this.setState({
                  organizations: [
                      ...this.state.organizations,
                      tempCompanyDictionary
                  ],
                  organizationsLoading: false
              });
          })
          .catch(err => console.log("[UserSettings] PrimaryOrganization fetch error: ", err));
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
          }, () => {
            this.fetchPrimaryOrganization();
          });
      })
      .catch(err => console.log("[UserSettings] UserPermission fetch error: ", err));
    }

    renderUserOrganizations = () => {
        if (this.state.organizationsLoading) {
            return <Option value="NULL" disabled>Loading...</Option>
        } else {
            return this.state.organizations.map(el => {
                return <Option key={el.id} value={el.organization__id}>{el.organization__name || el.name}</Option>
            })
        }
    }

    handleChange = e => {
        this.setState({
            selectedOrganization: e
        });
    }

    updateUserActiveOrganization = () => {
        con.patch(`/api/users/${this.props.user.userInfo.id}/`, {
            active_organization_id: this.state.selectedOrganization
        },
        {
            headers: {
                Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
        }
    })
    .then(res => this.props.FetchUserStart(this.props.user.token))
    .catch(err => console.log("ERR", err));
    }

    render() {
        return (
            <div>
                <h3 style={{ textAlign: 'center' }}>Choose organization: </h3>
                <Select onFocus={this.fetchUserOrganizations} onChange={this.handleChange} style={{ width: '100%'}}>
                    {this.renderUserOrganizations()}
                </Select>
                <Button style={{ marginTop: '1%' }} onClick={this.updateUserActiveOrganization} type="primary" block>Confirm</Button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.auth
    }
}

export default connect(mapStateToProps, { FetchUserStart })(UserSettings);