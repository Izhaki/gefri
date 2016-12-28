import { Viewee }  from '../Viewee';

export
abstract class Visible extends Viewee {

    get shown(): boolean {
        return this._rendered;
    }

    set shown( shown: boolean ) {
        this._rendered = shown;
        this.notifyUpdate();
    }

    isInteractive(): boolean {
        return this.shown;
    }

}
