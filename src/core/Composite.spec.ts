import { Composite } from './';

export
function CompositeSpecs( createComposite: () => Composite< any > ) {

    beforeEach( () => {
        this.parent = createComposite();
        this.child  = createComposite();
    });


    describe( 'addChild()', () => {

        beforeEach( () => {
            this.parent.addChild( this.child );
        });

        it( 'should add a child', () => {
            expect( this.parent.children.length ).toBe( 1 );
            expect( this.parent.children[0] ).toBe( this.child );
        });

        it( 'should mark the child parent', () => {
            expect( this.child.parent ).toBe( this.parent );
        });

    });


    describe( 'addChildren()', () => {

        it( 'should add a child', () => {
            var iAnotherChild = new Composite();

            this.parent.addChildren( this.child, iAnotherChild );

            expect( this.parent.children.length ).toBe( 2 );
        });

    });

    describe( 'getParent()', () => {

        it( 'should the child`s parent', () => {
            this.parent.addChildren( this.child  );

            expect( this.child.getParent() ).toBe( this.parent );
        });

    });



    describe( 'deleteChild()', () => {

        beforeEach( () => {
            this.parent.addChild( this.child );
            this.parent.removeChild( this.child );
        });

        it( 'should remove the child', () => {
            expect( this.parent.children.length ).toBe( 0 );
        });

        it( 'should unlink the child to its parent', () => {
            expect( this.child.parent ).toBe( null );
        });

        it( 'should raise an execption if the child was not found', () => {
            var iAnotherChild  = new Composite();

            var functionCall = () => {
                this.parent.removeChild( iAnotherChild );
            }

            expect( functionCall ).toThrow();
        });

    });


    describe( 'forEachChild()', () => {
        var iAnotherChild;

        beforeEach( () => {
            iAnotherChild = new Composite();

            this.parent.addChildren( this.child, iAnotherChild );
        });

        it( 'should iterate each child', () => {
            var iCallback = jasmine.createSpy('iCallback');

            this.parent.forEachChild( iCallback );

            expect( iCallback.calls.argsFor(0) ).toEqual([ this.child, 0 ]);
            expect( iCallback.calls.argsFor(1) ).toEqual([ iAnotherChild, 1 ]);
        });

    });


    describe( 'isChildless()', () => {

        it( 'should return true if there are no children', () => {
            expect( this.parent.isChildless() ).toBe( true );
        });

        it( 'should return false if there are children', () => {
            this.parent.addChild( this.child );
            expect( this.parent.isChildless() ).toBe( false );
        });

    });


    describe( 'hasParent()', () => {

        it( 'should return false', () => {
            expect( this.child.hasParent() ).toBe( false );
        });

        it( 'should return true', () => {
            this.parent.addChild( this.child );
            expect( this.child.hasParent() ).toBe( true );
        });

    });

}
