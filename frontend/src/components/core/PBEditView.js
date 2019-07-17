import React from 'react';
import { connect } from 'react-redux';
import { Button, InputNumber,DatePicker, Checkbox, Input } from 'antd';
import moment from 'moment';
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
    values: [] 
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
      }, () =>{console.log()});
    });
  }

  createUI(){
    this.addClick();
    return this.state.values.map((el, i, index) => 
        <div key={i}>
          {console.log(el +' ' + el.length)}

          <label>{this.state.data[2][i]}: </label>
          {this.state.data[0][i] == 'int'? <InputNumber value={el||''} onChange={this.handleNumberChange.bind(this, i) } disabled={this.state.data[2][i] == 'id'?  true :  false}/>:
          this.state.data[0][i] == 'datetime.date'?
          (<DatePicker defaultValue={moment(el, "YYYY-MM-DD", true)} onChange={this.handleDateChange.bind(this, i)} />):
          this.state.data[0][i] == 'bool'?
          (<Checkbox checked={el} onChange={this.handleBoxChange.bind(this, i)} />):
          el.length<5?
          (<Input value={el||''} onChange={this.handleChange.bind(this, i)} />):
          (<TextArea rows={4} value={el||''} onChange={this.handleChange.bind(this, i)} />)}

          {index.length-1 === i? (<input type="button" value="Submit" onClick={this.handleSubmit}/>):(console.log("-----"))}
        </div>          
    )
    }

    handleBoxChange(i, value){
      let values = [...this.state.values];
      values[i] = value.target.checked;
      this.state.data[1][0][i]= value
      this.setState({ values });

     }

  handleDateChange(i, value){
    this.state.data[1][0][i]= value
    this.setState({ value});
    console.log("The date is: "+ value)
   }

   handleNumberChange(i, value){
    let values = [...this.state.values];
      values[i] = value;
    

    this.state.data[1][0][i]= value
    this.setState({ values });
    console.log('Number has been changed to: ', value)
   }
 
   handleChange = (i, event) => {
      let values = [...this.state.values];
      values[i] = event.target.value;
      console.log("Text is: " + values[i])

      
    this.state.data[1][0][i] = values[i]
    this.setState({ values });
   }



   handleSubmit = () => {
    const saveUri = `api/posts/saveData/`;
    console.log("SAVE VIEW saveData", this.props.user);
    con.get(saveUri,
      {   headers:{
          Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
      },
      params:{
        data: this.state.values
      },
      contentType: 'json',
    })
}

addClick(){  
   if(this.state.data.length > 0){
  this.state.values = this.state.data[1][0]
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