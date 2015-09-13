(function(m, o, r, u, l, u, s) {
    var extend = function() {
        var hasOwn = Object.prototype.hasOwnProperty;
        var toStr = Object.prototype.toString;
        var isArray = function isArray(arr) {
            if (typeof Array.isArray === "function") {
                return Array.isArray(arr);
            }
            return toStr.call(arr) === "[object Array]";
        };
        var isPlainObject = function isPlainObject(obj) {
            "use strict";
            if (!obj || toStr.call(obj) !== "[object Object]") {
                return false;
            }
            var has_own_constructor = hasOwn.call(obj, "constructor");
            var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
            if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
                return false;
            }
            var key;
            for (key in obj) {}
            return typeof key === "undefined" || hasOwn.call(obj, key);
        };
        return function extend() {
            "use strict";
            var options, name, src, copy, copyIsArray, clone, target = arguments[0], i = 1, length = arguments.length, deep = false;
            if (typeof target === "boolean") {
                deep = target;
                target = arguments[1] || {};
                i = 2;
            } else if (typeof target !== "object" && typeof target !== "function" || target == null) {
                target = {};
            }
            for (;i < length; ++i) {
                options = arguments[i];
                if (options != null) {
                    for (name in options) {
                        src = target[name];
                        copy = options[name];
                        if (target !== copy) {
                            if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                                if (copyIsArray) {
                                    copyIsArray = false;
                                    clone = src && isArray(src) ? src : [];
                                } else {
                                    clone = src && isPlainObject(src) ? src : {};
                                }
                                if (copy.constructor.name !== "Ref") target[name] = extend(deep, clone, copy);
                            } else if (typeof copy !== "undefined") {
                                target[name] = copy;
                            }
                        }
                    }
                }
            }
            return target;
        };
    }();
    var mixin = function() {
        var mixinup = function(a, b) {
            for (var i in b) {
                if (b.hasOwnProperty(i)) {
                    a[i] = b[i];
                }
            }
            return a;
        };
        return function(a) {
            var i = 1;
            for (;i < arguments.length; i++) {
                if ("object" === typeof arguments[i]) {
                    mixinup(a, arguments[i]);
                }
            }
            return a;
        };
    }();
    var nativeClasses = function() {
        return [ "Function", "Number", "String", "Array", "Object", "Boolean", "Data" ];
    }();
    var isNativeClass = function(nativeClasses) {
        return function(className) {
            return nativeClasses.indexOf(className) >= 0;
        };
    }(nativeClasses);
    var firstUpper = function() {
        return function(text) {
            return text.charAt(0).toUpperCase() + text.substr(1);
        };
    }();
    var charge = function(extend, mixin) {
        return function(target, exhibitor) {
            var overprototype = {};
            if ("object" === typeof exhibitor.prototype.__super__) {
                mixin(overprototype, exhibitor.prototype.__super__);
            }
            mixin(overprototype, exhibitor.prototype);
            if (target.__proto__ && target.__proto__ === Object.prototype) {
                target.__proto__ = Object.create(null);
                window.tar = target;
            }
            if ("object" === typeof target.__proto__) {
                mixin(target.__proto__, overprototype);
            } else {
                extend(target, overprototype);
            }
            exhibitor.apply(target);
            return target;
        };
    }(extend, mixin);
    var inherit = function(mixin) {
        return function(aClass, classes) {
            if (!(classes instanceof Array)) classes = [ classes ];
            var cl = classes.length;
            var superconstructor = function() {
                var args = Array.prototype.slice.apply(arguments);
                if ("object" !== typeof this.constructors) Object.defineProperty(this, "constructors", {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: []
                });
                for (var i = 0; i < cl; ++i) {
                    if (this.constructors.indexOf(classes[i]) >= 0) continue;
                    this.constructors.push(classes[i]);
                    classes[i].apply(this, args);
                }
            }, superprototype = superconstructor.prototype = {};
            if (aClass.prototype && aClass.prototype !== null && aClass.prototype.__super__) mixin(superprototype, aClass.prototype.__super__);
            for (var i = 0; i < cl; ++i) {
                if (classes[i].prototype) {
                    if (classes[i].prototype.__super__) superprototype = mixin(superprototype, classes[i].prototype.__super__);
                    superprototype = mixin(superprototype, classes[i].prototype);
                }
            }
            superprototype.constructor = superconstructor;
            var Mixin = function() {
                if (this.constructor && this.constructor.__disableContructor__) {
                    console.log("ESCAPE CONSTRUCTOR");
                    this.constructor.__disableContructor__ = false;
                    return false;
                }
                var args = Array.prototype.slice.apply(arguments);
                if (!(this === window)) {
                    superconstructor.apply(this, args);
                }
                aClass.apply(this, args);
            };
            Mixin.prototype = Object.create(superprototype, {
                __super__: {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: superprototype
                }
            });
            if (aClass.prototype) mixin(Mixin.prototype, aClass.prototype);
            for (var prop in aClass) {
                if (aClass.hasOwnProperty(prop)) Mixin[prop] = aClass[prop];
            }
            Object.defineProperty(Mixin.prototype, "constructor", {
                configurable: false,
                enumerable: false,
                writable: false,
                value: Mixin
            });
            if (!Mixin.prototype.__proto__) {
                Mixin.prototype.__proto__ = Mixin.prototype;
            }
            return Mixin;
        };
    }(mixin);
    var determineClass = function(firstUpper) {
        return function(subject) {
            var variants = [];
            var resourceType = typeof subject, abstractClass = firstUpper(resourceType);
            variants.push(abstractClass);
            if (this.sings[resourceType]) {
                for (var s in this.sings[resourceType]) {
                    if (this.sings[resourceType].hasOwnProperty(s)) {
                        if (this.sings[resourceType][s](subject)) {
                            variants.push(firstUpper(s));
                        }
                    }
                }
            }
            return variants;
        };
    }(firstUpper);
    var chargeClass = function(isNativeClass, charge, inherit, extend) {
        var Charger = function(className1, className2) {
            var aClass1, aClass2;
            if ("string" === typeof className1) {
                aClass1 = this.classes[className1];
            } else {
                aClass1 = className1;
            }
            if (!(typeof className2 === "string" && isNativeClass(className2))) {
                if ("string" === typeof className2) {
                    aClass2 = this.classes[className2];
                } else {
                    aClass2 = className2;
                }
                if ("undefined" === typeof aClass1) throw "Undefined class " + className1;
                if ("function" === typeof aClass1 && "function" === typeof aClass2) {
                    var inheritedBy = "object" === typeof aClass1.prototype.inheritedBy ? aClass1.prototype.inheritedBy : [];
                    if (inheritedBy.indexOf(aClass2.className) < 0) {
                        inheritedBy.push(aClass2.className);
                        aClass1 = inherit(aClass1, [ aClass2 ]);
                        aClass1.prototype.inheritedBy = inheritedBy;
                    }
                } else if ("object" === typeof aClass1) {
                    if ("function" === typeof aClass2) {
                        aClass1 = charge(aClass1, aClass2);
                    } else if ("object" === typeof aClass2) {
                        aClass1 = extend(aClass1, aClass2);
                    }
                }
            }
            if (typeof className2 === "string" && "object" === typeof this.classesBindings[className2]) {
                for (var i = 0; i < this.classesBindings[className2].length; ++i) {
                    aClass1 = Charger.call(this, aClass1, this.classesBindings[className2][i]);
                }
            }
            return aClass1;
        };
        return Charger;
    }(isNativeClass, charge, inherit, extend);
    var suit = function(extend, determineClass, chargeClass, isNativeClass) {
        var Abstract = function(subject, forcetype) {
            var abstraction, i;
            if ("object" === typeof subject && subject.__abstract__) {
                if (forcetype) {
                    subject = chargeClass.call(Abstract, subject, forcetype);
                }
                return subject;
            } else {
                var abstractClasses = determineClass.call(Abstract, subject);
            }
            if (forcetype && abstractClasses.indexOf(forcetype) < 0) abstractClasses.push(forcetype);
            abstraction = function() {};
            abstraction.prototype = Object.create({}, {
                __abstract__: {
                    configurable: false,
                    enumerable: true,
                    writable: true,
                    value: {
                        classes: abstractClasses
                    }
                },
                __subject__: {
                    configurable: false,
                    enumerable: true,
                    writable: true,
                    value: subject
                }
            });
            for (i = 0; i < abstractClasses.length; ++i) {
                abstraction = chargeClass.call(Abstract, abstraction, abstractClasses[i]);
            }
            return new abstraction();
        };
        Abstract.determineAbstractClass = function(subject) {
            return determineClass.call(Abstract, subject);
        };
        Abstract.extend = function(data) {
            extend(Abstract, data);
            return Abstract;
        };
        Abstract.classes = {};
        Abstract.classesBindings = {};
        Abstract.bindClass = function(className, detClassName) {
            if ("undefined" === typeof Abstract.classesBindings[detClassName]) Abstract.classesBindings[detClassName] = [];
            if (Abstract.classesBindings[detClassName].indexOf(className) < 0) {
                Abstract.classesBindings[detClassName].push(className);
            }
            return this;
        };
        Abstract.sings = {};
        Abstract.registerSing = function(type, name, determiner) {
            if ("object" !== typeof Abstract.sings[type]) Abstract.sings[type] = {};
            Abstract.sings[type][name] = determiner;
            return Abstract;
        };
        Abstract.aliases = {};
        Abstract.alias = function() {
            if (arguments.length > 1) {
                Abstract.aliases[arguments[0]] = arguments[1];
            } else {
                return Abstract.aliases[arguments[0]] || null;
            }
        };
        Abstract.warn = function() {
            throw new Error(Array.prototype.slice.call(arguments).join(" "));
        };
        return Abstract;
    }(extend, determineClass, chargeClass, isNativeClass);
    var classCreator = function(core, mixin) {
        return function(className, constructor) {
            var abstractClass = constructor || function() {};
            abstractClass.assignTo = function(aClass) {
                core.bindClass(abstractClass.className, aClass);
                return abstractClass;
            };
            abstractClass.charge = function(aClass) {
                return core.charge(abstractClass.className, aClass);
            };
            abstractClass.extend = function(data) {
                mixin(abstractClass.prototype, data);
                return abstractClass;
            };
            abstractClass.embeddable = false;
            abstractClass.className = className;
            return abstractClass;
        };
    }(suit, mixin);
    (function(core, classCreator) {
        core.extend({
            registerClass: function(className, constructor) {
                core.classes[className] = classCreator(className, constructor || false);
                if (!(core.classesBindings[className] instanceof Array)) core.classesBindings[className] = [];
                return core.classes[className];
            },
            "class": function(className) {
                if ("function" === typeof core.classes[className]) {
                    return core.classes[className];
                } else {
                    throw "Class `" + className + "` not exists";
                    return null;
                }
            },
            classExists: function(className) {
                if ("function" === typeof core.classes[className]) {
                    return true;
                } else {
                    return false;
                }
            },
            module: function(moduleName) {
                var realModuleName = "module" + moduleName.charAt(0).toUpperCase() + moduleName.substr(1);
                if ("function" === typeof core.classes[realModuleName]) {
                    return core.classes[realModuleName];
                } else {
                    return null;
                }
            },
            moduleExists: function(moduleName) {
                var realModuleName = "module" + moduleName.charAt(0).toUpperCase() + moduleName.substr(1);
                if ("function" === typeof core.classes[realModuleName]) {
                    return true;
                } else {
                    return false;
                }
            }
        });
    })(suit, classCreator);
    var init = function($) {
        return $;
    }(suit);
    var tags = function() {
        return [ "HTML", "DOCUMENT", "BODY", "A", "ABBR", "ACRONYM", "ADDRESS", "APPLET", "AREA", "BASE", "BASEFONT", "BIG", "BLINK", "BLOCKQUOTE", "BODY", "BR", "B", "BUTTON", "CAPTION", "CENTER", "CITE", "CODE", "COL", "DFN", "DIR", "DIV", "DL", "DT", "DD", "EM", "FONT", "FORM", "H1", "H2", "H3", "H4", "H5", "H6", "HEAD", "HR", "HTML", "IMG", "INPUT", "ISINDEX", "I", "KBD", "LINK", "LI", "MAP", "MARQUEE", "MENU", "META", "OL", "OPTION", "PARAM", "PRE", "P", "Q", "SAMP", "SCRIPT", "SELECT", "SMALL", "SPAN", "STRIKEOUT", "STRONG", "STYLE", "SUB", "SUP", "TABLE", "TD", "TEXTAREA", "TH", "TBODY", "THEAD", "TFOOT", "TITLE", "TR", "TT", "UL", "U", "VAR" ];
    }();
    var querySelector = function() {
        (function() {
            if (!HTMLElement.prototype.querySelectorAll) {
                throw new Error("rootedQuerySelectorAll: This polyfill can only be used with browsers that support querySelectorAll");
            }
            var container = document.createElement("div");
            try {
                container.querySelectorAll(":scope *");
            } catch (e) {
                var scopeRE = /^\s*:scope/gi;
                function overrideNodeMethod(prototype, methodName) {
                    var oldMethod = prototype[methodName];
                    prototype[methodName] = function(query) {
                        var nodeList, gaveId = false, gaveContainer = false;
                        if (query.match(scopeRE)) {
                            query = query.replace(scopeRE, "");
                            if (!this.parentNode) {
                                container.appendChild(this);
                                gaveContainer = true;
                            }
                            parentNode = this.parentNode;
                            if (!this.id) {
                                gaveId = this.attributeChangedCallback || true;
                                this.attributeChangedCallback = false;
                                this.id = "rootedQuerySelector_id_" + new Date().getTime();
                            }
                            nodeList = oldMethod.call(parentNode, "#" + this.id + " " + query);
                            if (gaveId) {
                                this.id = "";
                                if ("function" === typeof gaveId) this.attributeChangedCallback = gaveId;
                                gaveId = null;
                            }
                            if (gaveContainer) {
                                container.removeChild(this);
                            }
                            return nodeList;
                        } else {
                            return oldMethod.call(this, query);
                        }
                    };
                }
                overrideNodeMethod(HTMLElement.prototype, "querySelector");
                overrideNodeMethod(HTMLElement.prototype, "querySelectorAll");
            }
        })();
        var regPseudoClasssDt = /:(eq|nth\-child)\(([0-9n\+ ]+)\)/gi, queryExpr = /<([a-zA-Z0-9_]+) \/>/i, argsExpr = /\[([a-zA-Z0-9_\-]*)[ ]?=([ ]?[^\]]*)\]/i, psopi = {
            eq: function(elements, attrs) {
                var index;
                if (!isNaN(index = parseInt(attrs[2]))) {
                    return [ index < 0 && index * -1 < elements.length ? elements[elements.length - index] : index < elements.length ? elements[index] : [] ];
                } else {
                    return [];
                }
            },
            "nth-child": function(elements, attrs) {
                var n = false, i = 0, rec = [], index;
                if (!isNaN(index = parseInt(attrs[2]))) {
                    n = attrs[2].indexOf("n") >= 0;
                    for (;i < elements.length; i++) {
                        if (!n && i === index) rec.push(elements[i]);
                        if (n && i % index === 0) rec.push(elements[i]);
                    }
                } else {
                    return [];
                }
                return rec;
            }
        }, pseusoSelect = function(elements, selector) {
            var psop = regPseudoClasssDt.exec(selector);
            if ("function" !== typeof psopi[psop[1]]) {
                return [];
            } else {
                return psopi[psop[1]](elements, psop);
            }
        }, queryFinder = function(query, root) {
            var prefix;
            root && root instanceof HTMLElement ? prefix = ":scope " : prefix = "";
            switch (typeof query) {
              case "string":
                var queryExpr = /<([a-zA-Z0-9_]+) \/>/i, argsExpr = /\[([a-zA-Z0-9_\-]*)[ ]?=([ ]?[^\]]*)\]/i;
                if (query.indexOf("[") > -1 && argsExpr.exec(query)) {
                    var patch = true;
                    query = query.replace(argsExpr, '[$1="$2"]');
                }
                if (queryExpr.exec(query) === null) {
                    if (query.length === 0) return new Array();
                    try {
                        return root.querySelectorAll(prefix + query);
                    } catch (e) {
                        regPseudoClasssDt.lastIndex = 0;
                        if (regPseudoClasssDt.test(query) == true) {
                            var ps = query.match(regPseudoClasssDt)[0];
                            return pseusoSelect(queryFinder(query.replace(regPseudoClasssDt, ""), root), ps);
                        } else {
                            throw "querySelectorAll not support query: " + query;
                        }
                    }
                } else {
                    return [ document.createElement(result[1].toUpperCase()) ];
                }
                ;
                break;

              case "function":
                return [];
                break;

              case "object":
                if (query instanceof Array) {
                    return query;
                }
                if (query === null) {
                    return [];
                } else {
                    if (query == window) {
                        return [ query ];
                    } else if (query.jquery) {
                        var elements = [];
                        for (var j = 0; j < query.length; j++) elements.push(query[j]);
                        return elements;
                    } else if (query.brahma) {
                        var elements = [];
                        for (var j = 0; j < query.length; j++) elements.push(query[j]);
                        return elements;
                    } else {
                        return [ query ];
                    }
                }
                break;

              case "undefined":
              default:
                return [ query ];
                break;
            }
        };
        return function(query, root) {
            var root = root || document, roots = [];
            if (root instanceof NodeList || root instanceof Array) {
                roots = Array.prototype.slice.apply(root);
            } else {
                roots = [ root ];
            }
            var stack = [];
            for (var i = 0; i < roots.length; ++i) {
                var response = queryFinder(query, roots[i]);
                if (("object" === typeof response || "function" === typeof response) && "number" === typeof response.length) {
                    for (var r = 0; r < response.length; ++r) {
                        stack.push(response[r]);
                    }
                }
            }
            return stack;
        };
    }();
    (function($) {
        $.registerSing("object", "HTMLElement", function(res) {
            if (res === document || Object.prototype.toString.call(res).substr(0, 12) === "[object HTML") return true;
            return false;
        });
    })(suit);
    (function($, tags) {
        $.registerSing("string", "Selector", function(res) {
            var tsp = res.split(/[> ]+/), found = false;
            for (var i = 0; i < tsp.length; i++) {
                (function(piece) {
                    if (tags.indexOf(piece.toUpperCase()) >= 0) {
                        found = true;
                        return true;
                    }
                    if (/^[>#\.[]]{0,2}[^'", ]+[a-zA-Z0-9\-\[]+/.test(piece)) {
                        found = true;
                        return true;
                    }
                })(tsp[i]);
            }
            return found;
        });
    })(suit, tags);
    (function($) {
        $.registerSing("object", "Query", function(res) {
            return res.brahma || res.jquery;
        });
    })(suit);
    (function($) {
        $.registerSing("object", "Window", function(res) {
            return res === window;
        });
    })(suit);
    var Dom = function($, querySelector) {
        var Dom = $.registerClass("Dom", function() {
            this.selector = this.__subject__;
            var elements = querySelector.call(this, this.selector);
            if (("object" === typeof elements || "function" === typeof elements) && elements.length) {
                for (index = 0; index < elements.length; index++) {
                    this[index] = elements[index];
                }
            }
            this.length = elements.length;
            this.context = document;
            this.brahma = true;
        });
        Dom.assignTo("Selector");
        Dom.assignTo("HTMLElement");
        Dom.assignTo("Window");
        Dom.assignTo("Query");
        return Dom;
    }(init, querySelector);
    (function($) {
        $.registerSing("object", "RichArray", function(res) {
            if (!(res instanceof Array) && res.hasOwnProperty("length") && "number" === typeof res.length) return true;
            return false;
        });
    })(suit);
    var Eacher = function(core) {
        var Eacher = core.registerClass("Eacher", function() {});
        Eacher.assignTo("Object");
        Eacher.assignTo("Selector");
        Eacher.assignTo("RichArray");
        return Eacher;
    }(init);
    var isObjective = function() {
        return function(subject) {
            if ("object" === typeof subject && subject !== document && subject.toString().substr(0, 12) !== "[object HTML" || "function" === typeof subject) return subject;
            return false;
        };
    }();
    var isRichObjective = function() {
        return function(subject) {
            if (("object" === typeof subject || "function" === typeof subject) && "number" === typeof subject.length) return subject;
            return false;
        };
    }();
    (function(Eacher, isObjective, isRichObjective) {
        Eacher.extend({
            each: function(callback) {
                var operand, method = 0;
                if (this.__subject__ && isRichObjective(this.__subject__)) {
                    operand = this.__subject__;
                    method = 1;
                } else if (this.__subject__ && isObjective(this.__subject__)) {
                    operand = this.__subject__;
                    method = 0;
                } else if (isRichObjective(this)) {
                    operand = this;
                    method = 1;
                } else {
                    operand = this;
                    method = 0;
                }
                if (method === 1) {
                    if ("number" === typeof operand.length) for (var i = 0; i < operand.length; ++i) {
                        if (callback.call(operand[i], operand[i], i) === false) break;
                    }
                    return operand;
                } else {
                    for (var prop in operand) {
                        if (operand.hasOwnProperty(prop)) {
                            if (callback.call(operand[prop], operand[prop], prop) === false) break;
                        }
                    }
                }
            }
        });
    })(Eacher, isObjective, isRichObjective);
    Dom.extend({
        css: function() {
            var data, polymorph = [];
            "object" === typeof arguments[0] ? arguments[0] instanceof Array ? (polymorph = arguments[0], 
            data = arguments[1]) : data = arguments[0] : arguments.length > 1 ? (data = {}, 
            data[arguments[0]] = arguments[1]) : data = arguments[0];
            if ("object" === typeof data) {
                this.each(function() {
                    for (var i in data) {
                        if (polymorph.length !== 0) for (var p = 0; p < polymorph.length; p++) this.style[polymorph[p] + i] = data[i];
                        this.style[i] = data[i];
                    }
                });
                return this;
            } else {
                return this[0].style[data];
            }
        }
    });
    var toArray = function() {
        return function(ob) {
            return Array.prototype.slice.call(ob);
        };
    }();
    var createChild = function(core) {
        return function(nodeName, data, prepend) {
            var context = this === window ? document.body : this;
            data = data || {};
            try {
                var newElement = document.createElement(nodeName);
            } catch (e) {
                core.warn("Not valid filename: " + nodeName);
                return null;
            }
            !(prepend || false) ? context.appendChild(newElement) : function() {
                if (context.firstChild !== null) context.insertBefore(newElement, context.firstChild); else context.appendChild(context);
            }();
            for (var name in data) {
                if (data.hasOwnProperty(name)) {
                    newElement.setAttribute(name, data[name]);
                }
            }
            return core([ newElement ], "HTMLElement");
        };
    }(init);
    var determineClass2 = function(firstUpper) {
        return function(subject) {
            var variants = [];
            var resourceType = typeof subject, abstractClass = firstUpper(resourceType);
            variants.push(abstractClass);
            if (this.sings[resourceType]) {
                for (var s in this.sings[resourceType]) {
                    if (this.sings[resourceType].hasOwnProperty(s)) {
                        if (this.sings[resourceType][s](subject)) {
                            variants.push(firstUpper(s));
                        }
                    }
                }
            }
            return variants;
        };
    }(firstUpper);
    var determineNodeObject = function($, createChild, toArray, determineAbstractClass) {
        return function(subject, data) {
            var objects = [], absClass = determineAbstractClass.call($, subject);
            if (absClass.indexOf("HTMLElement") >= 0) {
                objects = [ subject ];
            } else if (absClass.indexOf("Selector") >= 0 || absClass.indexOf("String") >= 0) {
                objects = createChild(subject, data || {});
            } else if (absClass.indexOf("Array") >= 0 || absClass.indexOf("RichArray") >= 0 || absClass.indexOf("Query") >= 0) {
                objects = toArray(subject);
            } else {
                $.warn("Selector unknown format " + absClass[0]);
            }
            return objects;
        };
    }(init, createChild, toArray, determineClass2);
    (function(core, Dom) {
        Dom.extend({
            show: function() {
                this.each(function(elem) {
                    if ("undefined" !== typeof elem.backupStyle && elem.backupStyle.display) {
                        core(elem).css("display", elem.backupStyle.display);
                    } else {
                        core(elem).css("display", "");
                    }
                });
                return this;
            }
        });
    })(init, Dom);
    (function(core, Dom) {
        Dom.extend({
            hide: function(selector) {
                this.each(function(elem) {
                    var currentDisplay = core(elem).css("display");
                    if (currentDisplay !== "none") {
                        if ("undefined" === typeof elem.backupStyle) elem.backupStyle = {};
                        elem.backupStyle.display = currentDisplay;
                    }
                    core(elem).css("display", "none");
                });
                return this;
            }
        });
    })(init, Dom);
    (function($) {
        $.registerSing("object", "Array", function(res) {
            if (res instanceof Array) return true;
            return false;
        });
    })(suit);
    var addEvent = function() {
        return function(elem, type, userEventHandler, once) {
            var eventHandler;
            eventHandler = function(e) {
                if (once) {
                    if (elem.addEventListener) {
                        elem.removeEventListener(type, eventHandler, false);
                    } else if (elem.attachEvent) {
                        element.detachEvent("on" + type, eventHandler);
                    } else {
                        elem["on" + type] = null;
                    }
                }
                if (function(r) {
                    return typeof r === "boolean" && r === false;
                }(userEventHandler.apply(this, arguments))) {
                    e.preventDefault();
                }
            };
            if (elem == null || typeof elem == "undefined") return;
            if (elem.addEventListener) {
                elem.addEventListener(type, eventHandler, false);
            } else if (elem.attachEvent) {
                elem.attachEvent("on" + type, eventHandler);
            } else {
                elem["on" + type] = eventHandler;
            }
        };
    }();
    var removeEvent = function() {
        return function(elem, type, userEventHandler) {
            if (elem.addEventListener) {
                elem.removeEventListener(type, userEventHandler || false, false);
            } else if (elem.attachEvent) {
                element.detachEvent("on" + type, userEventHandler);
            } else {
                elem["on" + type] = null;
            }
        };
    }();
    (function($, Dom) {
        Dom.extend({
            present: function(flag) {
                this.each(function(elem) {
                    if (flag) $(elem).show(); else $(elem).hide();
                });
                return this;
            }
        });
    })(init, Dom);
    var Objective = function(core, extend) {
        var Objective = core.registerClass("Objective", function() {
            return this;
        });
        Objective.assignTo("Object");
        Objective.assignTo("Selector");
        Objective.assignTo("Array");
        return Objective;
    }(init, null);
    var codecs = function() {
        return {
            ogg: 'video/ogg; codecs="theora, vorbis"',
            ogv: 'video/ogv; codecs="vorbis"',
            webm: "video/webm",
            mp4: "video/mp4"
        };
    }();
    (function(core, Dom, determineNodeObject) {
        Dom.extend({
            put: function(subject, data) {
                var objects = determineNodeObject(subject, data);
                this.each(function() {
                    for (i = 0; i < objects.length; ++i) {
                        this.appendChild(objects[i]);
                    }
                });
                return core(objects, "HTMLElement");
            }
        });
    })(init, Dom, determineNodeObject);
    Dom.extend({
        empty: function() {
            this.each(function() {
                this.innerHTML = "";
            });
            return this;
        }
    });
    Dom.extend({
        css: function() {
            var data, polymorph = [];
            "object" === typeof arguments[0] ? arguments[0] instanceof Array ? (polymorph = arguments[0], 
            data = arguments[1]) : data = arguments[0] : arguments.length > 1 ? (data = {}, 
            data[arguments[0]] = arguments[1]) : data = arguments[0];
            if ("object" === typeof data) {
                this.each(function() {
                    for (var i in data) {
                        if (polymorph.length !== 0) for (var p = 0; p < polymorph.length; p++) this.style[polymorph[p] + i] = data[i];
                        this.style[i] = data[i];
                    }
                });
                return this;
            } else {
                return this[0].style[data];
            }
        }
    });
    Dom.extend({
        condition: function(condit, onTrue, onFalse) {
            if (condit) {
                if (typeof onTrue == "function") return onTrue.call(this, condit);
                return this;
            } else {
                if (typeof onFalse == "function") return onFalse.call(this);
                return this;
            }
        }
    });
    Dom.extend({
        classed: function() {
            var className = arguments[0].split(" "), i, flag = !!arguments[1];
            this.each(function(el) {
                for (i = 0; i < className.length; ++i) {
                    var st = el.className.split(" ");
                    if (flag) {
                        st.indexOf(className[i]) < 0 && (st.push(className[i]), 
                        el.className = st.join(" "));
                    } else {
                        var st = el.className.split(" ");
                        var index = st.indexOf(className[i]);
                        if (index > -1) {
                            st.splice(index, 1);
                            el.className = st.join(" ");
                        }
                    }
                }
            });
            return this;
        }
    });
    (function(Dom, addEvent, removeEvent, toArray) {
        Dom.extend({
            bind: function() {
                var args = arguments;
                var events = args[0].split(" ");
                this.each(function() {
                    if (events[e] === "") return true;
                    for (var e = 0; e < events.length; ++e) {
                        addEvent(this, events[e], args[1], args[2] || false);
                    }
                });
                return this;
            },
            on: function() {
                return this.bind.apply(this, arguments);
            },
            once: function() {
                var args = toArray(arguments);
                args[2] = true;
                return this.bind.apply(this, args);
            },
            unbind: function() {
                var args = arguments;
                var events = args[0].split(" ");
                this.each(function() {
                    for (var e = 0; e < events.length; ++e) {
                        removeEvent(this, events[e], args[1] || false);
                    }
                });
                return this;
            }
        });
    })(Dom, addEvent, removeEvent, toArray);
    Dom.extend({
        html: function(html) {
            if ("undefined" === typeof html) {
                if (this.length <= 0) return null;
                return this[0].innerHTML;
            } else {
                this.each(function() {
                    this.innerHTML = html;
                });
            }
            return this;
        }
    });
    (function($, Dom, determineNodeObject) {
        Dom.extend({
            and: function(subject, data) {
                var objects = determineNodeObject(subject, data);
                this.each(function() {
                    var parent = this.parentNode;
                    if (parent.lastChild === this) {
                        for (i = 0; i < objects.length; ++i) {
                            parent.appendChild(objects[i]);
                        }
                    } else {
                        for (i = 0; i < objects.length; ++i) {
                            parent.insertBefore(objects[i], this.nextSibling);
                        }
                    }
                });
                return $(objects, "HTMLElement");
            }
        });
    })(init, Dom, determineNodeObject);
    Dom.extend({
        width: function() {
            if (this[0] === window) {
                var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName("body")[0];
                return w.innerWidth || e.clientWidth || g.clientWidth;
            } else {
                return this[0].offsetWidth;
            }
        }
    });
    Dom.extend({
        height: function() {
            if (this[0] === window) {
                var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName("body")[0];
                return w.innerWidth || e.clientHeight || g.clientHeight;
            } else {
                return this[0].offsetHeight;
            }
        }
    });
    Objective.extend({
        tie: function(fn) {
            fn.call(this);
            return this;
        }
    });
    (function($, codecs) {
        var is_firefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
        var removeEventListner = function(el, type, handler) {
            if (el.addEventListener) {
                el.removeEventListener(type, handler, false);
            } else if (elem.attachEvent) {
                el.detachEvent("on" + type, handler);
            } else {
                el["on" + type] = null;
            }
        }, eventListner = function(el, type, handler, once) {
            var realhandler = once ? function() {
                removeEventListner(el, type, realhandler);
            } : handler;
            if (el.addEventListener) {
                listen = el.addEventListener(type, handler, false);
            } else if (el.attachEvent) {
                listen = el.addEventListener("on" + type, handler, false);
            } else {
                el["on" + type] = handler;
            }
            return el;
        };
        function requestFullScreen(element) {
            var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;
            if (requestMethod) {
                requestMethod.call(element);
            } else if (typeof window.ActiveXObject !== "undefined") {
                try {
                    var wscript = new ActiveXObject("WScript.Shell");
                } catch (e) {
                    return false;
                }
                if (wscript !== null) {
                    wscript.SendKeys("{F11}");
                }
            }
        }
        function exitFullScreenMode() {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
            if (typeof window.ActiveXObject !== "undefined") {
                try {
                    var wscript = new ActiveXObject("WScript.Shell");
                } catch (e) {
                    return false;
                }
                wscript.SendKeys("{F11}");
            }
            if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
        var svgIcons = {
            "synthetic-video-icon-fullscreen": '<g id="synthetic-video-icon-fullscreen"><path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M0,0v3v5h3V3.005l5.984,0.01L9,0H3H0z M3,14.995V10H0v5v3h3h6l-0.016-3.016L3,14.995z M21,0h-6l0.016,3.016L21,3.005V8h3V3V0H21z M21,14.995l-5.984-0.011L15,18h6h3v-3v-5h-3V14.995z"/></g>',
            "synthetic-video-icon-normalscreen": '<g id="synthetic-video-icon-normalscreen"><path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M0,10l0.016,3.016L6,13.005V18h3v-5v-3H6H0z M24,8l-0.016-3.016L18,4.995V0h-3v5v3h3H24z M6,4.995l-5.984-0.01L0,8h6h3V5V0H6V4.995z M15,10v3v5h3v-4.995l5.984,0.011L24,10h-6H15z"/></g>',
            "synthetic-video-icon-pause": '<g id="synthetic-video-icon-pause"><rect fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="4" x="6" y="2" height="13.75"/><rect x="13.75" y="2" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="4" height="13.75"/></g>'
        };
        function createSvgSprite(id) {
            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.style.width = "24px";
            svg.style.height = "18px";
            $(this).html('<svg width="24px" height="18px">' + svgIcons[id] + "</svg>");
        }
        Synthetic.createComponent("synthetic-video", function($component) {
            $component.attached(function($element) {}).created(function($self, $element, $scope, $component) {
                console.log("creating");
                $scope.loaded = false;
                this.videoElement = $($element).empty().put("video", {
                    classed: ""
                }).bind("dblclick", function() {
                    $self.toggleFullscreen();
                    e.stopPropagation();
                    return false;
                }).bind("click", function() {
                    $self.toggle();
                })[0];
                this.dummy = false;
                $($element).css({
                    position: "relative"
                });
                this.videoControl = $($element).put("div", {
                    "class": "synthetic-video__controll"
                }).bind("click", function() {
                    $self.toggle();
                }).bind("dblclick", function() {
                    $self.toggleFullscreen();
                    e.stopPropagation();
                    return false;
                });
                this.videoControlPlay = this.videoControl.put("a", {
                    "class": "synthetic-video__playbtn synthetic-video__unvisible",
                    href: ""
                }).tie(function() {
                    $(this).put("div").html('<svg><g><path fill="none" d="M29,16.491L0,32.982V0L29,16.491z"/></g></svg>');
                }).bind("click", function(e) {
                    if (!$scope.playing) {
                        $self.play();
                    } else {
                        $self.stop();
                    }
                    e.stopPropagation();
                    return false;
                });
                this.videoControlFullscreen = this.videoControl.put("a", {
                    href: "",
                    "class": "synthetic-video__fullscreenbtn"
                }).tie(function() {
                    $(this).put("span", {
                        "class": "synthetic-video__disabled"
                    }).tie(function() {
                        createSvgSprite.call(this, "synthetic-video-icon-fullscreen");
                    }).and("span", {
                        "class": "synthetic-video__enabled"
                    }).tie(function() {
                        createSvgSprite.call(this, "synthetic-video-icon-normalscreen");
                    });
                }).bind("click", function(e) {
                    if ($scope.fullscreen) {
                        $self.normalView();
                    } else {
                        $self.fullscreen();
                    }
                    e.stopPropagation();
                    return false;
                });
                this.videoControlPausebtn = this.videoControl.put("a", {
                    href: "",
                    "class": "synthetic-video__pausebtn"
                }).tie(function() {
                    $(this).put("span", {}).tie(function() {
                        createSvgSprite.call(this, "synthetic-video-icon-pause");
                    });
                }).bind("click", function(e) {
                    $self.toggle();
                    e.stopPropagation();
                    return false;
                });
                document.addEventListener("fullscreenchange", function() {
                    $self.testExitFullscreen();
                }, false);
                document.addEventListener("webkitfullscreenchange", function() {
                    $self.testExitFullscreen();
                }, false);
                document.addEventListener("mozfullscreenchange", function() {
                    $self.testExitFullscreen();
                }, false);
                document.addEventListener("MSFullscreenChange", function() {
                    $self.testExitFullscreen();
                }, false);
                if ($scope.attributes.ratio) {
                    eventListner(window, "resize", function() {
                        $self.trimVideo();
                    });
                }
            });
            $component.watch("attributes", [ "poster" ], function($scope, poster) {
                if (poster) this.videoElement.setAttribute("poster", poster); else this.videoElement.removeAttribute("poster");
            });
            $component.watch("attributes", [ "controls" ], function($scope, controls) {
                this.videoControlPlay.present(Synthetic.hasPropertySubKey(controls, "play"));
                this.videoControlFullscreen.present(Synthetic.hasPropertySubKey(controls, "fullscreen"));
            });
            $component.watch("attributes", [ "ratio" ], function($self, ratio) {
                $self.trimVideo();
            });
            $component.watch("attributes", [ "types", "src" ], function($scope, types, src) {
                $(this.videoElement).empty();
                types = types.split(","), psrc = src.lastIndexOf(".") > src.lastIndexOf("/") ? src.substring(0, src.lastIndexOf(".")) : src;
                for (var i = 0; i < types.length; ++i) {
                    $(this.videoElement).put("source", {
                        src: psrc + "." + types[i],
                        type: codecs[types[i]] || ""
                    });
                }
                $scope.loaded = false;
                this.videoElement.load();
                $scope.waitForEscapeFullscreen = false;
                $scope.playing = false;
                this.testVideo();
            });
            $component.watch([ "loaded" ], function($self, $scope, loaded) {
                $(this.videoElement).classed("synthetic-video__unvisible", !loaded);
                if (loaded) {
                    this.trimVideo();
                    if ($scope.attributes.autoplay) {
                        setTimeout(function() {
                            $self.play();
                        }, 100);
                    }
                }
            });
            $component.watch("attributes", [ "muted" ], function(muted) {
                this.videoElement.muted = !!muted;
            });
            $component.watch("attributes", [ "ratio", "valign", "vshift" ], function($scope, $element, ratio, valign, vshift) {
                var width = $($element).width();
                var wrapH = parseInt(width) * parseFloat(ratio);
                var vidH = $(this.videoElement).height();
                switch (valign || "middle") {
                  case "top":
                    var vidTop = 0;
                    break;

                  case "middle":
                    var vidTop = (wrapH - vidH) / 2;
                    break;

                  case "bottom":
                    var vidTop = wrapH - vidH;
                    break;
                }
                vidTop += parseInt(vshift);
                if ($scope.waitForEscapeFullscreen) {
                    $(this.videoElement).css({
                        "margin-top": "0px"
                    });
                } else {
                    $(this.videoElement).css({
                        "margin-top": vidTop + "px"
                    });
                }
            });
            $component.watch([ "fullscreen" ], function($self, fullscreen) {
                $($self.videoControlFullscreen).classed("synthetic-video__active", fullscreen);
            });
            $component.watch([ "playing", "loaded" ], function(playing, loaded) {
                $(this.videoControlPausebtn).classed("synthetic-video__unvisible", !playing && !!loaded);
                $(this.videoControlPlay).classed("synthetic-video__unvisible", !(!playing && !!loaded));
                $(this.videoControlFullscreen).classed("synthetic-video__unvisible", !loaded);
            });
            return {
                testVideo: function($scope) {
                    var that = this, max = is_firefox ? 2 : 3;
                    if (this.videoElement.readyState === 0) {
                        console.log("wtf?");
                        this.trimVideo();
                    }
                    if (this.videoElement.readyState < max) {
                        setTimeout(function() {
                            that.testVideo();
                        }, 300);
                    } else {
                        $scope.loaded = true;
                    }
                },
                trimVideo: function($element, $scope) {
                    if (this.videoElement.videoHeight == 0) return;
                    if ($scope.attributes.ratio && !$scope.fullscreen) $($element).css("height", Math.round($($element).width() * parseFloat($scope.attributes.ratio)) + "px");
                    if ($scope.fullscreen) $($element).css("height", "100%");
                    var vrHeight = this.videoElement.videoHeight, vrWidth = this.videoElement.videoWidth, wrapperWidth = !!$scope.fullscreen ? $(window).width() : $($element).width(), wrapperHeight = $scope.attributes.ratio && !$scope.fullscreen ? Math.round(parseFloat($scope.attributes.ratio) * wrapperWidth) : $($element).height(), wr = wrapperWidth / vrWidth, relHeight = vrHeight * wr;
                    $(this.videoElement).css({
                        width: wrapperWidth + "px",
                        height: relHeight + "px"
                    });
                    if ($scope.attributes.ratio) {
                        $(this.videoElement).css({
                            marginTop: Math.round((wrapperHeight - relHeight) / 2) + "px"
                        });
                    }
                },
                play: function($scope, force) {
                    if ($scope.mobileAPI && !force) {
                        this.fullscreen();
                    } else {
                        $(this.videoElement).classed("synthetic-video__unvisible", false);
                        $scope.playing = true;
                        this.displayVideo(true);
                        this.trimVideo();
                    }
                    return this;
                },
                stop: function($scope, pause) {
                    if (this.mobileAPI && !pause) {
                        $(this.videoElement).classed("synthetic-video__unvisible", true);
                    }
                    this.videoElement.pause();
                    $scope.playing = false;
                    return this;
                },
                toggle: function($scope) {
                    if ($scope.playing) this.stop(true); else this.play();
                },
                toggleFullscreen: function($scope) {
                    if ($scope.fullscreen) this.normalView(); else this.fullscreen();
                },
                fullscreen: function($element, $self, $scope) {
                    $($element).classed("synthetic-video__require-fullscreen", true);
                    this.backupCss = {
                        width: $element.style.width,
                        height: $element.style.height
                    };
                    $($element).css({
                        width: "100%",
                        height: "100%"
                    });
                    $scope.fullscreen = true;
                    this.dummy = $($element).and("div").css({
                        display: "none"
                    })[0];
                    document.body.appendChild($element);
                    this.play(true);
                    requestFullScreen(document.body);
                    setTimeout(function() {
                        $("body").classed("synthetic-video__require-fullscreen", true);
                        $scope.waitForEscapeFullscreen = true;
                        $self.trimVideo();
                    }, 350);
                    return this;
                },
                normalView: function($self, $element, $scope, cssOnly) {
                    $($element).classed("synthetic-video__require-fullscreen", false);
                    $($element).css(this.backupCss);
                    $scope.fullscreen = false;
                    $scope.waitForEscapeFullscreen = false;
                    if (!cssOnly) {
                        exitFullScreenMode();
                    }
                    if ($scope.attributes.stopOutFullscreen) this.stop();
                    if (this.dummy) {
                        $(this.dummy).and($element);
                        $(this.dummy)[0].parentNode.removeChild(this.dummy);
                        this.videoElement.play();
                    }
                    $("body").classed("synthetic-video__require-fullscreen", false);
                    setTimeout(function() {
                        $self.trimVideo();
                    }, 350);
                    return this;
                },
                testExitFullscreen: function($scope) {
                    if ($scope.waitForEscapeFullscreen) {
                        this.normalView(true);
                    }
                },
                displayVideo: function($scope, ok, fullscreen) {
                    this.displayWrapper();
                    if (ok || false) {
                        if ($scope.loaded) $(this.videoElement).classed("synthetic-video__unvisible", false);
                        this.videoElement.play();
                        if (fullscreen) this.fullscreen();
                    }
                },
                displayWrapper: function($element) {
                    $($element).classed("synthetic-video__unvisible", false);
                }
            };
        });
    })(init, codecs);
})();