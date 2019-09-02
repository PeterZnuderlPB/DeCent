import React from 'react';
import { connect } from 'react-redux';

import PBTable from '../core/PBTable';

class Subjects extends React.Component {

    render() {
        return(
            <>
           <PBTable 
           table="posts"
           name={"testTable"} 
           title={"Test test"}
           tableApi="subject"
           />
           </>
        );
    }
    
}

const mapStateToProps = state =>{
    return { user: state.user.auth}
}

export default connect(mapStateToProps)(Subjects);