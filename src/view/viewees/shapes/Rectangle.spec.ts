import { Context2DMock }  from '../../../../mocks/Context2D';
import { Rectangle }      from './Rectangle';
import { Rect }           from './../../geometry/Rect';
import { ContextPainter } from './../../painters/ContextPainter';

describe( 'Rectangle', () => {

    beforeEach( () => {
        this.painter = new ContextPainter( new Context2DMock() );
    });


    describe( 'paintSelf()', () => {

        var iRect      = new Rect( 10, 10, 20, 20),
            iRectangle = new Rectangle( iRect );

        it( 'should call drawRectangle on the painter provided', () => {
            spyOn( this.painter, 'drawRectangle' );

            iRectangle.paintSelf( this.painter );
            expect( this.painter.drawRectangle ).toHaveBeenCalledWith( iRect );
        });

    });


    describe( 'getRectBounds()', () => {
        var iRect        = new Rect( 10, 10, 20, 20),
            iRectangle   = new Rectangle( iRect );

        it( 'should return the bounds of the rectangle', () => {
            expect( iRectangle.getRectBounds() ).toBe( iRect );
        });

    });



});
