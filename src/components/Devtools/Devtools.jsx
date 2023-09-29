import { Suspense, lazy } from "react";

const ReactQueryDevtoolsProduction = lazy(() =>
  import("@tanstack/react-query-devtools").then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

const DevTools = () => {
  return (
    <Suspense fallback={null}>
      <ReactQueryDevtoolsProduction position="bottom-right" />
    </Suspense>
  );
};

export default DevTools;
