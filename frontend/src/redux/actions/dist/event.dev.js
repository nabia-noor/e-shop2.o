"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllEvents = exports.deleteEvent = exports.getAllEventsShop = exports.createevent = void 0;

var _axios = _interopRequireDefault(require("../../axios"));

var _server = require("../../server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// create event
var createevent = function createevent(data) {
  return function _callee(dispatch) {
    var _ref, d;

    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            dispatch({
              type: "eventCreateRequest"
            });
            _context.next = 4;
            return regeneratorRuntime.awrap(_axios["default"].post("".concat(_server.server, "/event/create-event"), data));

          case 4:
            _ref = _context.sent;
            d = _ref.d;
            dispatch({
              type: "eventCreateSuccess",
              payload: d.event
            });
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            dispatch({
              type: "eventCreateFail",
              payload: _context.t0.response.data.message
            });

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 9]]);
  };
}; // get all events of a shop


exports.createevent = createevent;

var getAllEventsShop = function getAllEventsShop(id) {
  return function _callee2(dispatch) {
    var _ref2, data;

    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            dispatch({
              type: "getAlleventsShopRequest"
            });
            _context2.next = 4;
            return regeneratorRuntime.awrap(_axios["default"].get("".concat(_server.server, "/event/get-all-events/").concat(id)));

          case 4:
            _ref2 = _context2.sent;
            data = _ref2.data;
            dispatch({
              type: "getAlleventsShopSuccess",
              payload: data.events
            });
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](0);
            dispatch({
              type: "getAlleventsShopFailed",
              payload: _context2.t0.response.data.message
            });

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 9]]);
  };
}; // delete event of a shop


exports.getAllEventsShop = getAllEventsShop;

var deleteEvent = function deleteEvent(id) {
  return function _callee3(dispatch) {
    var _ref3, data;

    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            dispatch({
              type: "deleteeventRequest"
            });
            _context3.next = 4;
            return regeneratorRuntime.awrap(_axios["default"]["delete"]("".concat(_server.server, "/event/delete-shop-event/").concat(id), {
              withCredentials: true
            }));

          case 4:
            _ref3 = _context3.sent;
            data = _ref3.data;
            dispatch({
              type: "deleteeventSuccess",
              payload: data.message
            });
            _context3.next = 12;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](0);
            dispatch({
              type: "deleteeventFailed",
              payload: _context3.t0.response.data.message
            });

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 9]]);
  };
}; // get all events


exports.deleteEvent = deleteEvent;

var getAllEvents = function getAllEvents() {
  return function _callee4(dispatch) {
    var _ref4, data;

    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            dispatch({
              type: "getAlleventsRequest"
            });
            _context4.next = 4;
            return regeneratorRuntime.awrap(_axios["default"].get("".concat(_server.server, "/event/get-all-events")));

          case 4:
            _ref4 = _context4.sent;
            data = _ref4.data;
            dispatch({
              type: "getAlleventsSuccess",
              payload: data.events
            });
            _context4.next = 12;
            break;

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4["catch"](0);
            dispatch({
              type: "getAlleventsFailed",
              payload: _context4.t0.response.data.message
            });

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[0, 9]]);
  };
};

exports.getAllEvents = getAllEvents;