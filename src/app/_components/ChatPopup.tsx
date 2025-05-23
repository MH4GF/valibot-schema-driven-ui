"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { MessageCircle, X, Send } from "lucide-react";
import { pageSchema, type Page } from "../schema";
import { valibotSchema } from "@ai-sdk/valibot";
import { safeParse } from "valibot";

interface ChatPopupProps {
  setPage: React.Dispatch<React.SetStateAction<Page>>;
}

export default function ChatPopup({ setPage }: ChatPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { object, error, submit, isLoading } = useObject({
    api: "/api/chat",
    schema: valibotSchema(pageSchema),
  });
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when object changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    if (object) {
      const result = safeParse(pageSchema, object);

      if (result.success) {
        setPage(result.output);
      }
    }
  }, [object, setPage]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      submit({ prompt: input });
      setInput("");
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${!isOpen ? "pointer-events-none" : ""}`}>
      {/* Chat popup */}
      <div
        className={`bg-white rounded-lg shadow-2xl w-80 sm:w-96 transition-all duration-300 transform ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{
          maxHeight: "500px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div className="bg-gray-800 text-white p-3 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-medium">AI Assistant</span>
          </div>
          <button
            className="h-8 w-8 text-white hover:bg-gray-700 rounded-full flex items-center justify-center"
            onClick={toggleChat}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Generated Page Object */}
        <div
          className="flex-1 overflow-y-auto p-3 space-y-4"
          style={{ maxHeight: "320px" }}
        >
          {!object ? (
            <div className="text-center text-gray-500 py-6">
              <p>Welcome to the Page Generation Assistant!</p>
              <p>What kind of page would you like to generate?</p>
            </div>
          ) : (
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
              <h3 className="font-medium mb-2">Generated Page</h3>
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(object, null, 2)}
              </pre>
            </div>
          )}
          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded-lg mt-2">
              <p className="font-medium">An error occurred</p>
              <p className="text-sm">{error.message}</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={onSubmit} className="border-t p-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Please describe the page content..."
            className="flex-1 border text-gray-900 rounded-md px-3 py-2 focus:outline-none focus:ring-2"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-gray-800 text-white rounded-full p-2 disabled:opacity-50"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Toggle button */}
      <button
        onClick={toggleChat}
        className={`rounded-full h-14 w-14 shadow-2xl bg-gray-700 text-white flex items-center justify-center ${
          isOpen ? "hidden" : "flex"
        } absolute bottom-0 right-0 pointer-events-auto`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
