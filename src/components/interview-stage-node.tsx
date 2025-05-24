'use client';

import { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card } from './ui/card';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Settings, Timer, MessageSquare, AlertCircle, Clock, MessageCircle } from 'lucide-react';
import type { InterviewStageConfig } from '@/types/interview-config';

interface StageConfigurationProps {
  data: InterviewStageConfig;
  onUpdate: (data: InterviewStageConfig) => void;
}

function StageConfiguration({ data, onUpdate }: StageConfigurationProps) {
  const [localData, setLocalData] = useState(data);

  const handleUpdate = () => {
    onUpdate(localData);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Stage Name</Label>
        <Input
          value={localData.label}
          onChange={(e) => setLocalData({ ...localData, label: e.target.value })}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Duration</Label>
        <Input
          value={localData.config.duration}
          onChange={(e) => setLocalData({
            ...localData,
            config: { ...localData.config, duration: e.target.value }
          })}
          placeholder="e.g., 15-20 mins"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Questions</Label>
        <Textarea
          value={localData.config.questions.join('\n')}
          onChange={(e) => setLocalData({
            ...localData,
            config: { ...localData.config, questions: e.target.value.split('\n').filter(q => q.trim()) }
          })}
          placeholder="Enter questions, one per line"
          className="mt-1.5 min-h-[100px]"
        />
      </div>

      <div>
        <Label>Pass Criteria</Label>
        <Input
          placeholder="e.g., Minimum score 7/10"
          className="mt-1.5"
        />
      </div>

      <Button className="w-full mt-6" onClick={handleUpdate}>
        Save Changes
      </Button>
    </div>
  );
}

export default function InterviewStageNode({ data, isConnectable }: NodeProps<InterviewStageConfig>) {
  const [stageData, setStageData] = useState(data);

  const handleConfigUpdate = (newData: InterviewStageConfig) => {
    setStageData(newData);
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2 !bg-slate-300 border-2 border-white"
      />
      
      <div className="bg-white rounded-lg shadow-lg border border-slate-200" style={{ width: '240px' }}>
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">{stageData.label}</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-slate-900">
                  <Settings className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configure {stageData.label}</DialogTitle>
                </DialogHeader>
                <StageConfiguration data={stageData} onUpdate={handleConfigUpdate} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-xs text-slate-600">
              <Clock className="w-3 h-3 mr-1.5 text-slate-400" />
              <span>{stageData.config.duration}</span>
            </div>
            
            <div className="flex items-center text-xs text-slate-600">
              <MessageCircle className="w-3 h-3 mr-1.5 text-slate-400" />
              <span>{stageData.config.questions.length} questions</span>
            </div>

            <div className="flex items-center text-xs text-slate-600">
              <AlertCircle className="w-3 h-3 mr-1.5 text-slate-400" />
              <span>Pass criteria not set</span>
            </div>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2 h-2 !bg-slate-300 border-2 border-white"
      />
    </>
  );
} 