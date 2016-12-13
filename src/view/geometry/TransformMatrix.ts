/**
 *
 * A partial 2D transform matrix. Currently doesn't support rotation (and hence
 * skew).
 */

export
class TransformMatrix {
    scaleX    : number; // a
    scaleY    : number; // d
    translateX: number; // e or tx
    translateY: number; // f or ty

    constructor() {
        this.translateX = 0;
        this.translateY = 0;
        this.scaleX     = 1;
        this.scaleY     = 1;
    }

    clone() : TransformMatrix {
        var iClone = new TransformMatrix();
        iClone.translateX = this.translateX;
        iClone.translateY = this.translateY;
        iClone.scaleX = this.scaleX;
        iClone.scaleY = this.scaleY;

        return iClone;
    }

    translate( x: number, y: number ) {
        this.translateX += x * this.scaleX;
        this.translateY += y * this.scaleY;
    }

    scale( x: number, y: number ) {
        this.translateX *= x;
        this.translateY *= y;

        this.scaleX     *= x;
        this.scaleY     *= y;
    }

}
