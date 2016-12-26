import { Viewee }  from '../Viewee';

export
class Invisible extends Viewee {

    isInteractive(): boolean {
        return false;
    }

}
