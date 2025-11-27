// All helping function's go here

// For Show log in console -> development mode only
export const devLog = (mgs) => {
  if (process.env.DEVELOPMENT === "true") {
    console.log(mgs);
  } else {
    return;
  }
};
