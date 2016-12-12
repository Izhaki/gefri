import { setup } from './Helpers.spec';

describe( 'Optimisations:', () => {

    setup.call( this );

    it( 'Should not render viewees if outside the clip region', () => {
        let { iTransformer } = this.createViewees(`
            | iTransformer | Transformer |                    |
            |   iRect1     | Rectangle   | 1000, 1000, 10, 10 |
            |   iParent    | Rectangle   | 10,   10,   10, 10 |
            |     iChild   | Rectangle   | 20,   20,   10, 10 |
        `);

        this.layer.setContents( iTransformer );

        expect( this.context ).toHaveRendered(`
            | Rectangle | 10, 10, 10, 10 |
        `);
    });

});
