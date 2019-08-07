import React from 'react';
import { Spin, Button } from 'antd';
import { connect } from 'react-redux';
import { FetchPost } from '../../actions/PBEditViewActions';
import { 
    DETAIL_VIEW_EVALUATION,
    DETAIL_VIEW_COMPOTENCY,
} from '../../constants';
import history from '../../history';
import con from '../../apis';

class PBDetailView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            loading: true,
            redirect: false,
            evalData: [],
            subTitle: ''
        }
    }
    
    componentDidMount = () => {
        this.props.FetchPost(this.props.match.params.id, this.props.match.params.table_name);
        this.fetchData(this.props.match.params.table_name);

        this.setState({
            subTitle: this.props.match.params.table_name === 'evaluation' ? 'Answers' : 'Evaluations'
        });
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.state.redirect) {
            if(prevProps.match.params.table_name === this.props.match.params.table_name)
                return;

            this.setState({
                subTitle: this.props.match.params.table_name === 'evaluation' ? 'Answers' : 'Evaluations',
                evalData: []
            });
            
            this.props.FetchPost(this.props.match.params.id, this.props.match.params.table_name);
            this.fetchData(this.props.match.params.table_name);
        }
    }

    fetchData = (tableName) => {
        const apiName = tableName === 'evaluation' ? 'answer' : 'comprating';
        const filterName = tableName === 'evaluation' ? 'evaluation__id' : 'competency__id';
        const visibleFieldsToConcatinate = tableName === 'evaluation' ? DETAIL_VIEW_EVALUATION : DETAIL_VIEW_COMPOTENCY;

        let params = {
            results: 10,
            page: 1,
            sortOrder: [],
            sortField: [],
            visibleFields: [],
            filters: {
                [filterName]: this.props.match.params.id
            }
          };
      
          params.visibleFields = params.visibleFields.concat(visibleFieldsToConcatinate);
      
          let settings = JSON.stringify(params);

        con.get(`/api/${apiName}/`, {
            params: {
                settings
            },
            headers: {
                Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
            }
        })
        .then(res => {
            this.setState({
                data: res.data.data,
                loading: false
            }, () => {
                this.state.data.forEach(el => {
                    this.fetchEvaluation(el.evaluation__id);
                })
            });
        })
        .catch(err => console.log("[DetailView] Answer fetch error: ", err));
    }

    fetchEvaluation = (evaluationId) => {
        if (evaluationId === undefined)
            return;

        con.get(`/api/evaluation/${evaluationId}`, {
            headers: {
                Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
            }
        })
        .then(res => {
            this.setState({
                evalData: [
                    ...this.state.evalData,
                    res.data.data
                ]
            });
        })
        .catch(err => console.log("[DetailView] Evaluation fetch error: ", err));
    }

    renderAnswerData = () => {
        return (
            <div>
                <h3>{this.state.subTitle}</h3>
                {this.state.data.map((el, i) => {
                    {return Object.keys(el).map(key => {
                        if (key === 'id' || key.includes('competency'))
                            return;

                        if (key === 'evaluation__id') {
                            {return this.state.evalData.map(elEval => {
                                console.log("BUTTON DATA", el);
                                return <div key={elEval.id}><Button onClick={() => this.setState({ redirect: true }, () => history.push(`/DetailView/evaluation/${el.evaluation__id}`))} type="link">{elEval.evaluation_date} - {elEval.subject.organization.name}</Button></div>
                            })}
                        }

                        return <><p><b>{key}: </b>{this.state.data[i][key]}</p>{key === 'comment' ? <hr /> : null}</>
                    })}
                })}
            </div>
        );
    }

    renderCompetencyData = () => {
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
            {this.state.loading ? <Spin tip={`Loading ${this.props.match.params.table_name}...`} size="large" /> : this.renderAnswerData()}
            {this.state.loading ? <Spin tip={`Loading ${this.props.match.params.table_name}...`} size="large" /> : this.props.match.params.table_name === 'evaluation' ? <Button onClick={() => this.setState({ redirect: true }, () => history.push(`/DetailView/competency/${this.state.data[0]['competency__id']}`))} type="link">Go to <b>{this.state.data[0] !== undefined ? this.state.data[0]['competency__name'] : null}</b></Button> : null}
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