import { Control } from './Control';

export
function createControl(): Control {

    let iViewElement = document.getElementById( 'view' );

    iViewElement.setAttribute( 'style', 'width:500px; height:400px;' );
    iViewElement.innerHTML = '';

    let iControl = new Control( iViewElement );

    return iControl;
}

describe( 'Control', () => {

    beforeEach( () => {
        this.control = createControl();
    });

    describe( 'getBoundingRect()', () => {

        it( 'should return a rect at 0,0 with the dimensions of the control' , () => {
            expect( this.control.getBoundingRect() ).toEqualRect( 0, 0, 500, 400 );
        });

    });

});
