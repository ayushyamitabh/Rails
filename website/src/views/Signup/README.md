### Sign Up

**Purpose:** This page helps students and teachers signup for our service.

**How It Works:** 
1. User selects their role - either 'Student' or 'Teacher'
2. User enters their full name
3. User enters their email
4. User enters a new password for their account
5. If user chooses to signup, the [`signup`](https://github.com/CSC59939/Rails/wiki/API-Documentation#sign-up) 
API is used to create the user and set their role in the database. The user is then signed in and redirected to the dashboard.
6. If user already has an account, they can choose to signin instead.

### Password Strength Indicator

**Purpose:** This is a feature that ensures that the password is strong

**How It Works:**
- When signing up, there will be a password strength indicator progress bar to indicate how strong a password is
- The strength of the password is indicated by the color of the progress bar. Strength is determined by the use of capital letters, lowercase letters, numbers, and special symbols.

1.Red when strength and length is not met
2.Orange when some of the strength is met
3.Yellow when some of the strength is met (more than orange)
4.Light green when the strength is met but not the length
5.Green when both strength and length is met

It also throws proper alerts when trying to sign up with a "bad"(strength and length requirements) password.
