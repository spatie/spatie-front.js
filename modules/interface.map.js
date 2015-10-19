$ = require("jquery");
s_ = require("./../spatie-front.js");
var GoogleMapsLoader = require('google-maps');

// Object
s_.map = {
    element : $('[data-map]'),
    readConfiguration : function(){
        this.lat = this.element.data('map-lat');
        this.lng = this.element.data('map-lng');
        this.lng = this.element.data('map-zoom');
        this.options = this.element.data('map-options');
        this.locations = this.element.data('map-locations');
    },
    renderMap : function(google){
        this.options.center = new google.maps.LatLng(this.lat , this.lng);
        this.map = new google.maps.Map( this.element[0] , this.options);
    },
    renderLocations : function(google){
        this.locations.map(function(){
            var markerIcon = this.icon;
            var markerLatLng = new google.maps.LatLng(this.lat,this.lng);

            var markerImage = new google.maps.MarkerImage( markerIcon.image, null, null, null, new google.maps.Size( markerIcon.width, markerIcon.height ));
            var marker = new google.maps.Marker({
                position: markerLatLng,
                map: this.map,
                flat: true,
                title: this.title,
                icon: markerImage
            });

            if(this.url!=) {
                google.maps.event.addListener(marker, 'click', function () {
                    window.location.href = this.url;
                });
            }
        });
    },
    init : function(){
        GoogleMapsLoader.load(function(google) {
            this.readConfiguration();
            this.renderMap(google);
            this.renderLocations(google);
        });
    }
};

module.exports = s_.map;