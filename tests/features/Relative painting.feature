Feature: Relative painting

    Children viewees should be rendered in coordinates relative to their
    parent top-left position.

    Scenario: A viewee with two children

        Given the following viewee composition:
            | ID     | Parent | Type      | Bounds         |
            | Face   |        | Rectangle | 10, 10, 80, 80 |
            |   EyeL | Face   | Rectangle | 10, 10, 10, 10 |
            |   EyeR | Face   | Rectangle | 60, 10, 10, 10 |
        Then it should render the following:
            | Type | Bounds         |
            | rect | 10, 10, 80, 80 |
            | rect | 20, 20, 10, 10 |
            | rect | 70, 20, 10, 10 |
