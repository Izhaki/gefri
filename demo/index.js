var iViewElement = document.getElementById( 'view' );
var iControl = new gefri.view.Control( iViewElement );

var iTransformer = new gefri.view.Transformer();
var iFace        = new gefri.view.Rectangle( new gefri.view.geometry.Rect( 200, 200, 100, 100 ) );
var iEyeL        = new gefri.view.Rectangle( new gefri.view.geometry.Rect( 10, 10, 20, 20 ) );
var iPupilL      = new gefri.view.Rectangle( new gefri.view.geometry.Rect( 5, 5, 10, 10 ) );
var iEyeR        = new gefri.view.Rectangle( new gefri.view.geometry.Rect( 70, 10, 20, 20 ) );
var iPupilR      = new gefri.view.Rectangle( new gefri.view.geometry.Rect( 5, 5, 10, 10 ) );

iEyeR.addChildren( iPupilR );
iEyeL.addChildren( iPupilL );
iFace.addChildren( iEyeL, iEyeR );
iTransformer.addChildren( iFace );

//iTransformer.setScale( 0.5, 0.5 );

iControl.setContents( iTransformer );
