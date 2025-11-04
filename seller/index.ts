import express from 'express';
import { paymentMiddleware, RoutesConfig } from 'x402-express';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const port = process.env.PORT || 3000;
const privateSellerKey = process.env.PRIVATE_SELLER_KEY;
if(!privateSellerKey) {
  throw new Error("PRIVATE_SELLER_KEY is not set");
}

const privateFacilitatorKey = process.env.PRIVATE_FACILITATOR_KEY;
if(!privateFacilitatorKey) {
  throw new Error("PRIVATE_FACILITATOR_KEY is not set");
}

const privateNetwork = process.env.PRIVATE_NETWORK;
if(!privateNetwork) {
  throw new Error("PRIVATE_NETWORK is not set");
}

app.use(paymentMiddleware(`0x${privateSellerKey}` , {
  "GET /hello": {
    price: "0.0001",
    network: privateNetwork as any,
  }, 
 },
 {
  url: privateFacilitatorKey as `${string}://${string}`,
 }
))

// Healthcheck endpoint (no payment required)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/hello", (req, res) => {
  res.json({ message: "Hello World seller" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});