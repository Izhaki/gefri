var iViewElement = document.getElementById( 'view' );
var iControl = new gefri.view.Control( iViewElement );

var iFace = new gefri.view.Rectangle( new gefri.view.geometry.Rect( 10, 10, 80, 80 ) );
var iNose = new gefri.view.Rectangle( new gefri.view.geometry.Rect( 35, 35, 10, 10 ) );

iFace.addChild( iNose );

iControl.setContents( iFace );
