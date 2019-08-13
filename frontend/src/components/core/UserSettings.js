import React from 'react';
import con from '../../apis';
import {
    USER_SETTINGS_USERPERMISSIONS_LIST,
    USER_SETTINGS_PRIMARY_ORGANIZATION_LIST,
    USER_SETTINGS_SUBJECT_LIST,
    USER_SETTINGS_USERS_LIST
} from '../../constants';
import { connect } from 'react-redux';
import { Select, Button, Spin } from 'antd';
import { FetchUserStart } from '../../actions/index';
import { UpdatePost, DeletePost } from '../../actions/PBEditViewActions';

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
            selectedOrganization: null,
            primaryOrganization: null,
            managersLoading: true,
            managers: [],
            usersLoading: true,
            users: [],
            subjectsLoading: true,
            subjects: [],
            formSet: false
        };
    }

    componentDidMount = () => {
        this.fetchPrimaryOrganization();
        this.fetchAllUsers();
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.user.userInfo.id !== prevProps.user.userInfo.id) {
            this.fetchPrimaryOrganization();
            this.fetchAllUsers();
        }

        if(this.state.primaryOrganization !== prevState.primaryOrganization) {
            this.fetchOrganizationManagers();
            this.fetchOrganizationSubjects();
        }
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
              tempCompanyDictionary['organization__name'] = res.data.data[0].name + " [Owner]";
              tempCompanyDictionary['permissions'] = "CREATE;READ;UPDATE;DELETE";

              this.setState({
                  organizations: [
                      ...this.state.organizations,
                      tempCompanyDictionary
                  ],
                  primaryOrganization: tempCompanyDictionary,
                  organizationsLoading: false
              }, () => console.log("FETCHED")); // Fix fetch throwing unauthorized error (ComponentDidReceiveProps)
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
          console.log("ALLOWED", res);
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

    fetchOrganizationManagers = () => {
        let params = {
            results: 1000,
            page: 1,
            sortOrder: [],
            sortField: [],
            visibleFields: [],
            filters: {
                organization__id: this.state.primaryOrganization.organization__id
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
                managersLoading: false,
                managers: res.data.data
              }, () => "MANAGERS SET", this.state);
          })
          .catch(err => console.log("[UserSettings] UserPermission fetch error: ", err));
    }

    fetchOrganizationSubjects = () => {
        let params = {
            results: 1000,
            page: 1,
            sortOrder: [],
            sortField: [],
            visibleFields: [],
            filters: {
                organization__id: this.state.primaryOrganization.organization__id
            }
          };
      
          params.visibleFields = params.visibleFields.concat(USER_SETTINGS_SUBJECT_LIST);
      
          let settings = JSON.stringify(params);
      
          con.get('/api/subject/', {
            params: {
              settings
            },
            headers: {
              Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
            }
          })
          .then(res => {
              this.setState({
                  subjects: res.data.data,
                  subjectsLoading: false
              });
          })
          .catch(err => console.log("[UserSettings] Subject fetch error: ", err));
    }

    fetchAllUsers = () => {
        let params = {
            results: 1000,
            page: 1,
            sortOrder: [],
            sortField: [],
            visibleFields: [],
            filters: {}
          };
      
          params.visibleFields = params.visibleFields.concat(USER_SETTINGS_USERS_LIST);
      
          let settings = JSON.stringify(params);
      
          con.get('/api/allusers/', {
            params: {
              settings
            },
            headers: {
              Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
            }
          })
          .then(res => {
              this.setState({
                  users: res.data,
                  usersLoading: false
              }, () => console.log("USER DATA ==> ", this.state));
          })
          .catch(err => console.log("[UserSettings] Users fetch error: ", err));
    }

    setUserPermissionIDs = (element) => {
        let userPermissions = [];

        if (element !== undefined) {
            if (element['permissions'] !== undefined) {
                userPermissions = element['permissions'].split(";");
            }
        }

        return userPermissions;
    }

    handleTagChange = (elName, e) => {
        this.setState({
            [elName]: e
        });
    }

    handleSubmit = (accountId, elId, organizationId, e) => {
        // Saves changes to Dicitonary -> requests PUT
        let permissions = this.state['permissions' + elId].join(";");
        let user = this.state['user' + elId];

        let updateDict = {
            id: elId,
            permissions: permissions,
            account: user,
            organization: organizationId,
            subject: this.state['subjects' + elId],
            is_active: true,
            is_locked: false
        };

        this.props.UpdatePost(elId, updateDict, 'userpermission');
    }

    handleDelete = (elId, e) => {
        let managersArray = this.state.managers;
        let deletedPostIndex = null;

        managersArray.forEach((el, i) => {
            if (el.id == elId) {
                deletedPostIndex = i;
            }
        });

        if (deletedPostIndex === null)
            return;

        this.props.DeletePost(elId, 'userpermission');
        this.fetchOrganizationManagers();

        managersArray.splice(deletedPostIndex, 1);
        this.setState({
            managers: managersArray
        });
    }

    renderOrganizationManagers = () => {
        if (this.state.managersLoading) {
            return <Spin tip="Loading..." size="large" />;
        } else {
            if (!this.state.formSet) {
                this.state.managers.forEach(el => {
                    this.setState({
                        ['permissions' + el.id]: this.setUserPermissionIDs(el),
                        ['subjects' + el.id]: el.subject.map(elSubject => elSubject.id),
                        ['user' + el.id]: el.account__id
                    });
                });

                this.setState({
                    formSet: true
                })
            }

            return this.state.managers.map(el => {
                return (
                    <div style={{ marginBottom: '0.6%' }} key={el.id}>
                    <Select
                    showSearch
                    style={{ width: '28%', marginLeft: '0.4%' }}
                    placeholder="Select user"
                    optionFilterProp="children"
                    defaultValue={el.account__id}
                    onChange={(e) => this.handleTagChange(`user${el.id}`, e)}
                    >
                        {this.state.usersLoading
                        ? <Option value="NULL" disabled>Loading...</Option>
                        : this.state.users.map(elUser => {
                            if(elUser.id === this.props.user.userInfo.id)
                                return;

                            return <Option value={elUser.id}>{elUser.username}</Option>
                        })
                        }
                    </Select>
                    <Select
                    mode="multiple"
                    style={{ width: '28%', marginLeft: '0.4%' }}
                    defaultValue={this.setUserPermissionIDs(el)}
                    onChange={(e) => this.handleTagChange(`permissions${el.id}`, e)}
                    >
                        <Option value="CREATE">CREATE</Option>
                        <Option value="READ">READ</Option>
                        <Option value="UPDATE">UPDATE</Option>
                        <Option value="DELETE">DELETE</Option>
                    </Select>
                    <Select
                    mode="multiple"
                    style={{ width: '28%', marginLeft: '0.4%' }}
                    defaultValue={el.subject.map(elSubject => elSubject.id)}
                    onChange={(e) => this.handleTagChange(`subjects${el.id}`, e)}
                    >
                    {this.state.usersLoading
                    ? <Option value="NULL" disabled>Loading...</Option>
                    : this.state.subjects.map(elSubject => {
                        return <Option value={elSubject.id}>{elSubject.name}</Option>
                        })
                    }
                    </Select>
                    <Button onClick={(e) => this.handleSubmit(el.account__id, el.id, el.organization__id, e)} style={{ marginLeft: '0.4%' }} type="primary">Save</Button>
                    <Button onClick={(e) => this.handleDelete(el.id, e)} style={{ marginLeft: '0.4%' }} type="danger">Remove</Button>
                    </div>
                );
            });
        }
    }

    render() {
        return (
            <div>
                <h3 style={{ textAlign: 'center' }}>Choose organization: </h3>
                <Select onFocus={this.fetchUserOrganizations} onChange={this.handleChange} style={{ width: '100%'}}>
                    {this.renderUserOrganizations()}
                </Select>
                <Button style={{ marginTop: '1%' }} onClick={this.updateUserActiveOrganization} type="primary" block>Confirm</Button>
                <hr />
                <h3 onClick={this.setUserPermissionIDs} style={{ textAlign: 'center' }}>Manage your organization: </h3>
                {this.renderOrganizationManagers()}
                <Button block type="default">Add new manager</Button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.auth
    }
}

export default connect(mapStateToProps, { FetchUserStart, UpdatePost, DeletePost })(UserSettings);