import Routes from "./routes";
import { ToastContainer } from 'react-toastify';

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <Routes />
      <ToastContainer autoClose={3000}/>
    </div>
  );
};

export default App;
