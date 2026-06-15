import React, { useState } from 'react'
import { AGENTS } from '../agents'
import AgentCard from '../components/AgentCard'
import { Sparkles, Zap, Brain } from 'lucide-react'

export default function LandingPage({ onSelectAgent }) {
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-pink-600/8 blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6 text-sm text-white/60">
            <Sparkles size={14} className="text-violet-400" />
            Powered by Google Gemini 2.0 Flash
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            Your AI
            <span className="block bg-gradient-to-r from-violet-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Agent Hub
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            10 elite AI specialists, each trained for a specific role. Pick your agent and get expert-level help — instantly.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8 text-sm">
            {[
              { icon: Brain, label: '10 AI Agents', color: 'text-violet-400' },
              { icon: Zap, label: 'Gemini 2.0 Flash', color: 'text-yellow-400' },
              { icon: Sparkles, label: 'Expert-Level Prompts', color: 'text-pink-400' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-1.5 text-white/40">
                <Icon size={14} className={color} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {AGENTS.map((agent, index) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              index={index}
              isHovered={hoveredId === agent.id}
              onHover={setHoveredId}
              onClick={() => onSelectAgent(agent)}
            />
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-white/20 text-xs mt-12">
          All agents are powered by Gemini 2.0 Flash with expert-crafted system prompts. Not a substitute for professional advice.
        </p>
      </div>
    </div>
  )
}
