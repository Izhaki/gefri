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
            | Erase     |   10,   10, 1000, 1000 |
            | Rectangle |   10,   10,   10,   10 |
        `);
    });

});
