import { setup } from './Helpers.spec';
import { simulateMouseEvent } from '../../../../../../tests/unit/helpers';

import { Point } from '../../../../geometry';
import { Path,
         Transformer  } from '../../../../viewees';

import { EventMediator,
         MouseMoveEvent } from '../../events';

describe( 'Mouse events: ', () => {

    setup.call( this );

    describe( 'A mouse move event', () => {

        beforeEach( () => {
            this.onMouseMove = jasmine.createSpy( 'onMouseMove' );
            this.eventMediator = new EventMediator( this.control );
            this.eventMediator.mouseMove$.subscribe( this.onMouseMove );

            this.getLastEvent = (): MouseMoveEvent => {
                return this.onMouseMove.calls.mostRecent().args[0];
            }
        });

        beforeEach( () => {
            let { iTransformer, iRectangle } = this.createViewees(`
                | iTransformer | Transformer |              |
                |   iRectangle | Rectangle   | 0, 0, 80, 80 |
            `);

            iTransformer.setZoom( 0.5, 0.5 );

            this.layer.addViewees( iTransformer );
            simulateMouseEvent( 'mousemove', 40, 40 );
            simulateMouseEvent( 'mousemove', 50, 60 );

            this.rectangle = iRectangle;
            this.lastMouseEvent = this.getLastEvent();
        });

        it( 'should include mouse client coordinates', () => {
            expect( this.lastMouseEvent.client.coords ).toEqualPoint( 50, 60 );
        });

        it( 'should include the client delta from the previous mouse event', () => {
            expect( this.lastMouseEvent.client.delta ).toEqualPoint( 10, 20 );
        });

        it( 'should include mouse absolute coordinates', () => {
            expect( this.lastMouseEvent.absolute.coords ).toEqualPoint( 100, 120 );
        });

        it( 'should include the absolute delta from the previous mouse event', () => {
            expect( this.lastMouseEvent.absolute.delta ).toEqualPoint( 20, 40 );
        });

    });

    describe( 'A mouse drag event', () => {

        beforeEach( () => {
            this.onMouseDrag = jasmine.createSpy( 'onMouseDrag' );
            this.eventMediator = new EventMediator( this.control );
            this.eventMediator.mouseDrag$.subscribe( this.onMouseDrag );

            this.getLastEvent = (): MouseMoveEvent => {
                return this.onMouseDrag.calls.mostRecent().args[0];
            }
        });

        beforeEach( () => {
            let { iRectangle } = this.createViewees(`
                | iRectangle | Rectangle | 10, 10, 20, 20 |
            `);

            this.layer.addViewees( iRectangle );
            simulateMouseEvent( 'mousedown', 15, 15 );
            simulateMouseEvent( 'mousemove', 25,  5 );

            this.rectangle = iRectangle;
            this.lastMouseEvent = this.getLastEvent();
        });

        it( 'should include the dragged viewee', () => {
            expect( this.lastMouseEvent.dragged ).toEqual( this.rectangle );

        });

        it( 'should not be emitted if the mouse is not down', () => {
            this.onMouseDrag.calls.reset();
            simulateMouseEvent( 'mousedown', 15, 15 );
            simulateMouseEvent( 'mouseup',   20, 10 );
            simulateMouseEvent( 'mousemove', 25,  5 );

            expect( this.onMouseDrag ).not.toHaveBeenCalled();
        });

    });


    describe( 'The hits (viewees) returned', () => {

        beforeEach( () => {
            this.onMouseMove = jasmine.createSpy( 'onMouseMove' );
            this.eventMediator = new EventMediator( this.control );
            this.eventMediator.mouseMove$.subscribe( this.onMouseMove );

            this.getLastestHits = () => {
                return this.onMouseMove.calls.mostRecent().args[0].hits;
            }
        });

        it( 'should include the viewees under the mouse in deepest-first order', () => {

            let { iFace, iEye, iPupil } = this.createViewees(`
                | iFace      | Rectangle | 10, 10, 100, 100 |
                |   iEye     | Rectangle | 10, 10,  10,  10 |
                |     iPupil | Rectangle |  2,  2,   6,   6 |
            `);

            this.layer.addViewees( iFace );
            simulateMouseEvent( 'mousemove', 22, 22 );

            expect( this.getLastestHits() ).toEqual([ iPupil, iEye, iFace ]);

        });

        it( 'should exclude viewees that are not under the mouse', () => {

            let { iFace, iEye, iPupil } = this.createViewees(`
                | iFace      | Rectangle | 10, 10, 100, 100 |
                |   iEye     | Rectangle | 10, 10,  10,  10 |
                |     iPupil | Rectangle |  2,  2,   6,   6 |
            `);

            this.layer.addViewees( iFace );
            simulateMouseEvent( 'mousemove', 20, 20 );

            expect( this.getLastestHits() ).toEqual([ iEye, iFace ]);

        });

        it( 'should exclude non-interactive viewees', () => {
            let { iTransformer } = this.createViewees(`
                | iTransformer | Transformer | |
            `);

            this.layer.addViewees( iTransformer );
            simulateMouseEvent( 'mousemove', 20, 20 );

            expect( this.getLastestHits() ).toEqual([]);
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

            expect( this.getLastestHits() ).toEqual([ iFace ]);
        });

        it( 'should exclude hidden viewees and their children', () => {
            let { iFace } = this.createViewees(`
                | iFace  | Rectangle | 10, 10, 100, 100 |
                |   iEye | Rectangle | 10, 10,  10,  10 |
            `);

            iFace.shown = false;

            this.layer.addViewees( iFace );
            simulateMouseEvent( 'mousemove', 20, 20 );

            expect( this.getLastestHits() ).toEqual([]);
        });

        it( 'should exclude portions of viewees that are outside the clip area', () => {
            let { iContainer } = this.createViewees(`
                | iContainer  | Rectangle | 100, 100, 100, 100 |
                |   iClipped  | Rectangle | 100, 100, 100, 100 |
            `);

            this.layer.addViewees( iContainer );
            simulateMouseEvent( 'mousemove', 201, 201 );

            expect( this.getLastestHits() ).toEqual([]);
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

                it( 'should include the path if the distance is smaller than the padding value', () => {
                    this.layer.addViewees( this.path );
                    simulateMouseEvent( 'mousemove', 16, 14 );

                    expect( this.getLastestHits() ).toEqual([ this.path ]);
                });

                it( 'should exclude the path if the distance is bigger than the padding value', () => {
                    this.layer.addViewees( this.path );
                    simulateMouseEvent( 'mousemove', 11, 19 );

                    expect( this.getLastestHits() ).toEqual([]);
                });

                it( 'should account for transformations', () => {
                    this.transformer.addChild( this.path );

                    this.layer.addViewees( this.transformer );
                    simulateMouseEvent( 'mousemove', 50 , 50 );

                    expect( this.getLastestHits() ).toEqual([ this.path ]);
                });


            });

            describe( 'quadratic Bézier path', () => {

                beforeEach( () => {
                    this.path = new Path( new Point( 10, 10 ) );
                    this.path.quadTo( new Point( 20, 20 ), new Point ( 10, 30 ) );
                });


                it( 'should include the path if the distance is smaller than the padding value', () => {
                    this.layer.addViewees( this.path );
                    simulateMouseEvent( 'mousemove', 16, 20 );

                    expect( this.getLastestHits() ).toEqual([ this.path ]);
                });

                it( 'should exclude the path if the distance is bigger than the padding value', () => {
                    this.layer.addViewees( this.path );
                    simulateMouseEvent( 'mousemove', 10, 20 );

                    expect( this.getLastestHits() ).toEqual([]);
                });

                it( 'should account for transformations', () => {
                    this.transformer.addChild( this.path );

                    this.layer.addViewees( this.transformer );
                    simulateMouseEvent( 'mousemove', 50 , 60 );

                    expect( this.getLastestHits() ).toEqual([ this.path ]);
                });

            });

            describe( 'cubic Bézier path', () => {

                beforeEach( () => {
                    this.path = new Path( new Point( 10, 10 ) );
                    this.path.cubicTo( new Point( 20, 20 ), new Point ( 20, 30 ), new Point ( 10, 40 ) );
                });


                it( 'should include the path if the distance is smaller than the padding value', () => {
                    this.layer.addViewees( this.path );
                    simulateMouseEvent( 'mousemove', 16, 25 );

                    expect( this.getLastestHits() ).toEqual([ this.path ]);
                });

                it( 'should exclude the path if the distance is bigger than the padding value', () => {
                    this.layer.addViewees( this.path );
                    simulateMouseEvent( 'mousemove', 12, 25 );

                    expect( this.getLastestHits() ).toEqual([]);
                });

                it( 'should account for transformations', () => {
                    this.transformer.addChild( this.path );

                    this.layer.addViewees( this.transformer );
                    simulateMouseEvent( 'mousemove', 55 , 70 );

                    expect( this.getLastestHits() ).toEqual([ this.path ]);
                });

            });

        });

    });
});
