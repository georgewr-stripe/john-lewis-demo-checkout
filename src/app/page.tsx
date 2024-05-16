"use client";

import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./checkoutForm";
import React from "react";
import createCustomerSession from "./functions/create_customer_session";

const stripePromise = loadStripe(
  "pk_test_51M06LGG0XQZfty50XcasI9E15fhmNZ6PoxlzAbkPsmtr8ivTkGsdObzXCO4pxhgGU2EOvn8QQUI1BWYGwUHbpfJC002yRRws0u",
  {
    betas: ["elements_saved_payment_methods_beta_1"],
    apiVersion: "2024-04-10; saved_payment_methods_beta=v1",
  }
);
const options: StripeElementsOptions = {
  mode: "payment",
  amount: 1000,
  currency: "gbp",
  payment_method_types: ["card"], // This will be ignored as we're setting this further down dynamically
  appearance: {
    theme: "flat",
    variables: {
      fontFamily: ' "Gill Sans", sans-serif',
      fontLineHeight: "1.5",
      borderRadius: "0",
      colorBackground: "#fff",
      accessibleColorOnColorPrimary: "#262626",
      accordionItemSpacing: "8px",
    },
    rules: {
      ".Block": {
        backgroundColor: "var(--colorBackground)",
        boxShadow: "none",
        padding: "12px",
      },
      ".AccordionItem": {
        border: "1px solid #d8d8d8",
        fontSize: "16px",
        fontWeight: "400",
        padding: "16px 20px 16px 20px",
      },
      ".AccordionItem--selected": {
        borderColor: "#000",
        color: "#000",
      },
      ".Error": {
        fontSize: "16px",
        fontWeight: "400",
        marginTop: "8px",
      },
      ".Label": {
        color: "#141414",
        fontSize: "16px",
        fontWeight: "400",
        lineHeight: "22px",
        marginBottom: "8px",
        padding: "8px",
      },
      ".Input": {
        backgroundColor: "var(--colorBackground)",
        border: "1px solid #7f7f7f",
        borderRadius: "2px",
        boxShadow: "none",
        padding: "12px",
        width: "100%",
      },
      ".Input:focus": {
        boxShadow: "inset 0 0 0 1px #141414",
        outline: "none",
      },
      ".Input:focus, .Input:hover": {
        borderColor: "#141414",
        borderRadius: "4px",
        borderWidth: "1px",
      },
      ".Input--invalid, .Input--invalid:focus, .Input--invalid:hover": {
        backgroundColor: "var(--colorBackground)",
        borderColor: "#cc1426",
        borderWidth: "1px",
        boxShadow: "none",
      },
      ".Input:disabled, .Input--invalid:disabled": {
        backgroundColor: "var(--colorBackground)",
        color: "lightgray",
      },
    },
  },
};

const Page = () => {
  const [elementOptions, setElementsOptions] =
    React.useState<StripeElementsOptions>();
  const [customerSession, setCustomerSession] = React.useState<string>();

  React.useEffect(() => {
    createCustomerSession().then((result) =>
      setCustomerSession(result.customer_session_client_secret)
    );
  }, []);

  React.useEffect(() => {
    if (customerSession) {
      setElementsOptions((prev) => ({
        ...options,
        // @ts-ignore
        customerSessionClientSecret: customerSession,
        paymentMethodOptions: {
          card: {
            require_cvc_recollection: true,
          },
        },
      }));
    }
  }, [customerSession]);

  if (!elementOptions) {
    return <></>;
  }

  return (
    <Elements options={elementOptions} stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Page;
