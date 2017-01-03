import { setup } from './Helpers.spec';
import { Point } from '../../../geometry';
import { Path  } from '../../../viewees/'

describe( 'The canvas should', () => {

    setup.call( this );

    it( 'render a rect', () => {
        let { iRectangle } = this.createViewees(`
            | iRectangle | Rectangle | 10, 11, 12, 13 |
        `);

        this.layer.addViewees( iRectangle );

        expect( this.context ).toHaveRendered(`
            | Erase     | 10, 11, 12, 13 |
            | Rectangle | 10, 11, 12, 13 |
        `);
    });

    describe( 'render a path', () => {

        beforeEach( () => {
            this.path = new Path( new Point( 10, 10 ) );
        });

        it( 'with line segments', () => {

            this.path
                .lineTo( new Point ( 20, 20 ) )
                .lineTo( new Point ( 10, 30 ) );

            this.layer.addViewees( this.path );

            expect( this.context ).toHaveRendered(`
                | Erase     | 10, 10, 10, 20 |
                | PathStart | 10, 10 |
                | LineTo    | 20, 20 |
                | LineTo    | 10, 30 |
                | PathEnd   |        |
            `);
        });

        it( 'with quadratic Bézier segments', () => {

            this.path
                .quadTo( new Point( 20, 20 ), new Point ( 10, 30 ) );

            this.layer.addViewees( this.path );

            expect( this.context ).toHaveRendered(`
                | Erase     | 10, 10, 5, 20 |
                | PathStart | 10, 10        |        |
                | QuadTo    | 20, 20        | 10, 30 |
                | PathEnd   |               |        |
            `);
        });

        it( 'with cubic Bézier segments', () => {

            this.path
                .cubicTo( new Point( 20, 20 ), new Point ( 20, 30 ), new Point ( 10, 40 ) );

            this.layer.addViewees( this.path );

            expect( this.context ).toHaveRendered(`
                | Erase     | 10, 10, 7.5, 30 |
                | PathStart | 10, 10          |        |        |
                | CubicTo   | 20, 20          | 20, 30 | 10, 40 |
                | PathEnd   |                 |        |        |
            `);
        });

    });

    it( 'render children in relative coordinates', () => {
        let { iGrandparent } = this.createViewees(`
            | iGrandparent | Rectangle | 10, 10, 100, 100 |
            |   iParent    | Rectangle | 10, 10,  80,  80 |
            |     iChild   | Rectangle | 10, 10,  60,  60 |
        `);

        this.layer.addViewees( iGrandparent );

        expect( this.context ).toHaveRendered(`
            | Erase     | 10, 10, 100, 100 |
            | Rectangle | 10, 10, 100, 100 |
            | Rectangle | 20, 20,  80,  80 |
            | Rectangle | 30, 30,  60,  60 |
        `);
    });

    // Without state restoration (for transforms), this wouldn't work.
    it( 'render siblings in relative coordinates', () => {
        let { iFace } = this.createViewees(`
            | iFace       | Rectangle | 10, 10, 100, 100 |
            |   iEyeL     | Rectangle | 10, 10,  10,  10 |
            |     iPupilL | Rectangle |  2,  2,   6,   6 |
            |   iEyeR     | Rectangle | 80, 10,  10,  10 |
            |     iPupilR | Rectangle |  2,  2,   6,   6 |
        `);

        this.layer.addViewees( iFace );

        expect( this.context ).toHaveRendered(`
            | Erase     | 10, 10, 100, 100 |
            | Rectangle | 10, 10, 100, 100 |
            | Rectangle | 20, 20,  10,  10 |
            | Rectangle | 22, 22,   6,   6 |
            | Rectangle | 90, 20,  10,  10 |
            | Rectangle | 92, 22,   6,   6 |
        `);
    });

    it( 'clip children if the viewee is clipping its children', () => {
        let { iGrandparent } = this.createViewees(`
            | iGrandparent | Rectangle | 10, 10, 80, 80 |
            |   iParent    | Rectangle | 10, 10, 80, 60 |
            |     iChild   | Rectangle | 10, 10, 80, 80 |
        `);

        this.layer.addViewees( iGrandparent );

        expect( this.context ).toHaveRendered(`
            | Erase     | 10, 10, 80, 80 |
            | Rectangle | 10, 10, 80, 80 |
            | Rectangle | 20, 20, 70, 60 |
            | Rectangle | 30, 30, 60, 50 |
        `);
    });

    it( 'not clip children if the viewee is not clipping its children', () => {
        let { iGrandparent, iParent } = this.createViewees(`
            | iGrandparent | Rectangle | 10, 10, 80, 80 |
            |   iParent    | Rectangle | 10, 10, 80, 60 |
            |     iChild   | Rectangle | 10, 10, 80, 80 |
        `);

        iGrandparent.isClipping = false;
        iParent.isClipping      = false;

        this.layer.addViewees( iGrandparent );

        expect( this.context ).toHaveRendered(`
            | Erase     | 10, 10, 80, 80 |
            | Rectangle | 10, 10, 80, 80 |
            | Rectangle | 20, 20, 80, 60 |
            | Rectangle | 30, 30, 80, 80 |
        `);
    });

});
