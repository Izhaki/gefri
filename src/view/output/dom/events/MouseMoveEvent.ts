import { Viewee,
         Viewees } from '../../../viewees/Viewee';

import { Point   } from '../../../geometry';

interface mousePoints {
    coords: Point;
    delta:  Point;
}

export
class MouseMoveEvent {
    coords:  Point   = new Point( 0, 0 );
    delta:   Point   = new Point( 0, 0 );
    absolute : mousePoints = {
        coords: new Point( 0, 0 ),
        delta:  new Point( 0, 0 )
    }
    topHit:  Viewee  = undefined;
    hits:    Viewees = [];
    dragged: Viewee  = undefined;
}
