import { ROLES } from "@/constants/role";
import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import ShoppingBagIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import MapIcon from "@heroicons/react/24/solid/MapIcon";
import { SvgIcon } from "@mui/material";

export const items = [
  {
    role: [ROLES.Admin, ROLES.AreaManager],
    title: "Overview",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    role: [ROLES.Admin],
    title: "Areas",
    path: "/areas",
    icon: (
      <SvgIcon fontSize="small">
        <MapIcon />
      </SvgIcon>
    ),
  },
  {
    role: [ROLES.Admin],
    title: "Managers",
    path: "/managers",
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },
  {
    role: [ROLES.AreaManager],
    title: "Volunteers",
    path: "/volunteers",
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },
  {
    role: [ROLES.Admin, ROLES.AreaManager],
    title: "Account",
    path: "/account",
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    ),
  },
  // {
  //   role: [ROLES.Admin, ROLES.AreaManager],
  //   title: "Settings",
  //   path: "/settings",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <CogIcon />
  //     </SvgIcon>
  //   ),
  // }
];

export const getItems = (role) => items.filter((item) => item.role.includes(role));
