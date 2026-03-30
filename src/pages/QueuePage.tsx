// import { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Users, RefreshCw, ArrowLeft, Clock, CheckCircle2, PhoneCall, Activity } from 'lucide-react';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// interface TicketDto {
//   Id: string;
//   TicketNumber: string;
//   CustomerName: string;
//   PhoneNumber: string;
//   ServiceName: string;
//   Status: number | string;
//   IssuedAt: string;
//   CalledAt?: string | null;
// }

// const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
//   waiting: { label: 'Đang chờ', color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-3.5 h-3.5" /> },
//   called: { label: 'Đang gọi', color: 'bg-blue-100 text-blue-700', icon: <PhoneCall className="w-3.5 h-3.5" /> },
//   completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
//   skipped: { label: 'Bỏ qua', color: 'bg-gray-100 text-gray-600', icon: <Clock className="w-3.5 h-3.5" /> },
// };

// const getStatusInfo = (status: string) => {
//   const key = status ?? '';
//   return STATUS_MAP[key] ?? { label: status || 'Không xác định', color: 'bg-gray-100 text-gray-600', icon: null };
// };

// const STATUS_NUMBER_MAP: Record<number, string> = {
//   1: 'waiting',
//   2: 'called',
//   3: 'InProgress'
// };

// const QueuePage = () => {
//   const navigate = useNavigate();
//   const [tickets, setTickets] = useState<TicketDto[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

//   const fetchWaiting = useCallback(async () => {
//     try {
//       setError('');
//       setLoading(true);
//       const token = localStorage.getItem('accessToken');
//       const headers: Record<string, string> = { accept: '*/*' };
//       if (token) headers['Authorization'] = `Bearer ${token}`;

//       const res = await fetch(`${API_BASE_URL}/tickets/waiting`, { headers });

//       if (!res.ok) {
//         if (res.status === 404) {
//           throw new Error('API endpoint không tồn tại. Vui lòng kiểm tra lại đường dẫn API.');
//         }
//         throw new Error(`HTTP ${res.status}: ${res.statusText}`);
//       }

//       const data = await res.json();
//       console.log('API Response:', data);

//       // Xử lý dữ liệu an toàn
//       let list: TicketDto[] = [];
//       if (Array.isArray(data)) {
//         list = data;
//       } else if (data && typeof data === 'object') {
//         // Nếu data là object, thử lấy từ các key phổ biến
//         list = data.items || data.data || data.tickets || [];
//         if (!Array.isArray(list)) list = [];
//       }

//       setTickets(list);
//       setLastUpdated(new Date());
//     } catch (err: any) {
//       console.error('Fetch error:', err);
//       setError(err.message || 'Không thể tải danh sách hàng chờ');
//       setTickets([]); // Đặt lại tickets là mảng rỗng
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchWaiting();
//     const interval = setInterval(fetchWaiting, 15000);
//     return () => clearInterval(interval);
//   }, [fetchWaiting]);

//   return (
//     <div className="flex-1 flex flex-col min-h-[70vh] w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate('/kiosk')}
//             className="flex items-center gap-2 text-vietin-blue hover:text-vietin-darkBlue font-semibold text-sm transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Quay lại Kiosk
//           </button>
//           <div className="h-5 w-px bg-gray-300" />
//           <div className="flex items-center gap-2">
//             <div className="w-10 h-10 bg-vietin-lightBlue rounded-xl flex items-center justify-center">
//               <Users className="w-5 h-5 text-vietin-blue" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-gray-800">Danh sách hàng chờ</h2>
//               {lastUpdated && (
//                 <p className="text-xs text-gray-400">
//                   Cập nhật lúc {lastUpdated.toLocaleTimeString('vi-VN')}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         <button
//           onClick={() => { fetchWaiting(); }}
//           disabled={loading}
//           className="flex items-center gap-2 px-4 py-2 rounded-lg bg-vietin-blue text-white text-sm font-semibold hover:bg-vietin-darkBlue transition-colors disabled:opacity-60"
//         >
//           <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//           Làm mới
//         </button>
//       </div>

//       {/* Stats bar */}
//       <div className="grid grid-cols-3 gap-4 mb-6">
//         {[
//           {
//             label: 'Đang chờ',
//            value: tickets.filter(
//   t => STATUS_NUMBER_MAP[t?.Status as number] === 'waiting'
// ).length,
//             color: 'bg-yellow-50 border-yellow-200 text-yellow-700'
//           },
//           {
//             label: 'Đang gọi',
              
