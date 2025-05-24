'use client';

import { useCallback, useState, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeTypes,
  Panel,
  BackgroundVariant,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card } from './ui/card';
import InterviewStageNode from './interview-stage-node';
import type { InterviewStageConfig } from '@/types/interview-config';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Trash2, Plus, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

// Stage templates that can be dragged onto the canvas
const stageTemplates: InterviewStageConfig[] = [
  {
    label: 'Initial Screening',
    config: {
      questions: [],
      duration: '5-10 mins',
      type: 'screening'
    }
  },
  {
    label: 'Technical Assessment',
    config: {
      questions: [],
      duration: '15-20 mins',
      type: 'technical'
    }
  },
  {
    label: 'Behavioral Questions',
    config: {
      questions: [],
      duration: '10-15 mins',
      type: 'behavioral'
    }
  },
  {
    label: 'Coding Challenge',
    config: {
      questions: [],
      duration: '45-60 mins',
      type: 'technical'
    }
  },
  {
    label: 'Final Assessment',
    config: {
      questions: [],
      duration: '5-10 mins',
      type: 'assessment'
    }
  }
];

// Custom stage template
const customStageTemplate: InterviewStageConfig = {
  label: 'Custom Stage',
  config: {
    questions: [],
    duration: 'Custom duration',
    type: 'custom'
  }
};

// Custom node types
const nodeTypes: NodeTypes = {
  interviewStage: InterviewStageNode,
};

export interface InterviewWorkflowProps {
  onWorkflowChange?: (nodes: Node<InterviewStageConfig>[], edges: Edge[]) => void;
}

const defaultEdgeOptions = {
  animated: true,
  style: {
    stroke: '#94a3b8',
    strokeWidth: 2,
  },
};

const controlStyles = {
  button: {
    width: '24px',
    height: '24px',
    padding: '2px',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f8fafc',
    },
  },
  zoomContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '4px',
    backgroundColor: 'white',
    borderRadius: '6px',
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    border: '1px solid #e2e8f0',
  },
};

export default function InterviewWorkflow({ onWorkflowChange }: InterviewWorkflowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<InterviewStageConfig>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  }, []);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      onWorkflowChange?.(nodes, newEdges);
    },
    [edges, nodes, onWorkflowChange]
  );

  const onDragStart = (event: React.DragEvent, template: InterviewStageConfig) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(template));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const template = JSON.parse(
        event.dataTransfer.getData('application/reactflow')
      ) as InterviewStageConfig;

      // Calculate the center position of the viewport
      const { width, height } = reactFlowBounds;
      const position = reactFlowInstance.project({
        x: width / 2 - 150, // Half of the node width
        y: height / 2 - 75, // Half of the node height
      });

      const newNode: Node<InterviewStageConfig> = {
        id: `${template.label}-${nodes.length + 1}`,
        type: 'interviewStage',
        position,
        data: template,
        style: { width: 250 },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, reactFlowInstance]
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  };

  const deleteSelectedNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nodes) => nodes.filter((node) => node.id !== selectedNode));
      setEdges((edges) => edges.filter(
        (edge) => edge.source !== selectedNode && edge.target !== selectedNode
      ));
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  return (
    <div className="relative w-full h-[600px] bg-white rounded-xl border shadow-sm">
      <div className="absolute left-0 top-0 h-full w-64 border-r bg-slate-50/50 z-10">
        <div className="p-4 border-b bg-white">
          <h3 className="font-semibold text-sm text-slate-900">Interview Stages</h3>
          <p className="text-xs text-slate-500 mt-1">Drag stages onto the canvas to build your workflow</p>
        </div>
        <ScrollArea className="bg-white h-[calc(100%-5rem)]">
          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Standard Stages</h4>
              {stageTemplates.map((template, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => onDragStart(e, template)}
                  className="bg-white p-3 rounded-lg border shadow-sm cursor-move hover:border-blue-200 hover:shadow-md transition-all group"
                >
                  <h4 className="text-sm font-medium text-slate-900 group-hover:text-blue-600">{template.label}</h4>
                  <p className="text-xs text-slate-500 mt-1">{template.config.duration}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Custom Stage</h4>
              <div
                draggable
                onDragStart={(e) => onDragStart(e, customStageTemplate)}
                className="bg-white p-3 rounded-lg border border-dashed border-slate-300 cursor-move hover:border-blue-200 hover:shadow-md transition-all group"
              >
                <h4 className="text-sm font-medium text-slate-900 group-hover:text-blue-600 flex items-center">
                  <Plus className="w-4 h-4 mr-2 text-slate-400 group-hover:text-blue-500" />
                  Custom Stage
                </h4>
                <p className="text-xs text-slate-500 mt-1">Create your own stage</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      <div ref={reactFlowWrapper} className="h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={onInit}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          onDragOver={onDragOver}
          onDrop={onDrop}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          className="bg-slate-50"
          minZoom={0.1}
          maxZoom={1.5}
          snapToGrid={true}
          snapGrid={[16, 16]}
        >
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={12} 
            size={1} 
            color="#e2e8f0" 
          />
          <Controls 
            className="!bg-white !border !shadow-sm !rounded-lg !p-1 !z-50" 
            style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
            showInteractive={false}
            position="top-right"
          />
          <Panel position="top-right" className="flex gap-2 !z-50">
            {selectedNode && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={deleteSelectedNode}
                className="flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete Stage
              </Button>
            )}
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
} 