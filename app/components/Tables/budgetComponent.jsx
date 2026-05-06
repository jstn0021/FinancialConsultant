import { list } from 'postcss'
import React, { useEffect } from 'react'
  const Row = React.memo(function Row({ item, level = 0, updateField }) {
  const v = item.values || {};
  const isMain = level === 0;

  const show = (val) => (isMain ? "" : val);

  return (
    <>
      <tr style={{ fontWeight: isMain ? "bold" : "normal" }} className="text-center border border-dotted">
        <td style={{ paddingLeft: `${level * 20}px` }} >
          {item.code}
        </td>

        <td className="p-1 text-left">
          <input
            type="text"
            value={item.description || ""}
            onChange={(e) =>
              updateField(item.id, "description", e.target.value, item.parent_id)
            }
            style={{ width: `${(item.description || "").length + 2}ch` }}
            className= ' border-r-2 border-gray-300 w-full  px-1 bg-gray-100'
          />
        </td>
   {/* Approved */}
        <td className='border-r-2 text-left'>
          {!isMain && (
            <input
              type="text"
              value={v.approved_unit || ""}
              onChange={(e) =>
                updateField(item.id, "approved_unit", e.target.value, item.parent_id)
              }
               style={{ width: `${(v.approved_unit || "").length + 2}ch` }}
               className= 'border border-gray-300 px-1 bg-gray-100'
            />
          )}
        </td>
        <td className='border-r-2 text-left'>
          {!isMain && (
            <input
              type="number"
              value={v.approved_rate || ""}
              onChange={(e) =>
                updateField(item.id, "approved_rate", e.target.value, item.parent_id)
              }
               style={{ width: `${String(v.approved_rate || "").length + 3}ch` }}
               className= 'border border-gray-300 px-1 bg-gray-100'
            />
          )}
        </td>
        <td className='border-r-2 text-left'>
          {!isMain && (
            <input
              type="number"
              value={v.approved_qty || ""}
              onChange={(e) =>
                updateField(item.id, "approved_qty", e.target.value, item.parent_id)
              }
               style={{ width: `${String(v.approved_qty || "").length + 3}ch` }}
               className= 'border border-gray-300 px-1 bg-gray-100'
            />
          )}
        </td>
        <td className='border-r-2 text-left'>
          {!isMain && (
            <input
              type="number"
              value={v.approved_amount || ""}
              onChange={(e) =>
                updateField(item.id, "approved_amount", e.target.value, item.parent_id)
              }
               style={{ width: `${String(v.approved_amount || "").length + 3}ch` }}
               className= 'border border-gray-300 px-1 bg-gray-100'
            />
          )}
        </td> 
        {/*Modified  */}
        <td className='border-r-2 text-left'>
          {!isMain && (
            <input
              type="number"
              value={v.revision_rate || ""}
              onChange={(e) =>
                updateField(item.id, "revision_rate", e.target.value, item.parent_id)
              }
               style={{ width: `${String(v.revision_rate || "").length + 3}ch` }}
               className= 'border border-gray-300 px-1 bg-gray-100'
            />
          )}
        </td>
        <td className='border-r-2 text-left'>
          {!isMain && (
            <input
              type="number"
              value={v.revision_qty || ""}
              onChange={(e) =>
                updateField(item.id, "revision_qty", e.target.value, item.parent_id)
              }
               style={{ width: `${String(v.revision_qty || "").length + 3}ch` }}
               className= 'border border-gray-300 px-1 bg-gray-100'
            />
          )}
        </td>
        <td className='border-r-2 text-left'>
          {!isMain && (
            <input
              type="number"
              value={v.revision_cost || ""}
              onChange={(e) =>
                updateField(item.id, "revision_cost", e.target.value, item.parent_id)
              }
               style={{ width: `${String(v.revision_cost || "").length + 3}ch` }}
               className= 'border border-gray-300 px-1 bg-gray-100'
            />
          )}
        </td> 
        {/* Previous Claimed */} 
        <td className='border-r-2 text-left'>
          {!isMain && (
            <input
              type="number"
              value={v.prev_qty || ""}
              onChange={(e) =>
                updateField(item.id, "prev_qty", e.target.value, item.parent_id)
              }
               style={{ width: `${String(v.prev_qty || "").length + 3}ch` }}
               className= 'border border-gray-300 px-1 bg-gray-100'
            />
          )}
        </td>
        <td className='border-r-2 text-left'>
          {!isMain && (
            <input
              type="number"
              value={v.prev_amount || ""}
              onChange={(e) =>
                updateField(item.id, "prev_amount", e.target.value, item.parent_id)
              }
               style={{ width: `${String(v.prev_amount || "").length + 3}ch` }}
               className= 'border border-gray-300 px-1 bg-gray-100'
            />
          )}
        </td>
        {/* This month */}
         <td className='border-r-2 text-left'>
          {!isMain && (
            <input
              type="number"
              value={v.month_qty || ""}
              onChange={(e) =>
                updateField(item.id, "month_qty", e.target.value, item.parent_id)
              }
               style={{ width: `${String(v.month_qty || "").length + 3}ch` }}
               className= 'border border-gray-300 px-1 bg-gray-100'
            />
          )}
        </td>
        <td className='border-r-2 text-left'>
          {!isMain && (
            <input
              type="number"
              value={v.month_amount || ""}
              onChange={(e) =>
                updateField(item.id, "month_amount", e.target.value, item.parent_id)
              }
               style={{ width: `${String(v.month_amount || "").length + 3}ch` }}
               className= 'border border-gray-300 px-1 bg-gray-100'
            />
          )}
        </td>
        {/* cumulative */}
        <td className='border-r-2 text-left'>
          {!isMain && (
            <input
              type="number"
              value={v.cumulative_qty || ""}
              onChange={(e) =>
                updateField(item.id, "cumulative_qty", e.target.value, item.parent_id)
              }
               style={{ width: `${String(v.cumulative_qty || "").length + 3}ch` }}
               className= 'border border-gray-300 px-1 bg-gray-100'
            />
          )}
        </td>
        <td className='border-r-2 text-left'>
          {!isMain && (
            <input
              type="number"
              value={v.cumulative_amount || ""}
              onChange={(e) =>
                updateField(item.id, "cumulative_amount", e.target.value, item.parent_id)
              }
               style={{ width: `${String(v.cumulative_amount || "").length + 3}ch` }}
               className= 'border border-gray-300 px-1 bg-gray-100'
            />
          )}
        </td>
        {/* Remaining Balance */}
         <td className='border-r-2 text-left'>
          {!isMain && (
            <input
              type="number"
              value={v.remaining_qty || ""}
              onChange={(e) =>
                updateField(item.id, "remaining_qty", e.target.value, item.parent_id)
              }
               style={{ width: `${String(v.remaining_qty || "").length + 3}ch` }}
               className= 'border border-gray-300 px-1 bg-gray-100'
            />
          )}
        </td>
        <td className='border-r-2 text-left'>
          {!isMain && (
            <input
              type="number"
              value={v.remaining_amount || ""}
              onChange={(e) =>
                updateField(item.id, "remaining_amount", e.target.value, item.parent_id)
              }
               style={{ width: `${String(v.remaining_amount || "").length + 3}ch` }}
               className= 'border border-gray-300 px-1 bg-gray-100'
            />
          )}
        </td>
      </tr>

      {item.children?.map((child) => (
        <Row
          key={child.id}
          item={child}
          level={level + 1}
          updateField={updateField}
        />
      ))}
    </>
  );
});

