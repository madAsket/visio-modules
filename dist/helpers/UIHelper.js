"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jquery = require("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

var _nodeWaves = require("node-waves");

var _nodeWaves2 = _interopRequireDefault(_nodeWaves);

var _autosize = require("autosize");

var _autosize2 = _interopRequireDefault(_autosize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('malihu-custom-scrollbar-plugin')(_jquery2.default);

exports.default = {
    detectMobile: function detectMobile() {
        /*
         * Detect Mobile Browser
         */
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            (0, _jquery2.default)('html').addClass('ismobile');
        }
    },

    alerts: {
        _showAlert: function _showAlert() {
            var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "info";
            var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : i18n.trans("Warning");
            var text = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
            var confirmText = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : i18n.trans("Yes");
            var cancelText = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : i18n.trans("No");
            var showCancelBtn = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
            var confirmCallback = arguments[6];
            var cancelCallback = arguments[7];

            swal({
                title: title,
                text: text,
                type: type,
                showCancelButton: showCancelBtn,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: confirmText,
                cancelButtonText: cancelText,
                html: true,
                closeOnConfirm: true,
                closeOnCancel: true
            }, function (isConfirm) {
                if (isConfirm) {
                    //TODO deffered for callback and closing popups;
                    if (confirmCallback) {
                        confirmCallback();
                        // swal("Done", "", "success");
                    }
                } else {
                    if (cancelCallback) {
                        cancelCallback();
                    }
                }
            });
        },
        showInfoAlert: function showInfoAlert(title, text) {
            this._showAlert.apply(this, ["info", title, text, "Ok",, false]);
        },
        showWarningAlert: function showWarningAlert(title, text) {
            this._showAlert.apply(this, ["warning", title, text, "Ok",, false]);
        },
        showErrorAlert: function showErrorAlert(title, text) {
            this._showAlert.apply(this, ["error", title, text, "Ok",, false]);
        },
        showConfirmationAlert: function showConfirmationAlert(title, text, confirmCallback, cancelCallback) {
            this._showAlert.apply(this, ["warning", title, text, i18n.trans("Continue"), i18n.trans("Cancel"), true, confirmCallback, cancelCallback]);
        }
    },
    preloader: {
        init: function init() {
            var self = this;
            (0, _jquery2.default)('body').append('<div class="page-loader" id="pageLoader" style="display:none;">' + '<div class="preloader pls-teal">' + '<svg class="pl-circular" viewBox="25 25 50 50">' + '<circle class="plc-path" cx="50" cy="50" r="20" />' + '</svg>' + '<p>' + i18n.trans("Loading") + '...</p>' + '</div>' + '</div>');
            this.pageloader = (0, _jquery2.default)('#pageLoader');
            this.silent = false;
            (0, _jquery2.default)(document).ajaxStart(function () {
                self._show();
            });
            (0, _jquery2.default)(document).ajaxStop(function () {
                self._hide();
            });
            window.onerror = function () {
                _jquery2.default.active = 0;
                self._hide();
            };
            (0, _jquery2.default)(document).ajaxError(function () {
                self._hide();
            });
        },
        _show: function _show() {
            if (!this.silent && this.pageloader.is(":hidden")) this.pageloader.fadeIn('fast');
        },
        _hide: function _hide() {
            if (!this.pageloader.is(":hidden")) this.pageloader.fadeOut('fast');
        }
    },
    scrollBar: function scrollBar(selector) {
        var theme = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'minimal-dark';
        var mousewheelaxis = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'y';

        selector.mCustomScrollbar({
            theme: theme,
            scrollInertia: 100,
            axis: 'yx',
            mouseWheel: {
                enable: true,
                axis: mousewheelaxis,
                preventDefault: true
            },
            advanced: {
                autoScrollOnFocus: false,
                updateOnContentResize: true,
                updateOnSelectorChange: true
            }
        });
    },
    updateScrollbar: function updateScrollbar(selector) {
        if (selector.mCustomScrollbar) {
            try {
                selector.mCustomScrollbar('update');
            } catch (e) {
                console.log(e);
            }
        }
    },
    initCollapse: function initCollapse(collapseSelector) {
        collapseSelector.on('show.bs.collapse', function (e) {
            (0, _jquery2.default)(this).closest('.panel').find('.panel-heading').addClass('active');
        });

        collapseSelector.on('hide.bs.collapse', function (e) {
            (0, _jquery2.default)(this).closest('.panel').find('.panel-heading').removeClass('active');
        });
        //Add active class for pre opened items
        collapseSelector.filter('.in').each(function () {
            (0, _jquery2.default)(this).closest('.panel').find('.panel-heading').addClass('active');
        });
    },
    smartSelect: function smartSelect(selector) {
        selector.chosen({
            width: '100%',
            allow_single_deselect: true,
            placeholder_text_multiple: "Select"
        });
    },
    initAutosize: function initAutosize() {
        (0, _autosize2.default)((0, _jquery2.default)('.auto-size'));
    },
    initTooltips: function initTooltips(selector) {
        var tooltipItems = selector.find('[data-toggle="tooltip"]');
        if (tooltipItems.length > 0) tooltipItems.tooltip();
    },
    initIEPlaceholder: function initIEPlaceholder(selector) {
        if ((0, _jquery2.default)('html').hasClass('ie9')) {
            selector.find('input, textarea').placeholder({
                customClass: 'ie9-placeholder'
            });
        }
    },
    initFGLines: function initFGLines(selector) {
        selector.find('.fg-line .form-control').focus(function () {
            (0, _jquery2.default)(this).closest('.fg-line').addClass('fg-toggled');
        });
        selector.find('.form-control').blur(function () {
            var p = (0, _jquery2.default)(this).closest('.form-group, .input-group');
            var i = p.find('.form-control').val();
            if (p.hasClass('fg-float')) {
                if (i.length == 0) {
                    (0, _jquery2.default)(this).closest('.fg-line').removeClass('fg-toggled');
                }
            } else {
                (0, _jquery2.default)(this).closest('.fg-line').removeClass('fg-toggled');
            }
        });
    },
    initWaves: function initWaves() {
        (function () {
            _nodeWaves2.default.attach('.btn:not(.btn-icon):not(.btn-float)');
            _nodeWaves2.default.attach('.btn-icon, .btn-float', ['waves-circle', 'waves-float']);
            _nodeWaves2.default.init();
        })();
    },
    initDropdown: function initDropdown(selector) {
        var dropdownLinks = selector.find('.dropdown-menu a');
        if (dropdownLinks.length > 0) {
            dropdownLinks.click(function () {
                var dd = (0, _jquery2.default)(this);
                //hardcode if has event;
                if (dd.attr("href") == "#") {
                    dd.parent().parent().parent().removeClass('open');
                }
            });
        }
    }
};