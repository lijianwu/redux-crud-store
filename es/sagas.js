'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = crudSaga;

require('babel-polyfill');

var _reduxSaga = require('redux-saga');

var _effects = require('redux-saga/effects');

var _actionTypes = require('./actionTypes');

var apiGeneric = function apiGeneric(apiClient) {
  return regeneratorRuntime.mark(function _apiGeneric(action) {
    var _action$payload, method, path, params, data, _action$meta, success, failure, response;

    return regeneratorRuntime.wrap(function _apiGeneric$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _action$payload = action.payload;
            method = _action$payload.method;
            path = _action$payload.path;
            params = _action$payload.params;
            data = _action$payload.data;
            _action$meta = action.meta;
            success = _action$meta.success;
            failure = _action$meta.failure;


            action.meta.fetchTime = Date.now();

            _context.prev = 9;
            _context.next = 12;
            return (0, _effects.call)(apiClient[method], path, { params: params, data: data });

          case 12:
            response = _context.sent;
            _context.next = 15;
            return (0, _effects.put)(_extends({}, action, { type: success, payload: response }));

          case 15:
            _context.next = 21;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context['catch'](9);
            _context.next = 21;
            return (0, _effects.put)(_extends({}, action, { type: failure, payload: _context.t0, error: true }));

          case 21:
          case 'end':
            return _context.stop();
        }
      }
    }, _apiGeneric, this, [[9, 17]]);
  });
};

var watchFetch = function watchFetch(apiClient) {
  return regeneratorRuntime.mark(function _watchFetch() {
    return regeneratorRuntime.wrap(function _watchFetch$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.delegateYield((0, _reduxSaga.takeEvery)(_actionTypes.FETCH, apiGeneric(apiClient)), 't0', 1);

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _watchFetch, this);
  });
};

var watchFetchOne = function watchFetchOne(apiClient) {
  return regeneratorRuntime.mark(function _watchFetchOne() {
    return regeneratorRuntime.wrap(function _watchFetchOne$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.delegateYield((0, _reduxSaga.takeEvery)(_actionTypes.FETCH_ONE, apiGeneric(apiClient)), 't0', 1);

          case 1:
          case 'end':
            return _context3.stop();
        }
      }
    }, _watchFetchOne, this);
  });
};

var watchCreate = function watchCreate(apiClient) {
  return regeneratorRuntime.mark(function _watchCreate() {
    return regeneratorRuntime.wrap(function _watchCreate$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.delegateYield((0, _reduxSaga.takeEvery)(_actionTypes.CREATE, apiGeneric(apiClient)), 't0', 1);

          case 1:
          case 'end':
            return _context4.stop();
        }
      }
    }, _watchCreate, this);
  });
};

var watchUpdate = function watchUpdate(apiClient) {
  return regeneratorRuntime.mark(function _watchUpdate() {
    return regeneratorRuntime.wrap(function _watchUpdate$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.delegateYield((0, _reduxSaga.takeEvery)(_actionTypes.UPDATE, apiGeneric(apiClient)), 't0', 1);

          case 1:
          case 'end':
            return _context5.stop();
        }
      }
    }, _watchUpdate, this);
  });
};

var watchDelete = function watchDelete(apiClient) {
  return regeneratorRuntime.mark(function _watchDelete() {
    return regeneratorRuntime.wrap(function _watchDelete$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            return _context6.delegateYield((0, _reduxSaga.takeEvery)(_actionTypes.DELETE, apiGeneric(apiClient)), 't0', 1);

          case 1:
          case 'end':
            return _context6.stop();
        }
      }
    }, _watchDelete, this);
  });
};

var watchApiCall = function watchApiCall(apiClient) {
  return regeneratorRuntime.mark(function _watchApiCall() {
    return regeneratorRuntime.wrap(function _watchApiCall$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            return _context7.delegateYield((0, _reduxSaga.takeEvery)(_actionTypes.API_CALL, apiGeneric(apiClient)), 't0', 1);

          case 1:
          case 'end':
            return _context7.stop();
        }
      }
    }, _watchApiCall, this);
  });
};

function crudSaga(apiClient) {
  return regeneratorRuntime.mark(function _crudSaga() {
    return regeneratorRuntime.wrap(function _crudSaga$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return [(0, _effects.fork)(watchFetch(apiClient)), (0, _effects.fork)(watchFetchOne(apiClient)), (0, _effects.fork)(watchCreate(apiClient)), (0, _effects.fork)(watchUpdate(apiClient)), (0, _effects.fork)(watchDelete(apiClient)), (0, _effects.fork)(watchApiCall(apiClient))];

          case 2:
          case 'end':
            return _context8.stop();
        }
      }
    }, _crudSaga, this);
  });
}