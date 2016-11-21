import { Viewee       } from './viewees/Viewee';
import { ElementLayer } from './output'
import { Layer        } from './output/canvas';
import { Rect         } from './geometry';

export
class Control {
    private container: HTMLElement;
    private bounds:    Rect;
    private layer:     ElementLayer;

    constructor( aContainer: HTMLElement ) {
        this.container = aContainer;
        this.bounds    = new Rect( 0, 0, aContainer.offsetWidth, aContainer.offsetHeight );
        this.layer     = new Layer( aContainer );
    }

    setContents( aViewee: Viewee ): void {
        this.layer.setContents( aViewee );
    }

    getBoundingRect(): Rect {
        return this.bounds;
    }

    getLayer(): ElementLayer {
        return this.layer;
    }

}
