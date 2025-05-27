'use client';

import { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  ReactFlowInstance,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { InterviewStageConfig } from '@/types/interview-config';

interface CandidateInterviewFlowProps {
  nodes: Node<InterviewStageConfig>[];
  edges: Edge[];
  currentStage?: string; // ID of the current stage the candidate is on
}

// Custom node component for candidate view
function CandidateStageNode({ data, id }: { data: InterviewStageConfig; id: string }) {
  const formatDuration = (duration: string): string => {
    const [hours, minutes] = duration.split(':').map(Number);
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    return parts.join(' ') || '0m';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-4" style={{ width: '240px' }}>
      <div className="space-y-2">
        <h3 className="font-semibold text-slate-900">{data.label}</h3>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {formatDuration(data.config.duration)}
          </span>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            {data.config.questions.length} questions
          </span>
        </div>
      </div>
    </div>
  );
}

const nodeTypes = {
  interviewStage: CandidateStageNode,
};

const defaultEdgeOptions = {
  animated: true,
  style: {
    stroke: '#94a3b8',
    strokeWidth: 2,
  },
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: '#94a3b8',
  },
};

export default function CandidateInterviewFlow({ nodes, edges, currentStage }: CandidateInterviewFlowProps) {
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  }, []);

  // Style nodes based on progress
  const styledNodes = nodes.map(node => ({
    ...node,
    style: {
      ...node.style,
      // Add a highlight for the current stage
      ...(currentStage === node.id && {
        borderColor: '#3b82f6',
        borderWidth: '2px',
        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
      }),
    },
  }));

  return (
    <div className="w-full h-[400px] bg-white rounded-xl border shadow-sm">
      <ReactFlow
        nodes={styledNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onInit={onInit}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        className="bg-slate-50"
        minZoom={0.5}
        maxZoom={1.5}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={12} 
          size={1} 
          color="#e2e8f0" 
        />
        <Controls 
          className="!bg-white !border !shadow-sm !rounded-lg !p-1" 
          showInteractive={false}
          position="bottom-right"
        />
      </ReactFlow>
    </div>
  );
} 