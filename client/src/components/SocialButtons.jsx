import React from "react";
import Button from "./Button";

const SocialButtons = ({ onGoogleClick, onFacebookClick }) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      <Button variant="outline" onClick={onGoogleClick} fullWidth>
        Continue with Google
      </Button>

      <Button variant="outline" onClick={onFacebookClick} fullWidth>
        Continue with Facebook
      </Button>
    </div>
  );
};

export default SocialButtons;