import * as _ from 'underscore';

export default {
    required(options) {
        options = _.extend({
            type: 'required',
            message: i18n.trans('Required')
        }, options);

        return function required(value) {
            value = $.trim(value);
            options.value = value;

            var err = {
                type: options.type,
                message: _.isFunction(options.message) ? options.message(options) : options.message
            };

            if (value === null || value === undefined || value === false || value === '') return err;
        };
    },
    regexp(options) {
        if (!options.regexp) throw new Error('Missing required "regexp" option for "regexp" validator');

        options = _.extend({
            type: 'regexp',
            match: true,
            message: i18n.trans('Wrong format')
        }, options);

        return function regexp(value) {
            options.value = value;
            var err = {
                type: options.type,
                message: _.isFunction(options.message) ? options.message(options) : options.message
            };

            //Don't check empty values (add a 'required' validator for this)
            if (value === null || value === undefined || value === '') return;

            //Create RegExp from string if it's valid
            if ('string' === typeof options.regexp) options.regexp = new RegExp(options.regexp, options.flags);

            if ((options.match) ? !options.regexp.test(value) : options.regexp.test(value)) return err;
        };
    },
    number(options) {
        options = _.extend({
            type: 'number',
            message: i18n.trans('Must be a number'),
            regexp: /^[0-9]*\.?[0-9]*?$/
        }, options);
        return this.regexp(options);
    },
    coord(options) {
        options = _.extend({
            type: 'coord',
            message: i18n.trans('Must be a coordinate'),
            regexp: /^(\-?\d+(\.\d+)?)\.\s*(\-?\d+(\.\d+)?)$/
        }, options);
        return this.regexp(options);
    },
    minmax(options){
        if (!options.min && !options.max) throw new Error('Missing min or max option for length validator');
        options = _.extend({
            type: 'length',
            message:""
        }, options);
        return function length(value) {
            value = $.trim(value);
            options.value = value;
            if(options.min && value < options.min){
                return {
                    type: options.type,
                    message: `${i18n.trans('Minimum value')} ${options.min}`
                };
            }
            if(options.max && value > options.max){
                return {
                    type: options.type,
                    message: `${i18n.trans('Maximum value')} ${options.max}`
                };
            }
        };
    },
    email(options) {
        options = _.extend({
            type: 'email',
            message: i18n.trans('Wrong Email format'),
            regexp: /^[\w\-]{1,}([\w\-\+.]{1,1}[\w\-]{1,}){0,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/
        }, options);

        return this.regexp(options);
    },
    password(options) {
        options = _.extend({
            type: 'password',
            message: i18n.trans('Wrong password format'),
            regexp: /^(.){6,40}$/
        }, options);

        return this.regexp(options);
    },
    phone(options) {
        options = _.extend({
            type: 'phone',
            message: i18n.trans('Wrong phone number format'),
            regexp: /^\+?(\s{0,}([0-9]{1,})\s{0,}([0-9]*)){1,}$/
        }, options);

        return this.regexp(options);
    },
    url(options) {
        options = _.extend({
            type: 'url',
            message: i18n.trans('Wrong link format'),
            regexp: /^(http|https):\/\/(([A-Z0-9][A-Z0-9_\-]*)(\.[A-Z0-9][A-Z0-9_\-]*)+)(:(\d+))?\/?/i
        }, options);

        return this.regexp(options);
    },
    match(options) {
        if (!options.field) throw new Error('Missing required "field" options for "match" validator');
        options = _.extend({
            type: 'match',
            message: i18n.trans('The values do not match')
        }, options);

        return function match(value, attrs) {
            options.value = value;

            var err = {
                type: options.type,
                message: _.isFunction(options.message) ? options.message(options) : options.message
            };
            //Don't check empty values (add a 'required' validator for this)
            if (value === null || value === undefined || value === '') return;

            if (value !== attrs[options.field]) return err;
        };
    },
    cause(options) {
        if (!options.field) throw new Error('Missing required "field" options for "cause" validator');
        options = _.extend({
            type: 'cause',
            message: i18n.trans('Required')
        }, options);

        return function match(value, attrs) {
            options.value = value;

            var err = {
                type: options.type,
                message: _.isFunction(options.message) ? options.message(options) : options.message
            };

            console.log(attrs[options.field]);
            if (attrs[options.field] && (!value || value == "")) return err;
        };
    },
    length(options){
        if (!options.min && !options.max) throw new Error('Missing min or max option for length validator');
        options = _.extend({
            type: 'length',
            message: ""
        }, options);
        return function length(value) {
            value = $.trim(value);
            options.value = value;
            if(options.min && value.length >= 0 && value.length < options.min){
                return {
                    type: options.type,
                    message: `${i18n.trans('Minimum field length')} ${options.min}`
                };
            }
            if(options.max && value.length >= 0 && value.length > options.max){
                return {
                    type: options.type,
                    message: `${i18n.trans('Maximum field length')} ${options.max}`
                };
            }
        };
    }
}