const messages: Record<string, string> = ({
  /**
   * Messages relates to User Sign In (Log In)
   */
  'LOGIN.SUCCESS': "You are successfully signed in.",
  'LOGIN.ERROR': "Error signing in. Invalid cderentials.",
  'LOGIN.USER_NOT_FOUND': "Invalid email or password.",
  'LOGIN.EMAIL_NOT_VERIFIED': "User's email is not verified yet.",

  /**
   * Messages relates to User Sign Up
   */
  'REGISTRATION.USER_REGISTERED_SUCCESSFULLY': "Registration successful! Verify your email.",
  'REGISTRATION.ERROR.MAIL_NOT_SENT': "Error sending email verification mail.",
  'REGISTRATION.USER_ALREADY_REGISTERED': "User with the email is already registered.",
  'REGISTRATION.MISSING_MANDATORY_PARAMETERS': "User email and password are required.",
  'REGISTRATION.ERROR': "Error registering a user.",

  /**
   * Common Message
   */
  'COMMON.SUCCESS': "Action succeed!"

  // OTHER related messages
});

/**
 * Gets the message for message hash map
 *
 * @param key
 * @returns String
 */
export const getMessage = (key: string) => {
  return messages[key];
}
