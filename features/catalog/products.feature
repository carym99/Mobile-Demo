Feature: Product Catalog

  @smoke @regression @resetApp
  Scenario: Products page loads
    Given I am on the Products page
    Then I should see the Products page
    And the Products title should be "Products"
    And the shopping cart icon should be visible
    And the menu button should be visible
    And the product list should be displayed
    And at least 1 product should be visible

  @regression @resetApp
  Scenario: Verify product information on the catalog
    Given I am on the Products page
    Then every visible product should show an image name and price
    And no visible product name should be empty
    And every visible product price should use currency format

  @regression @resetApp
  Scenario: Open product details and return
    Given I am on the Products page
    When I open the first product
    Then I should see the Product Details page
    And the Product Details page should show image name description and price
    And the Product Details page should show quantity controls
    And the Product Details page should show the Add To Cart button
    And the Product Details page should show a color selector if available
    When I go back to the Products page
    Then I should see the Products page

  @regression @resetApp
  Scenario: Browse multiple products
    Given I am on the Products page
    When I open and verify product details for:
      | productName                |
      | Sauce Labs Backpack        |
      | Sauce Labs Bike Light      |
      | Sauce Labs Bolt T-Shirt    |
    Then I should see the Products page
    And the browsed product names should all be different

  @regression @resetApp
  Scenario: Scroll the product catalog
    Given I am on the Products page
    When I note the first visible product
    And I scroll the product catalog down
    Then additional products should become visible
    When I scroll the product catalog up
    Then the first product should be visible again

  @regression @resetApp
  Scenario: Product details match the catalog listing
    Given I am on the Products page
    When I capture catalog details for "Sauce Labs Backpack"
    And I open the product "Sauce Labs Backpack"
    Then I should see the Product Details page
    And the Product Details name and price should match the catalog
    And the Product Details page should show a product image