const BudgetComponentTable = (props) => {
    const {items, setItems} = props 
   
  
// renumber 
const renumber = (list) =>{ 
  return list.map((item, i) => {
  const newCode = `${i + 1 }`; 
  const children =  item.children.map((child, i)=> ({
    ...child, 
    code: `${newCode}.${i + 1}`
  }));
   return { 
    ...item, 
    code: newCode, 
    children
   };
})
}

    //add Main 
    const addMain = () => { 
      const nextNumber = items.length + 1  
      const NewItem = { 
        code : `${nextNumber}`, 
        description: "", 
        level: 1 , 
        parent_id : null , 
        children: [] , 
        values : { }
      }
      setItems([...items, NewItem]); 
    }

  useEffect(()=>{
     console.log(items); 
  }, [])
   const addSub = (parentId) => { 
    const update = items.map(item => { 
      if(item.id === parentId ) { 
        const nextSub = item.children.length  + 1; 
        const newChild = { 
           code: `${item.code}.${nextSub}`, 
           description: "", 
           level: 2 , 
           parent_id : item.id, 
           children: [], 
           values: {}
        }; 
        return { 
          ...item, 
          children : [...item.children, newChild]
        }; 
      }
        return item
    }); 
    setItems(renumber(update)); 
   } 


   //update 
const updateField = (id, field, value, parent_id = null) => {
  const applyUpdate = (obj) => {
    if (field === "description") {
      return { ...obj, description: value };
    }

    return {
      ...obj,
      values: {
        ...obj.values,
        [field]: value,
      },
    };
  };

  const update = items.map((item) => {
    // MAIN ITEM
    if (item.id === id) {
      return applyUpdate(item);
    }

    // CHILD ITEM
    if (item.id === parent_id) {
      return {
        ...item,
        children: item.children.map((child) =>
          child.id === id ? applyUpdate(child) : child
        ),
      };
    }

    return item;
  });

  setItems(update);
};
   //dlete 
   const deleteItem = (id , parentId = null ) => { 
    let update; 
    if(!parentId){ 
      update = items.filter(i => i.id !== id)
    }else {
       update = items.map(item => { 
        if(item.id === parentId){
          return { 
            ...item, 
            children: 
            item.children.filter(c=> c.id !== id)
          }; 
        }
         return item
       })
    }
    setItems(renumber(update)); 
   }

  return (
    <div className='overflow-x-auto'> 
       <table   cellPadding={5} className='border border-collapse w-full border-black '>
            <thead>
                {/* GROUP HEADERS */}
          <tr>
            <th className='bg-black text-white border border-white' rowSpan="2">SN</th>
            <th className='bg-black text-white border border-white' rowSpan="2">Description</th>
            <th className='bg-black text-white border border-white' colSpan="4">Approved</th>
            <th className='bg-black text-white border border-white' colSpan="3">Modified Cost</th>
            <th className='bg-black text-white border border-white' colSpan="2">Previous Claimed</th>
            <th className='bg-black text-white border border-white'colSpan="2">This Month</th>
            <th className='bg-black text-white border border-white' colSpan="2">Cumulative Claimed</th>
            <th className='bg-black text-white border border-white' colSpan="2">Remaining Balance</th>
          </tr>

          {/* SUB HEADERS */}
          <tr>
            {/* Approved */}
            <th className='bg-black text-white border border-white'>Unit</th>
            <th className='bg-black text-white border border-white'>Rate</th>
            <th className='bg-black text-white border border-white'>Qty</th>
            <th className='bg-black text-white border border-white'>Amount</th>

            {/* Revision */}
            <th className='bg-black text-white border border-white'>Rate</th>
            <th className='bg-black text-white border border-white'>Qty</th>
            <th className='bg-black text-white border border-white'>Cost</th>

            {/* Previous */}
            <th className='bg-black text-white border border-white'>Qty</th>
            <th className='bg-black text-white border border-white'>Amount</th>

            {/* This Month */}
            <th className='bg-black text-white border border-white'>Qty</th>
            <th className='bg-black text-white border border-white'>Amount</th>

            {/* Cumulative */}
            <th className='bg-black text-white border border-white'>Qty</th>
            <th className='bg-black text-white border border-white'>Amount</th>
            
            {/* Remaining */}
            <th className='bg-black text-white border border-white'>Qty</th>
            <th className='bg-black text-white border border-white'>Amount</th>
           
          </tr>

            </thead>
            <tbody>
            {items.map((item) => (
             <Row key={item.id} item={item} updateField={updateField} />
             ))}
           </tbody>

       </table>
    </div>
  )
}

export default BudgetComponentTable