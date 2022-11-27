import { useNavigate } from 'react-router-dom';
import { Column, useTable } from 'react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';

import * as appointmentsActions from '../../../store/actions/quotes.actions';

import InputField from 'common/components/form/Input';
import SelectField from 'common/components/form/Select';
import ReactPaginate from 'react-paginate';
import { connect } from 'react-redux';
import { Loader } from 'common/components/atoms/Loader';
import debounce from 'lodash/debounce';
import EmptyState from 'common/components/EmptyState';
import Modal from 'common/components/atoms/Modal';
import { toast } from 'react-toastify';
import DeleteConfirm from 'common/components/DeleteConfirm';
import { deleteQuoteApi } from 'services/appointments.service';
import StatusChangeWithReason from './StatusChangeWithReason';
import { EyeIcon, InfoIcon, NoteIcon, PencilIcon, TrashIcon } from '@primer/octicons-react';
import { getCurrentUser } from 'utils';
import { DateTime } from 'luxon';
import { calculateJobDuration } from 'utils/timer';
import ReactTooltip from 'react-tooltip';
import DummyImage from '../../../assets/images/dummy.png';


interface IAppointment {
  id: string;
  customer: any;
  notes: string;
  type: any;
  status: any;
  session: string;
  appointmentDate: string;
  appointmentTime: string;
  createdDate: string;
  services: any[];
  createdAt: string;
  updatedAt: string;
}

const appointmentStatusOptions = [
  { label: 'WAITING', value: 'WAITING' },
  { label: 'IN PROCESS', value: 'IN_PROGRESS' },
  { label: 'COMPLETED', value: 'COMPLETED' },
  { label: 'CANCELED', value: 'CANCELED' }
];

