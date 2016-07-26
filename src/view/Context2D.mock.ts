// Based on:
// - https://developer.mozilla.org/en/docs/Web/API/CanvasRenderingContext2D
// - https://github.com/Microsoft/TypeScript/blob/ddadb472a6241bd14a267b915f5c4669bd094a28/src/lib/dom.generated.d.ts
// '//' postfix signify no typings for member/method

export
class Context2DMock implements CanvasRenderingContext2D {

    // Drawing rectangles

    public clearRect( x: number, y: number, w: number, h: number ): void {}
    public fillRect( x: number, y: number, w: number, h: number ): void {}
    public strokeRect( x: number, y: number, w: number, h: number ): void {}

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
    public direction; //

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
    public closePath() {} //
    public moveTo() {} //
    public lineTo() {} //
    public bezierCurveTo() {} //
    public quadraticCurveTo() {} //
    public arc() {} //
    public arcTo() {} //
    public ellipse() {} //
    public rect() {} //

    // Drawing paths

    public fill( fillRule?: string ): void {}
    public stroke(): void {}
    public drawFocusIfNeeded() {} //
    public scrollPathIntoView() {} //
    public clip( fillRule?: string ): void {}
    public isPointInPath( x: number, y: number, fillRule?: string ): boolean { return true }
    public isPointInStroke() {} //

    // Transformations

    public currentTransform; //
    public rotate( angle: number ): void {}
    public scale( x: number, y: number ): void {}
    public translate( x: number, y: number ): void {}
    public transform( m11: number, m12: number, m21: number, m22: number, dx: number, dy: number ): void {}
    public setTransform( m11: number, m12: number, m21: number, m22: number, dx: number, dy: number ): void {}
    public resetTransform() {} //

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

    public imageSmoothingEnabled; //

    // The canvas state

    public save(): void {}
    public restore(): void {}
    public canvas: HTMLCanvasElement;

    // Hit regions

    public addHitRegion() {} //
    public removeHitRegion() {} //
    public clearHitRegion() {} //

    // Some odd ones

    public msFillRule : string;
    public msImageSmoothingEnabled: boolean;
    public mozImageSmoothingEnabled: boolean;
    public webkitImageSmoothingEnabled: boolean;
    public oImageSmoothingEnabled: boolean;

}