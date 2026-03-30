import { useState, useEffect } from 'react';
import {  CheckCircle, XCircle, User as UserIcon, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

//const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
interface Ticket {
  Id: string;
  TicketNumber: string;
  CustomerName: string;
  PhoneNumber: string;
  ServiceName: string;
  Status: number;
  IssuedAt: string;
  CalledAt?: string;
}

const TellerDashboard = () => {
  const { user } = useAuth();
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [waitingTickets, setWaitingTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);


const fetchCurrentTicket = async () => {
  try {
    const token = localStorage.getItem('accessToken');

    const res = await fetch(`${VITE_API_BASE_URL}/tickets/current`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      setCurrentTicket(null);
      return;
    }

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    setCurrentTicket(data?.Id ? data : null);

  } catch (err) {
    console.error("Failed to fetch current ticket", err);
  }
};
  const fetchWaitingQueue = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${VITE_API_BASE_URL}/tickets/waiting`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWaitingTickets(data);
      }
    } catch (err) {
      console.error("Failed to fetch waiting queue", err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchCurrentTicket(), fetchWaitingQueue()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(fetchWaitingQueue, 15000); // Refresh queue count every 15s
    return () => clearInterval(interval);
  }, []);

const handleCallNext = async () => {
  if (!user) return;

  try {
    setActionLoading(true);

    const token = localStorage.getItem("accessToken");

    const res = await fetch(`${VITE_API_BASE_URL}/tickets/call-next`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ staffId: user.userId }),
    });

    // ❌ nếu lỗi
    if (!res.ok) {
      const text = await res.text();
      let err;

      try {
        err = text ? JSON.parse(text) : null;
      } catch {
        err = null;
      }

      alert(err?.message || "Không có khách đợi hoặc lỗi hệ thống.");
      return;
    }

    // ✅ nếu thành công
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    console.log("Next ticket called:", data);

    setCurrentTicket(data);
    fetchWaitingQueue();

  } catch (err) {
    console.error("Call next failed", err);
  } finally {
    setActionLoading(false);
  }
};
  const updateStatus = async (newStatus: number) => {
    if (!currentTicket || !user) return;
    try {
      setActionLoading(true);
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${VITE_API_BASE_URL}/tickets`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ticketId: currentTicket.Id,
          newStatus: newStatus,
          staffId: user.userId
        })
      });

      if (res.ok) {
        setCurrentTicket(null);
        fetchWaitingQueue();
      }
    } catch (err) {
      console.error("Update status failed", err);
    } finally {
      setActionLoading(false);
    }
  };

  const serviceCounts = waitingTickets.reduce((acc: any, t) => {
    acc[t.ServiceName] = (acc[t.ServiceName] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-vietin-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Current Interaction */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-[450px]">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Phiên phục vụ</h3>
            {currentTicket && (
              <span className="text-xs text-gray-400 font-medium">
                Bắt đầu lúc: {new Date(currentTicket.CalledAt || "").toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center">
            {currentTicket ? (
              <div className="animate-in zoom-in duration-300">
                <p className="text-gray-500 mb-2">Đang phục vụ khách hàng: <span className="font-bold text-gray-700">{currentTicket.CustomerName}</span></p>
                <h2 className="text-8xl font-black text-vietin-blue mb-4 tracking-tighter">{currentTicket.TicketNumber}</h2>
                <p className="text-lg font-semibold bg-vietin-lightBlue text-vietin-darkBlue px-6 py-2 rounded-full inline-block shadow-sm">
                  {currentTicket.ServiceName}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-gray-400">
                  <UserIcon className="w-4 h-4" />
                  <span className="text-sm">{currentTicket.PhoneNumber}</span>
                </div>
              </div>
            ) : (
              <div className="text-gray-300 flex flex-col items-center">
                <UserIcon className="w-20 h-20 mb-4 opacity-20" />
                <p className="text-xl font-medium">Sẵn sàng phục vụ khách mới</p>
                <p className="text-sm">Bấm "Gọi số tiếp theo" để bắt đầu</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <button
              disabled={!currentTicket || actionLoading}
              onClick={() => updateStatus(4)} 
              className="flex items-center justify-center gap-2 py-4 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50"
            >
              <XCircle className="w-6 h-6" /> Bỏ qua
            </button>
            
            <button
              disabled={!currentTicket || actionLoading}
              onClick={() => updateStatus(3)} // Completed
              className="flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <CheckCircle className="w-6 h-6" /> Hoàn thành
            </button>
          </div>
        </div>

        {/* Queue Control */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-[450px]">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Điều khiển lượt gọi</h3>
            <button
              onClick={fetchWaitingQueue}
              title="Làm mới hàng đợi"
              className="p-1 hover:bg-gray-100 rounded-md text-gray-400 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${actionLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <button
              onClick={handleCallNext}
              disabled={currentTicket !== null || waitingTickets.length === 0 || actionLoading}
              className="w-full py-6 bg-vietin-blue hover:bg-vietin-darkBlue text-white rounded-2xl font-black text-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-95 disabled:bg-gray-300 disabled:shadow-none flex flex-col items-center justify-center gap-1 group"
            >
              {actionLoading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <>
                  <span>Gọi số tiếp theo</span>
                  <span className="text-xs font-medium text-blue-100 group-disabled:text-gray-500">
                    {waitingTickets.length > 0 ? `Có ${waitingTickets.length} khách đang chờ` : 'Hàng đợi trống'}
                  </span>
                </>
              )}
            </button>

            <div className="mt-2">
              <p className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-vietin-blue rounded-full"></div>
                Danh sách chờ theo dịch vụ:
              </p>
              <div className="space-y-3">
                {Object.keys(serviceCounts).length > 0 ? (
                  Object.entries(serviceCounts).map(([svc, count]: any) => (
                    <div key={svc} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-sm font-medium text-gray-700">{svc}</span>
                      <span className="font-black text-vietin-red text-sm px-3 py-1 bg-white rounded-lg shadow-sm border border-red-50">
                        {count} người
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400 text-sm italic">
                    Không có khách chờ
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TellerDashboard;
