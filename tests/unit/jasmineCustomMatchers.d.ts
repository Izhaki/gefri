declare namespace jasmine {
    interface Matchers {
        toEqualRect( ...params: any[] ): boolean;
        toHaveRenderedRect( ...params: any[] ): boolean;
    }
}
