import React from 'react';
import { connect } from 'react-redux';

import PBTable from '../core/PBTable';

class Projects extends React.Component {

    render(){

        return(
            <>
           <PBTable 
           table="projects"
           name={"testTable"} 
           title={"Test test"}
           tableApi="project"
           />
           </>
        );
    }
    
}

const mapStateToProps = state =>{
    return { user: state.user.auth }
}

export default connect(mapStateToProps)(Projects);