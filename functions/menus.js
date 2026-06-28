export default function Menus(role) {
  // list of menus
  const allMenu = [
    {
      label: "Dashboard",
      icon: "□",
      section: "menu",
      path: "/Main/Home",
    },
    {
      label: "Purchase Requisition Form",
      icon: "□",
      section: "menu",
      path: "/Main/Purchase/Requisition",
    },
    {
      label: "Vouchers",
      icon: "□",
      section: "menu",
      path: "/Main/Vouchers",
    },
    {
      label: "Budget Confirmation",
      icon: "□",
      section: "menu",
      path: "/Main/BudgetConfirmation",
    },

    {
      label: "Submitted Requisition",
      icon: "□",
      section: "menu",
      hasDropdown: true,
      subItem: [
        {
          label: "Budget Confirmation",
          icon: "□",
          path: "/Main/SubmittedRequisition/BudgetConfirmation",
        },
        {
          label: "Approved Purchase Requesition",
          icon: "□",
          path: "/Main/SubmittedRequisition/ApprovedPurchaseRequisition",
        },
      ],
    },
    //  Reimbursable
    {
      label: "Summaries",
      icon: "□",
      section: "menu",
      path: "/Main/Summaries",
    },
    {
      label: "BIR 2307",
      icon: "□",
      section: "menu",
      path: "/Main/bir2307",
    },
    {
      label: "BIR 2307",
      icon: "□",
      section: "menu",
      path: "/Main/bir2307",
    },
    {
      label: "Creditors",
      icon: "□",
      section: "menu",
      path: "/Main/Creditors",
    },

    {
      label: "Logout",
      icon: "□",
      section: "footer",
      path: "/Login",
      hasArrow: true,
    },
  ];
  //
  const roleMenuMap = {
    "Regular Employee": [
      "Dashboard",
      "Purchase Requisition Form",
      // "My Requisition",
      // "Profile"
    ],
    Admin: [
      "Dashboard",
      "Purchase Requisition Form",
      "Requisition List",
      "Vouchers",
      //  "My Requisition",
      //  "Profile",
    ],
    "Chief Accountant": [
      "Dashboard",
      "Purchase Requisition Form",
      "Submitted Requisition",
      "Vouchers",
      "Reimbursable",
    ],
    "Chief Administrator Manager": [
      "Dashboard",
      "Purchase Requisition Form",
      "My Requisition",
      "Requisition List",
      "Vouchers",
      "BIR 2307",
      "Creditors",
      //  "My Requisition",
      //  "Profile",
    ],
    "Project Director": [
      "Dashboard",
      "Purchase Requisition Form",
      "My Requisition",
      "Requisition List",
      //  "My Requisition",
      //  "Profile",
    ],
    SuperAdmin: [
      "Dashboard",
      "Purchase Requisition Form",
      "My Requisition",
      //  "My Requisition",
      //  "User Management",
      //  "Profile"
    ],
  };
  //find specific Role
  const allowedMenus = roleMenuMap[role] || [];

  // map or filterized menu matching
  return allMenu.filter(
    (item) => allowedMenus.includes(item.label) || item.label === "Logout",
  );
}
