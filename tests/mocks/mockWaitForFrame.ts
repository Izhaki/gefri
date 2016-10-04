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
function mockWaitForFrame( di ) {
    di.overrideProviders([{
        provide: 'waitForFrame', useClass: waitForFrameMock
    }]);
}
