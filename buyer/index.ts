import { config } from 'dotenv';
config();

import { 
  wrapFetchWithPayment,
  decodeXPaymentResponse,
  createSigner,
 } from 'x402-fetch';


const privateKey = process.env.PRIVATE_KEY as string;
const privateSellerKey = process.env.PRIVATE_SELLER_KEY as string;
if(!privateSellerKey) {
  throw new Error("PRIVATE_SELLER_KEY is not set");
}
// const privateKey = process.env.PRIVATE_KEY_SOL as string;
if(!privateKey) {
  throw new Error("PRIVATE_KEY is not set");
}

const privateNetwork = process.env.PRIVATE_NETWORK;
if(!privateNetwork) {
  throw new Error("PRIVATE_NETWORK is not set");
}

async function main() {
  const signer = await createSigner(privateNetwork as any, privateKey);
  const fetchWithPayment = wrapFetchWithPayment(globalThis.fetch.bind(globalThis), signer);

  fetchWithPayment(privateSellerKey , {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (response) => { 
    const body = await response.json();
    console.log(body); 

    const paymentResponse = await decodeXPaymentResponse(response.headers.get("x-payment-response") as string);
    console.log(paymentResponse);
  }).catch((error) => {
    console.error(error);
    return null;
  });
}

main();