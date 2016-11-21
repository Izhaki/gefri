import { Viewee } from '../viewees/Viewee';
import { Root   } from '../viewees/invisibles';
import { Stream } from '../../core';
import { Rect   } from '../geometry';

export
class ElementLayer {
    protected container:     HTMLElement;
    protected bounds:        Rect;
    protected contents:      Viewee  = null;
    protected root:          Root;
    protected updatesStream: Stream;

    constructor( aContainer: HTMLElement ) {
        this.container     = aContainer;
        this.bounds        = new Rect( 0, 0, aContainer.offsetWidth, aContainer.offsetHeight );
        this.updatesStream = new Stream();
        this.root          = new Root( this );
    }

    getBoundingRect(): Rect {
        return this.bounds;
    }

    setContents( aViewee: Viewee ): void {
        if ( this.contents !== null ) {
            this.root.removeChild( this.contents );
        }

        this.contents = aViewee;
        this.root.addChild( aViewee );
        this.root.attach( this.updatesStream );
    }

    getRoot(): Root {
        return this.root;
    }

}
