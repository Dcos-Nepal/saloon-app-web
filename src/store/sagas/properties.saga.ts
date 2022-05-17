import { toast } from 'react-toastify';
import * as actionType from '../constants';
import { getMessage } from 'common/messages';
import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchPropertiesApi, addPropertyApi, updatePropertyApi, fetchPropertyApi } from 'services/properties.service';

/**
 * Saga Definitions
 */
export function* fetchPropertiesSaga(): any {
  yield takeEvery(actionType.FETCH_PROPERTIES, fetchProperties);
}

/**
 * Generator functions for Saga
 */
function* fetchProperties(action: any): any {
  try {
    const response = yield call(fetchPropertiesApi, action.payload);
    if (response.data?.data.success) {
      return yield put({
        type: actionType.FETCH_PROPERTIES_SUCCESS,
        payload: response.data.data?.data?.rows
      });
    }

    yield put({ type: actionType.FETCH_PROPERTIES_ERROR, payload: response.data });
    return toast.error(getMessage(response.data.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.FETCH_PROPERTIES_ERROR, payload: err });
  }
}

export function* addPropertySaga(): any {
  yield takeEvery(actionType.ADD_PROPERTY, addProperty);
}

function* addProperty(action: any): any {
  try {
    const { data: newProperty } = yield call(addPropertyApi, action.payload);
    if (newProperty?.data?.success) {
      yield put({
        type: actionType.ADD_PROPERTY_SUCCESS,
        payload: newProperty?.data?.data
      });

      return toast.success(getMessage(newProperty?.data?.message));
    }
    yield put({
      type: actionType.ADD_PROPERTY_ERROR,
      payload: newProperty.data
    });

    return toast.error(getMessage(newProperty.data?.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.ADD_PROPERTY_ERROR, payload: err });
  }
}

export function* fetchPropertySaga(): any {
  yield takeEvery(actionType.FETCH_PROPERTY, fetchProperty);
}

function* fetchProperty(action: any): any {
  try {
    const { data: newProperty } = yield call(fetchPropertyApi, action.payload);
    if (newProperty?.data?.success) {
      return yield put({
        type: actionType.FETCH_PROPERTY_SUCCESS,
        payload: newProperty?.data?.data
      });
    }
    yield put({
      type: actionType.FETCH_PROPERTY_ERROR,
      payload: newProperty.data
    });

    return toast.error(getMessage(newProperty.data?.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.FETCH_PROPERTY_ERROR, payload: err });
  }
}

export function* updatePropertySaga(): any {
  yield takeEvery(actionType.UPDATE_PROPERTY, updateProperty);
}

function* updateProperty(action: any): any {
  try {
    const { data: newProperty } = yield call(updatePropertyApi, action.payload);
    if (newProperty?.data?.success) {
      yield put({
        type: actionType.UPDATE_PROPERTY_SUCCESS,
        payload: newProperty?.data?.data
      });

      return toast.success(getMessage(newProperty?.data?.message));
    }
    yield put({
      type: actionType.UPDATE_PROPERTY_ERROR,
      payload: newProperty.data
    });

    return toast.error(getMessage(newProperty.data?.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.UPDATE_PROPERTY_ERROR, payload: err });
  }
}
