import { toast } from 'react-toastify';
import * as actionType from '../constants';
import { getMessage } from 'common/messages';
import { call, put, takeEvery } from 'redux-saga/effects';
import { createQuotesApi, fetchQuotesApi, fetchJobQuoteApi, updateQuoteApi, updateQuoteStatusApi } from 'services/quotes.service';

/**
 * Saga Definitions
 */

export function* addQuoteSaga(): any {
    yield takeEvery(actionType.ADD_QUOTE, addQuote);
}

export function* fetchQuotesSaga(): any {
    yield takeEvery(actionType.FETCH_QUOTES, fetchQuotes);
}

export function* fetchQuoteSaga(): any {
    yield takeEvery(actionType.FETCH_QUOTE, fetchQuote);
}

export function* updateQuoteStatusSaga(): any {
    yield takeEvery(actionType.UPDATE_QUOTE_STATUS, updateQuoteStatus);
}

export function* updateQuoteSaga(): any {
    yield takeEvery(actionType.UPDATE_QUOTE, updateQuote);
}
/**
 * Generator functions for Saga
 */
function* fetchQuotes(action: any): any {
    try {
        const response = yield call(fetchQuotesApi, action.payload);
        if (response.data?.data.success) {
            yield put({ type: actionType.FETCH_QUOTES_SUCCESS, payload: response.data.data });
            return toast.success(getMessage(response.data.message))
        }

        yield put({ type: actionType.FETCH_QUOTES_ERROR, payload: response.data });
        return toast.error(getMessage(response.data.message));
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.FETCH_QUOTES_ERROR, payload: err });
    }
}

/**
 * Adds Job Quote
 * 
 * @param action
 * @returns
 */
function* addQuote(action: any): any {
    try {
        const { data: quoteRequest } = yield call(
            createQuotesApi,
            action.payload
        );
        if (quoteRequest?.data?.success) {
            yield put({
                type: actionType.ADD_QUOTE_SUCCESS,
                payload: quoteRequest?.data?.data,
            });

            return toast.success(getMessage(quoteRequest?.data?.message));
        }
        yield put({
            type: actionType.ADD_QUOTE_ERROR,
            payload: quoteRequest.data,
        });

        return toast.error(getMessage(quoteRequest.data?.message));
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.ADD_QUOTE_ERROR, payload: err });
    }
}

/**
 * Fetch Job Quote
 * 
 * @param action
 * @returns
 */
function* fetchQuote(action: any): any {
    try {
        const { data: quoteRequest } = yield call(
            fetchJobQuoteApi,
            action.payload
        );
        if (quoteRequest?.data?.success) {
            return yield put({
                type: actionType.FETCH_QUOTE_SUCCESS,
                payload: quoteRequest?.data?.data,
            });
        }
        yield put({
            type: actionType.FETCH_QUOTE_ERROR,
            payload: quoteRequest.data,
        });

        return toast.error(getMessage(quoteRequest.data?.message));
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.FETCH_QUOTE_ERROR, payload: err });
    }
}

/**
 * Updates Job Quote Status
 * 
 * @param action
 * @returns
 */
function* updateQuoteStatus(action: any): any {
    try {
        const { data: quoteRequest } = yield call(
            updateQuoteStatusApi,
            action.payload
        );
        if (quoteRequest?.data?.success) {
            return yield put({
                type: actionType.UPDATE_QUOTE_STATUS_SUCCESS,
                payload: quoteRequest?.data?.data,
            });
        }
        yield put({
            type: actionType.UPDATE_QUOTE_STATUS_ERROR,
            payload: quoteRequest.data,
        });

        return toast.error(getMessage(quoteRequest.data?.message));
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.UPDATE_QUOTE_STATUS_ERROR, payload: err });
    }
}

/**
 * Updates Job Quote Status
 * 
 * @param action
 * @returns
 */
function* updateQuote(action: any): any {
    try {
        const { data: quoteRequest } = yield call(
            updateQuoteApi,
            action.payload
        );
        if (quoteRequest?.data?.success) {
            yield put({
                type: actionType.UPDATE_QUOTE_SUCCESS,
                payload: quoteRequest?.data?.data,
            });

            return toast.success(getMessage(quoteRequest?.data?.message));
        }
        yield put({
            type: actionType.UPDATE_QUOTE_ERROR,
            payload: quoteRequest.data,
        });

        return toast.error(getMessage(quoteRequest.data?.message));
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.UPDATE_QUOTE_ERROR, payload: err });
    }
}
