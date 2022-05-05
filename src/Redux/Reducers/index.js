import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import loadingReducer from "./loadingReducer";
import userReducer from "./userReducer";

const reducers = combineReducers({
  user: userReducer,
  loading: loadingReducer,
});

const middlewares = [thunk];

const store = createStore(reducers, applyMiddleware(...middlewares));

export default store;
