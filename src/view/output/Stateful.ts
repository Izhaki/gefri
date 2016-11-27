export
abstract class Stateful {
    protected stateStack: any[];

    constructor() {
        this.stateStack = [];
    }

    protected pushState() {
        var iState = this.getState();
        this.stateStack.push( iState );
    }

    protected popState() {
        var iState = this.stateStack.pop();
        this.restoreState( iState );
    }

    protected getState() : any {
        return {};
    }

    protected abstract restoreState( aState: any );

}
