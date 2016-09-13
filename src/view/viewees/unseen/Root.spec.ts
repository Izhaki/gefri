import { UnseenSpecs }    from './Unseen.spec.ts';
import { Control }        from '../../Control';
import { Context2DMock }  from '../../../../tests/mocks/Context2D';
import { Painter }        from '../../painters/Painter';
import { ContextPainter } from '../../painters/ContextPainter';
import { Root }           from './Root'
import { Rect }           from '../../geometry/Rect';

function createRoot(): Root {
    let iViewElement = document.getElementById( 'view' );

    iViewElement.offsetWidth  = 500;
    iViewElement.offsetHeight = 400;
    iViewElement.innerHTML = '';

    let iControl = new Control( iViewElement );

    return new Root( iControl );
}

function createPainter(): Painter {
    return new ContextPainter( new Context2DMock() );
}

describe( 'Root', () => {

    describe( 'is an Unseen', () => {
        UnseenSpecs.call( this, createRoot, createPainter );
    });

    beforeEach( () => {
        this.root   = createRoot();
        this.painter = createPainter();
    });

    describe( 'paint()', () => {

        it( 'should paint its children', () => {
            spyOn( this.root, 'paintChildren' );

            this.root.paint( this.painter );
            expect( this.root.paintChildren ).toHaveBeenCalledWith( this.painter );
        });

    });

    describe( 'beforeChildrenPainting()', () => {

        it( 'should set the painters clip area to the control bounds', () => {
            let iControlBounds = new Rect( 0, 0, 500, 400 );
            spyOn( this.painter, 'intersectClipAreaWith' );
            spyOn( this.root.control, 'getBoundingRect').and.returnValue( iControlBounds );

            this.root.beforeChildrenPainting( this.painter );
            expect( this.painter.intersectClipAreaWith ).toHaveBeenCalledWith( iControlBounds );
        });

    });


});
