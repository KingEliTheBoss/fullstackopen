//import { createStore, combineReducers } from "redux"; //Deprecated
import { configureStore } from "@reduxjs/toolkit";

import noteReducer from "./reducers/noteReducer";
import filterReducer from "./reducers/filterReducer";

/*const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
});*/

const store = configureStore({
    reducer:{
        notes: noteReducer,
        filter: filterReducer
    }
})

export default store;