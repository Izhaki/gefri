var iViewElement = document.getElementById( 'view' );
var iControl = new gefri.view.Control( iViewElement );
var iRect = new gefri.view.Rectangle( new gefri.view.geometry.Rect( 10, 10, 20, 20 ) );
iControl.setContents( iRect );
