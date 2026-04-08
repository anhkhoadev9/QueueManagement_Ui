import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Trash2, RefreshCw, Star, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiClient } from '../contexts/AuthContext';

interface FeedbackDto {
  id: string;
  comment?: string;
  rating?: number;
  userId?: string;
  userName?: string;
  serviceId?: string;
  serviceName?: string;
  queueTicketId?: string;
  ticketNumber?: string | number;
  createdAt?: string;
}


const StarRating = ({ rating }: { rating?: number }) => {
  const r = rating ?? 0;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${s <= r ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
        />
      ))}
    </div>
  );
};

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const PAGE_SIZE = 10;

  const fetchFeedbacks = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      setError('');
      
      const res = await apiClient.get('/feedbacks', {
        params: {
          PageNumber: pageNum,
          PageSize: PAGE_SIZE
        }
      });
      
      const data = res.data;
      console.log('API Response:', data);
      
      // ✅ Sửa: Lấy từ data.Items (chữ hoa I) hoặc data.items (chữ thường)
      let items: FeedbackDto[] = [];
      let total = 0;
      let pages = 1;
      
      if (data.Items && Array.isArray(data.Items)) {
        // Trường hợp API trả về { Items: [...] }
        items = data.Items;
        total = data.TotalCount || data.totalCount || items.length;
        pages = data.TotalPages || data.totalPages || 1;
      } else if (data.items && Array.isArray(data.items)) {
        // Trường hợp API trả về { items: [...] }
        items = data.items;
        total = data.totalCount || items.length;
        pages = data.totalPages || 1;
      } else if (Array.isArray(data)) {
        // Trường hợp API trả về trực tiếp mảng
        items = data;
        total = data.length;
        pages = 1;
      }
      
      // Map dữ liệu để đảm bảo các field đúng format
      const mappedItems = items.map((item: any) => ({
        id: item.id || item.Id,
        comment: item.comment || item.Comment,
        rating: item.rating || item.Rating,
        userId: item.userId || item.UserId,
        userName: item.userName || item.UserName || item.customerName || item.CustomerName,
        serviceId: item.serviceId || item.ServiceId,
        serviceName: item.serviceName || item.ServiceName,
        queueTicketId: item.queueTicketId || item.QueueTicketId,
        ticketNumber: item.ticketNumber || item.TicketNumber,
        createdAt: item.SubmittedAt,
      }));
      
      setFeedbacks(mappedItems);
      setTotalCount(total);
      setTotalPages(pages);
      
      console.log("Mapped feedbacks:", mappedItems);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError('Không thể tải danh sách đánh giá. ' + (err.message || ''));
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks(page);
  }, [page, fetchFeedbacks]);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa đánh giá này không?')) return;
    try {
      setDeletingId(id);
      await apiClient.delete(`/feedbacks/${id}`);
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
      setTotalCount((c) => c - 1);
    } catch (err: any) {
      console.error('Delete error:', err);
      alert('Xóa thất bại: ' + (err.response?.data?.message || err.message || ''));
    } finally {
      setDeletingId(null);
    }
  };

  // Filter theo search
  const filtered = feedbacks.filter((f) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (f.comment ?? '').toLowerCase().includes(s) ||
      (f.userName ?? '').toLowerCase().includes(s) ||
      (f.serviceName ?? '').toLowerCase().includes(s) ||
      (f.ticketNumber?.toString() ?? '').includes(s)
    );
  });

  // Tính rating trung bình
  const avgRating = (() => {
    const validRatings = feedbacks.filter(f => f.rating && f.rating > 0);
    if (validRatings.length === 0) return '—';
    const sum = validRatings.reduce((acc, f) => acc + (f.rating || 0), 0);
    return (sum / validRatings.length).toFixed(1);
  })();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý Đánh giá</h2>
          <p className="text-sm text-gray-500 mt-1">
            Tổng: {totalCount} đánh giá 
            {avgRating !== '—' && ` — Trung bình: ⭐ ${avgRating}/5`}
          </p>
        </div>
        <button
          onClick={() => fetchFeedbacks(page)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-vietin-blue text-white text-sm font-semibold hover:bg-vietin-darkBlue transition-colors disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm theo nội dung, tên, dịch vụ, số vé..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-vietin-blue"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && feedbacks.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-vietin-blue animate-pulse gap-3">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="font-medium">Đang tải đánh giá...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
            <MessageSquare className="w-12 h-12 opacity-20" />
            <p className="font-medium">Chưa có đánh giá nào</p>
            {search && <p className="text-sm">Không tìm thấy kết quả cho "{search}"</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['#', 'Khách hàng', 'Dịch vụ', 'Rating', 'Nội dung', 'Ngày', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((fb, idx) => (
                  <tr key={fb.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-400">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-800 text-sm">
                        {fb.userName || 'Khách vãng lai'}
                      </div>
                      {fb.ticketNumber && (
                        <div className="text-xs text-vietin-blue font-bold mt-0.5">
                          Vé #{fb.ticketNumber}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                        {fb.serviceName || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StarRating rating={fb.rating} />
                      {fb.rating && (
                        <span className="text-xs text-gray-500 font-bold mt-0.5 block">
                          {fb.rating}/5
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      {fb.comment ? (
                        <p className="text-sm text-gray-700 italic line-clamp-2">
                          "{fb.comment}"
                        </p>
                      ) : (
                        <span className="text-gray-400 text-xs">Không có nhận xét</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                      {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString('vi-VN') : '—'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(fb.id)}
                        disabled={deletingId === fb.id}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                        title="Xóa đánh giá"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-gray-700">
            Trang {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;