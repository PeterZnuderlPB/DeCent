import React from 'react';
import { connect } from 'react-redux';
import { FetchCooperativeAction } from '../../actions/WorkPlatform/cooperativeActions';
import {
    Row,
    Col,
    Input,
    Button,
    Icon,
    Card
} from 'antd';

class MyCooperative extends React.Component {
    componentDidMount = () => {
        this.props.FetchCooperativeAction();
    }

    componentDidUpdate = prevProps => {
        if (prevProps.user.userInfo.id !== this.props.user.userInfo.id) {
            this.props.FetchCooperativeAction();
        }
    }

    renderNews = () => {
        return (
            <>
            <Card
            style={{ width: '80%' }}
            cover={
                <img
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                alt="image"
                style={{ height: '200px' }}
                />
            }
            >
                <h1>Title</h1>
                <p>Content</p>
                <p style={{ cursor: 'pointer', fontWeight: 'lighter', float: 'right' }}>More</p>
            </Card>
            </>
        );
    }

    renderContracts = () => {
        return (
            <>
            <Button type="link">Contract #1 - Izdelava LetGO aplikacije - Estimate: 12.10.2019</Button>
            </>
        );
    }

    renderChat = () => {
        return (
            <>
            <div style={{ overflowY: 'auto', padding: '1%', wordBreak: 'break-all', backgroundColor: 'rgba(227, 119, 111, 0.6)', height: '35vh', width: '80%' }}>
                <p><b>Miha: </b>Ja Python je res dober jezik</p>
                <p><b>Marko: </b> Lorem ipsom ireuireb</p>
                <p><b>Nejc: </b> Dolgi message da se chat prepogne eurhuerhuerhuerheurheurhwuireuwrhuerhuwruwehur lorem irneurue</p>
            </div>
            <Input style={{ marginTop: '1%', width: '80%' }} type="text" placeholder="Enter your message" />
            <Button style={{ marginTop: '1%' }} type="primary">Send <Icon style={{ fontSize: '1.5rem' }} type="swap-right" /></Button>
            </>
        );
    }

    render() {
        return (
            <>
                {this.props.cooperative.cooperativeLoading ? <h1>Loading...</h1> : <div style={{ userSelect: 'none', cursor: 'pointer', backgroundColor: 'rgba(208, 213, 219, 0.6)' }}><h1 style={{ fontSize: '1.5rem', textAlign: 'center' }}>{this.props.cooperative.cooperativeData.data ? this.props.cooperative.cooperativeData.data.title : null}</h1></div>}
                <Row gutter={8}>
                    <Col xs={24} sm={24} md={24} lg={8}>
                        <div style={centerStyle}>
                            <h1 style={submenuTitle}>News</h1>
                            {this.renderNews()}
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8}>
                        <div style={centerStyle}>
                            <h1 style={submenuTitle}>Contracts</h1>
                            {this.renderContracts()}
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8}>
                        <div style={centerStyle}>
                            <h1 style={submenuTitle}>Chat</h1>
                            {this.renderChat()}
                        </div>
                    </Col>
                </Row>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.auth,
        cooperative: state.cooperative
    }
}

const centerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center'
}

const submenuTitle = {
    fontSize: '1.1rem'
}

export default connect(mapStateToProps, { FetchCooperativeAction })(MyCooperative);