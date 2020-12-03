import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMidleware from "redux-saga";
import rootSaga from "./root-saga";
import upload from "./upload";

const sagaMidleware = createSagaMidleware();
const store = createStore(
    combineReducers({
        upload
    }),
    applyMiddleware(sagaMidleware)
);
sagaMidleware.run(rootSaga);

export default store;