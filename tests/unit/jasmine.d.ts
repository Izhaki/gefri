declare namespace jasmine {
    interface Matchers {
        toEqualRect( ...params: any[] ): boolean;
        toHaveRendered( expected: string ): boolean;
    }
}
