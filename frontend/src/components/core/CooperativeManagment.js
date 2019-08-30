import React from 'react';
import { connect } from 'react-redux';
import { FetchCooperativeAction } from '../../actions/cooperativeActions';
import { FetchCooperativeEnrollmentAction } from '../../actions/cooperativeEnrollmentActions';
import {
    Spin,
    Row,
    Col,
    Input,
    Button,
    Popconfirm,
    Icon
} from 'antd';
import { COOPERATIVE_MAMANGMENT_APPLICATION_LIST } from '../../constants';

class CooperativeManagment extends React.Component {
    componentDidMount = () => {
        this.props.FetchCooperativeAction();
    }

    componentDidUpdate = prevProps => {
        if (prevProps.user.userInfo.id !== this.props.user.userInfo.id)
            this.props.FetchCooperativeAction();

        if (prevProps.cooperative.cooperativeData.data !== this.props.cooperative.cooperativeData.data)
            this.props.FetchCooperativeEnrollmentAction(this.props.cooperative.cooperativeData.data.id, COOPERATIVE_MAMANGMENT_APPLICATION_LIST)

        console.log(this.props);
    }

    renderWorkers = () => {
        if (this.props.cooperative.cooperativeData.data === undefined)
            return null;

        return this.props.cooperative.cooperativeData.data.workers.map(el => {
            return (
                <div>
                    <Row gutter={2}>
                        <Col style={{ marginBottom: '1%' }} xs={24} sm={24} md={8} lg={8}>
                            <Input type="text" disabled={true} style={{ marginBottom: '2%' }} defaultValue={el.username} />
                        </Col>

                        <Col style={{ marginBottom: '1%' }} xs={24} sm={24} md={8} lg={8}>
                            <Button block type="primary">View</Button>
                        </Col>

                        <Col style={{ marginBottom: '1%' }} xs={24} sm={24} md={8} lg={8}>
                            <Popconfirm
                            placement="top"
                            icon={<Icon type="warning" style={{ color: 'red' }} />} 
                            title="Are you sure you want to remove this member?" 
                            onConfirm={() => console.log("Removed member ID => ", el.id)} 
                            okText="Yes" 
                            cancelText="No"
                            >
                                <Button block type="danger">Remove</Button>
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
                            <Button block type="primary">View</Button>
                        </Col>

                        <Col style={{ marginBottom: '1%' }} xs={24} sm={24} md={8} lg={8}>
                            <Button block type="primary" style={{ backgroundColor: 'rgba(92, 184, 92, 1.0)', border: '1px solid rgba(92, 184, 92, 0.6)' }}>Accept</Button>
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
        cooperativeEnrollment: state.cooperativeEnrollment
    }
}

export default connect(mapStateToProps, {
    FetchCooperativeAction,
    FetchCooperativeEnrollmentAction
})(CooperativeManagment);