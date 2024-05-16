import Stripe from "stripe";
const STRIPE_SK =
  "sk_test_51M06LGG0XQZfty508Tm07rjgy72dCxk4ZzuLPP7MtCuJ26ViUTGsvQ0jdtgeOxEceEoLA9GWwMS4OwRgzZviTmj7004zVDumFf";

const stripe = new Stripe(STRIPE_SK, {
  // @ts-ignore
  apiVersion: "2024-04-10; saved_payment_methods_beta=v1;",
});
export default stripe;
