var w2ui = w2ui || {};
var w2obj = w2obj || {}; // expose object to be able to overwrite default functions

/************************************************
 *  Library: Web 2.0 UI for jQuery
 *  - Following objects are defines
 *        - w2ui             - object that will contain all widgets
 *        - w2obj            - object with widget prototypes
 *        - w2utils          - basic utilities
 *        - $().w2render     - common render
 *        - $().w2destroy    - common destroy
 *        - $().w2marker     - marker plugin
 *        - $().w2tag        - tag plugin
 *        - $().w2overlay    - overlay plugin
 *        - $().w2menu       - menu plugin
 *        - w2utils.event    - generic event object
 *        - w2utils.keyboard - object for keyboard navigation
 *  - Dependencies: jQuery
 *
 * == NICE TO HAVE ==
 *   - overlay should be displayed where more space (on top or on bottom)
 *   - write and article how to replace certain framework functions
 *   - add maxHeight for the w2menu
 *   - isTime should support seconds
 *   - add time zone
 *   - TEST On IOS
 *   - $().w2marker() -- only unmarks first instance
 *   - subitems for w2menus()
 *   - add w2utils.lang wrap for all captions in all buttons.
 *   - add isDateTime()
 *   - remove momentjs
 *
 * == 1.5 changes
 *   - date has problems in FF new Date('yyyy-mm-dd') breaks
 *   - bug: w2utils.formatDate('2011-31-01', 'yyyy-dd-mm'); - wrong foratter
 *   - format date and time is buggy
 *   - added decimalSymbol
 *   - renamed size() -> formatSize()
 *   - added cssPrefix()
 *   - added w2utils.settings.weekStarts
 *   - onComplete should pass widget as context (this)
 *   - hidden and disabled in menus
 *   - added menu.item.hint for overlay menues
 *   - added w2tag options.id, options.left, options.top
 *
 ************************************************/

