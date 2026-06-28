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
      label: "User Management",
      icon: "□",
      section: "menu",
      path: "/Main/UserManagement",
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
      "Vouchers",
      "Submitted Requisition",
      "Summaries",
      "BIR 2307",
      "Creditors",
      "User Management",
    ],
  };
  //find specific Role
  const allowedMenus = roleMenuMap[role] || [];

  // map or filterized menu matching
  return allMenu.filter(
    (item) => allowedMenus.includes(item.label) || item.label === "Logout",
  );
}
export function getAllowedPaths(role) {
  const rolePathMap = {
    "Regular Employee": [
      "/Main/Home",
      "/Main/Purchase/Requisition",
      "/Main/Purchase/MyRequisition",
    ],
    Admin: [
      "/Main/Home",
      "/Main/Purchase/Requisition",
      "/Main/Purchase/MyRequisition",
      "/Main/Vouchers",
    ],
    "Chief Accountant": [
      "/Main/Home",
      "/Main/Purchase/Requisition",
      "/Main/SubmittedRequisition",
      "/Main/Vouchers",
    ],
    "Chief Administrator Manager": [
      "/Main/Home",
      "/Main/Purchase/Requisition",
      "/Main/Purchase/MyRequisition",
      "/Main/Vouchers",
      "/Main/bir2307",
      "/Main/Creditors",
    ],
    "Project Director": [
      "/Main/Home",
      "/Main/Purchase/Requisition",
      "/Main/Purchase/MyRequisition",
    ],
    SuperAdmin: [
      "/Main/Home",
      "/Main/Purchase/Requisition",
      "/Main/Purchase/MyRequisition",
      "/Main/Vouchers",
      "/Main/bir2307",
      "/Main/Creditors",
      "/Main/Summaries",
      "/Main/SubmittedRequisition",
      "/Main/UserManagement",
    ],
  };

  return rolePathMap[role] || ["/Main/Home"];
}
