import { setup } from './Helpers.spec';
import { simulateMouseEvent } from '../../../../../tests/unit/helpers'

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

    });
});
