import { ShapeSpecs }         from './Shape.spec.ts';
import { summonUpdaterSpecs } from '../tactics/children/summonUpdater.spec.ts'
import { Context2DMock }      from '../../../../tests/mocks/Context2D';
import { Painter }            from '../../output/Painter';
import { ContextPainter }     from '../../output/ContextPainter';
import { Rectangle }          from './Rectangle';
import { Rect }               from '../../geometry/Rect';

var iTestRect: Rect = new Rect( 10, 10, 20, 20 );

function createRectangle(): Rectangle {
    return new Rectangle( iTestRect.clone() );
}

function createPainter(): Painter {
    return new ContextPainter( new Context2DMock() );
}

describe( 'Rectangle', () => {

    describe( 'is a Shape', () => {
        ShapeSpecs.call( this, createRectangle, createPainter );
    })

    beforeEach( () => {
        this.rect      = iTestRect;
        this.rectangle = createRectangle();
        this.painter   = createPainter();
    });

    describe( 'paintSelf()', () => {

        it( 'should call drawRectangle on the painter provided', () => {
            spyOn( this.painter, 'drawRectangle' );

            this.rectangle.paintSelf( this.painter );
            expect( this.painter.drawRectangle ).toHaveBeenCalledWith( this.rect );
        });

    });


    describe( 'getBoundingRect()', () => {
        it( 'should return the bounds of the rectangle', () => {
            expect( this.rectangle.getBoundingRect() ).toEqualRect( 10, 10, 20, 20 );
        });

    });

    describe( 'summonUpdater', () => {
        summonUpdaterSpecs.call( this, createRectangle );
    });

});
