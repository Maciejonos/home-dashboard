import { useQuery } from "@tanstack/react-query";

export type DockerContainerStatus = {
  id: string;
  name: string;
  running: boolean;
  image: string;
};

export type NodeStatus = {
  services: never[];
  docker: DockerContainerStatus[];
  hardware: {
    cpu_idle_percentages: {
      all: number;
      [key: `core${number}`]: number;
    };
    ram: [string, string, string];
    disk: Record<
      string,
      {
        available: string;
        mount: string;
        percent: string;
        size: string;
        used: string;
      }
    >;
    temperature: string;
    uptime: string;
  };
  network: {
    hostname: string;
    external_ip: string;
    local_ip: string[];
  };
};

export function createStatusOptions(hostname: string) {
  return {
    queryKey: ["status", hostname],
    queryFn: () =>
      fetch(`http://${hostname}/api/status`).then(
        (res) => res.json() as Promise<NodeStatus>
      ),
    refetchInterval: 5000,
  };
}

export function useStatus(hostname: string) {
  return useQuery(createStatusOptions(hostname));
}
