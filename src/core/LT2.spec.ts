import { LazyTree } from './LT2'

function addChildren( aParent, aChildren: any[] ) {
    aParent.children = aParent.children ? aParent.children : []
    aParent.children.push( ...aChildren )
    aChildren.forEach( aChild => aChild.parent = aParent )
}

fdescribe( 'LazyTree: ', () => {

    beforeEach( () => {

        let iFace = { name: 'Face' },
                iLeftEye = { name: 'Left eye', visible: false },
                    iLeftPupil = { name: 'Left pupil' },
                iRightEye = { name: 'Right eye', clipping: true },
                    iRightPupil = { name: 'Right pupil' }

        addChildren( iLeftEye, [ iLeftPupil ] )
        addChildren( iRightEye, [ iRightPupil ] )
        addChildren( iFace, [ iLeftEye, iRightEye ] )

        this.tree = LazyTree.of( iFace )
    })

    beforeEach( () => {
        this.isLeftEye = ( node ) => node.name == 'Left eye'
        this.isFace = ( node ) => node.name == 'Face'
        this.nodeHasChildren = ( node ) => node.children && node.children.length > 0
    })

    it( 'traverse()', () => {
        const trace = []

        const push = ( prefix, node ) => trace.push( prefix + ': ' + node.name )

        this.tree.traverse(
            ( node ) => ({
                preNode: () => push( 'preNode', node ),
                preChildren: () => push( 'preChildren', node ),
                postChildren: () => push( 'postChildren', node ),
                postNode: () => push( 'postNode', node ),
            })
        )

        expect(
            trace
         ).toEqual([
            'preNode: Face',
            'preChildren: Face',
                'preNode: Left eye',
                'preChildren: Left eye',
                    'preNode: Left pupil',
                    'postNode: Left pupil',
                'postChildren: Left eye',
                'postNode: Left eye',
                'preNode: Right eye',
                'preChildren: Right eye',
                    'preNode: Right pupil',
                    'postNode: Right pupil',
                'postChildren: Right eye',
                'postNode: Right eye',
            'postChildren: Face',
            'postNode: Face',
        ])
    })

    it( 'map()', () => {
        const mapper = ( node ) => node.name
        const reducer = ( node, accumulator ) => [ ...accumulator, node ]

        expect(
            this.tree
            .map( mapper )
            .reduce( { preNode: reducer } , [] )
        ).toEqual([
            'Face',
                'Left eye',
                    'Left pupil',
                'Right eye',
                    'Right pupil',
        ])

    })

    it( 'reduce()', () => {
        const reducer = ( prefix ) => ( node, accumulator ) => [ ...accumulator, prefix + ': ' + node.name ]

        const reducers = {
            preNode: reducer( 'preNode' ),
            preChildren: reducer( 'preChildren' ),
            postChildren: reducer( 'postChildren' ),
            postNode: reducer( 'postNode' ),
        }

        expect(
            this.tree
            .reduce( reducers, [ 'Starting value' ] )
         ).toEqual([
            'Starting value',
            'preNode: Face',
            'preChildren: Face',
                'preNode: Left eye',
                'preChildren: Left eye',
                    'preNode: Left pupil',
                    'postNode: Left pupil',
                'postChildren: Left eye',
                'postNode: Left eye',
                'preNode: Right eye',
                'preChildren: Right eye',
                    'preNode: Right pupil',
                    'postNode: Right pupil',
                'postChildren: Right eye',
                'postNode: Right eye',
            'postChildren: Face',
            'postNode: Face',
        ])

    })

    it( 'mapAccum()', () => {
        const aggregator = ( node, accumulator ) => [ accumulator + node.name + ' > ' , () => accumulator + node.name + ' > ' ]
        const reducer = ( node, accumulator ) => [ ...accumulator, node ]

        expect(
            this.tree
            .mapAccum( aggregator, '' )
            .reduce( { preNode: reducer }, [] )
         ).toEqual([
            'Face > ',
            'Face > Left eye > ',
            'Face > Left eye > Left pupil > ',
            'Face > Right eye > ',
            'Face > Right eye > Right pupil > ',
        ])
    })

    it( 'keepSubTreeIf() should include the nodes and its children when the predicate is met.', () => {
        expect(
            this.tree
            .keepSubTreeIf( this.nodeHasChildren )
            .map( node => node.name )
            .toArray()
        ).toEqual([
            'Face',
            'Left eye',
            'Right eye',
        ])

    })

    it( 'dropSubTreeIf() should drop the nodes and it children when the predicate met.', () => {
        expect(
            this.tree
            .dropSubTreeIf( this.isLeftEye )
            .map( ( node ) => node.name )
            .toArray()
        ).toEqual([
            'Face',
            'Right eye',
            'Right pupil',
        ])
    })

    it( 'dropSubTreeIf() should drop the whole tree if the predicate is was met for the root node.', () => {
        expect(
            this.tree
            .dropSubTreeIf( this.isFace )
            .map( ( node ) => node.name )
            .toArray()
        ).toEqual(
            []
        )
    })

    it( 'dropNodeIf() should drop the node that meet the predicate, but not its children', () => {
        expect(
            this.tree
            .dropNodeIf( this.isLeftEye )
            .map( ( node ) => node.name )
            .toArray()
        ).toEqual([
            'Face',
            'Left pupil',
            'Right eye',
            'Right pupil',
        ])
    })

    it( 'keepChildrenIf() should include the children of nodes that meet the predicate.', () => {
        expect(
            this.tree
            .keepChildrenIf( this.isFace )
            .map( ( node ) => node.name )
            .toArray()
        ).toEqual([
            'Face',
            'Left eye',
            'Right eye',
        ])
    })

    it( 'dropChildrenIf() should drop the children of nodes that meet the predicate.', () => {
        expect(
            this.tree
            .dropChildrenIf( this.isLeftEye )
            .map( ( node ) => node.name )
            .toArray()
        ).toEqual([
            'Face',
            'Left eye',
            'Right eye',
            'Right pupil',
        ])
    })


})
