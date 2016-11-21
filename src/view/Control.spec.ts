import { Control } from './Control';

export
function createControl(): Control {

    var iViewElement = document.getElementById( 'view' );

    iViewElement.setAttribute( 'style', 'width:500px; height:400px;' );
    iViewElement.innerHTML = '';

    var iControl = new Control( iViewElement );

    return iControl;
}

describe( 'Control', () => {

    beforeEach( () => {
        this.control = createControl();
        this.canvas  = this.control.container.firstElementChild;
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

    describe( 'getBoundingRect()', () => {

        it( 'should return a rect at 0,0 with the dimensions of the control' , () => {
            expect( this.control.getBoundingRect() ).toEqualRect( 0, 0, 500, 400 );
        });

    });

});
