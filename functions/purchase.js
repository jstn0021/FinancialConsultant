
'use server'
import sequelize from '@/db/connection';
import { Purchase, PurchaseItems, User } from '@/db/models';
import { Sequelize } from 'sequelize';
import { NextResponse } from 'next/server';



 export async function getItemInfo( item_id , items){ 
    const requiredBalance = items.find(item => item.ItemsID === item_id)?.RequiredBalance || 0;
    const unitPrice = items.find(item => item.ItemsID === item_id)?.UnitPrice || 0;
    const unit = items.find(item => item.ItemsID === item_id)?.Unit || " ";
    return { 
        requiredBalance, 
        unitPrice, 
        unit 
    }
} 

export async function calculateQuantity(requiredBalance = 0, endingInventory = 0){
    const quantity = requiredBalance - endingInventory; 
    return quantity > 0 ? quantity : 0;
}

//matching the item id with the item info to get the required balance, unit price, and unit for the purchase submit table
//if item is found return the required balance, unit price, and unit, otherwise return 0 for required balance and unit price, and empty string for unit
export async function getItemInfoForPurchaseSubmit(itemsID, items){
/* 
   itemsID = ['11','13']
   items = [
0: {ItemRequiredBalance: 0, ItemUnitPrice: 0, EndingInventory: 0, ItemQuantity: 0, ItemTotal: 0, …},
1: {ItemRequiredBalance: 90, ItemUnitPrice: 300, EndingInventory: 0, ItemQuantity: 90, ItemTotal: 27000, …},
2: undefined,
3: undefined,
4: undefined,
5: undefined,
6: undefined,
7: undefined,
8: undefined,
9: undefined,
10:undefined,
11:{ItemRequiredBalance: 3, ItemUnitPrice: 500, EndingInventory: 2, ItemQuantity: 1, ItemTotal: 500},
12:undefined,
13:{ItemRequiredBalance: 25, ItemUnitPrice: 150, EndingInventory: 2, ItemQuantity: 23, ItemTotal: 3450},
]
*/

    return itemsID.map(id => {
        const item = items.find(item => item.ItemsID === Number(id));
        return {
            ItemRequiredBalance: item ? item.ItemRequiredBalance : 0,
            ItemUnitPrice: item ? item.ItemUnitPrice : 0,
            EndingInventory: item ? item.EndingInventory : 0,
            ItemQuantity: item ? item.ItemQuantity : 0,
            ItemTotal: item ? item.ItemTotal : 0
        }
    });
}

export async function GetSpecificRequest(role ,startParam , endParam , page, limit){
  let condition; 
  const isProjectDirector = role === "Project Director"
  if(role  === "Chief Administrator Manager"){ 
    condition = {
        ProjectDirectorSign : null,  
        ChiefAdminManageSign : null 
    }
  } else if(role === "Project Director") {
     condition = { 
        ProjectDirectorSign : null
     }
    }else { 
      return NextResponse.json({
        error_message : "UnAuthorized Access" 
      }, {status : 401})
    }
   const offset = (page - 1) * limit
  try { 
   const date = await Purchase.findOne({
  attributes: [
    [Sequelize.fn('MIN', sequelize.col('createdAt')), 'earliestDate'],
    [Sequelize.fn('MAX', sequelize.col('createdAt')), 'latestDate']
  ]
});

const earliestDate = date?.dataValues?.earliestDate || new Date();
const latestDate = date?.dataValues?.latestDate || new Date();

const rangeStart = startParam
  ? `${startParam} 00:00:00`
  : earliestDate;

const rangeEnd = endParam
  ? `${endParam} 23:59:59`
  : latestDate;

const whereClause = {
  ...condition,
  createdAt: {
    [Sequelize.Op.between]: [rangeStart, rangeEnd],
  },
};

if (!isProjectDirector) {
  whereClause.ChiefAdminManageSign = null;
}else { 
    // ChiefAdminManageSign must be not null for project director to see the purchase requisition that are pending for project director approval
    whereClause.ChiefAdminManageSign = {
        [Sequelize.Op.not]: null
    }
}

const { rows, count } = await Purchase.findAndCountAll({
  offset,
  limit,
  distinct: true,
  order: [['PurchaseID', 'DESC']],
  where: whereClause,
  include: [
    { model: User },
    { model: PurchaseItems }
  ]
});
    return NextResponse.json({
        data : rows, 
        total : count,
        page : page,
        limit : limit,
        rangeStart : rangeStart,
        rangeEnd : rangeEnd,
        totalPages : Math.ceil(count/limit),
        message : role +  " purchase request fetched successfully"
    }, {status : 200}); 
  }catch(error){ 
     return NextResponse.json({
       error_message: error.message || "Internal Server Error"
     }, {status: 500})
  }
}