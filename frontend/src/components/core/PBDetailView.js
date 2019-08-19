import React from 'react';
import { Spin, Button, Comment, Icon, Avatar, Form, Input, message } from 'antd';
import { connect } from 'react-redux';
import { FetchPost } from '../../actions/PBEditViewActions';
import { 
    DETAIL_VIEW_EVALUATION,
    DETAIL_VIEW_COMPOTENCY,
    DETAIL_VIEW_COMMENTS
} from '../../constants';
import history from '../../history';
import con from '../../apis';

const { TextArea } = Input;

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <div>
        <Form.Item>
            <TextArea
            rows={4}
            onChange={onChange}
            value={value}
            />
        </Form.Item>

        <Form.Item>
            <Button
            htmlType="submit"
            loading={submitting}
            onClick={onSubmit}
            type="primary"
            >
                Add comment
            </Button>
        </Form.Item>
    </div>
);

class PBDetailView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            loading: true,
            redirect: false,
            evalData: [],
            subTitle: '',
            comments: [],
            commentValue: '',
            commentLoading: false
        }
    }
    
    componentDidMount = () => {
        this.props.FetchPost(this.props.match.params.id, this.props.match.params.table_name);
        this.fetchData(this.props.match.params.table_name);
        this.fetchCommnets(this.props.match.params.id);

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
            this.fetchCommnets(this.props.match.params.id);
        }

        if (prevProps.user.userInfo.id !== this.props.user.userInfo.id)
        {
            this.props.FetchPost(this.props.match.params.id, this.props.match.params.table_name);
            this.fetchData(this.props.match.params.table_name);
            this.fetchCommnets(this.props.match.params.id);

            this.setState({
                subTitle: this.props.match.params.table_name === 'evaluation' ? 'Answers' : 'Evaluations'
            });
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

    fetchCommnets = (compotencyId) => {
        let params = {
            results: 10,
            page: 1,
            sortOrder: [],
            sortField: [],
            visibleFields: [],
            filters: {
                competency__id: compotencyId
            }
          };
      
          params.visibleFields = params.visibleFields.concat(DETAIL_VIEW_COMMENTS);

          let settings = JSON.stringify(params);

        con.get(`/api/comment/`, {
            params: {
                settings
            },
            headers: {
                Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
            }
        })
        .then(res => {
            this.setState({
                comments: res.data.data
            });
        })
        .catch(err => console.log("[DetailView] Comment fetch error: ", err));
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
                            return <div key={el.id}><Button onClick={() => this.setState({ redirect: true }, () => history.push(`/DetailView/evaluation/${el.evaluation__id}`))} type="link">Evaluation - {el.evaluation__id}</Button></div>;
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

    handleCommentChange = e => {
        this.setState({
            commentValue: e.target.value
        });
    }

    handleCommentSubmit = () => {
        if (this.state.commentValue === '') {
            message.error("You can't submit an empty comment!");
            return;
        }

        this.setState({
            commentLoading: true
        }, () => {
            setTimeout(() => {
                this.setState({
                    commentLoading: false,
                    comments: [
                        ...this.state.comments,
                        {id: 4, username: this.props.user.userInfo.username, comment: this.state.commentValue}
                    ],
                    commentValue: ''
                });
            }, 1000);
        });
    }

    handleCommentDelete = e => {
        let newCommentsArray = this.state.comments;
        newCommentsArray.splice(newCommentsArray.find(c => c.id === parseInt(e.target.value)), 1);

        this.setState({
            comments: newCommentsArray
        });
    }

    renderCommentData = () => {
        return (
            <div>
                {this.state.comments.length !== 0 ? <hr /> : null}
                {this.state.comments.map(el => {
                    return (
                        <div key={el.id}>
                            <Comment
                            author={<a onClick={() => console.log("ACCOUNT CLICKED", el.account__id)}>{el.account__username} - {el.organization__name}</a>}
                            avatar={
                                <Avatar
                                src={`https://picsum.photos/id/${el.id}/200/300`}
                                alt={el.account__username}
                                />
                            }
                            content={
                                <>
                                {this.props.post.data.data !== undefined 
                                ? this.props.post.data.data.organization.id === this.props.user.userInfo.active_organization_id
                                    ? this.props.user.userInfo.permissions.permissions.includes("DELETE")
                                        ? <Button value={el.id} onClick={this.handleCommentDelete} type="danger"><Icon type="delete" /></Button>
                                        : null
                                    : null
                                : null
                                }
                                {this.props.user.userInfo.id !== undefined
                                ? this.props.user.userInfo.id === el.account__id
                                    ? <Button onClick={() => console.log("EDITING COMMENT ID => ", el.id)} style={{ marginLeft: '0.3%'}} value={el.id} type="default"><Icon type="edit" /></Button>
                                    : null
                                : null
                                }
                                <br />
                                <span>Date created: {el.date_created}</span>
                                <p>{el.comment}</p>
                                </>
                            }
                            />
                        </div>
                    );
                })}
                <Comment
                author={<a onClick={() => console.log("ACCOUNT CLICKED", this.props.user.userInfo.id)}>{this.props.user.userInfo.username}</a>}
                avatar={
                    <Avatar
                    src={`https://picsum.photos/id/${666}/200/300`}
                    alt={this.props.user.userInfo.username}
                    />
                }
                content={
                    <Editor
                    onChange={this.handleCommentChange}
                    onSubmit={this.handleCommentSubmit}
                    submitting={this.state.commentLoading}
                    value={this.state.commentValue}
                    />
                }
                />
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
            {this.props.match.params.table_name === 'competency' ? this.renderCommentData() : null}
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