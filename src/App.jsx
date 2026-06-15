import React, { useState } from 'react'
import LandingPage from './pages/LandingPage'
import ChatPage from './pages/ChatPage'

export default function App() {
  const [selectedAgent, setSelectedAgent] = useState(null)

  return selectedAgent
    ? <ChatPage agent={selectedAgent} onBack={() => setSelectedAgent(null)} />
    : <LandingPage onSelectAgent={setSelectedAgent} />
}
