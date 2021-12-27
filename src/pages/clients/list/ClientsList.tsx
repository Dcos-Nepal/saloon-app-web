import { Column, useTable } from "react-table";
import { useEffect, useMemo, useState } from "react";

import SideNavbar from "common/components/layouts/sideNavbar";
import TopNavbar from "common/components/layouts/topNavbar";

interface IClient {
  name: string;
  address: string;
  contact: string;
  status: string;
}

const ClientsList = () => {
  const [clients, setClients] = useState<IClient[]>([]);

  useEffect(() => {
    setClients([
      {
        name: "MOCK Adam Johar",
        address: "NY, US 12",
        contact: "+123123123",
        status: "Active",
      },
      {
        name: "MOCK Neal Johar",
        address: "NY, US 13",
        contact: "+532123",
        status: "Active",
      },
      {
        name: "MOCK S. Johar",
        address: "LA, US 12",
        contact: "+321113",
        status: "Active",
      },
    ]);
  }, []);

  const columns: Column<IClient>[] = useMemo(
    () => [
      {
        Header: "CLIENT NAME",
        accessor: "name",
      },
      {
        Header: "ADDRESS",
        accessor: "address",
      },
      {
        Header: "CONTACT",
        accessor: "contact",
      },
      {
        Header: "STATUS",
        accessor: "status",
      },
      {
        Header: "-",
        accessor: (row: any) => (
          <div>
            <box-icon name="dots-vertical-rounded"></box-icon>
          </div>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: clients });

  return (
    <>
      <TopNavbar />
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <SideNavbar active="Clients" />
          <div className="col main-container">
            <div className="">
              <div className="d-flex flex-row">
                <h1>Clients</h1>
              </div>
              <div className="d-flex flex-row-reverse">
                <button type="button" className="btn btn-primary d-flex">
                  New client
                </button>
              </div>
            </div>
            <table {...getTableProps()} className="table">
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()} scope="col">
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);

                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientsList;
