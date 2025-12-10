export type RegisterActionResult =
  | {
      success: true;
      userEmail: string;
      redirectUrl: string;
    }
  | {
      success: false;
      error: string;
    };
export type RegisterResponse = {
  success: boolean;
  message: string;
  data: {
    email: string;
  };
};
export type VerifyEmailActionResult =
  | {
      success: true;
      verified: boolean;
      redirectUrl: string;
    }
  | {
      success: false;
      error: string;
    };

export type VerifyEmailResponse = {
  success: boolean;
  message: string;
};
export type ResendOtpActionResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };
export type ResendOtpResponse = {
  success: boolean;
  message: string;
};

export type VerifyEmailTokenActionResult =
  | {
      success: true;
      verified: true;
      redirectUrl: string;
    }
  | {
      success: false;
      error: string;
    };

export type VerifyEmailTokenResponse = {
  success: boolean;
  message: string;
  data?: {
    email: string;
    verified: boolean;
  };
};
export type ForgotPasswordActionResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };
export type ResetPasswordActionResult =
  | {
      success: true;
      redirectUrl: string;
    }
  | {
      success: false;
      error: string;
    };

export type LoginResponse = {
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  tokens: {
    accessToken: string;
  };
  companyId: string | null;
  role: string;
};
export type TwoFactorRequiredResponse = {
  requires2FA: true;
  tempToken: string;
  message: string;
};

export type LoginActionResult =
  | {
      success: true;
      user: LoginResponse["user"];
      redirectUrl: string;
    }
  | {
      success: true;
      requires2FA: boolean;
      tempToken: string;
      redirectUrl: string;
    }
  | {
      success: false;
      error: string;
    };
export type TwoFaLoginActionResult =
  | {
      success: true;
      user: LoginResponse["user"];
      redirectUrl: string;
    }
  | {
      success: false;
      error: string;
    };
export type GetCurrentUserResponse =
  | {
      success: true;
      user: {
        email: string;
        firstName: string;
        lastName: string;
        id: string;
        isEmailVerified: boolean;
        status: string;
        twoFactorEnabled: boolean;
      };
      memberships: string[];
    }
  | {
      success: false;
      error: string;
    };

export type RefreshTokenResult =
  | {
      success: true;
      accessToken: string;
    }
  | {
      success: false;
      error: string;
    };
