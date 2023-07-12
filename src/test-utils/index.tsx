import { ReactElement, FC } from "react";
import {
  RouteObject,
  RouterProvider,
  createMemoryRouter,
} from "react-router-dom";
import {
  render as rtlRender,
  RenderOptions,
  RenderResult,
} from "@testing-library/react";
import { Provider } from "react-redux";
import store from "@/app/store";
import NotFound from "@/pages/404";

type CustomRenderOptions = {
  routeHistory?: Array<string>;
  routeObject?: Array<RouteObject>;
  initialRouteIndex?: number;
  renderOptions?: Omit<RenderOptions, "wrapper">;
};

function render(
  ui: ReactElement,
  {
    routeObject,
    routeHistory,
    initialRouteIndex,
    ...renderOptions
  }: CustomRenderOptions,
): RenderResult {
  const Wrapper: FC = () => {
    const routes: RouteObject[] = [
      {
        path: "*",
        element: <NotFound />,
      },
    ];
    const routeObjects = routeObject || routes;
    const router = createMemoryRouter(routeObjects, {
      initialEntries: routeHistory,
      initialIndex: initialRouteIndex,
    });

    return (
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );
  };

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from "@testing-library/react";
// override the render method
export { render };
