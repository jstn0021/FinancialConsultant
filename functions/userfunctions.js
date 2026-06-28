"use server";
import { User } from "@/db/models";
// server actions
// change password
// parameter userID or email , passwoprd
export async function changePassword(userID, newpassword) {
  // find user by userID
  const user = await User.findByPk(userID);
  if (!user) {
    throw new Error("User not found");
  }
  // hash new password
  const bcrypt = require("bcrypt");
  const hashedPassword = await bcrypt.hash(newpassword, 10);
  // update password
  await User.update(
    { password: hashedPassword },
    { where: { userID: userID } },
  );
  return { message: "Password updated successfully" };
}
