import { ElementLayer } from './'
import { Rectangle    } from '../viewees/visibles/shapes';
import { Rect         } from '../geometry';

export
function ElementLayerSpecs() {

    describe( 'setContents()', () => {

        beforeEach( () => {
            this.rectangle = new Rectangle( new Rect( 10, 10, 20, 20 ) );
        });

        it( 'should add the viewee provided as a child of the root viewee', () => {
            this.layer.setContents( this.rectangle );

            expect( this.layer.root.children.length ).toBe( 1 );
            expect( this.layer.root.children[ 0 ] ).toBe( this.rectangle );
        });

        it( 'should remove the previous contents from the root', () => {
            this.layer.setContents( this.rectangle );
            this.layer.setContents( this.rectangle );

            expect( this.layer.root.children.length ).toBe( 1 );
            expect( this.layer.root.children[ 0 ] ).toBe( this.rectangle );
        });

    });

}
