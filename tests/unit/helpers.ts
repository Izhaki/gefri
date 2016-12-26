// Note: We are not using the "helpers" config option of jasmine as the use of fat arrows
// overrides the `this` binding jasmine relies on. Rather, we simply import these helpers
// functions when needed.

import { Point,
         Rect        } from '../../src/view/geometry';

import { Rectangle,
         Transformer } from '../../src/view/viewees';

import { getViewElement } from '../mocks/mockDom';

export
type Row = string[];

export
function createViewees( aTable: string ) {

    let iRows  = getRows( aTable );

    let iLastVieweeAtLevel = {},
        iViewees           = {};

    iRows.forEach( ( aRow ) => {
        let { iVieweeName, iVieweeLevel, iVieweeType, iParams } = getVieweeData( aRow );

        let iViewee = createViewee( iVieweeType, iParams );

        if ( iVieweeLevel > 0 ) {
            let iParent = iLastVieweeAtLevel[ iVieweeLevel - 1 ];
            iParent.addChildren( iViewee );
        }

        iLastVieweeAtLevel[ iVieweeLevel ] = iViewee;
        iViewees[ iVieweeName ] = iViewee;
    });

    return iViewees;

    function createViewee( aType, aParams ): any {
        switch ( aType ) {
            case 'Rectangle':
                let iBounds = rectFromString( aParams );
                return new Rectangle( iBounds.x, iBounds.y, iBounds.w, iBounds.h );
            case 'Transformer':
                return new Transformer();
            default:
                throw new Error( `Could not find the requested viewee type (${ aType })` );
        }
    }

    function getVieweeData( aRow: Row ) {
        let [ iVieweeName, iVieweeType, iParams ] = aRow;
        let iVieweeLevel = getVieweeLevel( iVieweeName );

        iVieweeName = removeWhitespace( iVieweeName );
        iVieweeType = removeWhitespace( iVieweeType );
        iParams     = removeWhitespace( iParams     );

        return { iVieweeName, iVieweeLevel, iVieweeType, iParams };

        function getVieweeLevel( aName: string ): number {
            let iSpaces = aName.search(/\S/) - 1;
            return iSpaces / 2;
        }
    }
}

export
function getRows( aString: string ): Row[] {
    let aRows = aString.split( "\n" );
    aRows = removeEmptyStrings( aRows );
    return breakdownCells( aRows );
}

function breakdownCells( aRows ): Row[] {
    return aRows.map( ( aRow ) => {
        let iRowContent = getStringBetweenFirstAndLastPipes( aRow ),
            iCells      = iRowContent.split('|');
        return iCells;
    });
}

function getStringBetweenFirstAndLastPipes( aString ): string {
    return aString.match(/\|(.*)\|/).pop()
}

function removeEmptyStrings( aStrings: string[] ): string[] {
    return aStrings.filter( ( aString ) => {
        return isEmptyString( aString );
    });
}

function isEmptyString( aLine: string ): boolean {
    aLine = removeWhitespace( aLine );
    return aLine.length > 0;
}

export
function removeWhitespace( aString: string ): string {
    return aString.replace( /\s/g, '' );
}

export
function rectFromString( aString: string ): Rect {
    let iArguments = aString.split( ',' );
    let [ x, y, w, h ] = iArguments.map( parseFloat );
    return new Rect( x, y, w, h );
}

export
function pointFromString( aString: string ): Point {
    let iArguments = aString.split( ',' );
    let [ x, y ] = iArguments.map( parseFloat );
    return new Point( x, y );
}

export
function getPointString( aPoint ): string {
    return `( ${ aPoint.x }, ${ aPoint.y } )`;
}

export
function getRectString( aBounds ): string {
    return `( ${ aBounds.x }, ${ aBounds.y }, ${ aBounds.w }, ${ aBounds.h } )`;
}

export
function renderedToString( aRendered: any[] ): string {
    let iLines: string[];
    iLines = aRendered.map( ( iRendered ) => {
        let iType   = iRendered.type,
            iParams: string;

        switch ( iType ) {
            case 'Rectangle':
            case 'Erase':
                iParams = getRectString( iRendered.bounds );
                break;
            case 'PathStart':
            case 'LineTo':
                iParams = getPointString( iRendered.point );
                break;
            case 'QuadTo':
                iParams = [ getPointString( iRendered.control ), getPointString( iRendered.point ) ].join( ' | ' );
                break;
            case 'CubicTo':
                iParams = [ getPointString( iRendered.control1 ), getPointString( iRendered.control2 ), getPointString( iRendered.point ) ].join( ' | ' );
                break;
            case 'PathEnd':
                // PathEnd has no params
                break;
            default:
                throw new Error( "Could not find the requested render action" )
        }

        return iRendered.type + ' '  + iParams;
    });
    return iLines.join( '\n' );
}


function newMouseEvent( aType, sx, sy, cx, cy ) {
    let e = {
        bubbles:       true,
        cancelable:    ( aType != 'mousemove' ),
        view:          window,
        detail:        0,
        screenX:       sx,
        screenY:       sy,
        clientX:       cx,
        clientY:       cy,
        ctrlKey:       false,
        altKey:        false,
        shiftKey:      false,
        metaKey:       false,
        button:        0,
        relatedTarget: undefined
    };

    let iEvent = document.createEvent( 'MouseEvents' );

    iEvent.initMouseEvent( aType,
        e.bubbles, e.cancelable, e.view, e.detail,
        e.screenX, e.screenY, e.clientX, e.clientY,
        e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
        e.button, document.body.parentNode);

    return iEvent;
}

export
function simulateMouseEvent( aEventType, x, y ) {
    let iEvent = newMouseEvent( aEventType, x, y, x, y );
    getViewElement().dispatchEvent( iEvent );
}
