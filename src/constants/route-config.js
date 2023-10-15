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
    [RouteNames.customers]: RouteNames.customers,
    [RouteNames.companies]: RouteNames.companies,
    [RouteNames.settings]: RouteNames.settings,
  },
  [ROLES.AreaManager]: {
    default: RouteNames.index,
    [RouteNames.index]: RouteNames.index,
    [RouteNames.account]: RouteNames.account,
  },
};

export default routeConfig;
