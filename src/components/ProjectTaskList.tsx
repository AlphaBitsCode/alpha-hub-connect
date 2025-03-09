
import { useState } from "react";
import { CheckCircle, Circle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export const ProjectTaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Initial project setup', completed: true },
    { id: '2', text: 'Collect client requirements', completed: false },
    { id: '3', text: 'Complete project timeline', completed: false },
  ]);
  const [newTaskText, setNewTaskText] = useState("");

  const addTask = () => {
    if (newTaskText.trim() === "") return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskText("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <Card className="glass-card border-white/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-white flex items-center">
          Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Input
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Add a new task..."
              className="glass border-white/20 text-white placeholder:text-white/60"
            />
            <Button 
              onClick={addTask}
              size="icon" 
              className="bg-alphabits-teal hover:bg-alphabits-teal/90 text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-3 space-y-1.5">
            {tasks.map(task => (
              <div 
                key={task.id} 
                className="flex items-center justify-between py-2 px-3 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="text-white hover:text-alphabits-teal transition-colors"
                  >
                    {task.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>
                  <span 
                    className={`text-white ${task.completed ? 'line-through opacity-70' : ''}`}
                  >
                    {task.text}
                  </span>
                </div>
                <button
                  onClick={() => removeTask(task.id)}
                  className="text-white/60 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
