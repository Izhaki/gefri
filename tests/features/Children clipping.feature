Feature: Children clipping

    A parent viewee should clip its children.

    Scenario: 3-level deep composition

        Given the following viewee composition:
            | ID     | Parent | Type      | Bounds         |
            | Top    |        | Rectangle | 10, 10, 80, 80 |
            |   Mid  | Top    | Rectangle | 10, 10, 80, 60 |
            |    Bot | Mid    | Rectangle | 10, 10, 80, 80 |
        Then it should render the following:
            | Type | Bounds         |
            | rect | 10, 10, 80, 80 |
            | rect | 20, 20, 70, 60 |
            | rect | 30, 30, 60, 50 |
