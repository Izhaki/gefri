import { VieweeSpecs } from '../Viewee.spec.ts';
import { Invisible }   from './Invisible';
import { Painter }     from './../../output/Painter';

export
function InvisibleSpecs( createInvisible: () => Invisible, createPainter: () => Painter ) {

    describe( 'Invisible', () => {

        describe( 'is a Viewee', () => {
            VieweeSpecs.call( this, createInvisible, createPainter );
        });

        beforeEach( () => {
            this.invisible   = createInvisible();
            this.painter = createPainter();
        });

        describe( 'paint()', () => {

            it( 'should paint its children', () => {
                spyOn( this.invisible, 'paintChildren' );

                this.invisible.paint( this.painter );
                expect( this.invisible.paintChildren ).toHaveBeenCalledWith( this.painter );
            });

        });

    });

}
