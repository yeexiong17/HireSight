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
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import InterviewStageNode from './interview-stage-node';
import type { InterviewStageConfig } from '@/types/interview-config';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Trash2, Plus, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

// Base stage templates that can't be removed
const baseStageTemplates: InterviewStageConfig[] = [
  {
    label: 'Initial Screening',
    config: {
      questions: [],
      duration: '00:05',
      type: 'screening'
    }
  },
  {
    label: 'Technical Assessment',
    config: {
      questions: [],
      duration: '00:15',
      type: 'technical'
    }
  },
  {
    label: 'Behavioral Questions',
    config: {
      questions: [],
      duration: '00:15',
      type: 'behavioral'
    }
  },
  {
    label: 'Coding Challenge',
    config: {
      questions: [],
      duration: '00:45',
      type: 'technical'
    }
  },
  {
    label: 'Final Assessment',
    config: {
      questions: [],
      duration: '00:10',
      type: 'assessment'
    }
  }
];

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
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: '#94a3b8',
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

interface DurationInputProps {
  value: string;
  onChange: (duration: string) => void;
}

const DurationInput = ({ value, onChange }: DurationInputProps) => {
  // Parse current duration string into hours and minutes
  const [hours, minutes] = value.split(':').map(Number) || [0, 0];

  const handleChange = (newHours: number, newMinutes: number) => {
    const formattedHours = String(newHours).padStart(2, '0');
    const formattedMinutes = String(newMinutes).padStart(2, '0');
    onChange(`${formattedHours}:${formattedMinutes}`);
  };

  return (
    <div className="flex items-center gap-2">
      <div>
        <Select
          value={String(hours)}
          onValueChange={(value) => handleChange(Number(value), minutes)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Hours" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 5 }, (_, i) => (
              <SelectItem key={i} value={String(i)}>
                {i} {i === 1 ? 'hour' : 'hours'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <span className="text-slate-500">:</span>

      <div>
        <Select
          value={String(minutes)}
          onValueChange={(value) => handleChange(hours, Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Minutes" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => i * 5).map((mins) => (
              <SelectItem key={mins} value={String(mins)}>
                {String(mins).padStart(2, '0')} min
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default function InterviewWorkflow({ onWorkflowChange }: InterviewWorkflowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<InterviewStageConfig>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [customStages, setCustomStages] = useState<InterviewStageConfig[]>([]);
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [newStage, setNewStage] = useState<InterviewStageConfig>({
    label: '',
    config: {
      questions: [],
      duration: '',
      type: 'custom'
    }
  });

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  }, []);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      // Check if the source node already has any outgoing connections
      const sourceOutgoingConnections = edges.filter(edge => edge.source === params.source);
      // Check if the target node already has any incoming connections
      const targetIncomingConnections = edges.filter(edge => edge.target === params.target);

      // Show error toast if trying to make invalid connections
      if (sourceOutgoingConnections.length > 0) {
        toast.error("Invalid Connection", {
          description: "A stage can only connect to one next stage. Please remove the existing connection first."
        });
        return;
      }
      
      if (targetIncomingConnections.length > 0) {
        toast.error("Invalid Connection", {
          description: "A stage can only have one previous stage. Please remove the existing connection first."
        });
        return;
      }

      if (params.source === params.target) {
        toast.error("Invalid Connection", {
          description: "A stage cannot connect to itself."
        });
        return;
      }

      // Only allow the connection if all validations pass
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      onWorkflowChange?.(nodes, newEdges);
    },
    [edges, nodes, onWorkflowChange]
  );

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, template: InterviewStageConfig) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(template));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const template = JSON.parse(
        event.dataTransfer.getData('application/reactflow')
      ) as InterviewStageConfig;

      // Calculate the center position of the viewport
      const { width, height } = reactFlowBounds;
      const position = reactFlowInstance.project({
        x: width / 2 - 125, // Half of the node width
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
    // Add a test toast to verify functionality
    toast.success('Node clicked', {
      description: `You clicked on node: ${node.id}`
    });
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

  const handleAddStage = () => {
    if (newStage.label && newStage.config.duration) {
      setCustomStages([...customStages, newStage]);
      setNewStage({
        label: '',
        config: {
          questions: [],
          duration: '',
          type: 'custom'
        }
      });
      setIsAddingStage(false);
    }
  };

  const handleRemoveStage = (index: number) => {
    setCustomStages(customStages.filter((_, i) => i !== index));
  };

  const formatDuration = (duration: string): string => {
    const [hours, minutes] = duration.split(':').map(Number);
    const parts = [];
    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    if (minutes > 0) {
      parts.push(`${minutes}m`);
    }
    return parts.join(' ') || '0m';
  };

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
              {baseStageTemplates.map((template, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => onDragStart(e, template)}
                  className="bg-white p-3 rounded-lg border shadow-sm cursor-move hover:border-blue-200 hover:shadow-md transition-all group"
                >
                  <h4 className="text-sm font-medium text-slate-900 group-hover:text-blue-600">{template.label}</h4>
                  <p className="text-xs text-slate-500 mt-1">{formatDuration(template.config.duration)}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Custom Stages</h4>
                <Dialog open={isAddingStage} onOpenChange={setIsAddingStage}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Custom Stage</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Stage Name</Label>
                        <Input
                          value={newStage.label}
                          onChange={(e) => setNewStage({
                            ...newStage,
                            label: e.target.value
                          })}
                          placeholder="Enter stage name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <DurationInput
                          value={newStage.config.duration}
                          onChange={(duration) => setNewStage({
                            ...newStage,
                            config: {
                              ...newStage.config,
                              duration
                            }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={newStage.config.type}
                          onValueChange={(value: any) => setNewStage({
                            ...newStage,
                            config: {
                              ...newStage.config,
                              type: value
                            }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="screening">Screening</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                            <SelectItem value="behavioral">Behavioral</SelectItem>
                            <SelectItem value="assessment">Assessment</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddingStage(false)}>Cancel</Button>
                      <Button onClick={handleAddStage}>Add Stage</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {customStages.map((stage, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => onDragStart(e, stage)}
                  className="group relative bg-white p-3 rounded-lg border shadow-sm cursor-move hover:border-blue-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-slate-900 group-hover:text-blue-600">{stage.label}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveStage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{formatDuration(stage.config.duration)}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      <div ref={reactFlowWrapper} className="h-full p-0">
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