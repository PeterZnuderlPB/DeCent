import React from 'react';
import { connect } from 'react-redux';
import {
    Row,
    Col,
    Card,
    Spin,
    Button,
    Popconfirm,
    Icon,
    Modal,
    Input,
    Select,
    message
} from 'antd';
import {
    AddPost
} from '../../actions/PBEditViewActions';
import con from '../../apis';
import history from '../../history';

const { TextArea } = Input;
const { Option } = Select;

class Cooperatives extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cooperativesLoading: true,
            cooperatives: [],
            applicationsLoading: true,
            applications: [],
            modalVisible: false,
            comment: '',
            enrollingSelected: 0
        };
    }

    componentDidMount = () => {
        this.fetchCooperatives();
    }

    componentDidUpdate = prevProps => {
        if (prevProps.user.userInfo.id !== this.props.user.userInfo.id) {
            this.fetchCooperatives();
        }
    }

    fetchCooperatives = () => {
        let params = {
            results: 1000,
            page: 1,
            sortOrder: [],
            sortField: [],
            visibleFields: [],
            filters: {}
          };
      
          params.visibleFields.push('id','title', 'about', 'owner__username', 'workers', 'competencys', 'owner__id');
      
          let settings = JSON.stringify(params);

        con.get(`api/cooperative/`, {
            params: {
                settings
            },
            headers: {
                Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
            }
        })
        .then(res => {
            console.log("COOPER", res);
            this.setState({
                cooperatives: res.data.data,
                cooperativesLoading: false
            });
            this.fetchUserApplications();
        })
        .catch(err => {
            console.log('[Error] Cooperative - cooperatives fetch ', err);
        });
    }

    fetchUserApplications = () => {
        let params = {
            results: 1000,
            page: 1,
            sortOrder: [],
            sortField: [],
            visibleFields: [],
            filters: {
                enroller__id: this.props.user.userInfo.id
            }
          };
      
          params.visibleFields.push('id', 'enroller__id', 'cooperative__id');
      
          let settings = JSON.stringify(params);

        con.get(`api/cooperativeenrollment/`, {
            params: {
                settings
            },
            headers: {
                Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
            }
        })
        .then(res => {
            this.setState({
                applicationsLoading: false,
                applications: res.data.data
            });
        })
        .catch(err => {
            console.log('[Error] Cooperatives - Applications fetch ', err);
        });
    }

    calculateUserRows = () => {
        let rowArray = [];
        let length = this.state.cooperatives.length;

        while (length / 4 > 1) {
            rowArray.push('row');
            length = length / 4;
        }

        return rowArray;
    }

    handleCooperativeLeave = (cooperativeId, ownerId) => {
        if (this.props.user.userInfo.id === ownerId) {
            message.error("You cannot leave your own cooperative!");
            return;
        }


        con.patch(`api/cooperative/${cooperativeId}`, {
            workerRemove__id: this.props.user.userInfo.id
        },
        {
            headers: {
                Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
            }
        })
        .then(() => this.fetchCooperatives())
        .catch(() => console.log("ERROR"));
    }

    handleModalShow = e => {
        this.setState({
            modalVisible: true,
            enrollingSelected: e.target.value
        });
    }

    handleModalOk = () => {
        this.setState({
            modalVisible: false
        });

        const cooperativeEnrollmentModel = {
            enroller: this.props.user.userInfo.id,
            cooperative: this.state.enrollingSelected,
            comment: this.state.comment,
            is_active: true,
            is_locked: false
        }

        this.props.AddPost(cooperativeEnrollmentModel, 'cooperativeenrollment')
        this.fetchCooperatives();
    }

    handleModalCancel = () => {
        this.setState({
            modalVisible: false
        });
    }

    handleCommentChange = e => {
        this.setState({
            comment: e.target.value
        });
    }

    renderCooperatives = () => {
        if (this.state.cooperativesLoading) {
            return <Spin tip="Loading workers..." size="large" />
        } else {
            if (this.state.cooperatives.length <= 4) {
                return (
                    <>
                    <div style={{ marginTop: '3%' , marginLeft: '2%'}}>
                        <Row gutter={8}>
                            {this.state.cooperatives.map(el => {
                                return (
                                    <Col xs={24} sm={24} md={12} lg={6}>
                                        <Card title={el.title} extra={<a href="#">More</a>} style={{ width: 300, height: '100%' }}>
                                            <p><b>Needed competencies: </b></p>
                                            <ul>
                                                {el.competencys.map(comp => {
                                                    return <li>{comp.name}</li>;
                                                })}
                                            </ul>
                                            <p><b>Members: </b></p>
                                            <ul>
                                                {el.workers.map(worker => {
                                                    return <li>{worker.username}</li>;
                                                })}
                                            </ul>
                                            <p>Biography: {`${el.about.substring(0, 50)}...`}</p>
                                            {el.workers.findIndex(elW => { return elW.id == this.props.user.userInfo.id }) === -1
                                                ? this.state.applications.findIndex(a => { return a.cooperative__id == el.id }) === -1 
                                                    ? <Button block type="primary" value={el.id} onClick={this.handleModalShow}>Enroll</Button>
                                                    : <Button block type="primary" value={el.id} disabled={true}>Pending...</Button>
                                            : <Popconfirm
                                              placement="top"
                                              icon={<Icon type="warning" style={{ color: 'red' }} />} 
                                              title="Are you sure you want to leave this cooperative?" 
                                              onConfirm={() => this.handleCooperativeLeave(el.id, el.owner__id)} 
                                              okText="Yes" 
                                              cancelText="No"
                                              >
                                                <Button block type="danger">Leave</Button>
                                            </Popconfirm>
                                            }
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    </div>
                    </>
                );
            } else {
                return this.calculateUserRows().map((el, i) => {
                    if (i < 1) {
                        return (
                            <>
                            <div style={{ marginTop: '3%' , marginLeft: '2%'}}>
                                <Row gutter={8}>
                                    {this.state.cooperatives.map(el => {
                                        return (
                                            <Col xs={24} sm={24} md={12} lg={6}>
                                                <Card title={el.title} extra={<a href="#">More</a>} style={{ width: 300, height: '100%' }}>
                                                    <p><b>Needed competencies: </b></p>
                                                    <ul>
                                                        {el.competencys.map(comp => {
                                                            return <li>{comp.name}</li>;
                                                        })}
                                                    </ul>
                                                    <p><b>Members: </b></p>
                                                    <ul>
                                                        {el.workers.map(worker => {
                                                            return <li>{worker.username}</li>;
                                                        })}
                                                    </ul>
                                                    <p>Biography: {`${el.about.substring(0, 50)}...`}</p>
                                                </Card>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </div>
                            </>
                          )
                    } else {
                        return (
                            <>
                            <div style={{ marginTop: '3%' , marginLeft: '2%'}}>
                                <Row gutter={8}>
                                    {this.state.cooperatives.map((el, j) => {
                                        if (j < i*j) 
                                            return;
                                        
                                        return (
                                            <Col xs={24} sm={24} md={12} lg={6}>
                                                <Card title={el.title} extra={<a href="#">More</a>} style={{ width: 300, height: '100%' }}>
                                                    <p><b>Needed competencies: </b></p>
                                                    <ul>
                                                        {el.competencys.map(comp => {
                                                            return <li>{comp.name}</li>;
                                                        })}
                                                    </ul>
                                                    <p><b>Members: </b></p>
                                                    <ul>
                                                        {el.workers.map(worker => {
                                                            return <li>{worker.username}</li>;
                                                        })}
                                                    </ul>
                                                    <p>: {`${el.about.substring(0, 50)}...`}</p>
                                                </Card>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </div>
                            </>
                          )
                    }
                })
            }
        }
    }

    renderModal = () => {
        if (this.props.user.userInfo.id !== undefined) {
            return (
                <Modal
                title="Cooperative signup"
                visible={this.state.modalVisible}
                onOk={this.handleModalOk}
                onCancel={this.handleModalCancel}
                >
                    <h4>Username:</h4>
                    <Input type="text" disabled={true} defaultValue={this.props.user.userInfo.username} />
                    <h4>Your competencies:</h4>
                    <Select mode="multiple" labelInValue={true} defaultValue={this.props.user.userInfo.competencys.map(el => { return {key: el.id.toString(), label: el.name }; })} disabled={true}>
                        {this.props.user.userInfo.competencys.map(el => {
                            return <Option key={el.id.toString()} value={el.id.toString()}>{el.name}</Option>
                        })}
                    </Select>
                    <h4>Reason you want to join (150 - 200 words): </h4>
                    <TextArea value={this.state.comment} onChange={this.handleCommentChange} rows={10} />
                </Modal>
            );
        } else {
            return null;
        }
    }

    render(){
        return(
            <>
            <Button style={{ marginTop: '1%' }} onClick={() => history.push('/EditView/cooperative')} type="primary" block>Create cooperative</Button>
            {this.renderCooperatives()}
            {this.renderModal()}
            </>
        );
    }
    
}

const mapStateToProps = state =>{
    return { user: state.user.auth }
}

export default connect(mapStateToProps, {
    AddPost
})(Cooperatives);