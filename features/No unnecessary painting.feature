Feature: No unnecessary painting

    We don't want to render viewees that are outside the bounds of their parent
    (so long the parent does clip its children).

    Scenario: Viewee is outside the it parent bounds (the canvas in this case)

        Given the following viewee composition:
            | ID     | Parent | Type      | Bounds             |
            | Face   |        | Rectangle | 1000, 1000, 80, 80 |
        When the view is rendered
        Then it should not render anything

    Scenario: A child viewee is outside the bounds of absolute coordinates

        We check that the mechanism accounts for relative coordinates

        Given the following viewee composition:
            | ID        | Parent | Type      | Bounds             |
            | Grand     |        | Rectangle | 200, 200, 100, 100 |
            |   Parent  | Grand  | Rectangle | 10,  10,  80,  80  |
            |     Child | Parent | Rectangle | 10,  10,  60,  60  |
        When the view is rendered
        Then it should render the following:
            | Type | Bounds             |
            | rect | 200, 200, 100, 100 |
            | rect | 210, 210, 80,  80  |
            | rect | 220, 220, 60,  60  |
