Feature: Authentication

  @smoke @regression @authentication @resetApp
  Scenario: Successful login
    Given I am on the Login screen
    When I login with valid credentials
    Then I should be redirected to the Products page

  @regression @authentication @resetApp
  Scenario: Locked out user cannot login
    Given I am on the Login screen
    When I login with locked out credentials
    Then I should see a locked out error message
