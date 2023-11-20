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
    [RouteNames.managersAdd]: RouteNames.managersAdd,
    [RouteNames.areas]: RouteNames.areas,
  },
  [ROLES.AreaManager]: {
    default: RouteNames.index,
    [RouteNames.index]: RouteNames.index,
    [RouteNames.account]: RouteNames.account,
    [RouteNames.volunteers]: RouteNames.volunteers,
    [RouteNames.volunteersEdit]: RouteNames.volunteersEdit,
    [RouteNames.volunteersAdd]: RouteNames.volunteersAdd,
    [RouteNames.reports]: RouteNames.reports,
    [RouteNames.reportsEdit]: RouteNames.reportsEdit,
  },
};

export default routeConfig;