//            value: tickets.filter(
//   t => STATUS_NUMBER_MAP[t?.Status as number] === 'called'
// ).length,
//             color: 'bg-blue-50 border-blue-200 text-blue-700'
//           },
//           {
//             label: 'Tổng cộng',
//             value: tickets.length,
//             color: 'bg-gray-50 border-gray-200 text-gray-700'
//           },
//         ].map((stat, idx) => (
//           <div key={idx} className={`rounded-xl border p-4 text-center ${stat.color}`}>
//             <div className="text-3xl font-black">{stat.value}</div>
//             <div className="text-sm font-medium mt-1">{stat.label}</div>
//           </div>
//         ))}
//       </div>

//       {/* Content */}
//       {(() => {
//         // Xử lý các trạng thái loading và error
//         if (loading && tickets.length === 0) {
//           return (
//             <div className="flex-1 flex items-center justify-center">
//               <div className="flex items-center gap-3 text-vietin-blue font-medium animate-pulse">
//                 <Activity className="animate-spin" />
//                 <span>Đang tải danh sách chờ...</span>
//               </div>
//             </div>
//           );
//         }

//         if (error) {
//           return (
//             <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-6 text-center">
//               <p className="font-bold mb-2">Không thể tải danh sách hàng chờ</p>
//               <p className="text-sm mb-4">{error}</p>
//               <button
//                 onClick={() => fetchWaiting()}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//               >
//                 Thử lại
//               </button>
//             </div>
//           );
//         }

//         if (tickets.length === 0) {
//           return (
//             <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-20">
//               <Users className="w-16 h-16 mb-4 opacity-30" />
//               <p className="text-lg font-medium">Hiện chưa có khách hàng nào đang chờ</p>
//               <p className="text-sm mt-1">Danh sách sẽ tự động cập nhật mỗi 15 giây</p>
//             </div>
//           );
//         }

//         // Render bảng dữ liệu
//         return (
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
//             <table className="w-full min-w-[600px]">
//               <thead>
//                 <tr className="bg-gray-50 border-b border-gray-100">
//                   {['#', 'Số thứ tự', 'Khách hàng', 'Số điện thoại', 'Dịch vụ', 'Trạng thái'].map((h, idx) => (
//                     <th key={idx} className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {tickets.map((ticket, idx) => {
//                   // Kiểm tra an toàn
//                   if (!ticket) return null;

//                   const statusKey =
//                     typeof ticket.Status === 'number'
//                       ? STATUS_NUMBER_MAP[ticket.Status] || ''
//                       : ticket.Status;

//                   const statusInfo = getStatusInfo(statusKey);
//                   return (
//                     <tr
//                       key={ticket.Id || `ticket-${idx}`}
//                       className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors group"
//                     >
//                       <td className="px-6 py-4 text-sm text-gray-400 font-medium">{idx + 1}</td>
//                       <td className="px-6 py-4">
//                         <span className="text-2xl font-black text-vietin-blue">
//                           {ticket.TicketNumber || '—'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="text-sm font-semibold text-gray-800">{ticket.CustomerName || '—'}</span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="text-sm text-gray-600">{ticket.PhoneNumber || '—'}</span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="text-sm text-gray-600">{ticket.ServiceName || '—'}</span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}>
//                           {statusInfo.icon}
//                           {statusInfo.label}
//                         </span>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         );
//       })()}
//     </div>
//   );
// };

// export default QueuePage;
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, RefreshCw, ArrowLeft, Clock, CheckCircle2, Activity, Loader2 } from 'lucide-react';

//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
interface TicketDto {
  Id: string;
  TicketNumber: string;
  CustomerName: string;
  PhoneNumber: string;
  ServiceName: string;
  Status: number | string;
  IssuedAt: string;
  CalledAt?: string | null;
}

// Map số sang tên trạng thái
const STATUS_NUMBER_MAP: Record<number, string> = {
  1: 'waiting',
  2: 'inprogress',  // InProgress = 2
  3: 'completed',
  4:'skipped',
  5: 'cancelled',
};

// Định nghĩa màu sắc và icon cho từng trạng thái
const STATUS_MAP: Record<string, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  waiting: { 
    label: 'Đang chờ', 
    color: 'text-yellow-700', 
    bgColor: 'bg-yellow-100',
    icon: <Clock className="w-3.5 h-3.5" /> 
  },
   
  inprogress: { 
    label: 'Đang phục vụ', 
    color: 'text-amber-700', 
    bgColor: 'bg-amber-100',
    icon: <Loader2 className="w-3.5 h-3.5 animate-spin" /> 
  },
  completed: { 
    label: 'Hoàn thành', 
    color: 'text-green-700', 
    bgColor: 'bg-green-100',
    icon: <CheckCircle2 className="w-3.5 h-3.5" /> 
  },
  skipped: { 
    label: 'Vắng mặt', 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-100',
    icon: <Clock className="w-3.5 h-3.5" /> 
  },
  cancelled: { 
    label: 'Đã hủy', 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-100',
    icon: <Clock className="w-3.5 h-3.5" /> 
  },
};

