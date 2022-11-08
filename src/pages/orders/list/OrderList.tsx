import { useNavigate } from 'react-router-dom';
import { Column, useTable } from 'react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';

import * as ordersAction from '../../../store/actions/orders.actions';

import InputField from 'common/components/form/Input';
import SelectField from 'common/components/form/Select';
import { endpoints } from 'common/config';
import ReactPaginate from 'react-paginate';
import { connect } from 'react-redux';
import { Loader } from 'common/components/atoms/Loader';
import debounce from 'lodash/debounce';
import EmptyState from 'common/components/EmptyState';
import Modal from 'common/components/atoms/Modal';
import { toast } from 'react-toastify';
import DeleteConfirm from 'common/components/DeleteConfirm';
import { deleteOrderApi } from 'services/orders.service';
import StatusChangeWithReason from './StatusChangeWithReason';
import { EyeIcon, FileBadgeIcon, InfoIcon, PencilIcon, SyncIcon, TrashIcon } from '@primer/octicons-react';
import { getCurrentUser } from 'utils';
import DummyImage from '../../../assets/images/dummy.png';
import { DateTime } from 'luxon';

export interface OrderStatus {
  name: string;
  date: Date;
  reason?: string;
}

export interface OrderProduct {
  name: any;
  unitPrice: number;
  quantity: number;
  notes: string;
}

export interface IOrder {
  _id?: string;
  id: string;
  title: string;
  customer: any;
  orderNotes: string;
  status: OrderStatus;
  prevStatus: OrderStatus[];
  products: OrderProduct[];
  orderDate: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const orderStatusOptions = [
  {label: "ORDER_PENDING", value: "ORDER_PENDING"},
  {label: "NOT_ON_STOCK", value: "NOT_ON_STOCK"},
  {label: "NOT_PACKED", value: "NOT_PACKED"},
  {label: "NOT_DELIVERED", value: "NOT_DELIVERED"},
  {label: "PACKED", value: "PACKED"},
  {label: "DELIVERED", value: "DELIVERED"}
];

const OrdersList = (props: any) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [query, setQuery] = useState('');
  const [itemsPerPage] = useState(10);
  const [offset, setOffset] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<IOrder>();
  const [deleteInProgress, setDeleteInProgress] = useState('');

  const deleteOrderHandler = async () => {
    try {
      if (deleteInProgress) {
        await deleteOrderApi(deleteInProgress);
        toast.success('Order deleted successfully');
        setDeleteInProgress('');

        props.actions.fetchOrders({ q: query, page: offset, limit: itemsPerPage });
      }
    } catch (ex) {
      toast.error('Failed to delete order');
    }
  };

  const handlePageClick = (event: any) => {
    const selectedPage = event.selected;
    setOffset(selectedPage + 1);
  };

  const handleRefresh = () => {
    const orderQuery: { orderFor?: string; createdBy?: string;} = {}

    if (currentUser.role === 'SHOP_ADMIN') {
      orderQuery.createdBy = currentUser.id;
    }

    props.actions.fetchOrders({ q: query, ...orderQuery, page: offset, limit: itemsPerPage });
  }

