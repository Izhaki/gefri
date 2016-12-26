import { Viewee,
         Viewees      } from './viewees/Viewee';
import { Stream       } from '../core';
import { ElementLayer } from './output'
import { Layer        } from './output/canvas';
import { Rect         } from './geometry';

export
class Control {
    private container: HTMLElement;
    private bounds:    Rect;
    private layers:    ElementLayer[] = [];
    private offsetLeft: number;
    private offsetTop:  number;

    public mouseMove$: Stream;

    constructor( aContainer: HTMLElement ) {
        aContainer.style.position = 'relative'; // So we can stack children
        this.container = aContainer;
        this.bounds    = new Rect( 0, 0, aContainer.offsetWidth, aContainer.offsetHeight );

        this.mouseMove$ = new Stream();
        this.watchMouseMove();
    }

    addLayer( aLayer: ElementLayer ): void {
        this.layers.push( aLayer );
        this.addLayerElement( aLayer.getElement() );
        aLayer.onAfterAdded( this );
    }

    getBoundingRect(): Rect {
        return this.bounds;
    }

    private watchMouseMove(): void {
        this.offsetLeft = this.container.offsetLeft;
        this.offsetTop  = this.container.offsetTop;

        this.container.addEventListener( 'mousemove', ( aEvent ) => {
            let hits: Viewees = this.hitTest( aEvent.clientX - this.offsetLeft, aEvent.clientY - this.offsetTop );
            this.mouseMove$.notify( hits );
        });
    }

    private hitTest( x: number, y:number ): Viewees {
        let hits: Viewees = [];
        this.forEachLayer( (aLayer) => {
            let layerHits: Viewees = aLayer.hitTest( x, y );
            hits.push( ...layerHits );
        });
        return hits;
    }

    private addLayerElement( aElement: HTMLElement ): void {
        let iBoundingRect = this.getBoundingRect();
        aElement.setAttribute( 'width',  iBoundingRect.w.toString() );
        aElement.setAttribute( 'height', iBoundingRect.h.toString() );

        aElement.style.position = "absolute";
        aElement.style.top  = '0px';
        aElement.style.left = '0px';

        this.container.appendChild( aElement );
    }

    private forEachLayer( aCallback ) {
        this.layers.forEach( aCallback );
    }

}
