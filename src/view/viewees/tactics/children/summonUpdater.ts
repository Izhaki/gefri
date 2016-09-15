import { Updater } from '../../../output/Updater';

export
function summonUpdater( viewee ) : Updater {
    let aUpdater = viewee.getParent().summonUpdater();
    viewee.applyTransformations( aUpdater )
    return aUpdater;
}
