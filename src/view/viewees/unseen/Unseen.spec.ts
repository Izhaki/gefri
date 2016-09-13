import { VieweeSpecs } from '../Viewee.spec.ts';
import { Unseen }      from './Unseen';
import { Painter }     from './../../output/Painter';

export
function UnseenSpecs( createUnseen: () => Unseen, createPainter: () => Painter ) {

    describe( 'Unseen', () => {

        describe( 'is a Viewee', () => {
            VieweeSpecs.call( this, createUnseen, createPainter );
        });

        beforeEach( () => {
            this.unseen   = createUnseen();
            this.painter = createPainter();
        });

        describe( 'paint()', () => {

            it( 'should paint its children', () => {
                spyOn( this.unseen, 'paintChildren' );

                this.unseen.paint( this.painter );
                expect( this.unseen.paintChildren ).toHaveBeenCalledWith( this.painter );
            });

        });

    });

}
