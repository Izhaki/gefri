Feature: Zoom and scroll

    We need a way to scroll and zoom a portion of the view.

    Scenario: Simple scrolling and zooming.

        Given the following viewee composition:
            | ID          | Parent      | Type        | Bounds           |
            | Transformer |             | Transformer |                  |
            |   Square    | Transformer | Rectangle   | 100, 100, 10, 10 |
        And the Transformer translate is set to { -50, -50 }
        And the Transformer scale is set to { 0.5, 0.5 }
        When the view is rendered
        Then it should render the following:
            | Type | Bounds       |
            | rect | 25, 25, 5, 5 |
