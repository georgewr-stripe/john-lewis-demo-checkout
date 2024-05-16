import stripe from "./stripe";

interface paymentIntentCreateProps {
  amount: number;
  payment_method_types: string[];
}
const createPaymentIntent = async (props: paymentIntentCreateProps) => {
  const customers = await stripe.customers.list();
  const customer = customers.data[0];
  const intent = await stripe.paymentIntents.create({
    currency: "gbp",
    customer: customer.id,
    ...props,
  });
  return { client_secret: intent.client_secret };
};

export default createPaymentIntent;
