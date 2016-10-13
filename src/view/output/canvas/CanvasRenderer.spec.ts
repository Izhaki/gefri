import { Context2DMock  } from '../../../../tests/mocks';
import { CanvasRenderer } from './CanvasRenderer';
import { Rectangle      } from '../../viewees/shapes';
import { Rect           } from '../../geometry';

function createCanvasRenderer(): CanvasRenderer {
    return new CanvasRenderer( new Context2DMock() );
}

describe( 'CanvasRenderer', () => {

    beforeEach( () => {
        this.renderer = createCanvasRenderer();
        this.context = this.renderer.context;
    });

    it( 'should render a rect', () => {
        let iRectangle: Rectangle = new Rectangle( new Rect( 10, 10, 20, 20 ) );

        this.renderer.render( iRectangle );

        expect( this.context ).toHaveRenderedRect( 10, 10, 20, 20 );
    });


});
