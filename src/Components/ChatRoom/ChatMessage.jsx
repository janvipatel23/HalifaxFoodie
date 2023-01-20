/**
 * Author: Sangramsinh more
 * Implemented the component of message
 */

export default function ChatMessage({ CUser, message }) {
  const { text: msgText, sentBy: megSentBy } = message;
  if (megSentBy === "restaurant") {
    messageClass = CUser.role === "restaurant" ? "sent" : "received";
  } else {
    messageClass = megSentBy === CUser.email ? "sent" : "received";
  }

  return (
    <div>
      <img />
      <p>{msgText}</p>
    </div>
  );
}
