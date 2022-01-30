import { useNavigate } from "react-router-dom";
import { Column, useTable } from "react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import Truncate from 'react-truncate';

import * as quotesActions from "../../../store/actions/quotes.actions";

import InputField from "common/components/form/Input";
import SelectField from "common/components/form/Select";
import { endpoints } from "common/config";
import ReactPaginate from "react-paginate";
import { connect } from "react-redux";
import { Loader } from "common/components/atoms/Loader";
import debounce from "lodash/debounce";
import EmptyState from "common/components/EmptyState";

interface IQuote {
  id: string;
  title: string;
  description: string;
  quoteFor: any;
  lineItems: any[];
  status: { status: string, updatedAt: string };
  total: string;
  createdAt: string;
  updatedAt: string;
}

const QuotesList = (props: any) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [itemsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0)
  const [quotes, setQuotes] = useState<IQuote[]>([]);

  useEffect(() => {
    props.actions.fetchQuotes({ q: query, offset: offset, limit: itemsPerPage });
  }, [offset, itemsPerPage, props.actions, query]);

  useEffect(() => {
    if (props.itemList?.data?.rows) {
      setQuotes(props.itemList.data?.rows
        .map((row: IQuote) => ({
          id: row.id,
          title: row.title,
          description: row.description,
          quoteFor: row.quoteFor,
          lineItems: row.lineItems,
          status: row.status,
          total: '$123456',
          createdAt: new Date(row.createdAt).toDateString(),
          updatedAt: new Date(row.updatedAt).toDateString()
        }))
      );
      setPageCount(Math.ceil(props.itemList.data.totalCount / itemsPerPage));
    }
  }, [itemsPerPage, props.itemList]);

  const handlePageClick = (event: any) => {
    const selectedPage = event.selected;
    setOffset(selectedPage)
  };

  const handleQuotesSearch = (event: any) => {
    const query = event.target.value;
    setQuery(query);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(debounce(handleQuotesSearch, 300), []);

  /**
   * Generate Quote
   * 
   * @param quote 
   * @returns JSX
   */
  const generateRatings = (quote: IQuote) => {
    return (<div>
      ${quote.lineItems.reduce((sum, current) => sum += current.quantity * current.unitPrice, 0)}
      <span className="ms-2">
        <box-icon
          name="star"
          size="xs"
          type="solid"
          color="#F5E059"
        ></box-icon>
        <box-icon
          name="star"
          size="xs"
          type="solid"
          color="#F5E059"
        ></box-icon>
        <box-icon
          name="star"
          size="xs"
          type="solid"
          color="#F5E059"
        ></box-icon>
      </span>
    </div>);
  }

  const columns: Column<IQuote>[] = useMemo(
    () => [
      {
        Header: "CLIENT NAME",
        accessor: (row: IQuote) => {
          return (<div>
            <div>{row.quoteFor.firstName} {row.quoteFor.lastName}</div>
            <div>{row.quoteFor.phoneNumber} / {row.quoteFor.email}</div>
          </div>)
        }
      },
      {
        Header: "TITLE",
        accessor: (row: IQuote) => {
          return (<div>
            <div><strong>{row.title}</strong></div>
            <div><i>
              <Truncate lines={1} ellipsis={<span>...</span>}>
                {row.description}
              </Truncate>
            </i>
            </div>
          </div>)
        }
      },
      {
        Header: "CREATED DATE",
        accessor: (row: IQuote) => {
          return (<div>
            <div><strong>{row.updatedAt}</strong></div>
            <div>{row.createdAt}</div>
          </div>)
        }
      },
      {
        Header: "Line Items",
        accessor: (row: IQuote) => {
          return (<div>Line Items ({row.lineItems.length})</div>)
        }
      },
      {
        Header: "TOTAL",
        accessor: (row: IQuote) => generateRatings(row),
      },
      {
        Header: " ",
        maxWidth: 40,
        accessor: (row: IQuote) => (
          <div className="dropdown">
            <a
              href="#"
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <box-icon name="dots-vertical-rounded"></box-icon>
            </a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li onClick={() => navigate(endpoints.admin.quotes.detail)}>
                <a className="dropdown-item" href="#">
                  View Detail
                </a>
              </li>
              <li onClick={() => navigate(endpoints.admin.quotes.edit)}>
                <a className="dropdown-item" href="#">
                  Edit
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Delete
                </a>
              </li>
            </ul>
          </div>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: quotes });

  return (
    <>
      <div className="row">
        <div className="col d-flex flex-row">
          <h3 className="extra">Quotes</h3>
        </div>
        <div className="col">
          <button
            onClick={() => navigate(endpoints.admin.quotes.add)}
            type="button"
            className="btn btn-primary d-flex float-end"
          >
            New quotes
          </button>
        </div>
        <label className="txt-grey">{quotes.length} quotes</label>
      </div>
      <div className="card">
        <div className="row pt-2 m-1 rounded-top bg-grey">
          <Loader isLoading={props.isLoading} />
          <div className="col-4">
            <InputField
              label="Search"
              placeholder="Search quotes"
              className="search-input"
              onChange={handleSearch}
            />
          </div>
          <div className="col row">
            <div className="col">
              <SelectField label="Due" placeholder="All" />
            </div>
            <div className="col">
              <SelectField label="Sort" placeholder="total" />
            </div>
            <div className="col">
              <SelectField label="Type" placeholder="All" />
            </div>
          </div>
          {!quotes.length ? <EmptyState /> : (
            <table {...getTableProps()} className="table txt-dark-grey">
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()} className="rt-head">
                    <th>SN</th>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()} scope="col">
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()} className="rt-tbody">
                {rows.map((row, index) => {
                  prepareRow(row);

                  return (
                    <tr {...row.getRowProps()} className="rt-tr-group">
                      <td><strong>#{index + 1 + (offset * itemsPerPage)}</strong></td>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div className="row pt-2 m-1 rounded-top">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"} />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return ({
    itemList: state.quotes.itemList,
    isLoading: state.quotes.isLoading
  });
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchQuotes: (payload: any) => {
      dispatch(quotesActions.fetchQuotes(payload));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(QuotesList);

