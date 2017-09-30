import $ from 'jquery';
import Waves from "node-waves";
import autosize from "autosize";
require('malihu-custom-scrollbar-plugin')($);

export default {
    detectMobile() {
        /*
         * Detect Mobile Browser
         */
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            $('html').addClass('ismobile');
        }
    },
    alerts:{
        _showAlert(type="info", title=i18n.trans("Warning"), text="", confirmText=i18n.trans("Yes"),
                   cancelText=i18n.trans("No"), showCancelBtn=true, confirmCallback, cancelCallback){
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
            }, function(isConfirm){
                if(isConfirm){
                    //TODO deffered for callback and closing popups;
                    if(confirmCallback){
                        confirmCallback();
                        // swal("Done", "", "success");
                    }
                }else{
                    if(cancelCallback){
                        cancelCallback();
                    }
                }
            });
        },
        showInfoAlert(title, text){
            this._showAlert(...["info", title, text, "Ok", ,false]);
        },
        showWarningAlert(title, text){
            this._showAlert(...["warning", title, text, "Ok", ,false]);
        },
        showErrorAlert(title, text){
            this._showAlert(...["error", title, text, "Ok", ,false]);
        },
        showConfirmationAlert(title, text, confirmCallback, cancelCallback){
            this._showAlert(...["warning", title, text, i18n.trans("Continue"), i18n.trans("Cancel"), true, confirmCallback,cancelCallback]);
        }
    },
    preloader:{
        init(){
            var self = this;
            $('body').append(
                '<div class="page-loader" id="pageLoader" style="display:none;">'+
                    '<div class="preloader pls-teal">'+
                        '<svg class="pl-circular" viewBox="25 25 50 50">'+
                        '<circle class="plc-path" cx="50" cy="50" r="20" />'+
                        '</svg>'+
                        '<p>'+i18n.trans("Loading")+'...</p>'+
                    '</div>'+
                '</div>');
            this.pageloader = $('#pageLoader');
            this.silent = false;
            $(document).ajaxStart(function() {
                self._show();
            });
            $(document).ajaxStop(function() {
                self._hide();
            });
            window.onerror = function() {
                $.active = 0;
                self._hide();
            };
            $(document).ajaxError(function(){
                self._hide();
            });
        },
        _show(){
            if(!this.silent && this.pageloader.is(":hidden"))
                this.pageloader.fadeIn('fast');
        },
        _hide(){
            if(!this.pageloader.is(":hidden"))
                this.pageloader.fadeOut('fast');
        }
    },
    scrollBar(selector, theme='minimal-dark', mousewheelaxis='y') {
        selector.mCustomScrollbar({
            theme: theme,
            scrollInertia: 100,
            axis:'yx',
            mouseWheel: {
                enable: true,
                axis: mousewheelaxis,
                preventDefault: true
            },
            advanced:{
                autoScrollOnFocus: false,
                updateOnContentResize:true,
                updateOnSelectorChange:true
            }
        });
    },
    updateScrollbar(selector){
        if(selector.mCustomScrollbar){
            try{
                selector.mCustomScrollbar('update');
            }catch(e){
                console.log(e);
            }
        }
    },
    initCollapse(collapseSelector){
        collapseSelector.on('show.bs.collapse', function (e) {
            $(this).closest('.panel').find('.panel-heading').addClass('active');
        });

        collapseSelector.on('hide.bs.collapse', function (e) {
            $(this).closest('.panel').find('.panel-heading').removeClass('active');
        });
        //Add active class for pre opened items
        collapseSelector.filter('.in').each(function(){
            $(this).closest('.panel').find('.panel-heading').addClass('active');
        });
    },
    smartSelect(selector){
        selector.chosen({
            width: '100%',
            allow_single_deselect: true,
            placeholder_text_multiple:"Select"
        });
    },
    initAutosize(){
        autosize($('.auto-size'));
    },
    initTooltips(selector){
        let tooltipItems = selector.find('[data-toggle="tooltip"]');
        if(tooltipItems.length > 0)
            tooltipItems.tooltip();
    },
    initIEPlaceholder(selector){
        if($('html').hasClass('ie9')) {
            selector.find('input, textarea').placeholder({
                customClass: 'ie9-placeholder'
            });
        }
    },
    initFGLines(selector){
        selector.find('.fg-line .form-control').focus(function(){
            $(this).closest('.fg-line').addClass('fg-toggled');
        });
        selector.find('.form-control').blur(function(){
            var p = $(this).closest('.form-group, .input-group');
            var i = p.find('.form-control').val();
            if (p.hasClass('fg-float')) {
                if (i.length == 0) {
                    $(this).closest('.fg-line').removeClass('fg-toggled');
                }
            }
            else {
                $(this).closest('.fg-line').removeClass('fg-toggled');
            }
        });
    },
    initWaves(){
        (function(){
            Waves.attach('.btn:not(.btn-icon):not(.btn-float)');
            Waves.attach('.btn-icon, .btn-float', ['waves-circle', 'waves-float']);
            Waves.init();
        })();
    },
    initDropdown(selector){
        let dropdownLinks = selector.find('.dropdown-menu a');
        if(dropdownLinks.length > 0) {
            dropdownLinks.click(function () {
                let dd = $(this);
                //hardcode if has event;
                if(dd.attr("href") == "#"){
                    dd.parent().parent().parent().removeClass('open');
                }
            });
        }
    }
}