  const handleOrdersSearch = (event: any) => {
    const query = event.target.value;
    setQuery(query);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(debounce(handleOrdersSearch, 300), []);

  const handleStatusChange = async (id: string, data: any) => {
    await props.actions.updateOrderStatus({ id, data });
  };

  /**
   * GeneunitPrice Order
   *
   * @param order
   * @returns JSX
   */
  const calculateOrderTotal = (order: IOrder) => {
    return (
      <div>
        <strong>${order.products.reduce((sum, current) => (sum += current.quantity * current.unitPrice), 0)}</strong>
      </div>
    );
  };

  const Status = ({ row }: { row: IOrder }) => {
    const [statusChangeInProgress, setStatusChangeInProgress] = useState('');

    return (
      <div style={{ minWidth: '150px' }}>
        <SelectField
          label=""
          options={orderStatusOptions}
          value={{ label: row.status.name, value: row.status.name }}
          placeholder="All"
          handleChange={(selected: { label: string; value: string }) => {
            setStatusChangeInProgress(selected.value);
          }}
          helperComponent={<div className="">{row.status?.reason ? <><InfoIcon className='mt-2'/> <span>{row.status?.reason || ''}</span></> : null}</div>}
        />
        <Modal isOpen={!!statusChangeInProgress} onRequestClose={() => setStatusChangeInProgress('')}>
          <StatusChangeWithReason
            id={row.id}
            status={orderStatusOptions.find((statusLabelValue) => statusLabelValue.value === statusChangeInProgress)}
            onSave={handleStatusChange}
            closeModal={() => setStatusChangeInProgress('')}
          />
        </Modal>
      </div>
    );
  };

  const columns: Column<IOrder>[] = useMemo(
    () => [
      {
        Header: 'CLIENT NAME',
        accessor: (row: IOrder) => {
          return (
            <div className='row' onClick={() => setSelectedOrder(row)}>
              <div className='col-4'>
                {row.customer.photo ? (
                  <object data={process.env.REACT_APP_API +'v1/customers/avatars/' + row.customer.photo} style={{'width': '72px'}}>
                    <img src={DummyImage} alt="Profile Picture" style={{'width': '72px'}}/>
                  </object>
                ) : <img src={DummyImage} alt="Profile Picture" style={{'width': '72px'}}/>}
              </div>
              <div className='col-8'>
                <div className="cursor-pointer" onClick={() => navigate('/dashboard/clients/' + row.customer.id )}>
                  <div>Name: {row.customer?.fullName}</div>
                  <div>Phone: {row.customer?.phoneNumber}</div>
                </div>
              </div>
            </div>
          );
        }
      },
      {
        Header: 'ORDER INFO',
        accessor: (row: IOrder) => {
          return (
            <div className="cursor-pointer">
              <div>
                <strong>{row.title}</strong>
              </div>
              <div><i>{row.orderNotes}</i></div>
            </div>
          );
        }
      },
      {
        Header: 'ORDER PRODUCTS',
        accessor: (row: IOrder) => {
          return (
            <div className="cursor-pointer">
              <span className="badge rounded-pill bg-secondary pointer">
                Total Products ({row.products.length})
              </span>
            </div>
          );
        }
      },
      {
        Header: 'CREATED DATE',
        accessor: (row: IOrder) => {
          return (
            <div style={{ width: '150px' }}>
              <div>
                <strong>{row.createdAt}</strong>
              </div>
            </div>
          );
        }
      },
      {
        Header: 'STATUS',
        accessor: (row: IOrder) => <Status row={row} />
      },
      {
        Header: 'TOTAL',
        accessor: (row: IOrder) => calculateOrderTotal(row)
      },
      {
        Header: ' ',
        maxWidth: 40,
        accessor: (row: IOrder) => (
          <div className="dropdown">
            <span role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
              <box-icon name="dots-vertical-rounded" />
            </span>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li onClick={() => setSelectedOrder(row)}>
                <span className="dropdown-item cursor-pointer"><EyeIcon /> View Detail</span>
              </li>
              {(currentUser.role === 'SHOP_ADMIN') ? (
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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: orders });

  useEffect(() => {
    const orderQuery: { customer?: string; createdBy?: string;} = {}

    if (props.customer) {
      orderQuery.customer = props.customer;
  } 

    props.actions.fetchOrders({ q: query, ...orderQuery, page: offset, limit: itemsPerPage });
  }, [offset, itemsPerPage, props.actions, query, currentUser.id, currentUser.role]);

  useEffect(() => {
    if (props.itemList?.data?.rows) {
      setOrders(
        props.itemList.data?.rows.map((row: IOrder) => ({
          id: row.id,
          title: row.title,
          description: row.orderNotes,
          customer: row.customer,
          products: row.products,
          status: row.status,
          total: '',
          createdAt: new Date(row.createdAt).toDateString(),
          updatedAt: new Date(row.updatedAt).toDateString()
        }))
      );
      setPageCount(Math.ceil(props.itemList.data.totalCount / itemsPerPage));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isLoading]);

  return (
    <>
      {(!props.customer) ? (
        <div className="row">
          <div className="col">
            <h3 className="extra">Orders</h3>
          </div>
          <div className="col-3 d-flex flex-row-reverse">
            <div
              onClick={() => handleRefresh()}
              className="btn btn-secondary"
            >
              <SyncIcon />&nbsp;Refresh
            </div>
            &nbsp;&nbsp;
            <div
              onClick={() => { navigate(endpoints.admin.order.add);}}
              className="btn btn-primary"
            >
              <FileBadgeIcon />&nbsp; New Order
            </div>
          </div>
          <label className="txt-grey">There are {orders.length} no. of orders created so far.</label>
        </div>
      ) : null}
      <div className="card">
        <div className="row pt-2 m-1 rounded-top bg-grey">
          <Loader isLoading={props.isLoading} />
          <div className="col-6">
            <InputField label="Search" placeholder="Search orders" className="search-input" onChange={handleSearch} />
          </div>
          <div className="col-3">
            <InputField label="Select Date" type="date" className="search-input" onChange={() => {}} />
          </div>
          <div className="col-3">
            <SelectField
              label="Select Status"
              options={orderStatusOptions}
              placeholder="All"
              handleChange={(selected: { label: string; value: string }) => {}}
            />
          </div>
          {!orders.length ? (
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
        {orders.length ? (
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
        <DeleteConfirm onDelete={deleteOrderHandler} closeModal={() => setDeleteInProgress('')} />
      </Modal>

      <Modal isOpen={!!selectedOrder} onRequestClose={() => setSelectedOrder(undefined)}>
        <div className={`modal fade show mt-5`} role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog mt-5">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="col">Order Detail</h5>
                <div className="col">
                  <span onClick={() => setSelectedOrder(undefined)} className="pointer d-flex float-end">
                    <box-icon name="x" />
                  </span>
                </div>
              </div>
              <div className="modal-body">
                <div className='row'>
                  <h6>Client Details</h6>
                  <div className='col-3'>
                    {selectedOrder?.customer.photo ? (
                      <object data={process.env.REACT_APP_API +'v1/customers/avatars/' + selectedOrder?.customer.photo} style={{'width': '72px'}}>
                        <img src={DummyImage} alt="Profile Picture" style={{'width': '72px'}}/>
                      </object>
                    ) : <img src={DummyImage} alt="Profile Picture" style={{'width': '72px'}}/>}
                  </div>
                  <div className='col-9'>
                    <div>
                      <div><b>{selectedOrder?.customer.fullName}</b></div>
                      <div>Phone: <b>{selectedOrder?.customer?.phoneNumber || 'N/A'}</b></div>
                      <div>Address: <b>{selectedOrder?.customer.address || 'N/A'}</b></div>
                    </div>
                  </div>
                </div>
                <hr/>
                <div className='row mt-3'>
                  <h6>Order Details</h6>
                  <div className='col-12'>
                    <h6>Products:</h6>
                    <ol>
                      {selectedOrder?.products.map((product) => {
                        return <li key={product.name}>{product?.name} Qty. {product.quantity} Rate: Rs.{product.unitPrice} Total: Rs.{(+product.quantity) * (+product.unitPrice)}</li>;
                      })}
                    </ol>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={() => setSelectedOrder(undefined)} type="button" className="ms-2 btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    itemList: state.orders.itemList,
    isLoading: state.orders.isLoading
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchOrders: (payload: any) => {
      dispatch(ordersAction.fetchOrders(payload));
    },
    updateOrderStatus: (payload: any) => {
      dispatch(ordersAction.updateOrderStatus(payload));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(OrdersList);
