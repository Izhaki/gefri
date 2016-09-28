import { overrideProviders } from '../../src/inject';

class waitForFrameMock {
    private callback;

    schedule( aCallback ) {
        this.callback = aCallback;
    }

    flush() {
        this.callback();
    }
}

export
function mockWaitForFrame() {
    overrideProviders([{
        provide: 'waitForFrame', useClass: waitForFrameMock
    }]);
}
