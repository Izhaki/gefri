function World() {

    // Takes a cucumber viewee table and returns the root of the viewee composition
    this.getCompositionFromTable = function ( aTable ) {
    	var iVieweesHashes = aTable.hashes(),
    	    iRootViewee    = undefined,
    	    iViewees       = {};

    	iVieweesHashes.forEach( function( aVieweeHash ) {
        	var iVieweeID       = aVieweeHash.ID,
        	    iVieweeParentID = aVieweeHash.Parent,
        	    isRootViewee    = iVieweeParentID === '',
        	    iViewee         = createViewee.call( this, aVieweeHash );

        	iViewees[ iVieweeID ] = iViewee;

        	if ( isRootViewee ) {
            	iRootViewee = iViewee;
        	} else {
                var iParent = iViewees[ iVieweeParentID ];
                iParent.addChildren( iViewee );
        	}
    	}, this );

    	return iRootViewee

        function createViewee( aVieweeHash ) {
            var iVieweeType = aVieweeHash.Type,
                iBounds     = this.getRectFromString( aVieweeHash.Bounds );

            switch ( iVieweeType ) {

                case 'Rectangle':
                    return new gefri.view.Rectangle( iBounds )

            }

        }

    };

    this.getRectFromString = function( aRectString ) {
        var iCoords = convertRectStringToHash( aRectString ),
            iRect   = new gefri.view.geometry.Rect( iCoords.x, iCoords.y, iCoords.w, iCoords.h );

        return iRect;

        function convertRectStringToHash( aRectString ) {
            var aCoords = getCommaSeperatedElements( aRectString );

            return {
                x: toInt( aCoords[0] ),
                y: toInt( aCoords[1] ),
                w: toInt( aCoords[2] ),
                h: toInt( aCoords[3] )
            }

            function getCommaSeperatedElements( aString ) {
                var aSpacelessString = stripSpaces( aString ),
                    iElements        = aSpacelessString.split( ',' );

                return iElements;

                function stripSpaces( aString ) {
                    return aString.replace(/\s/g, '');
                }
            }

            function toInt( aString ) {
                return parseInt( aString, 10 );
            }
        }

    };

}

module.exports = function() {
  this.World = World;
};