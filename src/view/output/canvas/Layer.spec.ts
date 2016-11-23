import { Layer             } from './'
import { createControl     } from '../../Control.spec'
import { ElementLayerSpecs } from '../ElementLayer.spec'
import { triggerNextFrame  } from '../../onNextFrame'

export
function createLayer(): Layer {
    return new Layer();
}

describe( 'Canvas Layer:', () => {

    beforeEach( () => {
        this.control = createControl();
        this.layer = createLayer();
        this.control.addLayer( this.layer );
    });

    describe( 'is an ElementLayer', () => {
        ElementLayerSpecs.call( this );
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
