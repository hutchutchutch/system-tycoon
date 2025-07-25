import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MessageCircle, Send, Minimize2, X, Bot, ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { MENTORS } from '../../../constants/mentors';
import { ProductTour } from '../../organisms/ProductTour';
import type { MentorChatProps, ChatMessage } from './MentorChat.types';
import { mentorChatService, type MentorChatSession, collectPageContext } from '../../../services/mentorChatService';
import type { RootState } from '../../../store';
import { supabase } from '../../../services/supabase';
import { useConversationSession } from '../../../hooks/useConversationSession';
import { useAppSelector } from '../../../hooks/redux';
import { 
  selectRequirementsStatus,
  selectCanvasValidation,
  selectNodes,
  selectEdges
} from '../../../features/design/designSlice';
import styles from './MentorChat.module.css';

// Global conversation session ID that other components can access
let globalConversationSessionId: string | null = null;

// Function to get the current conversation session ID
export const getCurrentConversationSessionId = (): string | null => {
  return globalConversationSessionId;
};

// Utility function to validate if a string is a valid UUID
const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export const MentorChat: React.FC<MentorChatProps> = ({
  missionStageId,
  missionTitle,
  problemDescription,
  className = '',
  canvasNodes = [],
  canvasEdges = [],
  requirements = [],
  availableComponents = []
}) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMentorSelector, setShowMentorSelector] = useState(false);
  const conversationSessionId = useConversationSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const chatMessagesContainerRef = useRef<HTMLDivElement>(null);

  // Get canvas state and requirements from Redux
  const reduxNodes = useAppSelector(selectNodes);
  const reduxEdges = useAppSelector(selectEdges);
  const requirementsStatus = useAppSelector(selectRequirementsStatus);
  const canvasValidation = useAppSelector(selectCanvasValidation);
  
  // Use Redux state if available, fall back to props
  const nodes = reduxNodes.length > 0 ? reduxNodes : canvasNodes;
  const edges = reduxEdges.length > 0 ? reduxEdges : canvasEdges;
  const currentRequirements = requirementsStatus.requirements.length > 0 
    ? requirementsStatus.requirements 
    : requirements;

  // Update global session ID when it changes
  useEffect(() => {
    globalConversationSessionId = conversationSessionId;
  }, [conversationSessionId]);

  // ProductTour state management
  const [showProductTour, setShowProductTour] = useState(false);
  
  // Page-specific notification state
  const [currentNotification, setCurrentNotification] = useState<{
    title: string;
    message: string;
    actionLabel?: string;
  } | null>(null);

  // Get current user and profile from Redux store
  const { user, profile, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Use preferred mentor from profile, fallback to 'linda-wu'
  const [selectedMentorId, setSelectedMentorId] = useState(() => {
    return profile?.preferred_mentor_id || 'linda-wu';
  });

  // Update selected mentor when profile changes
  useEffect(() => {
    if (profile?.preferred_mentor_id && profile.preferred_mentor_id !== selectedMentorId) {
      setSelectedMentorId(profile.preferred_mentor_id);
    }
  }, [profile?.preferred_mentor_id, selectedMentorId]);

  // Scroll to the start of the last message when chat is expanded
  useEffect(() => {
    if (isExpanded && lastMessageRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [isExpanded]);
  
  // Auto-scroll to bottom when new messages arrive (only if already at bottom)
  useEffect(() => {
    if (chatMessagesContainerRef.current && messages.length > 0) {
      const container = chatMessagesContainerRef.current;
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      
      // Only auto-scroll if user is already near the bottom
      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

  // Load chat history and add welcome message when component mounts or mentor changes
  useEffect(() => {
    if (selectedMentorId && user && isAuthenticated) {
      loadChatHistory();
    }
  }, [selectedMentorId, user, isAuthenticated]);

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!conversationSessionId || !isAuthenticated) return;

    console.log('🔔 MentorChat: Setting up real-time subscription for session:', conversationSessionId);

    // Subscribe to new messages for this conversation session
    const channel = supabase
      .channel(`mentor_chat_${conversationSessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mentor_chat_messages',
          filter: `conversation_session_id=eq.${conversationSessionId}`
        },
        (payload: any) => {
          console.log('📨 MentorChat: Received real-time message:', payload);
          const newMessage = payload.new;
          
          // Don't add the message if it's from the current user (to avoid duplicates)
          if (newMessage.sender_type === 'user' && newMessage.user_id === user?.id) {
            console.log('⏭️ MentorChat: Skipping user message to avoid duplicate');
            return;
          }

          const chatMessage: ChatMessage = {
            id: newMessage.id,
            content: newMessage.message_content,
            timestamp: new Date(newMessage.created_at),
            sender: newMessage.sender_type as 'user' | 'mentor' | 'system',
            mentorId: newMessage.mentor_id,
          };

          console.log('✅ MentorChat: Adding new message to chat:', chatMessage);

          setMessages(prev => {
            // Check if message already exists to prevent duplicates
            const exists = prev.some(msg => msg.id === chatMessage.id);
            if (!exists) {
              return [...prev, chatMessage];
            }
            console.log('⚠️ MentorChat: Message already exists, skipping duplicate');
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      console.log('🔕 MentorChat: Unsubscribing from real-time channel');
      channel.unsubscribe();
    };
  }, [conversationSessionId, isAuthenticated, user?.id]);

  // ProductTour initialization
  useEffect(() => {
    if (isAuthenticated && user && location.pathname === '/game') {
      // Check if user has seen the tour before
      const hasSeenTour = localStorage.getItem('saas_hasSeenProductTour');
      
      if (!hasSeenTour) {
        // Start tour after a brief delay to ensure components are rendered
        const timer = setTimeout(() => {
          setShowProductTour(true);
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, user, location.pathname]);

  // Add keyboard shortcuts for testing
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Trigger tour with Ctrl+Shift+T (or Cmd+Shift+T on Mac)
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
        event.preventDefault();
        setShowProductTour(true);
        console.log('Product tour manually triggered via keyboard shortcut');
      }
      
      // Reset notifications with Ctrl+Shift+R (or Cmd+Shift+R on Mac)
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'R') {
        event.preventDefault();
        localStorage.removeItem('saas_hasSeenNewsNotification');
        localStorage.removeItem('saas_hasSeenEmailNotification');
        localStorage.removeItem('saas_hasSeenDesignNotification');
        localStorage.removeItem('saas_hasSeenGameNotification');
        localStorage.removeItem('saas_hasSeenProductTour');
        console.log('All mentor notifications and tour state reset!');
        // Reload page to show notifications again
        window.location.reload();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Page-specific notification logic
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const showPageNotification = () => {
      const addNotificationAsMessage = (title: string, content: string) => {
        const notificationMessage: ChatMessage = {
          id: `notification-${Date.now()}`,
          content: `${title}\n\n${content}`,
          timestamp: new Date(),
          sender: 'mentor',
          mentorId: selectedMentorId
        };
        setMessages(prev => [...prev, notificationMessage]);
      };

      switch (location.pathname) {
        case '/browser/news':
          // Today's News page notification
          const hasSeenNewsNotification = localStorage.getItem('saas_hasSeenNewsNotification');
          if (!hasSeenNewsNotification) {
            setTimeout(() => {
              const title = 'Explore and Discover! 🔍';
              const message = 'Use the category filters to explore subjects that interest you, then look for bento cards where someone needs your help. Click "Contact" to reach out and make a difference!';
              
              setCurrentNotification({
                title,
                message,
                actionLabel: 'Got it!'
              });
              
              // Add as chat message
              addNotificationAsMessage(title, message);
            }, 3000); // Show after 3 seconds
          }
          break;
        
        case '/email':
          // Email page notification
          const hasSeenEmailNotification = localStorage.getItem('saas_hasSeenEmailNotification');
          if (!hasSeenEmailNotification) {
            setTimeout(() => {
              const title = 'Check Your Inbox! 📧';
              const message = 'Look for mission briefings and urgent requests from communities. Red dots indicate high-priority communications that need your immediate attention.';
              
              setCurrentNotification({
                title,
                message,
                actionLabel: 'Understood!'
              });
              
              // Add as chat message
              addNotificationAsMessage(title, message);
            }, 2000);
          }
          break;
        
        case '/crisis-design':
          // Crisis design page notification  
          const hasSeenDesignNotification = localStorage.getItem('saas_hasSeenDesignNotification');
          if (!hasSeenDesignNotification) {
            setTimeout(() => {
              const title = 'Design Your Solution! 🎨';
              const message = 'Drag components from the left panel onto the canvas to architect your system. Connect components to show data flow and relationships.';
              
              setCurrentNotification({
                title,
                message,
                actionLabel: 'Let\'s build!'
              });
              
              // Add as chat message
              addNotificationAsMessage(title, message);
            }, 2000);
          }
          break;

        case '/game':
          // Game/Mission Selection page notification
          const hasSeenGameNotification = localStorage.getItem('saas_hasSeenGameNotification');
          if (!hasSeenGameNotification) {
            setTimeout(() => {
              const title = 'Welcome to Mission Selection! 🚀';
              const message = 'Choose your first mission to start helping communities solve real-world problems. Each mission will challenge you to design systems that make a difference.';
              
              setCurrentNotification({
                title,
                message,
                actionLabel: 'Show me around!'
              });
              
              // Add as chat message
              addNotificationAsMessage(title, message);
            }, 1500);
          }
          break;
        
        default:
          break;
      }
    };

    showPageNotification();
  }, [location.pathname, isAuthenticated, user, selectedMentorId]);

  const loadChatHistory = async () => {
    try {
      const history = await mentorChatService.getChatHistory(conversationSessionId);
      
      if (history.length === 0) {
        // Add welcome message if no history exists
        const welcomeMessage: ChatMessage = {
          id: `welcome-${Date.now()}`,
          content: `Hi! I'm ${MENTORS[selectedMentorId]?.name}. I'm here to help you with ${missionTitle || 'this mission'}. ${problemDescription ? `I see you're working on: ${problemDescription}` : ''} Feel free to ask me any questions about system design, architecture patterns, or how to approach this challenge!`,
          timestamp: new Date(),
          sender: 'mentor',
          mentorId: selectedMentorId
        };
        setMessages([welcomeMessage]);
      } else {
        setMessages(history);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      // Fallback to welcome message
      const welcomeMessage: ChatMessage = {
        id: `welcome-${Date.now()}`,
        content: `Hi! I'm ${MENTORS[selectedMentorId]?.name}. I'm here to help you with ${missionTitle || 'this mission'}. Feel free to ask me any questions!`,
        timestamp: new Date(),
        sender: 'mentor',
        mentorId: selectedMentorId
      };
      setMessages([welcomeMessage]);
    }
  };

  const selectedMentor = MENTORS[selectedMentorId] || {
    id: selectedMentorId,
    name: 'AI Mentor',
    title: 'System Design Assistant',
    specialization: 'General system design and architecture guidance',
    guidanceStyle: 'Adaptive and helpful',
    bestForLevels: [1, 2, 3, 4, 5],
    signatureAdvice: 'Let me help you with that...',
    unlockLevel: 1,
  };

  const handleSendMessage = useCallback(async () => {
    if (!currentInput.trim() || isLoading || !user || !isAuthenticated) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: currentInput.trim(),
      timestamp: new Date(),
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsLoading(true);

    try {
      // Enhanced canvas state for mentor context
      const enhancedCanvasState = {
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type || 'custom',
          position: node.position,
          data: {
            label: node.data?.label || node.data?.name,
            category: node.data?.category,
            description: node.data?.description,
            icon: node.data?.icon,
            userCount: node.data?.userCount,
            status: node.data?.status
          },
          handles: {
            input: `${node.id}-input`,
            output: `${node.id}-output`
          },
          isConnectable: true,
          nodeType: 'canvas_component'
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          type: 'canvas_connection',
          sourceNode: nodes.find(n => n.id === edge.source)?.data?.label || edge.source,
          targetNode: nodes.find(n => n.id === edge.target)?.data?.label || edge.target
        })),
        connectionSummary: {
          totalNodes: nodes.length,
          totalConnections: edges.length,
          nodesByCategory: nodes.reduce((acc, node) => {
            const category = node.data?.category || 'unknown';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          connectionPairs: edges.map(edge => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            return `${sourceNode?.data?.label || edge.source} → ${targetNode?.data?.label || edge.target}`;
          })
        },
        systemAnalysis: {
          userLoad: {
            totalUsers: nodes.filter(n => n.type === 'user').reduce((sum, n) => sum + (n.data?.userCount || 0), 0),
            userNodeCount: nodes.filter(n => n.type === 'user').length,
            largestUserGroup: Math.max(...nodes.filter(n => n.type === 'user').map(n => n.data?.userCount || 0), 0)
          },
          systemComponents: {
            brokenComponents: nodes.filter(n => n.data?.status === 'broken').map(n => ({
              name: n.data?.label,
              category: n.data?.category,
              description: n.data?.description
            })),
            healthyComponents: nodes.filter(n => n.data?.status !== 'broken' && n.type !== 'user').map(n => ({
              name: n.data?.label,
              category: n.data?.category
            }))
          },
          criticalIssues: {
            singlePointsOfFailure: nodes.filter(n => {
              const incomingConnections = edges.filter(e => e.target === n.id).length;
              const outgoingConnections = edges.filter(e => e.source === n.id).length;
              return incomingConnections > 3 || outgoingConnections > 3; // High traffic nodes
            }).map(n => n.data?.label),
            overloadedSystems: nodes.filter(n => {
              const userConnections = edges.filter(e => {
                const sourceNode = nodes.find(sn => sn.id === e.source);
                return sourceNode?.type === 'user' && e.target === n.id;
              });
              const totalUserLoad = userConnections.reduce((sum, edge) => {
                const sourceNode = nodes.find(sn => sn.id === edge.source);
                return sum + (sourceNode?.data?.userCount || 0);
              }, 0);
              return totalUserLoad > 100; // Systems with more than 100 users
            }).map(n => ({ name: n.data?.label, category: n.data?.category }))
          }
        },
        requirementValidation: {
          // Include requirement validation status from Redux
          allRequirementsMet: requirementsStatus.allMet,
          completedCount: requirementsStatus.completedCount,
          totalCount: requirementsStatus.totalCount,
          completionPercentage: requirementsStatus.percentage,
          unmetRequirements: currentRequirements
            .filter(req => !req.completed)
            .map(req => ({
              id: req.id,
              description: req.description
            })),
          metRequirements: currentRequirements
            .filter(req => req.completed)
            .map(req => ({
              id: req.id,
              description: req.description
            })),
          nextSuggestedAction: !requirementsStatus.allMet && currentRequirements.length > 0
            ? currentRequirements.find(req => !req.completed)?.description
            : 'All requirements are met! Test your system to ensure it handles the load.'
        }
      };

      // Collect context data based on current page
      const contextData = collectPageContext(location.pathname, {
        missionStage: missionStageId ? { id: missionStageId, title: missionTitle, description: problemDescription } : undefined,
        mission: missionTitle ? { title: missionTitle, description: problemDescription } : undefined,
        requirements: currentRequirements,
        components: availableComponents,
        canvasState: enhancedCanvasState,
        currentNodes: enhancedCanvasState.nodes,
        currentEdges: enhancedCanvasState.edges
      });

      const session: MentorChatSession = {
        userId: user.id,
        mentorId: selectedMentorId,
        conversationSessionId,
        // Only pass missionStageId if it's a valid UUID
        missionStageId: missionStageId && isValidUUID(missionStageId) ? missionStageId : undefined,
        missionTitle,
        problemDescription,
        contextData,
      };

      const mentorResponse = await mentorChatService.sendMessage(session, userMessage.content);
      
      const mentorMessage: ChatMessage = {
        id: `mentor-${Date.now()}`,
        content: mentorResponse,
        timestamp: new Date(),
        sender: 'mentor',
        mentorId: selectedMentorId
      };

      setMessages(prev => [...prev, mentorMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: "I'm having trouble responding right now. Could you try again?",
        timestamp: new Date(),
        sender: 'mentor',
        mentorId: selectedMentorId
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [currentInput, isLoading, selectedMentorId, conversationSessionId, user, isAuthenticated, missionStageId, missionTitle, problemDescription, location.pathname, nodes, edges, currentRequirements, availableComponents, requirementsStatus]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMentorChange = (mentorId: string) => {
    setSelectedMentorId(mentorId);
    setShowMentorSelector(false);
    // Clear messages and reload for new mentor
    setMessages([]);
  };

  // ProductTour handlers
  const handleTourComplete = useCallback(() => {
    setShowProductTour(false);
    // Mark that user has seen the tour
    localStorage.setItem('saas_hasSeenProductTour', 'true');
    console.log('Product tour completed!');
  }, []);

  // Notification handlers
  const handleNotificationClose = useCallback(() => {
    if (currentNotification) {
      // Mark the current page notification as seen
      switch (location.pathname) {
        case '/browser/news':
          localStorage.setItem('saas_hasSeenNewsNotification', 'true');
          break;
        case '/email':
          localStorage.setItem('saas_hasSeenEmailNotification', 'true');
          break;
        case '/crisis-design':
          localStorage.setItem('saas_hasSeenDesignNotification', 'true');
          break;
        case '/game':
          localStorage.setItem('saas_hasSeenGameNotification', 'true');
          break;
      }
      setCurrentNotification(null);
    }
  }, [currentNotification, location.pathname]);

  // Hide notification when chat is expanded
  useEffect(() => {
    if (isExpanded && currentNotification) {
      handleNotificationClose();
    }
  }, [isExpanded, currentNotification, handleNotificationClose]);

  const handleNotificationAction = useCallback(() => {
    handleNotificationClose();
  }, [handleNotificationClose]);

  // Show login prompt if user is not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div 
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 99999,
          pointerEvents: 'auto'
        }}
      >
        <button
          onClick={() => {
            // Navigate to auth page or show login prompt
            window.location.href = '/auth';
          }}
          style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #6b7280, #4b5563)',
            border: '3px solid white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s ease',
            opacity: 0.7
          }}
          title="Login to access Mentor Chat"
        >
          <MessageCircle size={24} />
        </button>
      </div>
    );
  }

  if (!isExpanded) {
    return (
      <>
        <div 
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            zIndex: 99999,
            pointerEvents: 'auto'
          }}
        >
          <button
            onClick={() => setIsExpanded(true)}
            style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              border: '3px solid white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              boxShadow: currentNotification 
                ? '0 8px 25px rgba(0, 0, 0, 0.15), 0 0 20px rgba(59, 130, 246, 0.6)' 
                : '0 8px 25px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease',
              animation: currentNotification ? 'mentorPulse 2s infinite' : 'none'
            }}
            title="Open Mentor Chat"
          >
            <MessageCircle size={24} />
            {(messages.length > 1 || currentNotification) && (
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: currentNotification ? '#22c55e' : '#ef4444',
                color: 'white',
                borderRadius: '50%',
                minWidth: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: '600',
                border: '2px solid white'
              }}>
                {currentNotification ? '!' : messages.length - 1}
              </div>
            )}
          </button>
        </div>
        
        {/* ProductTour - renders globally */}
        {showProductTour && (
          <ProductTour
            isActive={showProductTour}
            onComplete={handleTourComplete}
          />
        )}
      </>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 99999,
        width: '360px',
        height: '500px',
        pointerEvents: 'auto'
      }}
    >
      <div className={styles.chatWindow}>
        {/* Chat Header */}
        <div className={styles.chatHeader}>
          <div className={styles.mentorInfo}>
            <div className={styles.mentorAvatarSmall}>
              <Bot size={20} />
            </div>
            <div className={styles.mentorDetails}>
              <button
                onClick={() => setShowMentorSelector(!showMentorSelector)}
                className={styles.mentorSelector}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0,
                  font: 'inherit'
                }}
              >
                <h3 className={styles.mentorName}>
                  {selectedMentor?.name || 'AI Mentor'}
                </h3>
                <ChevronDown size={14} />
              </button>
              <p className={styles.mentorTitle}>
                {selectedMentor?.title || 'System Design Assistant'}
              </p>
              
              {/* Mentor Selector Dropdown */}
              {showMentorSelector && (
                <div className={styles.mentorDropdown}>
                  {Object.values(MENTORS).map((mentor) => (
                    <button
                      key={mentor.id}
                      onClick={() => handleMentorChange(mentor.id)}
                      className={`${styles.mentorOption} ${mentor.id === selectedMentorId ? styles.selected : ''}`}
                    >
                      <div className={styles.mentorOptionContent}>
                        <strong>{mentor.name}</strong>
                        <small>{mentor.specialization}</small>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={styles.chatActions}>
            <button
              onClick={() => setIsExpanded(false)}
              className={styles.minimizeButton}
              aria-label="Minimize chat"
            >
              <Minimize2 size={16} />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className={styles.chatMessages} ref={chatMessagesContainerRef}>
          {messages.map((message, index) => (
            <div
              key={message.id}
              ref={index === messages.length - 1 ? lastMessageRef : null}
              className={`${styles.message} ${
                message.sender === 'user' ? styles.userMessage : styles.mentorMessage
              }`}
            >
              <div className={styles.messageContent}>
                <div className={styles.messageText}>{message.content}</div>
                <div className={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.message} ${styles.mentorMessage}`}>
              <div className={styles.messageContent}>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className={styles.chatInput}>
          <div className={styles.inputContainer}>
            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about system design, architecture patterns, or this mission..."
              className={styles.messageInput}
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!currentInput.trim() || isLoading}
              className={styles.sendButton}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Custom Card Notification - positioned next to MentorChat icon */}
      {currentNotification && !isExpanded && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '100px', // Positioned to the right of the MentorChat icon (60px width + 20px margin + 20px gap)
          right: window.innerWidth < 768 ? '20px' : 'auto', // Make responsive on mobile
          zIndex: 99998, // Just below MentorChat but above everything else
          pointerEvents: 'auto',
          maxWidth: window.innerWidth < 768 ? 'calc(100vw - 140px)' : '320px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            border: '2px solid white',
            borderRadius: '16px',
            padding: '16px 20px',
            color: 'white',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(59, 130, 246, 0.4)',
            position: 'relative',
            animation: 'slideInFromLeft 0.4s ease',
            minWidth: window.innerWidth < 768 ? '240px' : '280px',
            width: '100%',
            backdropFilter: 'blur(10px)'
          }}>
            {/* Speech bubble arrow pointing to MentorChat */}
            <div style={{
              position: 'absolute',
              left: '-8px',
              top: '20px',
              width: '0',
              height: '0',
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              borderRight: '8px solid #3b82f6'
            }} />
            <div style={{
              position: 'absolute',
              left: '-10px',
              top: '18px',
              width: '0',
              height: '0',
              borderTop: '10px solid transparent',
              borderBottom: '10px solid transparent',
              borderRight: '10px solid white',
              zIndex: -1
            }} />

            {/* Close button */}
            <button
              onClick={handleNotificationClose}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              ✕
            </button>

            {/* Notification content */}
            <div style={{ paddingRight: '24px' }}>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white'
              }}>
                {currentNotification.title}
              </h3>
              <p style={{
                margin: '0 0 16px 0',
                fontSize: '14px',
                lineHeight: '1.4',
                color: 'rgba(255, 255, 255, 0.95)'
              }}>
                {currentNotification.message}
              </p>
              
              {/* Action button */}
              {currentNotification.actionLabel && (
                <button
                  onClick={handleNotificationAction}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {currentNotification.actionLabel}
                  <span style={{ fontSize: '12px' }}>→</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 