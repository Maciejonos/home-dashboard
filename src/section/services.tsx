import React, { useEffect } from "react";
import { ServiceStatus, useStatus } from "../api/status";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PutService, usePutService } from "../api/service";

function Service({
  name,
  status,
  sv_name,
  url,
  host,
}: ServiceStatus & { host: string }) {
  return (
    <Card className="min-w-70 flex-1">
      <div className="px-4">
        <span className="overflow-hidden text-ellipsis inline-block w-[60%]">
          {name}
        </span>
        <Badge
          variant={status === "active" ? "default" : "destructive"}
          className="ml-2 float-right"
        >
          {status}
        </Badge>
      </div>
      <CardContent>
        <div className="text-xs text-gray-500">
          {sv_name}
          <span className="text-xs text-gray-400">@{host}</span>
        </div>
        {!!url && (
          <a
            className="text-xs text-blue-500 hover:underline break-all mt-2"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {url}
          </a>
        )}
      </CardContent>
    </Card>
  );
}

function AddService() {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<PutService>({
    name: "",
    url: "",
    sv_name: "",
  });
  const { mutate } = usePutService(() => {
    setOpen(false);
  });

  useEffect(() => {
    setForm({ name: "", url: "", sv_name: "" });
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ hostname: "media.local:18745", data: form });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={submit}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
              required
              className="mb-4"
            />
            <Input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="URL"
              className="mb-4"
            />
            <Input
              value={form.sv_name}
              onChange={(e) => setForm({ ...form, sv_name: e.target.value })}
              placeholder="Linux Service Name"
              required
            />
          </DialogDescription>
          <DialogFooter>
            <Button type="submit" onClick={submit}>
              Add Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export function Services() {
  const [search, setSearch] = React.useState("");
  const media = useStatus("media.local:18745");
  const node1 = useStatus("node1.local:18745");

  return (
    <div>
      <div className="flex gap-4 mb-4 items-center">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services..."
        />
        <AddService />
      </div>
      <div className="flex gap-4 flex-wrap mb-4">
        {[
          media.data?.services.map((sv) => ({
            ...sv,
            host: media.data.network.hostname,
          })) ?? [],
          node1.data?.services.map((sv) => ({
            ...sv,
            host: node1.data.network.hostname,
          })) ?? [],
        ]
          .flat()
          .sort(
            (a, b) =>
              Number(b.status === "active") - Number(a.status === "active")
          )
          .filter(
            (service) =>
              service.name.toLowerCase().includes(search.toLowerCase()) ||
              service.sv_name.toLowerCase().includes(search.toLowerCase())
          )
          .map((service) => (
            <Service key={service.sv_name} {...service} />
          ))}
      </div>
    </div>
  );
}
