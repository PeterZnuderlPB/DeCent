import React from 'react';
import { connect } from 'react-redux';

import PBTable from '../core/PBTable';

class MyProjects extends React.Component {

    render(){

        return(
            <>
           <PBTable 
           table="projects"
           name={"testTable"} 
           title={"Test test"}
           tableApi="project"
           personal={true}
           />
           </>
        );
    }
    
}

const mapStateToProps = state =>{
    return { user: state.user.auth }
}

export default connect(mapStateToProps)(MyProjects);