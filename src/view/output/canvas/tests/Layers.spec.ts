import { Layer     } from '../'
import { setup     } from './Helpers.spec';
import { Rectangle } from '../../../viewees/visibles/shapes';

describe( 'Layers: ', () => {

    it( 'A layer must be added to the container before its content is set', () => {
        this.layer = new Layer();
        let setLayerContents = () => this.layer.addViewees();

        expect( setLayerContents ).toThrow();
    });

    setup.call( this );

    it ( 'should only update once when multiple changes occur', () => {
        let { iTransformer, iRectangle } = this.createViewees(`
            | iTransformer | Transformer |                |
            |   iRectangle | Rectangle   | 10, 10, 10, 10 |
        `);

        iRectangle.hide();
        this.layer.addViewees( iTransformer );
        this.clearRenderedLog();

        iRectangle.show();
        iTransformer.setScale( 2, 2 );

        // Had updates would happen after each change, we would see the
        // rectangle rendered after the first erase.
        expect( this.context ).toHaveRendered(`
            | Erase     | 10, 10, 10,  10  |
            | Erase     | 0,  0,  500, 400 |
            | Rectangle | 20, 20, 20,  20  |
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
            this.L2 = new Layer();
            this.control.addLayer( this.L2 );

            this.RectL1 = new Rectangle( 10, 10, 20, 20 );
            this.RectL2 = new Rectangle( 20, 20, 20, 20 );

            this.L1.addViewees( this.RectL1 );
            this.L2.addViewees( this.RectL2 );

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
