import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card } from 'antd';

class Workers extends React.Component {

    render(){

        return(
            <div style={{ marginTop: '3%' , marginLeft: '2%'}}>
                <Row gutter={8}>
                    <Col xs={24} sm={12} md={6} lg={6}>
                        <Card title="Default size card" extra={<a href="#">More</a>} style={{ width: 300 }}>
                            <p>Card content</p>
                            <p>Card content</p>
                            <p>Card content</p>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={6}>
                        <Card title="Default size card" extra={<a href="#">More</a>} style={{ width: 300 }}>
                            <p>Card content</p>
                            <p>Card content</p>
                            <p>Card content</p>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={6}>
                        <Card title="Default size card" extra={<a href="#">More</a>} style={{ width: 300 }}>
                            <p>Card content</p>
                            <p>Card content</p>
                            <p>Card content</p>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={6}>
                        <Card title="Default size card" extra={<a href="#">More</a>} style={{ width: 300 }}>
                            <p>Card content</p>
                            <p>Card content</p>
                            <p>Card content</p>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
    
}

const mapStateToProps = state =>{
    return { user: state.user.auth }
}

export default connect(mapStateToProps)(Workers);