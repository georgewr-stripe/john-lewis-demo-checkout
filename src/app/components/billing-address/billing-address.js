const BillingAddress = ({  showDivider }) => (
    <div className={`billing-address ${showDivider ? 'billing-address--has-divider' : ''}`}>
        <h3>Billing Address</h3>
        <p>Title</p>
        <p>Firstname</p>
        <p>Lastname</p>
        <p>...</p>
        <h3>Country</h3>
        <p>United Kingdom <a href="#">Change</a></p>
        <p>Start typing your address or postcode</p>
        <p>...</p>
    </div>
)

export default BillingAddress;