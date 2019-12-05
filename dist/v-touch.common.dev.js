/*!
 * AnyTouch.js v0.5.2
 * (c) 2018-2019 Russell
 * https://github.com/any86/any-touch
 * Released under the MIT License.
 */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var AnyTouch = _interopDefault(require('./any-touch.common'));

var default_1 = (function () {
    function default_1(ClassObject) {
        this.stock = [];
        this.ClassObject = ClassObject;
    }
    default_1.prototype.getIndexByEl = function (el) {
        for (var i = 0, len = this.stock.length; i < len; i++) {
            if (el === this.stock[i].el) {
                return i;
            }
        }
        return -1;
    };
    default_1.prototype.getInstanceByIndex = function (index) {
        return this.stock[index].instance;
    };
    default_1.prototype.removeInstanceByIndex = function (index) {
        this.stock.splice(index, 1);
    };
    default_1.prototype.getOrCreateInstanceByEl = function (el) {
        var manageIndex = this.getIndexByEl(el);
        if (-1 === manageIndex) {
            var instance = new this.ClassObject(el);
            this.stock.push({ el: el, instance: instance });
            return instance;
        }
        else {
            return this.getInstanceByIndex(manageIndex);
        }
    };
    return default_1;
}());

var iManage = new default_1(AnyTouch);
var plugin = {
    install: function (Vue) {
        var _bindEvent = function (el, binding) {
            var instance = iManage.getOrCreateInstanceByEl(el);
            if (undefined !== binding.value) {
                binding.value(instance);
            }
        };
        var _unbindEvent = function (el) {
            var index = iManage.getIndexByEl(el);
            if (-1 !== index && undefined !== iManage.getInstanceByIndex(index)) {
                iManage.getInstanceByIndex(index).destroy();
                iManage.removeInstanceByIndex(index);
            }
        };
        Vue.directive('touch', {
            inserted: function (el, binding) {
                _bindEvent(el, binding);
            },
            update: function (el, binding) {
                _bindEvent(el, binding);
            },
            unbind: function (el) {
                _unbindEvent(el);
            }
        });
    }
};

module.exports = plugin;
