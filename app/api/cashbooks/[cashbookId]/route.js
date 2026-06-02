import { CashBooks, Check, CheckItem } from "@/db/models";
import { insertCashbooks } from "@/functions/cashbook";
import { NextResponse } from "next/server";
import { Sequelize } from "sequelize";

export async function POST(request, { params }) {
  const { cashbookId } = await params;

  try {
    // find range
    const range = await CashBooks.findOne({
      where: {
        cashbook_id: cashbookId,
      },
      attributes: [
        "cashbook_id",
        "dateRangeStart",
        "dateRangeEnd",
        "is_already_have_subdata",
      ],
    });
    if (!range) {
      return NextResponse.json({ error_message: "Not Found" }, { status: 404 });
    }

    if (range.is_already_have_subdata === false) {
      const voucher = await Check.findAll({
        where: {
          ChiefAccountSignature: {
            [Sequelize.Op.not]: null,
          },
          ChiefAdminSignature: {
            [Sequelize.Op.not]: null,
          },
          createdAt: {
            [Sequelize.Op.between]: [range.dateRangeStart, range.dateRangeEnd],
          },
        },
        include: [
          {
            model: CheckItem,
            as: "items",
            where: {
              parent_id: null,
            },
            required: false,
            include: [
              {
                model: CheckItem,
                as: "children",
              },
            ],
          },
        ],
      });

      voucher?.map((v) => {
        v.items?.map((item) => {
          item?.children?.map(async (c) => {
            await insertCashbooks(
              {
                date: item.payment_voucher_date,
                job_No: item.job,
                payee_payer_no: item.payment_item,
                payee_payer: item.title,
                description: c.title,
                payment: c.amount,
              },
              item.voucherType,
              cashbookId,
            );
          });
        });
      });

      range.is_already_have_subdata = true;
      range.save();
    }

    return NextResponse.json({ message: "Successfully Created" });
  } catch (err) {
    return NextResponse.json({ error_message: err.message }, { status: 500 });
  }
}
