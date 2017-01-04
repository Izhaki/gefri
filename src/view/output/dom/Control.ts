import { Viewees      } from '../../viewees/Viewee';
import { ElementLayer } from './ElementLayer'
import { Layer        } from '../../output/dom/canvas';
import { Rect         } from '../../geometry';

export
class Control {
    private container: HTMLElement;
    private bounds:    Rect;
    private layers:    ElementLayer[] = [];

    constructor( aContainer: HTMLElement ) {
        aContainer.style.position = 'relative'; // So we can stack children
        this.container = aContainer;
        this.bounds    = new Rect( 0, 0, aContainer.offsetWidth, aContainer.offsetHeight );
    }

    addLayer( aLayer: ElementLayer ): void {
        this.layers.push( aLayer );
        this.addLayerElement( aLayer.getElement() );
        aLayer.onAfterAdded( this );
    }

    getContrainer(): HTMLElement {
        return this.container;
    }

    getBoundingRect(): Rect {
        return this.bounds;
    }

    hitTest( x: number, y: number ): Viewees {
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
