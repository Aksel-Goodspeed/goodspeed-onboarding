export const sops = [
  {
    id: 1,
    title: 'Client Onboarding',
    category: 'Operations',
    duration: '4 min',
    icon: '🤝',
    description: 'From signed contract to first working session — how we welcome a new client.',
    videoTitle: 'Welcome a new client the right way',
    owner: 'Harish',
    steps: [
      {
        title: 'Send the welcome kit',
        desc: 'Within 24 hours of contract signing, send the onboarding package via email. Use the Notion template — it covers intro, timeline, and what to expect in week one.',
      },
      {
        title: 'Schedule the kickoff call',
        desc: 'Book a 60-minute kickoff within the first 3 business days. Use Cal.com. Sofia runs this call using the discovery template.',
      },
      {
        title: 'Set up the project in Linear',
        desc: 'Create the client project, invite them as a viewer, set up milestones for the first two weeks, and link the Notion workspace.',
      },
      {
        title: 'Run the discovery session',
        desc: 'Use the standard discovery deck in Notion. Record with permission. Capture goals, constraints, and success criteria before any design starts.',
      },
      {
        title: 'Share and sign off the brief',
        desc: 'Within 48h post-discovery, share a written brief for client approval. Nothing moves to design until the brief is signed off.',
      },
    ],
  },
  {
    id: 2,
    title: 'Design Handoff',
    category: 'Design',
    duration: '3 min',
    icon: '🎨',
    description: 'How we pass designs from Figma to engineering without losing anything in translation.',
    videoTitle: 'The clean handoff process',
    owner: 'Maya',
    steps: [
      {
        title: 'Prepare the Figma file',
        desc: 'All frames must be named. All components must be in the library. No detached instances allowed. Run the design audit checklist before flagging as ready.',
      },
      {
        title: 'Add developer annotations',
        desc: 'Use sticky notes in Figma for anything that needs special handling in code — animations, edge cases, and responsive behavior at key breakpoints.',
      },
      {
        title: 'Export all assets',
        desc: 'Export icons, images, and custom assets at 1x, 2x, and 3x into the project\'s /assets folder. Name everything semantically.',
      },
      {
        title: 'Record a Loom walkthrough',
        desc: 'A 3–5 minute screen recording walking through the key screens and interactions. Luca needs this for every handoff — no exceptions.',
      },
      {
        title: 'Update the Linear ticket',
        desc: 'Move to "Ready for Dev", attach the Figma link and Loom URL in the ticket description, and tag the assigned engineer.',
      },
    ],
  },
  {
    id: 3,
    title: 'Sprint Planning',
    category: 'Operations',
    duration: '5 min',
    icon: '📋',
    description: 'How we plan two-week sprints so every person knows exactly what they\'re building and why.',
    videoTitle: 'Planning sprints that actually work',
    owner: 'Harish',
    steps: [
      {
        title: 'Pre-work (day before)',
        desc: 'Sofia drafts sprint goals in Notion. Every team member reviews their task backlog and flags anything blocked or ready to close.',
      },
      {
        title: 'Sprint review (30 min)',
        desc: 'Walk through what shipped in the last sprint. Celebrate wins out loud. Note blockers — they become input for the retro.',
      },
      {
        title: 'Prioritize as a team',
        desc: 'Harish runs the prioritization exercise. Every item gets a P1, P2, or P3 label. Nothing unscoped makes it into a sprint.',
      },
      {
        title: 'Assign and estimate',
        desc: 'Every task gets one owner and a story-point estimate. No unassigned tasks in a sprint — ever.',
      },
      {
        title: 'Kick off the sprint',
        desc: 'Sprints start Monday at 9am. Harish sends a Loom summary to the whole team covering goals, owners, and anything to watch.',
      },
    ],
  },
  {
    id: 4,
    title: 'AI Feature QA',
    category: 'Engineering',
    duration: '4 min',
    icon: '🤖',
    description: 'How we test AI features before they touch a client — no exceptions.',
    videoTitle: 'Testing AI the right way',
    owner: 'Luca',
    steps: [
      {
        title: 'Build the edge case library',
        desc: 'Before QA begins, Luca pulls the 20 standard edge cases from Notion and adds 5 project-specific cases. Every project has different failure modes.',
      },
      {
        title: 'Stress-test all prompts',
        desc: 'Test every prompt with ambiguous, adversarial, and boundary inputs. Document every failure — even ones that seem minor.',
      },
      {
        title: 'Benchmark latency',
        desc: 'Every AI endpoint must respond under 2 seconds at the 95th percentile. Log results in the QA spreadsheet and flag anything above threshold.',
      },
      {
        title: 'Run client acceptance testing',
        desc: 'Prepare a 30-minute guided testing session for the client with scripted scenarios. Capture their reactions — they often spot things we miss.',
      },
      {
        title: 'Complete the ship checklist',
        desc: 'Every item in the Linear QA checklist must be ticked before Aksel approves the release. No exceptions, no matter the deadline pressure.',
      },
    ],
  },
]