const getStatusInfo = (status: string | number) => {
  // Chuyển đổi status nếu là số
  let statusKey = '';
  if (typeof status === 'number') {
    statusKey = STATUS_NUMBER_MAP[status] || '';
  } else {
    statusKey = status?.toLowerCase() || '';
  }
  
  return STATUS_MAP[statusKey] || { 
    label: status?.toString() || 'Không xác định', 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-100',
    icon: null 
  };
};

const QueuePage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchWaiting = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const headers: Record<string, string> = { accept: '*/*' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/tickets/waiting`, { headers });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('API endpoint không tồn tại. Vui lòng kiểm tra lại đường dẫn API.');
        }
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log('API Response:', data);

      let list: TicketDto[] = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (data && typeof data === 'object') {
        list = data.items || data.data || data.tickets || [];
        if (!Array.isArray(list)) list = [];
      }

      setTickets(list);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Không thể tải danh sách hàng chờ');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWaiting();
    const interval = setInterval(fetchWaiting, 15000);
    return () => clearInterval(interval);
  }, [fetchWaiting]);

  // Hàm tính số lượng theo trạng thái
  const getCountByStatus = (statusKey: string) => {
    return tickets.filter(ticket => {
      const ticketStatus = getStatusInfo(ticket.Status);
      return ticketStatus.label === STATUS_MAP[statusKey]?.label;
    }).length;
  };

  return (
    <div className="flex-1 flex flex-col min-h-[70vh] w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/kiosk')}
            className="flex items-center gap-2 text-vietin-blue hover:text-vietin-darkBlue font-semibold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại Kiosk
          </button>
          <div className="h-5 w-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-vietin-lightBlue rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-vietin-blue" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Danh sách hàng chờ</h2>
              {lastUpdated && (
                <p className="text-xs text-gray-400">
                  Cập nhật lúc {lastUpdated.toLocaleTimeString('vi-VN')}
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => { fetchWaiting(); }}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-vietin-blue text-white text-sm font-semibold hover:bg-vietin-darkBlue transition-colors disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Đang chờ', statusKey: 'waiting', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
          { label: 'Đang phục vụ', statusKey: 'inprogress', color: 'bg-amber-50 border-amber-200 text-amber-700' },
          { label: 'Tổng cộng', statusKey: null, value: tickets.length, color: 'bg-gray-50 border-gray-200 text-gray-700' },
        ].map((stat, idx) => (
          <div key={idx} className={`rounded-xl border p-4 text-center ${stat.color}`}>
            <div className="text-3xl font-black">
              {stat.statusKey ? getCountByStatus(stat.statusKey) : tickets.length}
            </div>
            <div className="text-sm font-medium mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Content */}
      {(() => {
        if (loading && tickets.length === 0) {
          return (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-3 text-vietin-blue font-medium animate-pulse">
                <Activity className="animate-spin" />
                <span>Đang tải danh sách chờ...</span>
              </div>
            </div>
          );
        }

        if (error) {
          return (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-6 text-center">
              <p className="font-bold mb-2">Không thể tải danh sách hàng chờ</p>
              <p className="text-sm mb-4">{error}</p>
              <button
                onClick={() => fetchWaiting()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          );
        }

        if (tickets.length === 0) {
          return (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-20">
              <Users className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg font-medium">Hiện chưa có khách hàng nào đang chờ</p>
              <p className="text-sm mt-1">Danh sách sẽ tự động cập nhật mỗi 15 giây</p>
            </div>
          );
        }

        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['#', 'Số thứ tự', 'Khách hàng', 'Số điện thoại', 'Dịch vụ', 'Trạng thái'].map((h, idx) => (
                    <th key={idx} className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                      {h}
                    </th>
                  ))}
                 </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, idx) => {
                  if (!ticket) return null;
                  
                  const statusInfo = getStatusInfo(ticket.Status);
                 
                  return (
                    <tr
                      key={ticket.Id || `ticket-${idx}`}
                      className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4 text-sm text-gray-400 font-medium">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <span className="text-2xl font-black text-vietin-blue">
                          {ticket.TicketNumber || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-800">{ticket.CustomerName || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{ticket.PhoneNumber || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{ticket.ServiceName || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusInfo.bgColor} ${statusInfo.color}`}>
                          {statusInfo.icon}
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })()}
    </div>
  );
};

export default QueuePage;