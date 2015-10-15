$ = require("jquery");
s_ = require("./../spatie-front.js");

// Object
s_.viewport = {
    element : $('html'),
    breakpoint: 0,
    vhItems: $('[data-viewport-vh]'),
    toolbar: $('[data-viewport-toolbar]'),
    inMotion: false, //can be used to check if page is currently scrolling
    scrollTop: 0,
    measure: function () {
        this.height = $(window).height();
        this.width = $(window).width();
        this.breakpoint = parseInt(this.element.data('viewport-breakpoint')) > 0 ? parseInt(this.element.data('viewport-breakpoint')) : 0;

        this.element.toggleClass('$viewport-small', this.breakpoint > this.width );

        return this;
    },
    fixVH: function () {
        this.vhItems.each(function () {
            $(this).outerHeight(s_.viewport.height / 100 * $(this).data('viewport-vh'));
        })

        return this;
    },
    scrollToHash: function () {
        if (window.location.hash != '') {
            s_.viewport.scrollToElement($(window.location.hash));
        }
    },
    update: function () {
        //only do stuff if we need to watch viewport
        if (!this.inMotion) {
            this.scrollTop = $(window).scrollTop();
        }
        if (this.scrollTop > 0) {
            s_.viewport.element.addClass('$viewport-scrolled');
        }
        else {
            s_.viewport.element.removeClass('$viewport-scrolled');
        }

        return this;
    },
    scrollToY: function (offsetY) {
        this.inMotion = true; //can be used to check if page is currently scrolling

        // Don't scroll under toolbar
        if (s_.viewport.toolbar.size()) {
            offsetY = offsetY - s_.viewport.toolbar.outerHeight();
        }

        $('body,html').animate({scrollTop: offsetY}, '5000', 'swing', function () {
            s_.viewport.inMotion = false;
            s_.viewport.update();
        });

        return this;
    },
    scrollToElementOutOfView: function ($el) {
        var begin = $('body').scrollTop();
        var end = $('body').scrollTop() + $(window).height();

        if (($el.offset().top < begin) || ($el.offset().top > end)) {
            this.scrollToY($el.offset().top - 50);
        }

        return this;
    },
    scrollToElement: function ($el) {
        if ($el.length) {
            var offsetY = $el.offset().top;
            this.scrollToY(offsetY);
        }
        ;

        return this;
    },
    disableScroll: function () {
        $(window, 'body').on('scroll.disabled touchmove.disabled mousewheel.disabled', function (e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        return this;
    },
    reEnableScroll: function () {
        $(window, 'body').off('scroll.disabled touchmove.disabled mousewheel.disabled');

        return this;
    },
    handlers: function () {
        $('[data-viewport-scroll]').on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();

            var href = $(this).attr('href');
            if (href == '#') {
                s_.viewport.scrollToY(0);
            } else {
                s_.viewport.scrollToElement($(href));
            }
            return false;
        });

        return this;
    }
};

$(document).ready(function () {
    s_.viewport.handlers().measure().fixVH();
});

$(window).resize(function () {
    s_.viewport.measure().fixVH().update();
});

$(window).load(function () {
    s_.viewport.scrollToHash();
    s_.viewport.element.addClass('$viewport-loaded');

});

$(window).scroll(function () {
    s_.viewport.update();
});

module.exports = s_.viewport;




