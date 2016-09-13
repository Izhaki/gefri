export
abstract class Stateful {
    protected stateStack: any[];

    constructor() {
        this.stateStack = [];
    }

    pushState() {
        var iState = this.getState();
        this.stateStack.push( iState );
    }

    popState() {
        var iState = this.stateStack.pop();
        this.restoreState( iState );
    }

    protected getState() : any {
        return {};
    }

    protected abstract restoreState( aState: any );

}
