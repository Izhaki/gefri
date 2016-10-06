Feature: State restoration

    We need to ensure that the painter state prior to children traversal is
    restored after the traversal

    Scenario: Sibling deep hierarchies.

        Without resotring the state the right eye wouldn't render because
        the clip region of the left eye.

        Given the following viewee composition:
            | ID         | Parent | Type      | Bounds             |
            | Face       |        | Rectangle | 200, 200, 100, 100 |
            |   EyeL     | Face   | Rectangle | 10,  10,  20,  20  |
            |     PupilL | EyeL   | Rectangle | 5,   5,   10,  10  |
            |   EyeR     | Face   | Rectangle | 70,  10,  20,  20  |
            |     PupilR | EyeR   | Rectangle | 5,   5,   10,  10  |
        Then it should render the following:
            | Type | Bounds             |
            | rect | 200, 200, 100, 100 |
            | rect | 210, 210, 20,  20  |
            | rect | 215, 215, 10,  10  |
            | rect | 270, 210, 20,  20  |
            | rect | 275, 215, 10,  10  |
