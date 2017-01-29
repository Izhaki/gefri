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
    di.overrideInjected( 'waitForFrame', new waitForFrameMock() );
}
