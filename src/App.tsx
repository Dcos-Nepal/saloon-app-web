import Routes from "./routes";
import { ToastContainer } from 'react-toastify';

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <Routes />
      <ToastContainer />
    </div>
  );
};

export default App;