var w2utils = (function () {
    var tmp = {}; // for some temp variables
    var obj = {
        version: '1.5.x',
        settings: {
            "locale": "en-us",
            "date_format": "m/d/yyyy",
            "date_display": "Mon d, yyyy",
            "time_format": "hh:mi pm",
            "currencyPrefix": "$",
            "currencySuffix": "",
            "currencyPrecision": 2,
            "groupSymbol": ",",
            "decimalSymbol": ".",
            "shortmonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            "fullmonths": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            "shortdays": ["M", "T", "W", "T", "F", "S", "S"],
            "fulldays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "weekStarts": "M",      // can be "M" for Monday or "S" for Sunday
            "dataType": 'HTTP',   // can be HTTP, RESTFULL, JSON (case sensative)
            "phrases": {},       // empty object for english phrases
            "dateStartYear": 1950,     // start year for date-picker
            "dateEndYear": 2020      // end year for date picker
        },
        isInt           : isInt,
        isAlphaNumeric  : isAlphaNumeric,
        escapeId: escapeId,
        transition: transition,
        lock: lock,
        unlock: unlock,
        getSize: getSize,
        checkName: checkName,
        checkUniqueId: checkUniqueId,
        parseRoute: parseRoute,
        cssPrefix: cssPrefix,
        // some internal variables
        isIOS: ((navigator.userAgent.toLowerCase().indexOf('iphone') != -1 ||
            navigator.userAgent.toLowerCase().indexOf('ipod') != -1 ||
            navigator.userAgent.toLowerCase().indexOf('ipad') != -1)
            ? true : false),
        isIE: ((navigator.userAgent.toLowerCase().indexOf('msie') != -1 ||
            navigator.userAgent.toLowerCase().indexOf('trident') != -1 )
            ? true : false),
        use_momentjs: ((typeof moment === 'function') && (typeof moment.version === 'string'))
    };
    return obj;

    function isInt (val) {
        var re = /^[-+]?[0-9]+$/;
        return re.test(val);
    }

    function isAlphaNumeric (val) {
        var re = /^[a-zA-Z0-9_-]+$/;
        return re.test(val);
    }

    function escapeId(id) {
        if (id === '' || id == null) return '';
        return String(id).replace(/([;&,\.\+\*\~'`:"\!\^#$%@\[\]\(\)=<>\|\/? {}\\])/g, '\\$1');
    }

    function transition(div_old, div_new, type, callBack) {
        var width = $(div_old).width();
        var height = $(div_old).height();
        var time = 0.5;

        if (!div_old || !div_new) {
            console.log('ERROR: Cannot do transition when one of the divs is null');
            return;
        }

        div_old.parentNode.style.cssText += cross('perspective', '700px') + '; overflow: hidden;';
        div_old.style.cssText += '; position: absolute; z-index: 1019; ' + cross('backface-visibility', 'hidden');
        div_new.style.cssText += '; position: absolute; z-index: 1020; ' + cross('backface-visibility', 'hidden');

        switch (type) {
            case 'slide-left':
                // init divs
                div_old.style.cssText += 'overflow: hidden; ' + cross('transform', 'translate3d(0, 0, 0)', 'translate(0, 0)');
                div_new.style.cssText += 'overflow: hidden; ' + cross('transform', 'translate3d(' + width + 'px, 0, 0)', 'translate(' + width + 'px, 0)');
                $(div_new).show();
                // -- need a timing function because otherwise not working
                window.setTimeout(function () {
                    div_new.style.cssText += cross('transition', time + 's') + ';' + cross('transform', 'translate3d(0, 0, 0)', 'translate(0, 0)');
                    div_old.style.cssText += cross('transition', time + 's') + ';' + cross('transform', 'translate3d(-' + width + 'px, 0, 0)', 'translate(-' + width + 'px, 0)');
                }, 1);
                break;

            case 'slide-right':
                // init divs
                div_old.style.cssText += 'overflow: hidden; ' + cross('transform', 'translate3d(0, 0, 0)', 'translate(0, 0)');
                div_new.style.cssText += 'overflow: hidden; ' + cross('transform', 'translate3d(-' + width + 'px, 0, 0)', 'translate(-' + width + 'px, 0)');
                $(div_new).show();
                // -- need a timing function because otherwise not working
                window.setTimeout(function () {
                    div_new.style.cssText += cross('transition', time + 's') + '; ' + cross('transform', 'translate3d(0px, 0, 0)', 'translate(0px, 0)');
                    div_old.style.cssText += cross('transition', time + 's') + '; ' + cross('transform', 'translate3d(' + width + 'px, 0, 0)', 'translate(' + width + 'px, 0)');
                }, 1);
                break;

            case 'slide-down':
                // init divs
                div_old.style.cssText += 'overflow: hidden; z-index: 1; ' + cross('transform', 'translate3d(0, 0, 0)', 'translate(0, 0)');
                div_new.style.cssText += 'overflow: hidden; z-index: 0; ' + cross('transform', 'translate3d(0, 0, 0)', 'translate(0, 0)');
                $(div_new).show();
                // -- need a timing function because otherwise not working
                window.setTimeout(function () {
                    div_new.style.cssText += cross('transition', time + 's') + '; ' + cross('transform', 'translate3d(0, 0, 0)', 'translate(0, 0)');
                    div_old.style.cssText += cross('transition', time + 's') + '; ' + cross('transform', 'translate3d(0, ' + height + 'px, 0)', 'translate(0, ' + height + 'px)');
                }, 1);
                break;

            case 'slide-up':
                // init divs
                div_old.style.cssText += 'overflow: hidden; ' + cross('transform', 'translate3d(0, 0, 0)', 'translate(0, 0)');
                div_new.style.cssText += 'overflow: hidden; ' + cross('transform', 'translate3d(0, ' + height + 'px, 0)', 'translate(0, ' + height + 'px)');
                $(div_new).show();
                // -- need a timing function because otherwise not working
                window.setTimeout(function () {
                    div_new.style.cssText += cross('transition', time + 's') + '; ' + cross('transform', 'translate3d(0, 0, 0)', 'translate(0, 0)');
                    div_old.style.cssText += cross('transition', time + 's') + '; ' + cross('transform', 'translate3d(0, 0, 0)', 'translate(0, 0)');
                }, 1);
                break;

            case 'flip-left':
                // init divs
                div_old.style.cssText += 'overflow: hidden; ' + cross('transform', 'rotateY(0deg)');
                div_new.style.cssText += 'overflow: hidden; ' + cross('transform', 'rotateY(-180deg)');
                $(div_new).show();
                // -- need a timing function because otherwise not working
                window.setTimeout(function () {
                    div_new.style.cssText += cross('transition', time + 's') + '; ' + cross('transform', 'rotateY(0deg)');
                    div_old.style.cssText += cross('transition', time + 's') + '; ' + cross('transform', 'rotateY(180deg)');
                }, 1);
                break;

            case 'flip-right':
                // init divs
                div_old.style.cssText += 'overflow: hidden; ' + cross('transform', 'rotateY(0deg)');
                div_new.style.cssText += 'overflow: hidden; ' + cross('transform', 'rotateY(180deg)');
                $(div_new).show();
                // -- need a timing function because otherwise not working
                window.setTimeout(function () {
                    div_new.style.cssText += cross('transition', time + 's') + '; ' + cross('transform', 'rotateY(0deg)');
                    div_old.style.cssText += cross('transition', time + 's') + '; ' + cross('transform', 'rotateY(-180deg)');
                }, 1);
                break;

            case 'flip-down':
                // init divs
                div_old.style.cssText += 'overflow: hidden; ' + cross('transform', 'rotateX(0deg)');
                div_new.style.cssText += 'overflow: hidden; ' + cross('transform', 'rotateX(180deg)');
                $(div_new).show();
                // -- need a timing function because otherwise not working
                window.setTimeout(function () {
                    div_new.style.cssText += cross('transition', time + 's') + '; ' + cross('transform', 'rotateX(0deg)');
                    div_old.style.cssText += cross('transition', time + 's') + '; ' + cross('transform', 'rotateX(-180deg)');
                }, 1);
                break;

            case 'flip-up':
                // init divs
                div_old.style.cssText += 'overflow: hidden; ' + cross('transform', 'rotateX(0deg)');
                div_new.style.cssText += 'overflow: hidden; ' + cross('transform', 'rotateX(-180deg)');
                $(div_new).show();
                // -- need a timing function because otherwise not working
                window.setTimeout(function () {
                    div_new.style.cssText += cross('transition', time + 's') + '; ' + cross('transform', 'rotateX(0deg)');
                    div_old.style.cssText += cross('transition', time + 's') + '; ' + cross('transform', 'rotateX(180deg)');
                }, 1);
                break;

            case 'pop-in':
                // init divs
                div_old.style.cssText += 'overflow: hidden; ' + cross('transform', 'translate3d(0, 0, 0)', 'translate(0, 0)');
                div_new.style.cssText += 'overflow: hidden; ' + cross('transform', 'translate3d(0, 0, 0)', 'translate(0, 0)') + '; ' + cross('transform', 'scale(.8)') + '; opacity: 0;';
                $(div_new).show();
                // -- need a timing function because otherwise not working
                window.setTimeout(function () {
                    div_new.style.cssText += cross('transition', time + 's') + '; ' + cross('transform', 'scale(1)') + '; opacity: 1;';
                    div_old.style.cssText += cross('transition', time + 's') + ';';
                }, 1);
                break;

            case 'pop-out':
                // init divs
                div_old.style.cssText += 'overflow: hidden; ' + cross('transform', 'translate3d(0, 0, 0)', 'translate(0, 0)') + '; ' + cross('transform', 'scale(1)') + '; opacity: 1;';
                div_new.style.cssText += 'overflow: hidden; ' + cross('transform', 'translate3d(0, 0, 0)', 'translate(0, 0)') + '; opacity: 0;';
                $(div_new).show();
                // -- need a timing function because otherwise not working
                window.setTimeout(function () {
                    div_new.style.cssText += cross('transition', time + 's') + '; opacity: 1;';
                    div_old.style.cssText += cross('transition', time + 's') + '; ' + cross('transform', 'scale(1.7)') + '; opacity: 0;';
                }, 1);
                break;

            default:
                // init divs
                div_old.style.cssText += 'overflow: hidden; ' + cross('transform', 'translate3d(0, 0, 0)', 'translate(0, 0)');
                div_new.style.cssText += 'overflow: hidden; ' + cross('transform', 'translate3d(0, 0, 0)', 'translate(0, 0)') + '; opacity: 0;';
                $(div_new).show();
                // -- need a timing function because otherwise not working
                window.setTimeout(function () {
                    div_new.style.cssText += cross('transition', time + 's') + '; opacity: 1;';
                    div_old.style.cssText += cross('transition', time + 's');
                }, 1);
                break;
        }

        setTimeout(function () {
            if (type === 'slide-down') {
                $(div_old).css('z-index', '1019');
                $(div_new).css('z-index', '1020');
            }
            if (div_new) {
                $(div_new).css({ 'opacity': '1' }).css(w2utils.cssPrefix({
                    'transition': '',
                    'transform': '',
                    'backface-visibility': ''
                }));
            }
            if (div_old) {
                $(div_old).css({ 'opacity': '1' }).css(w2utils.cssPrefix({
                    'transition': '',
                    'transform': '',
                    'backface-visibility': ''
                }));
                if (div_old.parentNode) $(div_old.parentNode).css(w2utils.cssPrefix('perspective', ''));
            }
            if (typeof callBack === 'function') callBack();
        }, time * 1000);

        function cross(property, value, none_webkit_value) {
            var isWebkit = !!window.webkitURL; // jQuery no longer supports $.browser - RR
            if (!isWebkit && typeof none_webkit_value !== 'undefined') value = none_webkit_value;
            return ';' + property + ': ' + value + '; -webkit-' + property + ': ' + value + '; -moz-' + property + ': ' + value + '; ' +
                '-ms-' + property + ': ' + value + '; -o-' + property + ': ' + value + ';';
        }
    }

    function lock(box, msg, spinner) {
        var options = {};
        if (typeof msg === 'object') {
            options = msg;
        } else {
            options.msg = msg;
            options.spinner = spinner;
        }
        if (!options.msg && options.msg !== 0) options.msg = '';
        w2utils.unlock(box);
        $(box).prepend(
                '<div class="w2ui-lock"></div>' +
                '<div class="w2ui-lock-msg"></div>'
        );
        var $lock = $(box).find('.w2ui-lock');
        var mess = $(box).find('.w2ui-lock-msg');
        if (!options.msg) mess.css({ 'background-color': 'transparent', 'border': '0px' });
        if (options.spinner === true) options.msg = '<div class="w2ui-spinner" ' + (!options.msg ? 'style="width: 35px; height: 35px"' : '') + '></div>' + options.msg;
        if (options.opacity != null) $lock.css('opacity', options.opacity);
        if (typeof $lock.fadeIn == 'function') {
            $lock.fadeIn(200);
            mess.html(options.msg).fadeIn(200);
        } else {
            $lock.show();
            mess.html(options.msg).show(0);
        }
    }

    function unlock(box, speed) {
        if (isInt(speed)) {
            $(box).find('.w2ui-lock').fadeOut(speed);
            setTimeout(function () {
                $(box).find('.w2ui-lock').remove();
                $(box).find('.w2ui-lock-msg').remove();
            }, speed);
        } else {
            $(box).find('.w2ui-lock').remove();
            $(box).find('.w2ui-lock-msg').remove();
        }
    }

    function getSize(el, type) {
        var $el = $(el);
        var bwidth = {
            left: parseInt($el.css('border-left-width')) || 0,
            right: parseInt($el.css('border-right-width')) || 0,
            top: parseInt($el.css('border-top-width')) || 0,
            bottom: parseInt($el.css('border-bottom-width')) || 0
        };
        var mwidth = {
            left: parseInt($el.css('margin-left')) || 0,
            right: parseInt($el.css('margin-right')) || 0,
            top: parseInt($el.css('margin-top')) || 0,
            bottom: parseInt($el.css('margin-bottom')) || 0
        };
        var pwidth = {
            left: parseInt($el.css('padding-left')) || 0,
            right: parseInt($el.css('padding-right')) || 0,
            top: parseInt($el.css('padding-top')) || 0,
            bottom: parseInt($el.css('padding-bottom')) || 0
        };
        switch (type) {
            case 'top'      :
                return bwidth.top + mwidth.top + pwidth.top;
            case 'bottom'   :
                return bwidth.bottom + mwidth.bottom + pwidth.bottom;
            case 'left'     :
                return bwidth.left + mwidth.left + pwidth.left;
            case 'right'    :
                return bwidth.right + mwidth.right + pwidth.right;
            case 'width'    :
                return bwidth.left + bwidth.right + mwidth.left + mwidth.right + pwidth.left + pwidth.right + parseInt($el.width());
            case 'height'   :
                return bwidth.top + bwidth.bottom + mwidth.top + mwidth.bottom + pwidth.top + pwidth.bottom + parseInt($el.height());
            case '+width'   :
                return bwidth.left + bwidth.right + mwidth.left + mwidth.right + pwidth.left + pwidth.right;
            case '+height'  :
                return bwidth.top + bwidth.bottom + mwidth.top + mwidth.bottom + pwidth.top + pwidth.bottom;
        }
        return 0;
    }

    function checkName(params, component) { // was w2checkNameParam
        if (!params || typeof params.name === 'undefined') {
            console.log('ERROR: The parameter "name" is required but not supplied in $().' + component + '().');
            return false;
        }
        if (typeof w2ui[params.name] !== 'undefined') {
            console.log('ERROR: The parameter "name" is not unique. There are other objects already created with the same name (obj: ' + params.name + ').');
            return false;
        }
        if (!w2utils.isAlphaNumeric(params.name)) {
            console.log('ERROR: The parameter "name" has to be alpha-numeric (a-z, 0-9, dash and underscore). ');
            return false;
        }
        return true;
    }

    function checkUniqueId(id, items, itemsDecription, objName) { // was w2checkUniqueId
        if (!$.isArray(items)) items = [items];
        for (var i = 0; i < items.length; i++) {
            if (items[i].id === id) {
                console.log('ERROR: The parameter "id=' + id + '" is not unique within the current ' + itemsDecription + '. (obj: ' + objName + ')');
                return false;
            }
        }
        return true;
    }

    function parseRoute(route) {
        var keys = [];
        var path = route
            .replace(/\/\(/g, '(?:/')
            .replace(/\+/g, '__plus__')
            .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function (_, slash, format, key, capture, optional) {
                keys.push({ name: key, optional: !!optional });
                slash = slash || '';
                return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' + (optional || '');
            })
            .replace(/([\/.])/g, '\\$1')
            .replace(/__plus__/g, '(.+)')
            .replace(/\*/g, '(.*)');
        return {
            path: new RegExp('^' + path + '$', 'i'),
            keys: keys
        };
    }

    function cssPrefix(field, value, returnString) {
        var css = {};
        var newCSS = {};
        var ret = '';
        if (!$.isPlainObject(field)) {
            css[field] = value;
        } else {
            css = field;
            if (value === true) returnString = true;
        }
        for (var c in css) {
            newCSS[c] = css[c];
            newCSS['-webkit-' + c] = css[c];
            newCSS['-moz-' + c] = css[c].replace('-webkit-', '-moz-');
            newCSS['-ms-' + c] = css[c].replace('-webkit-', '-ms-');
            newCSS['-o-' + c] = css[c].replace('-webkit-', '-o-');
        }
        if (returnString === true) {
            for (var c in newCSS) {
                ret += c + ': ' + newCSS[c] + '; ';
            }
        } else {
            ret = newCSS;
        }
        return ret;
    }

})();

/***********************************************************
 *  Generic Event Object
 *  --- This object is reused across all other
 *  --- widgets in w2ui.
 *
 *********************************************************/

w2utils.event = {

    on: function (eventData, handler) {
        if (!$.isPlainObject(eventData)) eventData = { type: eventData };
        eventData = $.extend({ type: null, execute: 'before', target: null, onComplete: null }, eventData);

        if (!eventData.type) {
            console.log('ERROR: You must specify event type when calling .on() method of ' + this.name);
            return;
        }
        if (!handler) {
            console.log('ERROR: You must specify event handler function when calling .on() method of ' + this.name);
            return;
        }
        if (!$.isArray(this.handlers)) this.handlers = [];
        this.handlers.push({ event: eventData, handler: handler });
    },

    off: function (eventData, handler) {
        if (!$.isPlainObject(eventData)) eventData = { type: eventData };
        eventData = $.extend({}, { type: null, execute: 'before', target: null, onComplete: null }, eventData);

        if (!eventData.type) {
            console.log('ERROR: You must specify event type when calling .off() method of ' + this.name);
            return;
        }
        if (!handler) {
            handler = null;
        }
        // remove handlers
        var newHandlers = [];
        for (var h = 0, len = this.handlers.length; h < len; h++) {
            var t = this.handlers[h];
            if ((t.event.type === eventData.type || eventData.type === '*') &&
                (t.event.target === eventData.target || eventData.target === null) &&
                (t.handler === handler || handler === null)) {
                // match
            } else {
                newHandlers.push(t);
            }
        }
        this.handlers = newHandlers;
    },

    trigger: function (eventData) {
        var eventData = $.extend({ type: null, phase: 'before', target: null }, eventData, {
            isStopped: false, isCancelled: false,
            preventDefault: function () {
                this.isCancelled = true;
            },
            stopPropagation: function () {
                this.isStopped = true;
            }
        });
        if (eventData.phase === 'before') eventData.onComplete = null;
        var args, fun, tmp;
        if (eventData.target == null) eventData.target = null;
        if (!$.isArray(this.handlers)) this.handlers = [];
        // process events in REVERSE order
        for (var h = this.handlers.length - 1; h >= 0; h--) {
            var item = this.handlers[h];
            if ((item.event.type === eventData.type || item.event.type === '*') &&
                (item.event.target === eventData.target || item.event.target === null) &&
                (item.event.execute === eventData.phase || item.event.execute === '*' || item.event.phase === '*')) {
                eventData = $.extend({}, item.event, eventData);
                // check handler arguments
                args = [];
                tmp = new RegExp(/\((.*?)\)/).exec(item.handler);
                if (tmp) args = tmp[1].split(/\s*,\s*/);
                if (args.length === 2) {
                    item.handler.call(this, eventData.target, eventData); // old way for back compatibility
                } else {
                    item.handler.call(this, eventData); // new way
                }
                if (eventData.isStopped === true || eventData.stop === true) return eventData; // back compatibility eventData.stop === true
            }
        }
        // main object events
        var funName = 'on' + eventData.type.substr(0, 1).toUpperCase() + eventData.type.substr(1);
        if (eventData.phase === 'before' && typeof this[funName] === 'function') {
            fun = this[funName];
            // check handler arguments
            args = [];
            tmp = new RegExp(/\((.*?)\)/).exec(fun);
            if (tmp) args = tmp[1].split(/\s*,\s*/);
            if (args.length === 2) {
                fun.call(this, eventData.target, eventData); // old way for back compatibility
            } else {
                fun.call(this, eventData); // new way
            }
            if (eventData.isStopped === true || eventData.stop === true) return eventData; // back compatibility eventData.stop === true
        }
        // item object events
        if (eventData.object != null && eventData.phase === 'before' &&
            typeof eventData.object[funName] === 'function') {
            fun = eventData.object[funName];
            // check handler arguments
            args = [];
            tmp = new RegExp(/\((.*?)\)/).exec(fun);
            if (tmp) args = tmp[1].split(/\s*,\s*/);
            if (args.length === 2) {
                fun.call(this, eventData.target, eventData); // old way for back compatibility
            } else {
                fun.call(this, eventData); // new way
            }
            if (eventData.isStopped === true || eventData.stop === true) return eventData;
        }
        // execute onComplete
        if (eventData.phase === 'after' && typeof eventData.onComplete === 'function') eventData.onComplete.call(this, eventData);

        return eventData;
    }
};


/***********************************************************
 *  Commonly used plugins
 *  --- used primarily in grid and form
 *
 *********************************************************/

(function () {

    $.fn.w2render = function (name) {
        if ($(this).length > 0) {
            if (typeof name === 'string' && w2ui[name]) w2ui[name].render($(this)[0]);
            if (typeof name === 'object') name.render($(this)[0]);
        }
    };

    $.fn.w2destroy = function (name) {
        if (!name && this.length > 0) name = this.attr('name');
        if (typeof name === 'string' && w2ui[name]) w2ui[name].destroy();
        if (typeof name === 'object') name.destroy();
    };
})();
/************************************************************************
 *   Library: Web 2.0 UI for jQuery (using prototypical inheritance)
 *   - Following objects defined
 *        - w2layout        - layout widget
 *        - $().w2layout    - jQuery wrapper
 *   - Dependencies: jQuery, w2utils, w2toolbar, w2tabs
 *
 * == NICE TO HAVE ==
 *   - onResize for the panel
 *   - add more panel title positions (left=rotated, right=rotated, bottom)
 *   - bug: resizer is visible (and onHover) when panel is hidden.
 *   - bug: when you assign content before previous transition completed.
 *
 * == 1.5 changes
 *   - $('#layout').w2layout() - if called w/o argument then it returns layout object
 *
 ************************************************************************/

(function () {
    var w2layout = function (options) {
        this.box     = null;        // DOM Element that holds the element
        this.name    = null;        // unique name for w2ui
        this.panels  = [];
        this.tmp     = {};

        this.padding = 7;        // panel padding
        this.resizer = 7;        // resizer width or height
        this.style   = '';

        this.onShow         = null;
        this.onHide         = null;
        this.onResizing     = null;
        this.onResizerClick = null;
        this.onRender       = null;
        this.onRefresh      = null;
        this.onResize       = null;
        this.onDestroy      = null;

        $.extend(true, this, w2obj.layout, options);
    };

    var w2panels = ['top', 'left', 'main', 'preview', 'right', 'bottom'];

    // ====================================================
    // -- Registers as a jQuery plugin

    $.fn.w2layout = function(method) {
        if ($.isPlainObject(method)) {
            // check name parameter
            if (!w2utils.checkName(method, 'w2layout')) return;
            var panels = method.panels || [];
            var object = new w2layout(method);
            $.extend(object, { handlers: [], panels: [] });
            // add defined panels
            for (var p = 0, len = panels.length; p < len; p++) {
                object.panels[p] = $.extend(true, {}, w2layout.prototype.panel, panels[p]);
                if ($.isPlainObject(object.panels[p].tabs) || $.isArray(object.panels[p].tabs)) initTabs(object, panels[p].type);
                if ($.isPlainObject(object.panels[p].toolbar) || $.isArray(object.panels[p].toolbar)) initToolbar(object, panels[p].type);
            }
            // add all other panels
            for (var p1 = 0; p1 < w2panels.length; p1++) {
                if (object.get(w2panels[p1]) !== null) continue;
                object.panels.push($.extend(true, {}, w2layout.prototype.panel, { type: w2panels[p1], hidden: (w2panels[p1] !== 'main'), size: 50 }));
            }
            if ($(this).length > 0) {
                object.render($(this)[0]);
            }
            w2ui[object.name] = object;
            return object;

        } else {
            var obj = w2ui[$(this).attr('name')];
            if (!obj) return null;
            if (arguments.length > 0) {
                if (obj[method]) obj[method].apply(obj, Array.prototype.slice.call(arguments, 1));
                return this;
            } else {
                return obj;
            }
        }

        function initTabs(object, panel, tabs) {
            var pan = object.get(panel);
            if (pan !== null && typeof tabs == 'undefined') tabs = pan.tabs;
            if (pan === null || tabs === null) return false;
            // instanciate tabs
            if ($.isArray(tabs)) tabs = { tabs: tabs };
            $().w2destroy(object.name + '_' + panel + '_tabs'); // destroy if existed
            pan.tabs = $().w2tabs($.extend({}, tabs, { owner: object, name: object.name + '_' + panel + '_tabs' }));
            pan.show.tabs = true;
            return true;
        }

        function initToolbar(object, panel, toolbar) {
            var pan = object.get(panel);
            if (pan !== null && typeof toolbar == 'undefined') toolbar = pan.toolbar;
            if (pan === null || toolbar === null) return false;
            // instanciate toolbar
            if ($.isArray(toolbar)) toolbar = { items: toolbar };
            $().w2destroy(object.name + '_' + panel + '_toolbar'); // destroy if existed
            pan.toolbar = $().w2toolbar($.extend({}, toolbar, { owner: object, name: object.name + '_' + panel + '_toolbar' }));
            pan.show.toolbar = true;
            return true;
        }
    };

    // ====================================================
    // -- Implementation of core functionality

    w2layout.prototype = {
        // default setting for a panel
        panel: {
            type      : null,        // left, right, top, bottom
            title     : '',
            size      : 100,        // width or height depending on panel name
            minSize   : 20,
            maxSize   : false,
            hidden    : false,
            resizable : false,
            overflow  : 'hidden',
            style     : '',
            content   : '',        // can be String or Object with .render(box) method
            tabs      : null,
            toolbar   : null,
            width     : null,        // read only
            height    : null,        // read only
            show : {
                toolbar : false,
                tabs    : false
            },
            onRefresh : null,
            onShow    : null,
            onHide    : null
        },

        // alias for content
        html: function (panel, data, transition) {
            return this.content(panel, data, transition);
        },

        content: function (panel, data, transition) {
            var obj = this;
            var p = this.get(panel);
            // if it is CSS panel
            if (panel == 'css') {
                $('#layout_'+ obj.name +'_panel_css').html('<style>'+ data +'</style>');
                return true;
            }
            if (p === null) return false;
            if (typeof data == 'undefined' || data === null) {
                return p.content;
            } else {
                if (data instanceof jQuery) {
                    console.log('ERROR: You can not pass jQuery object to w2layout.content() method');
                    return false;
                }
                var pname    = '#layout_'+ this.name + '_panel_'+ p.type;
                var current  = $(pname + '> .w2ui-panel-content');
                var panelTop = 0;
                if (current.length > 0) {
                    $(pname).scrollTop(0);
                    panelTop = $(current).position().top;
                }
                if (p.content === '') {
                    p.content = data;
                    this.refresh(panel);
                } else {
                    p.content = data;
                    if (!p.hidden) {
                        if (transition !== null && transition !== '' && typeof transition != 'undefined') {
                            // apply transition
                            var div1 = $(pname + '> .w2ui-panel-content');
                            div1.after('<div class="w2ui-panel-content new-panel" style="'+ div1[0].style.cssText +'"></div>');
                            var div2 = $(pname + '> .w2ui-panel-content.new-panel');
                            div1.css('top', panelTop);
                            div2.css('top', panelTop);
                            if (typeof data == 'object') {
                                data.box = div2[0]; // do not do .render(box);
                                data.render();
                            } else {
                                div2.html(data);
                            }
                            w2utils.transition(div1[0], div2[0], transition, function () {
                                div1.remove();
                                div2.removeClass('new-panel');
                                div2.css('overflow', p.overflow);
                                // IE Hack
                                obj.resize();
                                if (window.navigator.userAgent.indexOf('MSIE') != -1) setTimeout(function () { obj.resize(); }, 100);
                            });
                        }
                    }
                    this.refresh(panel);
                }
            }
            // IE Hack
            obj.resize();
            if (window.navigator.userAgent.indexOf('MSIE') != -1) setTimeout(function () { obj.resize(); }, 100);
            return true;
        },

        load: function (panel, url, transition, onLoad) {
            var obj = this;
            if (panel == 'css') {
                $.get(url, function (data, status, xhr) { // should always be $.get as it is template
                    obj.content(panel, xhr.responseText);
                    if (onLoad) onLoad();
                });
                return true;
            }
            if (this.get(panel) !== null) {
                $.get(url, function (data, status, xhr) { // should always be $.get as it is template
                    obj.content(panel, xhr.responseText, transition);
                    if (onLoad) onLoad();
                    // IE Hack
                    obj.resize();
                    if (window.navigator.userAgent.indexOf('MSIE') != -1) setTimeout(function () { obj.resize(); }, 100);
                });
                return true;
            }
            return false;
        },

        sizeTo: function (panel, size) {
            var obj = this;
            var pan = obj.get(panel);
            if (pan === null) return false;
            // resize
            $(obj.box).find(' > div > .w2ui-panel').css(w2utils.cssPrefix('transition', '.2s'));
            setTimeout(function () {
                obj.set(panel, { size: size });
            }, 1);
            // clean
            setTimeout(function () {
                $(obj.box).find(' > div > .w2ui-panel').css(w2utils.cssPrefix('transition', '0s'));
                obj.resize();
            }, 500);
            return true;
        },

        show: function (panel, immediate) {
            var obj = this;
            // event before
            var eventData = this.trigger({ phase: 'before', type: 'show', target: panel, object: this.get(panel), immediate: immediate });
            if (eventData.isCancelled === true) return;

            var p = obj.get(panel);
            if (p === null) return false;
            p.hidden = false;
            if (immediate === true) {
                $('#layout_'+ obj.name +'_panel_'+panel).css({ 'opacity': '1' });
                obj.trigger($.extend(eventData, { phase: 'after' }));
                obj.resize();
            } else {
                // resize
                $('#layout_'+ obj.name +'_panel_'+panel).css({ 'opacity': '0' });
                $(obj.box).find(' > div > .w2ui-panel').css(w2utils.cssPrefix('transition', '.2s'));
                setTimeout(function () { obj.resize(); }, 1);
                // show
                setTimeout(function() {
                    $('#layout_'+ obj.name +'_panel_'+ panel).css({ 'opacity': '1' });
                }, 250);
                // clean
                setTimeout(function () {
                    $(obj.box).find(' > div > .w2ui-panel').css(w2utils.cssPrefix('transition', '0s'));
                    obj.trigger($.extend(eventData, { phase: 'after' }));
                    obj.resize();
                }, 500);
            }
            return true;
        },

        hide: function (panel, immediate) {
            var obj = this;
            // event before
            var eventData = this.trigger({ phase: 'before', type: 'hide', target: panel, object: this.get(panel), immediate: immediate });
            if (eventData.isCancelled === true) return;

            var p = obj.get(panel);
            if (p === null) return false;
            p.hidden = true;
            if (immediate === true) {
                $('#layout_'+ obj.name +'_panel_'+panel).css({ 'opacity': '0'    });
                obj.trigger($.extend(eventData, { phase: 'after' }));
                obj.resize();
            } else {
                // hide
                $(obj.box).find(' > div > .w2ui-panel').css(w2utils.cssPrefix('transition', '.2s'));
                $('#layout_'+ obj.name +'_panel_'+panel).css({ 'opacity': '0'    });
                setTimeout(function () { obj.resize(); }, 1);
                // clean
                setTimeout(function () {
                    $(obj.box).find(' > div > .w2ui-panel').css(w2utils.cssPrefix('transition', '0s'));
                    obj.trigger($.extend(eventData, { phase: 'after' }));
                    obj.resize();
                }, 500);
            }
            return true;
        },

        toggle: function (panel, immediate) {
            var p = this.get(panel);
            if (p === null) return false;
            if (p.hidden) return this.show(panel, immediate); else return this.hide(panel, immediate);
        },

        set: function (panel, options) {
            var ind = this.get(panel, true);
            if (ind === null) return false;
            $.extend(this.panels[ind], options);
            // refresh only when content changed
            if (typeof options['content'] != 'undefined') this.refresh(panel);
            // show/hide resizer
            this.resize(); // resize is needed when panel size is changed
            return true;
        },

        get: function (panel, returnIndex) {
            for (var p = 0; p < this.panels.length; p++) {
                if (this.panels[p].type == panel) {
                    if (returnIndex === true) return p; else return this.panels[p];
                }
            }
            return null;
        },

        el: function (panel) {
            var el = $('#layout_'+ this.name +'_panel_'+ panel +'> .w2ui-panel-content');
            if (el.length != 1) return null;
            return el[0];
        },

        hideToolbar: function (panel) {
            var pan = this.get(panel);
            if (!pan) return;
            pan.show.toolbar = false;
            $('#layout_'+ this.name +'_panel_'+ panel +'> .w2ui-panel-toolbar').hide();
            this.resize();
        },

        showToolbar: function (panel) {
            var pan = this.get(panel);
            if (!pan) return;
            pan.show.toolbar = true;
            $('#layout_'+ this.name +'_panel_'+ panel +'> .w2ui-panel-toolbar').show();
            this.resize();
        },

        toggleToolbar: function (panel) {
            var pan = this.get(panel);
            if (!pan) return;
            if (pan.show.toolbar) this.hideToolbar(panel); else this.showToolbar(panel);
        },

        hideTabs: function (panel) {
            var pan = this.get(panel);
            if (!pan) return;
            pan.show.tabs = false;
            $('#layout_'+ this.name +'_panel_'+ panel +'> .w2ui-panel-tabs').hide();
            this.resize();
        },

        showTabs: function (panel) {
            var pan = this.get(panel);
            if (!pan) return;
            pan.show.tabs = true;
            $('#layout_'+ this.name +'_panel_'+ panel +'> .w2ui-panel-tabs').show();
            this.resize();
        },

        toggleTabs: function (panel) {
            var pan = this.get(panel);
            if (!pan) return;
            if (pan.show.tabs) this.hideTabs(panel); else this.showTabs(panel);
        },

        render: function (box) {
            var obj = this;
            // if (window.getSelection) window.getSelection().removeAllRanges(); // clear selection
            var time = (new Date()).getTime();
            // event before
            var eventData = obj.trigger({ phase: 'before', type: 'render', target: obj.name, box: box });
            if (eventData.isCancelled === true) return;

            if (typeof box != 'undefined' && box !== null) {
                if ($(obj.box).find('#layout_'+ obj.name +'_panel_main').length > 0) {
                    $(obj.box)
                        .removeAttr('name')
                        .removeClass('w2ui-layout')
                        .html('');
                }
                obj.box = box;
            }
            if (!obj.box) return false;
            $(obj.box)
                .attr('name', obj.name)
                .addClass('w2ui-layout')
                .html('<div></div>');
            if ($(obj.box).length > 0) $(obj.box)[0].style.cssText += obj.style;
            // create all panels
            for (var p1 = 0; p1 < w2panels.length; p1++) {
                var pan  = obj.get(w2panels[p1]);
                var html =  '<div id="layout_'+ obj.name + '_panel_'+ w2panels[p1] +'" class="w2ui-panel">'+
                    '    <div class="w2ui-panel-title"></div>'+
                    '    <div class="w2ui-panel-tabs"></div>'+
                    '    <div class="w2ui-panel-toolbar"></div>'+
                    '    <div class="w2ui-panel-content"></div>'+
                    '</div>'+
                    '<div id="layout_'+ obj.name + '_resizer_'+ w2panels[p1] +'" class="w2ui-resizer"></div>';
                $(obj.box).find(' > div').append(html);
                // tabs are rendered in refresh()
            }
            $(obj.box).find(' > div')
                .append('<div id="layout_'+ obj.name + '_panel_css" style="position: absolute; top: 10000px;"></div');
            obj.refresh(); // if refresh is not called here, the layout will not be available right after initialization
            // process event
            obj.trigger($.extend(eventData, { phase: 'after' }));
            // reinit events
            setTimeout(function () { // needed this timeout to allow browser to render first if there are tabs or toolbar
                initEvents();
                obj.resize();
            }, 0);
            return (new Date()).getTime() - time;

            function initEvents() {
                obj.tmp.events = {
                    resize : function (event) {
                        w2ui[obj.name].resize();
                    },
                    resizeStart: obj.resize_cancel ? resizeStart : resizeStart,
                    mouseMove: obj.resize_cancel ? resizeMove : resizeMoveUpdate,
                    mouseUp: obj.resize_cancel ? resizeStop : resizeStop
                };
                $(window).on('resize', obj.tmp.events.resize);
            }

            function resizeStart(type, evnt) {
                if (!obj.box) return;
                if (!evnt) evnt = window.event;
                if (!window.addEventListener) { window.document.attachEvent('onselectstart', function() { return false; } ); }
                $(document).off('mousemove', obj.tmp.events.mouseMove).on('mousemove', obj.tmp.events.mouseMove);
                $(document).off('mouseup', obj.tmp.events.mouseUp).on('mouseup', obj.tmp.events.mouseUp);
                obj.tmp.resize = {
                    type    : type,
                    x       : evnt.screenX,
                    y       : evnt.screenY,
                    diff_x  : 0,
                    diff_y  : 0,
                    value   : 0
                };
                // lock all panels
                for (var p1 = 0; p1 < w2panels.length; p1++) {
                    var $tmp = $(obj.el(w2panels[p1])).parent().find('.w2ui-lock');
                    if ($tmp.length > 0) {
                        $tmp.attr('locked', 'previous');
                    } else {
                        obj.lock(w2panels[p1], { opacity: 0 });
                    }
                }
                if (type == 'left' || type == 'right') {
                    obj.tmp.resize.value = parseInt($('#layout_'+ obj.name +'_resizer_'+ type)[0].style.left);
                }
                if (type == 'top' || type == 'preview' || type == 'bottom') {
                    obj.tmp.resize.value = parseInt($('#layout_'+ obj.name +'_resizer_'+ type)[0].style.top);
                }
            }

            function resizeStop(evnt) {
                if (!obj.box) return;
                if (!evnt) evnt = window.event;
                if (!window.addEventListener) { window.document.attachEvent('onselectstart', function() { return false; } ); }
                $(document).off('mousemove', obj.tmp.events.mouseMove);
                $(document).off('mouseup', obj.tmp.events.mouseUp);
                if (typeof obj.tmp.resize == 'undefined') return;
                // unlock all panels
                for (var p1 = 0; p1 < w2panels.length; p1++) {
                    var $tmp = $(obj.el(w2panels[p1])).parent().find('.w2ui-lock');
                    if ($tmp.attr('locked') == 'previous') {
                        $tmp.removeAttr('locked');
                    } else {
                        obj.unlock(w2panels[p1]);
                    }
                }
                // set new size
                if (obj.tmp.diff_x !== 0 || obj.tmp.resize.diff_y !== 0) { // only recalculate if changed
                    var ptop    = obj.get('top');
                    var pbottom = obj.get('bottom');
                    var panel   = obj.get(obj.tmp.resize.type);
                    var height  = parseInt($(obj.box).height());
                    var width   = parseInt($(obj.box).width());
                    var str     = String(panel.size);
                    var ns, nd;
                    switch (obj.tmp.resize.type) {
                        case 'top':
                            ns = parseInt(panel.sizeCalculated) + obj.tmp.resize.diff_y;
                            nd = 0;
                            break;
                        case 'bottom':
                            ns = parseInt(panel.sizeCalculated) - obj.tmp.resize.diff_y;
                            nd = 0;
                            break;
                        case 'preview':
                            ns = parseInt(panel.sizeCalculated) - obj.tmp.resize.diff_y;
                            nd = (ptop && !ptop.hidden ? ptop.sizeCalculated : 0) +
                                (pbottom && !pbottom.hidden ? pbottom.sizeCalculated : 0);
                            break;
                        case 'left':
                            ns = parseInt(panel.sizeCalculated) + obj.tmp.resize.diff_x;
                            nd = 0;
                            break;
                        case 'right':
                            ns = parseInt(panel.sizeCalculated) - obj.tmp.resize.diff_x;
                            nd = 0;
                            break;
                    }
                    // set size
                    if (str.substr(str.length-1) == '%') {
                        panel.size = Math.floor(ns * 100 /
                            (panel.type == 'left' || panel.type == 'right' ? width : height - nd) * 100) / 100 + '%';
                    } else {
                        panel.size = ns;
                    }
                    obj.resize();
                }
                $('#layout_'+ obj.name + '_resizer_'+ obj.tmp.resize.type).removeClass('active');
                delete obj.tmp.resize;
            }

            function resizeMoveUpdate(evnt) {
                if (!obj.box) return;
                if (!evnt) evnt = window.event;
                if (typeof obj.tmp.resize == 'undefined') return;
                var panel = obj.get(obj.tmp.resize.type);
                // event before
                var tmp = obj.tmp.resize;
                var eventData = obj.trigger({ phase: 'before', type: 'resizing', target: obj.name, object: panel, originalEvent: evnt,
                    panel: tmp ? tmp.type : 'all', diff_x: tmp ? tmp.diff_x : 0, diff_y: tmp ? tmp.diff_y : 0 });
                if (eventData.isCancelled === true) return;

                var p = $('#layout_' + obj.name + '_resizer_' + tmp.type);
                var resize_x = (evnt.screenX - tmp.x);
                var resize_y = (evnt.screenY - tmp.y);
                var mainPanel = obj.get('main');
                if (!p.hasClass('active')) p.addClass('active');

                switch (tmp.type) {
                    case 'left':
                        if (panel.minSize - resize_x > panel.width) {
                            resize_x = panel.minSize - panel.width;
                        }
                        if (panel.maxSize && (panel.width + resize_x > panel.maxSize)) {
                            resize_x = panel.maxSize - panel.width;
                        }
                        if (mainPanel.minSize + resize_x > mainPanel.width) {
                            resize_x = mainPanel.width - mainPanel.minSize;
                        }
                        break;

                    case 'right':
                        if (panel.minSize + resize_x > panel.width) {
                            resize_x = panel.width - panel.minSize;
                        }
                        if (panel.maxSize && (panel.width - resize_x > panel.maxSize)) {
                            resize_x = panel.width - panel.maxSize;
                        }
                        if (mainPanel.minSize - resize_x > mainPanel.width) {
                            resize_x = mainPanel.minSize - mainPanel.width;
                        }
                        break;

                    case 'top':
                        if (panel.minSize - resize_y > panel.height) {
                            resize_y = panel.minSize - panel.height;
                        }
                        if (panel.maxSize && (panel.height + resize_y > panel.maxSize)) {
                            resize_y = panel.maxSize - panel.height;
                        }
                        if (mainPanel.minSize + resize_y > mainPanel.height) {
                            resize_y = mainPanel.height - mainPanel.minSize;
                        }
                        break;

                    case 'preview':
                    case 'bottom':
                        if (panel.minSize + resize_y > panel.height) {
                            resize_y = panel.height - panel.minSize;
                        }
                        if (panel.maxSize && (panel.height - resize_y > panel.maxSize)) {
                            resize_y = panel.height - panel.maxSize;
                        }
                        if (mainPanel.minSize - resize_y > mainPanel.height) {
                            resize_y = mainPanel.minSize - mainPanel.height;
                        }
                        break;
                }
                tmp.diff_x = resize_x;
                tmp.diff_y = resize_y;
                if (obj.tmp.diff_x !== 0 || obj.tmp.resize.diff_y !== 0) { // only recalculate if changed
                    var ptop = obj.get('top');
                    var pbottom = obj.get('bottom');
                    var panel = obj.get(obj.tmp.resize.type);
                    var height = parseInt($(obj.box).height());
                    var width = parseInt($(obj.box).width());
                    var str = String(panel.size);
                    var ns, nd;
                    switch (obj.tmp.resize.type) {
                        case 'top':
                            ns = parseInt(panel.sizeCalculated) + obj.tmp.resize.diff_y;
                            nd = 0;
                            break;
                        case 'bottom':
                            ns = parseInt(panel.sizeCalculated) - obj.tmp.resize.diff_y;
                            nd = 0;
                            break;
                        case 'preview':
                            ns = parseInt(panel.sizeCalculated) - obj.tmp.resize.diff_y;
                            nd = (ptop && !ptop.hidden ? ptop.sizeCalculated : 0) +
                                (pbottom && !pbottom.hidden ? pbottom.sizeCalculated : 0);
                            break;
                        case 'left':
                            ns = parseInt(panel.sizeCalculated) + obj.tmp.resize.diff_x;
                            nd = 0;
                            break;
                        case 'right':
                            ns = parseInt(panel.sizeCalculated) - obj.tmp.resize.diff_x;
                            nd = 0;
                            break;
                    }
                    if (str.substr(str.length - 1) == '%') {
                        panel.size = Math.floor(ns * 100 /
                            (panel.type == 'left' || panel.type == 'right' ? width : height - nd) * 100) / 100 + '%';
                    } else {
                        panel.size = ns;
                    }
                    tmp.diff_x = 0;
                    tmp.diff_y = 0;
                    tmp.x = evnt.screenX;
                    tmp.y = evnt.screenY;
                    obj.resize();


                    // event after
                    obj.trigger($.extend(eventData, { phase: 'after' }));
                }
            }

            function resizeMove(evnt) {
                if (!obj.box) return;
                if (!evnt) evnt = window.event;
                if (typeof obj.tmp.resize == 'undefined') return;
                var panel = obj.get(obj.tmp.resize.type);
                // event before
                var tmp = obj.tmp.resize;
                var eventData = obj.trigger({ phase: 'before', type: 'resizing', target: obj.name, object: panel, originalEvent: evnt,
                    panel: tmp ? tmp.type : 'all', diff_x: tmp ? tmp.diff_x : 0, diff_y: tmp ? tmp.diff_y : 0 });
                if (eventData.isCancelled === true) return;

                var p         = $('#layout_'+ obj.name + '_resizer_'+ tmp.type);
                var resize_x  = (evnt.screenX - tmp.x);
                var resize_y  = (evnt.screenY - tmp.y);
                var mainPanel = obj.get('main');

                if (!p.hasClass('active')) p.addClass('active');

                switch (tmp.type) {
                    case 'left':
                        if (panel.minSize - resize_x > panel.width) {
                            resize_x = panel.minSize - panel.width;
                        }
                        if (panel.maxSize && (panel.width + resize_x > panel.maxSize)) {
                            resize_x = panel.maxSize - panel.width;
                        }
                        if (mainPanel.minSize + resize_x > mainPanel.width) {
                            resize_x = mainPanel.width - mainPanel.minSize;
                        }
                        break;

                    case 'right':
                        if (panel.minSize + resize_x > panel.width) {
                            resize_x = panel.width - panel.minSize;
                        }
                        if (panel.maxSize && (panel.width - resize_x > panel.maxSize)) {
                            resize_x = panel.width - panel.maxSize;
                        }
                        if (mainPanel.minSize - resize_x > mainPanel.width) {
                            resize_x = mainPanel.minSize - mainPanel.width;
                        }
                        break;

                    case 'top':
                        if (panel.minSize - resize_y > panel.height) {
                            resize_y = panel.minSize - panel.height;
                        }
                        if (panel.maxSize && (panel.height + resize_y > panel.maxSize)) {
                            resize_y = panel.maxSize - panel.height;
                        }
                        if (mainPanel.minSize + resize_y > mainPanel.height) {
                            resize_y = mainPanel.height - mainPanel.minSize;
                        }
                        break;

                    case 'preview':
                    case 'bottom':
                        if (panel.minSize + resize_y > panel.height) {
                            resize_y = panel.height - panel.minSize;
                        }
                        if (panel.maxSize && (panel.height - resize_y > panel.maxSize)) {
                            resize_y = panel.height - panel.maxSize;
                        }
                        if (mainPanel.minSize - resize_y > mainPanel.height) {
                            resize_y = mainPanel.minSize - mainPanel.height;
                        }
                        break;
                }
                tmp.diff_x = resize_x;
                tmp.diff_y = resize_y;

                switch (tmp.type) {
                    case 'top':
                    case 'preview':
                    case 'bottom':
                        tmp.diff_x = 0;
                        if (p.length > 0) p[0].style.top = (tmp.value + tmp.diff_y) + 'px';
                        break;

                    case 'left':
                    case 'right':
                        tmp.diff_y = 0;
                        if (p.length > 0) p[0].style.left = (tmp.value + tmp.diff_x) + 'px';
                        break;
                }
                // event after
                obj.trigger($.extend(eventData, { phase: 'after' }));
            }
        },

        refresh: function (panel) {
            var obj = this;
            // if (window.getSelection) window.getSelection().removeAllRanges(); // clear selection
            if (typeof panel == 'undefined') panel = null;
            var time = (new Date()).getTime();
            // event before
            var eventData = obj.trigger({ phase: 'before', type: 'refresh', target: (typeof panel != 'undefined' ? panel : obj.name), object: obj.get(panel) });
            if (eventData.isCancelled === true) return;
            // obj.unlock(panel);
            if (typeof panel == 'string') {
                var p = obj.get(panel);
                if (p === null) return;
                var pname = '#layout_'+ obj.name + '_panel_'+ p.type;
                var rname = '#layout_'+ obj.name +'_resizer_'+ p.type;
                // apply properties to the panel
                $(pname).css({ display: p.hidden ? 'none' : 'block' });
                if (p.resizable) $(rname).show(); else $(rname).hide();
                // insert content
                if (typeof p.content == 'object' && typeof p.content.render === 'function') {
                    p.content.box = $(pname +'> .w2ui-panel-content')[0];
                    setTimeout(function () {
                        // need to remove unnecessary classes
                        if ($(pname +'> .w2ui-panel-content').length > 0) {
                            $(pname +'> .w2ui-panel-content')
                                .removeClass()
                                .removeAttr('name')
                                .addClass('w2ui-panel-content')
                                .css('overflow', p.overflow)[0].style.cssText += ';' + p.style;
                        }
                        p.content.render(); // do not do .render(box);
                    }, 1);
                } else {
                    // need to remove unnecessary classes
                    if ($(pname +'> .w2ui-panel-content').length > 0) {
                        $(pname +'> .w2ui-panel-content')
                            .removeClass()
                            .removeAttr('name')
                            .addClass('w2ui-panel-content')
                            .html(p.content)
                            .css('overflow', p.overflow)[0].style.cssText += ';' + p.style;
                    }
                }
                // if there are tabs and/or toolbar - render it
                var tmp = $(obj.box).find(pname +'> .w2ui-panel-tabs');
                if (p.show.tabs) {
                    if (tmp.find('[name='+ p.tabs.name +']').length === 0 && p.tabs !== null) tmp.w2render(p.tabs); else p.tabs.refresh();
                } else {
                    tmp.html('').removeClass('w2ui-tabs').hide();
                }
                tmp = $(obj.box).find(pname +'> .w2ui-panel-toolbar');
                if (p.show.toolbar) {
                    if (tmp.find('[name='+ p.toolbar.name +']').length === 0 && p.toolbar !== null) tmp.w2render(p.toolbar); else p.toolbar.refresh();
                } else {
                    tmp.html('').removeClass('w2ui-toolbar').hide();
                }
                // show title
                tmp = $(obj.box).find(pname +'> .w2ui-panel-title');
                if (p.title) {
                    tmp.html(p.title).show();
                } else {
                    tmp.html('').hide();
                }
            } else {
                if ($('#layout_'+ obj.name +'_panel_main').length == 0) {
                    obj.render();
                    return;
                }
                obj.resize();
                // refresh all of them
                for (var p1 = 0; p1 < this.panels.length; p1++) { obj.refresh(this.panels[p1].type); }
            }
            obj.trigger($.extend(eventData, { phase: 'after' }));
            return (new Date()).getTime() - time;
        },

        resize: function () {
            // if (window.getSelection) window.getSelection().removeAllRanges();    // clear selection
            if (!this.box) return false;
            var time = (new Date()).getTime();
            // event before
            var tmp = this.tmp.resize;
            var eventData = this.trigger({ phase: 'before', type: 'resize', target: this.name,
                panel: tmp ? tmp.type : 'all', diff_x: tmp ? tmp.diff_x : 0, diff_y: tmp ? tmp.diff_y : 0  });
            if (eventData.isCancelled === true) return;
            if (this.padding < 0) this.padding = 0;

            // layout itself
            var width  = parseInt($(this.box).width());
            var height = parseInt($(this.box).height());
            $(this.box).find(' > div').css({
                width    : width + 'px',
                height    : height + 'px'
            });
            var obj = this;

            var separator = (this.resizer > this.padding ? this.resizer : this.padding);
            // panels
            var pmain   = this.get('main');
            var pprev   = this.get('preview');
            var pleft   = this.get('left');
            var pright  = this.get('right');
            var ptop    = this.get('top');
            var pbottom = this.get('bottom');
            var smain   = (pmain !== null && pmain.hidden !== true ? true : false);; // main always on
            var sprev   = (pprev !== null && pprev.hidden !== true ? true : false);
            var sleft   = (pleft !== null && pleft.hidden !== true ? true : false);
            var sright  = (pright !== null && pright.hidden !== true ? true : false);
            var stop    = (ptop !== null && ptop.hidden !== true ? true : false);
            var sbottom = (pbottom !== null && pbottom.hidden !== true ? true : false);
            var l, t, w, h, e;
            // calculate %
            for (var p = 0; p < w2panels.length; p++) {
                if (w2panels[p] === 'main') continue;
                var tmp = this.get(w2panels[p]);
                if (!tmp) continue;
                var str = String(tmp.size || 0);
                if (str.substr(str.length-1) == '%') {
                    var tmph = height;
                    if (tmp.type == 'preview') {
                        tmph = tmph -
                            (ptop && !ptop.hidden ? ptop.sizeCalculated : 0) -
                            (pbottom && !pbottom.hidden ? pbottom.sizeCalculated : 0);
                    }
                    tmp.sizeCalculated = parseInt((tmp.type == 'left' || tmp.type == 'right' ? width : tmph) * parseFloat(tmp.size) / 100);
                } else {
                    tmp.sizeCalculated = parseInt(tmp.size);
                }
                tmp.sizeCalculated = Math.max(tmp.sizeCalculated, parseInt(tmp.minSize));
            }
            // top if any
            if (ptop !== null && ptop.hidden !== true) {
                l = 0;
                t = 0;
                w = width;
                h = ptop.sizeCalculated;
                $('#layout_'+ this.name +'_panel_top').css({
                    'display': 'block',
                    'left': l + 'px',
                    'top': t + 'px',
                    'width': w + 'px',
                    'height': h + 'px'
                }).show();
                ptop.width  = w;
                ptop.height = h;
                // resizer
                if (ptop.resizable) {
                    t = ptop.sizeCalculated - (this.padding === 0 ? this.resizer : 0);
                    h = (this.resizer > this.padding ? this.resizer : this.padding);
                    $('#layout_'+ this.name +'_resizer_top').show().css({
                        'display': 'block',
                        'left': l + 'px',
                        'top': t + 'px',
                        'width': w + 'px',
                        'height': h + 'px',
                        'cursor': 'ns-resize'
                    }).off('mousedown').on('mousedown', function (event) {
                        // event before
                        var eventData = obj.trigger({ phase: 'before', type: 'resizerClick', target: 'top', originalEvent: event });
                        if (eventData.isCancelled === true) return;
                        // default action
                        w2ui[obj.name].tmp.events.resizeStart('top', event);
                        // event after
                        obj.trigger($.extend(eventData, { phase: 'after' }));
                        return false;
                    });
                }
            } else {
                $('#layout_'+ this.name +'_panel_top').hide();
                $('#layout_'+ this.name +'_resizer_top').hide();
            }
            // left if any
            if (pleft !== null && pleft.hidden !== true) {
                l = 0;
                t = 0 + (stop ? ptop.sizeCalculated + this.padding : 0);
                w = pleft.sizeCalculated;
                h = height - (stop ? ptop.sizeCalculated + this.padding : 0) -
                    (sbottom ? pbottom.sizeCalculated + this.padding : 0);
                e = $('#layout_'+ this.name +'_panel_left');
                if (window.navigator.userAgent.indexOf('MSIE') != -1 && e.length > 0 && e[0].clientHeight < e[0].scrollHeight) w += 17; // IE hack
                e.css({
                    'display': 'block',
                    'left': l + 'px',
                    'top': t + 'px',
                    'width': w + 'px',
                    'height': h + 'px'
                }).show();
                pleft.width  = w;
                pleft.height = h;
                // resizer
                if (pleft.resizable) {
                    l = pleft.sizeCalculated - (this.padding === 0 ? this.resizer : 0);
                    w = (this.resizer > this.padding ? this.resizer : this.padding);
                    $('#layout_'+ this.name +'_resizer_left').show().css({
                        'display': 'block',
                        'left': l + 'px',
                        'top': t + 'px',
                        'width': w + 'px',
                        'height': h + 'px',
                        'cursor': 'ew-resize'
                    }).off('mousedown').on('mousedown', function (event) {
                        // event before
                        var eventData = obj.trigger({ phase: 'before', type: 'resizerClick', target: 'left', originalEvent: event });
                        if (eventData.isCancelled === true) return;
                        // default action
                        w2ui[obj.name].tmp.events.resizeStart('left', event);
                        // event after
                        obj.trigger($.extend(eventData, { phase: 'after' }));
                        return false;
                    });
                }
            } else {
                $('#layout_'+ this.name +'_panel_left').hide();
                $('#layout_'+ this.name +'_resizer_left').hide();
            }
            // right if any
            if (pright !== null && pright.hidden !== true) {
                l = width - pright.sizeCalculated;
                t = 0 + (stop ? ptop.sizeCalculated + this.padding : 0);
                w = pright.sizeCalculated;
                h = height - (stop ? ptop.sizeCalculated + this.padding : 0) -
                    (sbottom ? pbottom.sizeCalculated + this.padding : 0);
                $('#layout_'+ this.name +'_panel_right').css({
                    'display': 'block',
                    'left': l + 'px',
                    'top': t + 'px',
                    'width': w + 'px',
                    'height': h + 'px'
                }).show();
                pright.width  = w;
                pright.height = h;
                // resizer
                if (pright.resizable) {
                    l = l - this.padding;
                    w = (this.resizer > this.padding ? this.resizer : this.padding);
                    $('#layout_'+ this.name +'_resizer_right').show().css({
                        'display': 'block',
                        'left': l + 'px',
                        'top': t + 'px',
                        'width': w + 'px',
                        'height': h + 'px',
                        'cursor': 'ew-resize'
                    }).off('mousedown').on('mousedown', function (event) {
                        // event before
                        var eventData = obj.trigger({ phase: 'before', type: 'resizerClick', target: 'right', originalEvent: event });
                        if (eventData.isCancelled === true) return;
                        // default action
                        w2ui[obj.name].tmp.events.resizeStart('right', event);
                        // event after
                        obj.trigger($.extend(eventData, { phase: 'after' }));
                        return false;
                    });
                }
            } else {
                $('#layout_'+ this.name +'_panel_right').hide();
                $('#layout_'+ this.name +'_resizer_right').hide();
            }
            // bottom if any
            if (pbottom !== null && pbottom.hidden !== true) {
                l = 0;
                t = height - pbottom.sizeCalculated;
                w = width;
                h = pbottom.sizeCalculated;
                $('#layout_'+ this.name +'_panel_bottom').css({
                    'display': 'block',
                    'left': l + 'px',
                    'top': t + 'px',
                    'width': w + 'px',
                    'height': h + 'px'
                }).show();
                pbottom.width  = w;
                pbottom.height = h;
                // resizer
                if (pbottom.resizable) {
                    t = t - (this.padding === 0 ? 0 : this.padding);
                    h = (this.resizer > this.padding ? this.resizer : this.padding);
                    $('#layout_'+ this.name +'_resizer_bottom').show().css({
                        'display': 'block',
                        'left': l + 'px',
                        'top': t + 'px',
                        'width': w + 'px',
                        'height': h + 'px',
                        'cursor': 'ns-resize'
                    }).off('mousedown').on('mousedown', function (event) {
                        // event before
                        var eventData = obj.trigger({ phase: 'before', type: 'resizerClick', target: 'bottom', originalEvent: event });
                        if (eventData.isCancelled === true) return;
                        // default action
                        w2ui[obj.name].tmp.events.resizeStart('bottom', event);
                        // event after
                        obj.trigger($.extend(eventData, { phase: 'after' }));
                        return false;
                    });
                }
            } else {
                $('#layout_'+ this.name +'_panel_bottom').hide();
                $('#layout_'+ this.name +'_resizer_bottom').hide();
            }
            if (pmain !== null && pmain.hidden !== true) {
                // main - not always there
                l = 0 + (sleft ? pleft.sizeCalculated + this.padding : 0);
                t = 0 + (stop ? ptop.sizeCalculated + this.padding : 0);
                w = width - (sleft ? pleft.sizeCalculated + this.padding : 0) -
                    (sright ? pright.sizeCalculated + this.padding : 0);
                h = height - (stop ? ptop.sizeCalculated + this.padding : 0) -
                    (sbottom ? pbottom.sizeCalculated + this.padding : 0) -
                    (sprev ? pprev.sizeCalculated + this.padding : 0);
                e = $('#layout_' + this.name + '_panel_main');
                if (window.navigator.userAgent.indexOf('MSIE') != -1 && e.length > 0 && e[0].clientHeight < e[0].scrollHeight) w += 17; // IE hack
                e.css({
                    'display': 'block',
                    'left': l + 'px',
                    'top': t + 'px',
                    'width': w + 'px',
                    'height': h + 'px'
                });
                pmain.width = w;
                pmain.height = h;
            } else {
                $('#layout_'+ this.name +'_panel_main').hide();
            }

            // preview if any
            if (pprev !== null && pprev.hidden !== true) {
                l = 0 + (sleft ? pleft.sizeCalculated + this.padding : 0);
                t = 0 + (stop ? ptop.sizeCalculated + this.padding : 0) + (smain ? pmain.height + this.padding : 0);
                w = width  - (sleft ? pleft.sizeCalculated + this.padding : 0) -
                    (sright ? pright.sizeCalculated + this.padding : 0);
                h = height - (t - (sbottom ? pbottom.sizeCalculated + this.padding : 0));
                e = $('#layout_'+ this.name +'_panel_preview');
                if (window.navigator.userAgent.indexOf('MSIE') != -1 && e.length > 0 && e[0].clientHeight < e[0].scrollHeight) w += 17; // IE hack
                e.css({
                    'display': 'block',
                    'left': l + 'px',
                    'top': t + 'px',
                    'width': w + 'px',
                    'height': h + 'px'
                }).show();
                pprev.width  = w;
                pprev.height = h;
                // resizer
                if (pprev.resizable) {
                    t = t - (this.padding === 0 ? 0 : this.padding);
                    h = (this.resizer > this.padding ? this.resizer : this.padding);
                    $('#layout_'+ this.name +'_resizer_preview').show().css({
                        'display': 'block',
                        'left': l + 'px',
                        'top': t + 'px',
                        'width': w + 'px',
                        'height': h + 'px',
                        'cursor': 'ns-resize'
                    }).off('mousedown').on('mousedown', function (event) {
                        // event before
                        var eventData = obj.trigger({ phase: 'before', type: 'resizerClick', target: 'preview', originalEvent: event });
                        if (eventData.isCancelled === true) return;
                        // default action
                        w2ui[obj.name].tmp.events.resizeStart('preview', event);
                        // event after
                        obj.trigger($.extend(eventData, { phase: 'after' }));
                        return false;
                    });
                }
            } else {
                $('#layout_'+ this.name +'_panel_preview').hide();
                $('#layout_'+ this.name +'_resizer_preview').hide();
            }

            // display tabs and toolbar if needed
            for (var p1 = 0; p1 < w2panels.length; p1++) {
                var pan = this.get(w2panels[p1]);
                var tmp2 = '#layout_'+ this.name +'_panel_'+ w2panels[p1] +' > .w2ui-panel-';
                var tabHeight = 0;
                if (pan) {
                    if (pan.title) {
                        tabHeight += w2utils.getSize($(tmp2 + 'title').css({ top: tabHeight + 'px', display: 'block' }), 'height');
                    }
                    if (pan.show.tabs) {
                        if (pan.tabs !== null && w2ui[this.name +'_'+ w2panels[p1] +'_tabs']) w2ui[this.name +'_'+ w2panels[p1] +'_tabs'].resize();
                        tabHeight += w2utils.getSize($(tmp2 + 'tabs').css({ top: tabHeight + 'px', display: 'block' }), 'height');
                    }
                    if (pan.show.toolbar) {
                        if (pan.toolbar !== null && w2ui[this.name +'_'+ w2panels[p1] +'_toolbar']) w2ui[this.name +'_'+ w2panels[p1] +'_toolbar'].resize();
                        tabHeight += w2utils.getSize($(tmp2 + 'toolbar').css({ top: tabHeight + 'px', display: 'block' }), 'height');
                    }
                }
                $(tmp2 + 'content').css({ display: 'block' }).css({ top: tabHeight + 'px' });
            }
            // send resize to all objects
            clearTimeout(this._resize_timer);
            this._resize_timer = setTimeout(function () {
                for (var e in w2ui) {
                    if (typeof w2ui[e].resize == 'function') {
                        // sent to all none-layouts
                        if (w2ui[e].panels == 'undefined') w2ui[e].resize();
                        // only send to nested layouts
                        var parent = $(w2ui[e].box).parents('.w2ui-layout');
                        if (parent.length > 0 && parent.attr('name') == obj.name) w2ui[e].resize();
                    }
                }
            }, 100);
            this.trigger($.extend(eventData, { phase: 'after' }));
            return (new Date()).getTime() - time;
        },

        destroy: function () {
            // event before
            var eventData = this.trigger({ phase: 'before', type: 'destroy', target: this.name });
            if (eventData.isCancelled === true) return;
            if (typeof w2ui[this.name] == 'undefined') return false;
            // clean up
            if ($(this.box).find('#layout_'+ this.name +'_panel_main').length > 0) {
                $(this.box)
                    .removeAttr('name')
                    .removeClass('w2ui-layout')
                    .html('');
            }
            delete w2ui[this.name];
            // event after
            this.trigger($.extend(eventData, { phase: 'after' }));
            if (this.tmp.events && this.tmp.events.resize) $(window).off('resize', this.tmp.events.resize);
            return true;
        },

        lock: function (panel, msg, showSpinner) {
            if (w2panels.indexOf(panel) == -1) {
                console.log('ERROR: First parameter needs to be the a valid panel name.');
                return;
            }
            var args = Array.prototype.slice.call(arguments, 0);
            args[0]  = '#layout_'+ this.name + '_panel_' + panel;
            w2utils.lock.apply(window, args);
        },

        unlock: function (panel, speed) {
            if (w2panels.indexOf(panel) == -1) {
                console.log('ERROR: First parameter needs to be the a valid panel name.');
                return;
            }
            var nm = '#layout_'+ this.name + '_panel_' + panel;
            w2utils.unlock(nm, speed);
        }
    };

    $.extend(w2layout.prototype, w2utils.event);
    w2obj.layout = w2layout;

    /************************************************************************
     *   Library: Web 2.0 UI for jQuery (using prototypical inheritance)
     *   - Following objects defined
     *        - w2tabs        - tabs widget
     *        - $().w2tabs    - jQuery wrapper
     *   - Dependencies: jQuery, w2utils
     *
     * == NICE TO HAVE ==
     *   - on overflow display << >>
     *   - declarative tabs
     *   - align = left, right, center ??
     *
     * == 1.5 changes
     *   - $('#tabs').w2tabs() - if called w/o argument then it returns tabs object
     *   - added flow property (up/down)
     *   - added tab.style
     *
     ************************************************************************/


    var w2tabs = function (options) {
        this.box = null;      // DOM Element that holds the element
        this.name = null;      // unique name for w2ui
        this.active = null;
        this.flow = 'down';    // can be down or up
        this.tabs = [];
        this.routeData = {};        // data for dynamic routes
        this.right = '';
        this.style = '';
        this.onClick = null;
        this.onClose = null;
        this.onRender = null;
        this.onRefresh = null;
        this.onResize = null;
        this.onDestroy = null;

        $.extend(this, { handlers: [] });
        $.extend(true, this, w2obj.tabs, options);
    };

    // ====================================================
    // -- Registers as a jQuery plugin

    $.fn.w2tabs = function (method) {
        if ($.isPlainObject(method)) {
            // check name parameter
            if (!w2utils.checkName(method, 'w2tabs')) return;
            // extend tabs
            var tabs = method.tabs || [];
            var object = new w2tabs(method);
            for (var i = 0; i < tabs.length; i++) {
                object.tabs[i] = $.extend({}, w2tabs.prototype.tab, tabs[i]);
            }
            if ($(this).length !== 0) {
                object.render($(this)[0]);
            }
            // register new object
            w2ui[object.name] = object;
            return object;
        } else {
            var obj = w2ui[$(this).attr('name')];
            if (!obj) return null;
            if (arguments.length > 0) {
                if (obj[method]) obj[method].apply(obj, Array.prototype.slice.call(arguments, 1));
                return this;
            } else {
                return obj;
            }
        }
    };

    // ====================================================
    // -- Implementation of core functionality

    w2tabs.prototype = {
        tab: {
            id: null,        // command to be sent to all event handlers
            text: '',
            route: null,
            hidden: false,
            disabled: false,
            closable: false,
            hint: '',
            style: '',
            onClick: null,
            onRefresh: null,
            onClose: null
        },

        add: function (tab) {
            return this.insert(null, tab);
        },

        insert: function (id, tab) {
            if (!$.isArray(tab)) tab = [tab];
            // assume it is array
            for (var i = 0; i < tab.length; i++) {
                // checks
                if (typeof tab[i].id === 'undefined') {
                    console.log('ERROR: The parameter "id" is required but not supplied. (obj: ' + this.name + ')');
                    return;
                }
                if (!w2utils.checkUniqueId(tab[i].id, this.tabs, 'tabs', this.name)) return;
                // add tab
                var newTab = $.extend({}, w2tabs.prototype.tab, tab[i]);
                if (id === null || typeof id === 'undefined') {
                    this.tabs.push(newTab);
                } else {
                    var middle = this.get(id, true);
                    this.tabs = this.tabs.slice(0, middle).concat([newTab], this.tabs.slice(middle));
                }
                this.refresh(tab[i].id);
            }
        },

        remove: function () {
            var removed = 0;
            for (var a = 0; a < arguments.length; a++) {
                var tab = this.get(arguments[a]);
                if (!tab) return false;
                removed++;
                // remove from array
                this.tabs.splice(this.get(tab.id, true), 1);
                // remove from screen
                $(this.box).find('#tabs_' + this.name + '_tab_' + w2utils.escapeId(tab.id)).remove();
            }
            return removed;
        },

        select: function (id) {
            if (this.active == id || this.get(id) === null) return false;
            this.active = id;
            this.refresh();
            return true;
        },

        set: function (id, tab) {
            var index = this.get(id, true);
            if (index === null) return false;
            $.extend(this.tabs[index], tab);
            this.refresh(id);
            return true;
        },

        get: function (id, returnIndex) {
            if (arguments.length === 0) {
                var all = [];
                for (var i1 = 0; i1 < this.tabs.length; i1++) {
                    if (this.tabs[i1].id != null) {
                        all.push(this.tabs[i1].id);
                    }
                }
                return all;
            } else {
                for (var i2 = 0; i2 < this.tabs.length; i2++) {
                    if (this.tabs[i2].id == id) { // need to be == since id can be numeric
                        return (returnIndex === true ? i2 : this.tabs[i2]);
                    }
                }
            }
            return null;
        },

        show: function () {
            var obj = this;
            var shown = 0;
            var tmp = [];
            for (var a = 0; a < arguments.length; a++) {
                var tab = this.get(arguments[a]);
                if (!tab || tab.hidden === false) continue;
                shown++;
                tab.hidden = false;
                tmp.push(tab.id);
            }
            setTimeout(function () {
                for (var t = 0; t < tmp.length; t++) obj.refresh(tmp[t]);
            }, 15); // needs timeout
            return shown;
        },

        hide: function () {
            var obj = this;
            var hidden = 0;
            var tmp = [];
            for (var a = 0; a < arguments.length; a++) {
                var tab = this.get(arguments[a]);
                if (!tab || tab.hidden === true) continue;
                hidden++;
                tab.hidden = true;
                tmp.push(tab.id);
            }
            setTimeout(function () {
                for (var t = 0; t < tmp.length; t++) obj.refresh(tmp[t]);
            }, 15); // needs timeout
            return hidden;
        },

        enable: function () {
            var obj = this;
            var enabled = 0;
            var tmp = [];
            for (var a = 0; a < arguments.length; a++) {
                var tab = this.get(arguments[a]);
                if (!tab || tab.disabled === false) continue;
                enabled++;
                tab.disabled = false;
                tmp.push(tab.id);
            }
            setTimeout(function () {
                for (var t = 0; t < tmp.length; t++) obj.refresh(tmp[t]);
            }, 15); // needs timeout
            return enabled;
        },

        disable: function () {
            var obj = this;
            var disabled = 0;
            var tmp = [];
            for (var a = 0; a < arguments.length; a++) {
                var tab = this.get(arguments[a]);
                if (!tab || tab.disabled === true) continue;
                disabled++;
                tab.disabled = true;
                tmp.push(tab.id);
            }
            setTimeout(function () {
                for (var t = 0; t < tmp.length; t++) obj.refresh(tmp[t]);
            }, 15); // needs timeout
            return disabled;
        },

        refresh: function (id) {
            var time = (new Date()).getTime();
            if (this.flow == 'up') $(this.box).addClass('w2ui-tabs-up'); else $(this.box).removeClass('w2ui-tabs-up');
            // event before
            var eventData = this.trigger({ phase: 'before', type: 'refresh', target: (typeof id !== 'undefined' ? id : this.name), object: this.get(id) });
            if (eventData.isCancelled === true) return;
            if (typeof id === 'undefined') {
                // refresh all
                for (var i = 0; i < this.tabs.length; i++) this.refresh(this.tabs[i].id);
            } else {
                // create or refresh only one item
                var tab = this.get(id);
                if (tab === null) return false;
                if (typeof tab.caption !== 'undefined') tab.text = tab.caption;

                var jq_el = $(this.box).find('#tabs_' + this.name + '_tab_' + w2utils.escapeId(tab.id));
                var tabHTML = (tab.closable ? '<div class="w2ui-tab-close" onclick="w2ui[\'' + this.name + '\'].animateClose(\'' + tab.id + '\', event);"></div>' : '') +
                    '    <div class="w2ui-tab' + (this.active === tab.id ? ' active' : '') + (tab.closable ? ' closable' : '') + '" ' +
                    '        title="' + (typeof tab.hint !== 'undefined' ? tab.hint : '') + '" style="' + tab.style + '" ' +
                    '        onclick="w2ui[\'' + this.name + '\'].click(\'' + tab.id + '\', event);">' + tab.text + '</div>';
                if (jq_el.length === 0) {
                    // does not exist - create it
                    var addStyle = '';
                    if (tab.hidden) {
                        addStyle += 'display: none;';
                    }
                    if (tab.disabled) {
                        addStyle += 'opacity: 0.2;';
                    }
                    var html = '<td id="tabs_' + this.name + '_tab_' + tab.id + '" style="' + addStyle + '" valign="middle">' + tabHTML + '</td>';
                    if (this.get(id, true) !== this.tabs.length - 1 && $(this.box).find('#tabs_' + this.name + '_tab_' + w2utils.escapeId(this.tabs[parseInt(this.get(id, true)) + 1].id)).length > 0) {
                        $(this.box).find('#tabs_' + this.name + '_tab_' + w2utils.escapeId(this.tabs[parseInt(this.get(id, true)) + 1].id)).before(html);
                    } else {
                        $(this.box).find('#tabs_' + this.name + '_right').before(html);
                    }
                } else {
                    // refresh
                    jq_el.html(tabHTML);
                    if (tab.hidden) {
                        jq_el.css('display', 'none');
                    }
                    else {
                        jq_el.css('display', '');
                    }
                    if (tab.disabled) {
                        jq_el.css({ 'opacity': '0.2' });
                    }
                    else {
                        jq_el.css({ 'opacity': '1' });
                    }
                }
            }
            // right html
            $('#tabs_' + this.name + '_right').html(this.right);
            // event after
            this.trigger($.extend(eventData, { phase: 'after' }));
            return (new Date()).getTime() - time;
        },

        render: function (box) {
            var time = (new Date()).getTime();
            // event before
            var eventData = this.trigger({ phase: 'before', type: 'render', target: this.name, box: box });
            if (eventData.isCancelled === true) return;
            // default action
            // if (window.getSelection) window.getSelection().removeAllRanges(); // clear selection
            if (typeof box !== 'undefined' && box !== null) {
                if ($(this.box).find('> table #tabs_' + this.name + '_right').length > 0) {
                    $(this.box)
                        .removeAttr('name')
                        .removeClass('w2ui-reset w2ui-tabs')
                        .html('');
                }
                this.box = box;
            }
            if (!this.box) return false;
            // render all buttons
            var html = '<table cellspacing="0" cellpadding="1" width="100%">' +
                '    <tr><td width="100%" id="tabs_' + this.name + '_right" align="right">' + this.right + '</td></tr>' +
                '</table>';
            $(this.box)
                .attr('name', this.name)
                .addClass('w2ui-reset w2ui-tabs')
                .html(html);
            if ($(this.box).length > 0) $(this.box)[0].style.cssText += this.style;
            // event after
            this.trigger($.extend(eventData, { phase: 'after' }));
            this.refresh();
            return (new Date()).getTime() - time;
        },

        resize: function () {
            var time = (new Date()).getTime();
            // event before
            var eventData = this.trigger({ phase: 'before', type: 'resize', target: this.name });
            if (eventData.isCancelled === true) return;

            // intentionaly blank

            // event after
            this.trigger($.extend(eventData, { phase: 'after' }));
            return (new Date()).getTime() - time;
        },

        destroy: function () {
            // event before
            var eventData = this.trigger({ phase: 'before', type: 'destroy', target: this.name });
            if (eventData.isCancelled === true) return;
            // clean up
            if ($(this.box).find('> table #tabs_' + this.name + '_right').length > 0) {
                $(this.box)
                    .removeAttr('name')
                    .removeClass('w2ui-reset w2ui-tabs')
                    .html('');
            }
            delete w2ui[this.name];
            // event after
            this.trigger($.extend(eventData, { phase: 'after' }));
        },

        // ===================================================
        // -- Internal Event Handlers

        click: function (id, event) {
            var tab = this.get(id);
            if (tab === null || tab.disabled) return false;
            // event before
            var eventData = this.trigger({ phase: 'before', type: 'click', target: id, tab: tab, object: tab, originalEvent: event });
            if (eventData.isCancelled === true) return;
            // default action
            $(this.box).find('#tabs_' + this.name + '_tab_' + w2utils.escapeId(this.active) + ' .w2ui-tab').removeClass('active');
            this.active = tab.id;
            // route processing
            if (tab.route) {
                var route = String('/' + tab.route).replace(/\/{2,}/g, '/');
                var info = w2utils.parseRoute(route);
                if (info.keys.length > 0) {
                    for (var k = 0; k < info.keys.length; k++) {
                        if (this.routeData[info.keys[k].name] == null) continue;
                        route = route.replace((new RegExp(':' + info.keys[k].name, 'g')), this.routeData[info.keys[k].name]);
                    }
                }
                setTimeout(function () {
                    window.location.hash = route;
                }, 1);
            }
            // event after
            this.trigger($.extend(eventData, { phase: 'after' }));
            this.refresh(id);
        },

        animateClose: function (id, event) {
            var tab = this.get(id);
            if (tab === null || tab.disabled) return false;
            // event before
            var eventData = this.trigger({ phase: 'before', type: 'close', target: id, object: this.get(id), originalEvent: event });
            if (eventData.isCancelled === true) return;
            // default action
            var obj = this;
            $(this.box).find('#tabs_' + this.name + '_tab_' + w2utils.escapeId(tab.id)).css(w2utils.cssPrefix('transition', '.2s')).css('opacity', '0');
            setTimeout(function () {
                var width = $(obj.box).find('#tabs_' + obj.name + '_tab_' + w2utils.escapeId(tab.id)).width();
                $(obj.box).find('#tabs_' + obj.name + '_tab_' + w2utils.escapeId(tab.id))
                    .html('<div style="width: ' + width + 'px; ' + w2utils.cssPrefix('transition', '.2s', true) + '"></div>');
                setTimeout(function () {
                    $(obj.box).find('#tabs_' + obj.name + '_tab_' + w2utils.escapeId(tab.id)).find(':first-child').css({ 'width': '0px' });
                }, 50);
            }, 200);
            setTimeout(function () {
                obj.remove(id);
            }, 450);
            // event before
            this.trigger($.extend(eventData, { phase: 'after' }));
            this.refresh();
        },

        animateInsert: function (id, tab) {
            if (this.get(id) === null) return;
            if (!$.isPlainObject(tab)) return;
            // check for unique
            if (!w2utils.checkUniqueId(tab.id, this.tabs, 'tabs', this.name)) return;
            // insert simple div
            var jq_el = $(this.box).find('#tabs_' + this.name + '_tab_' + w2utils.escapeId(tab.id));
            if (jq_el.length !== 0) return; // already exists
            // measure width
            if (typeof tab.caption !== 'undefined') tab.text = tab.caption;
            var tmp = '<div id="_tmp_tabs" class="w2ui-reset w2ui-tabs" style="position: absolute; top: -1000px;">' +
                '<table cellspacing="0" cellpadding="1" width="100%"><tr>' +
                '<td id="_tmp_simple_tab" style="" valign="middle">' +
                (tab.closable ? '<div class="w2ui-tab-close"></div>' : '') +
                '    <div class="w2ui-tab ' + (this.active === tab.id ? 'active' : '') + '">' + tab.text + '</div>' +
                '</td></tr></table>' +
                '</div>';
            $('body').append(tmp);
            // create dummy element
            var tabHTML = '<div style="width: 1px; ' + w2utils.cssPrefix('transition', '.2s', true) + '">&nbsp;</div>';
            var addStyle = '';
            if (tab.hidden) {
                addStyle += 'display: none;';
            }
            if (tab.disabled) {
                addStyle += 'opacity: 0.2;';
            }
            var html = '<td id="tabs_' + this.name + '_tab_' + tab.id + '" style="' + addStyle + '" valign="middle">' + tabHTML + '</td>';
            if (this.get(id, true) !== this.tabs.length && $(this.box).find('#tabs_' + this.name + '_tab_' + w2utils.escapeId(this.tabs[parseInt(this.get(id, true))].id)).length > 0) {
                $(this.box).find('#tabs_' + this.name + '_tab_' + w2utils.escapeId(this.tabs[parseInt(this.get(id, true))].id)).before(html);
            } else {
                $(this.box).find('#tabs_' + this.name + '_right').before(html);
            }
            // -- move
            var obj = this;
            setTimeout(function () {
                var width = $('#_tmp_simple_tab').width();
                $('#_tmp_tabs').remove();
                $('#tabs_' + obj.name + '_tab_' + w2utils.escapeId(tab.id) + ' > div').css('width', width + 'px');
            }, 1);
            setTimeout(function () {
                // insert for real
                obj.insert(id, tab);
            }, 200);
        }
    };

    $.extend(w2tabs.prototype, w2utils.event);
    w2obj.tabs = w2tabs;
})();
