### Sign In

**Purpose:** This page helps students and teachers signin if they have an existing account.

**How It Works:** 
1. User enters their email that they used to register for our service
2. User enters their password
3. The built-in `firebase.auth().signInWithEmailAndPassword()` function to sign in the user
    - If the user successfully signs in they are redirected to the dashboard.
    - Appropriate error is shown if a user can't sign in.
4. If user doesn't have an account, they can choose to signup instead.

### Forgot Password
**Added By:** [@whuang001](https://github.com/whuang001)

**Purpose:** User can send choose to reset their password if they have forgotten their password.

**How It Works:**  
1. User can click on 'Forgot Password' button
2. User enters their corresponding email address.
3. User can click on 'Ok' to send a password reset link
4. User built-in `firebase.auth().sendPasswordResetEmail()` function to send a reset link to the user's email.
5. User can choose 'Cancel' so that password is not reset.
