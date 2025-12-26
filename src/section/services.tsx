import React, { useEffect } from "react";
import { ServiceStatus, useStatus } from "../api/status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Loader, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PutService, useDeleteService, usePutService } from "../api/service";
import { API_HOST } from "../api/config.";

function Service({
  name,
  status,
  sv_name,
  url,
  host,
}: ServiceStatus & { host: string }) {
  const { mutate: deleteService, isPending } = useDeleteService();

  return (
    <>
      <span className="overflow-hidden text-ellipsis text-nowrap">{name}</span>
      <Badge
        variant={status === "active" ? "default" : "destructive"}
        className="ml-2"
      >
        {status}
      </Badge>
      <span>{sv_name}</span>
      <span>{host.split(":")[0]}</span>
      {url ? (
        <a
          className="text-blue-500 hover:underline overflow-hidden text-ellipsis text-nowrap block"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {url}
        </a>
      ) : (
        <div />
      )}
      <Button
        variant="ghost"
        className="text-destructive"
        onClick={() => deleteService({ hostname: host, svName: sv_name })}
      >
        {isPending ? <Loader className="animate-spin" /> : <Trash2 />}
      </Button>
    </>
  );
}

function AddService() {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<
    PutService & {
      hostname: string;
    }
  >({
    name: "",
    url: "",
    sv_name: "",
    hostname: "",
  });
  const { mutate } = usePutService(() => {
    setOpen(false);
  });

  useEffect(() => {
    setForm({ name: "", url: "", sv_name: "", hostname: API_HOST });
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ hostname: form.hostname, data: form });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={submit}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
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
              className="mb-4"
            />
            <Input
              value={form.hostname}
              onChange={(e) => setForm({ ...form, hostname: e.target.value })}
              placeholder="Host"
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
  const [open, setOpen] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const media = useStatus(API_HOST);
  const node1 = useStatus("node1.local:18745");

  return (
    <Card className="mb-4">
      <CardHeader className="flex justify-between">
        <CardTitle>Services</CardTitle>
        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="relative left-2 bottom-2"
        >
          {open ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </CardHeader>
      {open && (
        <>
          <CardContent>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="w-full"
            />
          </CardContent>
          <CardContent className="grid gap-2 grid-cols-[200px_70px_1fr_1fr_1fr_28px]">
            {[
              media.data?.services.map((sv) => ({
                ...sv,
                host: API_HOST,
              })) ?? [],
              node1.data?.services.map((sv) => ({
                ...sv,
                host: "node1.local:18745",
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
          </CardContent>
        </>
      )}
    </Card>
  );
}
