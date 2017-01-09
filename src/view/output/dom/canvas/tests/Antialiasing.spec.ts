import { setup } from './Helpers.spec';
import { Point } from '../../../../geometry';
import { Path  } from '../../../../viewees'

describe( 'Antialiasing: Erase operations should expand the viewee bounding rect by 1 to compensate for the antialiasing canvas applies', () => {

    setup.call( this, true );

    it( 'when erasing the bounds of a Rectangle', () => {
        let { iRectangle } = this.createViewees(`
            | iRectangle | Rectangle   | 100, 100, 10, 10  |
        `);

        this.layer.addViewees( iRectangle );
        this.clearRenderedLog();

        iRectangle.shown = false;

        expect( this.context ).toHaveRendered(`
            | Erase | 99, 99, 12, 12 |
        `);
    });

    it( 'when erasing the bounds of a compound path', () => {
        this.path = new Path( new Point( 20, 20 ) );

        this.path
            .lineTo( new Point ( 30, 20 ) )
            .quadTo( new Point( 50, 30 ), new Point ( 30, 40 ) )
            .cubicTo( new Point( 20, 50 ), new Point ( 30, 50 ), new Point ( 20, 40 ) );

        this.layer.addViewees( this.path );
        this.clearRenderedLog();

        this.path.setStart( new Point( 0, 20 ) );

        expect( this.context ).toHaveRendered(`
            | Erase     | -1, 19, 42, 29.5 |        |        |
            | PathStart |  0, 20           |        |        |
            | LineTo    | 30, 20           |        |        |
            | QuadTo    | 50, 30           | 30, 40 |        |
            | CubicTo   | 20, 50           | 30, 50 | 20, 40 |
            | PathEnd   |                  |        |        |
        `);


    });

});
