import { setup } from './Helpers.spec';
import { simulateMouseEvent } from '../../../../../tests/unit/helpers';

import { Point } from '../../../geometry';
import { Path  } from '../../../viewees/';

describe( 'Hit testing: ', () => {

    setup.call( this );

    describe( 'Upon mouse move it', () => {

        beforeEach( () => {
            this.onMouseMove = jasmine.createSpy( 'onMouseMove' );
            this.control.mouseMove$.subscribe( this.onMouseMove );
        });


        it( 'should return all the viewees under the mouse in deepest-first order', () => {

            let { iFace, iEye, iPupil } = this.createViewees(`
                | iFace      | Rectangle | 10, 10, 100, 100 |
                |   iEye     | Rectangle | 10, 10,  10,  10 |
                |     iPupil | Rectangle |  2,  2,   6,   6 |
            `);

            this.layer.addViewees( iFace );
            simulateMouseEvent( 'mousemove', 22, 22 );

            expect( this.onMouseMove ).toHaveBeenCalledWith([ iPupil, iEye, iFace ]);

        });

        it( 'should not return viewees that are not under the mouse', () => {

            let { iFace, iEye, iPupil } = this.createViewees(`
                | iFace      | Rectangle | 10, 10, 100, 100 |
                |   iEye     | Rectangle | 10, 10,  10,  10 |
                |     iPupil | Rectangle |  2,  2,   6,   6 |
            `);

            this.layer.addViewees( iFace );
            simulateMouseEvent( 'mousemove', 20, 20 );

            expect( this.onMouseMove ).toHaveBeenCalledWith([ iEye, iFace ]);

        });

        it( 'should not return non-interactive viewees', () => {
            let { iTransformer } = this.createViewees(`
                | iTransformer | Transformer | |
            `);

            this.layer.addViewees( iTransformer );
            simulateMouseEvent( 'mousemove', 20, 20 );

            expect( this.onMouseMove ).toHaveBeenCalledWith([]);
        });

        it( 'should account for transformations', () => {
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

        it( 'should exclude hidden viewees and their children', () => {
            let { iFace } = this.createViewees(`
                | iFace  | Rectangle | 10, 10, 100, 100 |
                |   iEye | Rectangle | 10, 10,  10,  10 |
            `);

            iFace.shown = false;

            this.layer.addViewees( iFace );
            simulateMouseEvent( 'mousemove', 20, 20 );

            expect( this.onMouseMove ).toHaveBeenCalledWith([]);
        });

        it( 'should exclude portions of viewees that are outside the clip area', () => {
            let { iContainer } = this.createViewees(`
                | iContainer  | Rectangle | 100, 100, 100, 100 |
                |   iClipped  | Rectangle | 100, 100, 100, 100 |
            `);

            this.layer.addViewees( iContainer );
            simulateMouseEvent( 'mousemove', 201, 201 );

            expect( this.onMouseMove ).toHaveBeenCalledWith([]);
        });

        it( 'should include a line path if the distance is smaller than the padding value', () => {
            this.path = new Path( new Point( 10, 10 ) );
            this.path.lineTo( new Point ( 20, 20 ) );

            this.layer.addViewees( this.path );
            simulateMouseEvent( 'mousemove', 16, 14 );

            expect( this.onMouseMove ).toHaveBeenCalledWith([ this.path ]);
        });

        it( 'should exclude a line path if the distance is bigger than the padding value', () => {
            this.path = new Path( new Point( 10, 10 ) );
            this.path.lineTo( new Point ( 20, 20 ) );

            this.layer.addViewees( this.path );
            simulateMouseEvent( 'mousemove', 11, 19 );

            expect( this.onMouseMove ).toHaveBeenCalledWith([]);
        });

        it( 'should include a quadratic Bézier path if the distance is smaller than the padding value', () => {
            this.path = new Path( new Point( 10, 10 ) );
            this.path.quadTo( new Point( 20, 20 ), new Point ( 10, 30 ) );

            this.layer.addViewees( this.path );
            simulateMouseEvent( 'mousemove', 16, 20 );

            expect( this.onMouseMove ).toHaveBeenCalledWith([ this.path ]);
        });

        it( 'should exclude a quadratic Bézier path if the distance is bigger than the padding value', () => {
            this.path = new Path( new Point( 10, 10 ) );
            this.path.quadTo( new Point( 20, 20 ), new Point ( 10, 30 ) );

            this.layer.addViewees( this.path );
            simulateMouseEvent( 'mousemove', 10, 20 );

            expect( this.onMouseMove ).toHaveBeenCalledWith([]);
        });

        it( 'should include a cubic Bézier path if the distance is smaller than the padding value', () => {
            this.path = new Path( new Point( 10, 10 ) );
            this.path.cubicTo( new Point( 20, 20 ), new Point ( 20, 30 ), new Point ( 10, 40 ) );

            this.layer.addViewees( this.path );
            simulateMouseEvent( 'mousemove', 16, 25 );

            expect( this.onMouseMove ).toHaveBeenCalledWith([ this.path ]);
        });

        it( 'should exclude a cubic Bézier path if the distance is bigger than the padding value', () => {
            this.path = new Path( new Point( 10, 10 ) );
            this.path.cubicTo( new Point( 20, 20 ), new Point ( 20, 30 ), new Point ( 10, 40 ) );

            this.layer.addViewees( this.path );
            simulateMouseEvent( 'mousemove', 12, 25 );

            expect( this.onMouseMove ).toHaveBeenCalledWith([]);
        });


    });
});
