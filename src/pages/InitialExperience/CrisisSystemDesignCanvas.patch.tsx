// Patch for CrisisSystemDesignCanvas to fix population issues
// Apply these changes to the main component

// 1. Fix the initialization flag issue by resetting it when emailId changes
// In useEffect at line 1217, add:
useEffect(() => {
  // Reset initialization flag when emailId changes
  canvasInitializedRef.current = false;
  
  loadMissionData();
  
  // Cleanup when component unmounts
  return () => {
    dispatch(clearDatabaseMission());
    canvasInitializedRef.current = false;
  };
}, [emailId, missionSlug, dispatch]); // emailId is a dependency

// 2. Fix the initializeCanvasForStage function to handle email navigation better
// Replace lines 1421-1572 with:
const initializeCanvasForStage = useCallback(async () => {
  if (!missionStageData?.id) return;
  
  console.log('🎨 Initializing canvas for stage:', {
    stageId: missionStageData.id,
    emailId: emailId,
    hasInitialized: canvasInitializedRef.current
  });
  
  // For email navigation, always clear and reload
  const isFromEmail = !!emailId;
  if (isFromEmail) {
    console.log('📧 Navigation from email detected - forcing fresh load');
    dispatch(clearCanvas({ keepRequirements: false }));
    canvasInitializedRef.current = false;
  }
  
  // Check if already initialized (but not for email navigation)
  if (canvasInitializedRef.current && !isFromEmail) {
    console.log('⚠️ Canvas already initialized, skipping...');
    return;
  }
  
  // Get current state
  const currentNodes = selectNodes(store.getState());
  const currentEdges = selectEdges(store.getState());
  
  console.log('📊 Current canvas state:', {
    currentNodesCount: currentNodes.length,
    currentEdgesCount: currentEdges.length,
    missionTitle: missionStageData.mission.title,
    stageTitle: missionStageData.title
  });
  
  // Mark as initialized
  canvasInitializedRef.current = true;
  
  // Set this as the active canvas
  dispatch(setActiveCanvas({ stageId: missionStageData.id }));
  
  // Check for saved state
  const hasSavedState = savedCanvasData?.canvasState?.nodes?.length > 0;
  const canvasIsEmpty = currentNodes.length === 0;
  
  console.log('💾 Save state check:', {
    hasSavedState,
    canvasIsEmpty,
    savedNodeCount: savedCanvasData?.canvasState?.nodes?.length || 0
  });
  
  // Decision logic for what to load
  if (isFromEmail && canvasIsEmpty) {
    // Always load initial state for email navigation to empty canvas
    console.log('📧 Email navigation to empty canvas - loading initial state');
    await loadInitialSystemState(missionStageData.id);
  } else if (hasSavedState && canvasIsEmpty && !isFromEmail) {
    // Load saved state only if not from email
    console.log('💾 Loading saved canvas state');
    // ... existing saved state loading code ...
  } else if (!hasSavedState && canvasIsEmpty) {
    // No saved state and empty canvas - load initial
    console.log('🆕 No saved state - loading initial system state');
    await loadInitialSystemState(missionStageData.id);
  } else {
    // Canvas has content - sync to storage
    console.log('📦 Canvas has content - syncing to storage');
    dispatch(updateCanvasState({
      stageId: missionStageData.id,
      nodes: currentNodes.map(serializeNode),
      edges: currentEdges.map(serializeEdge),
      viewport: { x: 0, y: 0, zoom: 0.6 }
    }));
  }
}, [dispatch, missionStageData, savedCanvasData, emailId, clearCorruptedCanvasState]);

// 3. Ensure loadInitialSystemState is called properly
// Add better error handling at line 582:
const loadInitialSystemState = async (stageId: string) => {
  try {
    console.log('🔄 Loading initial system state for stage:', stageId);
    
    // Clear any existing nodes first
    const existingNodes = selectNodes(store.getState());
    if (existingNodes.length > 0) {
      console.log('🧹 Clearing existing nodes before loading initial state');
      dispatch(clearCanvas({ keepRequirements: true }));
    }
    
    const { data: stageData, error } = await supabase
      .from('mission_stages')
      .select('initial_system_state, title, mission_id')
      .eq('id', stageId)
      .single();

    if (error) {
      console.error('❌ Failed to load initial system state:', error);
      // Try to load default state as fallback
      loadDefaultSystemState();
      return;
    }
    
    // ... rest of the existing loadInitialSystemState code ...
    
  } catch (error) {
    console.error('Failed to load initial system state:', error);
    // Fallback to default state
    loadDefaultSystemState();
  }
};

// 4. Add a default state loader as fallback
const loadDefaultSystemState = () => {
  console.log('🔧 Loading default system state as fallback');
  
  const centerX = 400;
  const centerY = 300;
  
  // Add a default broken system node
  dispatch(addNode({
    component: {
      id: 'current-system-fallback',
      name: "Current System",
      type: 'custom',
      category: 'compute',
      cost: 0,
      capacity: 1000,
      description: 'The current overloaded system',
      icon: 'server'
    },
    position: { x: centerX + 100, y: centerY },
    nodeData: {
      id: 'current-system-fallback',
      name: "Current System",
      type: 'custom',
      category: 'compute',
      cost: 0,
      capacity: 1000,
      description: 'The current overloaded system',
      label: "Current System",
      icon: 'server',
      status: 'broken'
    }
  }));
  
  // Add user nodes
  const totalUsers = 200;
  const userNodes = createUserNodeBreakdown(totalUsers);
  
  userNodes.forEach((userNode, index) => {
    const nodeHeight = 122;
    const nodeGap = nodeHeight / 2;
    const nodeSpacing = nodeHeight + nodeGap;
    const totalHeight = (userNodes.length - 1) * nodeSpacing;
    const startY = centerY - (totalHeight / 2);
    const yPosition = startY + (index * nodeSpacing);
    
    dispatch(addNode({
      component: {
        id: userNode.id,
        name: userNode.name,
        type: 'user',
        category: 'stakeholder',
        cost: 0,
        capacity: userNode.userCount,
        description: userNode.description,
        icon: 'users'
      },
      position: { x: centerX - 400, y: yPosition },
      nodeType: 'user',
      nodeData: {
        id: userNode.id,
        name: userNode.name,
        type: 'user',
        category: 'stakeholder',
        cost: 0,
        capacity: userNode.userCount,
        description: userNode.description,
        label: userNode.label,
        icon: 'users',
        userCount: userNode.userCount
      }
    }));
  });
  
  // Connect users to system
  userNodes.forEach((userNode) => {
    dispatch(addEdgeAction({
      source: userNode.id,
      target: 'current-system-fallback',
      sourceHandle: `${userNode.id}-output`,
      targetHandle: 'current-system-fallback-input'
    }));
  });
};

// 5. Fix the useEffect that triggers initialization
// Replace lines 1606-1613 with:
useEffect(() => {
  if (user && missionStageData && !isLoadingCanvas) {
    // Add a small delay for email navigation to ensure clean state
    const isFromEmail = !!emailId;
    const delay = isFromEmail ? 500 : 0;
    
    const timer = setTimeout(() => {
      initializeCanvasForStage();
    }, delay);
    
    return () => clearTimeout(timer);
  }
}, [user, missionStageData, isLoadingCanvas, emailId, initializeCanvasForStage]);