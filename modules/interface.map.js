$ = require("jquery");
s_ = require("./../spatie-front.js");
var GoogleMapsLoader = require('google-maps');

// Object
s_.map = {
    element: $('[data-map]'),
    readConfiguration: function () {
        this.lat = this.element.data('map-lat');
        this.lng = this.element.data('map-lng');
        this.options = this.element.data('map-options');
        this.locations = this.element.data('map-locations');
    },
    renderMap: function (google) {
        this.options.center = new google.maps.LatLng(this.lat, this.lng);
        console.log(this.options.mapTypeId);
        if (typeof this.options.mapTypeId === 'string') { //Load data from HTML: every prop is number, boolean or string. No custom objects
            console.log("string");
            this.options.mapTypeId = eval(this.options.mapTypeId);
        }

        this.renderedMap = new google.maps.Map(this.element[0], this.options);
    },
    renderLocations: function (google) {

        var renderedMap = this.renderedMap;

        this.locations.map(function (location) {
            var markerIcon = location.icon;
            var markerLatLng = new google.maps.LatLng(location.lat, location.lng);
            var markerImage = new google.maps.MarkerImage(markerIcon.image, null, null, null, new google.maps.Size(markerIcon.width, markerIcon.height));
            var marker = new google.maps.Marker({
                position: markerLatLng,
                map: renderedMap,
                flat: true,
                title: location.title,
                icon: markerImage
            });

            if (location.url != '') {
                google.maps.event.addListener(marker, 'click', function () {
                    window.location.href = location.url;
                });
            }
        });
    },
    init: function (element) {
        this.element = element;

        if (element.size()){
            var map = this;
            GoogleMapsLoader.load(function (google) {
                map.readConfiguration();
                map.renderMap(google);
                map.renderLocations(google);
            });
        }
    }
};

module.exports = s_.map;