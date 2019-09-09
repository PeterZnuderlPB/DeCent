import React from 'react';
import { connect } from 'react-redux';
import {
    FetchCooperativeAction,
    SetCooperativeChatAction,
    ResetCooperativeChatAction
} from '../../actions/WorkPlatform/cooperativeActions';
import {
    FetchCooperativeNewsAction,
    SetSignleCooperativeNewsAction
} from '../../actions/WorkPlatform/cooperativeNewsActions';
import {
    FetchCooperativeChatAction,
    AddCooperativeChatAction,
} from '../../actions/WorkPlatform/cooperativeChatActions';
import {
    Row,
    Col,
    Input,
    Button,
    Icon,
    Card,
    Spin,
    Modal,
    Tooltip
} from 'antd';
import {
    COOPERATIVE_MANAGMENT_COOPERATIVE_NEWS,
    COOPERATIVE_DASHBOARD_COOPERATIVE_CHAT
} from '../../constants';
import MiscUtilities from '../../utilities/MiscUtilities';
import history from '../../history';

class MyCooperative extends React.Component {
    state = {
        modalVisible: false,
        chat: ''
    }

    componentDidMount = () => {
        this.props.FetchCooperativeAction();

        if(this.props.user.userInfo.id !== undefined)
            this.props.SetCooperativeChatAction();
    }

    componentDidUpdate = prevProps => {
        if (prevProps.user.userInfo.id !== this.props.user.userInfo.id) {
            this.props.SetCooperativeChatAction();
            this.props.FetchCooperativeAction();
        }

        if (prevProps.cooperative.cooperativeData.data !== this.props.cooperative.cooperativeData.data) {
            this.props.FetchCooperativeNewsAction(COOPERATIVE_MANAGMENT_COOPERATIVE_NEWS, { cooperative__id: this.props.cooperative.cooperativeData.data.id });
            this.props.FetchCooperativeChatAction(COOPERATIVE_DASHBOARD_COOPERATIVE_CHAT, { cooperative__id: this.props.cooperative.cooperativeData.data.id });
        }

        if (prevProps.cooperativeChat.data.data !== this.props.cooperativeChat.data.data) {
            const chatBox = document.getElementById('chatBox');
            chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight;
        }

        console.log("Props update  => ", this.props);
    }

    componentWillUnmount = () => this.props.ResetCooperativeChatAction();

    handleModalShow = newsId => {
        this.props.SetSignleCooperativeNewsAction(newsId);

        this.setState({
            modalVisible: true
        });
    }

    handleModalOk = () => {
        this.setState({
            modalVisible: false
        });
    }

    handleModalCancel = () => {
        this.setState({
            modalVisible: false
        });
    }

    handleChatSend = () => {
        const currentChat = this.state.chat;

        this.setState({
            chat: ''
        });

        this.props.AddCooperativeChatAction(currentChat, this.props.cooperative.cooperativeData.data.id);
    }

    handleChatChange = e => {
        this.setState({
            chat: e.target.value
        });
    }

    handleKeyDown = e => {
        if (e.key === 'Enter')
            this.handleChatSend();
    }

    renderNews = () => {
        if (this.props.cooperativeNews.loading) {
            return <Spin tip="Loding news.." size="large" />;
        } else {
            return this.props.cooperativeNews.data.data.map(el => {
                return (
                    <>
                    <Card
                    style={{ width: '80%', marginTop: '1%' }}
                    cover={
                        <img
                        src={`http://localhost:8000${el.thumbnail}`}
                        alt="image"
                        style={{ height: '200px' }}
                        />
                    }
                    >
                        <h1>{el.title}</h1>
                        <p style={{ wordBreak: 'break-all' }}>{el.content.substring(0, 80)}...</p>
                        <p onClick={() => this.handleModalShow(el.id)} style={{ cursor: 'pointer', fontWeight: 'lighter', float: 'right' }}>More</p>
                    </Card>
                    </>
                );
            });
        }
    }

    renderContracts = () => {
        return (
            <>
            <p style={{ cursor: 'pointer', userSelect: 'none', color: 'rgba(35, 129, 252, 0.6)' }} onClick={() => history.push('/contract/1')}>Contract #1 - Izdelava LetGO aplikacije - Estimate: 12.10.2019</p>
            </>
        );
    }

    renderChat = () => {
        if(this.props.cooperativeChat.data.data !== undefined) {
            return (
                <>
                <div id='chatBox' style={{ overflowY: 'auto', padding: '1%', wordBreak: 'break-all', backgroundColor: 'rgba(227, 119, 111, 0.6)', height: '35vh', width: '80%' }}>
                    {this.props.cooperativeChat.data.data.map(el => {
                        return <Tooltip title={`Posted on ${el.message_sent}`}><p><b>{el.account__username}: </b>{el.message}</p></Tooltip>;
                    })}
                </div>
                <Input style={{ marginTop: '1%', width: '80%' }} type="text" onKeyDown={this.handleKeyDown} value={this.state.chat} onChange={this.handleChatChange} placeholder="Enter your message" />
                <Button style={{ marginTop: '1%' }} type="primary" onClick={this.handleChatSend}>Send <Icon style={{ fontSize: '1.5rem' }} type="swap-right" /></Button>
                </>
            );
        }
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
                            <div style={{ wordBreak: 'break-all' }}>
                                {this.renderContracts()}
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8}>
                        <div style={centerStyle}>
                            <h1 style={submenuTitle}>Chat</h1>
                            {this.renderChat()}
                        </div>
                    </Col>
                </Row>

                <Modal
                title={this.props.cooperativeNews.singleLoading ? 'Loading...' : this.props.cooperativeNews.singleData.title}
                visible={this.state.modalVisible}
                onOk={this.handleModalOk}
                onCancel={this.handleModalCancel}
                >
                    {this.props.cooperativeNews.singleLoading
                    ? 'Loading...'
                    : (
                        <div style={centerStyle}>
                            <h1>{this.props.cooperativeNews.singleData.title}</h1>
                            <span style={{ fontWeight: 'lighter' }}>{`Published on ${MiscUtilities.GetFrontendDate(this.props.cooperativeNews.singleData.date_published)}`}</span>
                            <div>
                                <img
                                src={`http://localhost:8000${this.props.cooperativeNews.singleData.thumbnail}`}
                                alt={this.props.cooperativeNews.singleData.title}
                                style={{ height: '200px' }}
                                />
                            </div>
                            <div style={{ marginTop: '1%', wordBreak: 'break-all' }}>
                                <p>{this.props.cooperativeNews.singleData.content}</p>
                            </div>
                        </div>
                    )
                    }
                </Modal>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.auth,
        cooperative: state.cooperative,
        cooperativeNews: state.cooperativeNews,
        cooperativeChat: state.cooperativeChat
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

export default connect(mapStateToProps, {
    FetchCooperativeAction,
    SetCooperativeChatAction,
    ResetCooperativeChatAction,
    FetchCooperativeNewsAction,
    SetSignleCooperativeNewsAction,
    FetchCooperativeChatAction,
    AddCooperativeChatAction
})(MyCooperative);