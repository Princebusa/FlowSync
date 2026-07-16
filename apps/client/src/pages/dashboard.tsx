import {
  apiGetAllWorkflows,
  apiCreateWorkflow,
  apiExecuteWorkflow,
  apiStopWorkflowExecution,
} from "../lib/api";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Plus, Play, Square, ExternalLink, LogOut } from "lucide-react";
import { Button } from "../components/ui/button";

export default function Dashboard() {
  const { logout } = useAuth();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkflows = async () => {
      const workflows = await apiGetAllWorkflows();
      setData(workflows);
    };

    fetchWorkflows();
    const interval = setInterval(fetchWorkflows, 5000);
    return () => clearInterval(interval);
  }, []);

  const createNewWorkflow = async () => {
    setLoading(true);
    try {
      const response = await apiCreateWorkflow({
        name: `Workflow ${data.length + 1}`,
        nodes: [],
        edges: [],
      });
      navigate(`/workflow/${response._id}`);
    } catch (error) {
      console.error("Failed to create workflow:", error);
    } finally {
      setLoading(false);
    }
  };

  const executeWorkflow = async (workflowId: string) => {
    try {
      await apiExecuteWorkflow(workflowId);
    } catch (error) {
      console.error("Failed to execute workflow:", error);
      alert("Failed to execute workflow.");
    }
  };

  const stopWorkflow = async (workflowId: string) => {
    try {
      await apiStopWorkflowExecution(workflowId);
    } catch (error) {
      console.error("Failed to stop workflow:", error);
      alert("Failed to stop workflow.");
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-second text-lg font-semibold tracking-tight">
              FlowSync
            </Link>
            <span className="text-border">/</span>
            <span className="text-sm text-muted-foreground">Workflows</span>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={createNewWorkflow} disabled={loading} size="sm">
              <Plus className="h-4 w-4" />
              {loading ? "Creating..." : "New workflow"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {data.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-card/50 px-8 py-16 text-center">
            <h2 className="font-second text-xl font-medium tracking-tight">No workflows yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first automation to get started.
            </p>
            <Button onClick={createNewWorkflow} disabled={loading} className="mt-6" size="sm">
              <Plus className="h-4 w-4" />
              New workflow
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((itm: any, index: number) => (
              <div
                key={itm._id || index}
                className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-second text-base font-medium tracking-tight">
                      {itm.name || `Workflow ${index + 1}`}
                    </h3>
                    {itm.isRunning ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        Running
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        Idle
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {itm.nodes?.length || 0} nodes
                  </p>
                </div>

                <div className="mt-6 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/workflow/${itm._id}`)}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open
                  </Button>
                  <Button
                    size="sm"
                    variant={itm.isRunning ? "destructive" : "default"}
                    className="flex-1"
                    onClick={() =>
                      itm.isRunning ? stopWorkflow(itm._id) : executeWorkflow(itm._id)
                    }
                  >
                    {itm.isRunning ? (
                      <>
                        <Square className="h-3.5 w-3.5" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" />
                        Run
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
