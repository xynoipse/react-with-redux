import configureStore from './store/configureStore';
// import StoreContext from './contexts/storeContext';
// import BugsContext from './components/BugsContext';
import Bugs from './components/Bugs';
import BugsList from './components/BugsList';
import { Provider } from 'react-redux';
import './App.css';

const store = configureStore();

const App = () => (
  // <StoreContext.Provider value={store}>
  //   <BugsContext />
  // </StoreContext.Provider>
  <Provider store={store}>
    <BugsList />
  </Provider>
);

export default App;
