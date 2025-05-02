import { createProxyMiddleware } from "http-proxy-middleware";
import { Express } from "express";
import { routeTable, RouteConfig } from "../routes.config";

export const applyProxyRoutes = (app: Express) => {
  routeTable.forEach(({ path, target }: RouteConfig) => {
    app.use(
      path,
      createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: (pathReq: string) => pathReq.replace(path, ""),
        onProxyReq: (proxyReq: any, req: any) => {
          const userId = (req as any).user?.id;
          if (userId) {
            proxyReq.setHeader("x-user-id", userId);
          }
        },
      } as any)
    );
  });
};
