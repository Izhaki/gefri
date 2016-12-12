import { Point,
         Rect              } from '../../src/view/geometry';
import { Row,
         getRows,
         removeWhitespace,
         pointFromString,
         rectFromString,
         getPointString,
         getRectString,
         renderedToString  } from './helpers';
import { triggerNextFrame  } from '../../src/view/onNextFrame'

function round2decimals( aNumber ) {
    return Math.round( aNumber * 100 ) / 100
}

function isPointMatch( a, b ): boolean {
    return ( a.x == b.x ) &&
           ( a.y == b.y );
}

function isPointMismatch( a, b ): boolean {
    return !isPointMatch( a, b );
}

function getPointMismatchMessage( aActual, aExpected ): string {
    let iActualPoint   = getPointString( aActual ),
        iExpectedPoint = getPointString( aExpected );

    return `Expected ${ iExpectedPoint } to be ${ iActualPoint }`;
}

function assertPointMatch( aActual, aExpected ): void {
    if ( isPointMismatch( aActual, aExpected ) ) {
        throw new Error( getPointMismatchMessage( aActual, aExpected ) )
    }
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
    let iActualRect   = getRectString( aActual ),
        iExpectedRect = getRectString( aExpected );

    return `Expected ${ iExpectedRect } to be ${ iActualRect }`;
}

function roundRect( aRect ) {
    return new Rect (
        round2decimals( aRect.x ),
        round2decimals( aRect.y ),
        round2decimals( aRect.w ),
        round2decimals( aRect.h )
    );
}

function assertRectMatch( aActual, aExpected ): void {
    let iActual = roundRect( aActual );
    if ( isRectMismatch( iActual, aExpected ) ) {
        throw new Error( getRectMismatchMessage( iActual, aExpected ) )
    }
}

function match(): jasmine.CustomMatcherResult {
    return { pass: true, message: '' };
}

function mismatch( aMessage: string ): jasmine.CustomMatcherResult {
    return { pass: false, message: aMessage };
}

beforeEach( () => {

    jasmine.addMatchers({

        toEqualPoint: function( util: jasmine.MatchersUtil, customEqualityTesters: Array<jasmine.CustomEqualityTester>): jasmine.CustomMatcher {
            return {
                compare: function( aActual: any, ...aExpected: any[] ): jasmine.CustomMatcherResult {
                    let [ x, y ]  = aExpected,
                        iExpected: Point = new Point( x, y );

                    try {
                        assertPointMatch( aActual, iExpected )
                        return match()
                    } catch ( exception ) {
                        return mismatch( exception.message );
                    }

                }
            }
        },

        toEqualRect: function( util: jasmine.MatchersUtil, customEqualityTesters: Array<jasmine.CustomEqualityTester>): jasmine.CustomMatcher {
            return {
                compare: function( aActual: any, ...aExpected: any[] ): jasmine.CustomMatcherResult {
                    let [ x, y, w, h ]  = aExpected,
                        iExpected: Rect = new Rect( x, y, w, h );

                    try {
                        assertRectMatch( aActual, iExpected )
                        return match()
                    } catch ( exception ) {
                        return mismatch( exception.message );
                    }

                }
            }
        },

        toHaveRendered: function( util: jasmine.MatchersUtil, customEqualityTesters: Array<jasmine.CustomEqualityTester>): jasmine.CustomMatcher {
            return {
                compare: function( context: any, expected: string ): jasmine.CustomMatcherResult {
                    triggerNextFrame();

                    let iRows = getRows( expected );

                    try {
                        assertLengthMatch( context.rendered, iRows );

                        iRows.forEach( ( aRow ) => {
                            let iRendered = context.rendered.shift();
                            assertRowMatch( iRendered, aRow );
                        });

                        return match();
                    } catch ( exception ) {
                        return mismatch( exception.message );
                    }
                }
            }

            function assertRowMatch( aRendered, aRow ): void {
                let iParams       = aRow.map( removeWhitespace ),
                    iExpectedType = iParams.shift();

                assertTypeMatch( aRendered.type, iExpectedType );
                assertParamsMatch( aRendered, iExpectedType, iParams );
            }

            function assertLengthMatch( aActual: any[], aExpected: any[] ): void {
                if ( aActual.length != aExpected.length ) {
                    throw new Error(
                        `Expected and actual render operations differ ( ${ aExpected.length } vs ${ aActual.length } ) \n` +
                        `Expected: ` +  aExpected + '\n' +
                        `Actual: `   + '\n' + renderedToString( aActual )
                    );
                }
            }

            function assertTypeMatch( aActualType: string, aExpectedType: string ): void {
                if ( aActualType != aExpectedType ) {
                    throw new Error( `Expected a ${ aExpectedType }, but ${ aActualType } was rendered instead` )
                }
            }

            function assertParamsMatch( aRendered, aExpectedType, aParams ): void {
                switch ( aExpectedType ) {
                    case 'Rectangle':
                    case 'Erase':
                        assertRectMatch( aRendered.bounds, rectFromString( aParams[ 0 ] ) );
                        break;
                    case 'PathStart':
                    case 'LineTo':
                        assertPointMatch( aRendered.point, pointFromString( aParams[ 0 ] ) );
                        break;
                    case 'QuadTo':
                        assertPointMatch( aRendered.control, pointFromString( aParams[ 0 ] ) );
                        assertPointMatch( aRendered.point,   pointFromString( aParams[ 1 ] ) );
                        break;
                    case 'CubicTo':
                        assertPointMatch( aRendered.control1, pointFromString( aParams[ 0 ] ) );
                        assertPointMatch( aRendered.control2, pointFromString( aParams[ 1 ] ) );
                        assertPointMatch( aRendered.point,    pointFromString( aParams[ 2 ] ) );
                        break;
                    case 'PathEnd':
                        // PathEnd has no params
                        break;
                    default:
                        throw new Error( "Could not find the requested render action" )
                }
            }

        }
    });
});
