import Routes from "./routes";
import { ToastContainer } from 'react-toastify';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

const App = () => {
  const currentKey = location.pathname.split('/')[1] || '/';
  const timeout = { enter: 300, exit: 200 };

  return (
    <div className="App">
      <TransitionGroup component="main" className="page-main">
        <CSSTransition key={currentKey} timeout={timeout} classNames="fade" appear>
          <Routes />
        </CSSTransition>
      </TransitionGroup>
      <ToastContainer />
    </div>
  );
};

export default App;
