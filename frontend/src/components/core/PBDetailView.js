import React from 'react';
import { Spin} from 'antd';
import { connect } from 'react-redux';
import { FetchPost } from '../../actions/PBEditViewActions';

class PBDetailView extends React.Component {
    componentDidMount = () => {
        this.props.FetchPost(this.props.match.params.id, this.props.match.params.table_name);
    }

    renderCompetencyData = () => {
        console.log("PROPS", this.props);

        return (
            <div>
                <h1>{`${this.props.match.params.table_name.charAt(0).toUpperCase() + this.props.match.params.table_name.substring(1)} => ${this.props.post.data.data.name === undefined ? "FIX" : this.props.post.data.data.name}`}</h1>
                {Object.keys(this.props.post.data.data).map((key, i) => {
                    return typeof(this.props.post.data.data[key]) !== 'object' ? <div key={i}><b>{key.charAt(0).toUpperCase() + key.substring(1)}: </b>{this.props.post.data.data[key]}</div> : null;
                })}
            </div>
        );
    }

    render() {
        return (
            <>
            <h1>DetailView {this.props.match.params.table_name} - {this.props.match.params.id}</h1>
            {this.props.post.loadingPost ? <Spin tip={`Loading ${this.props.match.params.table_name}...`} size="large" /> : this.renderCompetencyData()}
            <hr />
            {this.props.post.loadingPost ? <Spin tip={`Loading ${this.props.match.params.table_name}...`} size="large" /> : <h5>OTHER DATA</h5>}
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.auth,
        post: state.edit
    }
}

export default connect(mapStateToProps, { FetchPost })(PBDetailView);