var iViewElement = document.getElementById( 'view' );

var iControl = new gefri.view.Control( iViewElement );
var iCanvasLayer = new gefri.view.CanvasLayer();
iControl.addLayer( iCanvasLayer );

var iTransformer = new gefri.view.Transformer();
var iFace        = new gefri.view.Rectangle( new gefri.view.geometry.Rect( 200, 200, 100, 100 ) );
var iEyeL        = new gefri.view.Rectangle( new gefri.view.geometry.Rect( 10, 10, 20, 20 ) );
var iPupilL      = new gefri.view.Rectangle( new gefri.view.geometry.Rect( 5, 5, 10, 10 ) );
var iEyeR        = new gefri.view.Rectangle( new gefri.view.geometry.Rect( 70, 10, 20, 20 ) );
var iPupilR      = new gefri.view.Rectangle( new gefri.view.geometry.Rect( 5, 5, 10, 10 ) );
var iMouth       = new gefri.view.Rectangle( new gefri.view.geometry.Rect( 45, 70, 10, 10 ) );

iEyeR.addChildren( iPupilR );
iEyeL.addChildren( iPupilL );
iFace.addChildren( iEyeL, iEyeR );
iTransformer.addChildren( iFace );

//iTransformer.setScale( 0.5, 0.5 );

iCanvasLayer.setContents( iTransformer );

var iOverlay = new gefri.view.CanvasLayer();
var iMask    = new gefri.view.Rectangle( new gefri.view.geometry.Rect( 10, 10, 100, 100 ) );
iControl.addLayer( iOverlay );
iOverlay.setContents( iMask );


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


var zoomSlider = $( '#zoom-slider' );
function getZoomValue() { return zoomSlider.val(); }
function toRatio( val ) { return Math.pow( 1.1, val ); }
function setZoom( val ) { iTransformer.setScale( val, val ); }

Rx.Observable
    .fromEvent( zoomSlider, 'change mousemove' )
    .map( getZoomValue )
    .distinctUntilChanged()
    .map( toRatio )
    .subscribe( setZoom );

var scrollSlider = $( '#scroll-slider' );
function getScrollValue() { return scrollSlider.val(); }
function setScroll( val ) { iTransformer.setTranslate( val, val ); }

Rx.Observable
    .fromEvent( scrollSlider, 'change mousemove' )
    .map( getScrollValue )
    .distinctUntilChanged()
    .subscribe( setScroll );
