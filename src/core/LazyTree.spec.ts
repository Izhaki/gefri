import { LazyTree } from './LazyTree';

function addChildren( aParent, aChildren: any[] ) {
    aParent.children = aParent.children ? aParent.children : [];
    aParent.children.push( ...aChildren );
    aChildren.forEach( aChild => aChild.parent = aParent );
}

describe( 'LazyTree: ', () => {

    beforeEach( () => {

        let iFace = { name: 'Face' },
                iLeftEye = { name: 'Left eye', visible: false },
                    iLeftPupil = { name: 'Left pupil' },
                iRightEye = { name: 'Right eye', clipping: true },
                    iRightPupil = { name: 'Right pupil' };

        addChildren( iLeftEye, [ iLeftPupil ] );
        addChildren( iRightEye, [ iRightPupil ] );
        addChildren( iFace, [ iLeftEye, iRightEye ] );

        this.tree = LazyTree.of( iFace );

        this.logName = ( aNode ) => {
            console.log( aNode.name );
        };

        this.log = ( logee ) => {
            console.log( logee );
        };


    });

    it( 'traverse() should visit all tree nodes in a depth first fashion.', () => {
        let iNodes = [];

        this.tree
            .traverse( aNode => iNodes.push( aNode.name ) );

        expect( iNodes ).toEqual([
            'Face',
            'Left eye',
            'Left pupil',
            'Right eye',
            'Right pupil'
        ]);
    })

    it( 'keepIf() should include the nodes that meet the predicate.', () => {
        let nodeHasChildren = aNode => aNode.children && aNode.children.length > 0;

        let iNodes = this.tree
            .keepIf( nodeHasChildren )
            .map( aNode => aNode.name )
            .toArray();

        expect( iNodes ).toEqual([
            'Face',
            'Left eye',
            'Right eye'
        ]);

    });

    it( 'keepChildrenIf() should include the children of nodes that meet the predicate.', () => {
        let isFace = aNode => aNode.name == 'Face';

        let iNodes = this.tree
            .keepChildrenIf( isFace )
            .map( aNode => aNode.name )
            .toArray();

        expect( iNodes ).toEqual([
            'Face',
            'Left eye',
            'Right eye'
        ]);
    });

    it( 'dropIf() should drop the nodes that meet the predicate.', () => {
        let isLeftEye = aNode => aNode.name == 'Left eye';

        let iNodes = this.tree
            .dropIf( isLeftEye )
            .map( aNode => aNode.name )
            .toArray();

        expect( iNodes ).toEqual([
            'Face',
            'Right eye',
            'Right pupil'
        ]);
    });

    it( 'dropChildrenIf() should drop the children of nodes that meet the predicate.', () => {
        let isLeftEye = aNode => aNode.name == 'Left eye';

        let iNodes = this.tree
            .dropChildrenIf( isLeftEye )
            .map( aNode => aNode.name )
            .toArray();

        expect( iNodes ).toEqual([
            'Face',
            'Left eye',
            'Right eye',
            'Right pupil'
        ]);
    });

    it( 'map() should map each node using the provided mapper function.', () => {

        let iNodes = this.tree
            .map( aNode => aNode.name )
            .toArray();

        expect( iNodes ).toEqual([
            'Face',
            'Left eye',
            'Left pupil',
            'Right eye',
            'Right pupil'
        ]);

    });

    it( 'reduce() should return the accumalated value of traversing all nodes.', () => {
        let nodeIsClipping = aNode => aNode.clipping === true;
        let aggregator = ( aAccumulator, aNode ) => aAccumulator + 1;

        let iNodeCount = this.tree
            .dropChildrenIf( nodeIsClipping )
            .reduce( aggregator, 0 );

        expect( iNodeCount ).toBe( 4 );
    });

    it( 'scan() should return the accumalated value of each node, with each child getting the accumulator of its parent.', () => {
        let aggregator = ( aAccumulator, aNode ) => aAccumulator + ' | ' + aNode.name;

        let isLeftPupil = namePath => namePath == 'Root | Face | Left eye | Left pupil';

        let iNodes = this.tree
            .scan( aggregator, 'Root' )
            .dropIf( isLeftPupil )
            .toArray();

        expect( iNodes ).toEqual([
            'Root | Face',
            'Root | Face | Left eye',
            'Root | Face | Right eye',
            'Root | Face | Right eye | Right pupil'
        ]);


    });

})
