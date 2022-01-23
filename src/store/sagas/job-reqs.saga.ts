import { toast } from 'react-toastify';
import * as actionType from '../constants';
import { getMessage } from 'common/messages';
import { call, put, takeEvery} from 'redux-saga/effects';
import { fetchJobRequestsApi } from 'services/job-requests.service';

/**
 * Saga Definitions
 */
export function* fetchJobRequestsSaga(): any {
    yield takeEvery(actionType.FETCH_JOB_REQUESTS, fetchJobRequests);
}

/**
 * Generator functions for Saga
 */
function* fetchJobRequests(action: any): any {
    try {
        const response = yield call(fetchJobRequestsApi, action.payload);
        if (response.data?.data.success) {
            yield put({ type: actionType.FETCH_JOB_REQUESTS_SUCCESS, payload: response.data.data});
            return toast.success(getMessage(response.data.message))
        }

        yield put({ type: actionType.FETCH_JOB_REQUESTS_ERROR, payload: response.data });
        return toast.error(getMessage(response.data.message));
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.FETCH_JOB_REQUESTS_ERROR, payload: err });
    }
}
