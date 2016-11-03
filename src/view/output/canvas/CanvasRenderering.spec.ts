import { Context2DMock  } from '../../../../tests/mocks';
import * as helpers from '../../../../tests/unit/helpers'

import { Control        } from '../../Control';
import { Rectangle      } from '../../viewees/shapes';
import { Rect           } from '../../geometry';

function createControl(): Control {

    var iViewElement = document.getElementById( 'view' );

    iViewElement.setAttribute( 'style', 'width:500px; height:400px;' );
    iViewElement.innerHTML = '';

    var iControl = new Control( iViewElement );

    return iControl;
}

describe( 'CanvasRenderer', () => {

    beforeEach( () => {
        this.createViewees = helpers.createViewees;
    });

    beforeEach( () => {
        this.control  = createControl();
        this.context  = this.control.context;
    });

    it( 'should render a rect', () => {
        let { iRectangle } = this.createViewees(`
            | iRectangle | Rectangle | 10, 11, 12, 13 |
        `);

        this.control.setContents( iRectangle );

        expect( this.context ).toHaveRendered(`
            | Rectangle | 10, 11, 12, 13 |
        `);
    });

    it( 'should render children in relative coordinates', () => {
        let { iGrandparent } = this.createViewees(`
            | iGrandparent | Rectangle | 10, 10, 100, 100 |
            |   iParent    | Rectangle | 10, 10, 80,  80  |
            |     iChild   | Rectangle | 10, 10, 60,  60  |
        `);

        this.control.setContents( iGrandparent );

        expect( this.context ).toHaveRendered(`
            | Rectangle | 10, 10, 100, 100 |
            | Rectangle | 20, 20, 80,  80  |
            | Rectangle | 30, 30, 60,  60  |
        `);
    });

    // Without state restoration (for transforms), this wouldn't work.
    it( 'should render siblings in relative coordinates', () => {
        let { iFace } = this.createViewees(`
            | iFace       | Rectangle | 10, 10, 100, 100 |
            |   iEyeL     | Rectangle | 10, 10, 10,  10  |
            |     iPupilL | Rectangle | 2,  2,  6,   6   |
            |   iEyeR     | Rectangle | 80, 10, 10,  10  |
            |     iPupilR | Rectangle | 2,  2,  6,   6   |
        `);

        this.control.setContents( iFace );

        expect( this.context ).toHaveRendered(`
            | Rectangle | 10, 10, 100, 100 |
            | Rectangle | 20, 20, 10,  10  |
            | Rectangle | 22, 22, 6,   6   |
            | Rectangle | 90, 20, 10,  10  |
            | Rectangle | 92, 22, 6,   6   |
        `);
    });

    it( 'should clip children if the viewee is clipping its children', () => {
        let { iGrandparent } = this.createViewees(`
            | iGrandparent | Rectangle | 10, 10, 80, 80 |
            |   iParent    | Rectangle | 10, 10, 80, 60 |
            |     iChild   | Rectangle | 10, 10, 80, 80 |
        `);

        this.control.setContents( iGrandparent );

        expect( this.context ).toHaveRendered(`
            | Rectangle | 10, 10, 80, 80 |
            | Rectangle | 20, 20, 70, 60 |
            | Rectangle | 30, 30, 60, 50 |
        `);
    });

    it( 'should not clip children if the viewee is not clipping its children', () => {
        let { iGrandparent, iParent } = this.createViewees(`
            | iGrandparent | Rectangle | 10, 10, 80, 80 |
            |   iParent    | Rectangle | 10, 10, 80, 60 |
            |     iChild   | Rectangle | 10, 10, 80, 80 |
        `);

        iGrandparent.isClipping = false;
        iParent.isClipping      = false;

        this.control.setContents( iGrandparent );

        expect( this.context ).toHaveRendered(`
            | Rectangle | 10, 10, 80, 80 |
            | Rectangle | 20, 20, 80, 60 |
            | Rectangle | 30, 30, 80, 80 |
        `);
    });

    it( 'should transform and scale child viewees', () =>{
        let { iTransformer } = this.createViewees(`
            | iTransformer | Transformer |                   |
            |   iSquare    | Rectangle   | 100, 100, 10, 10  |
        `);

        iTransformer.setTranslate( -50, -50 );
        iTransformer.setScale( 0.5, 0.5 );

        this.control.setContents( iTransformer );

        expect( this.context ).toHaveRendered(`
            | Rectangle | 25, 25, 5, 5 |
        `);
    });

});
