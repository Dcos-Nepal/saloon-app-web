import { toast } from 'react-toastify';
import * as actionType from '../constants';
import { getMessage } from 'common/messages';
import { call, put, takeEvery} from 'redux-saga/effects';
import { fetchUsersApi } from 'services/users.service';

/**
 * Saga Definitions
 */
export function* fetchWorkersSaga(): any {
    yield takeEvery(actionType.FETCH_WORKERS, fetchWorkers);
}

/**
 * Generator functions for Saga
 */
function* fetchWorkers(action: any): any {
    try {
        const response = yield call(fetchUsersApi, action.payload);
        if (response.data?.data.success) {
            yield put({ type: actionType.FETCH_WORKERS_SUCCESS, payload: response.data.data});
            return toast.success(getMessage(response.data.message))
        }

        yield put({ type: actionType.FETCH_WORKERS_ERROR, payload: response.data });
        return toast.error(getMessage(response.data.message));
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.FETCH_WORKERS_ERROR, payload: err });
    }
}
