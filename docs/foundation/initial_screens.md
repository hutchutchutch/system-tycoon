Updated Screen Instructions with Database Integration
1. Landing Page
Database Requirements: None (static content)
Empty States: N/A - fully static marketing page

2. User Sign-in/Sign-up
Database Requirements:

Supabase Auth (auth.users)
Triggers handle_new_user() function on signup

Actions on Signup:
javascript// Supabase handles auth automatically
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
})
// This automatically creates entries in:
// - profiles (via trigger)
// - user_stats (via trigger)
Empty States: N/A - auth flow

3. First Time User Experience - Career Map
Database Requirements:
javascript// 1. Get user profile
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();

// 2. Get all scenarios with user's progress
const { data: scenarios } = await supabase
  .from('scenarios')
  .select(`
    *,
    scenario_progress!left(
      status,
      best_score,
      completed_at
    )
  `)
  .order('level', { ascending: true })
  .order('sublevel', { ascending: true });

// 3. Get user stats for reputation display
const { data: stats } = await supabase
  .from('user_stats')
  .select('total_projects_completed, total_revenue_saved')
  .eq('user_id', user.id)
  .single();
Visual Elements Based on Data:
javascript// Career path nodes
scenarios.map(scenario => ({
  id: scenario.id,
  position: calculatePosition(scenario.level, scenario.sublevel),
  status: scenario.scenario_progress?.[0]?.status || 'locked',
  display: {
    // First scenario always available
    isClickable: scenario.id === '1-1-sarahs-bakery' || 
                scenario.scenario_progress?.[0]?.status === 'available',
    isCompleted: scenario.scenario_progress?.[0]?.status === 'completed',
    showQuestionMark: !scenario.scenario_progress?.[0]?.completed_at,
    title: scenario.scenario_progress?.[0]?.completed_at 
           ? scenario.title 
           : '???',
    score: scenario.scenario_progress?.[0]?.best_score
  }
}))
Empty States:
javascript// First time user state (no completed projects)
if (stats.total_projects_completed === 0) {
  showNarrativeOverlay({
    text: "You've always been curious about how the digital world works...",
    showChatNotification: true
  });
}

// Show chat from Sarah after narrative
setTimeout(() => {
  showChatNotification({
    from: "Sarah",
    preview: "Hey! Quick question about my website...",
    unread: true
  });
}, 3000);

4. Initial Meeting Room Experience
Database Requirements:
javascript// Get scenario details including available questions
const { data: scenario } = await supabase
  .from('scenarios')
  .select('*')
  .eq('id', '1-1-sarahs-bakery')
  .single();

// Parse available questions
const questions = scenario.available_questions;
// Structure: 
// {
//   "sarah": [
//     { id: "budget", text: "What's your budget?", impact: {...} }
//   ],
//   "alex": [...],
//   "mark": [...],
//   "devin": [...]
// }

// Track attempt start
const { data: attempt } = await supabase
  .from('scenario_attempts')
  .insert({
    user_id: user.id,
    scenario_id: scenario.id,
    started_at: new Date()
  })
  .select()
  .single();
Meeting UI State Management:
javascriptconst [questionsAsked, setQuestionsAsked] = useState([]);
const [questionsRemaining, setQuestionsRemaining] = useState(3);

// When question selected
const handleQuestionSelect = async (character, question) => {
  const newQuestion = {
    character,
    question: question.id,
    answer: question.answer
  };
  
  setQuestionsAsked([...questionsAsked, newQuestion]);
  setQuestionsRemaining(prev => prev - 1);
  
  // Update requirements based on question impact
  updateRequirements(question.impact);
};
Empty States: N/A - Questions are always available from scenario data

5. Mentor Selection Screen
Database Requirements:
javascript// Get available mentors for this scenario
const { data: scenario } = await supabase
  .from('scenarios')
  .select('available_mentors')
  .eq('id', currentScenarioId)
  .single();

// Get user's preferred mentor (if any)
const { data: profile } = await supabase
  .from('profiles')
  .select('preferred_mentor_id')
  .eq('id', user.id)
  .single();

// Available mentors from scenario
const availableMentors = scenario.available_mentors;
// ["dr_linda_wu", "jordan_rivera", "maya_patel"]

