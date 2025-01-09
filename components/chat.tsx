'use client';

import { Message } from 'ai';
import { useChat } from 'ai/react';
import { useRef, useState, ReactElement } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { LoadingDots } from '@/components/ui/loading-dots';
import { WalletPanel } from './wallet';
import {
  Coins,
  ImageIcon,
  ArrowLeftRight,
  Sparkles,
  TrendingUp,
  Search,
  Mail,
  Square,
  ArrowUpIcon,
} from 'lucide-react';
import { toast } from './ui/use-toast';

// Define custom Message type that includes tool_calls
interface CustomMessage extends Message {
  tool_calls?: Array<{
    id: string;
    type: string;
    function: {
      name: string;
      arguments: string;
    };
  }>;
}

const API_ENDPOINT = '/api/chat';

export function Chat() {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const [showIntermediateSteps, setShowIntermediateSteps] =
    useState(false);
  const [intermediateStepsLoading, setIntermediateStepsLoading] =
    useState(false);

  const [sourcesForMessages, setSourcesForMessages] = useState<
    Record<string, any>
  >({});

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading: chatEndpointIsLoading,
    setMessages,
  } = useChat({
    api: API_ENDPOINT,
    onResponse(response) {
      const sourcesHeader = response.headers.get('x-sources');
      const sources = sourcesHeader
        ? JSON.parse(
            Buffer.from(sourcesHeader, 'base64').toString('utf8')
          )
        : [];
      const messageIndexHeader =
        response.headers.get('x-message-index');
      if (sources.length && messageIndexHeader !== null) {
        setSourcesForMessages({
          ...sourcesForMessages,
          [messageIndexHeader]: sources,
        });
      }
    },
    onError: (e) => {
      console.log('🚀 ~ Chat ~ onError:', e);
      toast({
        title: 'Error',
        description: e.message,
      });
    },
  });

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (messageContainerRef.current) {
      messageContainerRef.current.classList.add('grow');
    }
    if (!messages.length) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    if (chatEndpointIsLoading ?? intermediateStepsLoading) {
      return;
    }
    if (!showIntermediateSteps) {
      handleSubmit(e);
      // Some extra work to show intermediate steps properly
    } else {
      setIntermediateStepsLoading(true);
      setInput('');
      const messagesWithUserReply = messages.concat({
        id: messages.length.toString(),
        content: input,
        role: 'user',
      });
      setMessages(messagesWithUserReply);
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({
          messages: messagesWithUserReply,
          show_intermediate_steps: true,
        }),
      });
      const json = await response.json();
      console.log('🚀 ~ sendMessage ~ json:', json);
      setIntermediateStepsLoading(false);
      if (response.status === 200) {
        const responseMessages = json.messages as CustomMessage[];
        // Represent intermediate steps as system messages for display purposes
        // TODO: Add proper support for tool messages
        const toolCallMessages = responseMessages.filter(
          (responseMessage: CustomMessage) => {
            return (
              (responseMessage.role === 'assistant' &&
                !!responseMessage.tool_calls?.length) ||
              responseMessage.role === 'assistant'
            );
          }
        );
        const intermediateStepMessages = [];
        for (let i = 0; i < toolCallMessages.length; i += 2) {
          const aiMessage = toolCallMessages[i];
          const toolMessage = toolCallMessages[i + 1];
          intermediateStepMessages.push({
            id: (messagesWithUserReply.length + i / 2).toString(),
            role: 'system' as const,
            content: JSON.stringify({
              action: aiMessage.tool_calls?.[0],
              observation: toolMessage.content,
            }),
          });
        }
        const newMessages = messagesWithUserReply;
        for (const message of intermediateStepMessages) {
          newMessages.push(message);
          setMessages([...newMessages]);
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 + Math.random() * 1000)
          );
        }
        setMessages([
          ...newMessages,
          {
            id: newMessages.length.toString(),
            content:
              responseMessages[responseMessages.length - 1].content,
            role: 'assistant',
          },
        ]);
      } else {
        if (json.error) {
          toast({
            title: 'Error',
            description: json.error,
            variant: 'destructive',
          });
        }
      }
    }
  }

  return (
    <div className="flex flex-1">
      <div className="flex-1 flex flex-col h-screen bg-[#1a1a1a] text-white">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="w-16 h-16 rounded-lg bg-[#2a2a2a] mb-4 overflow-hidden">
              <img
                src="/placeholder.svg?height=64&width=64"
                alt="Agent Griffain"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-xl font-semibold mb-1">
              Hi, I'm Agent Griffain
            </h1>
            <p className="text-sm text-gray-400">How can I help?</p>

            <div className="max-w-2xl w-full mt-8 space-y-3">
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant="outline"
                  className="bg-[#2a2a2a] border-[#3a3a3a] hover:bg-[#3a3a3a] rounded-2xl px-6 py-3 transition-colors duration-200"
                >
                  <Coins className="h-4 w-4 mr-2" />
                  Tokens
                </Button>
                <Button
                  variant="outline"
                  className="bg-[#2a2a2a] border-[#3a3a3a] hover:bg-[#3a3a3a] rounded-2xl px-6 py-3 transition-colors duration-200"
                >
                  <Square className="h-4 w-4 mr-2" />
                  NFTs
                </Button>
                <Button
                  variant="outline"
                  className="bg-[#2a2a2a] border-[#3a3a3a] hover:bg-[#3a3a3a] rounded-2xl px-6 py-3 transition-colors duration-200"
                >
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  Swap
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-[#2a2a2a]'
                      : 'bg-[#2a2a2a]'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {chatEndpointIsLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-2 bg-[#383838]">
                  <LoadingDots />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input form */}
        <div className="border-t border-[#2a2a2a] p-4">
          <form
            onSubmit={sendMessage}
            className="relative max-w-4xl mx-auto"
          >
            <div className="relative">
              <textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Message ChatGPT..."
                rows={1}
                className="w-full px-4 py-4 pr-20 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none overflow-hidden min-h-[60px] max-h-[200px]"
                style={{
                  height: 'auto',
                  minHeight: '60px',
                  maxHeight: '200px',
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(
                    target.scrollHeight,
                    200
                  )}px`;
                }}
              />
              <div className="absolute right-2 bottom-2 flex items-center space-x-2">
                <button
                  type="submit"
                  disabled={chatEndpointIsLoading || !input.trim()}
                  className="p-2 hover:bg-[#3a3a3a] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowUpIcon className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
