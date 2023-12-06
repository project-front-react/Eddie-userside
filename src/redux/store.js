// ****** REDUX ***** //
// import {createStore} from "redux";
// import rootReduser from "./reduser/rootReduser";

// // create store by the mathod createStore in which first arg is your rootReduser and secon will be redux devtools to see your redux (static like this)

// const store = createStore(rootReduser ,  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

// export default store;


// ***** REDUX - PERSIST ***** //
import {createStore,applyMiddleware} from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReduser from "./reduser/rootReduser";

const persistConfig = {
    key: 'root',
    storage,
  }
   
  const persistedReducer = persistReducer(persistConfig, rootReduser)

  let store = createStore(persistedReducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
  let persistor = persistStore(store)
  export  {store, persistor }