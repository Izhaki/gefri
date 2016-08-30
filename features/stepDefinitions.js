var chai       = require( 'chai' );
var chaiSubset = require( 'chai-subset' );

chai.config.truncateThreshold = 0; // To get some more details when expect fails
chai.use( chaiSubset );
expect = chai.expect

module.exports = function () {

	this.Given( 'the following viewee composition:', function( aTable, aNext ) {
        this.rootViewee = this.getCompositionFromTable( aTable );
        aNext();
	});

	this.When( 'the view is rendered', function ( aNext ) {
		this.control.setContents( this.rootViewee );
		aNext();
	});

    this.Then( 'it should render the following:', function( aTable, aNext ){
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

    this.Then( 'it should not render anything', function( aNext ){
        var iRendered = this.control.context.rendered;
        expect( iRendered ).to.be.empty;
		aNext();
    })

};
