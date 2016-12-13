import { Point           } from './Point';
export { Point           } from './Point';
export { Rect, Rects     } from './Rect';
export { TransformMatrix } from './TransformMatrix'

export
type Translation = Point;

export
type Scale = Point;

export
const cNoTranslate: Translation = new Point( 0, 0 );

export
const cNoScale: Scale = new Point( 1, 1 );
