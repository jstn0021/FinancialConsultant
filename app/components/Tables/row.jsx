import React from "react";

export const Row = React.memo(function Row({ item, level = 0, updateField }) {
  const v = item.values || {};
  const isMain = level === 0;

  return (
    <>
      <tr style={{ fontWeight: isMain ? "bold" : "normal" }} className="text-center">
        <td style={{ paddingLeft: `${level * 20}px` }}>
          {item.code}
        </td>

        <td className="p-1">
          <input
            type="text"
            value={item.description || ""}
            onChange={(e) =>
              updateField(item.id, "description", e.target.value, item.parent_id)
            }
          />
        </td>

        <td>
          {!isMain && (
            <input
              type="text"
              value={v.approved_unit || ""}
              onChange={(e) =>
                updateField(item.id, "approved_unit", e.target.value, item.parent_id)
              }
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


