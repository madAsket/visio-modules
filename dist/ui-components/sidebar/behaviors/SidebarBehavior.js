'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _marionette = require('marionette');

var MN = _interopRequireWildcard(_marionette);

var _app = require('app');

var _app2 = _interopRequireDefault(_app);

var _UIHelper = require('../../../helpers/UIHelper');

var _UIHelper2 = _interopRequireDefault(_UIHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//li.sub-menu.toggled - icon +/- state
//li.sub-menu.active - collapsed
//li.sub-menu a.active - selected
//a.active - selected

exports.default = MN.Behavior.extend({
    defaults: {
        menuSlideSpeed: 200
    },
    ui: {
        'menuItems': 'li:not(.sub-menu)',
        'subMenuItems': '.sub-menu'
    },
    events: {
        'click .sub-menu > a': "toggleSubMenu",
        'click .event-user-logout': "logoutUser"
    },
    initialize: function initialize() {
        this.listenTo(_app2.default.vent, 'route:changed', function () {
            this.selectMenuItem();
        }, this);
    },
    //TODO make menu active when sub-item selected;
    onShow: function onShow() {
        $('body').addClass('sw-toggled');
        this.$el.attr("id", 'sidebar');
        _UIHelper2.default.scrollBar(this.$el);
    },
    onRender: function onRender() {
        this.selectMenuItem();
    },
    toggleSubMenu: function toggleSubMenu(e) {
        $(e.currentTarget).next().slideToggle(this.options.menuSlideSpeed);
        $(e.currentTarget).parent().toggleClass('toggled');
        return false;
    },
    selectMenuItem: function selectMenuItem() {
        var viewName = _app2.default.filterHandler.currentViewName;
        var filters = _app2.default.filterHandler.routerParams;
        this.ui.menuItems.removeClass('active');
        this.ui.menuItems.find('a').removeClass('active');

        //Деактивируем все a
        //Ищем нужный элемент
        //Проставляем active
        //Если из sub-menu, ищем парента - раскрываем;
        //Закрываем остальные sub-menu;

        var currentSubMenu = null;
        for (var i = 0; i < this.ui.menuItems.length; i++) {
            var menuItem = $(this.ui.menuItems[i]);
            var views = menuItem.data('views');
            if (!views) {
                continue;
            }
            views = views.split(',');
            if (views.indexOf(viewName) >= 0) {
                if (menuItem.data('filter')) {
                    var filter = menuItem.data('filter').split('=');
                    if (filter[1] == 'undefined') {
                        filter[1] = undefined;
                    }
                    if (filters[filter[0]] != filter[1]) {
                        continue;
                    }
                }
                menuItem.addClass('active');
                menuItem.find('a').addClass('active');
                var subMenu = menuItem.parent().parent();
                if (subMenu.hasClass('sub-menu')) {
                    subMenu.find('ul').slideDown(this.options.menuSlideSpeed);
                    subMenu.addClass("toggled active");
                    currentSubMenu = subMenu;
                }
            }
        }
        var notCurrent = this.ui.subMenuItems;
        if (currentSubMenu) {
            notCurrent = notCurrent.not(currentSubMenu);
        }
        notCurrent.find('ul').slideUp(this.options.menuSlideSpeed);
        notCurrent.removeClass("toggled active");
        return false;
    },
    logoutUser: function logoutUser() {
        _app2.default.currentUser.logout();
        return false;
    },
    onDestroy: function onDestroy() {
        $('body').removeClass('sw-toggled');
    }
});