import { toast } from 'react-toastify';
import * as actionType from '../constants';
import { getMessage } from 'common/messages';
import { call, put, takeEvery } from 'redux-saga/effects';
import { createInvoiceApi, fetchInvoicesApi, fetchInvoiceApi, updateInvoiceApi } from 'services/invoice.service';

/**
 * Saga Definitions
 */

export function* addInvoiceSaga(): any {
    yield takeEvery(actionType.ADD_INVOICE, addInvoice);
}

export function* fetchInvoicesSaga(): any {
    yield takeEvery(actionType.FETCH_INVOICES, fetchInvoices);
}

export function* fetchInvoiceSaga(): any {
    yield takeEvery(actionType.FETCH_INVOICE, fetchInvoice);
}

export function* updateInvoiceSaga(): any {
    yield takeEvery(actionType.UPDATE_INVOICE, updateInvoice);
}
/**
 * Generator functions for Saga
 */
function* fetchInvoices(action: any): any {
    try {
        const response = yield call(fetchInvoicesApi, action.payload);
        if (response.data?.data.success) {
            yield put({ type: actionType.FETCH_INVOICES_SUCCESS, payload: response.data.data });
            return toast.success(getMessage(response.data.message))
        }

        yield put({ type: actionType.FETCH_INVOICES_ERROR, payload: response.data });
        return toast.error(getMessage(response.data.message));
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.FETCH_INVOICES_ERROR, payload: err });
    }
}

/**
 * Adds Job Invoice
 *
 * @param action
 * @returns
 */
function* addInvoice(action: any): any {
    try {
        const { data: invoiceRequest } = yield call(
            createInvoiceApi,
            action.payload
        );
        if (invoiceRequest?.data?.success) {
            yield put({
                type: actionType.ADD_INVOICE_SUCCESS,
                payload: invoiceRequest?.data?.data,
            });

            return toast.success(getMessage(invoiceRequest?.data?.message));
        }
        yield put({
            type: actionType.ADD_INVOICE_ERROR,
            payload: invoiceRequest.data,
        });

        return toast.error(getMessage(invoiceRequest.data?.message));
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.ADD_INVOICE_ERROR, payload: err });
    }
}

/**
 * Fetch Job Invoice
 *
 * @param action
 * @returns
 */
function* fetchInvoice(action: any): any {
    try {
        const { data: invoiceRequest } = yield call(
            fetchInvoiceApi,
            action.payload
        );
        if (invoiceRequest?.success) {
            return yield put({
                type: actionType.FETCH_INVOICE_SUCCESS,
                payload: invoiceRequest.data,
            });
        }
        yield put({
            type: actionType.FETCH_INVOICE_ERROR,
            payload: invoiceRequest.data,
        });

        return toast.error(getMessage(invoiceRequest.data?.message));
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.FETCH_INVOICE_ERROR, payload: err });
    }
}

/**
 * Updates Job Invoice
 *
 * @param action
 * @returns
 */
function* updateInvoice(action: any): any {
    try {
        const { data: invoiceRequest } = yield call(
            updateInvoiceApi,
            action.payload
        );
        if (invoiceRequest?.data?.success) {
            yield put({
                type: actionType.UPDATE_INVOICE_SUCCESS,
                payload: invoiceRequest?.data?.data,
            });

            return toast.success(getMessage(invoiceRequest?.data?.message));
        }
        yield put({
            type: actionType.UPDATE_INVOICE_ERROR,
            payload: invoiceRequest.data,
        });

        return toast.error(getMessage(invoiceRequest.data?.message));
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.UPDATE_INVOICE_ERROR, payload: err });
    }
}
