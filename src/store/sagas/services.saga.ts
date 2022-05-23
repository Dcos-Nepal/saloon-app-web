import { toast } from 'react-toastify';
import * as actionType from '../constants';
import { getMessage } from 'common/messages';
import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchServicesApi } from 'services/services.service';

/**
 * Saga Definitions
 */
export function* fetchServicesSaga(): any {
  yield takeEvery(actionType.FETCH_SERVICES, fetchServices);
}

/**
 * Generator functions for Saga
 */
function* fetchServices(action: any): any {
  try {
    const response = yield call(fetchServicesApi, action.payload);
    if (response.data?.data.success) {
      return yield put({
        type: actionType.FETCH_SERVICES_SUCCESS,
        payload: response.data.data
      });
    }

    yield put({ type: actionType.FETCH_SERVICES_ERROR, payload: response.data });
    return toast.error(getMessage(response.data.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.FETCH_SERVICES_ERROR, payload: err });
  }
}
