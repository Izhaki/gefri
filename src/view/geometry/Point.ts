import { Matrix } from './';

export
class Point {
    x: number;
    y: number;

    constructor( x: number, y: number ) {
        this.x = x;
        this.y = y;
    }

    clone() : Point {
        return new Point( this.x, this.y );
    }

    set( x: number, y: number ) {
        this.x = x;
        this.y = y;
    }

    applyMatrix( aMatrix: Matrix ) : Point {
        return new Point(
            this.x * aMatrix.scaleX + aMatrix.translateX,
            this.y * aMatrix.scaleY + aMatrix.translateY
        );
    }
}
