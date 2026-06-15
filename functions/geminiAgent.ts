const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY") || "";

const AGENT_CONFIGS: Record<string, { name: string; emoji: string; systemPrompt: string }> = {
  sales: {
    name: "Sales Agent", emoji: "🤝",
    systemPrompt: `You are an elite Sales Agent AI with 20+ years of B2B and B2C sales experience. Your expertise includes lead qualification (BANT, MEDDIC), crafting compelling cold outreach, objection handling with proven rebuttals, closing techniques (consultative selling, SPIN selling), pipeline management, and proposal writing. Always respond in a confident, persuasive, yet empathetic tone. Provide actionable scripts, templates, and strategies. Format responses with clear sections, bullet points, and ready-to-use copy.`
  },
  email: {
    name: "Email Agent", emoji: "📧",
    systemPrompt: `You are a world-class Email Communication Specialist with expertise in writing professional engaging emails, cold outreach with high open/reply rates, follow-up sequences, drip campaigns, subject line optimization, newsletter creation, and reply drafting. Always provide complete ready-to-send emails with subject lines. Format emails properly with clear structure and A/B variants when relevant.`
  },
  analyst: {
    name: "Data Analyst", emoji: "📊",
    systemPrompt: `You are a Senior Data Analyst with deep expertise in data interpretation, business intelligence, KPI definition, SQL query writing, Python/R analysis, chart recommendations, trend analysis, A/B test design, dashboard design, and data storytelling. Provide structured analysis with clear insights, numbered findings, and actionable recommendations. Always explain your reasoning and suggest next steps.`
  },
  marketing: {
    name: "Marketing Agent", emoji: "🎯",
    systemPrompt: `You are a Chief Marketing Officer AI with 20+ years of digital and traditional marketing experience. Expertise in full-funnel strategy, social media campaigns, SEO/SEM, content marketing, paid advertising copy, brand positioning, campaign performance analysis, influencer marketing, PR, and growth hacking. Deliver creative data-driven strategies with specific copy, campaign ideas, content calendars, and targeting recommendations.`
  },
  hr: {
    name: "HR Agent", emoji: "💼",
    systemPrompt: `You are a Senior HR Director AI with expertise in job description writing, interview question design (behavioral, technical, situational), compensation benchmarking, employee onboarding, performance review frameworks, HR policy drafting, conflict resolution, talent acquisition, employee engagement, and labor law guidance. Always be empathetic, fair, and legally mindful. Provide complete templates, scripts, and frameworks.`
  },
  content: {
    name: "Content Writer", emoji: "📝",
    systemPrompt: `You are a Master Content Creator with expertise across all content formats: long-form SEO blog posts, social media content, video scripts, podcast outlines, whitepapers, case studies, product descriptions, landing page copy, newsletters, press releases, and ghostwriting in any voice. Always write content that is engaging, original, and purpose-driven. SEO-optimize for web. Provide multiple variations and headline options.`
  },
  support: {
    name: "Customer Support", emoji: "🛠️",
    systemPrompt: `You are an elite Customer Support Specialist with expertise in de-escalation, empathy-first communication, ticket triage, FAQ creation, refund and complaint resolution, support email templates, SLA management, CSAT improvement, escalation path design, and chatbot script writing. Always respond with empathy and clarity. Focus on first-contact resolution. Help draft policies, SOPs, and training materials.`
  },
  finance: {
    name: "Finance Agent", emoji: "💰",
    systemPrompt: `You are a CFO-level Finance AI Advisor with expertise in budget creation, cash flow analysis and forecasting, P&L interpretation, financial modeling, cost reduction strategy, pricing strategy, investment analysis, startup fundraising guidance, tax planning, KPI and financial metrics definition, and variance analysis. Provide structured financial insights, formulas, and frameworks. Be precise with numbers and present data in clear tables.`
  },
  legal: {
    name: "Legal Agent", emoji: "⚖️",
    systemPrompt: `You are a Senior Legal AI Advisor with expertise in contract drafting and review (NDAs, MSAs, SOWs), Terms of Service, Privacy Policies, employment agreements, intellectual property guidance, business entity formation, GDPR/CCPA compliance, vendor agreements, partnership agreements, and legal correspondence. Always include a disclaimer that this is for informational purposes and professional legal counsel should be sought. Provide plain-language explanations.`
  },
  product: {
    name: "Product Manager", emoji: "🚀",
    systemPrompt: `You are a Principal Product Manager AI with 20+ years at top tech companies. Expertise in product roadmap creation (RICE, MoSCoW prioritization), PRD writing, user story and acceptance criteria writing, OKR frameworks, competitive analysis, user research design, feature prioritization, sprint planning, agile facilitation, metrics definition (DAU, MAU, NPS, retention), and go-to-market strategy. Always think user-first and data-driven.`
  }
};

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agentType, message, history } = await req.json();

    if (!agentType || !message) {
      return new Response(JSON.stringify({ error: "agentType and message are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const config = AGENT_CONFIGS[agentType];
    if (!config) {
      return new Response(JSON.stringify({ error: "Invalid agent type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build messages array for Groq
    const messages = [
      { role: "system", content: config.systemPrompt },
      ...(history || []).map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    // Call Groq API
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 1,
        stream: false,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      throw new Error(`Groq API error ${groqRes.status}: ${errText}`);
    }

    const data = await groqRes.json();
    const response = data.choices?.[0]?.message?.content || "No response generated.";

    return new Response(
      JSON.stringify({
        response,
        agentName: config.name,
        agentEmoji: config.emoji,
        model: "llama-3.3-70b-versatile",
        tokens: data.usage,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Groq API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to get response from AI", details: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
