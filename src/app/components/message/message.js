const Message = () => (
    <div className='message' aria-label="Warning Message">
      <div className="message__icon" aria-hidden="true">
        <img src="https://www.johnlewis.com/static/ui-assets/hashed/icons-jb/warning/warning-32px-filled-yellow.be6f3ce4.svg" alt="Warning Icon" width="32" height="32" aria-hidden="false" aria-label="Warning Icon" />
      </div>
      <div className="message__content">
        <h2 className="message__title">Security notice</h2>
        <div className="message__body">
          <p>To keep you safe, your bank or credit card provider may ask you to confirm the payment by sending you a code by text, email or banking app. They will never ask you to share this code with them or anyone.</p>
        </div>
      </div>
    </div>
)

export default Message;