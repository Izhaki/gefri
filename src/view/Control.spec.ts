import { Control }   from './Control';
import { Rectangle } from './viewees/shapes/Rectangle';
import { Rect }      from './geometry/Rect';

describe( 'Control', () => {

    beforeEach( () => {
        var iViewElement = document.getElementById( 'view' );

        iViewElement.offsetWidth  = 500;
        iViewElement.offsetHeight = 400;
        iViewElement.innerHTML = '';

        this.control = new Control( iViewElement );
        this.canvas  = iViewElement.firstElementChild;
    });


    describe( 'constructor()', () => {

        it( 'should create a canvas and add it to the container', () => {
            expect( this.canvas.tagName ).toBe( 'CANVAS' );
        });

        it( 'should size the canvas to the dimensions of its container', () => {
            expect( this.canvas.width  ).toBe( 500 );
            expect( this.canvas.height ).toBe( 400 );
        });

    });


    describe( 'setContents()', () => {

        beforeEach( () => {
            this.rectangle = new Rectangle( new Rect( 10, 10, 20, 20 ) );
        });

        it( 'should remove the previous contents from the root', () => {
            this.control.setContents( this.rectangle );
            this.control.setContents( this.rectangle );

            expect( this.control.root.children.length ).toBe( 1 );
            expect( this.control.root.children[ 0 ] ).toBe( this.rectangle );
        });

        it( 'should add the viewee provided as a child of the root viewee', () => {
            this.control.setContents( this.rectangle );

            expect( this.control.root.children.length ).toBe( 1 );
            expect( this.control.root.children[ 0 ] ).toBe( this.rectangle );
        });

        it( 'should paint the root viewee', () => {
            spyOn( this.control.root, 'paint' );

            this.control.setContents( this.rectangle );

            expect( this.control.root.paint ).toHaveBeenCalled();
        });

    });


    describe( 'getBoundingRect()', () => {

        it( 'should return a rect at 0,0 with the dimensions of the control' , () => {
            expect( this.control.getBoundingRect() ).toEqualRect( 0, 0, 500, 400 );
        });

    });

});
