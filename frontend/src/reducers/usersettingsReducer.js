import{

} from '../actions/types'

const INITIAL_STATE = {
    tables:[{
        name:"testTable",
        filters:[],
        sorting:[],
        column_filters:['author']
    }],
}

export default (state = INITIAL_STATE, action) =>{
    switch(action.type){

        default:
            return state;
    }
}