import { Rect              } from '../../src/view/geometry';
import { Row,
         getRows,
         removeWhitespace,
         rectFromString    } from './helpers';
import { inject            } from '../../src/di';

let waitForFrame = inject( 'waitForFrame' );

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
                    waitForFrame.flush();
                    let iResult: jasmine.CustomMatcherResult = { pass: true, message: '' };

                    let iRows = getRows( expected );

                    if ( !lengthMatch( context.rendered, iRows ) ) {
                        throw new Error( `Expected and actual render operations differ ( ${ context.rendered.length } vs ${ iRows.length } )` )
                    }

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

                let iTypeMismatch = aRendered.type != iAction;

                if ( iTypeMismatch ) {
                    return {
                        pass:    false,
                        message: `Expected a ${ iAction }, but ${ aRendered.type } was rendered instead`
                    }
                }

                switch ( iAction ) {
                    case 'Rectangle':
                    case 'Erase':
                        let iExpectedBounds = rectFromString( iParams ),
                            iActualBounds   = aRendered.bounds;

                        return rectMatch( iActualBounds, iExpectedBounds )
                    default:
                        throw new Error( "Could not find the requested render action" )
                }
            }

            function lengthMatch( aActual: any[], aExpected: any[] ) : boolean {
                return aActual.length == aExpected.length;
            }

        }
    });
});
