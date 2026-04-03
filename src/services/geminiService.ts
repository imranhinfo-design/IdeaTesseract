export function getMaskedApiKey(): string {
  return "AI Disabled - Using Local Generation";
}

export interface BusinessPlanStep {
  title: string;
  description: string;
  icon: string;
  imageKeyword: string;
}

export interface ProblemSolution {
  problem: string;
  solution: string;
}

export interface BusinessPlan {
  suggestedNames: string[];
  summary: string;
  brandingStartupAdvice: string;
  steps: BusinessPlanStep[];
  problemsAndSolutions: ProblemSolution[];
  industryReferences: string[];
  governmentHelp: string[];
}

// Helper to extract a core word from the idea
function extractCoreWord(idea: string): string {
  const words = idea.split(' ').filter(w => w.length > 3);
  return words.length > 0 ? words[0].charAt(0).toUpperCase() + words[0].slice(1) : "Venture";
}

export async function generateBusinessPlan(idea: string, country: string, currency: string, language: string = "English"): Promise<BusinessPlan> {
  // Simulate processing time for UI animations
  await new Promise(resolve => setTimeout(resolve, 2000));

  const coreWord = extractCoreWord(idea);
  
  const adjectives = ["Global", "Smart", "NextGen", "Apex", "Nova", "Prime", "Elevate", "Quantum", "Synergy", "Dynamic"];
  const suffixes = ["Hub", "Solutions", "Dynamics", "Labs", "Ventures", "Group", "Network", "Tech", "Innovations", "Corp"];
  
  const suggestedNames = Array.from({ length: 10 }, () => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const suf = suffixes[Math.floor(Math.random() * suffixes.length)];
    return Math.random() > 0.5 ? `${adj} ${coreWord}` : `${coreWord} ${suf}`;
  });

  return {
    suggestedNames,
    summary: `This comprehensive business plan outlines the strategic roadmap for "${idea}" operating within the ${country} market. By leveraging current industry trends and adopting a lean, scalable operational model, this venture is positioned to capture significant market share and deliver high value to its target demographic.`,
    brandingStartupAdvice: `Start by establishing a strong digital presence. Secure a domain name matching one of your top brand choices. Focus on a Minimum Viable Product (MVP) to test the market in ${country} before heavy investment. Keep initial overhead low and prioritize customer feedback loops.`,
    steps: [
      {
        title: "Market Research & Validation",
        description: `Analyze the specific demand for ${idea} in ${country}. Identify key competitors and define your unique value proposition.`,
        icon: "Search",
        imageKeyword: "market-research-data"
      },
      {
        title: "Legal & Financial Setup",
        description: `Register the business entity in ${country}. Open a corporate bank account and secure initial funding in ${currency}.`,
        icon: "Landmark",
        imageKeyword: "business-finance-legal"
      },
      {
        title: "Product/Service Development",
        description: `Build the core offering for ${idea}. Focus on quality assurance and user experience tailored to local preferences.`,
        icon: "Zap",
        imageKeyword: "product-development-team"
      },
      {
        title: "Go-to-Market Strategy",
        description: `Launch marketing campaigns across digital channels. Utilize local SEO and targeted advertising to reach your first 100 customers.`,
        icon: "Globe",
        imageKeyword: "digital-marketing-strategy"
      },
      {
        title: "Operations & Scaling",
        description: `Optimize supply chain and service delivery. Implement automation tools and hire key personnel to handle increased volume.`,
        icon: "Server",
        imageKeyword: "business-growth-scaling"
      }
    ],
    problemsAndSolutions: [
      {
        problem: `High initial customer acquisition cost in the ${country} market.`,
        solution: "Implement organic content marketing, SEO, and referral programs to lower reliance on paid advertising."
      },
      {
        problem: "Navigating local regulatory compliance and tax laws.",
        solution: "Partner with a local legal and accounting firm early in the setup phase to ensure full compliance."
      },
      {
        problem: "Scaling operations without compromising quality.",
        solution: "Develop strict Standard Operating Procedures (SOPs) and invest in scalable software infrastructure."
      }
    ],
    industryReferences: [
      `Annual ${coreWord} Industry Report (${new Date().getFullYear()})`,
      `${country} Chamber of Commerce - Small Business Trends`,
      `Global ${coreWord} Market Analysis & Forecast`
    ],
    governmentHelp: [
      `${country} Small Business Innovation Grant`,
      `Local Economic Development Subsidies for New Ventures`,
      `Startup Tax Incentives in ${country}`
    ]
  };
}

