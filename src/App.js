import './App.css';
import 'antd/dist/antd.css';
import EMedRouter from './router/EMedRouter';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'

import {store, persistor } from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <EMedRouter />
      </PersistGate>
    </Provider>
  );
}

export default App;
