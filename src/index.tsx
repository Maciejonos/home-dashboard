import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Card, CardContent } from "@/components/ui/card";
import "./styles/globals.css";
import clsx from "clsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useStatus } from "./api/status";
import { Hardware } from "./section/hardware";
import { DockerContainerList } from "./section/containers";
import { Calendar } from "@/components/ui/calendar";
import { ThemeSwitcher } from "./themeSwitcher";
import { Button } from "@/components/ui/button";
import { AlignHorizontalSpaceAroundIcon } from "lucide-react";

const App: React.FC = () => {
  const [wide, setWide] = useState(true);
  useStatus("media.local:18745");

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <Button onClick={() => setWide(!wide)} variant="outline" size="sm">
          <AlignHorizontalSpaceAroundIcon />
        </Button>
        <ThemeSwitcher />
      </div>

      <div
        className={clsx("mx-auto flex gap-4 flex-wrap", {
          "max-w-4xl": !wide,
        })}
      >
        <nav className="flex-grow w-full">
          <Card>
            <CardContent>Search?</CardContent>
          </Card>
        </nav>
        <aside className="w-64">
          <Card>
            <CardContent>
              <Calendar
                className="mx-auto"
                mode="single"
                selected={new Date()}
              />
            </CardContent>
          </Card>
        </aside>
        <main className="flex-1 @container">
          <Card className="mb-4">
            <CardContent>main</CardContent>
          </Card>
          <DockerContainerList />
        </main>
        <aside className="w-64">
          <Hardware hostname="media.local:18745" />
          <Hardware hostname="node1.local:18745" />
        </aside>
      </div>
    </div>
  );
};

const queryClient = new QueryClient();

const Root = () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<Root />);
