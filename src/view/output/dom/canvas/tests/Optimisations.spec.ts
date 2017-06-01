import { setup } from './Helpers.spec';

describe( 'Optimisations:', () => {

    setup.call( this );

    it( 'Should not render viewees if outside the clip region', () => {
        let { iRectangle, iParent } = this.createViewees(`
            | iRectangle | Rectangle   | 1000, 1000, 10, 10 |
            | iParent    | Rectangle   |   10,   10, 10, 10 |
            |   iChild   | Rectangle   |   20,   20, 10, 10 |
        `);

        this.layer.addViewees( iRectangle, iParent );

        expect( this.context ).toHaveRendered(`
            | Erase     |   10,   10, 10, 10 |
            | Rectangle |   10,   10, 10, 10 |
        `);
    });

    it( 'Should render children of a viewee that is outside the clip region, but does not clip', () => {
        let { iGrandparent, iParent } = this.createViewees(`
            | iGrandparent | Rectangle |   0,   0, 50, 50 |
            |   iParent    | Rectangle |  60,  60, 10, 10 |
            |     iChild   | Rectangle | -30, -30, 10, 10 |
        `);

        iParent.isClipping = false

        this.layer.addViewees( iGrandparent );

        expect( this.context ).toHaveRendered(`
            | Erase     |  0,  0, 50, 50 |
            | Rectangle |  0,  0, 50, 50 |
            | Rectangle | 30, 30, 10, 10 |
        `);
    });


});
