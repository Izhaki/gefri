import { setup     } from './Helpers.spec';
import { Rectangle } from '../../../viewees/visibles/shapes';
import { Point     } from '../../../geometry';
import { Path      } from '../../../viewees/visibles/path'

describe( 'Refreshing: The canvas should refresh when', () => {

    setup.call( this );

    describe( 'a transformer', () => {

        beforeEach( () => {
            let { iTransformer } = this.createViewees(`
                | iTransformer | Transformer |                   |
                |   iSquare    | Rectangle   | 100, 100, 10, 10  |
            `);
            this.transformer = iTransformer;

            this.layer.addViewees( this.transformer );
            this.clearRenderedLog();
        });

        it( 'scale changes', () => {
            this.transformer.setScale( 0.5, 0.5 );

            expect( this.context ).toHaveRendered(`
                | Erase     | 0,  0,  500, 400 |
                | Rectangle | 50, 50, 5,   5   |
            `);
        });

        it( 'zoom changes', () => {
            this.transformer.setZoom( 0.5, 0.5 );

            expect( this.context ).toHaveRendered(`
                | Erase     | 0,  0,  500, 400 |
                | Rectangle | 50, 50, 5,   5   |
            `);
        });

        it( 'translate changes', () => {
            this.transformer.setTranslate( 100, 100 );

            expect( this.context ).toHaveRendered(`
                | Erase     | 0,   0,   500, 400 |
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

            this.layer.addViewees( this.rectangle );
            this.clearRenderedLog();
        });

        it( 'is added to a parent', () => {
            this.child = new Rectangle( 2, 2, 6, 6 );
            this.rectangle.addChild( this.child );

            expect( this.context ).toHaveRendered(`
                | Erase     | 102, 102, 6,  6  |
                | Rectangle | 100, 100, 10, 10 |
                | Rectangle | 102, 102, 6,  6  |
            `);
        });

        // Note: This is currently the only test that involves removeChild(),
        // so we tuck on a grandChild to satisfy coverage for removing viewees
        // that have children.
        it( 'is removed from its parent', () => {
            this.child      = new Rectangle( 2, 2, 6, 6 );
            this.grandChild = new Rectangle( 1, 1, 4, 4);

            this.child.addChild( this.grandChild );
            this.rectangle.addChild( this.child );

            this.clearRenderedLog();

            this.rectangle.removeChild( this.child );

            expect( this.context ).toHaveRendered(`
                | Erase     | 102, 102, 6,  6  |
                | Rectangle | 100, 100, 10, 10 |
            `);
        });


        it( 'is hidden', () => {
            this.rectangle.hide();

            expect( this.context ).toHaveRendered(`
                | Erase | 100, 100, 10, 10 |
            `);
        });

        it( 'is shown', () => {
            this.rectangle.show();

            expect( this.context ).toHaveRendered(`
                | Erase     | 100, 100, 10, 10 |
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

                this.layer.addViewees( this.path );
                this.clearRenderedLog();
            });

            it( 'start point changes', () => {

                this.path.setStart( new Point( 30, 20 ) );

                expect( this.context ).toHaveRendered(`
                    | Erase     | 10, 20, 10, 10 |
                    | Erase     | 10, 20, 20, 10 |
                    | PathStart | 30, 20         |
                    | LineTo    | 10, 30         |
                    | PathEnd   |                |
                `);
            });

            it( 'end point changes', () => {
                this.path.setEnd( 0, new Point( 40, 40 ) );

                expect( this.context ).toHaveRendered(`
                    | Erase     | 10, 20, 10, 10 |
                    | Erase     | 20, 20, 20, 20 |
                    | PathStart | 20, 20         |
                    | LineTo    | 40, 40         |
                    | PathEnd   |                |
                `);
            });

        });

        describe( 'with a quadratic Bézier segment', () => {

            beforeEach( () => {
                this.path.quadTo( new Point( 30, 30 ), new Point ( 10, 40 ) );

                this.layer.addViewees( this.path );
                this.clearRenderedLog();
            });

            it( 'start point changes', () => {

                this.path.setStart( new Point( 10, 20 ) );

                expect( this.context ).toHaveRendered(`
                    | Erase     | 10, 20, 13.33, 20  |        |
                    | Erase     | 10, 20, 10,    20  |        |
                    | PathStart | 10, 20             |        |
                    | QuadTo    | 30, 30             | 10, 40 |
                    | PathEnd   |                    |        |
                `);
            });

            it( 'control point changes', () => {

                this.path.setControl( 0, new Point( 10, 20 ) );

                expect( this.context ).toHaveRendered(`
                    | Erase     | 10, 20, 13.33, 20  |        |
                    | Erase     | 10, 20, 10,    20  |        |
                    | PathStart | 20, 20             |        |
                    | QuadTo    | 10, 20             | 10, 40 |
                    | PathEnd   |                    |        |
                `);
            });

            it( 'end point changes', () => {
                this.path.setEnd( 0, new Point( 40, 40 ) );

                expect( this.context ).toHaveRendered(`
                    | Erase     | 10, 20, 13.33, 20  |        |
                    | Erase     | 20, 20, 20,    20  |        |
                    | PathStart | 20, 20             |        |
                    | QuadTo    | 30, 30             | 40, 40 |
                    | PathEnd   |                    |        |
                `);
            });

        });

        describe( 'with a cubic Bézier segment', () => {

            beforeEach( () => {
                this.path.cubicTo( new Point( 20, 0 ), new Point ( 40, 0 ), new Point ( 40, 20 ) );

                this.layer.addViewees( this.path );
                this.clearRenderedLog();
            });

            it( 'start point changes', () => {

                this.path.setStart( new Point( 10, 20 ) );

                expect( this.context ).toHaveRendered(`
                    | Erase     | 20, 5, 20, 15  |       |        |
                    | Erase     | 10, 5, 30, 15  |       |        |
                    | PathStart | 10, 20         |       |        |
                    | CubicTo   | 20, 0          | 40, 0 | 40, 20 |
                    | PathEnd   |                |       |        |
                `);
            });

            it( 'first control point changes', () => {

                this.path.setControl1( 0, new Point( 0, 0 ) );

                expect( this.context ).toHaveRendered(`
                    | Erase     | 20,   5, 20,   15 |       |        |
                    | Erase     | 14.4, 5, 25.6, 15 |       |        |
                    | PathStart | 20, 20            |       |        |
                    | CubicTo   | 0, 0              | 40, 0 | 40, 20 |
                    | PathEnd   |                   |       |        |
                `);
            });

            it( 'second control point changes', () => {

                this.path.setControl2( 0, new Point( 40, 40 ) );

                expect( this.context ).toHaveRendered(`
                    | Erase     | 20, 5,     20, 15    |        |        |
                    | Erase     | 20, 14.23, 20, 11.55 |        |        |
                    | PathStart | 20, 20               |        |        |
                    | CubicTo   | 20, 0                | 40, 40 | 40, 20 |
                    | PathEnd   |                      |        |        |
                `);
            });

            it( 'end point changes', () => {
                this.path.setEnd( 0, new Point( 50, 20 ) );

                expect( this.context ).toHaveRendered(`
                    | Erase     | 20, 5, 20, 15 |       |        |
                    | Erase     | 20, 5, 30, 15 |       |        |
                    | PathStart | 20, 20        |       |        |
                    | CubicTo   | 20, 0         | 40, 0 | 50, 20 |
                    | PathEnd   |               |       |        |
                `);
            });

        });

        it( 'with multiple segments changes', () => {
            this.path
                .lineTo( new Point ( 30, 20 ) )
                .quadTo( new Point( 50, 30 ), new Point ( 30, 40 ) )
                .cubicTo( new Point( 20, 50 ), new Point ( 30, 50 ), new Point ( 20, 40 ) );

            this.layer.addViewees( this.path );
            this.clearRenderedLog();

            this.path.setStart( new Point( 0, 20 ) );

            expect( this.context ).toHaveRendered(`
                | Erase     | 20, 20, 20, 27.5 |        |        |
                | Erase     | 0,  20, 40, 27.5 |        |        |
                | PathStart | 0, 20            |        |        |
                | LineTo    | 30, 20           |        |        |
                | QuadTo    | 50, 30           | 30, 40 |        |
                | CubicTo   | 20, 50           | 30, 50 | 20, 40 |
                | PathEnd   |                  |        |        |
            `);

        });

    });

});
