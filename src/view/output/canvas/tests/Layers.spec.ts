import { setup,
         disableAntialiasingEraseCompensation  } from './Helpers.spec';
import { createLayer } from '../Layer.spec'
import { Rectangle   } from '../../../viewees/visibles/shapes';

describe( 'Layers: ', () => {

    it( 'A layer must be added to the container before its content is set', () => {
        this.layer = createLayer();
        let setLayerContents = () => this.layer.setContents();

        expect( setLayerContents ).toThrow();
    });

    disableAntialiasingEraseCompensation.call( this );
    setup.call( this );

    it ( 'should clear the whole layer and remove previous contents when new contents is set', () => {
        let iRect1 = new Rectangle( 10, 10, 20, 20 ),
            iRect2 = new Rectangle( 40, 40, 50, 50 );

        this.layer.setContents( iRect1 );
        this.clearRenderedLog();
        this.layer.setContents( iRect2 );

        expect( this.context ).toHaveRendered(`
            | Erase     | 0,  0,  500, 400 |
            | Rectangle | 40, 40, 50,  50  |
        `);
    });

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

            this.RectL1 = new Rectangle( 10, 10, 20, 20 );
            this.RectL2 = new Rectangle( 20, 20, 20, 20 );

            this.L1.setContents( this.RectL1 );
            this.L2.setContents( this.RectL2 );

            this.clearRenderedLog(); // Will only clear layer 1
            this.L2.context.reset(); // so we clear layer 2
        });

        it( 'only the layer on which changes happen should update', () => {
            this.RectL1.hide();
            expect( this.L1.context ).toHaveRendered(`
                | Erase | 10, 10, 20, 20 |
            `);
            expect( this.L2.context ).toHaveRendered(``);
        });

    });

});
