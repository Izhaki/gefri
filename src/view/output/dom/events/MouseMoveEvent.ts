import { Viewee,
         Viewees } from '../../../viewees/Viewee';

import { Point   } from '../../../geometry';

interface MousePosition {
    coords: Point;
    delta:  Point;
}

export
class MouseMoveEvent {
    client: MousePosition = {
        coords: new Point( 0, 0 ),
        delta:  new Point( 0, 0 )
    };
    absolute : MousePosition = {
        coords: new Point( 0, 0 ),
        delta:  new Point( 0, 0 )
    };
    topHit:  Viewee  = undefined;
    hits:    Viewees = [];
    dragged: Viewee  = undefined;
}
