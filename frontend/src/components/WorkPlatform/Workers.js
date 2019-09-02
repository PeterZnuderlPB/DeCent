import React from 'react';
import { connect } from 'react-redux';
import {
    Row,
    Col,
    Card,
    Spin
} from 'antd';
import con from '../../apis';

class Workers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            usersLoading: true,
            users: []
        };
    }

    componentDidMount = () => {
        this.fetchUsers();
    }

    componentDidUpdate = prevProps => {
        if (prevProps.user.userInfo.id !== this.props.user.userInfo.id) {
            this.fetchUsers();
        }
    }

    fetchUsers = () => {
        let params = {
            results: 1000,
            page: 1,
            sortOrder: [],
            sortField: [],
            visibleFields: [],
            filters: {}
          };
      
          params.visibleFields.push('id', 'username', 'first_name', 'last_name', 'biography', 'competencys');
      
          let settings = JSON.stringify(params);

        con.get(`api/pbusers/`, {
            params: {
                settings
            },
            headers: {
                Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
            }
        })
        .then(res => {
            this.setState({
                users: res.data.data,
                usersLoading: false
            });
        })
        .catch(err => {
            console.log('[Error] Workers - Users fetch ', err);
        });
    }

    calculateUserRows = () => {
        let rowArray = [];
        let length = this.state.users.length;

        while (length / 4 > 1) {
            rowArray.push('row');
            length = length / 4;
        }

        console.log("RETURNED", rowArray);
        return rowArray;
    }

    renderUsers = () => {
        if (this.state.usersLoading) {
            return <Spin tip="Loading workers..." size="large" />
        } else {
            if (this.state.users.length <= 4) {
                return (
                    <>
                    <div style={{ marginTop: '3%' , marginLeft: '2%'}}>
                        <Row gutter={8}>
                            {this.state.users.map(el => {
                                return (
                                    <Col xs={24} sm={12} md={6} lg={6}>
                                        <Card title={el.username} extra={<a href="#">More</a>} style={{ width: 300, height: 300 }}>
                                            <p><b>{el.first_name} {el.last_name}</b></p>
                                            <p><b>Kompetence: </b></p>
                                            <ul>
                                                {el.competencys.map(comp => {
                                                    return <li>{comp.name}</li>;
                                                })}
                                            </ul>
                                            <p>Biography: {`${el.biography.substring(0, 50)}...`}</p>
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
                                    {this.state.users.map(el => {
                                        return (
                                            <Col xs={24} sm={12} md={6} lg={6}>
                                                <Card title={el.username} extra={<a href="#">More</a>} style={{ width: 300, height: 300 }}>
                                                    <p><b>{el.first_name} {el.last_name}</b></p>
                                                    <p><b>Kompetence: </b></p>
                                                    <ul>
                                                        {el.competencys.map(comp => {
                                                            return <li>{comp.name}</li>;
                                                        })}
                                                    </ul>
                                                    <p>Biography: {`${el.biography.substring(0, 50)}...`}</p>
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
                                    {this.state.users.map((el, j) => {
                                        if (j < i*j) 
                                            return;
                                        
                                        return (
                                            <Col xs={24} sm={12} md={6} lg={6}>
                                                <Card title={el.username} extra={<a href="#">More</a>} style={{ width: 300, height: 300 }}>
                                                    <p><b>{el.first_name} {el.last_name}</b></p>
                                                    <p><b>Kompetence: </b></p>
                                                    <ul>
                                                        {el.competencys.map(comp => {
                                                            return <li>{comp.name}</li>;
                                                        })}
                                                    </ul>
                                                    <p>Biography: {`${el.biography.substring(0, 50)}...`}</p>
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
            {this.renderUsers()}
            </>
        );
    }
    
}

const mapStateToProps = state =>{
    return { user: state.user.auth }
}

export default connect(mapStateToProps)(Workers);