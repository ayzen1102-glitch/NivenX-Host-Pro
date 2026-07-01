import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ticket, Plus, X, MessageSquare, Clock } from "lucide-react";

interface TicketItem {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

interface Reply {
  id: string;
  message: string;
  isStaff: boolean;
  createdAt: string;
}

interface TicketDetail extends TicketItem {
  message: string;
  replies: Reply[];
}

const statusColors: Record<string, string> = {
  open: "text-green-400 bg-green-400/10 border-green-400/20",
  pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  closed: "text-gray-400 bg-gray-400/10 border-gray-400/20",
};

const priorityColors: Record<string, string> = {
  low: "text-blue-400",
  medium: "text-yellow-400",
  high: "text-orange-400",
  urgent: "text-red-400",
};

export default function Tickets() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketDetail | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = () => {
    api.get<TicketItem[]>("/tickets").then(t => { setTickets(t); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchTickets(); }, []);

  const openTicket = async (id: string) => {
    const ticket = await api.get<TicketDetail>(`/tickets/${id}`);
    setSelectedTicket(ticket);
  };

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/tickets", { subject, message, priority: "medium" });
      setSubject(""); setMessage(""); setCreating(false);
      fetchTickets();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    setSubmitting(true);
    try {
      await api.post(`/tickets/${selectedTicket.id}/reply`, { message: replyText });
      setReplyText("");
      const updated = await api.get<TicketDetail>(`/tickets/${selectedTicket.id}`);
      setSelectedTicket(updated);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (selectedTicket) {
    return (
      <DashboardLayout title="Tickets">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-white">
              ← Back
            </Button>
            <h2 className="text-white font-semibold">{selectedTicket.subject}</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[selectedTicket.status]}`}>
              {selectedTicket.status}
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs text-white font-bold">U</div>
                <span className="text-white text-sm font-medium">You</span>
                <span className="text-gray-600 text-xs ml-auto">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-gray-300 text-sm">{selectedTicket.message}</p>
            </div>
            {selectedTicket.replies.map(reply => (
              <div key={reply.id} className={`p-4 rounded-2xl border ${reply.isStaff ? "border-purple-500/20 bg-purple-950/20" : "border-white/10 bg-white/[0.03]"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold ${reply.isStaff ? "bg-gradient-to-br from-purple-600 to-blue-600" : "bg-gray-600"}`}>
                    {reply.isStaff ? "S" : "U"}
                  </div>
                  <span className="text-white text-sm font-medium">{reply.isStaff ? "Support Staff" : "You"}</span>
                  <span className="text-gray-600 text-xs ml-auto">{new Date(reply.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-gray-300 text-sm">{reply.message}</p>
              </div>
            ))}
          </div>

          {selectedTicket.status !== "closed" && (
            <form onSubmit={sendReply} className="p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write your reply..."
                rows={3}
                required
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-purple-500 resize-none mb-3"
              />
              <Button type="submit" disabled={submitting} size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
                {submitting ? "Sending..." : "Send Reply"}
              </Button>
            </form>
          )}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Support Tickets">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Support Tickets</h1>
            <p className="text-gray-500 text-sm mt-0.5">Get help from our support team</p>
          </div>
          <Button size="sm" onClick={() => setCreating(true)} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
            <Plus className="w-4 h-4 mr-1.5" /> New Ticket
          </Button>
        </div>

        {creating && (
          <div className="rounded-2xl border border-purple-500/20 bg-purple-950/10 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Open a new ticket</h3>
              <button onClick={() => setCreating(false)} className="text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={createTicket} className="space-y-3">
              <Input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Subject"
                required
                className="bg-white/5 border-white/15 text-white placeholder:text-gray-600 focus:border-purple-500"
              />
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Describe your issue in detail..."
                rows={4}
                required
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-purple-500 resize-none"
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting} size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
                  {submitting ? "Creating..." : "Submit Ticket"}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setCreating(false)} className="text-gray-400">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : tickets.length === 0 && !creating ? (
          <div className="text-center py-20 rounded-2xl border border-white/10 bg-white/[0.02]">
            <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No tickets yet</h3>
            <p className="text-gray-500 text-sm mb-5">Open a support ticket if you need help.</p>
            <Button onClick={() => setCreating(true)} size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
              <Plus className="w-4 h-4 mr-1.5" /> Open Ticket
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map(ticket => (
              <div
                key={ticket.id}
                onClick={() => openTicket(ticket.id)}
                className="flex items-center justify-between p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] cursor-pointer transition-all"
              >
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 text-purple-400 mt-0.5" />
                  <div>
                    <div className="text-white font-medium text-sm">{ticket.subject}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-medium ${priorityColors[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                      <span className="text-gray-600 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColors[ticket.status]}`}>
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
