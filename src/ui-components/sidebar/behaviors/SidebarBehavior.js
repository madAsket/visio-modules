import * as MN from 'marionette';
import UIHelper from '../../../helpers/UIHelper'

//li.sub-menu.toggled - icon +/- state
//li.sub-menu.active - collapsed
//li.sub-menu a.active - selected
//a.active - selected

export default MN.Behavior.extend({
    defaults: {
        menuSlideSpeed:200
    },
    ui: {
        'menuItems':'li:not(.sub-menu)',
        'subMenuItems':'.sub-menu'
    },
    events:{
        'click .sub-menu > a':"toggleSubMenu",
        'click .event-user-logout':"logoutUser"
    },
    initialize:function(){
        this.listenTo(MN.Application.vent, 'route:changed', function(){
            this.selectMenuItem();
        },this);
    },
    //TODO make menu active when sub-item selected;
    onShow(){
        $('body').addClass('sw-toggled');
        this.$el.attr("id", 'sidebar');
        UIHelper.scrollBar(this.$el);
    },
    onRender(){
        this.selectMenuItem();
    },
    toggleSubMenu(e){
        $(e.currentTarget).next().slideToggle(this.options.menuSlideSpeed);
        $(e.currentTarget).parent().toggleClass('toggled');
        return false;
    },
    selectMenuItem(){
        let viewName = MN.Application.filterHandler.currentViewName;
        let filters = MN.Application.filterHandler.routerParams;
        this.ui.menuItems.removeClass('active');
        this.ui.menuItems.find('a').removeClass('active');

        //Деактивируем все a
        //Ищем нужный элемент
        //Проставляем active
        //Если из sub-menu, ищем парента - раскрываем;
        //Закрываем остальные sub-menu;

        var currentSubMenu = null;
        for(let i=0; i < this.ui.menuItems.length; i++){
            let menuItem = $(this.ui.menuItems[i]);
            let views = menuItem.data('views');
            if(!views) {
                continue;
            }
            views = views.split(',');
            if(views.indexOf(viewName) >= 0){
                if(menuItem.data('filter')){
                    let filter = menuItem.data('filter').split('=');
                    if(filter[1] == 'undefined'){
                        filter[1] = undefined;
                    }
                    if(filters[filter[0]] != filter[1]){
                        continue;
                    }
                }
                menuItem.addClass('active');
                menuItem.find('a').addClass('active');
                let subMenu = menuItem.parent().parent();
                if(subMenu.hasClass('sub-menu')){
                    subMenu.find('ul').slideDown(this.options.menuSlideSpeed);
                    subMenu.addClass("toggled active");
                    currentSubMenu = subMenu;
                }
            }
        }
        let notCurrent = this.ui.subMenuItems;
        if(currentSubMenu){
            notCurrent = notCurrent.not(currentSubMenu);
        }
        notCurrent.find('ul').slideUp(this.options.menuSlideSpeed);
        notCurrent.removeClass("toggled active");
        return false;
    },
    logoutUser(){
        MN.Application.currentUser.logout();
        return false;
    },
    onDestroy(){
        $('body').removeClass('sw-toggled');
    }
});