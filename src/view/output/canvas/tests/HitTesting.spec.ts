import { setup } from './Helpers.spec';
import { simulateMouseEvent } from '../../../../../tests/unit/helpers';

import { Point } from '../../../geometry';
import { Path,
         Transformer  } from '../../../viewees/';

describe( 'Hit testing: ', () => {

    setup.call( this );

    describe( 'Upon mouse move', () => {

        beforeEach( () => {
            this.onMouseMove = jasmine.createSpy( 'onMouseMove' );
            this.control.mouseMove$.subscribe( this.onMouseMove );
        });


        it( 'it should return all the viewees under the mouse in deepest-first order', () => {

            let { iFace, iEye, iPupil } = this.createViewees(`
                | iFace      | Rectangle | 10, 10, 100, 100 |
                |   iEye     | Rectangle | 10, 10,  10,  10 |
                |     iPupil | Rectangle |  2,  2,   6,   6 |
            `);

            this.layer.addViewees( iFace );
            simulateMouseEvent( 'mousemove', 22, 22 );

            expect( this.onMouseMove ).toHaveBeenCalledWith([ iPupil, iEye, iFace ]);

        });

        it( 'it should not return viewees that are not under the mouse', () => {

            let { iFace, iEye, iPupil } = this.createViewees(`
                | iFace      | Rectangle | 10, 10, 100, 100 |
                |   iEye     | Rectangle | 10, 10,  10,  10 |
                |     iPupil | Rectangle |  2,  2,   6,   6 |
            `);

            this.layer.addViewees( iFace );
            simulateMouseEvent( 'mousemove', 20, 20 );

            expect( this.onMouseMove ).toHaveBeenCalledWith([ iEye, iFace ]);

        });

        it( 'it should not return non-interactive viewees', () => {
            let { iTransformer } = this.createViewees(`
                | iTransformer | Transformer | |
            `);

            this.layer.addViewees( iTransformer );
            simulateMouseEvent( 'mousemove', 20, 20 );

            expect( this.onMouseMove ).toHaveBeenCalledWith([]);
        });

        it( 'it should account for transformations', () => {
            let { iTransformer, iFace } = this.createViewees(`
                | iTransformer | Transformer |                    |
                |   iFace      | Rectangle   | 200, 200, 100, 100 |
            `);

            iTransformer.setTranslate( -20, -20 );
            iTransformer.setScale( 0.5, 0.5 );
            iTransformer.setZoom( 0.5, 0.5 );

            this.layer.addViewees( iTransformer );
            simulateMouseEvent( 'mousemove', 45, 45 );

            expect( this.onMouseMove ).toHaveBeenCalledWith([ iFace ]);

        });

        it( 'it should exclude hidden viewees and their children', () => {
            let { iFace } = this.createViewees(`
                | iFace  | Rectangle | 10, 10, 100, 100 |
                |   iEye | Rectangle | 10, 10,  10,  10 |
            `);

            iFace.shown = false;

            this.layer.addViewees( iFace );
            simulateMouseEvent( 'mousemove', 20, 20 );

            expect( this.onMouseMove ).toHaveBeenCalledWith([]);
        });

        it( 'it should exclude portions of viewees that are outside the clip area', () => {
            let { iContainer } = this.createViewees(`
                | iContainer  | Rectangle | 100, 100, 100, 100 |
                |   iClipped  | Rectangle | 100, 100, 100, 100 |
            `);

            this.layer.addViewees( iContainer );
            simulateMouseEvent( 'mousemove', 201, 201 );

            expect( this.onMouseMove ).toHaveBeenCalledWith([]);
        });

        describe( 'when testing a', () => {

            beforeEach( () => {
                this.transformer = new Transformer();
                this.transformer.setTranslate( 10, 10 );
                this.transformer.setScale( 0.5, 0.5 );
                this.transformer.setZoom( 4, 4 );
            });

            describe( 'line path', () => {

                beforeEach( () => {
                    this.path = new Path( new Point( 10, 10 ) );
                    this.path.lineTo( new Point ( 20, 20 ) );
                });

                it( 'it should include the path if the distance is smaller than the padding value', () => {
                    this.layer.addViewees( this.path );
                    simulateMouseEvent( 'mousemove', 16, 14 );

                    expect( this.onMouseMove ).toHaveBeenCalledWith([ this.path ]);
                });

                it( 'it should exclude the path if the distance is bigger than the padding value', () => {
                    this.layer.addViewees( this.path );
                    simulateMouseEvent( 'mousemove', 11, 19 );

                    expect( this.onMouseMove ).toHaveBeenCalledWith([]);
                });

                it( 'it should account for transformations', () => {
                    this.transformer.addChild( this.path );

                    this.layer.addViewees( this.transformer );
                    simulateMouseEvent( 'mousemove', 50 , 50 );

                    expect( this.onMouseMove ).toHaveBeenCalledWith([ this.path ]);
                });


            });

            describe( 'quadratic Bézier path', () => {

                beforeEach( () => {
                    this.path = new Path( new Point( 10, 10 ) );
                    this.path.quadTo( new Point( 20, 20 ), new Point ( 10, 30 ) );
                });


                it( 'it should include the path if the distance is smaller than the padding value', () => {
                    this.layer.addViewees( this.path );
                    simulateMouseEvent( 'mousemove', 16, 20 );

                    expect( this.onMouseMove ).toHaveBeenCalledWith([ this.path ]);
                });

                it( 'it should exclude the path if the distance is bigger than the padding value', () => {
                    this.layer.addViewees( this.path );
                    simulateMouseEvent( 'mousemove', 10, 20 );

                    expect( this.onMouseMove ).toHaveBeenCalledWith([]);
                });

                it( 'it should account for transformations', () => {
                    this.transformer.addChild( this.path );

                    this.layer.addViewees( this.transformer );
                    simulateMouseEvent( 'mousemove', 50 , 60 );

                    expect( this.onMouseMove ).toHaveBeenCalledWith([ this.path ]);
                });

            });

            describe( 'cubic Bézier path', () => {

                beforeEach( () => {
                    this.path = new Path( new Point( 10, 10 ) );
                    this.path.cubicTo( new Point( 20, 20 ), new Point ( 20, 30 ), new Point ( 10, 40 ) );
                });


                it( 'it should include the path if the distance is smaller than the padding value', () => {
                    this.layer.addViewees( this.path );
                    simulateMouseEvent( 'mousemove', 16, 25 );

                    expect( this.onMouseMove ).toHaveBeenCalledWith([ this.path ]);
                });

                it( 'it should exclude the path if the distance is bigger than the padding value', () => {
                    this.layer.addViewees( this.path );
                    simulateMouseEvent( 'mousemove', 12, 25 );

                    expect( this.onMouseMove ).toHaveBeenCalledWith([]);
                });

                it( 'it should account for transformations', () => {
                    this.transformer.addChild( this.path );

                    this.layer.addViewees( this.transformer );
                    simulateMouseEvent( 'mousemove', 55 , 70 );

                    expect( this.onMouseMove ).toHaveBeenCalledWith([ this.path ]);
                });

            });

        });

    });
});
