import { Control      } from '../../Control';
import { Viewee       } from '../../viewees/Viewee';
import { Renderer,
         Updater      } from './';
import { Rects        } from '../../geometry';
import { ElementLayer } from '../'
import { onNextFrame  } from '../../onNextFrame'

export
class Layer extends ElementLayer {
    private context:      CanvasRenderingContext2D;
    private renderer:     Renderer;
    private updater:      Updater;
    private damagedRects: Rects = [];

    // Called after the layer element has been added to the DOM, which is
    // required in order to retrive the actual context.
    onAfterAdded(  aControl: Control ): void {
        super.onAfterAdded( aControl );

        this.context  = this.getContext( this.getCanvas() );
        this.renderer = new Renderer( this.context );
        // TODO: Having damagedRects owned by the layer, updated by the updater and
        // indirectly used upon refresh is quite some invisible mapping. Should live
        // on the updater.
        this.updater  = new Updater( this.updatesStream, this.damagedRects );
    }

    setContents( aViewee: Viewee ): void {
        super.setContents( aViewee );

        this.updatesStream.subscribe( () => this.queueRefresh() )

        this.queueRefresh();
    }

    // As a callback, refresh is an instance method so we always get the same reference for it per instance
    // (required for correct operation of onNextFrame).
    private refresh = () => {
        this.renderer.refresh( this.root, this.damagedRects );
    }

    queueRefresh(): void {
        onNextFrame( this.refresh );
    }

    protected  createElement(): HTMLElement {
        return document.createElement( 'CANVAS' );
    };

    private getCanvas(): HTMLCanvasElement {
        return this.getElement() as HTMLCanvasElement;
    }

    private getContext( aCanvas: HTMLCanvasElement ): CanvasRenderingContext2D {
        let context: CanvasRenderingContext2D = aCanvas.getContext( '2d' );
        // context.translate( 0.5, 0.5 ); // Prevents antialiasing effect.
        context.fillStyle = '#1ABC9C';
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        return context;
    }
}