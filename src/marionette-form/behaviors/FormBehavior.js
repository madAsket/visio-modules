import * as MN from 'marionette';
import Backbone from 'backbone';
import * as _ from 'underscore';
import $ from 'jquery';
import GlobalMessageTemplate from '../templates/global_form_message';
import GlobalErrorTemplate from '../templates/global_form_errors';
import Validators from '../validators';
import UIHelper from '../../helpers/UIHelper'


//formModel - промежуточная модель для работы с формой
//originModel - Модель из вьюхи, из которой создается клон - formModel


export default MN.Behavior.extend({
    defaults: {
        justValidate:false, //валидировать форму, без отправки данных
        saveOptions:{},
        PATCH:true, //Пропускать отправку атрибутов, которые не были изменены в форме
        schema:{},
        model:Backbone.Model, //класс модели по умолчанию, если не передана из вьюхи, создастся здесь
        modelURL:null //Переопределяем по какому url сохраняем модельку
    },
    globalMessageTemplate:GlobalMessageTemplate,
    globalErrorsTemplate:GlobalErrorTemplate,
    ui: {
        form: 'form',
        formErrors: ".form-errors",
        formFields: ".form-field",
        globalMessageRegion:"#globalMessage",
        globalErrorsRegion:"#globalErrors"
    },
    events:{
        'submit form':"submitForm"
    },
    initialize(options){
        this.view.formBehavior = this;
        if(this.view.options.model){
            this.originModel = this.view.options.model;
        }else{
            if(this.options.model){
                this.originModel = new this.options.model();
                //TODO check it;
                this.view.options.model = this.originModel;
            }else{
                throw Error('No model provided for form');
            }
        }
        this.initFormModel();
        this.updateViewSerializer();
        return this;
    },
    updateViewSerializer(){
        var originSerializeData = this.view.constructor.prototype.serializeData;
        var self = this;
        this.view.serializeData = function(){
            var data = originSerializeData.apply(this, arguments);
            data['form'] = self.formModel.toJSON();
            return data;
        };
    },
    initFormModel(){
        this.formModel = new Backbone.Model(_.clone(this.originModel.attributes));
        var fields = {};
        var metadata = {};
        var self = this;
        buildSchema(this.options.schema, fields, metadata);
        function buildSchema(fieldSchema, newFields, meta){
            $.each(fieldSchema, function(k, v){
                if(v.hasOwnProperty('schema')){
                    newFields[k] = {};
                    meta[k] = {};
                    buildSchema(v.schema, newFields[k], meta[k]);
                }else{
                    newFields[k] = null;
                    meta[k] = v;
                    if(v.hasOwnProperty('choices')) {
                        if(typeof(v['choices']) == "function"){
                            meta[k]['choices'] = v['choices'](self);
                        }else{
                            meta[k]['choices'] = v['choices'];
                        }
                    }else{
                        meta[k]['choices'] = null;
                    }
                }
            });
        }
        var newAttrs = $.extend(true, fields,  this.formModel.attributes);
        newAttrs['meta'] = {
            id: this.formModel.cid,
            mode: this.formModel.get('id') ? 'edit' : 'create',
            schema : metadata
        };
        this.formModel.set(newAttrs, {silent:true});
        console.log(this.formModel);
    },
    onRender() {
        this.ui.form.find('.selectpicker').selectpicker({});
        UIHelper.initFGLines(this.ui.form);
        UIHelper.initIEPlaceholder(this.ui.form);
    },
    submitForm(e){
        if(e) e.preventDefault();
        var errors = this.validateFormValues(this.buildFormValues());
        console.log("Errors:", errors);
        this.clearErrors();
        let self = this;
        if(this.options.justValidate){
            if(!errors){
                this.onBeforeSave(this.values).then(function(cancel){
                    if(cancel){
                        console.log("SAVING CANCELLED");
                        return;
                    }
                    self.successCallback(self.originModel, self.values);
                });
                return this.values;
            }else{
                this.displayErrors(errors);
                this.errorCallback(this.originModel, this.values);
                return false;
            }
        }else{
            if(!errors){
                this.onBeforeSave(this.values).then(function(cancel){
                    console.log('on before save callback');
                    console.log(cancel);
                    if(cancel){
                        console.log("SAVING CANCELLED");
                        return;
                    }
                    return self.submit();
                });
            }else{
                this.displayErrors(errors);
                this.errorCallback(this.originModel, this.values);
            }
        }
        return false;
    },
    buildFormValues(){
        var data = {};
        $.each(this.ui.form.serializeArray(), function() {
            var value = this.value;
            if (data[this.name] !== undefined) {
                if (!data[this.name].push) {
                    data[this.name] = [data[this.name]];
                }
                data[this.name].push(value);
            } else {
                data[this.name] = value;
            }
        });
        data = this.serializeCheckboxes(data);
        console.log("FORM VALUES: ", data);
        return data;
    },
    serializeCheckboxes(data){
        $.each(this.ui.form.find('input[type="checkbox"]'), function() {
            if($(this).attr('value') == undefined) {
                data[$(this).attr('name')] = $(this).is(":checked");
            }
        });
        return data;
    },
    validateFormValues(data){
        var errors = {};
        var hasErrors = false;
        var self = this;
        function validateValues(obj, path){
            var d = {};
            var root = path;
            $.each(obj, function(k, v){
                if(v.hasOwnProperty('schema')){
                    d[k] = validateValues(v.schema, root + k + ".");
                }else{
                    d[k] = data[path + k];
                    if(v.hasOwnProperty('validators')){
                        for(var i=0; i<v.validators.length; i++){
                            var validator = v.validators[i];
                            var invalid = false;
                            var validatorFunction = null;
                            var validatorName = "";
                            if(typeof(validator) == "function") {
                                validatorFunction = validator;
                            }else {
                                if(typeof(validator) == "object"){
                                    validatorName = validator.type;
                                    validatorFunction = Validators[validator.type](validator.options)
                                }else{
                                    validatorName = validator;
                                    validatorFunction = Validators[validator]()
                                }
                            }
                            if(validatorFunction){
                                invalid = validatorFunction(d[k], data, self, root + k);
                                //TODO refactor to pre/post processors;
                                if(!invalid){
                                    if(validator == "number"){
                                        d[k] = parseInt(d[k]);
                                    }
                                }
                            }
                            if(invalid){
                                hasErrors = true;
                                errors[path + k] = invalid;
                                break;
                            }
                        }
                    }
                    if(v.hasOwnProperty('process') && v.process.post){
                        d[k] = v.process.post(d[k]);
                    }
                }
            });
            return d;
        }
        self.values = validateValues(this.options.schema, "");
        console.log("VALIDATED VALUES: ", self.values);
        if(this.formModel.isNew()){
            this.options.PATCH = false;
        }
        //Если нужно отправить только изменения в моделе(для PATCH)
        if(this.options.PATCH){
            this.skipUnchangedAttributes();
        }
        console.log("VALUES TO SAVE: ", this.values);
        if(hasErrors)
            return errors;
        return null;
    },
    skipUnchangedAttributes(){
        var testModel = new Backbone.Model(_.clone(this.formModel.attributes));
        testModel.set(this.values);
        this.values = testModel.changedAttributes();
    },
    buildServerErrors(errors){
        //TODO make deep binding;
        var errs = {};
        $.each(errors, (key, val)=>{
            if(Array.isArray(val)){
                errs[key] = {'message': val.join(' ;')};
            }else if(typeof val == "object"){
                var fieldErrrs = [];
                $.each(val, (k, v)=>{
                    fieldErrrs.push(v)
                });
                errs[key] = {'message': fieldErrrs.join(' ;')};
            }
        });
        console.log("BUILT SERVER ERRORS:", errs);
        return errs;
    },
    generateSavingModel(){
        var savingModel = new Backbone.Model(this.values);
        savingModel.urlRoot = this.originModel.urlRoot;
        if(!savingModel.urlRoot){
            savingModel.url = this.originModel.url;
        }
        if(this.options.modelURL){
            savingModel.urlRoot = this.options.modelURL;
        }
        if(this.options.PATCH)//PATCH needs ID for URL;
            savingModel.set('id', this.originModel.id);
        else if(!this.originModel.isNew()){
            //if PUT
            if(savingModel.urlRoot){
                //withID;
                savingModel.urlRoot = this.originModel.urlRoot;
                savingModel.urlRoot += savingModel.urlRoot.charAt(savingModel.urlRoot.length - 1) == '/' ? '' : '/';
                savingModel.urlRoot += this.originModel.id;
            }else{
                //without ID;
                savingModel.url = this.originModel.url;
                savingModel.url += savingModel.url.charAt(savingModel.url.length - 1) == '/' ? '' : '/';
            }
        }
        return savingModel;
    },
    submit(){
        var self = this;
        //no values to save
        if(!this.values){
            console.log("NO values to save");
            this.successCallback(this.originModel);
            return;
        }
        var savingModel = this.generateSavingModel();
        let method = this.originModel.isNew() ? "POST" : this.options.PATCH ? "PATCH": "PUT";
        console.log("SAVING MODEL: ", savingModel);
        let saveOptions = $.extend({}, this.options.saveOptions, {
            type:method,
            success:function(model, data){
                console.log('success save');
                if(data && data.errors){
                    console.log('validation errors: ', data.errors);
                    self.displayErrors(self.buildServerErrors(data.errors));
                    return;
                }
                self.formModel.set(savingModel.attributes, {silent:true});
                self.originModel.set(savingModel.attributes);
                self.successCallback(self.originModel, data);
            },
            error:function(model, data){
                console.log('error save');
                if(data.status == 500 || data.status == 502 || data.status == 404){
                    UIHelper.alerts.showWarningAlert(i18n.trans("Error"),
                        i18n.trans("An error occurred on the server.") + "\n" +
                        i18n.trans("Please reload the page and try again."));
                }
                if(data.status == 400){
                    console.log("SERVER ERRORS:", data.responseJSON);
                    if (Object.keys(data.responseJSON).length > 0) {
                        self.displayErrors(self.buildServerErrors(data.responseJSON));
                    }
                }
                if(data.status == 403){
                    UIHelper.alerts.showWarningAlert(i18n.trans("Error"),
                        i18n.trans("An authorization error.") + "\n" +
                        i18n.trans('You do not have permission to perform this operation.'));
                }
                self.errorCallback(self.originModel, data, true);
            }, patch:self.options.PATCH, silent:true});
        savingModel.save(this.values, saveOptions);
        return true;
    },
    displayErrors(errors){
        var self = this;
        if(errors.hasOwnProperty('non_field_errors')){
            var globErrs = errors['non_field_errors'];
            var html = $(MN.Renderer.render(this.globalErrorsTemplate,
                {'errors' : globErrs}));
            this.ui.globalErrorsRegion.html(html);
        }
        $.each(errors, function(k, value){
            var field = self.ui.form.find('[data-field="'+k+'-'+self.formModel.get('meta').id +'"]');
            if(field){
                field.addClass("has-error");
                field.find('.form-errors').append(value.message);
            }
        });

    },
    displayMessage(message){
        var html = $(MN.Renderer.render(this.globalMessageTemplate,
            {'message' : message}));
        this.ui.globalMessageRegion.html(html);
        var self = this;
        setTimeout(function(){
            self.ui.globalMessageRegion.empty();
        }, 3000);
    },
    clearErrors(){
        this.ui.globalErrorsRegion.empty();
        this.ui.globalMessageRegion.empty();
        this.ui.formFields.removeClass('has-error');
        this.ui.formErrors.empty();
    },
    onBeforeSave(values){
        var deferred = $.Deferred();
        if(this.view.onBeforeSave) {
            this.view.onBeforeSave(values, deferred);
        }else{
            deferred.resolve();
        }
        return deferred.promise();
    },
    successCallback(model, data){
        if(this.view.successCallback)
            this.view.successCallback(model, data);
    },
    errorCallback(model, data, afterSave){
        if(this.view.errorCallback)
            this.view.errorCallback(model, data, afterSave);
    }
});
