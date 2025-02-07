import React from "react";

interface IPropsTypes {
  children: JSX.Element;
}

interface IStateTypes {
  hasError: boolean;
  error?: any;
  errorInfo?: any;
}

class ErrorBoundary extends React.Component<IPropsTypes, IStateTypes> {
  constructor(props: IPropsTypes) {
    super(props);
    this.state = { hasError: false, error: undefined, errorInfo: undefined };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState((prevState: IStateTypes) => {
      return { ...prevState, error, errorInfo };
    });
  }

  render() {
    if (this.state.hasError){
      return (<div className="text-center mt-5">
        <h1 className="mt-5">
          <span>Error!</span> <br />
          Ops Something Went Wrong!
        </h1>
        <p>We've received the log, We'll try to fix the problem asap.</p>
        <p className="info">
          Error: {this.state.error?.toString()}
        </p>
        <button className="btn btn-primary" onClick={() => window.location.href = '/'}>Back to Home</button>
      </div>);
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