// Get full mentor data from static config or mentors table
const mentorData = availableMentors.map(id => MENTOR_CONFIG[id]);
Mentor Display:
javascriptmentorData.map(mentor => ({
  id: mentor.id,
  name: mentor.name,
  title: mentor.title,
  specialization: mentor.specialization,
  isPreferred: mentor.id === profile.preferred_mentor_id,
  isAvailable: true, // All shown mentors are available
  guidancePreview: mentor.signature_advice
}))
Empty States: Always shows 3-4 mentors (defined in scenario data)

6. System Design Canvas Screen
Database Requirements:
javascript// Get available components for user's level
const { data: components } = await supabase
  .from('components')
  .select('*')
  .lte('min_level', profile.current_level)
  .order('category')
  .order('name');

// Get user's component mastery
const { data: mastery } = await supabase
  .from('component_mastery')
  .select('*')
  .eq('user_id', user.id);

// Create component drawer structure
const componentsByCategory = components.reduce((acc, comp) => {
  const masteryData = mastery.find(m => m.component_id === comp.id);
  
  if (!acc[comp.category]) acc[comp.category] = [];
  
  acc[comp.category].push({
    ...comp,
    mastery_level: masteryData?.mastery_level || 'novice',
    times_used: masteryData?.times_used || 0,
    isNew: !masteryData
  });
  
  return acc;
}, {});
Component Drawer Display:
javascript// For Level 1 user
{
  "frontend": [
    {
      id: "web_interface",
      name: "Web Interface",
      cost: 50,
      capacity: 1000,
      mastery_level: "novice",
      isNew: true
    }
  ],
  "backend": [...],
  "data": [...]
}
Canvas State Management:
javascriptconst [architecture, setArchitecture] = useState({
  nodes: [],
  edges: [],
  totalCost: 0
});

// Real-time cost calculation
const updateCost = () => {
  const cost = architecture.nodes.reduce((sum, node) => {
    const component = components.find(c => c.id === node.type);
    return sum + (component?.base_cost || 0);
  }, 0);
  
  setArchitecture(prev => ({ ...prev, totalCost: cost }));
};
Empty States:
javascript// Empty canvas state
if (architecture.nodes.length === 0) {
  showCanvasHint("Drag components from the left drawer to start building!");
}

// No unlocked components (shouldn't happen)
if (components.length === 0) {
  showError("No components available. Please contact support.");
}

7. System Simulation Screen
Database Requirements:
javascript// Save architecture snapshot before simulation
await supabase
  .from('scenario_attempts')
  .update({
    architecture_snapshot: architecture,
    components_used: architecture.nodes.map(n => n.type),
    total_cost: architecture.totalCost,
    selected_mentor_id: selectedMentor,
    questions_asked: questionsAsked
  })
  .eq('id', attemptId);

// During simulation, calculate metrics
const simulationResults = {
  response_time: calculateResponseTime(architecture),
  error_rate: calculateErrorRate(architecture),
  throughput: calculateThroughput(architecture),
  uptime: calculateUptime(architecture)
};

// After simulation completes
await supabase
  .from('scenario_attempts')
  .update({
    completed_at: new Date(),
    duration_seconds: Math.floor((Date.now() - startTime) / 1000),
    final_score: calculateScore(simulationResults),
    performance_metrics: simulationResults,
    requirements_met: checkRequirements(simulationResults, scenario.base_requirements),
    client_satisfaction: calculateSatisfaction(simulationResults)
  })
  .eq('id', attemptId);
Real-time Metrics Display:
javascript// Simulation state
const [metrics, setMetrics] = useState({
  requestsPerSecond: 0,
  responseTime: 0,
  errorRate: 0,
  uptime: 100
});

// Update metrics during simulation
useEffect(() => {
  const interval = setInterval(() => {
    setMetrics(calculateCurrentMetrics(architecture, simulationTime));
  }, 100); // Update 10 times per second
  
  return () => clearInterval(interval);
}, [architecture, simulationTime]);
Empty States: N/A - Simulation runs on submitted architecture

