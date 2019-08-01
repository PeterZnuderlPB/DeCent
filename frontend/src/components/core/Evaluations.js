import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import PBTable from './PBTable';

class Evaluations extends React.Component {

    render(){

        return(
            <>
           <PBTable 
           table="posts"
           name={"testTable"} 
           title={"Test test"}
           tableApi="evaluation"
           />
           </>
        );
    }
    
}

const mapStateToProps = state =>{
    return { user: state.user.auth}
}

export default connect(mapStateToProps)(Evaluations);