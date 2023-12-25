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
    [RouteNames.managersView]: RouteNames.managersView,
    [RouteNames.managersEdit]: RouteNames.managersEdit,
    [RouteNames.managersAdd]: RouteNames.managersAdd,
    [RouteNames.areas]: RouteNames.areas,
    [RouteNames.areasAdd]: RouteNames.areasAdd,
    [RouteNames.areasEdit]: RouteNames.areasEdit,
    [RouteNames.postCategories]: RouteNames.postCategories,
    [RouteNames.posts]: RouteNames.posts,
    [RouteNames.postAdd]: RouteNames.postAdd,
    [RouteNames.postEdit]: RouteNames.postEdit,
    [RouteNames.users]: RouteNames.users,
    [RouteNames.userEdit]: RouteNames.userEdit,
    [RouteNames.pages]: RouteNames.pages,
    [RouteNames.pagesAdd]: RouteNames.pagesAdd,
  },
  [ROLES.AreaManager]: {
    default: RouteNames.index,
    [RouteNames.index]: RouteNames.index,
    [RouteNames.account]: RouteNames.account,
    [RouteNames.volunteers]: RouteNames.volunteers,
    [RouteNames.volunteersView]: RouteNames.volunteersView,
    [RouteNames.volunteersEdit]: RouteNames.volunteersEdit,
    [RouteNames.volunteersAdd]: RouteNames.volunteersAdd,
    [RouteNames.reports]: RouteNames.reports,
    [RouteNames.reportsEdit]: RouteNames.reportsEdit,
  },
};

export default routeConfig;
