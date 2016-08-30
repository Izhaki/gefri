beforeEach(function(){
    jasmine.addMatchers({
        toEqualRect: function() {
            return {
                compare: function ( actual, expectedX, expectedY, expectedW, expectedH ) {
                    var result = {}

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
        }
    });
});
