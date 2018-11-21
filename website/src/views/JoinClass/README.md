### Join Class

**Purpose:** This page helps students join new classes.

**How It Works:** 
1. User searches for the university where the class exists.
2. Using [`getclasses`](https://github.com/CSC59939/Rails/wiki/API-Documentation#get-classes) API,
a list of classes is fetched from our database.
    - If no classes exist for the university, a message is shown letting you know that no classes were found
    - If classes are found, a table is generated with the options
3. User can select a class form the generated table, this will create a new modal with full details of the class.
    - If the user is pre-approved for the class, a 'Join Class' button is shown.
    - If the user isn't pre-approved, a 'Request Permission' button is shown.
4. Based on the approval status from above, [`joinclass`](https://github.com/CSC59939/Rails/wiki/API-Documentation#join-class)
or [`requestclass`](https://github.com/CSC59939/Rails/wiki/API-Documentation#request-class-permission) API is used.
