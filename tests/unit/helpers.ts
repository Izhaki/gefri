// Note: We are not using the "helpers" config option of jasmine as the use of fat arrows
// overrides the `this` binding jasmine relies on. Rather, we simply import these helpers
// functions when needed.

import { Point,
         Rect        } from '../../src/view/geometry';
import { Rectangle   } from '../../src/view/viewees/visibles/shapes';
import { Transformer } from '../../src/view/viewees/invisibles';

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
