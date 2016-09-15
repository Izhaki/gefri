import { Viewee } from '../../Viewee';

export
function summonUpdaterSpecs( createViewee: () => Viewee ) {

    describe( 'summonUpdater', () => {

        beforeEach( () => {
            this.viewee = createViewee();
        });

        beforeEach( () => {
            this.mockUpdater = {};
            this.parent = createViewee();
            this.parent.addChildren( this.viewee );
            spyOn( this.parent, 'summonUpdater' ).and.returnValue( this.mockUpdater );
            spyOn( this.viewee, 'applyTransformations' );

            this.returned = this.viewee.summonUpdater();
        });

        it( 'should summon the updater from it`s parent', () => {
            expect( this.parent.summonUpdater ).toHaveBeenCalled();
        });

        it( 'should apply its own transformations to the updater', () => {
            expect( this.viewee.applyTransformations ).toHaveBeenCalled();
        });

        it( 'should return the updater', () => {
            expect( this.returned ).toBe( this.mockUpdater );
        });

    });

}
