import React from 'react';
import { connect } from 'react-redux';

import { Popover,Table, Button, Checkbox, Input, Row, Col} from 'antd';
import { FormattedMessage } from 'react-intl';
import lang from '../../translations/translations';
import axios from 'axios';
import con from '../../apis';
import { updateExpression, throwStatement } from '@babel/types';
//import { FetchPostsStart } from '../../actions'
import {Redirect} from 'react-router-dom';


class PBTable extends React.Component {
    qs = require('qs');
    assert = require('assert');
    init_settings= {
      results: 0,
      page: 0,
      sortOrder: [],
      sortField: [],
      visibleFields: [],
      filters: [],
  }
    state = {
        windowSize:{ x: window.innerWidth, y: window.innerHeight},
        tableName: "Table",
        data: [],
        loading: false,
        sortOptions:['ascend', 'descend', null],
        sortOrderKeys:[],
        settings: this.init_settings,
        customColumnsVis: false,
        availableColumns: [],
        SCCheckedList: [],
        SCIndeterminate: true,
        SCCheckAll: false,
        lastClickedHeader: "",
        filterValues:{},
        redirect: false
    };
    CheckboxGroup = Checkbox.Group;
    

    componentDidMount() {
      //console.log("Mount", this.state)
        window.addEventListener('resize', this.updateWindowDimensions);
        this.fetch();
    }

    componentWillUnmountas(){
      window.removeEventListener('resize', this.updateWindowDimensions);
    }
    updateWindowDimensions = () => {
      const x  = window.innerWidth;
      const y = window.innerHeight;
      this.setState({ windowSize:{x:x, y:y} });
    }

    handleFilterClick = (event) =>{
      //event.stopPropagation();
    }

    handleFilterChange = (event) =>{
      var filtVarStr = JSON.stringify(this.state.filterValues);
      var dict = JSON.parse(filtVarStr);
      dict[this.state.lastClickedHeader] = event.target.value;
      this.setState({filterValues : dict});
    }

    handleFilterSubmit = (data, event) =>{
      event.stopPropagation();
      this.fetch();
    }

    handleHeaderClick = (column, event)=>{
      console.log("Column clicked", column);
      var filtVarStr = JSON.stringify(this.state.filterValues);
      var dict = JSON.parse(filtVarStr);
      if (dict[column.dataIndex] === undefined)
        dict[column.dataIndex] = ""
      this.setState({
        lastClickedHeader: column.dataIndex,
        filterValues : dict
      })
      if(event.target.className === 'ant-input')
        return
      //debugger;
      console.log("Header Click", column.dataIndex);
      const place = this.state.settings.sortField.findIndex(el =>{return el === column.dataIndex});
      let newOrder = [...this.state.sortOrderKeys];
      let newFields = [...this.state.settings.sortField];
      if(place >= 0 ){
        const newOrd = (newOrder[place]+1) % this.state.sortOptions.length;
        newOrder[place] = newOrd;
        console.log("Old position", place, "New position", newOrd)
      }else{
        newOrder.push(0);
        newFields.push(column.dataIndex);
      }
      const newOrderVerbose = [];
      newOrder.forEach(el => {
        newOrderVerbose.push(this.state.sortOptions[el]);
        console.log(newOrderVerbose)
      })
      this.setState({sortOrderKeys: newOrder,
         settings:{
           sortField: newFields,
           sortOrder: newOrderVerbose,
           results: this.state.settings.results,
           page: this.state.settings.page,
           visibleFields: this.state.settings.visibleFields,
           filters: this.state.settings.filters,
          }},
          this.fetch
          );
    }

    handleTableChange = (pagination, filters, sorter, extra) => {
        //debugger;
        const pager = { ...this.state.settings.pagination };
        pager.current = pagination.current;
        this.setState({
          pagination: pager,
          settings:{
            sortField: this.state.settings.sortField,
            sortOrder: this.state.settings.sortOrder,
            results: pagination.pageSize,
            page: pagination.current,
            filters: this.state.settings.filters,
          }},
          this.fetch
          );
    };

    TranslateColumn = (col) => {
      return lang[this.props.lang][`table.${col}`];
    }

    ActiveColumnsContent =()=>{
      console.log("Active columnsContent", this.state.availableColumns)
      return (
      <div>
        <div style={{ borderBottom: '1px solid #E9E9E9' }}>
            <Checkbox
              indeterminate={this.state.SCIndeterminate}
              onChange={this.handleActiveColumnsCheckAllClick}
              checked={this.state.SCCheckAll}
            >
            <FormattedMessage id="table.checkAll" defaultMessage="Check all" />
            </Checkbox>
        </div>
        <br />
          <Checkbox.Group 
          style={{width:'100%'}} 
          onChange={this.handleActiveColumnsChange} 
          value={this.state.SCCheckedList}
          >
            <Row>
              {this.state.availableColumns.map( (col, index) =>{
                //console.log("Column Checkbox", col)
                return(
                  <Col span={6} key={index}>
                    <Checkbox value={col}>{<FormattedMessage id={`table.${this.state.tableName}.${col}`} defaultMessage={col} />}</Checkbox>
                  </Col>
                )
              })}
            </Row>
          </Checkbox.Group>
        </div>
      )
    }

    handleActiveColumnsClick=(visible)=>{
      this.setState({ customColumnsVis: visible });
      console.log("Clicked on Custom Columns")
    }

