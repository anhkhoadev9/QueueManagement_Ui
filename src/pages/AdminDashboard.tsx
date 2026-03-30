
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, RefreshCw, Clock, Hash, Star, ArrowRight, XCircle, UserMinus } from 'lucide-react';
import { Link } from 'react-router-dom';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//const VITE_API_BASE_URL = 'https://queuemanagement-hjaj.onrender.com/api/v1';
//const VITE_API_BASE_URL = 'https://queuemanagement-hjaj.onrender.com/api/v1';

interface Ticket {
  Id: string;
  TicketNumber: string;
  CustomerName: string;
  PhoneNumber: string;
  ServiceName: string;
  Status: number;
  IssuedAt: string;
  CalledAt?: string | null;
}

interface FeedbackDto {
  id: string;
  comment?: string;
  rating?: number;
  userName?: string;
  serviceName?: string;
  createdAt?: string;
}

// Map status
const STATUS_MAP: Record<number, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  1: { 
    label: 'Đang chờ', 
    color: 'text-yellow-700', 
    bgColor: 'bg-yellow-100',
    icon: <Clock className="w-3.5 h-3.5" /> 
  },
  2: { 
    label: 'Đang phục vụ', 
    color: 'text-amber-700', 
    bgColor: 'bg-amber-100',
    icon: <RefreshCw className="w-3.5 h-3.5 animate-spin" /> 
  },
  3: { 
    label: 'Hoàn thành', 
    color: 'text-green-700', 
    bgColor: 'bg-green-100',
    icon: <Star className="w-3.5 h-3.5" /> 
  },
  4: { 
    label: 'Vắng mặt', 
    color: 'text-orange-700', 
    bgColor: 'bg-orange-100',
    icon: <UserMinus className="w-3.5 h-3.5" /> 
  },
  5: { 
    label: 'Đã hủy', 
    color: 'text-red-700', 
    bgColor: 'bg-red-100',
    icon: <XCircle className="w-3.5 h-3.5" /> 
  },
};

const StarRating = ({ rating }: { rating?: number }) => {
  const r = rating ?? 0;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= r ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
};

