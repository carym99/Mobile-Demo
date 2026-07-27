Feature: Shopping Cart

  @smoke @regression @cart @resetApp
  Scenario: Add a product to cart
    Given I am on the Products page
    When I open the product "Sauce Labs Backpack"
    Then I should see the Product Details page
    When I select the color "blue"
    And I set the product quantity to 2
    And I add the product to the cart
    Then the cart badge should show 2
    When I open the cart
    Then I should see the cart screen
    And the cart should contain "Sauce Labs Backpack" with color "blue" quantity 2 and price "$29.99"
    And the cart total should be "$59.98"
    And the cart item count label should be "2 items"

  @regression @cart @resetApp
  Scenario: Update quantity in the cart
    Given I have added "Sauce Labs Backpack" with color "blue" and quantity 2 to the cart
    When I increase the cart quantity for "Sauce Labs Backpack"
    Then the cart quantity for "Sauce Labs Backpack" should be 3
    And the cart total should be "$89.97"
    And the cart item count label should be "3 items"

  @regression @cart @resetApp
  Scenario: Remove product from the cart
    Given I have added "Sauce Labs Backpack" with color "blue" and quantity 1 to the cart
    When I remove "Sauce Labs Backpack" from the cart
    Then the cart should be empty
    And the cart badge should not show a quantity

  @regression @cart @resetApp
  Scenario: Add multiple products to the cart
    Given I am on the Products page
    When I open the product "Sauce Labs Backpack"
    And I select the color "blue"
    And I set the product quantity to 2
    And I add the product to the cart
    And I go back to the Products page
    And I open the product "Sauce Labs Bike Light"
    And I set the product quantity to 1
    And I add the product to the cart
    And I open the cart
    Then the cart should contain "Sauce Labs Backpack" with color "blue" quantity 2 and price "$29.99"
    And the cart should contain "Sauce Labs Bike Light" with color "black" quantity 1 and price "$9.99"
    And the cart should have 2 products
    And the cart total should be "$69.97"
    And the cart item count label should be "3 items"
