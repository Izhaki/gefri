declare namespace jasmine {
    interface Matchers {
        toEqualRect( ...params: any[] ): boolean;
        toEqualPoint( ...params: any[] ): boolean;
        toHaveRendered( expected: string ): boolean;
    }
}