// Component cho bảng danh sách
const TicketTable = ({ tickets, title, icon }: { 
  tickets: Ticket[]; 
  title: string; 
  icon: React.ReactNode;
  emptyMessage: string;
}) => {
  if (tickets.length === 0) return null;
  
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
       <span className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4-100 text-red-700 font-bold px-2.5 py-0.5 rounded-full text-sm">
  {tickets.length}
</span>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-bold">Thứ tự</th>
                <th className="p-4 font-bold">Số vé</th>
                <th className="p-4 font-bold">Khách hàng</th>
                <th className="p-4 font-bold">Dịch vụ</th>
                <th className="p-4 font-bold">Giờ lấy số</th>
                <th className="p-4 font-bold text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tickets.map((ticket, index) => (
                <tr key={ticket.Id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4 text-gray-400 font-medium">#{index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-vietin-blue opacity-50" />
                      <span className="font-black text-vietin-blue text-lg">{ticket.TicketNumber}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{ticket.CustomerName}</div>
                    <div className="text-xs text-gray-500">{ticket.PhoneNumber}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                      {ticket.ServiceName}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      {new Date(ticket.IssuedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${STATUS_MAP[ticket.Status]?.bgColor} ${STATUS_MAP[ticket.Status]?.color}`}>
                      {STATUS_MAP[ticket.Status]?.icon}
                      {STATUS_MAP[ticket.Status]?.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [recentFeedbacks, setRecentFeedbacks] = useState<FeedbackDto[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);

  const authHeaders = () => {
    const token = localStorage.getItem('accessToken');
    const h: any = { accept: '*/*' };
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  };

  const fetchAllTickets = async () => {
    try {
      setLoading(true);
      // Gọi API lấy tất cả tickets (hoặc tickets đang hoạt động)
      const res = await fetch(`${VITE_API_BASE_URL}/tickets/waitings`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setAllTickets(data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentFeedbacks = async () => {
    try {
      setFeedbackLoading(true);
      const res = await fetch(`${VITE_API_BASE_URL}/feedbacks?PageNumber=1&PageSize=3`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        const items = data.items ?? data ?? [];
        setRecentFeedbacks(Array.isArray(items) ? items : []);
      }
    } catch (err) {
      console.error("Failed to fetch feedbacks", err);
    } finally {
      setFeedbackLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTickets();
    fetchRecentFeedbacks();
    const interval = setInterval(fetchAllTickets, 30000);
    return () => clearInterval(interval);
  }, []);

  // Phân loại tickets theo status
  const waitingTickets = allTickets.filter(t => t.Status === 1);
  const skippedTickets = allTickets.filter(t => t.Status === 4);
  const cancelledTickets = allTickets.filter(t => t.Status === 5);
  const inProgressTickets = allTickets.filter(t => t.Status === 2);

  if (loading && allTickets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-vietin-blue">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <p className="font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
          <div className="text-3xl font-black text-yellow-700">{waitingTickets.length}</div>
          <div className="text-sm font-medium text-yellow-600 mt-1">Đang chờ</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
          <div className="text-3xl font-black text-amber-700">{inProgressTickets.length}</div>
          <div className="text-sm font-medium text-amber-600 mt-1">Đang phục vụ</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
          <div className="text-3xl font-black text-orange-700">{skippedTickets.length}</div>
          <div className="text-sm font-medium text-orange-600 mt-1">Vắng mặt</div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
          <div className="text-3xl font-black text-red-700">{cancelledTickets.length}</div>
          <div className="text-sm font-medium text-red-600 mt-1">Đã hủy</div>
        </div>
      </div>

      {/* Header với nút refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý hàng chờ</h2>
          <p className="text-xs text-gray-400 mt-1">
            Cập nhật lúc: {lastUpdated.toLocaleTimeString('vi-VN')}
          </p>
        </div>
        <button 
          onClick={fetchAllTickets}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-vietin-blue text-white font-semibold hover:bg-vietin-darkBlue transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Bảng khách hàng đang chờ */}
      <TicketTable 
        tickets={waitingTickets}
        title="Khách hàng đang đợi"
        icon={<Clock className="w-6 h-6 text-yellow-600" />}
        emptyMessage="Hiện không có khách hàng nào đang đợi"
      />

      {/* Bảng khách hàng đang phục vụ */}
      {inProgressTickets.length > 0 && (
        <TicketTable 
          tickets={inProgressTickets}
          title="Đang phục vụ"
          icon={<RefreshCw className="w-6 h-6 text-amber-600 animate-spin" />}
          emptyMessage=""
        />
      )}

      {/* Bảng khách hàng vắng mặt */}
      <TicketTable 
        tickets={skippedTickets}
        title="Khách hàng vắng mặt"
        icon={<UserMinus className="w-6 h-6 text-orange-600" />}
        emptyMessage="Chưa có khách hàng vắng mặt"
      />

      {/* Bảng khách hàng đã hủy */}
      <TicketTable 
        tickets={cancelledTickets}
        title="Khách hàng đã hủy"
        icon={<XCircle className="w-6 h-6 text-red-600" />}
        emptyMessage="Chưa có khách hàng hủy vé"
      />

      <hr className="border-gray-100" />

      {/* Services Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Danh sách Dịch vụ</h2>
          <button className="flex items-center gap-2 bg-vietin-blue hover:bg-vietin-darkBlue text-white px-4 py-2 rounded-lg font-medium transition-all active:scale-95">
            <Plus className="w-5 h-5" /> Thêm dịch vụ
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-bold">ID</th>
                <th className="p-4 font-bold">Loại Dịch Vụ</th>
                <th className="p-4 font-bold">Mô tả</th>
                <th className="p-4 font-bold">Trạng thái</th>
                <th className="p-4 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-400 text-sm">#1</td>
                <td className="p-4 font-bold text-gray-800">Cắt tóc Nam</td>
                <td className="p-4 text-gray-600 text-sm max-w-xs truncat
e">Tạo kiểu tóc nam chuyên nghiệp</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Hoạt động</span>
                </td>
                <td className="p-4 text-right flex justify-end gap-3">
                  <button className="text-vietin-blue hover:text-vietin-darkBlue p-2 bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button className="text-vietin-red hover:text-red-700 p-2 bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-400 text-sm">#2</td>
                <td className="p-4 font-bold text-gray-800">Uốn/Nhuộm</td>
                <td className="p-4 text-gray-600 text-sm max-w-xs truncate">Dịch vụ hóa chất cao cấp</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Hoạt động</span>
                </td>
                <td className="p-4 text-right flex justify-end gap-3">
                  <button className="text-vietin-blue hover:text-vietin-darkBlue p-2 bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button className="text-vietin-red hover:text-red-700 p-2 bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Feedbacks — Real API Data */}
      <section className="mt-8 pt-8 border-t border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Đánh giá mới nhất</h2>
          <Link
            to="/admin/feedbacks"
            className="flex items-center gap-1.5 text-sm font-semibold text-vietin-blue hover:text-vietin-darkBlue transition-colors"
          >
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {feedbackLoading ? (
          <div className="text-center text-gray-400 py-8 animate-pulse">Đang tải đánh giá...</div>
        ) : recentFeedbacks.length === 0 ? (
          <div className="text-center text-gray-400 py-8">Chưa có đánh giá nào.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentFeedbacks.map((fb) => (
              <div key={fb.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-vietin-blue hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-gray-800 truncate">{fb.userName || 'Khách hàng'}</h4>
                  <StarRating rating={fb.rating} />
                </div>
                {fb.comment && (
                  <p className="text-sm text-gray-600 italic line-clamp-2">"{fb.comment}"</p>
                )}
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs font-bold text-vietin-blue">{fb.serviceName || '—'}</span>
                  <span className="text-[10px] text-gray-400 uppercase font-medium">
                    {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString('vi-VN') : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;