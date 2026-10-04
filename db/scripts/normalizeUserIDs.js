import { User } from "../db/models/index.js"; // adjust path kung iba setup mo

async function normalizeUserIDs() {
  try {
    const users = await User.findAll();

    for (const user of users) {
      const normalizedID = user.userID.replace(/\s+/g, "-"); // replace spaces with dash
      if (normalizedID !== user.userID) {
        console.log(`Before: ${user.userID} | After: ${normalizedID}`);
        await User.update(
          { userID: normalizedID },
          { where: { userID: user.userID } },
        );
      } else {
        console.log(`No change: ${user.userID}`);
      }
    }

    console.log("Normalization complete");
  } catch (err) {
    console.error("Error during normalization:", err);
  }
}

normalizeUserIDs();
