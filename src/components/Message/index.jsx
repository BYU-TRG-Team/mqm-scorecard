import React from "react";

const Message = (props) => {
  const { isUnverified, isRecoverPassword, isSuccessfulEditProfile } = props;
  return (
    <div>
      { isUnverified
                && (
                <div style={{ padding: "20px 0" }}>
                  <b>Your account has not yet been verified</b>
                  <br />
                  <br />
                  Please reach out to the admin of the platform to verify your account.
                </div>
                )}
      { isRecoverPassword
                && (
                <div style={{ padding: "20px 0" }}>
                  If an email matches an account, a recovery email will be sent to that email with instructions to recover your password.
                </div>
                )}
      { isSuccessfulEditProfile
                && (
                <div style={{ padding: "20px 0" }}>
                  Successfully updated user profile.
                </div>
                )}
    </div>
  );
};

export default Message;
