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

    substract( aPoint: Point ): Point {
        return new Point(
            this.x - aPoint.x,
            this.y - aPoint.y
        );
    }

    applyMatrix( aMatrix: Matrix ) : Point {
        return new Point(
            this.x * aMatrix.scaleX + aMatrix.translateX,
            this.y * aMatrix.scaleY + aMatrix.translateY
        );
    }

    applyInverseMatrix( aMatrix: Matrix ) : Point {
        return this.applyMatrix( aMatrix.inverse() );
    }

}
