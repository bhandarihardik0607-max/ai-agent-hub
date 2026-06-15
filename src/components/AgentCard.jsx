import React from 'react'
import { ArrowRight } from 'lucide-react'

export default function AgentCard({ agent, index, isHovered, onHover, onClick }) {
  return (
    <div
      className={`relative group cursor-pointer rounded-2xl border bg-white/[0.03] backdrop-blur-sm transition-all duration-300 overflow-hidden
        ${agent.border} ${isHovered ? 'scale-[1.02] bg-white/[0.06]' : 'hover:scale-[1.01]'}
      `}
      style={{
        animationDelay: `${index * 60}ms`,
        boxShadow: isHovered ? `0 0 40px ${agent.bgGlow}` : 'none',
      }}
      onMouseEnter={() => onHover(agent.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      {/* Gradient top accent */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${agent.color} opacity-60 group-hover:opacity-100 transition-opacity`} />

      {/* Glow behind emoji */}
      <div
        className="absolute top-4 left-4 w-12 h-12 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
        style={{ background: agent.accent }}
      />

      <div className="relative p-5">
        {/* Emoji + number */}
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl">{agent.emoji}</div>
          <span className="text-xs font-mono text-white/20">#{String(index + 1).padStart(2, '0')}</span>
        </div>

        {/* Name & tagline */}
        <h3 className="text-white font-bold text-base mb-0.5">{agent.name}</h3>
        <p className="text-xs font-medium mb-3" style={{ color: agent.accent }}>{agent.tagline}</p>

        {/* Description */}
        <p className="text-white/40 text-xs leading-relaxed mb-4 line-clamp-2">{agent.description}</p>

        {/* Capabilities */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {agent.capabilities.slice(0, 3).map(cap => (
            <span key={cap} className="text-[10px] text-white/30 bg-white/5 rounded-md px-2 py-0.5 border border-white/5">
              {cap}
            </span>
          ))}
          {agent.capabilities.length > 3 && (
            <span className="text-[10px] text-white/20 bg-white/5 rounded-md px-2 py-0.5 border border-white/5">
              +{agent.capabilities.length - 3} more
            </span>
          )}
        </div>

        {/* CTA */}
        <div
          className={`flex items-center justify-between text-xs font-semibold py-2 px-3 rounded-xl transition-all duration-200
            bg-gradient-to-r ${agent.color} opacity-0 group-hover:opacity-100 text-white`}
        >
          <span>Start chatting</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  )
}
