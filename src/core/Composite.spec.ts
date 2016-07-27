import { Composite } from './Composite';

describe( 'Composite', function() {
    var iParent,
        iChild;

    beforeEach( function () {
        iParent = new Composite();
        iChild  = new Composite();
    });

    describe( 'addChild', function() {

        beforeEach( function () {
            iParent.addChild( iChild );
        });

        it( 'Should add a child', function() {
            expect( iParent.children.length ).toBe( 1 );
            expect( iParent.children[0] ).toBe( iChild );
        });

        it( 'Should mark the child parent', function() {
            expect( iChild.parent ).toBe( iParent );
        });
    });

    describe( 'addChildren', function() {

        it( 'Should add a child', function() {
            var iAnotherChild = new Composite();

            iParent.addChildren( iChild, iAnotherChild );

            expect( iParent.children.length ).toBe( 2 );
        });

    });


    describe( 'deleteChild', function() {

        beforeEach( function () {
            iParent.addChild( iChild );
            iParent.removeChild( iChild );
        });

        it( 'Should remove the child', function() {
            expect( iParent.children.length ).toBe( 0 );
        });

        it( 'Should unlink the child to its parent', function() {
            expect( iChild.parent ).toBe( null );
        });

        it( 'Should raise an execption if the child was not found', function() {
            var iAnotherChild  = new Composite();

            var functionCall = function() {
              iParent.removeChild( iAnotherChild );
            }

            expect( functionCall ).toThrow();
        });

    });

    describe( 'forEachChild', function() {
        var iAnotherChild;

        beforeEach( function () {
            iAnotherChild = new Composite();

            iParent.addChildren( iChild, iAnotherChild );
        });

        it( 'Should iterate each child', function() {
            var iCallback = jasmine.createSpy('iCallback');

            iParent.forEachChild( iCallback );

            expect( iCallback.calls.argsFor(0) ).toEqual([ iChild, 0 ]);
            expect( iCallback.calls.argsFor(1) ).toEqual([ iAnotherChild, 1 ]);
        });

    });

    describe( 'isChildless', function() {

        it( 'Should return true if there are no children', function() {
            expect( iParent.isChildless() ).toBe( true );
        });

        it( 'Should return false if there are children', function() {
            iParent.addChild( iChild );
            expect( iParent.isChildless() ).toBe( false );
        });

    });

    describe( 'hasParent', function() {

        it( 'Should return false', function() {
            expect( iChild.hasParent() ).toBe( false );
        });

        it( 'Should return true', function() {
            iParent.addChild( iChild );
            expect( iChild.hasParent() ).toBe( true );
        });

    });

});