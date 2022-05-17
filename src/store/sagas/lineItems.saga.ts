import { toast } from 'react-toastify';
import * as actionType from '../constants';
import { getMessage } from 'common/messages';
import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchLineItemsApi, addLineItemApi, updateLineItemApi, fetchLineItemApi } from 'services/lineItems.service';

/**
 * Saga Definitions
 */
export function* fetchLineItemsSaga(): any {
  yield takeEvery(actionType.FETCH_LINE_ITEMS, fetchLineItems);
}

/**
 * Generator functions for Saga
 */
function* fetchLineItems(action: any): any {
  try {
    const response = yield call(fetchLineItemsApi, action.payload);
    if (response.data?.data.success) {
      return yield put({
        type: actionType.FETCH_LINE_ITEMS_SUCCESS,
        payload: response.data.data
      });
    }

    yield put({ type: actionType.FETCH_LINE_ITEMS_ERROR, payload: response.data });
    return toast.error(getMessage(response.data.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.FETCH_LINE_ITEMS_ERROR, payload: err });
  }
}

export function* addLineItemSaga(): any {
  yield takeEvery(actionType.ADD_LINE_ITEM, addLineItem);
}

function* addLineItem(action: any): any {
  try {
    const { data: newLineItem } = yield call(addLineItemApi, action.payload);
    if (newLineItem?.data?.success) {
      yield put({
        type: actionType.ADD_LINE_ITEM_SUCCESS,
        payload: newLineItem?.data?.data
      });

      return toast.success(getMessage(newLineItem?.data?.message));
    }
    yield put({
      type: actionType.ADD_LINE_ITEM_ERROR,
      payload: newLineItem.data
    });

    return toast.error(getMessage(newLineItem.data?.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.ADD_LINE_ITEM_ERROR, payload: err });
  }
}

export function* fetchLineItemSaga(): any {
  yield takeEvery(actionType.FETCH_LINE_ITEM, fetchLineItem);
}

function* fetchLineItem(action: any): any {
  try {
    const { data: newLineItem } = yield call(fetchLineItemApi, action.payload);
    if (newLineItem?.data?.success) {
      return yield put({
        type: actionType.FETCH_LINE_ITEM_SUCCESS,
        payload: newLineItem?.data?.data
      });
    }

    yield put({
      type: actionType.FETCH_LINE_ITEM_ERROR,
      payload: newLineItem.data
    });

    return toast.error(getMessage(newLineItem.data?.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.FETCH_LINE_ITEM_ERROR, payload: err });
  }
}

export function* updateLineItemSaga(): any {
  yield takeEvery(actionType.UPDATE_LINE_ITEM, updateLineItem);
}

function* updateLineItem(action: any): any {
  try {
    const { data: newLineItem } = yield call(updateLineItemApi, action.payload);
    if (newLineItem?.data?.success) {
      yield put({
        type: actionType.UPDATE_LINE_ITEM_SUCCESS,
        payload: newLineItem?.data?.data
      });

      return toast.success(getMessage(newLineItem?.data?.message));
    }
    yield put({
      type: actionType.UPDATE_LINE_ITEM_ERROR,
      payload: newLineItem.data
    });

    return toast.error(getMessage(newLineItem.data?.message));
  } catch (err: any) {
    if (err.exception) toast.error(err.exception.message);
    yield put({ type: actionType.UPDATE_LINE_ITEM_ERROR, payload: err });
  }
}
