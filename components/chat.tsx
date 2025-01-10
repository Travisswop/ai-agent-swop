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
  User,
  Bot,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';

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
  const { toast } = useToast()
  
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
			const sourcesHeader = response.headers.get("x-sources");
			const sources = sourcesHeader
				? JSON.parse(Buffer.from(sourcesHeader, "base64").toString("utf8"))
				: [];
			const messageIndexHeader = response.headers.get("x-message-index");
			if (sources.length && messageIndexHeader !== null) {
				setSourcesForMessages({
					...sourcesForMessages,
					[messageIndexHeader]: sources,
				});
			}
		},
    streamProtocol: "text",
		onError: (e) => {
      console.log('🚀 ~ Chat ~ onError ~ e:', e);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e.message,
      });
    },
  });

  // Add function to handle demo prompts
  const handleDemoPrompt = async (prompt: string) => {
    setInput(prompt);
    // Create a synthetic form event
    const syntheticEvent = {
      preventDefault: () => {},
    } as FormEvent<HTMLFormElement>;
    
    // Small delay to ensure input is set
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    // Call sendMessage directly
    await sendMessage(syntheticEvent);
  };

  // Demo prompts data
  const demoPrompts = [
    {
      icon: <ArrowLeftRight className="h-5 w-5 text-blue-500" />,
      text: "Swap USDC to SWOP token",
      prompt: "I want to swap 100 USDC to SWOP tokens. Can you help me with that?",
    },
    {
      icon: <Coins className="h-5 w-5 text-green-500" />,
      text: "Send Token",
      prompt: "I want to send 50 SWOP tokens to 0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    },
    {
      icon: <Square className="h-5 w-5 text-purple-500" />,
      text: "Wallet Address",
      prompt: "Show me my wallet address and balance",
    },
  ];

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
              <Bot className="w-full h-full p-3 text-blue-500" />
            </div>
            <h1 className="text-xl font-semibold mb-1">
              Hi, I'm SWAI
            </h1>
            <p className="text-sm text-gray-400">Your AI Trading Assistant</p>

            <div className="max-w-2xl w-full mt-8">
              <p className="text-center text-sm text-gray-400 mb-6">Try these examples:</p>
              <div className="grid grid-cols-1 gap-2">
                {demoPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleDemoPrompt(prompt.prompt)}
                    className="w-full bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#333333] rounded-lg p-4 transition-all duration-200 flex items-center group text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#2A2A2A] group-hover:bg-[#333333] flex items-center justify-center flex-shrink-0 transition-colors">
                      {prompt.icon}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-[15px] font-medium text-gray-200">{prompt.text}</h3>
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{prompt.prompt}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-4 ${
                  message.role === 'user'
                    ? 'flex-row-reverse'
                    : 'flex-row'
                }`}
              >
                <div className="flex-shrink-0">
                  {message.role === 'user' ? (
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-blue-500" />
                    </div>
                  )}
                </div>
                <div
                  className={`flex flex-col space-y-1 ${
                    message.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="text-sm text-gray-400">
                    {message.role === 'user' ? 'You' : 'SWAI'}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-[#2a2a2a]'
                    }`}
                  >
                    <ReactMarkdown className="prose prose-invert">
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {chatEndpointIsLoading && (
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-500" />
                </div>
                <div className="rounded-lg px-4 py-2 bg-[#2a2a2a]">
                  <LoadingDots />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="border-t border-[#2a2a2a] p-4">
          <form
            onSubmit={sendMessage}
            className="relative max-w-4xl mx-auto"
          >
            <div className="relative">
              <textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Message SWAI..."
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
