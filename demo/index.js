var Control     = gefri.view.Control,
    CanvasLayer = gefri.view.CanvasLayer
    Transformer = gefri.view.Transformer,
    Rectangle   = gefri.view.Rectangle,
    Rect        = gefri.view.geometry.Rect,
    Point       = gefri.view.geometry.Point,
    Path        = gefri.view.Path;


var iViewElement = document.getElementById( 'view' );

var iControl = new Control( iViewElement );
var iCanvasLayer = new CanvasLayer();
iControl.addLayer( iCanvasLayer );

var iTransformer = new Transformer();
var iFace        = new Rectangle( new Rect( 200, 200, 100, 100 ) );
var iEyeL        = new Rectangle( new Rect( 10, 10, 20, 20 ) );
var iPupilL      = new Rectangle( new Rect( 5, 5, 10, 10 ) );
var iEyeR        = new Rectangle( new Rect( 70, 10, 20, 20 ) );
var iPupilR      = new Rectangle( new Rect( 5, 5, 10, 10 ) );
var iMouth       = new Rectangle( new Rect( 45, 70, 10, 10 ) );

iEyeR.addChildren( iPupilR );
iEyeL.addChildren( iPupilL );
iFace.addChildren( iEyeL, iEyeR );
iTransformer.addChildren( iFace );

// var iGrandparent = new Rectangle( new Rect( 10, 10, 80, 80 ) );
// var iParent      = new Rectangle( new Rect( 10, 10, 80, 60 ) );
// var iChild       = new Rectangle( new Rect( 10, 10, 80, 80 ) );

// iGrandparent.addChild( iParent );
// iParent.addChild( iChild );
// iTransformer.addChildren( iGrandparent );

// iTransformer.setTranslate( -100, -100 );
// iTransformer.setScale( 0.5, 0.5 );
// iTransformer.setZoom( 4, 4 );

var iLine = new Path( new Point( 250, 20 ) );
iLine.lineTo( new Point( 270, 40 ) );
iLine.lineTo( new Point( 250, 60 ) );
iTransformer.addChildren( iLine );

var iQuad = new Path( new Point( 240, 20 ) );
iQuad.quadTo( new Point( 220, 40 ), new Point( 240, 60 ) );
iTransformer.addChildren( iQuad );

var iCubic = new Path( new Point( 300, 20 ) );
iCubic.cubicTo( new Point( 320, 30 ), new Point( 280, 50 ), new Point( 300, 60 ) );
iTransformer.addChildren( iCubic );

iCanvasLayer.setContents( iTransformer );

/*
var iOverlay = new CanvasLayer();
var iMask    = new Rectangle( new Rect( 10, 10, 100, 100 ) );
iControl.addLayer( iOverlay );
iOverlay.setContents( iMask );
*/

$( '#hide-button' ).click( function() {
    iEyeL.hide();
});

$( '#show-button' ).click( function() {
    iEyeL.show();
});

$( '#add-button' ).click( function() {
    iFace.addChild( iMouth );
});

$( '#remove-button' ).click( function() {
    iFace.removeChild( iMouth );
});


function toRatio( val ) { return Math.pow( 1.1, val ); }

var zoomSlider = $( '#zoom-slider' );
function getZoomValue() { return zoomSlider.val(); }
function setZoom( val ) { iTransformer.setZoom( val, val ); }

Rx.Observable
    .fromEvent( zoomSlider, 'change mousemove' )
    .map( getZoomValue )
    .distinctUntilChanged()
    .map( toRatio )
    .subscribe( setZoom );

var scaleSlider = $( '#scale-slider' );
function getScaleValue() { return scaleSlider.val(); }
function setScale( val ) { iTransformer.setScale( val, val ); }

Rx.Observable
    .fromEvent( scaleSlider, 'change mousemove' )
    .map( getScaleValue )
    .distinctUntilChanged()
    .map( toRatio )
    .subscribe( setScale );

var scrollSlider = $( '#scroll-slider' );
function getScrollValue() { return scrollSlider.val(); }
function setScroll( val ) { iTransformer.setTranslate( val, val ); }

Rx.Observable
    .fromEvent( scrollSlider, 'change mousemove' )
    .map( getScrollValue )
    .distinctUntilChanged()
    .subscribe( setScroll );
