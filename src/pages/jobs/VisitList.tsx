export default function JobsOverview() {
  return (
    <>
      <table role="table" className="table txt-dark-grey">
        <thead>
          <tr role="row" className="rt-head">
            <th colSpan={1} role="columnheader" scope="col">
              #NO.
            </th>
            <th colSpan={1} role="columnheader" scope="col">
              CLIENT
            </th>
            <th colSpan={1} role="columnheader" scope="col">
              TITLE/ADDRESS
            </th>
            <th colSpan={1} role="columnheader" scope="col">
              SCHEDULE
            </th>
            <th colSpan={1} role="columnheader" scope="col">
              INVOICING
            </th>
            <th colSpan={1} role="columnheader" scope="col">
              Total
            </th>
            <th colSpan={1} role="columnheader" scope="col">
              {' '}
            </th>
          </tr>
        </thead>
        <thead>
          <tr className="rt-head">
            <th colSpan={1} scope="col" className="th-overdue">
              Overdue Jobs
            </th>
          </tr>
        </thead>
        <tbody role="rowgroup" className="rt-tbody">
          <tr role="row" className="rt-tr-group">
            <td role="cell"></td>
            <td role="cell">Bilson Naga(client)</td>
            <td role="cell">Thecho-9, Lalitpur</td>
            <td role="cell">Every Week On Tuesday Until March 31 2022</td>
            <td role="cell"></td>
            <td role="cell">1</td>
            <td role="cell">
              <div className="dropdown">
                <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                  <box-icon name="dots-vertical-rounded"></box-icon>
                </a>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <li>
                    <a className="dropdown-item" href="">
                      View Detail
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="">
                      Edit
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="">
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
          <tr role="row" className="rt-tr-group">
            <td role="cell"></td>
            <td role="cell">Bilson Naga(client)</td>
            <td role="cell">Thecho-9, Lalitpur</td>
            <td role="cell">Every Day Until February 12 2022</td>
            <td role="cell"></td>
            <td role="cell">2</td>
            <td role="cell">
              <div className="dropdown">
                <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                  <box-icon name="dots-vertical-rounded"></box-icon>
                </a>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <li>
                    <a className="dropdown-item" href="">
                      View Detail
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="">
                      Edit
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="">
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
          <tr role="row" className="rt-tr-group">
            <td role="cell"></td>
            <td role="cell">Bilson Naga(client)</td>
            <td role="cell">Thecho-9, Bhaktpur</td>
            <td role="cell">Every Day Until February 12 2022</td>
            <td role="cell"></td>
            <td role="cell">1</td>
            <td role="cell">
              <div className="dropdown">
                <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                  <box-icon name="dots-vertical-rounded"></box-icon>
                </a>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <li>
                    <a className="dropdown-item" href="">
                      View Detail
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="">
                      Edit
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="">
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
        <thead className="c-th">
          <tr className="rt-head">
            <th colSpan={1} scope="col" className="th-in-progress">
              In Progress
            </th>
          </tr>
        </thead>
        <tbody role="rowgroup" className="rt-tbody">
          <tr role="row" className="rt-tr-group">
            <td role="cell"></td>
            <td role="cell">Bilson Naga(client)</td>
            <td role="cell">Thecho-9, Lalitpur</td>
            <td role="cell">Every Week On Tuesday Until March 31 2022</td>
            <td role="cell"></td>
            <td role="cell">1</td>
            <td role="cell">
              <div className="dropdown">
                <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                  <box-icon name="dots-vertical-rounded"></box-icon>
                </a>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <li>
                    <a className="dropdown-item" href="">
                      View Detail
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="">
                      Edit
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="">
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
          <tr role="row" className="rt-tr-group">
            <td role="cell"></td>
            <td role="cell">Bilson Naga(client)</td>
            <td role="cell">Thecho-9, Lalitpur</td>
            <td role="cell">Every Day Until February 12 2022</td>
            <td role="cell"></td>
            <td role="cell">2</td>
            <td role="cell">
              <div className="dropdown">
                <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                  <box-icon name="dots-vertical-rounded"></box-icon>
                </a>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <li>
                    <a className="dropdown-item" href="">
                      View Detail
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="">
                      Edit
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="">
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
          <tr role="row" className="rt-tr-group">
            <td role="cell"></td>
            <td role="cell">Bilson Naga(client)</td>
            <td role="cell">Thecho-9, Bhaktpur</td>
            <td role="cell">Every Day Until February 12 2022</td>
            <td role="cell"></td>
            <td role="cell">1</td>
            <td role="cell">
              <div className="dropdown">
                <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                  <box-icon name="dots-vertical-rounded"></box-icon>
                </a>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <li>
                    <a className="dropdown-item" href="">
                      View Detail
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="">
                      Edit
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="">
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
        <thead className="c-th">
          <tr className="rt-head">
            <th colSpan={1} scope="col" className="th-up-coming">
              Up Coming Jobs
            </th>
          </tr>
        </thead>
        <tbody role="rowgroup" className="rt-tbody">
          <tr role="row" className="rt-tr-group">
            <td role="cell"></td>
            <td role="cell">Bilson Naga(client)</td>
            <td role="cell">Thecho-9, Lalitpur</td>
            <td role="cell">Every Week On Tuesday Until March 31 2022</td>
            <td role="cell"></td>
            <td role="cell">1</td>
            <td role="cell">
              <div className="dropdown">
                <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                  <box-icon name="dots-vertical-rounded"></box-icon>
                </a>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <li>
                    <a className="dropdown-item" href="">
                      View Detail
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="">
                      Edit
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="">
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
          <tr role="row" className="rt-tr-group">
            <td role="cell"></td>
            <td role="cell">Bilson Naga(client)</td>
            <td role="cell">Thecho-9, Lalitpur</td>
            <td role="cell">Every Day Until February 12 2022</td>
            <td role="cell"></td>
            <td role="cell">2</td>
            <td role="cell">
              <div className="dropdown">
                <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                  <box-icon name="dots-vertical-rounded"></box-icon>
                </a>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <li>
                    <a className="dropdown-item" href="">
                      View Detail
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="">
                      Edit
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="">
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
          <tr role="row" className="rt-tr-group">
            <td role="cell"></td>
            <td role="cell">Bilson Naga(client)</td>
            <td role="cell">Thecho-9, Bhaktpur</td>
            <td role="cell">Every Day Until February 12 2022</td>
            <td role="cell"></td>
            <td role="cell">1</td>
            <td role="cell">
              <div className="dropdown">
                <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                  <box-icon name="dots-vertical-rounded"></box-icon>
                </a>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <li>
                    <a className="dropdown-item" href="">
                      View Detail
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="">
                      Edit
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="">
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
