import React from 'react';
import { connect } from 'react-redux';
import { Link} from 'react-router-dom';

import PBTable from './PBTable';
import PBUpload from './PBUpload';

class Profile extends React.Component {

    render(){

        return(
            <>
           <PBTable 
           table="posts"
           name={"testTable"} 
           title={"Test test"}
           />
           </>
        );
    }
    
}

const mapStateToProps = state =>{
    return { user: state.user.auth}
}

export default connect(mapStateToProps)(Profile);