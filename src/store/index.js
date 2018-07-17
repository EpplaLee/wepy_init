import promiseMiddleware from 'redux-promise'
import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware, { effects as Effects } from 'redux-saga';
//import * as Effects from 'redux-saga/effects';


function rootReducer(state = {}, action) {
  switch (action.type) {
    case 'save':
      return Object.assign({}, state, action.payload || {})
    case 'switchTab':
      return {
        ...state,
        showTab: !state.showTab
      }
    default:
      return state;
  }
}

const sagas = {
}

export default function configStore() {
  const middleware = createSagaMiddleware()
  const store = createStore(rootReducer,
    applyMiddleware(
      middleware,
      //promiseMiddleware,
    )
  );
  middleware.run(function*(action) {
    for (const name in sagas) {
      try {
        yield Effects.fork(Effects.takeEvery, name, function*(action) {
          try {
            if (action) {
              action.store = store;
            } else {
              action = { store };
            }
            if (action.loading) {
              wx.showLoading({
                title: typeof action.loading == "string" ? action.loading : '加载中...'
              })
            }
            yield sagas[name](action, Effects);
            if (action.loading) {
              wx.hideLoading()
            }
          } catch (err) {
            if (action.loading) {
              wx.hideLoading()
            }
            console.error('catch error in takeEvery', err);
          }
        });
      } catch (err) {
        console.error('catch error in fork', err);
      }
    }
  });
  return store
};
