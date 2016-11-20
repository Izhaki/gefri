import { Control }  from '../../Control';
import * as helpers from '../../../../tests/unit/helpers';

function createControl(): Control {

    var iViewElement = document.getElementById( 'view' );

    iViewElement.setAttribute( 'style', 'width:500px; height:400px;' );
    iViewElement.innerHTML = '';

    var iControl = new Control( iViewElement );

    return iControl;
}

export
function setup(): void {

    beforeEach( () => {
        this.createViewees = helpers.createViewees;
    });

    beforeEach( () => {
        this.control  = createControl();
        this.context  = this.control.context;
    });

}
