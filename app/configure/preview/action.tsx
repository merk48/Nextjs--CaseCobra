"use server";

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import db from "@/db";
import { Order } from "@/lib/generated/prisma/client";
import { stripe } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const createCheckoutSession = async ({
  configId,
}: {
  configId: string;
}) => {
  console.log("configId: ", configId);
  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  });
  console.log("config onj: ", configuration);
  if (!configuration) throw new Error("No such configuration found");

  const { getUser } = getKindeServerSession();

  const user = await getUser();

  console.log("configuration ID: ", configuration?.id);
  console.log("user ID: ", user?.id);

  if (!user) {
    throw new Error("You need to be logged in");
  }

  const { finish, material } = configuration;

  let price = BASE_PRICE;

  if (finish === "textured") price += PRODUCT_PRICES.finish.textured;

  if (material === "polycarbonate")
    price += PRODUCT_PRICES.material.polycarbonate;

  let order: Order | undefined = undefined;

  console.log("before fetch order");

  const existingOrder = await db.order.findFirst({
    where: {
      userId: user.id,
      configurationId: configuration.id,
    },
  });
  // const existingOrder = {
  //   id: "cmizvdha3000c0kvte0s9d8k1",
  //   configurationId: "cmizuqw4q00000kvtodrvjix6",
  //   userId: "kp_4a87409d0a8e4071ad7c309835cb54fb",
  //   amount: 19,
  //   isPaid: false,
  //   status: "awaiting_shipment",
  //   shippingAddressId: null,
  //   billingAddressId: null,
  //   createdAt: "2025-12-10T10:31:45.339Z",
  //   updated: "2025-12-10T10:31:45.339Z",
  // };
  console.log("after fetch order and existingOrder is: ", existingOrder);

  if (existingOrder) {
    console.log("order is exsignti");
    order = existingOrder;
  } else {
    console.log("in create the order");
    order = await db.order.create({
      data: {
        amount: price / 100,
        userId: user.id,
        configurationId: configuration.id,
      },
    });
  }
  console.log("after if else: ", existingOrder);

  const product = await stripe.products.create({
    name: "Custom iPhone Case",
    images: [configuration.imageUrl],
    default_price_data: {
      currency: "USD",
      unit_amount: price,
    },
  });
  console.log("product: ", product);

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}}`,
    payment_method_types: ["card"],
    mode: "payment",
    shipping_address_collection: { allowed_countries: ["DE", "US"] },
    metadata: {
      userId: user.id,
      orderId: order.id,
    },
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  });
  console.log("stripeSession: ", stripeSession);

  return { url: stripeSession.url };
};