export async function generateStepDeepDive(idea: string, country: string, stepTitle: string, stepDescription: string, language: string = "English"): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1500));

  return `
# Deep Dive: ${stepTitle}

## Overview
This phase is critical for the success of your venture: **${idea}** in **${country}**. 
${stepDescription}

## 1. Detailed Action Plan
*   **Phase 1:** Conduct initial scoping and resource allocation.
*   **Phase 2:** Execute core tasks (e.g., vendor selection, software setup, initial outreach).
*   **Phase 3:** Review outcomes against initial benchmarks and adjust strategy.
*   **Phase 4:** Finalize implementation and transition to the next business stage.

## 2. Required Resources & Tools
*   **Software:** Project management tools (Jira, Asana), CRM systems, and financial software.
*   **Human Capital:** Specialized consultants, legal advisors, or technical leads.
*   **Financial:** Allocated budget for this specific phase (typically 15-20% of initial seed capital).

## 3. Estimated Timeline
*   **Weeks 1-2:** Planning and setup.
*   **Weeks 3-6:** Active execution and monitoring.
*   **Weeks 7-8:** Review, refinement, and completion.

## 4. Common Pitfalls & Mitigation
*   **Scope Creep:** *Mitigation:* Strictly adhere to the initial project charter and require formal approval for changes.
*   **Underestimating Costs:** *Mitigation:* Add a 20% contingency buffer to all financial estimates.
*   **Regulatory Delays:** *Mitigation:* Begin compliance checks in Week 1.

## 5. Key Performance Indicators (KPIs)
*   Task completion rate vs. schedule.
*   Budget variance (Actual vs. Planned).
*   Quality assurance pass rate.
`;
}

export interface ScriptGenerationParams {
  industry: string;
  target: string;
  goal: string;
  type: string;
  tone: string;
  length: string;
  objectionLevel: string;
  researchMode: boolean;
}

export async function generateSalesScript(params: ScriptGenerationParams): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const { industry, target, goal, type, tone, length, objectionLevel } = params;

  return `
# ${type} Script: ${industry}

**Target Audience:** ${target}
**Primary Goal:** ${goal}
**Tone:** ${tone}

---

## 1. Introduction & Hook
"Hi [Prospect Name], I'm reaching out because I noticed your team is doing incredible work in the ${industry} space. 
Usually, when I speak with leaders managing ${target}, they are actively looking for ways to ${goal}. Is that a priority for you right now?"

## 2. Value Proposition (The "Why Now")
"We've developed a framework specifically for the ${industry} sector that accelerates how you achieve ${goal}. 
Unlike traditional methods, our approach integrates seamlessly into your current workflow, reducing friction and driving immediate results."

## 3. Objection Handling (${objectionLevel} Level)

**Objection 1: "We don't have the budget right now."**
*Response:* "I completely understand. Budget is always a primary concern. That's exactly why we designed this to be ROI-positive within the first 30 days. If we could show you a path where this pays for itself, would you be open to a brief conversation?"

**Objection 2: "We are already using a competitor."**
*Response:* "That's great, it means you recognize the value of solving this problem. Many of our current clients actually switched from [Competitor] because they needed more robust capabilities specifically for ${goal}. How is your current solution handling [Specific Pain Point]?"

**Objection 3: "Send me an email and I'll look at it later."**
*Response:* "I'd be happy to send over some materials. Just so I send you the most relevant information regarding ${goal}, what is your biggest challenge in that area right now?"

## 4. Call to Action
"I know you're busy. Do you have 10 minutes next Tuesday or Wednesday for a quick introductory call? We can explore if there's a mutual fit, and if not, I'll let you get back to your day."
`;
}

