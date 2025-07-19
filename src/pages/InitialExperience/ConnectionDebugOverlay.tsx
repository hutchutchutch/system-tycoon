import React from 'react';
import { useStore } from '@xyflow/react';

// Debug overlay to show connection state
export const ConnectionDebugOverlay: React.FC = () => {
  const connectionNodeId = useStore((state) => state.connectionNodeId);
  const connectionHandleId = useStore((state) => state.connectionHandleId);
  const connectionHandleType = useStore((state) => state.connectionHandleType);
  const isConnecting = connectionNodeId !== null;

  if (!isConnecting) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        right: 10,
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 1000,
        fontFamily: 'monospace',
      }}
    >
      <div>🔗 Connecting from:</div>
      <div>Node ID: {connectionNodeId}</div>
      <div>Handle ID: {connectionHandleId || 'default'}</div>
      <div>Handle Type: {connectionHandleType}</div>
    </div>
  );
};