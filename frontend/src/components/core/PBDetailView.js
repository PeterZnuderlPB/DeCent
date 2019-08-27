import React from 'react';
import { Spin, Button, Comment, Icon, Avatar, Form, Input, Modal, Descriptions, message } from 'antd';
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

const Editor = ({ onChange, onSubmit, submitting, value, commentId, editHandleCommentCancel }) => (
    <div>
        {commentId !== undefined ? <Button onClick={() => editHandleCommentCancel(commentId)} style={{ backgroundColor: '#ffbb33', color:'#d9534f' }} type="danger"><Icon type="close" /></Button> : null}
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
                {commentId !== undefined ? 'Save comment' : 'Add comment'}
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
            commentLoading: false,
            modalVisible: false,
            userData: null,
            editCommentValue: '',
            editCommentLoading: false
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
            let comments = res.data.data;
            comments.forEach(el => {
                el.editing = false
            });

            this.setState({
                comments
            });
        })
        .catch(err => console.log("[DetailView] Comment fetch error: ", err));
    }

    fetchUser = (userId) => {
        if (userId === undefined)
            return;

        con.get(`/api/users/${userId}/`, {
            headers: {
                Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
            }
        })
        .then(res => {
            this.setState({
                userData: res.data
            }, () => console.log("STATE AFTER UDATA", this.state));
        })
        .catch(err => console.log("[DetailView] User fetch error: ", err));
    }

    renderAnswerData = () => {
        return (
            <div>
                <h3>{this.props.match.params.table_name === 'competency' || this.props.match.params.table_name === 'evaluation' ? this.state.subTitle : null}</h3>
                {this.state.data.map((el, i) => {
                    {return Object.keys(el).map(key => {
                        if (key === 'id' || key.includes('competency'))
                            return;

                        if (key === 'evaluation__id') {
                            if (this.props.match.params.table_name === 'competency') {
                                return <div key={el.id}><Button onClick={() => this.setState({ redirect: true }, () => history.push(`/DetailView/evaluation/${el.evaluation__id}`))} type="link">Evaluation - {el.evaluation__id}</Button></div>;
                            } else {
                                return null;
                            }
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

    editHandleCommentChange = e => {
        this.setState({
            editCommentValue: e.target.value
        });
    }

    handleCommentSubmit = () => {
        if (this.state.commentValue === '') {
            message.error("You can't submit an empty comment!");
            return;
        }

        let dict = {
            comment: this.state.commentValue,
            competency: this.props.match.params.id,
            organization: this.props.user.userInfo.active_organization_id,
            account: this.props.user.userInfo.id,
            is_active: true,
            is_locked: false
        };

        const saveUri = `api/comment/`;
        const conConfig = {
            headers: {
                Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token,
            }
        }

        con.post(saveUri, dict, conConfig)
        .then(res => {
            message.success("Successfully added comment.",res );
            this.setState({
                commentLoading: true
            }, () => {
                setTimeout(() => {
                    this.setState({
                        commentLoading: false,
                        comments: [
                            ...this.state.comments,
                            {id: res.data.id, comment: res.data.comment, organization__name: res.data.organization.name, account__id: this.props.user.userInfo.id, account__username: this.props.user.userInfo.username, date_created: res.data.date_created, editing: false }
                        ],
                        commentValue: ''
                    });
                }, 1000);
            });
        })
        .catch(err => {
            message.error("Error trying to add comment.");
        });
    }

    editHandleCommentSubmit = commentId => {
        if (this.state.editCommentValue === '') {
            message.error("You can't submit an empty comment!");
            return;
        }

        let dict = {
            comment: this.state.editCommentValue
        };

        const saveUri = `api/comment/${commentId}`;
        const conConfig = {
            headers: {
                Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token,
            }
        }

        con.patch(saveUri, dict, conConfig)
        .then(res => {
            message.success("Successfully edited comment.",res );
            this.setState({
                editCommentLoading: true
            }, () => {
                setTimeout(() => {
                    let newCommentsArray = this.state.comments;
                    let editingCommentIndex = newCommentsArray.findIndex(c => c.id === parseInt(commentId));
                    newCommentsArray[editingCommentIndex].editing = false;
                    newCommentsArray[editingCommentIndex].comment = res.data.comment;

                    this.setState({
                        editCommentLoading: false,
                        comments: newCommentsArray,
                        editCommentValue: ''
                    });
                }, 1000);
            });
        })
        .catch(err => {
            message.error("Error trying to edit comment.");
        });
    }

    editHandleCommentCancel = commentId => {
        let newCommentsArray = this.state.comments;
        let editingCommentIndex = newCommentsArray.findIndex(c => c.id === parseInt(commentId));

        newCommentsArray.forEach(el => {
            if (el.editing)
                el.editing = false;
        });

        newCommentsArray[editingCommentIndex].editing = false;

        this.setState({
            editCommentValue: newCommentsArray[editingCommentIndex].comment,
            comments: newCommentsArray
        });
    }

    handleCommentDelete = e => {
        const commentId = e.target.value;

        con.delete(`/api/comment/${commentId}`, {
            headers: {
                Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
            }
        })
        .then(res => {
            let newCommentsArray = this.state.comments;
            newCommentsArray.splice(newCommentsArray.findIndex(c => c.id === parseInt(commentId)), 1);

            this.setState({
                comments: newCommentsArray
            });
        })
        .catch(err => {
            message.error("Coud not delete the comment.");
        });
    }

    handleModalOk = e => {
        console.log("CLICKED MODAL OK");
        this.setState({
          modalVisible: false
        });
    };
    
    handleModalCancel = e => {
        this.setState({
          modalVisible: false,
          userData: null
        });
    };

    showModal = (userId) => {
        this.fetchUser(userId);

        this.setState({
        modalVisible: true,
        });
    };

    handleCommentEdit = commentId => {
        let newCommentsArray = this.state.comments;
        let editingCommentIndex = newCommentsArray.findIndex(c => c.id === parseInt(commentId));

        newCommentsArray.forEach(el => {
            if (el.editing)
                el.editing = false;
        });

        newCommentsArray[editingCommentIndex].editing = true;

        this.setState({
            editCommentValue: newCommentsArray[editingCommentIndex].comment,
            comments: newCommentsArray
        });
    }

    renderCommentData = () => {
        return (
            <div>
                {this.state.comments.length !== 0 ? <><hr /> <h3>Comments</h3></> : null}
                {this.state.comments.length !== 0 ? this.state.comments.map(el => {
                    return (
                        <div key={el.id}>
                            <Comment
                            author={<a onClick={() => this.showModal(el.account__id)}>{el.account__username} - {el.organization__name}</a>}
                            avatar={
                                <Avatar
                                src={`https://picsum.photos/id/${el.id}/200/300`}
                                alt={el.account__username}
                                />
                            }
                            content={
                                !el.editing ?
                                <>
                                {this.props.post.data.data !== undefined 
                                ? this.props.post.data.data.organization !== undefined && this.props.post.data.data.organization.id === this.props.user.userInfo.active_organization_id
                                    ? this.props.user.userInfo.permissions.permissions.includes("DELETE")
                                        ? <Button value={el.id} onClick={this.handleCommentDelete} type="danger"><Icon type="delete" /></Button>
                                        : null
                                    : null
                                : null
                                }
                                {this.props.user.userInfo.id !== undefined
                                ? this.props.user.userInfo.id === el.account__id
                                    ? <Button onClick={() => this.handleCommentEdit(el.id)} style={{ marginLeft: '0.3%'}} value={el.id} type="default"><Icon type="edit" /></Button>
                                    : null
                                : null
                                }
                                <br />
                                <span style={{ fontWeight: 500 }}>Date created:</span><span> {el.date_created}</span>
                                <p>{el.comment}</p>
                                </>
                                : 
                                <Editor 
                                onChange={this.editHandleCommentChange}
                                onSubmit={() => this.editHandleCommentSubmit(el.id)}
                                submitting={this.state.editCommentLoading}
                                value={this.state.editCommentValue}
                                commentId={el.id}
                                editHandleCommentCancel={this.editHandleCommentCancel}
                                />
                            }
                            />
                        </div>
                    );
                }) : null }
                <Comment
                author={<a onClick={() => this.showModal(this.props.user.userInfo.id)}>{this.props.user.userInfo.username}</a>}
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
                 <Modal
                // title={this.state.userData !== null ? this.state.userData : <Spin tip="Loading user.." />}
                visible={this.state.modalVisible}
                onOk={this.handleModalOk}
                onCancel={this.handleModalCancel}
                footer={null}
                >
                    {this.state.userData !== null
                    ?<div>
                        <span><b>Username: </b>{this.state.userData.username}</span> <br />
                        <span><b>Full name: </b>{this.state.userData.first_name} {this.state.userData.last_name}</span> <br/>
                        <span><b>Biography: </b>{this.state.userData.biography}</span> <br />
                    </div>
                    : null}
                </Modal>
            </div>
        );
    }

    renderCompetencies = () => {
        if (this.props.match.params.table_name === 'project') {
            return (
                <div>
                    <h1>Needed competencies</h1>
                    {this.props.post !== undefined && this.props.post.data !== undefined && this.props.post.data.data !== undefined
                    ? Object.keys(this.props.post.data.data).map(key => {
                        if (key === 'competency') {
                            return this.props.post.data.data[key].map(el => {
                                return <p><b>{el.name}</b> -<Button onClick={() => this.setState({ redirect: true }, () => history.push(`/DetailView/competency/${el.id}`))} type="link">Go to Competency</Button></p>;
                            })
                        }
                    })
                    : null
                    }
                </div>
            );
        }
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
            {this.renderCompetencies()}
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