import React from 'react';
import { connect } from 'react-redux';
import { Link} from 'react-router-dom';

import PBTable from './PBTable';

class Profile extends React.Component {

    render(){

        return(
           <PBTable 
           data_source="/api/posts/"
           name={"testTable"} 
           title={"Test table"}
           />
        );
    }
    
}

const mapStateToProps = state =>{
    return { user: state.user.auth}
}

export default connect(mapStateToProps)(Profile);