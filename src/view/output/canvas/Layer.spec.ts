import { Layer             } from './'
import { ElementLayerSpecs } from '../ElementLayer.spec'
import { triggerNextFrame  } from '../../onNextFrame'
import { createControl     } from '../../Control.spec'
export
function createLayer(): Layer {
    var iControl = createControl();

    return iControl.getLayer() as Layer;
}

describe( 'Canvas Layer', () => {

    describe( 'is an ElementLayer', () => {
        ElementLayerSpecs.call( this, createLayer );
    });

    beforeEach( () => {
        this.layer = createLayer();
    });

    describe( 'queueRefresh()', () => {

        beforeEach( () => {
            this.root     = this.layer.root;
            this.renderer = this.layer.renderer;
            spyOn( this.renderer, 'render' );
        });

        it( 'should ask the root viewee to refresh before the next render' , () => {
            this.layer.queueRefresh();
            triggerNextFrame();

            expect( this.renderer.render ).toHaveBeenCalledWith( this.root );
        });

        it( 'should not queue any new refresh requests until the previous one has been processed', () => {

            this.layer.queueRefresh();
            this.layer.queueRefresh();
            this.layer.queueRefresh();
            triggerNextFrame();

            this.layer.queueRefresh();
            this.layer.queueRefresh();
            triggerNextFrame();

            expect( this.renderer.render.calls.count() ).toBe( 2 );
        });

    });

});
