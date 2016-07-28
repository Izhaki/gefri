var iViewElement = document.getElementById( 'view' );
var iControl = new gefri.view.Control( iViewElement );

var iFace = new gefri.view.Rectangle( new gefri.view.geometry.Rect( 10, 10, 80, 80 ) );
var iNose = new gefri.view.Rectangle( new gefri.view.geometry.Rect( 35, 35, 10, 10 ) );
var iEyeL = new gefri.view.Rectangle( new gefri.view.geometry.Rect( 10, 10, 10, 10 ) );
var iEyeR = new gefri.view.Rectangle( new gefri.view.geometry.Rect( 60, 10, 10, 10 ) );

iFace.addChildren( iNose, iEyeL, iEyeR );

iControl.setContents( iFace );
