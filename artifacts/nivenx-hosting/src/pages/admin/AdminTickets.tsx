import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Ticket, MessageSquare, Clock } from "lucide-react";

interface TicketRow {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  user?: { name: string; email: string };
}

interface TicketDetail extends TicketRow {
  message: string;
  replies: { id: string; message: string; isStaff: boolean; createdAt: string }[];
}

const statusColors: Record<string, string> = {
  open: "text-green-400 bg-green-400/10 border-green-400/20",
  pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  closed: "text-gray-400 bg-gray-400/10 border-gray-400/20",
};
const priorityColors: Record<string, string> = {
  low: "text-blue-400", medium: "text-yellow-400", high: "text-orange-400", urgent: "text-red-400",
};

export default function AdminTickets() {
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<TicketDetail | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const fetchTickets = () => {
    api.get<TicketRow[]>("/admin/tickets").then(t => { setTickets(t); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { fetchTickets(); }, []);

  const openTicket = async (id: string) => {
    const t = await api.get<TicketDetail>(`/tickets/${id}`);
    setSelected(t);
  };

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSending(true);
    try {
      await api.post(`/admin/tickets/${selected.id}/reply`, { message: reply });
      setReply("");
      const updated = await api.get<TicketDetail>(`/tickets/${selected.id}`);
      setSelected(updated);
      fetchTickets();
    } catch (err: any) { alert(err.message); }
    finally { setSending(false); }
  };

  const changeStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/tickets/${id}/status`, { status });
      fetchTickets();
      if (selected?.id === id) {
        const updated = await api.get<TicketDetail>(`/tickets/${id}`);
        setSelected(updated);
      }
    } catch (err: any) { alert(err.message); }
  };

  if (selected) {
    return (
      <AdminLayout title="Tickets">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="ghost" size="sm" onClick={() => setSelected(null)} className="text-gray-400 hover:text-white">← Back</Button>
            <h2 className="text-white font-semibold">{selected.subject}</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[selected.status]}`}>{selected.status}</span>
            <span className={`text-xs font-medium ${priorityColors[selected.priority]}`}>{selected.priority}</span>
            <div className="ml-auto flex gap-2">
              {["open","pending","closed"].map(s => (
                <Button key={s} size="sm" variant="ghost" onClick={() => changeStatus(selected.id, s)}
                  className={`text-xs ${selected.status === s ? "text-white bg-white/10" : "text-gray-500 hover:text-white"}`}>
                  {s}
                </Button>
              ))}
            </div>
          </div>
          {selected.user && (
            <div className="text-sm text-gray-500 px-1">From: <span className="text-white">{selected.user.name}</span> ({selected.user.email})</div>
          )}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-bold">U</div>
                <span className="text-white text-sm font-medium">{selected.user?.name ?? "User"}</span>
                <span className="text-gray-600 text-xs ml-auto">{new Date(selected.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-gray-300 text-sm">{selected.message}</p>
            </div>
            {selected.replies.map(r => (
              <div key={r.id} className={`p-4 rounded-2xl border ${r.isStaff ? "border-orange-500/20 bg-orange-950/10" : "border-white/10 bg-white/[0.03]"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold ${r.isStaff ? "bg-gradient-to-br from-orange-600 to-red-600" : "bg-blue-600"}`}>
                    {r.isStaff ? "S" : "U"}
                  </div>
                  <span className="text-white text-sm font-medium">{r.isStaff ? "Support Staff" : selected.user?.name ?? "User"}</span>
                  <span className="text-gray-600 text-xs ml-auto">{new Date(r.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-gray-300 text-sm">{r.message}</p>
              </div>
            ))}
          </div>
          <form onSubmit={sendReply} className="p-4 rounded-2xl border border-orange-500/20 bg-orange-950/10">
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Write a staff reply..."
              rows={3}
              required
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-orange-500 resize-none mb-3"
            />
            <Button type="submit" disabled={sending} size="sm" className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-0">
              {sending ? "Sending..." : "Send Staff Reply"}
            </Button>
          </form>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Tickets">
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-white">Support Tickets</h1>
          <p className="text-gray-500 text-sm">{tickets.filter(t => t.status === "open").length} open tickets</p>
        </div>
        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />)}</div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Ticket className="w-10 h-10 mx-auto mb-3 opacity-30" />
            No tickets
          </div>
        ) : (
          <div className="space-y-2">
            {tickets.map(ticket => (
              <div key={ticket.id} onClick={() => openTicket(ticket.id)} className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-white/20 cursor-pointer transition-all">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 text-purple-400 mt-0.5" />
                  <div>
                    <div className="text-white font-medium text-sm">{ticket.subject}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-gray-500 text-xs">{ticket.user?.name ?? "Unknown"}</span>
                      <span className={`text-xs font-medium ${priorityColors[ticket.priority]}`}>· {ticket.priority}</span>
                      <span className="text-gray-600 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColors[ticket.status]}`}>{ticket.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
