(function (globals) {
    "use strict";

    Bridge.define('ControlHome.App', {
        statics: {
            config: {
                init: function () {
                    Bridge.ready(this.main);
                }
            },
            main: function () {
                var $t, $t1;
                //No Scroll Bar
                document.body.style.overflow = "hidden";
    
                //Adding Background
                console.info("Loading Background");
                var imgPixels = Math.max(window.screen.width, window.screen.height);
                var imgSelector = imgPixels >= 1920 ? "../img/City_Wallpaper_orig_low.jpg" : imgPixels >= 1280 ? "../img/City_Wallpaper_1920X1080.jpg" : imgPixels >= 320 ? "../img/City_Wallpaper_1280X720.jpg" : "../img/City_Wallpaper_320X180";
                new ControlHome.HTMLBackground(imgSelector, 0.82);
    
                //Loading button list to display
                console.info("Loading JSON file");
                var json = ControlHome.StaticTools.loadDoc("../data/box_list.json");
    
                var ptList = new System.Collections.Generic.List$1(ControlHome.StaticTools.pulsTimer)();
                var urlList = new System.Collections.Generic.List$1(ControlHome.StaticTools.urlBox)();
    
                //string json = "{\"box_list\":[{...}]}";        
                ptList.addRange(Bridge.as((JSON.parse(json).box_list), System.Collections.Generic.IEnumerable$1(ControlHome.StaticTools.pulsTimer)));
                urlList.addRange(Bridge.as((JSON.parse(json).box_urls), System.Collections.Generic.IEnumerable$1(ControlHome.StaticTools.urlBox)));
                var arduino_URL = Bridge.as(JSON.parse(json).arduino_URL, String);
    
                console.info("Loading boxStructure");
                var boxStructure = new ControlHome.HTMLBoxStructure();
    
    
                //Adding all pulseTimer Events
                console.info("Loading pulseTimer boxes");
                $t = Bridge.getEnumerator(ptList);
                while ($t.moveNext()) {
                    var pt = $t.getCurrent();
                    ControlHome.StaticTools.addArduinoLightBox(boxStructure, pt.name, arduino_URL, JSON.stringify(pt));
                }
    
                //Adding an external link
                console.info("Loading url boxes");
                $t1 = Bridge.getEnumerator(urlList);
                while ($t1.moveNext()) {
                    (function () {
                        var ub = $t1.getCurrent();
                        boxStructure.addBox$1(new ControlHome.HTMLBox(ub.name, function () {
                            window.open(ub.url, "_blank");
                        }));
                    }).call(this);
                }
    
                window.setTimeout($_.ControlHome.App.f1, 10);
            }
        },
        $entryPoint: true
    });
    
    var $_ = {};
    
    Bridge.ns("ControlHome.App", $_);
    
    Bridge.apply($_.ControlHome.App, {
        f1: function () {
            //toggle resize event manually
            var ev = new CustomEvent("resize", new Object());
            ev.initCustomEvent("resize", true, false, { });
            window.dispatchEvent(ev);
        }
    });
    
    Bridge.define('ControlHome.HTMLBackground', {
        config: {
            properties: {
                background: null,
                image: null
            }
        },
        constructor: function (url, opacity, delay) {
            if (delay === void 0) { delay = 3; }
    
            this.setbackground(document.createElement('div'));
            this.getbackground().style.zIndex = "-1";
            this.getbackground().style.overflow = "hidden";
            this.getbackground().style.visibility = "visible";
            this.getbackground().style.position = "fixed";
            this.getbackground().style.top = "0px";
            this.getbackground().style.left = "0px";
            this.getbackground().style.width = System.String.format("{0}px", window.innerWidth);
            this.getbackground().style.height = System.String.format("{0}px", window.innerHeight);
            this.getbackground().style.opacity = System.String.format("{0}", 0);
    
            document.body.appendChild(this.getbackground());
    
            this.setimage(new Image());
            this.getimage().src = url;
            this.getimage().style.position = "relative";
            this.getbackground().appendChild(this.getimage());
    
            this.getimage().onload = Bridge.fn.combine(this.getimage().onload, Bridge.fn.bind(this, function () {
                this.sizeElements();
    
                this.getbackground().style.transitionDuration = System.String.format("{0}s", delay);
                this.getbackground().style.opacity = System.String.format("{0}", opacity);
            }));
    
            window.onresize = Bridge.fn.combine(window.onresize, Bridge.fn.bind(this, $_.ControlHome.HTMLBackground.f1));
        },
        sizeElements: function () {
            var w = window.innerWidth;
            var h = window.innerHeight;
            this.getbackground().style.width = System.String.format("{0}px", w);
            this.getbackground().style.height = System.String.format("{0}px", h);
            var top, left, height, width;
            var frameR = w / h;
            var imageR = this.getimage().naturalWidth / this.getimage().naturalHeight;
    
            if (imageR > frameR) {
                height = h;
                width = h * imageR;
                top = 0;
                left = -(width - w) / 2;
            }
            else  {
                height = w / imageR;
                width = w;
                top = -(height - h) / 2;
                left = 0;
            }
    
            this.getimage().style.top = System.String.format("{0}px", top);
            this.getimage().style.left = System.String.format("{0}px", left);
            this.getimage().style.height = System.String.format("{0}px", height);
            this.getimage().style.width = System.String.format("{0}px", width);
        }
    });
    
    Bridge.ns("ControlHome.HTMLBackground", $_);
    
    Bridge.apply($_.ControlHome.HTMLBackground, {
        f1: function () {
            this.getbackground().style.transitionDuration = System.String.format("{0}s", 0);
            this.sizeElements();
        }
    });
    
    Bridge.define('ControlHome.HTMLBox', {
        color$1: "rgba(200, 200, 200, .35)",
        colorHover: "rgba(193, 193, 214, .10)",
        colorActive: "rgba(193, 193, 214, .50)",
        config: {
            properties: {
                box: null,
                text: null
            }
        },
        constructor: function (text, onClick) {
            if (text === void 0) { text = null; }
            if (onClick === void 0) { onClick = null; }
    
            this.setbox(document.createElement('div'));
            this.getbox().style.position = "fixed";
            this.getbox().style.backgroundColor = this.color$1;
            this.getbox().style.borderColor = "#FDFDFD";
            this.getbox().style.borderStyle = "solid";
            this.getbox().style.transitionDuration = "0.5s";
            this.getbox().style.transitionProperty = "background-color";
    
            this.getbox().onmouseenter = Bridge.fn.combine(this.getbox().onmouseenter, Bridge.fn.bind(this, $_.ControlHome.HTMLBox.f1));
            this.getbox().onmouseup = Bridge.fn.combine(this.getbox().onmouseup, Bridge.fn.bind(this, $_.ControlHome.HTMLBox.f1));
            this.getbox().ontouchstart = Bridge.fn.combine(this.getbox().ontouchstart, Bridge.fn.bind(this, $_.ControlHome.HTMLBox.f2));
            this.getbox().onmousedown = Bridge.fn.combine(this.getbox().onmousedown, Bridge.fn.bind(this, $_.ControlHome.HTMLBox.f2));
            this.getbox().onmouseleave = Bridge.fn.combine(this.getbox().onmouseleave, Bridge.fn.bind(this, $_.ControlHome.HTMLBox.f3));
            this.getbox().ontouchend = Bridge.fn.combine(this.getbox().ontouchend, Bridge.fn.bind(this, $_.ControlHome.HTMLBox.f3));
    
            if (!Bridge.staticEquals(onClick, null)) {
                this.getbox().onclick = Bridge.fn.combine(this.getbox().onclick, function () {
                    onClick();
                });
            }
    
            if (text != null) {
                this.settext(document.createElement('div'));
                this.gettext().innerHTML = text;
                this.gettext().style.position = "relative";
                this.gettext().style.color = "#FDFDFD";
                this.gettext().style.textAlign = "center";
                this.gettext().style.fontFamily = "buttonFont";
                this.gettext().style.cursor = "default";
                this.getbox().appendChild(this.gettext());
            }
        },
        action: function (onClick) {
            this.getbox().onclick = Bridge.fn.combine(this.getbox().onclick, function () {
                onClick();
            });
        },
        color: function (color, delay) {
            this.getbox().style.backgroundColor = color;
            window.setTimeout(Bridge.fn.bind(this, $_.ControlHome.HTMLBox.f3), delay);
        },
        size: function (Top, Left, Height, Width) {
            var s = 0.8 * Math.min(Width, Height);
            var borderWidth = s * 0.03;
            if (borderWidth < 1) {
                borderWidth = 1;
            }
            Top = Top + (Height - s) / 2;
            Left = Left + (Width - s) / 2;
    
            this.getbox().style.borderWidth = System.String.format("{0}px", borderWidth);
            this.getbox().style.borderRadius = System.String.format("{0}px", s * 0.15);
            this.getbox().style.top = System.String.format("{0}px", Top);
            this.getbox().style.left = System.String.format("{0}px", Left);
            this.getbox().style.height = System.String.format("{0}px", s);
            this.getbox().style.width = System.String.format("{0}px", s);
            this.gettext().style.fontSize = System.String.format("{0}px", s * 0.08);
            this.gettext().style.top = System.String.format("{0}px", (s - this.gettext().clientHeight) / 2);
        }
    });
    
    Bridge.ns("ControlHome.HTMLBox", $_);
    
    Bridge.apply($_.ControlHome.HTMLBox, {
        f1: function () {
            this.getbox().style.backgroundColor = this.colorHover;
        },
        f2: function () {
            this.getbox().style.backgroundColor = this.colorActive;
        },
        f3: function () {
            this.getbox().style.backgroundColor = this.color$1;
        }
    });
    
    Bridge.define('ControlHome.HTMLBoxStructure', {
        parRel: false,
        config: {
            properties: {
                div: null,
                list: null
            }
        },
        constructor: function (div) {
            if (div === void 0) { div = null; }
    
            this.setlist(new System.Collections.Generic.List$1(ControlHome.HTMLBox)());
    
            if (div != null) {
                this.setdiv(div);
                this.parRel = true;
            }
            else  {
                this.setdiv(document.createElement('div'));
                this.getdiv().style.position = "fixed";
                this.getdiv().style.top = "0px";
                this.getdiv().style.left = "0px";
                document.body.appendChild(this.getdiv());
                this.parRel = false;
            }
    
            this.getdiv().onload = Bridge.fn.combine(this.getdiv().onload, Bridge.fn.bind(this, $_.ControlHome.HTMLBoxStructure.f1));
            window.onresize = Bridge.fn.combine(window.onresize, Bridge.fn.bind(this, $_.ControlHome.HTMLBoxStructure.f1));
        },
        addBox: function (text, onClick) {
            if (text === void 0) { text = null; }
            if (onClick === void 0) { onClick = null; }
            var box = new ControlHome.HTMLBox(text, onClick);
            this.getdiv().appendChild(box.getbox());
            this.getlist().add(box);
            this.sizeElements();
            return box;
        },
        addBox$1: function (box) {
            this.getdiv().appendChild(box.getbox());
            this.getlist().add(box);
            this.sizeElements();
        },
        sizeElements: function () {
            if (!this.parRel) {
                this.getdiv().style.width = System.String.format("{0}px", window.innerWidth);
                this.getdiv().style.height = System.String.format("{0}px", window.innerHeight);
            }
    
            var w = this.getdiv().clientWidth;
            var h = this.getdiv().clientHeight;
            var listLen = this.getlist().getCount();
            if (listLen === 0) {
                return;
            }
    
            var y = Bridge.Math.round((Math.sqrt(listLen * (h / w))), 0, 6);
            var x = Bridge.Math.round(((listLen / Math.sqrt(listLen * (h / w)))), 0, 6);
    
            if ((x * y) < listLen) {
                if ((x / y) < (w / h)) {
                    x += 1;
                }
                else  {
                    y += 1;
                }
            }
    
            while ((x * (y - 1)) >= listLen) {
                y -= 1;
            }
            while ((y * (x - 1)) >= listLen) {
                x -= 1;
            }
    
            var boxHeight = (h / y);
            var boxWidth = (w / x);
    
            for (var j = 0, k = 0; j < y; j = (j + 1) | 0) {
                for (var i = 0; i < x && k < listLen; i = (i + 1) | 0, k = (k + 1) | 0) {
                    var top = this.getdiv().offsetTop + j * boxHeight;
                    var left = this.getdiv().offsetLeft + i * boxWidth;
                    var height = ((((j + 1) | 0)) * boxHeight > h) ? h - top : boxHeight;
                    var width = ((((i + 1) | 0)) * boxWidth > w) ? w - left : boxWidth;
                    //list.ElementAt (k).Size (top, left, height, width);
                    this.getlist().getItem(k).size(top, left, height, width);
                }
            }
        }
    });
    
    Bridge.ns("ControlHome.HTMLBoxStructure", $_);
    
    Bridge.apply($_.ControlHome.HTMLBoxStructure, {
        f1: function () {
            this.sizeElements();
        }
    });
    
    Bridge.define('ControlHome.StaticTools', {
        statics: {
            succes: "rgba(63, 191, 63, 0.9)",
            error: "rgba(238, 80, 32, 0.9)",
            addArduinoLightBox: function (parent, text, url, json) {
                if (json === void 0) { json = null; }
                var box = new ControlHome.HTMLBox(text);
                box.action(function () {
                    var actionError = function (e) {
                        console.error("Error", e);
                        box.color(ControlHome.StaticTools.error, 1000);
                    };
                    var actionSucces = function (e) {
                        console.info("Succes", e);
                        box.color(ControlHome.StaticTools.succes, 1000);
                        ControlHome.StaticTools.vibrate(250);
                    };
                    var request = new XMLHttpRequest();
                    if (json != null) {
                        request.open("POST", url, true);
                        request.setRequestHeader("Content-Type", "application/json");
                        request.timeout = 1250;
                        request.send(json);
                    }
                    else  {
                        request.open("GET", url, true);
                        request.timeout = 1250;
                        request.send();
                    }
                    request.ontimeout = Bridge.fn.combine(request.ontimeout, actionError);
                    request.onabort = Bridge.fn.combine(request.onabort, actionError);
                    request.onerror = Bridge.fn.combine(request.onerror, actionError);
                    request.onload = Bridge.fn.combine(request.onload, function (e) {
                        if (System.String.contains(request.responseText,"Geaccepteerd")) {
                            actionSucces(e);
                        }
                        else  {
                            actionError(e);
                        }
                    });
                });
                parent.addBox$1(box);
            },
            vibrate: function (pattern) {
                return window.navigator.vibrate(pattern);
            },
            loadDoc: function (url, onReadyStateChange) {
                if (onReadyStateChange === void 0) { onReadyStateChange = null; }
                var doc = new XMLHttpRequest();
                doc.open("GET", url, false);
                if (!Bridge.staticEquals(onReadyStateChange, null)) {
                    doc.onreadystatechange = Bridge.fn.combine(doc.onreadystatechange, onReadyStateChange);
                }
                doc.send();
                return doc.responseText;
            }
        }
    });
    
    Bridge.define('ControlHome.StaticTools.pulsTimer', {
        command: null,
        name: null,
        pin: 0,
        time: System.Int64(0),
        constructor: function (pin, time, name) {
            this.pin = pin;
            this.time = time;
            this.name = name;
            this.command = "pulsTimer";
        }
    });
    
    Bridge.define('ControlHome.StaticTools.urlBox', {
        url: null,
        name: null
    });
    
    Bridge.init();
})(this);
