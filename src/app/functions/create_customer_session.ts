import stripe from "./stripe";

const createCustomerSession = async () => {
  const customers = await stripe.customers.list();
  const customer = customers.data[0];

  const customerSession = await stripe.customerSessions.create({
    customer: customer.id,
    components: {
      // @ts-ignore
      payment_element: {
        enabled: true,
        features: {
          payment_method_save: "enabled",
          payment_method_save_usage: "on_session",
          payment_method_remove: "enabled",
          payment_method_set_as_default: "enabled",
          payment_method_update: "enabled",
        },
      },
    },
  });
  return {
    customer_session_client_secret: customerSession.client_secret,
  };
};

export default createCustomerSession;
