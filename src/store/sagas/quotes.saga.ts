import { toast } from 'react-toastify';
import * as actionType from '../constants';
import { getMessage } from 'common/messages';
import { call, put, takeEvery} from 'redux-saga/effects';
import { fetchQuotesApi } from 'services/quotes.service';

/**
 * Saga Definitions
 */
export function* fetchQuotesSaga(): any {
    yield takeEvery(actionType.FETCH_QUOTES, fetchQuotes);
}

/**
 * Generator functions for Saga
 */
function* fetchQuotes(action: any): any {
    try {
        const response = yield call(fetchQuotesApi, action.payload);
        if (response.data?.data.success) {
            yield put({ type: actionType.FETCH_QUOTES_SUCCESS, payload: response.data.data});
            return toast.success(getMessage(response.data.message))
        }

        yield put({ type: actionType.FETCH_QUOTES_ERROR, payload: response.data });
        return toast.error(getMessage(response.data.message));
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.FETCH_QUOTES_ERROR, payload: err });
    }
}
