beforeEach(function(){
    jasmine.addMatchers({
        toEqualRect: function() {
            return {
                compare: function ( actual, expectedX, expectedY, expectedW, expectedH ) {
                    var result = {};

                    result.pass =
                        ( actual.x == expectedX ) &&
                        ( actual.y == expectedY ) &&
                        ( actual.w == expectedW ) &&
                        ( actual.h == expectedH );

                    if ( result.pass === false ) {
                        result.message = "Expected " +
                            " ( " + actual.x + ', ' + actual.y + ', ' + actual.w + ', ' + actual.h + ' )' +
                            " to be ( " + expectedX + ', ' + expectedY + ', ' + expectedW + ', ' + expectedH + ' )';
                    }
                    return result;
                }
            };
        },

        toHaveRenderedRect: function() {
            return {
                compare: function ( context, expectedX, expectedY, expectedW, expectedH ) {
                    var result = {};

                    var rendered = context.rendered[0],
                        type     = rendered.type,
                        bounds   = rendered.bounds;


                    result.pass =
                        ( type == 'rect' ) &&
                        ( bounds.x == expectedX ) &&
                        ( bounds.y == expectedY ) &&
                        ( bounds.w == expectedW ) &&
                        ( bounds.h == expectedH );

                    if ( result.pass === false ) {
                        result.message = "Expected " +
                            " ( " + actual.x + ', ' + actual.y + ', ' + actual.w + ', ' + actual.h + ' )' +
                            " to be ( " + expectedX + ', ' + expectedY + ', ' + expectedW + ', ' + expectedH + ' )';
                    }
                    return result;
                }
            };
        }
    });
});
