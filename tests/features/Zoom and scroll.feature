Feature: Zoom and scroll

    We need a way to scroll and zoom a portion of the view.

    Scenario: Simple scroll and zoom.

        Given the following viewee composition:
            | ID          | Parent      | Type        | Bounds           |
            | Transformer |             | Transformer |                  |
            |   Square    | Transformer | Rectangle   | 100, 100, 10, 10 |
        And the Transformer translate is set to { -50, -50 }
        And the Transformer scale is set to { 0.5, 0.5 }

        # Lets check initial rendering
        Then it should render the following:
            | Type | Bounds       |
            | rect | 25, 25, 5, 5 |

        # Now lets check updating works
        And the Transformer translate is set to { 50, 50 }
        Given the Transformer scale is set to { 2, 2 }
        Then it should render the following:
            | Type | Bounds           |
            | rect | 300, 300, 20, 20 |


