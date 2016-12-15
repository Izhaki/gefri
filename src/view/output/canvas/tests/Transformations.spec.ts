import { setup } from './Helpers.spec';

describe( 'The canvas should', () => {

    setup.call( this );


    it( 'correctly apply transformations to viewees', () => {

        let { iTransformer } = this.createViewees(`
            | iTransformer   | Transformer |                    |
            |   iFace        | Rectangle   | 200, 200, 100, 100 |
            |     iEyeL      | Rectangle   | 10,  10,  20,  20  |
            |       iPupilL  | Rectangle   | 5,   5,   10,  10  |
            |     iEyeR      | Rectangle   | 70,  10,  20,  20  |
            |       iPupilR  | Rectangle   |  5,  5,   10,  10  |
        `);

        iTransformer.setTranslate( -100, -100 );
        iTransformer.setScale( 0.5, 0.5 );
        iTransformer.setZoom( 4, 4 );

        this.layer.addViewees( iTransformer );

        expect( this.context ).toHaveRendered(`
            | Erase     |   0,   0, 500, 400 |
            | Rectangle | 200, 200, 200, 200 |
            | Rectangle | 220, 220,  40,  40 |
            | Rectangle | 230, 230,  20,  20 |
            | Rectangle | 340, 220,  40,  40 |
            | Rectangle | 350, 230,  20,  20 |
        `);
    });

    it( 'correctly clip children when trnasformations are applied', () => {
        let { iTransformer } = this.createViewees(`
            | iTransformer   | Transformer |                |
            |   iGrandparent | Rectangle   | 10, 10, 80, 80 |
            |     iParent    | Rectangle   | 10, 10, 80, 60 |
            |       iChild   | Rectangle   | 10, 10, 80, 80 |
        `);

        iTransformer.setTranslate( 10, 10 );
        iTransformer.setScale( 0.5, 0.5 );
        iTransformer.setZoom( 4, 4 );

        this.layer.addViewees( iTransformer );

        expect( this.context ).toHaveRendered(`
            | Erase     | 0,   0, 500, 400 |
            | Rectangle | 40, 40, 160, 160 |
            | Rectangle | 60, 60, 140, 120 |
            | Rectangle | 80, 80, 120, 100 |
        `);
    });

});
