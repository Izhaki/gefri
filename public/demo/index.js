var iViewElement = document.getElementById( 'view' );
var iControl = new gefri.view.Control( iViewElement );

var iOut = new gefri.view.Rectangle( new gefri.view.geometry.Rect( 200, 200, 100, 100 ) );
var iMid = new gefri.view.Rectangle( new gefri.view.geometry.Rect( 10, 10, 80, 80 ) );
var iIn  = new gefri.view.Rectangle( new gefri.view.geometry.Rect( 10, 10, 60, 60 ) );

iMid.addChildren( iIn );
iOut.addChildren( iMid );

iControl.setContents( iOut );
