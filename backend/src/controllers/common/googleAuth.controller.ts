import type { Request, Response } from "express";

// Extend SessionData to include userType
declare module "express-session" {
  interface SessionData {
    userType?: "buyer" | "artist";
  }
}

export const googleCallback = (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    if (!user) {
      // Redirect to frontend with error
      return res.redirect(
        `${process.env.FRONTEND_URL}/error?message=Authentication failed`
      );
    }

    // Set JWT cookie
    res.cookie("token", user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Create success URL with user data
    const userData = encodeURIComponent(
      JSON.stringify({
        id: user.id,
        email: user.email,
        firstName: user.firstName || user.fullName?.split(" ")[0] || "",
        lastName:
          user.lastName || user.fullName?.split(" ").slice(1).join(" ") || "",
        avatar: user.avatar || user.businessLogo || "",
        role: user.role,
        isNewUser: user.isNewUser,
        isOAuthUser: true,
      })
    );

    // Redirect to a success page that will handle the automatic login
    const redirectUrl = `${process.env.FRONTEND_URL}/success?data=${userData}`;

    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect(
      `${process.env.FRONTEND_URL}/error?message=Authentication failed`
    );
  }
};

export const initiateGoogleAuth = (userType: "buyer" | "artist") => {
  return (req: Request, res: Response, next: any) => {
    // Store user type in session
    req.session.userType = userType;
    next();
  };
};
