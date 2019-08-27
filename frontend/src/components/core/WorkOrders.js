import React from 'react';
import { connect } from 'react-redux';

import PBTable from './PBTable';

class WorkOrders extends React.Component {

    render(){

        return(
            <>
           <PBTable 
           table="WorkOrders"
           name={"testTable"} 
           title={"Test test"}
           tableApi="workorder"
           />
           </>
        );
    }
    
}

const mapStateToProps = state =>{
    return { user: state.user.auth }
}

export default connect(mapStateToProps)(WorkOrders);