8. Feedback Modal & Career Map Return
Database Requirements:
javascript// Update scenario progress
const { data: progress } = await supabase
  .from('scenario_progress')
  .upsert({
    user_id: user.id,
    scenario_id: scenarioId,
    status: 'completed',
    completed_at: new Date(),
    attempts_count: attempts + 1,
    best_score: Math.max(currentScore, previousBestScore || 0),
    best_requirements_score: scores.requirements,
    best_performance_score: scores.performance,
    best_cost_score: scores.cost,
    best_architecture_score: scores.architecture,
    best_response_time_ms: metrics.response_time,
    best_error_rate: metrics.error_rate,
    best_cost_savings: scenario.budget_limit - architecture.totalCost
  })
  .select()
  .single();

// Update user stats
await supabase.rpc('increment_user_stats', {
  user_id: user.id,
  projects_completed: 1,
  revenue_saved: scenario.budget_limit - architecture.totalCost,
  systems_built: 1,
  perfect_score: currentScore === 100 ? 1 : 0
});

// Update component mastery
for (const componentId of componentsUsed) {
  await supabase.rpc('update_component_mastery', {
    user_id: user.id,
    component_id: componentId,
    was_successful: currentScore >= 80,
    was_optimal: currentScore >= 95
  });
}

// Check for achievements
const newAchievements = checkAchievements(currentScore, metrics);
for (const achievement of newAchievements) {
  await supabase
    .from('achievements')
    .insert({
      user_id: user.id,
      achievement_id: achievement.id
    });
}

// Unlock next scenario
if (currentScore >= 80) {
  await supabase
    .from('scenario_progress')
    .insert({
      user_id: user.id,
      scenario_id: getNextScenarioId(scenarioId),
      status: 'available'
    });
}

// Save to portfolio (optional)
if (userWantsToSave) {
  await supabase
    .from('design_portfolio')
    .insert({
      user_id: user.id,
      scenario_id: scenarioId,
      scenario_name: scenario.title,
      client_name: scenario.client_name,
      architecture_snapshot: architecture,
      achieved_metrics: metrics,
      cost_savings: scenario.budget_limit - architecture.totalCost,
      client_testimonial: generateTestimonial(currentScore),
      completed_at: new Date(),
      share_token: generateShareToken()
    });
}
Feedback Display:
javascript// Show results
const feedbackData = {
  score: progress.best_score,
  breakdown: {
    requirements: `${progress.best_requirements_score}/40`,
    performance: `${progress.best_performance_score}/30`,
    cost: `${progress.best_cost_score}/20`,
    architecture: `${progress.best_architecture_score}/10`
  },
  newAchievements,
  clientTestimonial: generateTestimonial(progress.best_score),
  unlockedComponents: progress.unlocked_components,
  nextScenarioTeaser: getNextScenario(scenarioId)
};
Return to Career Map:
javascript// Refresh career map data
const refreshCareerMap = async () => {
  // Re-fetch all scenarios with updated progress
  const { data: scenarios } = await supabase
    .from('scenarios')
    .select(`
      *,
      scenario_progress!left(
        status,
        best_score,
        completed_at
      )
    `)
    .order('level')
    .order('sublevel');
  
  // Update UI to show:
  // - Completed scenario with checkmark
  // - Newly unlocked scenario(s) 
  // - Updated reputation/stats
  // - New chat notification if available
};
Empty States:
javascript// First completion special handling
if (stats.total_projects_completed === 1) {
  showSpecialAnimation("First Project Complete! 🎉");
  showTutorial("You've unlocked new scenarios and components!");
}
Global Empty States & Error Handling
javascript// Generic error handler for all screens
const handleDatabaseError = (error) => {
  console.error('Database error:', error);
  
  if (error.code === 'PGRST301') {
    showError("You don't have permission to access this data.");
  } else if (error.code === '23505') {
    showError("This action has already been completed.");
  } else {
    showError("Something went wrong. Please try again.");
  }
};

// Loading states
const LoadingState = () => (
  <div className="flex items-center justify-center h-full">
    <Spinner />
    <span>Loading your architecture journey...</span>
  </div>
);

// No data states
const NoDataState = ({ message, action }) => (
  <div className="text-center py-12">
    <p className="text-gray-500 mb-4">{message}</p>
    {action && (
      <button onClick={action.onClick} className="btn-primary">
        {action.label}
      </button>
    )}
  </div>
);
This comprehensive integration ensures each screen knows exactly what data to fetch, how to handle empty states, and how to update the database as users progress through the game.