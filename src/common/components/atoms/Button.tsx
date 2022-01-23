interface IButton {
  label: string,
  type: 'button' | 'submit' | 'reset',
  options: {
    classNames: string
  }
}

const Button = (data: IButton) => {
  return <button type={data.type} className={data.options.classNames}>{data.label}</button>;
};

export default Button;
