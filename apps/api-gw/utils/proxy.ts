import { createProxyMiddleware } from "http-proxy-middleware";
import { Express } from "express";
import { routeTable, RouteConfig } from "../routes.config";
import { authenticate } from "../middleware/auth";

export const applyProxyRoutes = (app: Express) => {
  routeTable.forEach(({ path, target }: RouteConfig) => {
    app.use(
      path,
      authenticate,
      createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: { [`^${path}`]: "" },
        on: {
          proxyReq: (proxyReq, req, res) => {
            const userId = (req as any).user?.id;
            if (userId) {
              proxyReq.setHeader("x-user-id", userId);
            }
          },
        },
      })
    );
  });
};
