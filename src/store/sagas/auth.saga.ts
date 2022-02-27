import { toast } from 'react-toastify';
import * as actionType from '../constants';
import { getMessage } from 'common/messages';
import { call, put, takeEvery} from 'redux-saga/effects';
import { verifyEmailApi } from 'services/auth.service';

/**
 * Saga Definitions
 */
export function* verifyUserEmailSaga() {
    yield takeEvery(actionType.AUTH_EMAIL_VERIFY, verifyUserEmail);
}

/**
 * Generator functions for Saga
 */

function* verifyUserEmail(action: any): any {
    try {
        const response = yield call(verifyEmailApi, action.payload);

        if (response.data.success) {
            yield put({ type: actionType.AUTH_EMAIL_VERIFY_SUCCESS, payload: response.data});
            return toast.success(getMessage(response.data.message))
        }

        yield put({ type: actionType.AUTH_EMAIL_VERIFY_ERROR, payload: response.data });
        return toast.error(getMessage(response.data.message));
    } catch (err: any) {
        if (err.exception) toast.error(err.exception.message);
        yield put({ type: actionType.AUTH_EMAIL_VERIFY_ERROR, payload: err });
    }
}
