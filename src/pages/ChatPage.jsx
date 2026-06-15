import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft, Send, RotateCcw, Sparkles, Copy, Check } from 'lucide-react'
import { AGENTS } from '../agents'

// ── Replace with your deployed Base44 backend function URL ──
const API_URL = 'https://api.base44.com/api/apps/6a2f7a64853ac938f55fb360/functions/geminiAgent'

export default function ChatPage({ agent, onBack }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hey! I'm your **${agent.name}** 👋\n\nI'm powered by Google Gemini 2.0 Flash and ready to help you with:\n${agent.capabilities.map(c => `- ${c}`).join('\n')}\n\nWhat can I help you with today?`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const userMessage = { role: 'user', content: trimmed }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const history = newMessages.slice(0, -1) // exclude latest user msg
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: agent.id,
          message: trimmed,
          history: history,
        }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || data.error || 'Sorry, something went wrong.' }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Network error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleReset = () => {
    setMessages([{
      role: 'assistant',
      content: `Hey! I'm your **${agent.name}** 👋\n\nI'm powered by Google Gemini 2.0 Flash and ready to help you with:\n${agent.capabilities.map(c => `- ${c}`).join('\n')}\n\nWhat can I help you with today?`,
    }])
  }

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-20"
          style={{ background: agent.accent }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[300px] h-[300px] rounded-full blur-[100px] opacity-10"
          style={{ background: agent.accent }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/8 bg-black/30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-all"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg"
              style={{ background: `linear-gradient(135deg, ${agent.accent}33, ${agent.accent}66)`, border: `1px solid ${agent.accent}44` }}
            >
              {agent.emoji}
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{agent.name}</div>
              <div className="text-xs text-white/30">{agent.tagline}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 bg-white/5 border border-white/8 rounded-full px-3 py-1 text-xs text-white/30">
            <Sparkles size={10} className="text-violet-400" />
            Gemini 2.0 Flash
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-all"
            title="Reset conversation"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </header>

      {/* Capability pills */}
      <div className="relative z-10 px-4 sm:px-6 py-2 flex gap-2 overflow-x-auto border-b border-white/5 bg-black/20 backdrop-blur-sm hide-scrollbar">
        {agent.capabilities.map(cap => (
          <button
            key={cap}
            onClick={() => setInput(cap + '...')}
            className="shrink-0 text-xs text-white/30 bg-white/5 hover:bg-white/10 hover:text-white/60 border border-white/8 rounded-full px-3 py-1 transition-all whitespace-nowrap"
          >
            {cap}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5 relative z-10">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div
                className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm mt-0.5"
                style={{ background: `linear-gradient(135deg, ${agent.accent}22, ${agent.accent}44)`, border: `1px solid ${agent.accent}33` }}
              >
                {agent.emoji}
              </div>
            )}

            <div className={`relative max-w-[80%] group ${msg.role === 'user' ? 'order-first' : ''}`}>
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'text-white rounded-tr-sm'
                    : 'bg-white/5 border border-white/8 text-white/85 rounded-tl-sm'
                }`}
                style={msg.role === 'user' ? { background: `linear-gradient(135deg, ${agent.accent}cc, ${agent.accent}99)` } : {}}
              >
                {msg.role === 'assistant' ? (
                  <div className="prose-chat">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>

              {/* Copy button for assistant messages */}
              {msg.role === 'assistant' && (
                <button
                  onClick={() => handleCopy(msg.content, i)}
                  className="absolute top-2 right-2 p-1 rounded-md bg-white/0 hover:bg-white/10 text-white/0 group-hover:text-white/30 hover:!text-white/60 transition-all"
                >
                  {copiedId === i ? <Check size={12} /> : <Copy size={12} />}
                </button>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="shrink-0 w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold text-white/60 mt-0.5">
                U
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-3 animate-slide-up">
            <div
              className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm"
              style={{ background: `linear-gradient(135deg, ${agent.accent}22, ${agent.accent}44)`, border: `1px solid ${agent.accent}33` }}
            >
              {agent.emoji}
            </div>
            <div className="bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <div className="typing-dot w-1.5 h-1.5 rounded-full bg-white/40" />
                <div className="typing-dot w-1.5 h-1.5 rounded-full bg-white/40" />
                <div className="typing-dot w-1.5 h-1.5 rounded-full bg-white/40" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="relative z-10 px-4 sm:px-6 py-4 border-t border-white/8 bg-black/30 backdrop-blur-md">
        <div className="flex gap-2 items-end max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => {
                setInput(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'
              }}
              onKeyDown={handleKeyDown}
              placeholder={agent.placeholder}
              rows={1}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-4 text-sm text-white placeholder-white/25 resize-none focus:outline-none focus:border-white/20 focus:bg-white/8 transition-all leading-relaxed"
              style={{ maxHeight: '140px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: input.trim() && !loading
                ? `linear-gradient(135deg, ${agent.accent}, ${agent.accent}99)`
                : 'rgba(255,255,255,0.05)',
            }}
          >
            <Send size={15} className="text-white" />
          </button>
        </div>
        <p className="text-center text-white/15 text-[10px] mt-2 max-w-4xl mx-auto">
          Press Enter to send · Shift+Enter for new line · Responses by Gemini 2.0 Flash
        </p>
      </div>
    </div>
  )
}
