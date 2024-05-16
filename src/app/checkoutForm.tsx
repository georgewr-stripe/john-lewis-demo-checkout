"use client";

import React, { useEffect, useState } from "react";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  ExpressCheckoutElement,
  PaymentElement,
  PaymentElementProps,
  PaymentRequestButtonElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import Message from "./components/message/message";
import TermsAndConditions from "./components/terms-and-conditions/terms-and-conditions";
import BasketTotals from "./components/basket-totals/basket-totals";
import BillingAddress from "./components/billing-address/billing-address";
import {
  CanMakePaymentResult,
  PaymentRequest,
  StripeError,
  StripePaymentElement,
  StripePaymentElementChangeEvent,
  StripePaymentElementOptions,
} from "@stripe/stripe-js";
import createPaymentIntent from "./functions/create_payment_intent";
import createCustomerSession from "./functions/create_customer_session";

// const CARD_ELEMENT_OPTIONS = {
//   classes: {
//     base: "inputElement",
//     focus: "inputElementFocus",
//     invalid: "inputElementInvalid",
//   },
//   style: {
//     base: {
//       iconColor: "#666EE8",
//       color: "#141414",
//       fontFamily:
//         "GillSansforJL, Gill Sans, Gill Sans MT, GillSansMTStd-Medium, Avenir, Corbel, Arial, Helvetica, sans-serif",
//       fontSmoothing: "antialiased",
//       fontSize: "16px",
//       fontWeight: "400",
//       "::placeholder": {
//         color: "#6b6b6b",
//       },
//       lineHeight: "48px",
//     },
//     invalid: {
//       color: "#cc1426",
//       iconColor: "#cc1426",
//     },
//   },
// };

const paymentElementLayout: StripePaymentElementOptions["layout"] = {
  type: "accordion",
  radios: true,
  spacedAccordionItems: true,
  defaultCollapsed: false,
};

type paymentTypes = "payNow" | "payLater";
const paymentMethodTypes: Record<paymentTypes, string[]> = {
  payNow: ["card", "pay_by_bank"],
  payLater: ["afterpay_clearpay", "paypal"],
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [currentTab, setCurrentTab] =
    React.useState<keyof typeof paymentMethodTypes>("payNow");

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    React.useState<string>("card");

  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (elements && currentTab) {
      elements.update({
        payment_method_types: paymentMethodTypes[currentTab],
      });
    }
  }, [currentTab, elements]);

  const openInitialPaymentMethod = React.useCallback(
    (element: StripePaymentElement) => {
      if (currentTab == "payLater") {
        element.collapse();
      }
    },
    [currentTab]
  );

  const handlePaymentMethodChange = (
    event: StripePaymentElementChangeEvent
  ) => {
    if (event.elementType == "payment") {
      if (event.value.type) {
        setSelectedPaymentMethod(event.value.type);
      }
    }
  };

  const handleError = (error: StripeError) => {
    setLoading(false);
    setErrorMessage(error.message);
  };

  const handleSubmit = React.useCallback(
    async (event: any) => {
      // We don't want to let default form submission happen here,
      // which would refresh the page.
      event.preventDefault();

      if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }

      setLoading(true);

      // Trigger form validation and wallet collection
      const { error: submitError } = await elements.submit();
      if (submitError) {
        handleError(submitError);
        return;
      }

      // Create the PaymentIntent and obtain clientSecret
      const { client_secret: clientSecret } = await createPaymentIntent({
        amount: 1000,
        payment_method_types: paymentMethodTypes[currentTab],
      });
      if (!clientSecret) {
        setErrorMessage("Oops something went wrong");
        return;
      }

      const return_url = window.location;
      return_url.pathname = "success";
      console.log(return_url.toString());
      // Confirm the PaymentIntent using the details collected by the Payment Element
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: return_url.toString(),
        },
      });

      if (error) {
        // This point is only reached if there's an immediate error when
        // confirming the payment. Show the error to your customer (for example, payment details incomplete)
        handleError(error);
      } else {
        // Your customer is redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer is redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
      }
    },
    [currentTab, elements, stripe]
  );

  const payNowPaymentElement = React.useMemo(() => {
    if (currentTab == "payNow") {
      return (
        <PaymentElement
          options={{ layout: paymentElementLayout }}
          onReady={openInitialPaymentMethod}
          onChange={handlePaymentMethodChange}
        />
      );
    }
    return <></>;
  }, [currentTab, openInitialPaymentMethod]);

  const payLaterPaymentElement = React.useMemo(() => {
    if (currentTab == "payLater") {
      return (
        <PaymentElement
          options={{ layout: paymentElementLayout }}
          onReady={openInitialPaymentMethod}
          onChange={handlePaymentMethodChange}
        />
      );
    }
    return <></>;
  }, [currentTab, openInitialPaymentMethod]);

  return (
    <main>
      <section className="content">
        <div className="content-left">
          <div className="payment-titleContainer">
            <h2>2. Payment</h2>
          </div>
          <div className="payment-container">
            <form className="form" onSubmit={handleSubmit}>
              <ul className="tabs">
                <li>
                  <button
                    className={`tab-button ${
                      currentTab === "payNow" && "active"
                    }`}
                    onClick={() => {
                      setCurrentTab("payNow");
                    }}
                    type="button"
                  >
                    Pay Now
                  </button>
                </li>
                <li>
                  <button
                    className={`tab-button ${
                      currentTab !== "payNow" && "active"
                    }`}
                    onClick={() => {
                      setCurrentTab("payLater");
                    }}
                    type="button"
                  >
                    Pay Later
                  </button>
                </li>
              </ul>

              <div className={`tab ${currentTab === "payNow" ? "active" : ""}`}>
                <div className={`container active`}>
                  {selectedPaymentMethod == "card" ? <Message /> : <></>}
                  {payNowPaymentElement}
                  <BillingAddress showDivider={false} />
                  <div className="wrapper"></div>
                  <div className="wrapper">
                    <BasketTotals />
                    {errorMessage && <div>{errorMessage}</div>}
                    <button
                      className="button"
                      disabled={!stripe || loading}
                      type="submit"
                    >
                      Place order and pay
                    </button>
                    <TermsAndConditions />
                  </div>
                </div>
              </div>
              <div className={`tab ${currentTab !== "payNow" ? "active" : ""}`}>
                <div className="container">
                  <div className="paymentElement">
                    {payLaterPaymentElement}
                    {errorMessage && <div>{errorMessage}</div>}
                    <button
                      disabled={!stripe || loading}
                      className="button"
                      type="submit"
                    >
                      Submit Payment
                    </button>
                  </div>
                </div>
              </div>
              {/* 
                <div className='container'>
                  <div className='wrapper'>
                    <ExpressCheckoutElement
                      options={{
                        buttonType: {
                          applePay: 'buy',
                          googlePay: 'buy',
                        },
                        paymentMethodOrder: [
                          'applePay',
                          'googlePay',
                        ],
                      }}
                      onClick={onClick}
                      onConfirm={onConfirm}
                      onReady={onReady}
                    />
                  </div>
                </div> 
              */}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CheckoutForm;
