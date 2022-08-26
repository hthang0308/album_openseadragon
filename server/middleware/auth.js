require("dotenv").config();

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  //get token in cookie
  let token = req.cookies?.accessToken;
  if (!token) {
    //clear cookie
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("isLoggedIn");
    return res.status(401).json({ message: "Unauthorized" });
  }
  const refreshToken = req.cookies?.refreshToken;
  //check if token is expired
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    try {
      if (err) {
        if (err.name === "TokenExpiredError") {
          console.log("Token expired. Now trying to refresh token");
          //check if refresh token is expired
          jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(401).json({ message: "Unauthorized" });
            //if refresh token is not expired, generate new access token and refresh token
            const newAccessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, {
              expiresIn: "1h", //expires in 1 hour
            });
            const newRefreshToken = jwt.sign({ username: user.username }, process.env.REFRESH_TOKEN_SECRET, {
              expiresIn: "1y", //expires in 1 year
            });
            //set new access token and refresh token in cookie
            res.cookie("accessToken", newAccessToken, { httpOnly: true });
            res.cookie("refreshToken", newRefreshToken, { httpOnly: true });
            res.cookie("isLoggedIn", true, { maxAge: 1000 * 60 * 60 * 24 * 365 }); //expires in 1 year
            jwt.verify(newAccessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
              if (err) return res.status(401).json({ message: "Unauthorized" });
              req.user = user;
            });
          });
        } else {
          console.log("Lỗi gì z trời");
          console.log(err);
          return res.status(401).json({ message: "Unauthorized" });
        }
      }
      if (!req.user) req.user = user;
      return next();
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = verifyToken;