    handleActiveColumnsChange = checkedList => {

      this.setState({
          SCCheckedList: checkedList,
          SCIndeterminate: !!checkedList.length && checkedList.length < this.state.availableColumns.length,
          SCCheckAll: checkedList.length === this.state.availableColumns.length,
      },() => this.fetch());
    };

    handleActiveColumnsCheckAllClick = e => {
      this.setState({
        SCCheckedList: e.target.checked ? this.state.availableColumns : [],
        SCIndeterminate: false,
        SCCheckAll: e.target.checked,
      }, () => this.fetch());
    };

    handleActiveColumnsSubmit=()=>{
      this.fetch();
    }


    fetch = () => {
        //console.log('params:', params);
        //debugger;
        let params = this.state.settings;
        if (params == this.init_settings){
          params = null;
        }
        else{
          //debugger;
          params.visibleFields = this.state.SCCheckedList;
          params.filters = this.state.filterValues;
        }
        var settings = JSON.stringify(params);
        con.get(this.props.data_source,{
          params: {
            settings
            },
            headers:{
                Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
            },
            contentType: 'json',
          }).then(response => {
            const pagination = { ...this.state.pagination };
            console.log("Returned stuff.", response.data);
            pagination.total = response.data.size;
            const newOrderKeys = [];
            if(response.data.settings.sortOrder){
              response.data.settings.sortOrder.forEach(el => {
                newOrderKeys.push(this.state.sortOptions.indexOf(el));
              })
            }
           // console.log("New sort order keys", newOrderKeys);
            this.setState({
              loading: false,
              data: response.data.data,
              settings: response.data.settings,
              pagination,
              sortOrderKeys: newOrderKeys,
              availableColumns: response.data.available_columns,
              SCCheckedList: response.data.settings.visibleFields,
              tableName: response.data.table_name
            }, this.printState
            );
          });
          //debugger;
      };

    printState=(text= "Updated state") => {
      console.log(text, this.state);
    }

    buildColumns() {
      if (!this.state.SCCheckedList){
          console.warn("No columns selected")
          return null;
      }
      var columns = this.state.SCCheckedList;
      var allKeys = [];
      columns.forEach(element => {
              allKeys.push( {
                  title: (
                    <div style={{ textAlign: 'center' }}>
                        <div>{<FormattedMessage id={`table.${this.state.tableName}.${element}`} defaultMessage={element} />}</div>
                        <Input.Search 
                        placeholder={lang[this.props.lang]['table.filter']} 
                        onClick={(e) => this.handleFilterClick(e)}  
                        onPressEnter={(e) => this.handleFilterSubmit(null, e)}
                        onSearch={this.handleFilterSubmit}
                        onChange = {this.handleFilterChange}
                        value = {this.state.filterValues[element]}
                        />
                    </div>
                ),
                  dataIndex: element,
                  key: element,
                  sorter: false, 
                  align: 'center',
                  onHeaderCell: (column) => {return {
                    onClick: (event) => {
                      this.handleHeaderClick(column, event);
                      }, // click header row
                  };}     
              })
      });
        allKeys.unshift({
          title: this.TranslateColumn("edit").toUpperCase(),
          dataIndex:'',
          key:'x',
          render: () => <input type='button' value={this.TranslateColumn("edit")} onClick={this.setRedirect} id={this.nextButtonId()} />   
        }) 
      //console.log(allKeys)
      return allKeys;
  }


    buttonId=-1
    nextButtonId = () => {
      this.buttonId= this.buttonId+1
      return this.state.data[this.buttonId]['id']
    }

    setRedirect = (event) => {
      console.log(event.target.id);
      this.setState({
        redirectUrl: "/EditView/post/" + event.target.id,
        redirect: true
      });
    }


    render(){
      if (this.state.redirect) {
        return <Redirect to={this.state.redirectUrl} />
      }
        //console.log(this.props)
        const columns = this.buildColumns();
        //console.log("Rerendering", this.state)
        return(
          <>
          <Button type = "primary" onClick={() => this.fetch()}><FormattedMessage id="table.refreshTable" defaultMessage="Refresh table" /></Button>
          <Popover
            content={this.ActiveColumnsContent()}
            title={ <FormattedMessage id="table.columns" defaultMessage="Columns" /> }
            trigger="click"
            visible={this.state.customColumnsVis}
            onVisibleChange={this.handleActiveColumnsClick}
            >
            <Button type="primary"><FormattedMessage id="table.customColumns" defaultMessage="Custom columns" /></Button>
          </Popover>
          <Button type = "primary" onClick={() => this.setState({ filterValues: {}}, this.fetch)}><FormattedMessage id="table.clearFilters" defaultMessage="Clear filters" /></Button>
           <Table 
           dataSource={this.state.data} 
           columns={columns} 
           pagination={this.state.pagination} //false to turn it off
           loading={this.state.loading}
           onChange={this.handleTableChange}
           scroll={{ x: this.state.windowSize.x }}
           title={() => this.props.title}
/*
           onHeaderRow={column => {
            return {
              onClick: () => {this.setSorting(column)}, // click header row
            };
          }}*/
          {...this.buttonId=-1}
           />
           </>
        );
    }
    
}

const mapStateToProps = (state, ownProps) =>{
    return { settings: state.user.user_settings.tables.find(table => {return table.name === ownProps.name}),
            user: state.user.auth,
            lang: state.lang
        }
}

export default connect(mapStateToProps)(PBTable);