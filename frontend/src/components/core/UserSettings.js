import React from 'react';
import con from '../../apis';
import {
    USER_SETTINGS_USERPERMISSIONS_LIST,
    USER_SETTINGS_PRIMARY_ORGANIZATION_LIST,
    USER_SETTINGS_SUBJECT_LIST,
    USER_SETTINGS_USERS_LIST
} from '../../constants';
import { connect } from 'react-redux';
import {
    Select,
    Button,
    Spin,
    Popconfirm,
    Icon,
    message
} from 'antd';
import { FetchUserStart } from '../../actions/index';
import { UpdatePost, DeletePost, AddPost } from '../../actions/PBEditViewActions';
import { timingSafeEqual } from 'crypto';

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
            formSet: false,
            organizationCurrentlyInUse: null,
            competencies: [],
            coopertivesLoading: true,
            cooperatives: []
        };
    }

    componentDidMount = () => {
        this.fetchPrimaryOrganization();
        this.fetchAllCompetencies();
        this.fetchAllUsers();
        this.fetchUserCooperatives();
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.user.userInfo.id !== prevProps.user.userInfo.id) {
            this.fetchPrimaryOrganization();
            this.fetchUserOrganizations();
            this.fetchAllCompetencies();
            this.fetchAllUsers();
            this.fetchUserCooperatives();
        }

        if(this.state.primaryOrganization !== prevState.primaryOrganization) {
            this.fetchOrganizationManagers();
            this.fetchOrganizationSubjects();
        }

        if(this.state.organizations.length !== prevState.organizations.length) {
            this.getCurrentSelectedOrganization();
        }

        if(this.props.user.userInfo.active_organization_id !== prevProps.user.userInfo.active_organization_id) {
            this.getCurrentSelectedOrganization();
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

    updateUserActiveType = selectedType => {
        con.patch(`/api/users/${this.props.user.userInfo.id}/`, {
            active_type: this.getUserType(selectedType)
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

          if (params != null) {
            params = {
              ...params,
              cacheEnabled: false
            }
          }
      
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

    fetchAllCompetencies = () => {
        let params = {
            results: 1000,
            page: 1,
            sortOrder: [],
            sortField: [],
            visibleFields: [],
            filters: {}
          };
      
          params.visibleFields.push('id', 'name');

          if (params != null) {
            params = {
              ...params,
              cacheEnabled: false
            }
          }
      
          let settings = JSON.stringify(params);
      
          con.get('/api/competency/', {
            params: {
              settings
            },
            headers: {
              Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
            }
          })
          .then(res => {
              this.setState({
                  competencies: res.data.data
               });
          })
          .catch(err => console.log("[UserSettings] Competency fetch error: ", err));
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

    fetchUserCooperatives = () => {
        let params = {
            results: 1000,
            page: 1,
            sortOrder: [],
            sortField: [],
            visibleFields: [],
            filters: {
                workers__id: this.props.user.userInfo.id
            }
          };
      
          params.visibleFields.push('id','title', 'about', 'owner__username', 'workers', 'competencys');

          if (params != null) {
            params = {
              ...params,
              cacheEnabled: false
            }
          }
      
          let settings = JSON.stringify(params);
      
          con.get('/api/cooperative/', {
            params: {
              settings
            },
            headers: {
              Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
            }
          })
          .then(res => {
              let noDuplicates = [...new Set(res.data.data.map(d => d.id))]
                                 .map(id => {
                                     return res.data.data.find(c => c.id === id);
                                 });

              this.setState({
                cooperatives: noDuplicates,
                coopertivesLoading: false
              });
          })
          .catch(err => console.log("[UserSettings] Cooperative fetch error: ", err));
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

        console.log(managersArray);

        managersArray.splice(deletedPostIndex, 1);
        this.setState({
            managers: managersArray
        });
    }

    handleAdd = e => {
        let addDict = {
            id: this.state.managers[this.state.managers.length - 1].id + 1,
            permissions: "READ",
            account__id: null,
            organization__id: this.state.primaryOrganization.organization__id,
            organization__name: this.state.primaryOrganization.organization__name,
            organization__organization_type: this.state.primaryOrganization.organization_organization__type,
            subject: [],
        };

        this.setState({
            managers: [
                ...this.state.managers,
                addDict
            ]
        });

        let postDict = {
            id: this.state.managers[this.state.managers.length - 1].id + 1,
            permissions: "READ",
            subject: [],
            account: addDict.account__id,
            organization: addDict.organization__id,
            is_active: true,
            is_locked: false
        }

        this.props.AddPost(postDict, 'userpermission');
        message.success("Permission set added - edit it to your likings and SAVE it!", 5);
        this.fetchOrganizationManagers();
    }

    getCurrentSelectedOrganization = () => {
        let selectedOrganization = this.state.organizations.find(el => {
            return el.organization__id ===this.props.user.userInfo.active_organization_id
        });

        this.setState({
            organizationCurrentlyInUse: selectedOrganization
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

                            return <Option key={elUser.id} value={elUser.id}>{elUser.username}</Option>
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
                    filterOption={(input, option) => 
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    >
                    {this.state.usersLoading
                    ? <Option value="NULL" disabled>Loading...</Option>
                    : this.state.subjects.map(elSubject => {
                        return <Option key={elSubject.id} value={elSubject.id}>{elSubject.name}</Option>
                        })
                    }
                    </Select>
                    <Button onClick={(e) => this.handleSubmit(el.account__id, el.id, el.organization__id, e)} style={{ marginLeft: '0.4%' }} type="primary">Save</Button>
                    <Popconfirm
                    placement="left"
                    title="Are you sure delete this permission?"
                    onConfirm={(e) => this.handleDelete(el.id, e)}
                    onCancel={() => console.log("canceled")}
                    icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                    okText="Yes"
                    cancelText="No"
                    >
                    <Button style={{ marginLeft: '0.4%' }} type="danger">Remove</Button>
                    </Popconfirm>
                    </div>
                );
            });
        }
    }

    handleCompetencyChange = e => {
        let competencyArray = [];

        e.forEach(el => {
            competencyArray.push(el.key);
        });

        con.patch(`/api/users/${this.props.user.userInfo.id}/`, {
            competencys: competencyArray
            },
            {
                headers: {
                    Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
            }
        })
        .then(res => this.props.FetchUserStart(this.props.user.token))
        .catch(err => console.log("[DetailView] UserSettings Competency patch error", err));
    }

    handleCooperativeChange = e => {
        con.patch(`/api/users/${this.props.user.userInfo.id}/`, {
            active_cooperative: e.key
        },
        {
            headers: {
                Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token 
        }
        })
        .then(() => this.props.FetchUserStart(this.props.user.token))
        .catch(err => console.log("[DetailView] CooperativeChange patch error", err));
    }

    getUserType = userType => {
            if (typeof(userType) === 'number') {
                switch (userType) {
                    case 1:
                        return "WORKER"
                    case 2:
                        return "INVESTOR"
                    case 3:
                        return "COOPERATIVE"
                    default:
                        return "NULL"
                }
            } else {
                switch (userType) {
                    case "WORKER":
                        return 1
                    case "INVESTOR":
                        return 2
                    case "COOPERATIVE":
                        return 3
                    default:
                        return 1
            }
        }
    }

    renderProfileSettings = () => {

        return (
            <div>
                <h4>User type: </h4>
                <Select
                style={{ width: '28%', marginLeft: '0.4%' }}
                onChange={(e) => this.updateUserActiveType(e)}
                defaultValue={this.getUserType(this.props.user.userInfo.active_type)}
                >
                    <Option value="WORKER">Worker</Option>
                    <Option value="INVESTOR">Investor</Option>
                    <Option value="COOPERATIVE">Cooperative</Option>
                </Select>
                <div>
                    <span onClick={() => console.log(this.props.user)}><b>My competencies/skills:</b> </span>
                    <Select
                    mode="multiple"
                    style={{ width: '28%', marginLeft: '0.4%' }}
                    labelInValue={true}
                    defaultValue={this.props.user.userInfo.competencys !== undefined && this.props.user.userInfo.competencys.length !== 0 ? this.props.user.userInfo.competencys.map(t => { return {key: t.id.toString(), label: t.name}; }) : <Option value="NULL" disabled={true}>Loading..</Option>}
                    onChange={this.handleCompetencyChange}
                    onFocus={this.fetchAllCompetencies}
                    filterOption={(input, option) => 
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    >
                        {this.state.competencies.length !== 0
                        ? this.state.competencies.map(el => {
                            return <Option key={el.id.toString()} value={el.id.toString()}>{el.name}</Option>;
                        })
                        : null
                        }
                    </Select>

                    <span style={{ marginLeft: '2%' }}><b>Confirmed competencies:</b> </span>
                    <Select
                    disabled={true}
                    mode="multiple"
                    style={{ width: '28%', marginLeft: '0.4%' }}
                    defaultValue={"C#"}
                    onChange={(e) => console.log(e)}
                    filterOption={(input, option) => 
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    >
                        <Option value="C#">C#</Option>
                        <Option value="JS">JS</Option>
                        <Option value="Django">Django</Option>
                        <Option value="Python">Python</Option>
                    </Select>
                </div>
            </div>
        );
    }

    renderUserCooperatives = () => {
        if (this.state.coopertivesLoading) {
            return <Spin tip="Loading..." size="large" />
        } else {
            if (this.state.cooperatives.length === 0) {
                return (
                    <>
                    <hr />
                    <h3>You are not a part of any cooperative.</h3>
                    </>
                );
            } else {
                return (
                    <>
                    <hr />
                    <span>Select cooperative(<b>Current: {this.state.cooperatives.map(el => { if(el.id === this.props.user.userInfo.active_cooperative) return el.title})}</b>): </span>
                    <Select
                    style={{ width: '28%', marginLeft: '0.4%' }}
                    labelInValue={true}
                    //TODO : DefaultValue
                    onChange={this.handleCooperativeChange}
                    onFocus={this.fetchUserCooperatives}
                    >
                        {!this.state.coopertivesLoading
                        ? this.state.cooperatives.map(el => {
                            return <Option key={el.id.toString()} value={el.id.toString()}>{el.title}</Option>;
                        })
                        : null
                        }
                    </Select>
                    </>
                );
            }
        }
    }

    render() {
        return (
            <div>
                <h3 style={{ textAlign: 'center' }}>Choose organization <i>(Current - <b>{this.state.organizationCurrentlyInUse !== null ? this.state.organizationCurrentlyInUse !== undefined ? this.state.organizationCurrentlyInUse.organization__name : 'Loading...' : 'Loading...'}</b>)</i>: </h3>
                <Select onFocus={this.fetchUserOrganizations} onChange={this.handleChange} style={{ width: '100%'}}>
                    {this.renderUserOrganizations()}
                </Select>
                <Button style={{ marginTop: '1%' }} onClick={this.updateUserActiveOrganization} type="primary" block>Confirm</Button>
                <hr />
                <h3 style={{ textAlign: 'center' }}>Manage your organization: </h3>
                {this.renderOrganizationManagers()}
                <Button onClick={this.handleAdd} block type="default">Add new manager</Button>
                <hr />
                <h3 style={{ textAlign: 'center' }}>Your profile: </h3>
                {this.renderProfileSettings()}
                {this.renderUserCooperatives()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.auth
    }
}

export default connect(mapStateToProps, {
    FetchUserStart,
    UpdatePost,
    DeletePost,
    AddPost
})(UserSettings);