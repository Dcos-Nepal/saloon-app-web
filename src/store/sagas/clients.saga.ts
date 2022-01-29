import { toast } from "react-toastify";
import * as actionType from "../constants";
import { getMessage } from "common/messages";
import { call, put, takeEvery } from "redux-saga/effects";
import { fetchUsersApi, addUserApi } from "services/users.service";

/**
 * Saga Definitions
 */
export function* fetchClientsSaga(): any {
  yield takeEvery(actionType.FETCH_CLIENTS, fetchClients);
}

/**
 * Generator functions for Saga
 */
function* fetchClients(action: any): any {
  try {
    const response = yield call(fetchUsersApi, action.payload);
    if (response.data?.data.success) {
      yield put({
        type: actionType.FETCH_CLIENTS_SUCCESS,
        payload: response.data.data,
      });
      return toast.success(getMessage(response.data.message));
    }

    yield put({ type: actionType.FETCH_CLIENTS_ERROR, payload: response.data });
    return toast.error(getMessage(response.data.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.FETCH_CLIENTS_ERROR, payload: err });
  }
}

export function* addClientSaga(): any {
  yield takeEvery(actionType.ADD_CLIENT, addClient);
}

function* addClient(action: any): any {
  try {
    const { data: newClient } = yield call(addUserApi, action.payload);
    if (newClient?.data?.success) {
      yield put({
        type: actionType.ADD_CLIENT_SUCCESS,
        payload: newClient?.data?.data,
      });

      return toast.success(getMessage(newClient?.data?.message));
    }
    yield put({
      type: actionType.ADD_CLIENT_ERROR,
      payload: newClient.data,
    });

    return toast.error(getMessage(newClient.data?.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.ADD_CLIENT_ERROR, payload: err });
  }
}
