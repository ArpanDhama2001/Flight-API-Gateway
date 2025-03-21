const express = require("express");
const rateLimit = require("express-rate-limit");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { ServerConfig } = require("./config");
const apiRoutes = require("./routes");

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 2 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiter);

// Creating Proxy
app.use(
    "/flightsService",
    createProxyMiddleware({
        target: ServerConfig.FLIGHT_SERVICE,
        changeOrigin: true,
        pathRewrite: { "^/flightsService": "/" },
    })
);
app.use(
    "/bookingService",
    createProxyMiddleware({
        target: ServerConfig.BOOKING_SERVICE,
        changeOrigin: true,
    })
);

app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Server is listening on port ${ServerConfig.PORT}`);
});
