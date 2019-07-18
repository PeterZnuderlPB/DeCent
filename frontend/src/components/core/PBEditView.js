import React from 'react';
import { connect } from 'react-redux';
import { Button, InputNumber, DatePicker, TimePicker, Checkbox, Input } from 'antd';
import moment from 'moment';
import axios from 'axios';
import con from '../../apis';
import { tsExternalModuleReference } from '@babel/types';


const { TextArea } = Input; 

class PBEditView extends React.Component {
  constructor(props) {
    super(props);
    this.addClick = this.addClick.bind(this);
  }
  state = {
    data: [], 
    values: [],
    time_assist:[]
  };

  dataSource = this.state.data
  
  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    const uri = `/api/posts/${this.props.match.params.id}`;
    console.log("EDIT VIEW fetch", this.props.user);
    con.get(uri,
      {   headers:{
          Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
      },
      contentType: 'json',
    }).then(response => {
      this.setState({
        loading: false,
        data: response.data.data,
        column_names: response.data.column_names,
        column_types: response.data.column_types
      }, () =>{console.log("Response: ",response.data.data,response.data.column_names,response.data.column_types)});
    });
  }

test= ()=>{
  return moment("2019-07-14T09:56:25").format("HH:mm:ss")
}

  createUI(){
    this.addClick();
    return this.state.values.map((el, i, index) => 
        <div key={i}>
          {/*console.log(el +' ' + el.length)*/}

          <label>{this.state.column_names[i]}: </label>
          {this.state.column_types[i].includes("Integer") || this.state.column_types[i].includes("Foreign Key")? <InputNumber value={el||''} onChange={this.handleNumberChange.bind(this, i) } disabled={this.state.column_names[i] == 'id'?  true :  false}/>:
          this.state.column_types[i].includes("Date (without time)")?
          (<DatePicker defaultValue={moment(el, "YYYY-MM-DD", true)} onChange={this.handleDateChange.bind(this, i)} />):
          this.state.column_types[i].includes("Date (with time)")?
          [<DatePicker defaultValue={moment(el,"YYYY-MM-DD")} onChange={this.handleDateTimeChange.bind(this, i)} />,
          <TimePicker onChange={this.handleDateTimeChange2.bind(this, i)} defaultValue={this.timeAsign(el)} />]:
          //HH:mm:ss
          this.state.column_types[i].includes("Boolean")?
          (<Checkbox checked={el} onChange={this.handleBoxChange.bind(this, i)} />):
          this.state.column_types[i].includes("String")?
          (<Input value={el||''} onChange={this.handleChange.bind(this, i)} />):
          (<TextArea rows={4} value={el||''} onChange={this.handleChange.bind(this, i)} />)}

          {index.length-1 === i? (<input type="button" value="Submit" onClick={this.handleSubmit}/>):(console.log("-----"))}
        </div>          
    )
    }

    timeAsign = (el) =>{
      this.state.time_assist=moment(el).format("HH:mm:ss")
      return (moment(this.state.time_assist, "HH:mm:ss"))
    }

    handleDateTimeChange(i, value){
      let newDate = moment(value).format("YYYY-MM-DD")
      let oldDate =""
      for(let x = 0; x < 10; x = x+1){
        oldDate = oldDate + this.state.data[i][x]
      }
      this.state.data[i] = this.state.data[i].replace(oldDate, newDate)
      this.state.values[i] = this.state.data[i]
    }

    handleDateTimeChange2(i, value){
      let newTime = moment(value).format("HH:mm:ss")
      let oldTime =""
      for(let x = 11; x < 19; x = x+1){
        oldTime = oldTime + this.state.data[i][x]
      }
      this.state.data[i] = this.state.data[i].replace(oldTime, newTime)
      this.state.values[i] = this.state.data[i]
    }

    handleBoxChange(i, value){
      let values = [...this.state.values];
      values[i] = value.target.checked;
      this.state.data[i]= value
      this.setState({ values });

     }

  handleDateChange(i, value){
    this.state.data[i]= value
    this.setState({ value});
    console.log("The date is: "+ value)
   }

   handleNumberChange(i, value){
    let values = [...this.state.values];
      values[i] = value;
    

    this.state.data[i]= value
    this.setState({ values });
    console.log('Number has been changed to: ', value)
   }
 
   handleChange = (i, event) => {
      let values = [...this.state.values];
      values[i] = event.target.value;
      console.log("Text is: " + values[i])

      
    this.state.data[i] = values[i]
    this.setState({ values });
   }



   handleSubmit = () => {
    var dict = {}
    for (let x = 0; x < this.state.data.length; x = x + 1){
      dict[this.state.column_names[x]] = this.state.data[x]
    }
    console.log(dict)

    const saveUri = `api/posts/`;
    console.log("SAVE VIEW saveData", this.props.user);
    const conConfig = {
      headers:{
        Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token,
        //contentType: 'application/json',
      }
    }
    con.put(saveUri,
      dict,
    conConfig)
}

addClick(){  
   if(this.state.data.length > 0){
     for (let i = 0; i<this.state.data.length; i = i +1){
       if(this.state.column_types[i] != "Date (with time)"){
        this.state.values[i] = this.state.data[i]
       }
       else{
         if(this.state.data[i].length > 19){
          this.state.values[i] = this.state.data[i].slice(0, -8)
         }
         else{
          this.state.values[i] = this.state.data[i]
         }
       }
     }
 }
}

  render() {
    console.log("EditView", this.props);
    return (
      <>
      <h1>EditView {this.props.match.params.table_name} - {this.props.match.params.id}</h1>
      
      <form >
        {this.createUI()}        
      </form>
      </>
    );
  }
}

const mapStateToProps = state =>{
    return { user: state.user.auth }
}

export default connect(mapStateToProps)(PBEditView);