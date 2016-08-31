import { Control }   from './Control';
import { Rectangle } from './viewees/shapes/Rectangle';
import { Rect }      from './geometry/Rect';

describe( 'Control', () => {

    beforeEach( () => {
        var iViewElement = document.getElementById( 'view' );

        iViewElement.offsetWidth  = 500;
        iViewElement.offsetHeight = 400;
        iViewElement.innerHTML = '';

        this.control = new Control( iViewElement );
        this.canvas  = iViewElement.firstElementChild;
    });


    describe( 'constructor()', () => {

        it( 'should create a canvas and add it to the container', () => {
            expect( this.canvas.tagName ).toBe( 'CANVAS' );
        });

        it( 'should size the canvas to the dimensions of its container', () => {
            expect( this.canvas.width  ).toBe( 500 );
            expect( this.canvas.height ).toBe( 400 );
        });

    });


    describe( 'setContents()', () => {
        var iRectangle: Rectangle;

        beforeEach( () => {
            iRectangle = new Rectangle( new Rect( 10, 10, 20, 20 ) );
            spyOn( this.control.painter, 'pushState' );
            spyOn( this.control.painter, 'intersectClipAreaWith' );
            spyOn( iRectangle, 'paint' );
            spyOn( this.control.painter, 'popState' );

            this.control.setContents( iRectangle );
        });

        it( 'should push the painter state', () => {
            expect( this.control.painter.pushState ).toHaveBeenCalled();
        });

        it( 'should set the painters clip area to the control bounds', () => {
            var iExpectedControlBounds = jasmine.objectContaining( { x: 0, y: 0, w: 500, h: 400 } );
            expect( this.control.painter.intersectClipAreaWith ).toHaveBeenCalledWith( iExpectedControlBounds );
        });

        it( 'should call paint on the provided viewee', () => {
            expect( iRectangle.paint ).toHaveBeenCalled();
        });

        it( 'should pop the painter state', () => {
            expect( this.control.painter.popState ).toHaveBeenCalled();
        });

    });


});