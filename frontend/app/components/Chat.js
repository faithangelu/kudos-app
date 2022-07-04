import React, { useEffect, useContext, useRef } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import { Link } from "react-router-dom";
import { useImmer } from "use-immer";
import io from "socket.io-client";

const socket = io(window.location.hostname + ":3000");

function Chat() {
  const chatField = useRef(null);
  const chatLog = useRef(null);
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: []
  });

  useEffect(() => {
    if (appState.isChatOpen) {
      chatField.current.focus();
    }
  }, [appState.isChatOpen]);

  useEffect(() => {
    // console.log("chatFromServer 27"); // showing
    socket.on("chatFromServer", function (message) {
      setState(draft => {
        draft.chatMessages.push(message);
      });
      console.log("chatFromServer 32"); // not showing
    });
    socket.on("connect_error", err => {
      console.log(`connect_error due to ${err.message}`);
    });
  });

  function handleFieldChange(e) {
    const value = e.target.value;
    setState(draft => {
      draft.fieldValue = value;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // send message to chat server
    socket.emit("chatFromBrowser", {
      message: state.fieldValue,
      token: appState.user.token
    });
    console.log("handle submit log");

    setState(draft => {
      // Add message to state collectiom
      draft.chatMessages.push({
        message: draft.fieldValue,
        username: appState.user.username,
        avatar: appState.user.avatar
      });
      draft.fieldValue = "";
    });
  }

  return (
    <div
      id="chat-wrapper"
      className={
        "chat-wrapper shadow border-top border-left border-right " +
        (appState.isChatOpen ? "chat-wrapper--is-visible" : "")
      }
    >
      <div className="chat-title-bar bg-primary">
        Chat
        <span
          onClick={() => appDispatch({ type: "closeChat" })}
          className="chat-title-bar-close"
        >
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {state.chatMessages.map((message, index) => {
          if (message.username == appState.user.username) {
            return (
              <div className="chat-self" key={`chat-messages-${index}`}>
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={message.avatar} />
              </div>
            );
          }

          return (
            <div key={index} className="chat-other">
              <a href="#">
                <img className="avatar-tiny" src={message.avatar} />
              </a>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <a href="#">
                    <strong>{message.username}:</strong>
                  </a>
                  {message.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        id="chatForm"
        className="chat-form border-top"
      >
        <input
          ref={chatField}
          onChange={handleFieldChange}
          value={state.fieldValue}
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
        />
      </form>
    </div>
  );
}

export default Chat;
