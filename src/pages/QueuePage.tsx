import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, RefreshCw, ArrowLeft, Clock, CheckCircle2, PhoneCall, Star, X, PartyPopper, ThumbsUp, Wifi, WifiOff } from 'lucide-react';
import { apiClient,useAuth } from '../contexts/AuthContext';

interface TicketDto {
  Id: string;
  TicketNumber: string;
  CustomerName: string;
  PhoneNumber: string;
  ServiceName: string;
  ServiceId?: string;
  Status: number | string;
  IssuedAt: string;
  CalledAt?: string | null;
}

interface CompletionNotification {
  ticketId: string;
  ticketNumber: string;
  customerName: string;
  phoneNumber: string;
  serviceName: string;
  serviceId: string;
  completedAt: string;
}

const STATUS_NUMBER_MAP: Record<number, string> = {
  1: 'waiting',
  2: 'inprogress',
  3: 'completed',
  4: 'skipped',
  5: 'cancelled',
};

const STATUS_MAP: Record<string, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  waiting: { label: 'Đang chờ', color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: <Clock className="w-3.5 h-3.5" /> },
  inprogress: { label: 'Đang phục vụ', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: <PhoneCall className="w-3.5 h-3.5" /> },
  completed: { label: 'Hoàn thành', color: 'text-green-700', bgColor: 'bg-green-100', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  skipped: { label: 'Bỏ qua', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: <Clock className="w-3.5 h-3.5" /> },
  cancelled: { label: 'Đã hủy', color: 'text-red-600', bgColor: 'bg-red-100', icon: <Clock className="w-3.5 h-3.5" /> },
};

const getStatusInfo = (status: string | number) => {
  let statusKey = '';
  if (typeof status === 'number') {
    statusKey = STATUS_NUMBER_MAP[status] || '';
  } else {
    statusKey = status?.toLowerCase() || '';
  }
  return STATUS_MAP[statusKey] || { label: status?.toString() || 'Không xác định', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: null };
};

