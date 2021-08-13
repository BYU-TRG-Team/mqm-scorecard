import React from 'react';

const Message = (props) => {
  const { isEmailVerification, isRecoverPassword, isSuccessfulEditProfile } = props;
  return (
    <div>
      { isEmailVerification
                && (
                <div style={{ padding: '20px 0' }}>
                  <b>Please verify your email</b>
                  <br />
                  <br />
                  To protect your security, we want to verify it’s really you. Please check the email we just sent to and follow the instructions to finish activating your account. Make sure to check all mailboxes of your email incase it didn&apos;t make it to your inbox.
                </div>
                )}
      { isRecoverPassword
                && (
                <div style={{ padding: '20px 0' }}>
                  If an email matches an account, a recovery email will be sent to that email with instructions to recover your password.
                </div>
                )}
      { isSuccessfulEditProfile
                && (
                <div style={{ padding: '20px 0' }}>
                  Successfully updated user profile.
                </div>
                )}
    </div>
  );
};

export default Message;
