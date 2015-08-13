$ = require("jquery");
Cookies = require("js-cookie");
s_ = require("./../spatie-front.js");

s_.tagfilter = {
    groups : $('[data-tagfilter-group]'),
    tags : $('[data-tagfilter-tag]'),
    clearButtons : $('[data-tagfilter-clear]'),
    targets : $('[data-tagfilter-target]'),
    count: $('[data-tagfilter-count]'),

    init: function(){

        //get cookie settings
        this.groups.each(function(){
            var cookieVal = Cookies.get( $(this).data('tagfilter-group'));
            if( cookieVal  ){

                // make tag array from cookie
                var $group = $(this);
                var tagArray = cookieVal.split(',');

                tagArray.map(function(tag){
                    $group.find('[data-tagfilter-tag='+ tag +']').addClass('active');
                });

            };
            s_.tagfilter.setGroupState($(this));
        });
        s_.tagfilter.execute();

        //tagfilter tag click
        this.tags.on('click', function(e){
            e.preventDefault();

            $group = s_.tagfilter.getParentGroup($(this));

            if(!$group.data('tagfilter-multiple')){
                // Clear other tag from same group
                s_.tagfilter.getFilters($group).not($(this)).removeClass('active');
            }

            $(this).toggleClass('active');

            s_.tagfilter.setGroupState($group);
            s_.tagfilter.execute( );
        });

        //tagfilter clear button
        this.clearButtons.on('click', function(e){
            e.preventDefault();

            $group = s_.tagfilter.getParentGroup($(this));

            s_.tagfilter.getFilters( $group ).removeClass('active');
            s_.tagfilter.setGroupState($group);

            s_.tagfilter.execute( );
        });

    },
    execute : function(){
        //alles aan
        s_.tagfilter.targets.data('tagfilter-target', false);

        this.groups.each(function(){
            var $group = $(this);

            // Do we nee to handle this group?
            if ( $group.data('active') == true ) {
                var tagType = $group.data('tagfilter-group');

                // Reset tagType presence on all targets
                s_.tagfilter.targets.data('tagfilter-' + tagType + '-present' , false);

                // Loop through all active tags
                $group.find('.active').each( function(){

                    var tagId = $(this).data('tagfilter-tag');

                    // Search this tag in each target
                    s_.tagfilter.targets.each(function(){
                        if( s_.tagfilter.findTagInTarget(tagId, tagType, $(this)) ){
                            $(this).data('tagfilter-' + tagType + '-present' , true);
                        }
                    });

                });

                // Done for this group. If no tags from tagtype are found, element must be filtered out
                s_.tagfilter.targets.each(function(){
                    if($(this).data('tagfilter-' + tagType + '-present') == false){
                        $(this).data('tagfilter-target', true);
                    }
                });
            }
        });

        // Filter out targets with visibility
        s_.tagfilter.targets.each(function() {
            $(this).toggleClass(':hidden', $(this).data('tagfilter-target') );
        });

        // Count visible targets
        s_.tagfilter.count.text(s_.tagfilter.targets.not(':hidden').size());

        // Update layout
        $(window).trigger('tagfilter:updated');
    },
    findTagInTarget : function(tag, tagType, $element) {
        return $element.data('tagtagfilter-' + tagType).indexOf(tag) > -1;
    }
    ,
    setGroupState : function($group){
        var inUse = $group.has('.active').length ;
        s_.tagfilter.getClearButton($group).toggleClass(':hidden', !inUse);

        // store group active state
        $group.data('active', inUse);

        //store active tags in array
        var activeTags = [];
        $group.find('.active').each(function(){
            activeTags.push($(this).data('tagfilter-tag')) ;
        })

        Cookies.set( $group.data('tagfilter-group'), inUse ? activeTags.join() : null  );
    },
    getParentGroup : function($child){
        return $child.parents('[data-tagfilter-group]');
    },
    getFilters : function($group){
        return $('[data-tagfilter-tag]', $group);
    },
    getClearButton : function($group){
        return $('[data-tagfilter-clear]', $group);
    }
}

$(document).ready(function () {
    //init tags
    s_.tagfilter.init();
});


module.exports = s_.tagfilter;


