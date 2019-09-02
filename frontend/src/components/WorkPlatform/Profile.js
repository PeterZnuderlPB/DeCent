import React from 'react';
import { connect } from 'react-redux';
import { Link} from 'react-router-dom';

import PBTable from '../core/PBTable';
import PBUpload from '../core/PBUpload';

class Profile extends React.Component {

    render(){

        return(
            <>
           <PBTable 
           table="posts"
           name={"testTable"} 
           title={"Test test"}
           tableApi="competency"
           />
           </>
        );
    }
    
}

const mapStateToProps = state =>{
    return { user: state.user.auth}
}

export default connect(mapStateToProps)(Profile);