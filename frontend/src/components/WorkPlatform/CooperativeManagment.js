import React from 'react';
import { connect } from 'react-redux';
import {
    FetchCooperativeAction,
    UpdateCooperativeMembersAction,
    SetCooperativeWorkerAction
} from '../../actions/WorkPlatform/cooperativeActions';
import {
    FetchCooperativeEnrollmentAction,
    AcceptCooperativeEnrollmentAction,
    SetSingleCooperativeEnrollmentAction
} from '../../actions/WorkPlatform/cooperativeEnrollmentActions';
import { FetchCompetenciesAction } from '../../actions/WorkPlatform/competenciesActions';
import {
    Spin,
    Row,
    Col,
    Input,
    Button,
    Popconfirm,
    Icon,
    Modal,
    Select
} from 'antd';
import {
    COOPERATIVE_MAMANGMENT_APPLICATION_LIST,
    COOPERATIVE_MAMANGMENT_COMPETENCIES
} from '../../constants';
import CompetencyUtilities from '../../utilities/CompetencyUtilities';

const { Option } = Select;

class CooperativeManagment extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            modalVisible: false,
            title: '',
            userCompetencies: []
        }
    }

    componentDidMount = () => {
        this.props.FetchCooperativeAction();
        this.props.FetchCompetenciesAction(COOPERATIVE_MAMANGMENT_COMPETENCIES);
    }

    componentDidUpdate = prevProps => {
        if (prevProps.user.userInfo.id !== this.props.user.userInfo.id) {
            this.props.FetchCooperativeAction();
            this.props.FetchCompetenciesAction(COOPERATIVE_MAMANGMENT_COMPETENCIES);
        }

        if (prevProps.cooperative.cooperativeData.data !== this.props.cooperative.cooperativeData.data)
            this.props.FetchCooperativeEnrollmentAction(this.props.cooperative.cooperativeData.data.id, COOPERATIVE_MAMANGMENT_APPLICATION_LIST)

        console.log(this.props);
    }

    handleAccept = e => {
        this.props.AcceptCooperativeEnrollmentAction(e.target.value, true);
    }

    handleDeny = e => {
        this.props.AcceptCooperativeEnrollmentAction(e.target.value);
    }

    handleRemove = userid => {
        this.props.UpdateCooperativeMembersAction(this.props.cooperative.cooperativeData.data.id, userid);
    }

    handleApplicantShow = elId => {
        this.props.SetSingleCooperativeEnrollmentAction(elId);

        this.setState({
            modalVisible: true,
            title: 'Applicant information'
        }, () => {
            if (this.props.cooperativeEnrollment.singleData !== undefined) {
                this.setState({
                    userCompetencies: CompetencyUtilities.GetUserCompetencies(this.props.competencies.data.data, this.props.cooperativeEnrollment.singleData.enroller__competencys)
                });
            }
        });
    }

    handleWorkerShow = elId => {
        this.props.SetCooperativeWorkerAction(elId);

        this.setState({
            modalVisible: true,
            title: 'Worker information'
        }, () => {
            if (this.props.cooperative.cooperativeWorker !== undefined) {
                this.setState({
                    userCompetencies: CompetencyUtilities.GetUserCompetencies(this.props.competencies.data.data, this.props.cooperative.cooperativeWorker.competencys)
                });
            }
        });
    }

    handleModalClose = () => {
        this.setState({
            modalVisible: false
        });
    }

    renderCompetencies = confirmed => {
        if (confirmed) {
            return (
                <p><i>None</i></p>
            );
        } else {
            return (
                <>
                {this.state.userCompetencies.map(el => {
                    return <p key={el.id}>{el.name}</p>;
                })}
                </>
            );
        }
    }

    renderModal = () => {
        if (this.state.title === 'Applicant information') {
            return (
                <Modal
                title={this.state.title}
                visible={this.state.modalVisible}
                footer={[
                    <Button onClick={this.handleModalClose} type="primary">
                        Close
                    </Button>
                ]}
                >
                    {this.props.cooperativeEnrollment.singleLoading
                    ? <Spin tip="Loading applicant data..." />
                    : <div>
                        <p><b>Username:</b> {this.props.cooperativeEnrollment.singleData !== undefined ? this.props.cooperativeEnrollment.singleData.enroller__username : null}</p>
                        <p><b>Application comment: </b>{this.props.cooperativeEnrollment.singleData !== undefined ? this.props.cooperativeEnrollment.singleData.comment : null}</p>
                        <p><b>Biography:</b> {this.props.cooperativeEnrollment.singleData !== undefined ? this.props.cooperativeEnrollment.singleData.enroller__biography : null}</p>
                        <p><b>Competencies:</b> {this.renderCompetencies(false)}</p>
                        <p><b>Confirmed competencies (Blockchain - <i>Placeholder</i>):</b> {this.renderCompetencies(true)}</p>
                      </div>
                    }
                </Modal>
            );
        } else {
            return (
                <Modal
                    title={this.state.title}
                    visible={this.state.modalVisible}
                    footer={[
                        <Button onClick={this.handleModalClose} type="primary">
                            Close
                        </Button>
                    ]}
                    >
                        <p><b>Username:</b> {this.props.cooperative.cooperativeWorker !== undefined ? this.props.cooperative.cooperativeWorker.username : null}</p>
                        <p><b>Biography:</b> {this.props.cooperative.cooperativeWorker !== undefined ?this.props.cooperative.cooperativeWorker.biography : null}</p>
                        <p><b>Competencies:</b> {this.renderCompetencies(false)}</p>
                        <p><b>Confirmed competencies (Blockchain - <i>Placeholder</i>):</b> {this.renderCompetencies(true)}</p>
                    </Modal>
            );
        }
    }

    renderWorkers = () => {
        if (this.props.cooperative.cooperativeData.data === undefined)
            return null;

        return this.props.cooperative.cooperativeData.data.workers.map(el => {
            if (el.id === this.props.user.userInfo.id)
                return null;

            return (
                <div>
                    <Row gutter={2}>
                        <Col style={{ marginBottom: '1%' }} xs={24} sm={24} md={8} lg={8}>
                            <Input type="text" disabled={true} style={{ marginBottom: '2%' }} defaultValue={el.username} />
                        </Col>

                        <Col style={{ marginBottom: '1%' }} xs={24} sm={24} md={8} lg={8}>
                            <Button onClick={() => this.handleWorkerShow(el.id)} block type="primary">View</Button>
                        </Col>

                        <Col style={{ marginBottom: '1%' }} xs={24} sm={24} md={8} lg={8}>
                            <Popconfirm
                            placement="top"
                            icon={<Icon type="warning" style={{ color: 'red' }} />} 
                            title="Are you sure you want to remove this member?" 
                            onConfirm={() => this.handleRemove(el.id)} 
                            okText="Yes" 
                            cancelText="No"
                            value={el.id}
                            >
                                <Button value={el.id} block type="danger">Remove</Button>
                            </Popconfirm>
                        </Col>
                    </Row>
                </div>
            );
        })
    }

    renderApplications = () => {
        if (this.props.cooperativeEnrollment.data.data === undefined)
            return null;

        return this.props.cooperativeEnrollment.data.data.map(el => {
            return (
                <div>
                    <Row gutter={2}>
                        <Col style={{ marginBottom: '1%' }} xs={24} sm={24} md={8} lg={8}>
                            <Input type="text" disabled={true} style={{ marginBottom: '2%' }} defaultValue={el.enroller__username} />
                        </Col>

                        <Col style={{ marginBottom: '1%' }} xs={24} sm={24} md={8} lg={8}>
                            <Button block type="primary" onClick={() => this.handleApplicantShow(el.id)}>View</Button>
                        </Col>

                        <Col style={{ marginBottom: '1%' }} xs={24} sm={24} md={8} lg={8}>
                            <Button value={el.id} onClick={this.handleAccept} block type="primary" style={{ backgroundColor: 'rgba(92, 184, 92, 1.0)', border: '1px solid rgba(92, 184, 92, 0.6)' }}>Accept</Button>
                        </Col>
                        <Col style={{ marginBottom: '1%' }} xs={24} sm={24} md={8} lg={8}>
                            <Button value={el.id} onClick={this.handleDeny} block type="primary" style={{ backgroundColor: '#d9534f', border: '1px solid #d9534f' }}>Deny</Button>
                        </Col>
                    </Row>
                </div>
            );
        })
    }

    renderCooperative = () => {
        if (this.props.cooperative.cooperativeLoading) {
            return <Spin tip="Loading cooperative..." size="large" />
        } else {
            return (
                <Row gutter={8}>
                    <Col style={{ display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent: 'center', flexDirection: 'column' }} xs={24} sm={24} md={8} lg={8}>
                        <h3 style={{ textAlign: 'center' }}>Members</h3>
                        {this.renderWorkers()}
                    </Col>
                    <Col style={{ display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent: 'center', flexDirection: 'column' }} xs={24} sm={24} md={8} lg={8}>
                        <h3 style={{ textAlign: 'center' }}>Proposals</h3>
                    </Col>
                    <Col style={{ display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent: 'center', flexDirection: 'column' }} xs={24} sm={24} md={8} lg={8}>
                        <h3 style={{ textAlign: 'center' }}>Applications</h3>
                        {this.renderApplications()}
                    </Col>
                    {this.renderModal()}
                </Row>
            );
        }
    }

    render() {
        return(
            <div>
                <h1 style={{ textAlign: 'center', fontSize: '1.3rem' }}>Manage cooperative</h1>
                <hr />
                {this.props.cooperative.cooperativeData.data !== undefined 
                ?   this.props.cooperative.cooperativeData.data.owner.id === this.props.user.userInfo.id
                    ? this.renderCooperative()
                    : <h1>This is not your cooperative!</h1>
                : null
                }
            </div>
        );
    }
}

const mapStateToProps = state =>{
    return {
        user: state.user.auth,
        cooperative: state.cooperative,
        cooperativeEnrollment: state.cooperativeEnrollment,
        competencies: state.competencies
    }
}

export default connect(mapStateToProps, {
    FetchCooperativeAction,
    FetchCooperativeEnrollmentAction,
    AcceptCooperativeEnrollmentAction,
    UpdateCooperativeMembersAction,
    SetSingleCooperativeEnrollmentAction,
    FetchCompetenciesAction,
    SetCooperativeWorkerAction
})(CooperativeManagment);