import React from 'react';
import { connect } from 'react-redux';
import { Button, InputNumber, DatePicker, TimePicker, Checkbox, Input, Spin } from 'antd';
import moment from 'moment';
import { FetchPost, UpdatePost } from '../../actions/PBEditViewActions';
import axios from 'axios';
import con from '../../apis';


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
    loaded: false
  };

  componentWillMount() {
    this.props.FetchPost(this.props.match.params.id);
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
          (<Input value={this.state.data[el]['id']||''} onChange={this.handleChange.bind(this, i)} disabled={true}/>):
          this.state.column_types[i].includes("String")?
          (<Input value={this.state.data[el]||''} onChange={this.handleChange.bind(this, el)} />):
          (<TextArea rows={4} value={this.state.data[el]||''} onChange={this.handleChange.bind(this, el)} />)}

          {index.length-1 === i? (<input type="button" value="Submit" onClick={this.handleSubmit}/>):(console.log("-----"))}
        </div>          
    )
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
      console.log(this.state.data[el])
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

   handleSubmit = () => {
    console.log("SUBMIT: ", this.props.edit);
    var dict = {}
    console.log(this.state.column_names)
    console.log(this.state.data)

    for (let x = 0; x < this.state.column_names.length; x = x + 1){
      if(this.state.column_types[x] != "Foreign Key (type determined by related field)"){
        console.log(this.state.column_types[x] + " " + this.state.data[this.state.column_names[x]])
        dict[this.state.column_names[x]] = this.state.data[this.state.column_names[x]]
      }
      else{
        console.log(this.state.column_types[x] + " " + this.state.data[this.state.column_names[x]])
        dict[this.state.column_names[x]] = this.state.data[this.state.column_names[x]]["id"]
      }
    }
    console.log("dict",dict)
    this.props.UpdatePost(this.state.data["id"], dict);

}


addClick = () => {  
  this.state.values = Object.keys(this.state.data)

  console.log(this.state.column_names)
  console.log(this.state.column_types)

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
  console.log(this.state.column_names)

}

  render() {
    console.log("EditView", this.props);
    return (
      <>
      <h1>EditView {this.props.match.params.table_name} - {this.props.match.params.id}</h1>
      
      <form >
        {this.props.edit.loadingPost ? <div style={{ display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent:'center', height: '300px'}}><Spin size="large" tip="Loading..."></Spin></div> : this.createUI()}        
      </form>
      </>
    );
  }
}

const mapStateToProps = state =>{
    return { user: state.user.auth, edit: state.edit }
}

export default connect(mapStateToProps, { FetchPost, UpdatePost })(PBEditView);