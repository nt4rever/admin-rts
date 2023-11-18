import { ROLES } from "./role";
import RouteNames from "./route-name";

const routeConfig = {
  auth: {
    default: RouteNames.login,
    [RouteNames.login]: RouteNames.login,
  },
  [ROLES.Admin]: {
    default: RouteNames.index,
    [RouteNames.index]: RouteNames.index,
    [RouteNames.account]: RouteNames.account,
    [RouteNames.managers]: RouteNames.managers,
    [RouteNames.managersEdit]: RouteNames.managersEdit,
    [RouteNames.areas]: RouteNames.areas,
  },
  [ROLES.AreaManager]: {
    default: RouteNames.index,
    [RouteNames.index]: RouteNames.index,
    [RouteNames.account]: RouteNames.account,
  },
};

export default routeConfig;
