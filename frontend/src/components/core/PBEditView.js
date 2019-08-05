import React from 'react';
import { connect } from 'react-redux';
import { Button, InputNumber, DatePicker, TimePicker, Checkbox, Input, Spin, Select, message, Modal } from 'antd';
import moment from 'moment';
import history from '../../history';
import { FetchPost, UpdatePost, AddPost } from '../../actions/PBEditViewActions';
import axios from 'axios';
import con from '../../apis';
import { EWOULDBLOCK } from 'constants';

const { Option } = Select;
const { TextArea } = Input;
const { Search } = Input;

class PBEditView extends React.Component {
  constructor(props) {
    super(props);
    this.addClick = this.addClick.bind(this);
  }
  state = {
    data: [], 
    column_types: [],
    column_names: [],
    values: [],
    time_assist:[],
    loaded: false,
    propsLoading: true,
    propsLoaded: false,
    requestedData: false,
    fkData: [],
    fkLoading: true,
    fkSelected: null,
    modalVisible: false,
    selectedCompetency: null,
    selectableCompetencies: [],
    selectableCompetenciesLoading: true,
    competencyQuestions: [],
    competencyQuestionsLoading: true,
    compotencyAnswers: [],
    compotencyAnswersLoading: true,
    answerSelected: null,
    answersSelected: []
  };

