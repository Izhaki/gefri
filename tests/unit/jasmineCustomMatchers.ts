import { Rect              } from '../../src/view/geometry';
import { Row,
         getRows,
         removeWhitespace,
         rectFromString    } from './helpers';

function getRectString( aBounds ): string {
    return `( ${ aBounds.x }, ${ aBounds.y }, ${ aBounds.w }, ${ aBounds.h } )`;
}

function isRectMatch( a, b ): boolean {
    return ( a.x == b.x ) &&
           ( a.y == b.y ) &&
           ( a.w == b.w ) &&
           ( a.h == b.h );
}

function isRectMismatch( a, b ): boolean {
    return !isRectMatch( a, b );
}

function getRectMismatchMessage( aActual, aExpected ): string {
    let iExpectedRect = getRectString( aActual ),
        iActualRect   = getRectString( aExpected );

    return `Expected ${ iExpectedRect } to be ${ iActualRect }`;
}

function rectMatch( aActual, aExpected ): jasmine.CustomMatcherResult {
    let isMatch = isRectMatch( aActual, aExpected );
    return {
        pass:    isMatch,
        message: isMatch ? '' : getRectMismatchMessage( aActual, aExpected )
    }
}

beforeEach( () => {

    jasmine.addMatchers({

        toEqualRect: function( util: jasmine.MatchersUtil, customEqualityTesters: Array<jasmine.CustomEqualityTester>): jasmine.CustomMatcher {
            return {
                compare: function( aActual: any, ...aExpected: any[] ): jasmine.CustomMatcherResult {
                    let [ x, y, w, h ]  = aExpected,
                        iExpected: Rect = new Rect( x, y, w, h );

                    return rectMatch( aActual, iExpected );
                }
            }
        },

        toHaveRendered: function( util: jasmine.MatchersUtil, customEqualityTesters: Array<jasmine.CustomEqualityTester>): jasmine.CustomMatcher {
            return {
                compare: function( context: any, expected: string ): jasmine.CustomMatcherResult {
                    let iResult: jasmine.CustomMatcherResult = { pass: true, message: '' };

                    let iRows = getRows( expected );

                    iRows.forEach( ( aRow ) => {
                        let iRendered = context.rendered.shift(),
                            iRowMatch = rowMatch( iRendered, aRow );

                        if ( !iRowMatch.pass ) {
                            iResult.pass = false;
                            iResult.message += iRowMatch.message +'\n';
                        }
                    });

                    return iResult;
                }
            }

            function rowMatch( aRendered, aRow ): jasmine.CustomMatcherResult {
                let [ iAction, iParams ] = aRow.map( removeWhitespace );

                switch ( iAction ) {
                    case 'Rectangle':
                        return renderedRectangleMatch( aRendered, iParams );
                    default:
                        throw new Error( "Could not find the requested render action" )
                }
            }

            function renderedRectangleMatch( aRendered, aParams ): jasmine.CustomMatcherResult {
                let iTypeMismatch   = aRendered.type != 'rect';

                if ( iTypeMismatch ) {
                    return {
                        pass:    false,
                        message: `Expected a Rectangle to be rendered, but ${ aRendered.type } was rendered instead`
                    }
                } else {
                    let iExpectedBounds = rectFromString( aParams ),
                        iActualBounds   = aRendered.bounds;

                    return rectMatch( iActualBounds, iExpectedBounds )
                }
            }
        }
    });
});
