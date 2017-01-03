// Based on:
// - https://developer.mozilla.org/en/docs/Web/API/CanvasRenderingContext2D
// - https://github.com/Microsoft/TypeScript/blob/ddadb472a6241bd14a267b915f5c4669bd094a28/src/lib/dom.generated.d.ts

import { Matrix,
         Rect,
         Point  } from '../../src/view/geometry';

export
class Context2DMock implements CanvasRenderingContext2D {

    // Mock helpers

    matrix:     Matrix;
    stateStack: any[] = [];
    rendered:   any[] = [];
    clipArea:   Rect;

    public showLog: boolean = false;

    constructor() {
        this.matrix = new Matrix()
    }

    public reset(): void {
        this.rendered.length   = 0;
        this.stateStack.length = 0;
    }

    private log( ...args: any[] ) {
        if ( this.showLog ) {
            args[0] = 'mockContext.' + args[0] + ':';
            args[0] = String( args[0] + '                       ' ).slice( 0, 24 );
            console.log.apply( console, args );
        }
    }

    private hasRendered(): boolean {
        return this.rendered.length > 0;
    }

    private getLastRendered() {
        return this.rendered[ this.rendered.length - 1 ];
    }

    private transformPoint( x, y ): Point {
        let iPoint = new Point( x, y );
        return iPoint.apply( this.matrix );
    }

    private transformRect( x, y, width, height ) {
        var iRect = new Rect( x, y, width, height );
        this.log( 'rect()', 'was given', iRect )
        var iTransformedRect = iRect.apply( this.matrix );
        this.log( 'The rect', iRect, 'was transformed to', iTransformedRect );
        return iTransformedRect;
    }


    // Drawing rectangles

    public clearRect( x: number, y: number, w: number, h: number ): void {
        let iRect = new Rect( x, y, w, h );
        this.rendered.push({
            type: 'Erase',
            bounds: iRect
        })
    }
    public fillRect( x: number, y: number, w: number, h: number ): void {
        var iRect = this.transformRect( x, y, w, h );

        if ( this.clipArea ) {
            iRect.intersect( this.clipArea );
            this.log( 'closePath()', 'intersected last rect with clip area', iRect )
        }

        this.rendered.push({
            type:   'Rectangle',
            bounds: iRect
        })
    }
    public strokeRect( x: number, y: number, w: number, h: number ): void {
        // Since we both fill and stroke rect, we don't log this one.
    }

    // Drawing text

    public fillText( text: string, x: number, y: number, maxWidth?: number ): void {}
    public strokeText( text: string, x: number, y: number, maxWidth?: number ): void {}
    public measureText( text: string ): TextMetrics { return null }

    // Line styles

    public lineWidth: number;
    public lineCap: string;
    public lineJoin: string;
    public miterLimit: number;
    public getLineDash(): number[] { return null }
    public setLineDash( segments: number[] ): void {}
    public lineDashOffset;

    // Text styles

    public font: string;
    public textAlign: string;
    public textBaseline: string;
    public direction;

    // Fill and stroke styles

    public fillStyle: string | CanvasGradient | CanvasPattern;
    public strokeStyle: string | CanvasGradient | CanvasPattern;

    // Gradients and patterns

    public createLinearGradient( x0: number, y0: number, x1: number, y1: number ): CanvasGradient { return null }
    public createRadialGradient( x0: number, y0: number, r0: number, x1: number, y1: number, r1: number ): CanvasGradient { return null }
    public createPattern( image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, repetition: string ): CanvasPattern { return null }

    // Shadows

    public shadowBlur: number;
    public shadowColor: string;
    public shadowOffsetX: number;
    public shadowOffsetY: number;

    // Paths

    public beginPath(): void {}
    public closePath() {}

    public moveTo( x, y ) {
        this.rendered.push({
            type:  'PathStart',
            point: this.transformPoint( x, y )
        });
    }

    public lineTo( x, y ) {
        this.rendered.push({
            type:  'LineTo',
            point: this.transformPoint( x, y )
        });
    }

