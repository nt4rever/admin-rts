import { ROLES } from "@/constants/role";
import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import FireIcon from "@heroicons/react/24/solid/FireIcon";
import MapIcon from "@heroicons/react/24/solid/MapIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import { SvgIcon } from "@mui/material";
import NewspaperIcon from "@heroicons/react/24/solid/NewspaperIcon";

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
    title: "Reports",
    path: "/reports",
    icon: (
      <SvgIcon fontSize="small">
        <FireIcon />
      </SvgIcon>
    ),
  },
  {
    role: [ROLES.Admin],
    title: "Posts",
    path: "/posts",
    icon: (
      <SvgIcon fontSize="small">
        <NewspaperIcon />
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
];

export const getItems = (role) => items.filter((item) => item.role.includes(role));
