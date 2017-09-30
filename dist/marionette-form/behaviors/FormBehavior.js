'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _marionette = require('marionette');

var MN = _interopRequireWildcard(_marionette);

var _backbone = require('backbone');

var _backbone2 = _interopRequireDefault(_backbone);

var _underscore = require('underscore');

var _ = _interopRequireWildcard(_underscore);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _global_form_message = require('../templates/global_form_message');

var _global_form_message2 = _interopRequireDefault(_global_form_message);

var _global_form_errors = require('../templates/global_form_errors');

var _global_form_errors2 = _interopRequireDefault(_global_form_errors);

var _validators = require('../validators');

var _validators2 = _interopRequireDefault(_validators);

var _UIHelper = require('../../helpers/UIHelper');

var _UIHelper2 = _interopRequireDefault(_UIHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//formModel - промежуточная модель для работы с формой
//originModel - Модель из вьюхи, из которой создается клон - formModel


exports.default = MN.Behavior.extend({
    defaults: {
        justValidate: false, //валидировать форму, без отправки данных
        saveOptions: {},
        PATCH: true, //Пропускать отправку атрибутов, которые не были изменены в форме
        schema: {},
        model: _backbone2.default.Model, //класс модели по умолчанию, если не передана из вьюхи, создастся здесь
        modelURL: null //Переопределяем по какому url сохраняем модельку
    },
    globalMessageTemplate: _global_form_message2.default,
    globalErrorsTemplate: _global_form_errors2.default,
    ui: {
        form: 'form',
        formErrors: ".form-errors",
        formFields: ".form-field",
        globalMessageRegion: "#globalMessage",
        globalErrorsRegion: "#globalErrors"
    },
    events: {
        'submit form': "submitForm"
    },
    initialize: function initialize(options) {
        this.view.formBehavior = this;
        if (this.view.options.model) {
            this.originModel = this.view.options.model;
        } else {
            if (this.options.model) {
                this.originModel = new this.options.model();
                //TODO check it;
                this.view.options.model = this.originModel;
            } else {
                throw Error('No model provided for form');
            }
        }
        this.initFormModel();
        this.updateViewSerializer();
        return this;
    },
    updateViewSerializer: function updateViewSerializer() {
        var originSerializeData = this.view.constructor.prototype.serializeData;
        var self = this;
        this.view.serializeData = function () {
            var data = originSerializeData.apply(this, arguments);
            data['form'] = self.formModel.toJSON();
            return data;
        };
    },
    initFormModel: function initFormModel() {
        this.formModel = new _backbone2.default.Model(_.clone(this.originModel.attributes));
        var fields = {};
        var metadata = {};
        var self = this;
        buildSchema(this.options.schema, fields, metadata);
        function buildSchema(fieldSchema, newFields, meta) {
            _jquery2.default.each(fieldSchema, function (k, v) {
                if (v.hasOwnProperty('schema')) {
                    newFields[k] = {};
                    meta[k] = {};
                    buildSchema(v.schema, newFields[k], meta[k]);
                } else {
                    newFields[k] = null;
                    meta[k] = v;
                    if (v.hasOwnProperty('choices')) {
                        if (typeof v['choices'] == "function") {
                            meta[k]['choices'] = v['choices'](self);
                        } else {
                            meta[k]['choices'] = v['choices'];
                        }
                    } else {
                        meta[k]['choices'] = null;
                    }
                }
            });
        }
        var newAttrs = _jquery2.default.extend(true, fields, this.formModel.attributes);
        newAttrs['meta'] = {
            id: this.formModel.cid,
            mode: this.formModel.get('id') ? 'edit' : 'create',
            schema: metadata
        };
        this.formModel.set(newAttrs, { silent: true });
        console.log(this.formModel);
    },
    onRender: function onRender() {
        this.ui.form.find('.selectpicker').selectpicker({});
        _UIHelper2.default.initFGLines(this.ui.form);
        _UIHelper2.default.initIEPlaceholder(this.ui.form);
    },
    submitForm: function submitForm(e) {
        if (e) e.preventDefault();
        var errors = this.validateFormValues(this.buildFormValues());
        console.log("Errors:", errors);
        this.clearErrors();
        var self = this;
        if (this.options.justValidate) {
            if (!errors) {
                this.onBeforeSave(this.values).then(function (cancel) {
                    if (cancel) {
                        console.log("SAVING CANCELLED");
                        return;
                    }
                    self.successCallback(self.originModel, self.values);
                });
                return this.values;
            } else {
                this.displayErrors(errors);
                this.errorCallback(this.originModel, this.values);
                return false;
            }
        } else {
            if (!errors) {
                this.onBeforeSave(this.values).then(function (cancel) {
                    console.log('on before save callback');
                    console.log(cancel);
                    if (cancel) {
                        console.log("SAVING CANCELLED");
                        return;
                    }
                    return self.submit();
                });
            } else {
                this.displayErrors(errors);
                this.errorCallback(this.originModel, this.values);
            }
        }
        return false;
    },
    buildFormValues: function buildFormValues() {
        var data = {};
        _jquery2.default.each(this.ui.form.serializeArray(), function () {
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
    serializeCheckboxes: function serializeCheckboxes(data) {
        _jquery2.default.each(this.ui.form.find('input[type="checkbox"]'), function () {
            if ((0, _jquery2.default)(this).attr('value') == undefined) {
                data[(0, _jquery2.default)(this).attr('name')] = (0, _jquery2.default)(this).is(":checked");
            }
        });
        return data;
    },
    validateFormValues: function validateFormValues(data) {
        var errors = {};
        var hasErrors = false;
        var self = this;
        function validateValues(obj, path) {
            var d = {};
            var root = path;
            _jquery2.default.each(obj, function (k, v) {
                if (v.hasOwnProperty('schema')) {
                    d[k] = validateValues(v.schema, root + k + ".");
                } else {
                    d[k] = data[path + k];
                    if (v.hasOwnProperty('validators')) {
                        for (var i = 0; i < v.validators.length; i++) {
                            var validator = v.validators[i];
                            var invalid = false;
                            var validatorFunction = null;
                            var validatorName = "";
                            if (typeof validator == "function") {
                                validatorFunction = validator;
                            } else {
                                if ((typeof validator === 'undefined' ? 'undefined' : _typeof(validator)) == "object") {
                                    validatorName = validator.type;
                                    validatorFunction = _validators2.default[validator.type](validator.options);
                                } else {
                                    validatorName = validator;
                                    validatorFunction = _validators2.default[validator]();
                                }
                            }
                            if (validatorFunction) {
                                invalid = validatorFunction(d[k], data, self, root + k);
                                //TODO refactor to pre/post processors;
                                if (!invalid) {
                                    if (validator == "number") {
                                        d[k] = parseInt(d[k]);
                                    }
                                }
                            }
                            if (invalid) {
                                hasErrors = true;
                                errors[path + k] = invalid;
                                break;
                            }
                        }
                    }
                    if (v.hasOwnProperty('process') && v.process.post) {
                        d[k] = v.process.post(d[k]);
                    }
                }
            });
            return d;
        }
        self.values = validateValues(this.options.schema, "");
        console.log("VALIDATED VALUES: ", self.values);
        if (this.formModel.isNew()) {
            this.options.PATCH = false;
        }
        //Если нужно отправить только изменения в моделе(для PATCH)
        if (this.options.PATCH) {
            this.skipUnchangedAttributes();
        }
        console.log("VALUES TO SAVE: ", this.values);
        if (hasErrors) return errors;
        return null;
    },
    skipUnchangedAttributes: function skipUnchangedAttributes() {
        var testModel = new _backbone2.default.Model(_.clone(this.formModel.attributes));
        testModel.set(this.values);
        this.values = testModel.changedAttributes();
    },
    buildServerErrors: function buildServerErrors(errors) {
        //TODO make deep binding;
        var errs = {};
        _jquery2.default.each(errors, function (key, val) {
            if (Array.isArray(val)) {
                errs[key] = { 'message': val.join(' ;') };
            } else if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) == "object") {
                var fieldErrrs = [];
                _jquery2.default.each(val, function (k, v) {
                    fieldErrrs.push(v);
                });
                errs[key] = { 'message': fieldErrrs.join(' ;') };
            }
        });
        console.log("BUILT SERVER ERRORS:", errs);
        return errs;
    },
    generateSavingModel: function generateSavingModel() {
        var savingModel = new _backbone2.default.Model(this.values);
        savingModel.urlRoot = this.originModel.urlRoot;
        if (!savingModel.urlRoot) {
            savingModel.url = this.originModel.url;
        }
        if (this.options.modelURL) {
            savingModel.urlRoot = this.options.modelURL;
        }
        if (this.options.PATCH) //PATCH needs ID for URL;
            savingModel.set('id', this.originModel.id);else if (!this.originModel.isNew()) {
            //if PUT
            if (savingModel.urlRoot) {
                //withID;
                savingModel.urlRoot = this.originModel.urlRoot;
                savingModel.urlRoot += savingModel.urlRoot.charAt(savingModel.urlRoot.length - 1) == '/' ? '' : '/';
                savingModel.urlRoot += this.originModel.id;
            } else {
                //without ID;
                savingModel.url = this.originModel.url;
                savingModel.url += savingModel.url.charAt(savingModel.url.length - 1) == '/' ? '' : '/';
            }
        }
        return savingModel;
    },
    submit: function submit() {
        var self = this;
        //no values to save
        if (!this.values) {
            console.log("NO values to save");
            this.successCallback(this.originModel);
            return;
        }
        var savingModel = this.generateSavingModel();
        var method = this.originModel.isNew() ? "POST" : this.options.PATCH ? "PATCH" : "PUT";
        console.log("SAVING MODEL: ", savingModel);
        var saveOptions = _jquery2.default.extend({}, this.options.saveOptions, {
            type: method,
            success: function success(model, data) {
                console.log('success save');
                if (data && data.errors) {
                    console.log('validation errors: ', data.errors);
                    self.displayErrors(self.buildServerErrors(data.errors));
                    return;
                }
                self.formModel.set(savingModel.attributes, { silent: true });
                self.originModel.set(savingModel.attributes);
                self.successCallback(self.originModel, data);
            },
            error: function error(model, data) {
                console.log('error save');
                if (data.status == 500 || data.status == 502 || data.status == 404) {
                    _UIHelper2.default.alerts.showWarningAlert(i18n.trans("Error"), i18n.trans("An error occurred on the server.") + "\n" + i18n.trans("Please reload the page and try again."));
                }
                if (data.status == 400) {
                    console.log("SERVER ERRORS:", data.responseJSON);
                    if (Object.keys(data.responseJSON).length > 0) {
                        self.displayErrors(self.buildServerErrors(data.responseJSON));
                    }
                }
                if (data.status == 403) {
                    _UIHelper2.default.alerts.showWarningAlert(i18n.trans("Error"), i18n.trans("An authorization error.") + "\n" + i18n.trans('You do not have permission to perform this operation.'));
                }
                self.errorCallback(self.originModel, data, true);
            }, patch: self.options.PATCH, silent: true });
        savingModel.save(this.values, saveOptions);
        return true;
    },
    displayErrors: function displayErrors(errors) {
        var self = this;
        if (errors.hasOwnProperty('non_field_errors')) {
            var globErrs = errors['non_field_errors'];
            var html = (0, _jquery2.default)(MN.Renderer.render(this.globalErrorsTemplate, { 'errors': globErrs }));
            this.ui.globalErrorsRegion.html(html);
        }
        _jquery2.default.each(errors, function (k, value) {
            var field = self.ui.form.find('[data-field="' + k + '-' + self.formModel.get('meta').id + '"]');
            if (field) {
                field.addClass("has-error");
                field.find('.form-errors').append(value.message);
            }
        });
    },
    displayMessage: function displayMessage(message) {
        var html = (0, _jquery2.default)(MN.Renderer.render(this.globalMessageTemplate, { 'message': message }));
        this.ui.globalMessageRegion.html(html);
        var self = this;
        setTimeout(function () {
            self.ui.globalMessageRegion.empty();
        }, 3000);
    },
    clearErrors: function clearErrors() {
        this.ui.globalErrorsRegion.empty();
        this.ui.globalMessageRegion.empty();
        this.ui.formFields.removeClass('has-error');
        this.ui.formErrors.empty();
    },
    onBeforeSave: function onBeforeSave(values) {
        var deferred = _jquery2.default.Deferred();
        if (this.view.onBeforeSave) {
            this.view.onBeforeSave(values, deferred);
        } else {
            deferred.resolve();
        }
        return deferred.promise();
    },
    successCallback: function successCallback(model, data) {
        if (this.view.successCallback) this.view.successCallback(model, data);
    },
    errorCallback: function errorCallback(model, data, afterSave) {
        if (this.view.errorCallback) this.view.errorCallback(model, data, afterSave);
    }
});