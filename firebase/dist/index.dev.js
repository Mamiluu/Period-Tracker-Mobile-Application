"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.firestore = exports.auth = exports.resendVerificationEmail = exports.logoutUser = exports.getCurrentUser = exports.loginUser = exports.registerUser = void 0;

var _app = _interopRequireDefault(require("firebase/compat/app"));

require("firebase/compat/auth");

require("firebase/compat/firestore");

require("firebase/compat/storage");

var _asyncStorage = _interopRequireDefault(require("@react-native-async-storage/async-storage"));

var _auth2 = require("firebase/auth");

var _firestore2 = require("firebase/firestore");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// Firebase configuration - replace with your Firebase project's settings
var firebaseConfig = {
  apiKey: "AIzaSyDCyXIxCTVUg47CnbH-L7sceZ9lPG8oKVA",
  authDomain: "tracker-eed94.firebaseapp.com",
  projectId: "tracker-eed94",
  storageBucket: "tracker-eed94.appspot.com",
  messagingSenderId: "1082875479231",
  appId: "1:1082875479231:web:e8f72d1a300bd925e5f20a",
  measurementId: "G-JTTCJGC69C"
}; // Initialize Firebase app if not already initialized

if (!_app["default"].apps.length) {
  _app["default"].initializeApp(firebaseConfig);
} // Initialize Firestore


var firestore = (0, _firestore2.getFirestore)(); // Initialize Firebase Auth with AsyncStorage for persistence

exports.firestore = firestore;
var auth = (0, _auth2.initializeAuth)(_app["default"].app(), {
  persistence: (0, _auth2.getReactNativePersistence)(_asyncStorage["default"])
}); // Function to create a new user account, store user data in Firestore, and send verification email

exports.auth = auth;

var registerUser = function registerUser(_ref) {
  var name, email, password, type, additionalData, userCredential, user;
  return regeneratorRuntime.async(function registerUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          name = _ref.name, email = _ref.email, password = _ref.password, type = _ref.type, additionalData = _objectWithoutProperties(_ref, ["name", "email", "password", "type"]);
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap((0, _auth2.createUserWithEmailAndPassword)(auth, email, password));

        case 4:
          userCredential = _context.sent;
          user = userCredential.user; // Store user data in Firestore

          _context.next = 8;
          return regeneratorRuntime.awrap((0, _firestore2.setDoc)((0, _firestore2.doc)(firestore, 'users', user.uid), _objectSpread({
            name: name,
            email: email,
            type: type
          }, additionalData, {
            createdAt: (0, _firestore2.serverTimestamp)()
          })));

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap((0, _auth2.sendEmailVerification)(user));

        case 10:
          return _context.abrupt("return", {
            success: true,
            user: user
          });

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](1);
          console.error('Error registering user:', _context.t0.message);
          return _context.abrupt("return", {
            success: false,
            message: _context.t0.message
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 13]]);
}; // Function to log in an existing user with email verification check


exports.registerUser = registerUser;

var loginUser = function loginUser(email, password) {
  var userCredential, user;
  return regeneratorRuntime.async(function loginUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap((0, _auth2.signInWithEmailAndPassword)(auth, email, password));

        case 3:
          userCredential = _context2.sent;
          user = userCredential.user; // Check if email is verified

          if (user.emailVerified) {
            _context2.next = 7;
            break;
          }

          throw new Error('Email not verified. Please check your email to verify your account.');

        case 7:
          return _context2.abrupt("return", {
            success: true,
            user: user
          });

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error('Error logging in user:', _context2.t0.message);
          return _context2.abrupt("return", {
            success: false,
            message: _context2.t0.message
          });

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; // Function to get the current user info


exports.loginUser = loginUser;

var getCurrentUser = function getCurrentUser() {
  return auth.currentUser;
}; // Function to log out the current user


exports.getCurrentUser = getCurrentUser;

var logoutUser = function logoutUser() {
  return regeneratorRuntime.async(function logoutUser$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(auth.signOut());

        case 3:
          return _context3.abrupt("return", {
            success: true
          });

        case 6:
          _context3.prev = 6;
          _context3.t0 = _context3["catch"](0);
          console.error('Error logging out:', _context3.t0.message);
          return _context3.abrupt("return", {
            success: false,
            message: _context3.t0.message
          });

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 6]]);
}; // Function to resend verification email if needed


exports.logoutUser = logoutUser;

var resendVerificationEmail = function resendVerificationEmail() {
  var user;
  return regeneratorRuntime.async(function resendVerificationEmail$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          user = auth.currentUser;

          if (!(user && !user.emailVerified)) {
            _context4.next = 14;
            break;
          }

          _context4.prev = 2;
          _context4.next = 5;
          return regeneratorRuntime.awrap((0, _auth2.sendEmailVerification)(user));

        case 5:
          return _context4.abrupt("return", {
            success: true,
            message: 'Verification email resent. Please check your inbox.'
          });

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](2);
          console.error('Error resending verification email:', _context4.t0.message);
          return _context4.abrupt("return", {
            success: false,
            message: _context4.t0.message
          });

        case 12:
          _context4.next = 15;
          break;

        case 14:
          return _context4.abrupt("return", {
            success: false,
            message: 'User is either not logged in or already verified.'
          });

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 8]]);
}; // Export auth and firestore for use in other parts of the app


exports.resendVerificationEmail = resendVerificationEmail;
//# sourceMappingURL=index.dev.js.map
