import { useEffect, useState, useCallback } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Tool } from "@modelcontextprotocol/sdk/types.js";

interface AppsTabProps {
  tools: Tool[];
  listTools: () => void;
  error: string | null;
}

// Type guard to check if a tool has UI metadata
const hasUIMetadata = (tool: Tool): boolean => {
  const meta = (tool as { _meta?: { ui?: { resourceUri?: string } } })._meta;
  return !!meta?.ui?.resourceUri;
};

const AppsTab = ({ tools, listTools, error }: AppsTabProps) => {
  const [appTools, setAppTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  // Filter tools that have UI metadata
  useEffect(() => {
    const filtered = tools.filter(hasUIMetadata);
    setAppTools(filtered);

    // If current selected tool is no longer available, reset selection
    if (selectedTool && !filtered.find(t => t.name === selectedTool.name)) {
      setSelectedTool(null);
    }
  }, [tools, selectedTool]);

  const handleRefresh = useCallback(() => {
    listTools();
  }, [listTools]);

  return (
    <TabsContent value="apps" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">MCP Apps</h2>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {appTools.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No MCP Apps available. Apps are tools that include a{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">
              _meta.ui.resourceUri
            </code>{" "}
            field in their tool definition.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appTools.map((tool) => {
            const meta = (tool as { _meta?: { ui?: { resourceUri?: string } } })
              ._meta;
            const resourceUri = meta?.ui?.resourceUri || "";

            return (
              <div
                key={tool.name}
                className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
                onClick={() => setSelectedTool(tool)}
              >
                <h3 className="font-semibold text-lg mb-2">{tool.name}</h3>
                {tool.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {tool.description}
                  </p>
                )}
                <div className="text-xs text-muted-foreground">
                  <span className="font-mono bg-muted px-1 py-0.5 rounded">
                    {resourceUri}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedTool && (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">
            Selected: {selectedTool.name}
          </h3>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              MCP Apps UI rendering is coming soon. For now, you can see which
              tools support the Apps extension. Full rendering support with the
              official React components will be added in a future update.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </TabsContent>
  );
};

export default AppsTab;
