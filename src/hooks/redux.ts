import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import { useCallback } from 'react';
import type { RootState, AppDispatch } from '../store';

// Typed hooks following Redux Toolkit patterns
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom mentor chat hooks following Redux patterns
export const useMentorChat = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const activeSessionId = useAppSelector(state => state.mentor.activeConversationSessionId);
  const messages = useAppSelector(state => {
    const sessionId = state.mentor.activeConversationSessionId;
    return sessionId ? state.mentor.messages[sessionId] || [] : [];
  });
  const selectedMentorId = useAppSelector(state => state.mentor.selectedMentorId);
  const isExpanded = useAppSelector(state => state.mentor.isExpanded);
  const isLoading = useAppSelector(state => state.mentor.isLoading);
  const connectionStatus = useAppSelector(state => state.mentor.connectionStatus);
  const error = useAppSelector(state => state.mentor.error);
  
  // Actions
  const createSession = useCallback((params: {
    missionStageId?: string;
    missionTitle?: string;
    problemDescription?: string;
  }) => {
    dispatch({
      type: 'mentor/createConversationSession',
      payload: params,
    });
  }, [dispatch]);
  
  const setActiveSession = useCallback((sessionId: string) => {
    dispatch({
      type: 'mentor/setActiveConversationSession',
      payload: sessionId,
    });
  }, [dispatch]);
  
  const addMessage = useCallback((sessionId: string, message: any) => {
    dispatch({
      type: 'mentor/addMessage',
      payload: { sessionId, message },
    });
  }, [dispatch]);
  
  const setExpanded = useCallback((expanded: boolean) => {
    dispatch({
      type: 'mentor/setExpanded',
      payload: expanded,
    });
  }, [dispatch]);
  
  const setSelectedMentor = useCallback((mentorId: string) => {
    dispatch({
      type: 'mentor/setSelectedMentor',
      payload: mentorId,
    });
  }, [dispatch]);
  
  const setLoading = useCallback((loading: boolean) => {
    dispatch({
      type: 'mentor/setLoading',
      payload: loading,
    });
  }, [dispatch]);
  
  const clearError = useCallback(() => {
    dispatch({ type: 'mentor/clearError' });
  }, [dispatch]);
  
  return {
    // State
    activeSessionId,
    messages,
    selectedMentorId,
    isExpanded,
    isLoading,
    connectionStatus,
    error,
    
    // Actions
    createSession,
    setActiveSession,
    addMessage,
    setExpanded,
    setSelectedMentor,
    setLoading,
    clearError,
  };
};

// Custom collaboration hooks following Redux patterns
export const useCollaboration = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const sentInvitations = useAppSelector(state => state.collaboration.sentInvitations);
  const receivedInvitations = useAppSelector(state => state.collaboration.receivedInvitations);
  const unreadCount = useAppSelector(state => state.collaboration.unreadInvitationsCount);
  const isSending = useAppSelector(state => state.collaboration.isSendingInvitation);
  const isLoading = useAppSelector(state => state.collaboration.isLoading);
  const isUpdating = useAppSelector(state => state.collaboration.isUpdatingInvitation);
  const error = useAppSelector(state => state.collaboration.error);
  const sendError = useAppSelector(state => state.collaboration.sendError);
  
  // Actions
  const sendInvitation = useCallback(async (params: {
    inviteeEmail: string;
    missionStageId: string;
    missionId: string;
  }) => {
    return dispatch({
      type: 'collaboration/sendInvitation',
      payload: params,
    });
  }, [dispatch]);
  
  const loadInvitations = useCallback(() => {
    dispatch({ type: 'collaboration/loadInvitations' });
  }, [dispatch]);
  
  const updateInvitationStatus = useCallback((params: {
    invitationId: string;
    status: 'accepted' | 'declined';
  }) => {
    return dispatch({
      type: 'collaboration/updateStatus',
      payload: params,
    });
  }, [dispatch]);
  
  const clearError = useCallback(() => {
    dispatch({ type: 'collaboration/clearError' });
  }, [dispatch]);
  
  const markAsRead = useCallback((invitationId: string) => {
    dispatch({
      type: 'collaboration/markInvitationAsRead',
      payload: invitationId,
    });
  }, [dispatch]);
  
  return {
    // State
    sentInvitations,
    receivedInvitations,
    unreadCount,
    isSending,
    isLoading,
    isUpdating,
    error,
    sendError,
    
    // Actions
    sendInvitation,
    loadInvitations,
    updateInvitationStatus,
    clearError,
    markAsRead,
  };
};