import { Control        } from './Control';
import { getViewElement } from '../../tests/mocks/mockDom'

export
function createControl(): Control {

    let iViewElement = getViewElement();

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
