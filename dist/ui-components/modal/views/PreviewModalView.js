"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _marionette = require("marionette");

var MN = _interopRequireWildcard(_marionette);

var _preview = require("../templates/preview.tpl");

var _preview2 = _interopRequireDefault(_preview);

var _ModalBehavior = require("../behaviors/ModalBehavior");

var _ModalBehavior2 = _interopRequireDefault(_ModalBehavior);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = MN.LayoutView.extend({
    template: _preview2.default,
    className: "modal",
    behaviors: {
        ModalBehavior: {
            behaviorClass: _ModalBehavior2.default
        }
    }
});