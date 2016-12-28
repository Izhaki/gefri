import { Viewee }  from '../Viewee';

export
abstract class Visible extends Viewee {
    private visible: boolean = true;

    show(): void {
        this.visible = true;
        this.notifyUpdate();
    }

    hide(): void {
        this.visible = false;
        this.notifyUpdate();
    }

    isVisible(): boolean {
        return this.visible;
    }

    get shown(): boolean {
        return this._rendered;
    }

    set shown( shown: boolean ) {
        this._rendered = shown;
        this.notifyUpdate();
    }

    isInteractive(): boolean {
        return this.visible;
    }

}
