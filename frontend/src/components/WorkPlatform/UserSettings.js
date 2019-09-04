import React from 'react';
import con from '../../apis';
import {
    USER_SETTINGS_COMPETENCIES,
    USER_SETTINGS_COOPERATIVE_LIST
} from '../../constants';
import { connect } from 'react-redux';
import {
    Select,
    Spin
} from 'antd';
import { UpdateUserAction } from '../../actions/index';
import {
    FetchAllCooperativesAction
} from '../../actions/WorkPlatform/cooperativeActions';
import { FetchCompetenciesAction } from '../../actions/WorkPlatform/competenciesActions';
import UserUtilities from '../../utilities/UserUtilities';

const { Option } = Select;

class UserSettings extends React.Component {
    componentDidMount = () => {
        this.props.FetchCompetenciesAction(USER_SETTINGS_COMPETENCIES, { cacheEnabled: false });
        this.props.FetchAllCooperativesAction(USER_SETTINGS_COOPERATIVE_LIST, { workers__id: this.props.user.userInfo.id });
    }

    componentDidUpdate = prevProps => {
        if (this.props.user.userInfo.id !== prevProps.user.userInfo.id) {
            this.props.FetchCompetenciesAction(USER_SETTINGS_COMPETENCIES, { cacheEnabled: false });
            this.props.FetchAllCooperativesAction(USER_SETTINGS_COOPERATIVE_LIST, { workers__id: this.props.user.userInfo.id , cacheEnabled: false});
        }
    }

    updateUserActiveType = selectedType => {
        this.props.UpdateUserAction(this.props.user.userInfo.id, { active_type: UserUtilities.GetUserType(selectedType) })
    }

    handleCompetencyChange = e => {
        let competencyArray = [];

        e.forEach(el => {
            competencyArray.push(el.key);
        });
        this.props.UpdateUserAction(this.props.user.userInfo.id, { competencys: competencyArray });
    }

    handleCooperativeChange = e => {
        this.props.UpdateUserAction(this.props.user.userInfo.id, { active_cooperative: e.key });
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
        if (this.props.cooperative.cooperativeAllLoading) {
            return <Spin tip="Loading..." size="large" />
        } else {
            if (this.props.cooperative.cooperativeAllData.data && this.props.cooperative.cooperativeAllData.data.length === 0) {
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
                    <span>Select cooperative(<b>Current: {this.props.cooperative.cooperativeAllData.data ? this.props.cooperative.cooperativeAllData.data.map(el => { if(el.id === this.props.user.userInfo.active_cooperative) return el.title}) : null}</b>): </span>
                    <Select
                    style={{ width: '28%', marginLeft: '0.4%' }}
                    labelInValue={true}
                    onChange={this.handleCooperativeChange}
                    >
                        {this.props.cooperative.cooperativeAllData.data
                        ? this.props.cooperative.cooperativeAllData.data.map(el => {
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
    FetchAllCooperativesAction,
    FetchCompetenciesAction
})(UserSettings);