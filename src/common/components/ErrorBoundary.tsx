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
    if (this.state.hasError)
      return <div>Error: {this.state.error?.toString()}</div>;
    return this.props.children;
  }
}

export default ErrorBoundary;
