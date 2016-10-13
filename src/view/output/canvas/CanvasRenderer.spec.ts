import { Context2DMock  } from '../../../../tests/mocks';
import { CanvasRenderer } from './CanvasRenderer';
import { Rectangle      } from '../../viewees/shapes';
import { Rect           } from '../../geometry';

function createCanvasRenderer(): CanvasRenderer {
    return new CanvasRenderer( new Context2DMock() );
}

fdescribe( 'CanvasRenderer', () => {

    beforeEach( () => {
        this.renderer = createCanvasRenderer();
        this.context = this.renderer.context;
    });

    it( 'should render a rect', () => {
        let iRectangle: Rectangle = new Rectangle( new Rect( 10, 11, 12, 13 ) );

        this.renderer.render( iRectangle );

        expect( this.context ).toHaveRenderedRect( 10, 11, 12, 13 );
    });

    it( 'should render children in relative coordinates', () => {
        let iGrandparent: Rectangle = new Rectangle( new Rect( 10, 10, 100, 100 ) ),
            iParent:      Rectangle = new Rectangle( new Rect( 10, 10, 80, 80 ) ),
            iChild:       Rectangle = new Rectangle( new Rect( 10, 10, 60, 60 ) );

        iGrandparent.addChild( iParent );
        iParent.addChild( iChild );

        this.renderer.render( iGrandparent );

        expect( this.context ).toHaveRenderedRect( 10, 10, 100, 100 );
        expect( this.context ).toHaveRenderedRect( 20, 20, 80,  80  );
        expect( this.context ).toHaveRenderedRect( 30, 30, 60,  60  );
    });



});
