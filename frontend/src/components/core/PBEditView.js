import React from 'react';
import { connect } from 'react-redux';
import { Button, InputNumber, DatePicker, TimePicker, Checkbox, Input, Spin, Select } from 'antd';
import moment from 'moment';
import history from '../../history';
import { FetchPost, UpdatePost, AddPost } from '../../actions/PBEditViewActions';
import axios from 'axios';
import con from '../../apis';
import { EWOULDBLOCK } from 'constants';

const { Option } = Select;
const { TextArea } = Input; 

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
    fkSelected: null
  };

  componentWillMount() {
    if(this.props.match.params.id !== undefined) {
      if (this.props.user.userInfo.username !== "") {
        this.props.FetchPost(this.props.match.params.id);
        this.setState({
          requestedData: true,
        });
      }
    }

    if(this.props.match.params.id === undefined) {
      if(!this.state.requestedData){
          if(this.props.user.userInfo.username !== "") {
            this.props.FetchPost(1);
            this.setState({
              requestedData: true
            });
          }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.match.params.id !== undefined) {
      if(!this.state.requestedData){
        if(nextProps.user.userInfo.username !== "") {
          this.props.FetchPost(this.props.match.params.id);
          this.setState({
            requestedData: true
          });
        }
    }
  }

  if(this.props.match.params.id === undefined) {
    if(!this.state.requestedData){
        if(nextProps.user.userInfo.username !== "") {
          this.props.FetchPost(1);
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
          <Option key={el.id} value={el.id}>{el.name}</Option>
        );
    }
  }

  fetchOptions = (elName) => {
    this.setState({
      fkLoading: true,
      fkSelected: elName
    });

    fetch(`http://localhost:8000/api/${elName}/?settings=%7B%22results%22:10,%22page%22:1,%22sortOrder%22:[],%22sortField%22:[],%22visibleFields%22:[%22id%22,%22name%22],%22filters%22:%7B%7D%7D`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.props.user.token.access_token
      }
    })
    .then(res => res.json())
    .then(data => {
      this.setState({
        fkData: {
          ...this.state.fkData,
          [elName]: data.data
        },
        fkLoading: false
      });
    });
  }

  createUI(){
    // find better solution for this
    if (!this.state.loaded){
      this.state.data = this.props.edit.data.data;
      this.state.column_names = this.props.edit.data.column_names;
      this.state.column_types = this.props.edit.data.column_types;
      this.state.loaded = true;
    }

    this.addClick();
      if(this.props.match.params.id !== undefined) {
      return this.state.values.map((el, i, index) => 
          <div key={i}>

            <label>{el}: </label>
            {this.state.column_types[i].includes("Integer")? <InputNumber value={this.state.data[el]||''} onChange={this.handleNumberChange.bind(this, el) } disabled={this.state.column_names[i] == 'id'?  true :  false}/>:
            this.state.column_types[i].includes("Date (without time)")?
            (<DatePicker defaultValue={moment(this.state.data[el], "YYYY-MM-DD", true)} onChange={this.handleDateChange.bind(this, el)} />):
            this.state.column_types[i].includes("Date (with time)")?
            [<DatePicker defaultValue={moment(this.state.data[el],"YYYY-MM-DD")} onChange={this.handleDateTimeChange.bind(this, el)} />,
            <TimePicker onChange={this.handleDateTimeChange2.bind(this, el)} defaultValue={this.timeAsign(this.state.data[el])} />]:
            //HH:mm:ss
            this.state.column_types[i].includes("Boolean")?
            (<Checkbox checked={this.state.data[el]} onChange={this.handleBoxChange.bind(this, el)} />):
            this.state.column_types[i].includes("Foreign Key")?
            (<Input value={this.state.data[el] !== null ? this.state.data[el]['name'] || this.state.data[el]['id'] : null} onChange={this.handleChange.bind(this, i)} disabled={true}/>):
            this.state.column_types[i].includes("String")?
            (<Input value={this.state.data[el]||''} onChange={this.handleChange.bind(this, el)} />):
            (<TextArea rows={4} value={this.state.data[el]||''} onChange={this.handleChange.bind(this, el)} />)}

            {index.length-1 === i? (<input type="button" value="Submit" onClick={this.handleSubmit}/>):(console.log("-----"))}
          </div>          
      )
      } else {
        return this.state.values.map((el, i, index) => 
        <div key={i}>
          <label>{el}: </label>
          {this.state.column_types[i].includes("Integer")? <InputNumber value={''} onChange={this.handleNumberChange.bind(this, el) } disabled={this.state.column_names[i] == 'id'?  true :  false}/>:
          this.state.column_types[i].includes("Date (without time)")?
          (<DatePicker defaultValue={moment(this.getCurrentDate(), "YYYY-MM-DD", true)} onChange={this.handleDateChange.bind(this, el)} disabled />):
          this.state.column_types[i].includes("Date (with time)")?
          [<DatePicker defaultValue={moment(this.getCurrentDate(), "YYYY-MM-DD", true)} onChange={this.handleDateTimeChange.bind(this, el)} disabled />,
          <TimePicker defaultValue={this.timeAsign(this.getCurrentDateTime())} onChange={this.handleDateTimeChange2.bind(this, el)} disabled />]:
          //HH:mm:ss
          this.state.column_types[i].includes("Boolean")?
          (<Checkbox checked={this.state.data[el]} onChange={this.handleBoxChange.bind(this, el)} />):
          // this.state.column_types[i].includes("Foreign Key") && el === 'subcategory' || el === 'organization'?
          // (<Select onFocus={() => this.fetchOptions(el)}>{this.renderOptions()}</Select>):
          this.state.column_types[i].includes("Foreign Key")?
          (<Select onChange={(e) => this.handleSelect(e, el)} onFocus={() => this.fetchOptions(el)}>{this.state.fkData[el] !== undefined ? this.renderOptions(el) : <Option disabled={true} value="NULL">No data..</Option>}</Select>):
          this.state.column_types[i].includes("String")?
          (<Input onChange={this.handleChange.bind(this, el)} />):
          (<TextArea rows={4} onChange={this.handleChange.bind(this, el)} />)}

          {index.length-1 === i? (<input type="button" value="Submit" onClick={this.handleSubmit}/>):(console.log("-----"))}
        </div>         
        )}
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
      console.log("Update dict", dict);
      this.props.UpdatePost(this.state.data["id"], dict);
  } else {
    this.state.values.map((el, i) => {
      console.log("COL TYPE: ", this.state.column_types[i]);

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
    console.log("Add dict", dict);
    this.props.AddPost(dict);
  }

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