const AppointmentList = (props: any) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [query, setQuery] = useState('');
  const [queryDate, setQueryDate] = useState(DateTime.fromJSDate(new Date()).toFormat('yyyy-MM-dd'));
  const [itemsPerPage] = useState(10);
  const [offset, setOffset] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [appointments, setQuotes] = useState<IAppointment[]>([]);
  const [deleteInProgress, setDeleteInProgress] = useState('');
  const [totalData, setTotalData] = useState(0);

  const deleteQuoteHandler = async () => {
    try {
      if (deleteInProgress) {
        await deleteQuoteApi(deleteInProgress);
        toast.success('Quote deleted successfully');
        setDeleteInProgress('');

        props.actions.fetchQuotes({ q: query, page: offset, limit: itemsPerPage });
      }
    } catch (ex) {
      toast.error('Failed to delete appointment');
    }
  };

  const handlePageClick = (event: any) => {
    const selectedPage = event.selected;
    setOffset(selectedPage + 1);
  };

  const handleQuotesSearch: any = (event: any) => {
    const query = event.target.value;
    setQuery(query);
  };

  const handleQuotesFilter = (event: any) => {
    const query = event.target.value;
    setQueryDate(query);
  };

  const handleStatusChange = async (id: string, data: any) => {
    await props.actions.updateQuoteStatus({ id, data });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(debounce(handleQuotesSearch, 300), []);

  const Status = ({ row }: { row: IAppointment }) => {
    const [statusChangeInProgress, setStatusChangeInProgress] = useState('');

    return (
      <div style={{ minWidth: '150px' }}>
        <SelectField
          label=""
          isClearable= {false}
          isDisabled={row.status.name === 'COMPLETED'}
          options={appointmentStatusOptions}
          value={row.status.name}
          placeholder="All"
          handleChange={(selected: { label: string; value: string }) => {
            if (selected.value === 'IN_PROGRESS' || selected.value === 'COMPLETED') {
              setStatusChangeInProgress(selected.value);
            }
          }}
          helperComponent={<div className="">{''}</div>}
        />
        <Modal isOpen={!!statusChangeInProgress} onRequestClose={() => setStatusChangeInProgress('')}>
          <StatusChangeWithReason
            row={row}
            id={row.id}
            status={appointmentStatusOptions.find((statusLabelValue) => statusLabelValue.value === statusChangeInProgress)}
            onSave={handleStatusChange}
            closeModal={() => setStatusChangeInProgress('')}
          />
        </Modal>
      </div>
    );
  };

  const Timer = (props: any) => {
    const [timer, setTimer] = useState(calculateJobDuration({
      startDate: new Date(props.date).toISOString(),
      endDate: new Date().toISOString()
    }));
  
    useEffect(() => {
      const inte = setInterval(() => {
        setTimer(calculateJobDuration({
          startDate: new Date(props.date).toISOString(),
          endDate: new Date().toISOString()
        }));
      }, 1000);

      return () => {
        clearInterval(inte);
      } 
    }, [props.status]);

    return <div style={{'fontSize': 18, fontWeight: '600'}}>{timer}</div>;
  }

  const columns: Column<IAppointment>[] = useMemo(
    () => [
      {
        Header: 'APPOINTMENT INFO',
        accessor: (row: IAppointment) => {
          return (
            <div className='row'>
              <div className='col-4'>
                {row.customer.photo ? (
                  <object data={process.env.REACT_APP_API +'v1/customers/avatars/' + row.customer.photo} style={{'width': '72px'}}>
                    <img src={DummyImage} alt="Profile Picture" style={{'width': '72px'}}/>
                  </object>
                ) : <img src={DummyImage} alt="Profile Picture" style={{'width': '72px'}}/>}
              </div>
              <div className='col-8'>
                <div className="cursor-pointer" onClick={() => navigate('/dashboard/clients/' + row.customer.id )}>
                  <div>{row.customer?.fullName || ' Not Entered '}</div>
                  <div>{row.customer?.phoneNumber}</div>
                </div>
              </div>
            </div>
          );
        }
      },
      {
        Header: 'SESSION INFO',
        accessor: (row: IAppointment) => {
          return (<div>{row.session || 'N/A'}</div>);
        }
      },
      {
        Header: 'WAITING TIME',
        accessor: (row: IAppointment) => {
          return row.status.name === 'COMPLETED'
            ? <div>Completed on: <br/> <span style={{'fontSize': 16, 'fontWeight': 600}}>{DateTime.fromISO(row.status.date).toFormat('yyyy-MM-dd HH:mm a')}</span></div>
            : <>Currently {(row.status.name).toLowerCase().split('_').join(' ')} <br/> <Timer date={row.status.date} status={row.status.name}/></>;
        }
      },
      {
        Header: 'APPOINTMENT DATE',
        accessor: (row: IAppointment) => {
          return (<>
            Scheduled for: <br/>
            <div style={{'fontSize': 16, 'fontWeight': 600}}>{row.appointmentDate} {DateTime.fromISO(row.appointmentTime).toFormat('h:mm a') }</div>
            {row.type === 'TREATMENT' ? <div className='text-primary'>Services: {row.services.join(', ')}</div> : null}
          </>);
        }
      },
      {
        Header: 'Notes/Reasons',
        accessor: ((row: IAppointment) => {
          return (<div className='row'>
            <div className='col-2'>
              <a data-tip data-for='notes'><NoteIcon /></a>
              <ReactTooltip id='notes' aria-haspopup='true'>
                <p>{row.notes}</p>
              </ReactTooltip>
            </div>
            {(!!row.status?.reason) ? (
              <div className='col-2'>
                <a data-tip data-for='reason'><InfoIcon /></a>
                <ReactTooltip id='reason' aria-haspopup='true'>
                  <p>{row.status.reason}</p>
                </ReactTooltip>
              </div>
            ): null}
            
          </div>)
        })
      },
      {
        Header: 'STATUS',
        accessor: (row: IAppointment) => <Status row={row} />
      },
      {
        Header: ' ',
        maxWidth: 40,
        accessor: (row: IAppointment) => (
          <div className="dropdown">
            <span role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
              <box-icon name="dots-vertical-rounded" />
            </span>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li onClick={() => navigate(row.id)}>
                <span className="dropdown-item cursor-pointer"><EyeIcon /> View Detail</span>
              </li>
              {(currentUser.role === 'ADMIN' || currentUser.role === 'SHOP_ADMIN') ? (
                <>
                  <li onClick={() => navigate(row.id + '/edit')}>
                    <span className="dropdown-item cursor-pointer"><PencilIcon /> Edit</span>
                  </li>
                  <li onClick={() => setDeleteInProgress(row.id)}>
                    <span className="dropdown-item cursor-pointer"><TrashIcon /> Delete</span>
                  </li>
                </>
              ) : null}
            </ul>
          </div>
        )
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: appointments });

  useEffect(() => {
    const appointmentQuery: { q?: string; appointmentDate?: string; createdBy?: string;} = {}

    if (currentUser.role === 'SHOP_ADMIN') {
      appointmentQuery.createdBy = currentUser.id;
    }

    if (queryDate) {
      appointmentQuery.appointmentDate = queryDate;
    }

    if (query) {
      appointmentQuery.q = query;
    }

    props.actions.fetchQuotes({ ...appointmentQuery, page: offset, limit: itemsPerPage, type: props?.appointmentType});
  }, [offset, itemsPerPage, query, queryDate, currentUser.id, currentUser.role, props.appointmentType]);

  useEffect(() => {
    if (props.itemList?.data?.rows) {
      setQuotes(
        props.itemList.data?.rows
          .map((row: IAppointment) => ({
            id: row.id,
            customer: row.customer,
            notes: row.notes,
            services: row?.services,
            status: row.status,
            type: row.type,
            session: row.session,
            appointmentDate: row.appointmentDate,
            appointmentTime: row.appointmentTime,
            createdDate: row.createdDate,
            createdAt: row.createdAt,
            updatedAt: new Date(row.updatedAt).toDateString()
          }))
      );
      setPageCount(Math.ceil(props.itemList.data.totalCount / itemsPerPage));
      setTotalData(props.itemList?.data?.totalCount || 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isLoading]);

  return (
    <>
      <div className="card">
        <div className="row">
          <div className="col">
            <h5 className="extra">{props.appointmentType} ({totalData})</h5>
          </div>
        </div>
        <div className="row pt-2 m-1 rounded-top bg-grey">
          <Loader isLoading={props.isLoading} />
          <div className="col-8">
            <InputField label="Search" placeholder="Search appointments" className="search-input" onChange={handleSearch} />
          </div>
          <div className="col-4">
            <InputField type="date" value={queryDate} label="Search" placeholder="Search Date" className="search-input" onChange={handleQuotesFilter} />
          </div>
          {!appointments.length ? (
            <EmptyState />
          ) : (
            <table {...getTableProps()} className="table txt-dark-grey">
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()} className="rt-head">
                    <th>SN</th>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()} scope="col">
                        {column.render('Header')}
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
                      <td>
                        <strong>#{index + 1 + (offset - 1) * itemsPerPage}</strong>
                      </td>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        {appointments.length ? (
          <div className="row pt-2 m-1 rounded-top">
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </div>
        ) : null}
      </div>
      <Modal isOpen={!!deleteInProgress} onRequestClose={() => setDeleteInProgress('')}>
        <DeleteConfirm onDelete={deleteQuoteHandler} closeModal={() => setDeleteInProgress('')} />
      </Modal>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    itemList: state.quotes.itemList,
    isLoading: state.quotes.isLoading
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchQuotes: (payload: any) => {
      dispatch(appointmentsActions.fetchQuotes(payload));
    },
    updateQuoteStatus: (payload: any) => {
      dispatch(appointmentsActions.updateQuoteStatus(payload.id, payload.data));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentList);
