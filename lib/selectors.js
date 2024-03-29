'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectCollection = selectCollection;
exports.selectRecord = selectRecord;
exports.selectRecordOrEmptyObject = selectRecordOrEmptyObject;
exports.selectActionStatus = selectActionStatus;

var _immutable = require('immutable');

var recentTimeInterval = 10 * 60 * 1000; // ten minutes

/*
 * Returns false if:
 *  - fetchTime is more than 10 minutes ago
 *  - fetchTime is null (hasn't been set yet)
 *  - fetchTime is 0 (but note, this won't return NEEDS_FETCH)
 */
function recent(fetchTime) {
  if (fetchTime === null) return false;

  return Date.now() - recentTimeInterval < fetchTime;
}

function selectCollection(modelName, crud) {
  var params = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var isLoading = function isLoading(_ref) {
    var needsFetch = _ref.needsFetch;
    return {
      other_info: {},
      data: [],
      isLoading: true,
      needsFetch: needsFetch
    };
  };

  var model = crud.getIn([modelName], (0, _immutable.Map)());

  // find the collection that has the same params
  var paramsJson = JSON.stringify(params);
  var collection = model.get('collections', (0, _immutable.List)()).find(function (coll) {
    return JSON.stringify(coll.get('params').toJS()) === paramsJson;
  });
  if (collection === undefined) {
    return isLoading({ needsFetch: true });
  }

  var fetchTime = collection.get('fetchTime');
  if (fetchTime === 0) {
    return isLoading({ needsFetch: false });
  } else if (!recent(fetchTime)) {
    return isLoading({ needsFetch: true });
  }

  // search the records to ensure they're all recent
  // TODO can we make this faster?
  var itemNeedsFetch = null;
  collection.get('ids', (0, _immutable.fromJS)([])).forEach(function (id) {
    var item = model.getIn(['byId', id.toString()]);
    if (!recent(item.get('fetchTime'))) {
      itemNeedsFetch = item;
      return false;
    }
  });
  if (itemNeedsFetch) {
    if (itemNeedsFetch.get('fetchTime') === 0) {
      return isLoading({ needsFetch: false });
    }
    return isLoading({ needsFetch: true });
  }

  var data = collection.get('ids', (0, _immutable.fromJS)([])).map(function (id) {
    return model.getIn(['byId', id.toString(), 'record']);
  }).toJS();

  return {
    other_info: collection.get('other_info', (0, _immutable.Map)()).toJS(),
    data: data,
    isLoading: false,
    needsFetch: false
  };
}

function selectRecord(modelName, id, crud) {
  var id_str = id ? id.toString() : undefined;
  var model = crud.getIn([modelName, 'byId', id_str]);

  if (model && model.get('fetchTime') === 0) {
    return { isLoading: true, needsFetch: false, error: { message: 'Loading...' } };
  }
  if (id === undefined || model === undefined || !recent(model.get('fetchTime'))) {
    return { isLoading: true, needsFetch: true, error: { message: 'Loading...' } };
  }

  if (model.get('error') !== null) {
    return {
      isLoading: false,
      needsFetch: false,
      error: model.get('error').toJS()
    };
  }
  return model.get('record').toJS();
}

function selectRecordOrEmptyObject(modelName, id, crud) {
  var record = selectRecord(modelName, id, crud);
  if (record.isLoading || record.error) {
    return {};
  }
  return record;
}

function selectActionStatus(modelName, crud, action) {
  var status = crud.getIn([modelName, 'actionStatus', action]) || (0, _immutable.fromJS)({ pending: false, isSuccess: null, message: null,
    errors: {}, id: null });
  return status.toJS();
}