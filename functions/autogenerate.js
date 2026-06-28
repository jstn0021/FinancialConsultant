import { Purchase, User } from "@/db/models";
import { Op } from "sequelize";
//import crypto from "crypto"
//purchase id
export async function generatePurchaseId() {
  const prefix = "NSCR";
  const type = "PR";
  const year = new Date().getFullYear();

  // Kunin ang latest PurchaseID ngayong taon
  const lastPurchase = await Purchase.findOne({
    attributes: ["PurchaseID"],
    where: {
      PurchaseID: {
        [Op.like]: `${prefix}-${type}-${year}-AD%`,
      },
    },
    order: [["PurchaseID", "DESC"]],
  });

  let nextNumber = 1;

  if (lastPurchase) {
    // NSCR-PR-2026-AD0764
    const lastId = lastPurchase.PurchaseID;

    // AD0764
    const lastPart = lastId.split("-")[3];

    // 0764
    const number = parseInt(lastPart.replace("AD", ""), 10);

    nextNumber = number + 1;
  }

  const paddedNumber = String(nextNumber).padStart(4, "0");

  return `${prefix}-${type}-${year}-AD${paddedNumber}`;
}

export async function generatUserID(lastname) {
  // get latest count
  const userCount = await User.count();
  return `${lastname} - ${userCount}`;
}
