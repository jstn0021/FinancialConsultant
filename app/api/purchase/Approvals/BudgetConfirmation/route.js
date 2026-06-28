import sequelize from "@/db/connection";
import { Purchase, User, PurchaseItems } from "@/db/models";
import { NextResponse } from "next/server";
import { Op } from "sequelize";

export async function GET(request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const offset = (page - 1) * limit;
  const tab = searchParams.get("tab") || "pending"; // "pending" | "approved"
  const searchId = searchParams.get("searchId"); // PurchaseID search

  try {
    const dates = await Purchase.findOne({
      attributes: [
        [
          sequelize.Sequelize.fn("MIN", sequelize.col("createdAt")),
          "earliestDate",
        ],
        [
          sequelize.Sequelize.fn("MAX", sequelize.col("createdAt")),
          "latestDate",
        ],
      ],
    });

    const startParam = searchParams.get("dateStart");
    const endParam = searchParams.get("dateEnd");
    const rangeStart =
      startParam ? `${startParam} 00:00:00` : dates.dataValues.earliestDate;
    const rangeEnd =
      endParam ? `${endParam} 23:59:59` : dates.dataValues.latestDate;

    // build where clause base on active tab
    const tabWhere =
      tab === "approved" ?
        { Status: "PR Approval", isOnTheBudget: true }
      : { Status: "Budget Confirmation", isOnTheBudget: false };

    const where = {
      createdAt: { [Op.between]: [rangeStart, rangeEnd] },
      ...tabWhere,
      ...(searchId ? { PurchaseID: searchId } : {}),
    };

    const { rows, count } = await Purchase.findAndCountAll({
      offset,
      limit,
      distinct: true,
      order: [["PurchaseID", "DESC"]],
      where,
      include: [{ model: User }, { model: PurchaseItems }],
    });

    return NextResponse.json(
      {
        data: rows,
        total: count,
        page,
        rangeStart,
        rangeEnd,
        totalPages: Math.ceil(count / limit),
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}
