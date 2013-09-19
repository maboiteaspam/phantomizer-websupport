
    (function($) {
        var ioDim, _base;
        ioDim = function(elem, Dimension, dimension, includeBorder, includeMargin) {
            var sides, size;
            if (elem) {
                size = elem[dimension]();
                sides = {
                    width: ["left", "right"],
                    height: ["top", "bottom"]
                };
                sides[dimension].forEach(function(side) {
                    size += parseInt(elem.css("padding-" + side), 10);
                    if (includeBorder) {
                        size += parseInt(elem.css("border-" + side + "-width"), 10);
                    }
                    if (includeMargin) {
                        return size += parseInt(elem.css("margin-" + side), 10);
                    }
                });
                return size;
            } else {
                return null;
            }
        };
        ["width", "height"].forEach(function(dimension) {
            var Dimension, _base, _base1, _name, _name1;
            Dimension = dimension.replace(/./, function(m) {
                return m[0].toUpperCase();
            });
            (_base = $.fn)[_name = "inner" + Dimension] || (_base[_name] = function(includeMargin) {
                return ioDim(this, Dimension, dimension, false, includeMargin);
            });
            return (_base1 = $.fn)[_name1 = "outer" + Dimension] || (_base1[_name1] = function(includeMargin) {
                return ioDim(this, Dimension, dimension, true, includeMargin);
            });
        });
        return (_base = $.fn).detach || (_base.detach = function(selector) {
            var cloned, set;
            set = this;
            if (selector != null) {
                set = set.filter(selector);
            }
            cloned = set.clone(true);
            set.remove();
            return cloned;
        });
    })(Zepto);
