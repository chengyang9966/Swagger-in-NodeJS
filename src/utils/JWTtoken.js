const { decode, sign, verify } = require("jsonwebtoken");

const validateToken = (token) => {
  if (!token) {
    return {
      isValid: false,
      message: "Token is Missing",
    };
  }
  try {
    let result = verify(token, "SeCRETEAD");
    return {
      isValid: true,
      message: "Token is verified",
      tokenDecode: result,
    };
  } catch (error) {
    return {
      isValid: false,
      ...error,
    };
  }
};

const signToken = (payload) => {
  if (!payload) {
    return {
      isValid: false,
      message: "Token is Missing",
    };
  }
  try {
    let signedToken = sign(payload, "SeCRETEAD");
    return {
      isValid: true,
      message: "Token is signed Successfully",
      signedToken,
    };
  } catch (error) {
    return {
      isValid: false,
      message: "Fail to sign token",
      ...error,
    };
  }
};

export {
    validateToken,
    signToken
}