  componentWillMount() {
    if(this.props.match.params.id !== undefined) {
      if (this.props.user.userInfo.username !== "") {
        this.props.FetchPost(this.props.match.params.id, this.props.match.params.table_name);
        this.setState({
          requestedData: true,
        });
      }
    }

    if(this.props.match.params.id === undefined) {
      if(!this.state.requestedData){
          if(this.props.user.userInfo.username !== "") {
            this.props.FetchPost(1, this.props.match.params.table_name);
            this.setState({
              requestedData: true
            });
          }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if(this.props.match.params.id !== undefined) {
      if(!this.state.requestedData){
        if(nextProps.user.userInfo.username !== "") {
          this.props.FetchPost(this.props.match.params.id, this.props.match.params.table_name);
          this.setState({
            requestedData: true
          });
        }
    }
  }

  if(this.props.match.params.id === undefined) {
    if(!this.state.requestedData){
        if(nextProps.user.userInfo.username !== "") {
          this.props.FetchPost(1, this.props.match.params.table_name);
          this.setState({
            requestedData: true
          });
        }
    }
  }

    if(nextProps.edit.data.length !== 0) {
      if(!this.props.propsLoaded){
        this.setState({
          propsLoading: false,
          propsLoaded: true
        });
      }
    }
  }

  getCurrentDate = () => {
    let currentDay = new Date().getDate();
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();

    if (currentDay < 10)
      currentDay = '0' + currentDay;
    
    if (currentMonth < 10)
      currentMonth = '0' + currentMonth;

    return `${currentYear}-${currentMonth}-${currentDay}`;
  }

  getCurrentDateTime = () => {
    let currentSecond = new Date().getSeconds();
    let currentMinute = new Date().getMinutes();
    let currentHour = new Date().getHours();


    if (currentSecond < 10)
      currentSecond = '0' + currentSecond;
    
    if (currentMinute < 10)
      currentMinute = '0' + currentMinute;

    if (currentHour < 10)
      currentHour = '0' + currentHour;

    return `${this.getCurrentDate()}T${currentHour}:${currentMinute}:${currentSecond}.777777Z`;
  }

  renderOptions = (elName) => {
    if (this.state.fkLoading) {
      return <Option disabled={true} value="NULL">Loading data...</Option>;
    } else {
      	return this.state.fkData[elName].map(el => 
          <Option key={el.id} value={el.id}>{el.name || el._type}{el[elName + '_type___type'] !== undefined ? ' - ' + el[elName + '_type___type'] : null}{el.organization__name !== undefined ? ' - ' + el.organization__name : null}</Option>
        );
    }
  }

  fetchOptions = (elName) => {
    this.setState({
      fkLoading: true,
      fkSelected: elName
    });

    fetch(`http://localhost:8000/api/${elName}/?settings=%7B%22results%22:10,%22page%22:1,%22sortOrder%22:[],%22sortField%22:[],%22visibleFields%22:[%22id%22,%22name%22,%22_type%22,%22${elName}_type___type%22,%22organization__name%22],%22filters%22:%7B%7D%7D`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.props.user.token.access_token
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log("GETFDATA", data.data);
      this.setState({
        fkData: {
          ...this.state.fkData,
          [elName]: data.data
        },
        fkLoading: false
      });
    });
  }

  showModal = () => {
    this.setState({
      compotencyAnswers: [],
      answersSelected: []
    });
    this.fetchCompetencies();

    this.setState({
      modalVisible: true,
    });
  };

  handleOk = () => {
    this.setState({ modalVisible: false });
  };

  handleCancel = () => {
    this.setState({ modalVisible: false });
  };

  fetchCompetencies = () => {
    let params = {
      results: 10,
      page: 1,
      sortOrder: [],
      sortField: [],
      visibleFields: [],
      filters: {}
    };

    params.visibleFields.push('id', 'name');

    let settings = JSON.stringify(params);

    con.get('/api/competency/', {
      params:{
        settings
      },
      headers: {
        Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
      }
    })
    .then(res => {
      this.setState({
        selectableCompetenciesLoading: false,
        selectableCompetencies: res.data.data
      });
    })
    .catch(err => console.log("[EditView] Competency fetch error: ", err));
  }

  findCompetencyInList = (id) => {
    let competency;

    this.state.selectableCompetencies.forEach(el => {
      if(id == el.id) {
        competency = el;
      }
    });

    return competency;
  }

  handleCompetencySelect = e => {
    this.setState({
      selectedCompetency: this.findCompetencyInList(e.target.id),
      modalVisible: false 
    }, () => this.fetchQuestions());
  }

  renderCompetencies = () => {
    return (
      this.state.selectableCompetencies.map(el => {
        return <div key={el.id}><p style={{ display: 'inline-block' }}>{el.name}</p> - <Button id={el.id} onClick={this.handleCompetencySelect} type="default">Select</Button></div>
      })
    );
  }

  fetchQuestions = () => {
    let params = {
      results: 10,
      page: 1,
      sortOrder: [],
      sortField: [],
      visibleFields: [],
      filters: {
        competency__id: this.state.selectedCompetency.id
      }
    };

    params.visibleFields.push('id', 'question', 'description');

    let settings = JSON.stringify(params);

    con.get('/api/compquestion/', {
      params: {
        settings
      },
      headers: {
        Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
      }
    })
    .then(res => {
      this.setState({
        competencyQuestionsLoading: false,
        competencyQuestions: res.data.data
      });
    })
    .catch(err => console.log("[EditView] Questions fetch error: ", err));
  }

  renderQuestions = () => {
    return (
      <>
      <hr />
      {this.state.competencyQuestions.map(el => {
        return (
          <>
          <div style={{ marginTop: '0.6%' }}><b>Question: </b>{el.question}</div>
          <div><b>Description: </b>{el.description}</div>
          <div><b>Answer</b><i> (Select below)</i><b>:</b></div>
          <Select onChange={(e) => this.handleAnswerSelect(e, el.id)} onFocus={() => this.fetchAnswers(el.id)}>
            {this.state.compotencyAnswers[el.id] !== undefined
            ? this.state.compotencyAnswers[el.id].map(el => {
              return <Option value={el.id}>{el.answer}</Option>;
            })
            : <Option disabled={true} value="NULL">No data..</Option>}
          </Select>
          <div><b>Comment</b> <i>(Optional)</i><b>:</b> </div>
          <TextArea id={`tbox${el.id}`} onChange={this.handleAnswerTextBox} placeholder="Enter your comment here." cols={3} />
          </>
        );
      })}
      </>
    );
  }

  fetchAnswers = (elId) => {
    this.setState({
      compotencyAnswersLoading: true,
      answerSelected: elId
    });

    let params = {
      results: 10,
      page: 1,
      sortOrder: [],
      sortField: [],
      visibleFields: [],
      filters: {
        comp_question__id: elId
      }
    };

    params.visibleFields.push('id', 'answer');

    let settings = JSON.stringify(params);

    con.get('/api/predefinedanswer/', {
      params: {
        settings
      },
      headers: {
        Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
      }
    })
    .then(res => {
      this.setState({
        compotencyAnswersLoading: false,
        compotencyAnswers: {
          ...this.state.compotencyAnswers,
          [elId]: res.data.data
        }
      });
    })
    .catch(err => console.log("[EditView] Answers fetch error: ", err));
  }

  handleAnswerSelect = (event, elId) => {
    this.setState({
      answersSelected: {
        ...this.state.answersSelected,
        [elId]: event
      }
    }, () => console.log("NEW STATE", this.state.answersSelected));
  }

  handleAnswerTextBox = (event) => {
    console.log("TICK");

    this.setState({
      answersSelected: {
        ...this.state.answersSelected,
        [event.target.id]: event.target.value
      }
    });
  }

  createUI(){
    // find better solution for this
    if (!this.state.loaded){
      this.state.data = this.props.edit.data.data;
      this.state.column_names = this.props.edit.data.column_names;
      this.state.column_types = this.props.edit.data.column_types;
      this.state.loaded = true;
      
    if (this.props.match.params.id !== undefined){
      if (this.state.data.organization !== undefined) {
        if (this.state.data.organization.account !== this.props.user.userInfo.id) {
          message.error("You cannot modify this post.");
          history.push("/");
        }
      } else {
        if (this.state.data.subject.organization.account !== this.props.user.userInfo.id) {
          message.error("You cannot modify this post.");
          history.push("/evaluations");
        }
      }
    }
    }

    this.addClick();
      if(this.props.match.params.id !== undefined) {
      return this.state.values.map((el, i, index) => 
          <div key={i}>

            {el.includes('user') ? null : <label>{el}:</label>}
            {this.state.column_types[i].includes("Integer")? <InputNumber value={this.state.data[el]||''} onChange={this.handleNumberChange.bind(this, el) } disabled={this.state.column_names[i] == 'id'?  true :  false}/>:
            this.state.column_types[i].includes("Date (without time)")?
            (<DatePicker defaultValue={moment(this.state.data[el], "YYYY-MM-DD", true)} onChange={this.handleDateChange.bind(this, el)} />):
            this.state.column_types[i].includes("Date (with time)")?
            [<DatePicker defaultValue={moment(this.state.data[el],"YYYY-MM-DD")} onChange={this.handleDateTimeChange.bind(this, el)} />,
            <TimePicker onChange={this.handleDateTimeChange2.bind(this, el)} defaultValue={this.timeAsign(this.state.data[el])} />]:
            //HH:mm:ss
            this.state.column_types[i].includes("Boolean")?
            (<Checkbox checked={this.state.data[el]} onChange={this.handleBoxChange.bind(this, el)} />):
            el.includes('user')?
            (<Input style={{ display: 'none' }} value={this.state.data[el] !== null ? this.state.data[el]['_type'] || this.state.data[el]['name'] || this.state.data[el]['id'] : null} onChange={this.handleChange.bind(this, i)} disabled={true}/>):
            this.state.column_types[i].includes("Foreign Key")?
            (<Input value={this.state.data[el] !== null ? this.state.data[el]['_type'] || this.state.data[el]['name'] || this.state.data[el]['id'] : null} onChange={this.handleChange.bind(this, i)} disabled={true}/>):
            this.state.column_types[i].includes("String")?
            (<Input value={this.state.data[el]||''} onChange={this.handleChange.bind(this, el)} />):
            (<TextArea rows={4} value={this.state.data[el]||''} onChange={this.handleChange.bind(this, el)} />)}

            {index.length-1 === i? (<input type="button" value="Submit" onClick={this.handleSubmit}/>):(console.log("-----"))}
          </div>          
      )
      } else {
        if (this.props.match.params.table_name === 'evaluation') {
            return this.state.values.map((el, i, index) => 
            <div key={i}>
              {el.includes('user') ? null : <label>{el}:</label>}
              {this.state.column_types[i].includes("Integer")? <InputNumber value={''} onChange={this.handleNumberChange.bind(this, el) } disabled={this.state.column_names[i] == 'id'?  true :  false}/>:
              this.state.column_types[i].includes("Date (without time)")?
              (<DatePicker defaultValue={moment(this.getCurrentDate(), "YYYY-MM-DD", true)} onChange={this.handleDateChange.bind(this, el)} disabled />):
              this.state.column_types[i].includes("Date (with time)")?
              [<DatePicker defaultValue={moment(this.getCurrentDate(), "YYYY-MM-DD", true)} onChange={this.handleDateTimeChange.bind(this, el)} disabled />,
              <TimePicker defaultValue={this.timeAsign(this.getCurrentDateTime())} onChange={this.handleDateTimeChange2.bind(this, el)} disabled />]:
              //HH:mm:ss
              this.state.column_types[i].includes("Boolean")?
              (<Checkbox checked={this.state.data[el]} onChange={this.handleBoxChange.bind(this, el)} />):
              el.includes('user')?
              (<Input style={{ display: 'none' }} value={this.state.data[el] !== null ? this.state.data[el]['_type'] || this.state.data[el]['name'] || this.state.data[el]['id'] : null} onChange={this.handleChange.bind(this, i)} disabled={true}/>):
              this.state.column_types[i].includes("Foreign Key")?
              (<Select onChange={(e) => this.handleSelect(e, el)} onFocus={() => this.fetchOptions(el)}>{this.state.fkData[el] !== undefined ? this.renderOptions(el) : <Option disabled={true} value="NULL">No data..</Option>}</Select>):
              this.state.column_types[i].includes("String")?
              (<Input onChange={this.handleChange.bind(this, el)} />):
              (<TextArea rows={4} onChange={this.handleChange.bind(this, el)} />)}

              {index.length -1 === i ? <div style={{ marginTop: '2%', marginBottom: '2%'}}><Button onClick={this.showModal} type="primary" style={{ display: 'inline-block' }}>Select competency</Button>
              <Modal
              title="Select competency"
              closable={false}
              visible={this.state.modalVisible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={null}
              >
                <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection:'column', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                <Search
                placeholder="Search for competency" 
                onSearch={value => {
                  let searchArray = []
                  searchArray.push(value);

                  this.setState({
                    selectedCompetency: searchArray
                  });

                }}
                style={{ width: 200 }}
                />

                <hr style={{ width: '100%' }}/>
                {this.state.selectableCompetenciesLoading ? <Spin tip="Loading..." size="large" /> : this.renderCompetencies()}
                </div>
              </Modal>
              <p style={{ display: 'inline-block', marginLeft: '0.3%', userSelect: 'none' }}>{this.state.selectedCompetency === null ? 'No competency selected...' : this.state.selectedCompetency.name}</p></div> : null}

              {index.length - 1 === i 
              ? this.state.selectedCompetency === null ? null : this.renderQuestions()
              : null}

              {index.length-1 === i? (<input style={{ display: 'block' }} type="button" value="Submit" onClick={this.handleSubmit}/>):(console.log("-----"))}
            </div>         
            )
        }else{
          return this.state.values.map((el, i, index) => 
            <div key={i}>
              {el.includes('user') ? null : <label>{el}:</label>}
              {this.state.column_types[i].includes("Integer")? <InputNumber value={''} onChange={this.handleNumberChange.bind(this, el) } disabled={this.state.column_names[i] == 'id'?  true :  false}/>:
              this.state.column_types[i].includes("Date (without time)")?
              (<DatePicker defaultValue={moment(this.getCurrentDate(), "YYYY-MM-DD", true)} onChange={this.handleDateChange.bind(this, el)} disabled />):
              this.state.column_types[i].includes("Date (with time)")?
              [<DatePicker defaultValue={moment(this.getCurrentDate(), "YYYY-MM-DD", true)} onChange={this.handleDateTimeChange.bind(this, el)} disabled />,
              <TimePicker defaultValue={this.timeAsign(this.getCurrentDateTime())} onChange={this.handleDateTimeChange2.bind(this, el)} disabled />]:
              //HH:mm:ss
              this.state.column_types[i].includes("Boolean")?
              (<Checkbox checked={this.state.data[el]} onChange={this.handleBoxChange.bind(this, el)} />):
              el.includes('user')?
              (<Input style={{ display: 'none' }} value={this.state.data[el] !== null ? this.state.data[el]['_type'] || this.state.data[el]['name'] || this.state.data[el]['id'] : null} onChange={this.handleChange.bind(this, i)} disabled={true}/>):
              this.state.column_types[i].includes("Foreign Key")?
              (<Select onChange={(e) => this.handleSelect(e, el)} onFocus={() => this.fetchOptions(el)}>{this.state.fkData[el] !== undefined ? this.renderOptions(el) : <Option disabled={true} value="NULL">No data..</Option>}</Select>):
              this.state.column_types[i].includes("String")?
              (<Input onChange={this.handleChange.bind(this, el)} />):
              (<TextArea rows={4} onChange={this.handleChange.bind(this, el)} />)}

              {index.length-1 === i? (<input type="button" value="Submit" onClick={this.handleSubmit}/>):(console.log("-----"))}
            </div>         
            )
        } 
      }
    }

    timeAsign = (el) =>{
      if(el != false){
      this.state.time_assist=moment(el.slice(0, -8)).format("HH:mm:ss") // cant replace with setState
      return (moment(this.state.time_assist, "HH:mm:ss"))
      }
    }

    handleDateTimeChange(el, value){
      let newDate = moment(value).format("YYYY-MM-DD")
      let oldDate =""
      for(let x = 0; x < 10; x = x+1){
        oldDate = oldDate + this.state.data[el][x]
      }
      this.setState({
        data: {
          ...this.state.data,
          [el]: this.state.data[el].replace(oldDate, newDate)
        }
      });
    }

    handleDateTimeChange2(el, value){
      let newTime = moment(value).format("HH:mm:ss")
      let oldTime =""
      for(let x = 11; x < 19; x = x+1){
        oldTime = oldTime + this.state.data[el][x]
      }
      // this.state.data[el] = this.state.data[el].replace(oldTime, newTime)
      this.setState({
        data: {
          ...this.state.data,
          [el]: this.state.data[el].replace(oldTime, newTime)
        }
      });
    }

    handleBoxChange(el, event){
      this.setState({
        data: {
          ...this.state.data,
          [el]: event.target.checked
        }
      });
      this.setState({ ...this.state.values });
     }

  handleDateChange(el, value){
    this.setState({
      data: {
        ...this.state.data,
        [el]: moment(value).format("YYYY-MM-DD")
      }
    });
    this.setState({ ...this.state.values});
   }

   handleNumberChange(el, event){  
    this.setState({
      data: {
        ...this.state.data,
        [el]: event.target.value
      }
    });
    this.setState({ ...this.state.values });    
   }
 
   handleChange = (el, event) => {
    this.setState({
      data: {
        ...this.state.data,
        [el]: event.target.value
      }
    });
    this.setState({ ...this.state.values });
   }

   handleSelect = (event, el) => {

     this.setState({
       data: {
         ...this.state.data,
         [el]: event
       }
     });

     this.setState({ ...this.state.values })
   }

   handleSubmit = () => {
    var dict = {}
    if(this.props.match.params.id !== undefined) {
      for (let x = 0; x < this.state.column_names.length; x = x + 1){
        if(this.state.column_types[x] != "Foreign Key (type determined by related field)"){
          dict[this.state.column_names[x]] = this.state.data[this.state.column_names[x]]
        }
        else{
          dict[this.state.column_names[x]] = this.state.data[this.state.column_names[x]] === null ? null : this.state.data[this.state.column_names[x]]["id"] // TODO: Format null 
        }
      }
      delete dict["tags"]; // Fix


      this.props.UpdatePost(this.state.data["id"], dict, this.props.match.params.table_name);
  } else {
    this.state.values.map((el, i) => {
      if(this.state.column_types[i] === "Foreign Key (type determined by related field)" && el.indexOf('user') != -1){
        dict[el] = this.props.user.userInfo.id;
      }
      else if (this.state.column_types[i] === "Foreign Key (type determined by related field)") {
        dict[el] = this.state.data[el];
      }
      else if(this.state.column_types[i] === "Date (with time)") {
        dict[el] = this.getCurrentDateTime();
      }
      else if(this.state.column_types[i] === "Date (without time)") {
        dict[el] = this.getCurrentDate();
      }
      else{
        dict[el] = this.state.data[el];
      }
    });

    if (this.props.match.params.table_name === 'evaluation') {
      dict['questions'] = this.state.answersSelected;
      this.props.AddPost(dict, this.props.match.params.table_name);
    } else {
      this.props.AddPost(dict, this.props.match.params.table_name);
    }

  }
  console.log("POSt DICT", dict);
}


addClick = () => { 
  // Redirects user to index page in case of error
  // try {
  this.state.values = Object.keys(this.state.data);

  var name, count = 0
  for( let x = 0; x < this.state.column_types.length - count; x++){

    if(this.state.column_types[x] == "Foreign Key (type determined by related field)"){
      count++

      this.state.column_types.splice(x,1)
      this.state.column_types.splice(this.state.column_types.length,0, "Foreign Key (type determined by related field)")

      name = this.state.column_names[x]
      this.state.column_names.splice(x,1)
      this.state.column_names.splice(this.state.column_names.length, 0, name)    
    }

  }
  // } catch {
  //   history.push("/");
  // }
}

  render() {
    return (
      <>
      <h1>EditView {this.props.match.params.table_name} - {this.props.match.params.id}</h1>
      <form >
        {this.state.propsLoading ? <div style={{ display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent:'center', height: '300px'}}><Spin size="large" tip="Loading..."></Spin></div> : this.createUI()}        
      </form>
      </>
    );
  }
}

const mapStateToProps = state =>{
    return { user: state.user.auth, edit: state.edit }
}

export default connect(mapStateToProps, { FetchPost, UpdatePost, AddPost })(PBEditView);