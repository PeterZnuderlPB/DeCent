import React from 'react';
import { connect } from 'react-redux';

import { Popover,Table, Button, Checkbox, Input, Row, Col, Icon, Dropdown, Menu } from 'antd';
import { FormattedMessage } from 'react-intl';
import { FetchPostStart } from '../../actions/PBEditViewActions';
import lang from '../../translations/translations';
import axios from 'axios';
import con from '../../apis';
import history from '../../history';
import { updateExpression, throwStatement } from '@babel/types';
//import { FetchPostsStart } from '../../actions'
import {Redirect} from 'react-router-dom';
import {  USER_SETTINGS_USERPERMISSIONS_LIST } from '../../constants';

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
        tableURI:'table',
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
        sortOrderValues: {},
        sortFieldValues: {},
        redirect: false,
        fkData: [],
        tagsVisible: false,
        tagsData: [],
        tagsLoading: true,
        tagsChecked: [],
        allowedSubjects: []
    };
    CheckboxGroup = Checkbox.Group;
    

    componentDidMount() {
      //console.log("Mount", this.state)
        window.addEventListener('resize', this.updateWindowDimensions);
        var table_uri;
        if(this.props.match && this.props.match.params.table_name !== undefined){
          table_uri = this.props.match.params.table_name;
        }
        else{
          table_uri =this.props.table
        }
        this.setState({ tableURI: table_uri}, this.fetch)
        this.fetchUserPermissions();
        //this.fetch();
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

    handleTagsClick = visible => {
      this.setState({
        tagsVisible: visible
      });
    }

    activeTagsContent = () => {
      return (
      <Checkbox.Group 
          style={{width:'100%'}} 
          onChange={this.handleActiveTagsChange} 
          value={this.state.tagsChecked}
          >
          <Row>
              {this.state.tagsData.map( (col, index) =>{
                //console.log("Column Checkbox", col)
                return(
                  <Col span={6} key={index}>
                    <Checkbox value={col.id}>{col.tag}</Checkbox>
                  </Col>
                )
              })}
            </Row>
        </Checkbox.Group>
      );
    }

    handleActiveTagsChange = checkedList => {
        if (checkedList.length > 1) {
          checkedList.splice(0, 1);
        }

        this.setState({
          tagsChecked: checkedList
        }, () => this.fetch());
    }

    renderTags = () => {
      return (
        <Popover
            content={this.activeTagsContent()}
            title={"Tags"}
            trigger="click"
            visible={this.state.tagsVisible}
            onVisibleChange={this.handleTagsClick}
            >
            <Button type="primary">Tags</Button>
          </Popover>
      );
    }

    fetchTagData = () => {
      con.get(`/api/tag/?settings=%7B%22results%22:10,%22page%22:1,%22sortOrder%22:[],%22sortField%22:[],%22visibleFields%22:[%22id%22,%22tag%22],%22filters%22:%7B%7D%7D`, {
        headers: {
          Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
        }
      })
      .then(res => {
        this.setState({
          tagsLoading: false,
          tagsData: res.data.data
        });
      })
      .catch(err => console.log("TAG FETCH ERROR: ", err));
    }

    handleClearSort = () => {
      this.setState({
        settings: {
          results: this.state.settings.results,
          page: this.state.settings.page,
          sortOrder: [],
          sortField: [],
          visibleFields: this.state.settings.visibleFields,
          filters: this.state.settings.filters
        }
      }, () => this.fetch());
    }

    prepareTagNames = () => {
      let dict = {};
      dict['tags__id'] = this.state.tagsChecked[0];
      return dict;
    }

    fetchUserPermissions = () => {
      let params = {
        results: 1000,
        page: 1,
        sortOrder: [],
        sortField: [],
        visibleFields: [],
        filters: {
            organization__id: this.props.user.userInfo.active_organization_id,
            account__id: this.props.user.userInfo.id
        }
      };
  
      params.visibleFields = params.visibleFields.concat(USER_SETTINGS_USERPERMISSIONS_LIST);
  
      let settings = JSON.stringify(params);
  
      con.get('/api/userpermission/', {
        params: {
          settings
        },
        headers: {
          Authorization: this.props.user.token.token_type + " " + this.props.user.token.access_token
        }
      })
      .then(res => {
          this.setState({
            allowedSubjects: res.data.data[0].subject
          }, () => console.log("PERM STATE --> ", this.state));
      })
      .catch(err => console.log("[PBTale] UserPermission fetch error: ", err));
    }

    fetch = () => {
      this.fetchTagData();
      this.fetchUserPermissions();
        //console.log('params:', params);
        //debugger;
        
        const address = `/api/${this.props.tableApi}/`;
        let params = this.state.settings;
        if (params == this.init_settings){
          params = null;
        }
        else{
          //debugger;
          params.visibleFields = this.state.SCCheckedList;
          if (params.visibleFields.indexOf('id') === -1) {
            params.visibleFields.push('id');
          }

          if (params.visibleFields.indexOf('tags') === -1) {
            params.visibleFields.push('tags');
          }

          params.filters = this.state.filterValues;
          
          if (this.state.tagsChecked.length !== 0) {
            params.filters = {
              ...params.filters,
              tags__id: this.state.tagsChecked[0]
            }
          } else {
            params.filters = this.state.filterValues;
          }

          if (this.props.tableApi == 'evaluation') {
            console.log("IN EVALUATION--");

            let subjectId = [];

            this.state.allowedSubjects.forEach(el => {
              subjectId.push(el.id);
            });

            console.log("PUSHING DONE", subjectId);

            if(this.state.allowedSubjects.length !== 0) {
              params.filters = {
                ...params.filters,
                subject__organization__id: this.props.user.userInfo.active_organization_id,
                subject__id: subjectId
              }
            } else {
              params.filters = {
                ...params.filters,
                subject__organization__id: this.props.user.userInfo.active_organization_id
              }
            }
          }

          if (this.props.tableApi == 'subject') {
            params.filters = {
              ...params.filters,
              organization__id: this.props.user.userInfo.active_organization_id  
            }
          }
        }
        console.log("NEW PARAMS: ", params)
        var settings = JSON.stringify(params);
        con.get( address ,{
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

            let cleanAvailableColumns = response.data.available_columns;
            cleanAvailableColumns.splice(cleanAvailableColumns.indexOf('id'), 1);
            cleanAvailableColumns.splice(cleanAvailableColumns.indexOf('tags'), 1);

            let cleanSCCheckedList = response.data.settings.visibleFields;
            cleanSCCheckedList.splice(cleanSCCheckedList.indexOf('id'), 1);
            cleanSCCheckedList.splice(cleanSCCheckedList.indexOf('tags'), 1);

            // let cleanSettings = {
            //   ...response.data.settings,
            //   visibleFields: cleanSCCheckedList
            // }
            
           // console.log("New sort order keys", newOrderKeys);
            this.setState({
              loading: false,
              data: response.data.data,
              settings: response.data.settings,
              pagination,
              sortOrderKeys: newOrderKeys,
              availableColumns: cleanAvailableColumns,
              SCCheckedList: cleanSCCheckedList,
              tableName: response.data.table_name
            }, this.printState
            );
          });
          //debugger;
      };

    printState=(text= "Updated state") => {
      console.log(text, this.state);
    }

    renderColumnTitle = (title) => {
      if(this.state.settings.sortField.indexOf(title) != -1) {
        const titleSettingIndex = this.state.settings.sortField.indexOf(title);

        if (this.state.settings.sortOrder[titleSettingIndex] == null) {
          return <FormattedMessage id={`table.${this.state.tableName}.${title}`} defaultMessage={title} />
        }else if (this.state.settings.sortOrder[titleSettingIndex] == 'ascend') {
          return <><FormattedMessage id={`table.${this.state.tableName}.${title}`} defaultMessage={title} /><Icon type="caret-up" /></>
        }else if (this.state.settings.sortOrder[titleSettingIndex] == 'descend') {
          return <><FormattedMessage id={`table.${this.state.tableName}.${title}`} defaultMessage={title} /><Icon type="caret-down" /></>
        }
      }else{
        return <FormattedMessage id={`table.${title}`} defaultMessage={title} />
      }
    }

    buildColumns() {
      console.log("Rebuilding columns");
      if (!this.state.SCCheckedList){
          console.warn("No columns selected")
          return null;
      }
      var columns = this.state.SCCheckedList;
      var allKeys = [];

      columns.forEach(element => {
              if (element === 'id' || element === 'tags') {
                return;
              }

              allKeys.push( {
                  title: (
                    <div style={{ textAlign: 'center' }}>
                        <div>{this.renderColumnTitle(element)}</div>

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
          title: 'ACTIONS',
          dataIndex:'',
          key:'x',
          render: () => <div id={this.nextButtonId()}>
                          <Button style={{ marginRight: '1%'}} type="primary" onClick={(e) => this.setRedirect(e, 'Detail')}>View</Button>
                          <Button style={{ marginLeft: '1%'}} type="default" onClick={(e) => this.setRedirect(e, 'Edit')}>Edit</Button>
                        </div> //<input type='button' value={this.TranslateColumn("edit")} onClick={this.setRedirect} id={this.nextButtonId()} /> - OLD WAY, KEEP FOR NOW   
        });
      //console.log(allKeys)
      return allKeys;
  }


    buttonId=-1
    nextButtonId = () => {
      this.buttonId= this.buttonId+1
      return this.state.data[this.buttonId]['id']
    }

    setRedirect = (event, operation) => {
      // console.log(event.target.id);
      this.props.FetchPostStart();
      this.setState({
        redirectUrl: `/${operation}View/${this.props.tableApi}/${event.target.parentElement.id}`,
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
          {this.props.tableApi === 'competency' ? this.renderTags() : null}
          <Button type = "primary" onClick={() => this.setState({ filterValues: {}, tagsChecked: [] }, this.fetch)}><FormattedMessage id="table.clearFilters" defaultMessage="Clear filters" /></Button>
          <Button type = "primary" onClick={this.handleClearSort}><FormattedMessage id="table.clearSorting" defaultMessage="Clear sorting" /></Button>
          <Button type="danger" onClick={() => history.push(`/EditView/${this.props.tableApi}`)}>Add Post</Button>
           <Table 
           dataSource={this.state.data} 
           columns={columns} 
           pagination={this.state.pagination} //false to turn it off
           loading={this.state.loading}
           onChange={this.handleTableChange}
           scroll={{ x: this.state.windowSize.x }}
           title={() => this.renderColumnTitle(this.state.tableName)}
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

export default connect(mapStateToProps, { FetchPostStart })(PBTable);