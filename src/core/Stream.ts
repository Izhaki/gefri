import { Subject }               from 'rxjs';
import { AnonymousSubscription } from 'rxjs/Subscription'

type T              = any;
type StreamCallback = ( value: T ) => void;
type Subscription   = AnonymousSubscription;

export
class Stream {
    private stream: Subject<T>;

    constructor() {
        this.stream = new Subject();
    }

    notify( what: any ) {
        this.stream.next( what );
    }

    subscribe( onNext: StreamCallback ): Subscription  {
        return this.stream.subscribe( onNext );
    }
}
