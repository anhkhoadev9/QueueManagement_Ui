import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, RefreshCw, User, Clock, Hash } from 'lucide-react';

// const API_BASE_URL = 'https://localhost:7164/api/v1';
const API_BASE_URL = 'https://queuemanagement-hjaj.onrender.com/api/v1';
interface Ticket {
  Id: string;
  TicketNumber: string;
  CustomerName: string;
  PhoneNumber: string;
  ServiceName: string;
  Status: number;
  IssuedAt: string;
}

const AdminDashboard = () => {
  const [waitingTickets, setWaitingTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchWaitingTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const headers: any = { 'accept': '*/*' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/tickets/waiting`, { headers });
      if (res.ok) {
        const data = await res.json();
        setWaitingTickets(data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Failed to fetch waiting tickets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitingTickets();
    const interval = setInterval(fetchWaitingTickets, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Waiting Customers Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <h2 className="text-2xl font-bold text-gray-800">Khách hàng đang đợi</h2>
             <span className="bg-vietin-blue/10 text-vietin-blue px-3 py-1 rounded-full text-sm font-bold">
               {waitingTickets.length} người
             </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 font-medium italic">
              Cập nhật lúc: {lastUpdated.toLocaleTimeString()}
            </span>
            <button 
              onClick={fetchWaitingTickets}
              disabled={loading}
              className={`p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all ${loading ? 'animate-spin' : ''}`}
              title="Tải lại"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
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
                {loading && waitingTickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="w-8 h-8 animate-spin text-vietin-blue" />
                        <p className="font-medium">Đang tải danh sách...</p>
                      </div>
                    </td>
                  </tr>
                ) : waitingTickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <User className="w-8 h-8 opacity-20" />
                        <p className="font-medium">Hiện không có khách hàng nào đang đợi</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  waitingTickets.map((ticket, index) => (
                    <tr key={ticket.Id} className="hover:bg-blue-50/30 transition-colors group">
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
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                          Đang đợi
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

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
                <td className="p-4 text-gray-600 text-sm max-w-xs truncate">Tạo kiểu tóc nam chuyên nghiệp</td>
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

      <section className="mt-8 pt-8 border-t border-gray-100">
         <h2 className="text-2xl font-bold text-gray-800 mb-6">Đánh giá mới nhất</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-vietin-blue hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start mb-4">
                 <h4 className="font-bold text-gray-800">Thợ làm rất kỹ</h4>
                 <span className="bg-yellow-100 text-yellow-800 text-xs font-black px-2 py-1 rounded">5 SAO</span>
               </div>
               <p className="text-sm text-gray-600 italic">"Rất hài lòng với kiểu tóc mới..."</p>
               <div className="mt-4 flex justify-between items-center">
                 <span className="text-xs font-bold text-vietin-blue">Dịch vụ: Cắt tóc</span>
                 <span className="text-[10px] text-gray-400 uppercase font-medium">2026-03-24</span>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
