import React from 'react';
import { connect } from 'react-redux';
import {
    Row,
    Col,
    Card,
    Spin,
    Button
} from 'antd';
import con from '../../apis';

class Cooperatives extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cooperativesLoading: true,
            cooperatives: []
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
      
          params.visibleFields.push('id','title', 'about', 'owner__username', 'workers', 'competencys');
      
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
        })
        .catch(err => {
            console.log('[Error] Cooperative - cooperatives fetch ', err);
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
                                    <Col xs={24} sm={12} md={6} lg={6}>
                                        <Card title={el.title} extra={<a href="#">More</a>} style={{ width: 300, height: 400 }}>
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
                                            {el.workers.findIndex(el => { return el.id == this.props.user.userInfo.id }) === -1 ? <Button block type="primary">Enroll</Button> : <Button block type="danger">Leave</Button>}
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
                                            <Col xs={24} sm={12} md={6} lg={6}>
                                                <Card title={el.title} extra={<a href="#">More</a>} style={{ width: 300, height: 400 }}>
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
                                            <Col xs={24} sm={12} md={6} lg={6}>
                                                <Card title={el.title} extra={<a href="#">More</a>} style={{ width: 300, height: 400 }}>
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

    render(){
        return(
            <>
            {this.renderCooperatives()}
            </>
        );
    }
    
}

const mapStateToProps = state =>{
    return { user: state.user.auth }
}

export default connect(mapStateToProps)(Cooperatives);