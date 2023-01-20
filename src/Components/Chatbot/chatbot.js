import React from "react";
import LexChat from "react-lex-plus";

/**
 * Author: Sangramsinh more
 * The below code is implemented to render the lex chatbot UI
 * This code is referenced from [7].
 */

function chatbot() {
  return (
    <LexChat
      botName="custChat"
      IdentityPoolId="us-east-1:f248560c-b1b8-4b2f-83ed-63bc00576ade"
      placeholder="Placeholder text"
      backgroundColor="#121212"
      height="430px"
      region="us-east-1"
      headerText="Hi, Have Any Questions?"
      headerStyle={{ backgroundColor: "grey", fontSize: "30px" }}
      greeting={"Hello, how can I help?"}
    />
  );
}

export default chatbot;
