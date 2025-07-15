import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MentorCard, type Mentor } from '../../components/molecules/MentorCard';
import { supabase } from '../../services/supabase';

export const MentorSelectionScreen: React.FC = () => {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('mentors')
        .select('*')
        .order('name');

      if (supabaseError) {
        throw supabaseError;
      }

      setMentors(data || []);
    } catch (err) {
      console.error('Error fetching mentors:', err);
      setError('Failed to load mentors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMentorSelect = (mentor: Mentor) => {
    setSelectedMentor(mentor);
  };

  const handleConfirmSelection = () => {
    if (selectedMentor && scenarioId) {
      // Store selected mentor in localStorage or state management
      localStorage.setItem('selectedMentor', JSON.stringify(selectedMentor));
      
      // Navigate to the actual game screen
      navigate(`/game/scenario/${scenarioId}/design`);
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-300">Loading mentors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="text-red-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Failed to Load Mentors</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchMentors}
            className="btn btn--primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mentor-selection text-white overflow-auto">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mentor-selection__header">
          <h1 className="mentor-selection__title">
            Choose Your Mentor
          </h1>
          <p className="mentor-selection__subtitle">
            Select an expert to guide you through this challenge
          </p>
          <p className="mentor-selection__description">
            Each mentor brings unique expertise and perspective to help you succeed
          </p>
        </div>

        {mentors.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Mentors Available</h3>
            <p className="text-gray-400">
              Mentors are currently being prepared for your journey.
            </p>
          </div>
        ) : (
          <>
            <div className="mentor-selection__grid">
              {mentors.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  selected={selectedMentor?.id === mentor.id}
                  onSelect={handleMentorSelect}
                />
              ))}
            </div>

            {selectedMentor && (
              <div className="mentor-selection__confirmation">
                <div className="mentor-selection__confirmation-content">
                  <div className="mentor-selection__confirmation-info">
                    <div className="mentor-selection__confirmation-avatar">
                      {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="mentor-selection__confirmation-details">
                      <h4>{selectedMentor.name}</h4>
                      <p>{selectedMentor.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleConfirmSelection}
                    className="btn btn--primary px-6 py-2"
                  >
                    Continue with {selectedMentor.name.split(' ')[0]}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};