import { Viewee         } from './viewees/Viewee';
import { CanvasRenderer } from './output/canvas';
import { Rect           } from './geometry';
import { Root           } from './viewees/invisibles';
import { inject         } from '../di';

export
class Control {
    private container:       HTMLElement;
    private canvas:          HTMLCanvasElement;
    private context:         CanvasRenderingContext2D;
    private painter:         CanvasRenderer;
    private bounds:          Rect;
    private contents:        Viewee  = null;
    private root:            Root;
    private refreshIsQueued: boolean = false;
    private waitForFrame:    any;

    constructor( aContainer: HTMLElement ) {
        this.container    = aContainer;
        this.bounds       = new Rect( 0, 0, aContainer.offsetWidth, aContainer.offsetHeight );
        this.canvas       = this.createCanvas( aContainer );
        this.context      = this.getContext( this.canvas );
        this.painter      = new CanvasRenderer( this.context );
        this.waitForFrame = inject( 'waitForFrame' );

        this.root         = new Root( this );
    }

    setContents( aViewee: Viewee ): void {
        if ( this.contents !== null ) {
            this.root.removeChild( this.contents );
        }

        this.contents = aViewee;
        this.root.addChild( aViewee );

        this.queueRefresh();
    }

    getBoundingRect(): Rect {
        return this.bounds;
    }

    /* istanbul ignore next */
    queueRefresh(): void {
        if ( !this.refreshIsQueued ) {
            this.refreshIsQueued = true;

            // waitForFrame will call the callback before the next render.
            // Using requestAnimationFrame also mean this will happen after
            // current tasks in the even loop has been fully processed, which
            // may be a user action that triggered many changes to the viewee
            // composition.
            // For more: https://blog.risingstack.com/writing-a-javascript-framework-execution-timing-beyond-settimeout/
            this.waitForFrame.schedule( () => {
                this.refreshIsQueued = false;
                this.painter.render( this.root );
            });
        }
    }

    getRoot(): Root {
        return this.root;
    }

    private createCanvas( aContainer: HTMLElement ) : HTMLCanvasElement {
        var iCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.createElement( 'CANVAS' );
        iCanvas.setAttribute( 'width',  aContainer.offsetWidth.toString()  );
        iCanvas.setAttribute( 'height', aContainer.offsetHeight.toString() );
        aContainer.appendChild( iCanvas );
        return iCanvas;
    }

    private getContext( aCanvas: HTMLCanvasElement ): CanvasRenderingContext2D {
        var context: CanvasRenderingContext2D = this.canvas.getContext( '2d' );
        // context.translate( 0.5, 0.5 ); // Prevents antialiasing effect.
        context.fillStyle = '#1ABC9C';
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        return context;
    }

}
