import { setup            } from './Helpers.spec';
import { createLayer      } from './Layer.spec'
import { Rectangle        } from '../../viewees/visibles/shapes';
import { Rect             } from '../../geometry';

describe( 'Layers: ', () => {

    it( 'A layer must be added to the container before its content is set', () => {
        this.layer = createLayer();
        let setLayerContents = () => this.layer.setContents();

        expect( setLayerContents ).toThrow();
    });

    setup.call( this );

    describe( 'When adding a canvas layer to the control', () => {

        beforeEach( () => {
            this.canvas = this.control.container.firstElementChild;
        });

        it( 'a canvas element should be added to the container', () => {
            expect( this.canvas.tagName ).toBe( 'CANVAS' );
        });

        it( 'the added canvas size should match the dimensions of its container', () => {
            expect( this.canvas.width  ).toBe( 500 );
            expect( this.canvas.height ).toBe( 400 );
        });

    });

    describe( 'When having two layers', () => {

        beforeEach( () => {
            this.L1 = this.layer;
            this.L2 = createLayer();
            this.control.addLayer( this.L2 );

            this.RectL1 = new Rectangle( new Rect( 10, 10, 20, 20 ) );
            this.RectL2 = new Rectangle( new Rect( 20, 20, 20, 20 ) );

            this.L1.setContents( this.RectL1 );
            this.L2.setContents( this.RectL2 );

            this.clearRenderedLog(); // Will only clear layer 1
            this.L2.context.reset(); // so we clear layer 2
        });

        it( 'only the layer on which changes happen should update', () => {
            this.RectL1.hide();
            expect( this.L1.context ).toHaveRendered(`
                | Erase | 9, 9, 22, 22 |
            `);
            expect( this.L2.context ).toHaveRendered(``);
        });

    });

});
