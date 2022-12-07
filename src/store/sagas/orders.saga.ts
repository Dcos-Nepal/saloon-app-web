import { toast } from 'react-toastify';
import * as actionType from '../constants';
import { getMessage } from 'common/messages';
import { call, put, takeEvery } from 'redux-saga/effects';
import { createOrdersApi, fetchOrdersApi, fetchJobOrderApi, updateOrderApi, updateOrderStatusApi } from 'services/orders.service';

/**
 * Saga Definitions
 */

export function* addOrderSaga(): any {
    yield takeEvery(actionType.ADD_ORDER, addOrder);
}

export function* fetchOrdersSaga(): any {
    yield takeEvery(actionType.FETCH_ORDERS, fetchOrders);
}

export function* fetchOrderSaga(): any {
    yield takeEvery(actionType.FETCH_ORDER, fetchOrder);
}

export function* updateOrderStatusSaga(): any {
    yield takeEvery(actionType.UPDATE_ORDER_STATUS, updateOrderStatus);
}

export function* updateOrderSaga(): any {
    yield takeEvery(actionType.UPDATE_ORDER, updateOrder);
}
/**
 * Generator functions for Saga
 */
function* fetchOrders(action: any): any {
    try {
        const response = yield call(fetchOrdersApi, action.payload);
        if (response.data?.data.success) {
            return yield put({ type: actionType.FETCH_ORDERS_SUCCESS, payload: response.data.data });
        }

        yield put({ type: actionType.FETCH_ORDERS_ERROR, payload: response.data });
        return toast.error(getMessage(response.data.message));
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.FETCH_ORDERS_ERROR, payload: err });
    }
}

/**
 * Adds Job Order
 * 
 * @param action
 * @returns
 */
function* addOrder(action: any): any {
    try {
        const { data: orderRequest } = yield call(
            createOrdersApi,
            action.payload
        );
        if (orderRequest?.data?.success) {
            yield put({
                type: actionType.ADD_ORDER_SUCCESS,
                payload: orderRequest?.data?.data,
            });

            return toast.success(getMessage(orderRequest?.data?.message));
        }
        yield put({
            type: actionType.ADD_ORDER_ERROR,
            payload: orderRequest.data,
        });

        return toast.error(getMessage(orderRequest.data?.message));
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.ADD_ORDER_ERROR, payload: err });
    }
}

/**
 * Fetch Job Order
 * 
 * @param action
 * @returns
 */
function* fetchOrder(action: any): any {
    try {
        const { data: orderRequest } = yield call(
            fetchJobOrderApi,
            action.payload
        );

        if (orderRequest?.success) {
            return yield put({
                type: actionType.FETCH_ORDER_SUCCESS,
                payload: orderRequest?.data,
            });
        }
        yield put({
            type: actionType.FETCH_ORDER_ERROR,
            payload: orderRequest.data,
        });

        return toast.error(getMessage(orderRequest.data?.message));
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.FETCH_ORDER_ERROR, payload: err });
    }
}

/**
 * Updates Job Order Status
 * 
 * @param action
 * @returns
 */
function* updateOrderStatus(action: any): any {
    try {
        const { data: orderRequest } = yield call(
            updateOrderStatusApi,
            action.payload
        );
        
        if (orderRequest?.success) {
            return yield put({
                type: actionType.UPDATE_ORDER_STATUS_SUCCESS,
                payload: orderRequest?.data,
            });
        }
        yield put({
            type: actionType.UPDATE_ORDER_STATUS_ERROR,
            payload: orderRequest.data,
        });

        return toast.error(getMessage(orderRequest.data?.message));
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.UPDATE_ORDER_STATUS_ERROR, payload: err });
    }
}

/**
 * Updates Job Order Status
 * 
 * @param action
 * @returns
 */
function* updateOrder(action: any): any {
    try {
        const { data: orderRequest } = yield call(
            updateOrderApi,
            action.payload
        );
        if (orderRequest?.success) {
            yield put({
                type: actionType.UPDATE_ORDER_SUCCESS,
                payload: orderRequest?.data,
            });

            return toast.success(getMessage(orderRequest?.data?.message));
        }
        yield put({
            type: actionType.UPDATE_ORDER_ERROR,
            payload: orderRequest.data,
        });

        return toast.error(getMessage(orderRequest.data?.message));
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.UPDATE_ORDER_ERROR, payload: err });
    }
}
