"use server";
import { Sequelize } from "sequelize";
import { CashBooks, PH_Cash_Bank, US_Cash_Bank } from "../db/models/index.js";
import sequelize from "../db/connection.js";

import { validateRequiredFields } from "./validations.js";
import { Op } from "sequelize";

export async function createCashbookEntry() {
  try {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );

    const startOfNextMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1,
    );

    const combinations = [
      { currency: "PH", category: "Cash" },
      { currency: "PH", category: "Bank" },
      { currency: "US", category: "Cash" },
      { currency: "US", category: "Bank" },
    ];

    for (const combination of combinations) {
      const cashbook = await CashBooks.findOne({
        where: {
          currency: combination.currency,
          category: combination.category,
          createdAt: {
            [Op.gte]: startOfMonth,
            [Op.lt]: startOfNextMonth,
          },
        },
      });

      if (!cashbook) {
        await CashBooks.create({
          currency: combination.currency,
          category: combination.category,
        });

        // console.log(`Created ${combination.currency} ${combination.category}`);
      }
    }

    return {
      success: true,
      message: "Cashbook entries checked successfully",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }
}
export async function insertCashbooks(
  cashbookDetailed,
  voucherType,
  cashbookID,
) {
  // const validation = validateRequiredFields(
  //   {
  //     date: cashbookDetailed.date,
  //     job_No: cashbookDetailed.job_No,
  //     payee_payer: cashbookDetailed.payee_payer,
  //     payee_payer_no: cashbookDetailed.payment_item,
  //     description: cashbookDetailed.description,
  //     payment: cashbookDetailed.payment,
  //   },
  //   [
  //     {
  //       name: "date",
  //       label: "Date",
  //       required: true,
  //       type: "date",
  //     },
  //     {
  //       name: "job_No",
  //       label: "Job No",
  //       required: true,
  //     },
  //     {
  //       name: "payee_payer_no",
  //       label: "Payee/Payer No",
  //       required: true,
  //     },
  //     {
  //       name: "amount",
  //       label: "Amount",
  //       required: true,
  //       type: "number",
  //       min: 0,
  //     },
  //   ],
  // );

  // if (!validation.isValid) {
  //   return {
  //     success: false,
  //     message: "Validation failed",
  //     errors: validation.errors,
  //   };
  // }

  const dbTransaction = await sequelize.transaction();

  try {
    const seperate = voucherType.split(" ");
    const currency = seperate[1];

    const cashBankModel = currency === "PHP" ? PH_Cash_Bank : US_Cash_Bank;

    const cashBankEntry = await cashBankModel.create(
      {
        date: cashbookDetailed.date,
        job_No: cashbookDetailed.job_No,
        payee_payer: cashbookDetailed.payee_payer,
        payee_payer_no: cashbookDetailed.payment_item,
        description: cashbookDetailed.description,
        payment: cashbookDetailed.payment,
      },
      { transaction: dbTransaction },
    );

    await dbTransaction.commit();

    return {
      success: true,
      message: "Cashbook entry created successfully",
      cashbookID,
      cashBankEntry,
    };
  } catch (err) {
    await dbTransaction.rollback();
    console.log("error", err.message);
    return {
      success: false,
      message: "Error creating cashbook entry",
      error: err.message,
    };
  }
}
