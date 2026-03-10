"use client";

// ClientShell.tsx — Minimal client boundary.
// Only this component and its children opt into the client JS bundle.
// Keeps page.tsx as a pure server component for instant SSR.

import ClientGrid from "@/components/ClientGrid";
import TwinClockConverter from "@/components/TimeConverter";
import { useLocalStorage } from "@/lib/useStorage";
import { Client } from "@/components/ClientCard";

export default function ClientShell() {
  const [clients, setClients] = useLocalStorage<Client[]>("timebridge-clients", []);

  const addClient = (newClient: Omit<Client, "id">) => {
    const id = Math.random().toString(36).slice(2, 11);
    setClients((prev) => [...prev, { ...newClient, id }]);
  };

  const removeClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <main className="space-y-32 pb-40">
      <section id="clients">
        <ClientGrid clients={clients} onAdd={addClient} onRemove={removeClient} />
      </section>

      <section id="converter">
        <TwinClockConverter clients={clients} />
      </section>
    </main>
  );
}