const QueuePage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [ ,setError] = useState('');
  const [, setLastUpdated] = useState<Date | null>(null);
  const [notification, setNotification] = useState<CompletionNotification | null>(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const {user}=useAuth();
  
  // Real-time status
  const [hubStatus, setHubStatus] = useState<'connecting' | 'connected' | 'error' | 'reconnecting'>('connecting');
  const connectionRef = useRef<any>(null);
  const processedTicketsRef = useRef<Set<string>>(new Set());

  const fetchWaiting = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const res = await apiClient.get('/tickets/waitings');
      const data = res.data;
      let list: TicketDto[] = Array.isArray(data) ? data : (data.items || data.data || []);
      setTickets(list);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách hàng chờ');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // SignalR connection (PURE implementation without polling fallback)
  useEffect(() => {
    let autoHideTimer: ReturnType<typeof setTimeout> | null = null;

    const startSignalR = async () => {
      try {
        const { HubConnectionBuilder, LogLevel, HttpTransportType } = await import('@microsoft/signalr');
        const apiBase = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/api\/v1\/?$/, '');
        const hubUrl = `${apiBase}/queue-hub`;

        console.log('[SignalR] Init Connection to:', hubUrl);
        setHubStatus('connecting');

        const connection = new HubConnectionBuilder()
          .withUrl(hubUrl, { 
            withCredentials: true, // MUST be true if Backend uses AllowCredentials
            transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling
          })
          .withAutomaticReconnect([0, 2000, 5000, 10000])
          .configureLogging(LogLevel.Information)
          .build();

        connection.on('ReceiveTicketCompleted', (ticketData: any) => {
          console.log('[SignalR] Event ReceiveTicketCompleted:', ticketData);

          const ticketId = ticketData.Id || ticketData.id;
          
          // Avoid duplicate processing
          if (processedTicketsRef.current.has(ticketId)) return;
          processedTicketsRef.current.add(ticketId);

          const completed: CompletionNotification = {
            ticketId: ticketId,
            ticketNumber: ticketData.TicketNumber || ticketData.ticketNumber || '',
            customerName: ticketData.CustomerName || ticketData.customerName || '',
            phoneNumber: ticketData.PhoneNumber || ticketData.phoneNumber || '',
            serviceName: ticketData.ServiceName || ticketData.serviceName || '',
            serviceId: ticketData.ServiceId || ticketData.serviceId || '',
            completedAt: new Date().toISOString(),
          };

          if (completed.ticketId) {
            setNotification(completed);
            setShowRatingForm(false); // Reset to show the celebration modal first
            if (autoHideTimer) clearTimeout(autoHideTimer);
            autoHideTimer = setTimeout(() => {
              setNotification(null);
              setShowRatingForm(false);
            }, 30000); // 30s auto-hide for celebration
          }
        });

        connection.on('QueueUpdated', () => {
          console.log('[SignalR] Event QueueUpdated');
          fetchWaiting();
        });

        connection.onreconnecting(() => setHubStatus('reconnecting'));
        connection.onreconnected(() => setHubStatus('connected'));
        connection.onclose(() => setHubStatus('error'));

        await connection.start();
        console.log('[SignalR] Connected successfully');
        setHubStatus('connected');
        connectionRef.current = connection;
      } catch (err) {
        console.error('[SignalR] Hub Connection Error:', err);
        setHubStatus('error');
      }
    };

    startSignalR();

    return () => {
      if (autoHideTimer) clearTimeout(autoHideTimer);
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, [fetchWaiting]);

  const handleSubmitRating = async () => {
    if (rating === 0) return alert('Vui lòng chọn số sao đánh giá');
    if (!notification) return;

    setIsSubmitting(true);
    try {
      await apiClient.post('/feedbacks', {
        comment: ratingComment,
        rating: rating,
        queueTicketId: notification.ticketId,
        serviceId: notification.serviceId,
        userId: user?.userId,
      });
      setShowRatingForm(false);
      setNotification(null);
      setRating(0);
      setRatingComment('');
      alert('Cảm ơn bạn đã đánh giá dịch vụ!');
    } catch (err) {
      alert('Có lỗi xảy ra khi gửi đánh giá.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchWaiting();
    // Use a slow polling only as a very backup for the list itself
    const interval = setInterval(fetchWaiting, 20000); 
    return () => clearInterval(interval);
  }, [fetchWaiting]);

  const getCountByStatus = (statusKey: string) => {
    return tickets.filter(ticket => {
      const status = typeof ticket.Status === 'number' ? STATUS_NUMBER_MAP[ticket.Status] : ticket.Status?.toLowerCase();
      return status === statusKey;
    }).length;
  };

  return (
    <div className="flex-1 flex flex-col min-h-[70vh] w-full animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* ── Status Indicator ── */}
      <div className="fixed bottom-4 right-4 z-[60] flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-lg border border-gray-100 text-[10px] font-bold uppercase tracking-wider">
        {hubStatus === 'connected' && <><Wifi className="w-3 h-3 text-green-500" /> <span className="text-green-600">Real-time Ready</span></>}
        {hubStatus === 'connecting' && <><RefreshCw className="w-3 h-3 text-blue-500 animate-spin" /> <span className="text-blue-600">Connecting...</span></>}
        {hubStatus === 'reconnecting' && <><RefreshCw className="w-3 h-3 text-yellow-500 animate-spin" /> <span className="text-yellow-600">Reconnecting...</span></>}
        {hubStatus === 'error' && <><WifiOff className="w-3 h-3 text-red-500" /> <span className="text-red-600">Offline</span></>}
      </div>

      {notification && !showRatingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <PartyPopper className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold">Dịch vụ hoàn thành!</h3>
            </div>
            <div className="p-6">
              <div className="mb-6 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Số thứ tự:</span>
                  <span className="text-2xl font-black text-vietin-blue">{notification.ticketNumber}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Dịch vụ:</span>
                  <span className="font-semibold text-gray-800">{notification.serviceName}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setNotification(null)} className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors">Để sau</button>
                <button onClick={() => setShowRatingForm(true)} className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2"><ThumbsUp className="w-5 h-5" />Đánh giá ngay</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRatingForm && notification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-5 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Đánh giá dịch vụ</h3>
              <button onClick={() => { setShowRatingForm(false); setNotification(null); }} className="text-white/80 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-4 mb-6 flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Số vé: <strong className="text-vietin-blue">{notification.ticketNumber}</strong></span>
                <span className="text-gray-500 font-medium text-right">Dịch vụ: <strong>{notification.serviceName}</strong></span>
              </div>
              <p className="text-center text-gray-700 font-semibold mb-6">Bạn hài lòng với dịch vụ này chứ?</p>
              <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="transition-transform hover:scale-110 focus:outline-none">
                    <Star className={`w-10 h-10 ${(hoverRating || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} transition-colors`} />
                  </button>
                ))}
              </div>
              <textarea value={ratingComment} onChange={(e) => setRatingComment(e.target.value)} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none mb-6 text-sm" placeholder="Chia sẻ thêm ý kiến của bạn..." />
              <button onClick={handleSubmitRating} disabled={isSubmitting || rating === 0} className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 transition-all hover:shadow-xl">
                {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/kiosk')} className="flex items-center gap-2 text-vietin-blue hover:text-vietin-darkBlue font-semibold text-sm transition-colors"><ArrowLeft className="w-4 h-4" />Kiosk</button>
          <div className="h-5 w-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-vietin-lightBlue rounded-xl flex items-center justify-center"><Users className="w-5 h-5 text-vietin-blue" /></div>
            <h2 className="text-xl font-bold text-gray-800">Hàng chờ hiện tại</h2>
          </div>
        </div>
        <button onClick={fetchWaiting} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-vietin-blue text-white text-sm font-semibold hover:bg-vietin-darkBlue transition-colors disabled:opacity-60">
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Làm mới
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border p-5 text-center bg-yellow-50/50 border-yellow-100 shadow-sm"><div className="text-3xl font-black text-yellow-700">{getCountByStatus('waiting')}</div><div className="text-[10px] font-bold text-yellow-600 mt-1 uppercase tracking-widest">Đang chờ</div></div>
        <div className="rounded-2xl border p-5 text-center bg-blue-50/50 border-blue-100 shadow-sm"><div className="text-3xl font-black text-blue-700">{getCountByStatus('inprogress')}</div><div className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-widest">Đang gọi</div></div>
        <div className="rounded-2xl border p-5 text-center bg-gray-50/50 border-gray-100 shadow-sm"><div className="text-3xl font-black text-gray-700">{tickets.length}</div><div className="text-[10px] font-bold text-gray-600 mt-1 uppercase tracking-widest">Tổng số</div></div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50/50">
              <tr>{['#', 'Số vé', 'Khách hàng', 'Số ĐT', 'Dịch vụ', 'Trạng thái'].map((h, i) => <th key={i} className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-4">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && tickets.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm italic">Đang tải dữ liệu...</td></tr>
              ) : tickets.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm italic">Hiện chưa có ai trong hàng chờ</td></tr>
              ) : tickets.map((t, idx) => {
                const s = getStatusInfo(t.Status);
                return (
                  <tr key={t.Id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-5 text-xs text-gray-400">{idx + 1}</td>
                    <td className="px-6 py-5 font-black text-2xl text-vietin-blue uppercase">{t.TicketNumber}</td>
                    <td className="px-6 py-5 font-bold text-sm text-gray-800">{t.CustomerName}</td>
                    <td className="px-6 py-5 text-xs text-gray-500 font-mono italic">{t.PhoneNumber}</td>
                    <td className="px-6 py-5 text-xs text-gray-600">{t.ServiceName}</td>
                    <td className="px-6 py-5"><span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${s.bgColor} ${s.color} uppercase tracking-tight`}>{s.icon} {s.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QueuePage;