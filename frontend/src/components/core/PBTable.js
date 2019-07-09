import React from 'react';
import { connect } from 'react-redux';

import { Popover,Table, Button, Checkbox, Input} from 'antd';
import { FormattedMessage } from 'react-intl';
import lang from '../../translations/translations';
import axios from 'axios';
import con from '../../apis';
import { updateExpression } from '@babel/types';
//import { FetchPostsStart } from '../../actions'

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
        filterValues:{}
    };
    CheckboxGroup = Checkbox.Group;
    

    componentDidMount() {
      //console.log("Mount", this.state)
        this.fetch();
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

    TranslateColumns() {
      let translatedColumns = [];

      this.state.availableColumns.map(col => {
        col = lang[this.props.lang][`table.${col}`];  
        translatedColumns.push(col);
      });

      return translatedColumns;
    }

    TranslateToEnglish(columns) {
      let translatedColumns = [];
      let englishKeys = [];
      let foreignTranslations = lang[this.props.lang];
      let foreignTranslationsObject = Object.keys(foreignTranslations);
      
      for(let i = 0; i<columns.length; i++) {
        foreignTranslationsObject.forEach(el => {
          if(foreignTranslations[el] == columns[i]){
            englishKeys.push(el);
          }
        });
      }

      englishKeys.map(col => {
        col = lang['en'][col];
        translatedColumns.push(col);
      })

      return translatedColumns;
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
        <this.CheckboxGroup
            options={this.TranslateColumns()}
            value={this.state.SCCheckedList}
            onChange={this.handleActiveColumnsChange}
          />
        </div>
      )
    }

    handleActiveColumnsClick=(visible)=>{
      this.setState({ customColumnsVis: visible });
      console.log("Clicked on Custom Columns")
    }

    handleActiveColumnsChange = checkedList => {
      let translatedCheckedList = this.TranslateToEnglish(checkedList);
      console.log(this.state.availableColumns);
      console.log(checkedList);
      console.log(translatedCheckedList);

      this.setState({
          SCCheckedList: translatedCheckedList,
          SCIndeterminate: !!translatedCheckedList.length && translatedCheckedList.length < this.state.availableColumns.length,
          SCCheckAll: translatedCheckedList.length === this.state.availableColumns.length,
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
            console.log("New sort order keys", newOrderKeys);
            this.setState({
              loading: false,
              data: response.data.data,
              settings: response.data.settings,
              pagination,
              sortOrderKeys: newOrderKeys,
              availableColumns: response.data.available_columns,
              SCCheckedList: response.data.settings.visibleFields
            }, this.printState
            );
          });
          //debugger;
      };

    printState=(text= "Updated state") => {
      console.log(text, this.state);
    }

    buildColumns() {
        if (!this.state.data){
            console.warn("No table data")
            return null;
        }
        var object = this.state.data[0];
        var allKeys = []
        if(object === undefined){return null}
        Object.keys(object).forEach(element => {
            if(!(this.props.settings.column_filters && this.props.settings.column_filters.includes(element)))
            {
                allKeys.push( {
                    title: (
                      <div style={{ textAlign: 'center' }}>
                          <div>{<FormattedMessage id={`table.${element}`} defaultMessage={element} />}</div>
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
            }
        });
        //console.log(allKeys)
        return allKeys;
    }

    render(){
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
           //scroll={{ x: 1500, y: 300 }}
           title={() => this.props.title}
/*
           onHeaderRow={column => {
            return {
              onClick: () => {this.setSorting(column)}, // click header row
            };
          }}*/
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