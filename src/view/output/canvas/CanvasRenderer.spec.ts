import { Context2DMock  } from '../../../../tests/mocks';
import * as helpers from '../../../../tests/unit/helpers'

import { CanvasRenderer } from './CanvasRenderer';
import { Rectangle      } from '../../viewees/shapes';
import { Rect           } from '../../geometry';

function createCanvasRenderer(): CanvasRenderer {
    return new CanvasRenderer( new Context2DMock() );
}

describe( 'CanvasRenderer', () => {

    beforeEach( () => {
        this.createViewees = helpers.createViewees;
    });


    beforeEach( () => {
        this.renderer = createCanvasRenderer();
        this.context = this.renderer.context;
    });

    it( 'should render a rect', () => {
        let { iRectangle } = this.createViewees(`
            | iRectangle | Rectangle | 10, 11, 12, 13 |
        `);

        this.renderer.render( iRectangle );

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

        this.renderer.render( iGrandparent );

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

        this.renderer.render( iFace );

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

        this.renderer.render( iGrandparent );

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

        this.renderer.render( iGrandparent );

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

        // TODO: Remove once moving updates out of viewees
        spyOn( iTransformer, 'erase' );

        iTransformer.setTranslate( -50, -50 );
        iTransformer.setScale( 0.5, 0.5 );

        this.renderer.render( iTransformer );

        expect( this.context ).toHaveRendered(`
            | Rectangle | 25, 25, 5, 5 |
        `);
    });

    // TODO: Test makes no sense. Root is internal to rendering thus test boundery too low.
    // Move test boundery higher up to exlude renderer and root.
    it( 'should render root', () =>{
        let { iRoot } = this.createViewees(`
            | iRoot     | Root      |                   |
            |   iSquare | Rectangle | 50, 50, 100, 100  |
        `);

        spyOn( iRoot.control, 'getBoundingRect' ).and.returnValue( new Rect( 0, 0, 100, 100 ) ) ;

        this.renderer.render( iRoot );

        expect( this.context ).toHaveRendered(`
            | Rectangle | 50, 50, 50, 50 |
        `);
    });

});
