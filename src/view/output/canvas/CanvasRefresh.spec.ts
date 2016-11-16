import { Context2DMock  } from '../../../../tests/mocks';
import { setup          } from './CanvasHelpers.spec';
import { Rectangle      } from '../../viewees/shapes';
import { Rect           } from '../../geometry';

import { inject         } from '../../../di';

let waitForFrame = inject( 'waitForFrame' );

describe( 'The canvas should refresh when', () => {

    setup.call( this );

    describe( 'a transformer', () => {

        beforeEach( () => {
            let { iTransformer } = this.createViewees(`
                | iTransformer | Transformer |                   |
                |   iSquare    | Rectangle   | 100, 100, 10, 10  |
            `);
            this.transformer = iTransformer;

            this.control.setContents( this.transformer );
            waitForFrame.flush();
            this.context.reset();
        });

        it( 'scale changes', () => {
            this.transformer.setScale( 0.5, 0.5 );

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

});