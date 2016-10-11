import { InvisibleSpecs } from './Invisible.spec';
import { createControl  } from '../../Control.spec';
import { Context2DMock  } from '../../../../tests/mocks';
import { Painter,
         ContextPainter } from '../../output';
import { Root           } from './'
import { Rect           } from '../../geometry';

export
function createRoot(): Root {
    let iControl = createControl();
    return iControl.getRoot();
}

function createPainter(): Painter {
    return new ContextPainter( new Context2DMock() );
}

describe( 'Root', () => {

    describe( 'is an Invisibe', () => {
        InvisibleSpecs.call( this, createRoot, createPainter );
    });

    beforeEach( () => {
        this.root    = createRoot();
        this.painter = createPainter();
    });

    describe( 'refresh()', () => {

        it( 'should flush any pending updates', () => {
            let iUpdater = this.root.updater;

            spyOn( iUpdater, 'flushUpdates' );

            this.root.refresh( this.painter );
            expect( iUpdater.flushUpdates ).toHaveBeenCalledWith( this.painter );
        });

        it( 'should repaint the composition', () => {
            spyOn( this.root, 'paint' );
            this.root.refresh( this.painter );

            expect( this.root.paint ).toHaveBeenCalledWith( this.painter );
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

    describe( 'summonUpdater', () => {

        it( 'should queue a refresh on the control', () => {
            spyOn( this.root.control, 'queueRefresh' );
            this.root.summonUpdater();
            expect( this.root.control.queueRefresh ).toHaveBeenCalled();
        });

        it( 'should return its own updater', () => {
            expect( this.root.summonUpdater() ).toBe( this.root.updater );
        });

    });

});
