const Footer = () => {
  return (
    <div className="footer rounded-radius mt-3">
      <div className="row">
        <div className="col copy-right">Copyright &copy; {new Date().getFullYear()} <b>Orange Cleaning</b>, All Rights Reserved.</div>
        <div className="col mr-auto">
          <ul className="mr-auto float-end social">
            <li className="pointer">
              <box-icon color="#111827" type="logo" name="facebook" />
            </li>
            <li className="pointer">
              <box-icon color="#111827" type="logo" name="twitter" />
            </li>
            <li className="pointer">
              <box-icon color="#111827" type="logo" name="github" />
            </li>
            <li className="pointer">
              <box-icon color="#111827" type="logo" name="dribbble" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
