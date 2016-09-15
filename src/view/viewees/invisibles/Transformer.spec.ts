import { InvisibleSpecs }     from './Invisible.spec.ts';
import { summonUpdaterSpecs } from '../tactics/children/summonUpdater.spec.ts'

import { Transformer }        from './Transformer';
import { Context2DMock }      from '../../../../tests/mocks/Context2D';
import { Painter }            from '../../output/Painter';
import { ContextPainter }     from '../../output/ContextPainter';

function createTransformer(): Transformer {
    return new Transformer();
}

function createPainter(): Painter {
    return new ContextPainter( new Context2DMock() );
}

describe( 'Transformer', () => {


    describe( 'is an Invisible', () => {
        InvisibleSpecs.call( this, createTransformer, createPainter );
    });


    beforeEach( () => {
        this.transformer = createTransformer()
        this.painter     = createPainter();
    });


    describe( 'paint()', () => {

        it( 'should paint its children', () => {
            spyOn( this.transformer, 'paintChildren' );

            this.transformer.paint( this.painter );
            expect( this.transformer.paintChildren ).toHaveBeenCalledWith( this.painter );
        });

    });


    describe( 'setTranslate()', () => {

        it( 'should set the translation to the given parameters', () => {

            this.transformer.setTranslate( 5, 15 );
            expect( this.transformer.translation.x ).toBe( 5 );
            expect( this.transformer.translation.y ).toBe( 15 );
        });

    });


    describe( 'setScale()', () => {

        it( 'should set the scale to the given parameters', () => {

            this.transformer.setScale( 2, 4 );
            expect( this.transformer.scale.x ).toBe( 2 );
            expect( this.transformer.scale.y ).toBe( 4 );
        });

    });


    describe( 'applyTransformations()', () => {

        it( 'should translate the context using the current translation', () => {
            spyOn( this.painter, 'translate' );
            this.transformer.setTranslate( 2, 4 );
            this.transformer.applyTransformations( this.painter );

            expect( this.painter.translate ).toHaveBeenCalledWith( 2, 4 );
        });

        it( 'should translate the context using the current translation', () => {
            spyOn( this.painter, 'scale' );
            this.transformer.setScale( 2, 4 );
            this.transformer.applyTransformations( this.painter );

            expect( this.painter.scale ).toHaveBeenCalledWith( 2, 4 );
        });

    });


    describe( 'summonUpdater', () => {
        summonUpdaterSpecs.call( this, createTransformer );
    });


});
