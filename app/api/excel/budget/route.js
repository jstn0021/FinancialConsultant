import { BudgetItems , BudgetValue} from "@/db/models";
import { ExportExcelBudgetFile } from "@/functions/excel";

export async function GET(params) {
const items = await BudgetItems.findAll({
  where: { parent_id: null },

  include: [
    {
      model: BudgetItems,
      as: "children",

      include: [
        {
          model: BudgetItems,
          as: "children",

          include: [
            {
              model: BudgetValue,
              as: "values",
            },
          ],
        },

        {
          model: BudgetValue,
          as: "values",
        },
      ],
    },

    {
      model: BudgetValue,
      as: "values",
    },
  ],
});

return await ExportExcelBudgetFile(items ,"reimbursable");
}