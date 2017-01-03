import { Control,
         ElementLayer,
         onNextFrame  } from '../';
import { Viewee,
         Viewees      } from '../../../viewees/Viewee';
import { Renderer,
         Updater      } from './';
import { Rects        } from '../../../geometry';

export
class Layer extends ElementLayer {
    private context:  CanvasRenderingContext2D;
    private renderer: Renderer;
    private updater:  Updater;

    // Called after the layer element has been added to the DOM, which is
    // required in order to retrive the actual context.
    onAfterAdded( aControl: Control ): void {
        super.onAfterAdded( aControl );

        this.updates$.subscribe( () => this.queueRefresh() )

        this.context  = this.getContext( this.getCanvas() );
        this.renderer = new Renderer( this.context );
        this.updater  = new Updater( this.updates$ );
    }

    addViewees( ...aViewees: Viewees ): void {
        super.addViewees( ...aViewees );
        this.queueRefresh();
    }

    private refreshRenderer( aDamagedRects: Rects ) {
        this.renderer.refresh( this.root, aDamagedRects );
    }

    // As a callback, refresh is an instance method so we always get the same reference for it per instance
    // (required for correct operation of onNextFrame).
    private refresh = () => {
        let damagedRects = this.updater.getDamagedRects();
        this.refreshRenderer( damagedRects );
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
