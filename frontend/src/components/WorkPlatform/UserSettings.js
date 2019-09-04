import React from 'react';
import con from '../../apis';
import {
    USER_SETTINGS_COMPETENCIES
} from '../../constants';
import { connect } from 'react-redux';
import {
    Select,
    Spin
} from 'antd';
import { UpdateUserAction } from '../../actions/index';
import { FetchCooperativeAction } from '../../actions/WorkPlatform/cooperativeActions';
import { FetchCompetenciesAction } from '../../actions/WorkPlatform/competenciesActions';
import UserUtilities from '../../utilities/UserUtilities';

const { Option } = Select;

// TODO: 
// Competencies don't show up on page on page refresh
// After completing the page -> refactor it in redux style
class UserSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            competencies: [],
            coopertivesLoading: true,
            cooperatives: []
        };
    }

    componentDidMount = () => {
        this.props.FetchCompetenciesAction(USER_SETTINGS_COMPETENCIES, { cacheEnabled: false });
        this.fetchAllCompetencies();
        this.fetchUserCooperatives();
    }

    componentDidUpdate = prevProps => {
        if (this.props.user.userInfo.id !== prevProps.user.userInfo.id) {
            this.props.FetchCompetenciesAction(USER_SETTINGS_COMPETENCIES, { cacheEnabled: false });
            this.fetchAllCompetencies();
            this.fetchUserCooperatives();
        }
        console.log("Props => ", this.props);
    }

    updateUserActiveType = selectedType => {
        this.props.UpdateUserAction(this.props.user.userInfo.id, { active_type: UserUtilities.GetUserType(selectedType) })
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

    handleTagChange = (elName, e) => {
        this.setState({
            [elName]: e
        });
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

    renderProfileSettings = () => {

        return (
            <div>
                <h4>User type: </h4>
                <Select
                style={{ width: '28%', marginLeft: '0.4%' }}
                onChange={(e) => this.updateUserActiveType(e)}
                defaultValue={UserUtilities.GetUserType(this.props.user.userInfo.active_type)}
                >
                    <Option value="WORKER">Worker</Option>
                    <Option value="INVESTOR">Investor</Option>
                    <Option value="COOPERATIVE">Cooperative</Option>
                </Select>
                <div>
                    <span><b>My competencies/skills:</b> </span>
                    <Select
                    mode="multiple"
                    style={{ width: '28%', marginLeft: '0.4%' }}
                    labelInValue={true}
                    defaultValue={this.props.user.userInfo.competencys !== undefined && this.props.user.userInfo.competencys.length !== 0 ? this.props.user.userInfo.competencys.map(t => { return {key: t.id.toString(), label: t.name}; }) : <Option value="NULL" disabled={true}>Loading..</Option>}
                    onChange={this.handleCompetencyChange}
                    onFocus={() => this.props.FetchCompetenciesAction(USER_SETTINGS_COMPETENCIES, { cacheEnabled: false })}
                    filterOption={(input, option) => 
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    >
                        {this.props.competencies.data.data !== undefined && this.props.competencies.length !== 0
                        ? this.props.competencies.data.data.map(el => {
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
                <h3 style={{ textAlign: 'center' }}>Your profile: </h3>
                {this.renderProfileSettings()}
                {this.renderUserCooperatives()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.auth,
        cooperative: state.cooperative,
        competencies: state.competencies
    }
}

export default connect(mapStateToProps, {
    UpdateUserAction,
    FetchCooperativeAction,
    FetchCompetenciesAction
})(UserSettings);