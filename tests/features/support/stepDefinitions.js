var chai       = require( 'chai' );
var chaiSubset = require( 'chai-subset' );

chai.config.truncateThreshold = 0; // To get some more details when expect fails
chai.use( chaiSubset );
expect = chai.expect

function regexify ( aOriginalFunction ) {
    return function ( expression, options, code ) {
        regex = new RegExp( '^' + expression + '$' )
        return aOriginalFunction( regex, options, code )
    }
}

function toNumber( aString ) {
    return parseFloat( aString, 10 );
}

// Note: \ needs to be \\ in these expressions.
const cWords     = '([a-zA-Z\\s]*)',
      cWord      = '([a-zA-Z]*)',
      cNumber    = '(-?\\d+\\.?\\d*)';

const cVieweeId   = cWord,
      cProperty   = cWord;

module.exports = function () {

    // For redability sake, we don't want the ugly regex chars, so regexify will
    // convert the expression to regex.
    this.Given = regexify( this.Given );
    this.When  = regexify( this.When );
    this.Then  = regexify( this.Then );


	this.Given( `the following viewee composition:`, function( aTable, aNext ) {
    	this.composition = this.getCompositionFromTable( aTable );
        this.rootViewee  = this.composition.root;
        this.viewees     = this.composition.viewees;
		this.control.setContents( this.rootViewee );
        aNext();
	});

	this.Given( `the ${ cVieweeId } ${ cProperty } is set to { ${ cNumber }, ${ cNumber } }`, function( aVieweeId, aProperty, aX, aY, aNext ) {

        var iViewee = this.viewees[ aVieweeId ],
            iX      = toNumber( aX ),
            iY      = toNumber( aY );

        switch ( aProperty ) {
            case 'translate':
                iViewee.setTranslate( iX, iY );
                break;
            case 'scale':
                iViewee.setScale( iX, iY );
                break;
            default:
                throw new Error( "Could not find requested property" );
        }

    	aNext();
	});


	this.When( `the view is rendered`, function ( aNext ) {
        this.control.context.reset();

        var inject       = gefri.di.inject;
        var waitForFrame = inject( 'waitForFrame' );
        waitForFrame.flush();
		aNext();
	});

    this.Then( `it should render the following:`, function( aTable, aNext ){
        var iRendered = this.control.context.rendered;
        var iExpected = aTable.hashes();

    	iExpected.forEach( function( iExpectedItem, aIndex ) {
        	var iRenderedItem   = iRendered[ aIndex ],
        	    iExpectedBounds = this.getRectFromString( iExpectedItem.Bounds );

        	expect( iRenderedItem.type ).to.equal( iExpectedItem.Type );
        	expect( iRenderedItem.bounds ).to.containSubset( iExpectedBounds );
        }, this );

		aNext();
    });

    this.Then( `it should not render anything`, function( aNext ){
        var iRendered = this.control.context.rendered;
        expect( iRendered ).to.be.empty;
		aNext();
    })

};
