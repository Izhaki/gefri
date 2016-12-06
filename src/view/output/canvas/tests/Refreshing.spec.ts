import { setup            } from './Helpers.spec';
import { Rectangle        } from '../../../viewees/visibles/shapes';
import { Point,
         Rect             } from '../../../geometry';
import { Path             } from '../../../viewees/visibles/path'

describe( 'The canvas should refresh when', () => {

    setup.call( this );

    describe( 'a transformer', () => {

        beforeEach( () => {
            let { iTransformer } = this.createViewees(`
                | iTransformer | Transformer |                   |
                |   iSquare    | Rectangle   | 100, 100, 10, 10  |
            `);
            this.transformer = iTransformer;

            this.layer.setContents( this.transformer );
            this.clearRenderedLog();
        });

        it( 'scale changes', () => {
            this.transformer.setScale( 0.5, 0.5 );

            expect( this.context ).toHaveRendered(`
                | Erase     | -1, -1, 502, 402 |
                | Rectangle | 50, 50, 5,   5   |
            `);
        });

        it( 'zoom changes', () => {
            this.transformer.setZoom( 0.5, 0.5 );

            expect( this.context ).toHaveRendered(`
                | Erase     | -1, -1, 502, 402 |
                | Rectangle | 50, 50, 5,   5   |
            `);
        });

        it( 'translate changes', () => {
            this.transformer.setTranslate( 100, 100 );

            expect( this.context ).toHaveRendered(`
                | Erase     | -1,  -1,  502, 402 |
                | Rectangle | 200, 200, 10,  10  |
            `);
        });

    });

    describe( 'a viewee', () => {

        beforeEach( () => {
            let { iRectangle } = this.createViewees(`
                | iRectangle | Rectangle   | 100, 100, 10, 10  |
            `);
            this.rectangle = iRectangle;

            this.layer.setContents( this.rectangle );
            this.clearRenderedLog();
        });

        it( 'is added to a parent', () => {
            this.child = new Rectangle( new Rect( 2, 2, 6, 6 ) );
            this.rectangle.addChild( this.child );

            expect( this.context ).toHaveRendered(`
                | Erase     | 101, 101, 8,  8  |
                | Rectangle | 100, 100, 10, 10 |
                | Rectangle | 102, 102, 6,  6  |
            `);
        });

        it( 'is removed from its parent', () => {
            this.child = new Rectangle( new Rect( 2, 2, 6, 6 ) );
            this.rectangle.addChild( this.child );

            this.clearRenderedLog();

            this.rectangle.removeChild( this.child );

            expect( this.context ).toHaveRendered(`
                | Erase     | 101, 101, 8,  8  |
                | Rectangle | 100, 100, 10, 10 |
            `);
        });


        it( 'is hidden', () => {
            this.rectangle.hide();

            expect( this.context ).toHaveRendered(`
                | Erase | 99, 99, 12, 12 |
            `);
        });

        it( 'is shown', () => {
            this.rectangle.show();

            expect( this.context ).toHaveRendered(`
                | Erase     | 99,  99,  12, 12 |
                | Rectangle | 100, 100, 10, 10 |
            `);
        });

    });

    describe( 'a path', () => {

        beforeEach( () => {
            this.path = new Path( new Point( 20, 20 ) );
        });

        describe( 'with a line segment', () => {

            beforeEach( () => {
                this.path.lineTo( new Point ( 10, 30 ) );

                this.layer.setContents( this.path );
                this.clearRenderedLog();
            });

            it( 'start point changes', () => {

                this.path.setStart( new Point( 30, 20 ) );

                expect( this.context ).toHaveRendered(`
                    | Erase     | 21, 19, -12, 12 |
                    | Erase     | 31, 19, -22, 12 |
                    | PathStart | 30, 20          |
                    | LineTo    | 10, 30          |
                    | PathEnd   |                 |
                `);
            });

            it( 'end point changes', () => {
                this.path.setEnd( 0, new Point( 40, 40 ) );

                expect( this.context ).toHaveRendered(`
                    | Erase     | 21, 19, -12, 12 |
                    | Erase     | 19, 19,  22, 22 |
                    | PathStart | 20, 20          |
                    | LineTo    | 40, 40          |
                    | PathEnd   |                 |
                `);
            });

        });

        describe( 'with a quadratic Bézier segment', () => {

            beforeEach( () => {
                this.path.quadTo( new Point( 30, 30 ), new Point ( 10, 40 ) );

                this.layer.setContents( this.path );
                this.clearRenderedLog();
            });

            it( 'start point changes', () => {

                this.path.setStart( new Point( 10, 20 ) );

                expect( this.context ).toHaveRendered(`
                    | Erase     | 9,  19, 15.33, 22  |        |
                    | Erase     | 9,  19, 12,    22  |        |
                    | PathStart | 10, 20             |        |
                    | QuadTo    | 30, 30             | 10, 40 |
                    | PathEnd   |                    |        |
                `);
            });

            it( 'control point changes', () => {

                this.path.setControl( 0, new Point( 10, 20 ) );

                expect( this.context ).toHaveRendered(`
                    | Erase     | 9,  19, 15.33, 22  |        |
                    | Erase     | 9,  19, 12,    22  |        |
                    | PathStart | 20, 20             |        |
                    | QuadTo    | 10, 20             | 10, 40 |
                    | PathEnd   |                    |        |
                `);
            });

            it( 'end point changes', () => {
                this.path.setEnd( 0, new Point( 40, 40 ) );

                expect( this.context ).toHaveRendered(`
                    | Erase     | 9,  19, 15.33, 22  |        |
                    | Erase     | 19, 19, 22,    22  |        |
                    | PathStart | 20, 20             |        |
                    | QuadTo    | 30, 30             | 40, 40 |
                    | PathEnd   |                    |        |
                `);
            });

        });

    });

});
