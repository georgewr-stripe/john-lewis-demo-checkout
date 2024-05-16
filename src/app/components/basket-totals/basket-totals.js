const BasketTotals = () => (
  <>
    <div className="order-totals order-totals-basket-totals">
      <span>Basket total</span>
      <span className="order-totals_basketTotals">£10.00</span>
    </div>
    <div className="order-totals order-totals-delivery">
      <span>Collection charge</span>
      <span>FREE</span>
    </div>
    <div className="order-totals order-totals-balance">
      <span className="order-totals_outstandingBalanceLabel">Order total</span>
      <span>£10.00</span>
    </div>
  </>
)

export default BasketTotals;