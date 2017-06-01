import {
    identity,
    pipe,
    complement,
    allPass,
    Predicate
} from './FP'

const hasChildren = node => node.children && node.children.length > 0;

interface TraverseCallbacks {
    drill?: boolean,
    preNode?: () => void,
    preChildren?: () => void,
    postChildren?: () => void,
    postNode?: () => void,
}

interface ReduceCallbacks {
    preNode?: ( node: any, accumulator: any ) => any,
    preChildren?: ( node: any, accumulator: any ) => any,
    postChildren?: ( node: any, accumulator: any ) => any,
    postNode?: ( node: any, accumulator: any ) => any,
}

type Callback = ( any ) => TraverseCallbacks

const noop = () => {}

export
abstract class LazyTree {

    static of( aNodes: any ) {
        let iNodes = Array.isArray( aNodes ) ? aNodes : [aNodes]
        return new Origin( iNodes )
    }

    abstract traverse( callback: Callback )

    map( mapper ) {
        return new Map( this, mapper )
    }

    reduce( callbacks: ReduceCallbacks, accumulator: any ) {
        const { preNode, preChildren, postChildren, postNode } = callbacks

        this.traverse( ( node ) => ({
            preNode: preNode ? () => { accumulator = preNode( node, accumulator ) } : noop,
            preChildren: preChildren  ? () => { accumulator = preChildren( node, accumulator ) } : noop,
            postChildren: postChildren ? () => { accumulator = postChildren( node, accumulator ) } : noop,
            postNode: postChildren ? () => { accumulator = postNode( node, accumulator ) } : noop,
        }))

        return accumulator
    }

    toArray() {
        const nodes = []
        this.traverse( ( node ) => ({
            preNode: () => { nodes.push( node ) },
        }))
        return nodes
    }

    mapAccum( aggregator, accumulator: any ) {
        return new MapAccum( this, aggregator, accumulator )
    }

    // Will carry on traversing the node and its children
    keepSubTreeIf( predicate: Predicate ) {
        return new SubTreeFilter( this, FilterType.keep, predicate );
    }

    // Will stop traversing the node and its children
    dropSubTreeIf( predicate: Predicate ) {
        return new SubTreeFilter( this, FilterType.drop, predicate );
    }

    // Will drop the node but not its children
    dropNodeIf( predicate: Predicate ) {
        return new NodeFilter( this, FilterType.drop, predicate );
    }

    // Will carry on traversing the node's children
    keepChildrenIf( predicate: Predicate ) {
        return new ChildrenFilter( this, FilterType.keep, predicate );
    }

    // Will stop traversing the node's children
    dropChildrenIf( predicate: Predicate ) {
       return new ChildrenFilter( this, FilterType.drop, predicate );
    }


}

class Origin extends LazyTree {
    private nodes: any[]

    constructor( nodes: any[] ) {
        super()
        this.nodes = nodes
    }

    traverse( callback: Callback ) {
        this.traverseNodes( this.nodes, callback )
    }

    traverseNodes( nodes, callback: Callback ) {
        nodes.forEach( ( node ) => {
            const callbacks: TraverseCallbacks = {
                // Defaults
                drill: true,
                preNode: noop,
                preChildren: noop,
                postChildren: noop,
                postNode: noop,

                // And their override
                ...callback( node )
            }
            callbacks.preNode()
            if ( callbacks.drill && hasChildren( node ) ) {
                callbacks.preChildren()
                this.traverseNodes( node.children, callback )
                callbacks.postChildren()
            }
            callbacks.postNode()
        })
    }
}

abstract class Processor extends LazyTree {
    protected chainee: LazyTree

    constructor( chainee: LazyTree ) {
        super()
        this.chainee = chainee
    }
}

class Map extends Processor {
    private mapper

    constructor( chainee: LazyTree, mapper ) {
        super( chainee )
        this.mapper = mapper
    }

    traverse( callback: Callback ) {
        this.chainee.traverse( ( node ) => callback( this.mapper( node ) ) )
    }
}

class MapAccum extends Processor {
    private aggregator
    private accumulator

    constructor( chainee: LazyTree, aggregator, accumulator ) {
        super( chainee )
        this.aggregator = aggregator
        this.accumulator = accumulator
    }

    traverse( callback: Callback ) {
        let accumulator = this.accumulator
        this.chainee.traverse( ( node ) => {
            const oldAcc = accumulator
            const [ mapped, newAccFn ] = this.aggregator( node, accumulator )
            const callbacks = {
                preChildren: noop,
                postChildren: noop,
                ...callback( mapped )
            }
            return {
                ...callbacks,
                preChildren: () => {
                    accumulator = newAccFn()
                    callbacks.preChildren()
                },
                postChildren: () => {
                    accumulator = oldAcc
                    callbacks.postChildren()
                },
            }

        })
    }
}

enum FilterType {
    keep,
    drop
}

abstract class Filter extends Processor {
    private predicates: Predicate[]
    private keepFunction: Function

    constructor( chainee: LazyTree, type: FilterType, predicate: Predicate ) {
        super( chainee )

        this.predicates = [ predicate ]
        this.keepFunction = pipe( allPass, type === FilterType.keep ? identity : complement )
    }

    public and( keep: Predicate ) {
        this.predicates.push( keep )
        return this
    }

    protected keep( node ) {
        return this.keepFunction( this.predicates )( node )
    }

}

const skipSubTree = {
    drill: false,
    preNode: noop,
    preChildren: noop,
    postChildren: noop,
    postNode: noop,
}

class SubTreeFilter extends Filter {
    traverse( callback: Function ) {
        this.chainee.traverse( ( node ) => this.keep( node ) ? callback( node ) : skipSubTree )
    }
}

const skipNode = {
    preNode: noop,
    postNode: noop,
}

class NodeFilter extends Filter {
    traverse( callback: Function ) {
        this.chainee.traverse( ( node ) =>  this.keep( node ) ? callback( node ) : { ...callback( node ), ...skipNode } )
    }
}

class ChildrenFilter extends Filter {

    traverse( callback: Function ) {
        this.chainee.traverse( ( node ) => ({
                ...callback( node ),
                drill: this.keep( node ),
            })
        )
    }

}
