class waitForFrameMock {
    private callback = undefined;

    schedule( aCallback ) {
        this.callback = aCallback;
    }

    flush() {
        if ( this.callback != undefined ) {
            this.callback();
        }

    }
}

export
function mockWaitForFrame( di ) {
    di.overrideProviders([{
        provide: 'waitForFrame', useClass: waitForFrameMock
    }]);
}
