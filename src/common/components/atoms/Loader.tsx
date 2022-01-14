export const Loader = (props: any) => {
  if (props.isLoading === true) {
    return (<div className="overlay"><div className="loader" /></div>)
  }

  return (<div/>);
}