    public bezierCurveTo( cp1x, cp1y, cp2x, cp2y, x, y ) {
        this.rendered.push({
            type:     'CubicTo',
            control1: this.transformPoint( cp1x, cp1y ),
            control2: this.transformPoint( cp2x, cp2y ),
            point:    this.transformPoint( x, y )
        });
    }

    public quadraticCurveTo( cpx, cpy, x, y ) {
        this.rendered.push({
            type:    'QuadTo',
            control: this.transformPoint( cpx, cpy ),
            point:   this.transformPoint( x, y )
        });
    }

    public arc() {}
    public arcTo() {}
    public ellipse() {}
    public rect( x, y, width, height ) {
        var iRect = this.transformRect( x, y, width, height );
        this.rendered.push({
            type:   'Rect',
            bounds: iRect
        })
    }

    // Drawing paths

    public fill( fillRule?: string ): void {}
    public stroke(): void {
        this.rendered.push({
            type: 'PathEnd'
        })
    }

    public drawFocusIfNeeded() {}
    public scrollPathIntoView() {}
    public clip( fillRule?: string ): void {
        var lastRender = this.rendered.pop();

        if ( lastRender.type !== 'Rect' ) {
            throw new Error( 'clip() was called but not with rect' )
        }

        var iRect = lastRender.bounds;

        this.log( 'clip()', 'before intersection:', this.clipArea, iRect );

        if ( this.clipArea ) {
            this.clipArea.intersect( iRect );
        } else {
            this.clipArea = iRect;
        }

        this.log( 'clip()', 'after intersection:', this.clipArea );
    }

    public isPointInPath( x: number, y: number, fillRule?: string ): boolean { return true }
    public isPointInStroke() {}

    // Transformations

    public currentTransform;
    public rotate( angle: number ): void {}
    public scale( x: number, y: number ): void {
        this.matrix.scale( x, y );
    }
    public translate( x: number, y: number ): void {
        this.matrix.translate( x, y );
    }
    public transform( m11: number, m12: number, m21: number, m22: number, dx: number, dy: number ): void {}
    public setTransform( m11: number, m12: number, m21: number, m22: number, dx: number, dy: number ): void {}
    public resetTransform() {}

    // Compositing

    public globalAlpha: number;
    public globalCompositeOperation: string;

    // Drawing images

    public drawImage( image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, offsetX: number, offsetY: number, width?: number, height?: number, canvasOffsetX?: number, canvasOffsetY?: number, canvasImageWidth?: number, canvasImageHeight?: number ): void {}

    // Pixel manipulation

    public createImageData( imageDataOrSw: number | ImageData, sh?: number ) : ImageData { return null }
    public getImageData( sx: number, sy: number, sw: number, sh: number ): ImageData { return null }
    public putImageData( imagedata: ImageData, dx: number, dy: number, dirtyX?: number, dirtyY?: number, dirtyWidth?: number, dirtyHeight?: number ): void {}

    // Image Smoothing

    public imageSmoothingEnabled;

    // The canvas state

    public save(): void {
        this.log( 'save()', '-------------------' )
        var iState = {
            matrix:   this.matrix.clone(),
            clipArea: this.clipArea ? this.clipArea.clone() : undefined
        };
        this.stateStack.push( iState );
    }
    public restore(): void {
        this.log( 'restore()', '-------------------' )
        var iState    = this.stateStack.pop();
        this.matrix   = iState.matrix;
        this.clipArea = iState.clipArea
    }
    public canvas: HTMLCanvasElement;

    // Hit regions

    public addHitRegion() {}
    public removeHitRegion() {}
    public clearHitRegion() {}

    // Some odd ones

    public msFillRule : string;
    public msImageSmoothingEnabled: boolean;
    public mozImageSmoothingEnabled: boolean;
    public webkitImageSmoothingEnabled: boolean;
    public oImageSmoothingEnabled: boolean;

}
