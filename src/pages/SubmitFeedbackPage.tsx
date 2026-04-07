import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, MessageSquare, Send, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { apiClient } from '../contexts/AuthContext';

const SubmitFeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [ticket, setTicket] = useState<any>(null);
  const [error, setError] = useState('');

  // Feedback form state
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      setError('');
      setTicket(null);
      setSubmitted(false);

      // Search by ticket number or phone (need a backend endpoint that supports this or just use ID)
      // For now, assume we can search by ID or we need to add a search endpoint.
      // Since I can't change the backend easily now, I'll try to fetch by ID or handle error.
      // In a real scenario, we'd have /tickets/search?query=...
      
      const res = await apiClient.get(`/tickets/${searchQuery.trim()}`);
      const data = res.data;

      if (data.Status !== 3) { // 3 = Completed
        setError('Bạn chỉ có thể đánh giá sau khi dịch vụ đã được hoàn thành.');
        return;
      }

      setTicket(data);
    } catch (err: any) {
      console.error(err);
      setError('Không tìm thấy thông tin vé. Vui lòng kiểm tra lại mã vé.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !ticket) return;

    try {
      setIsSubmitting(true);
      setError('');

      await apiClient.post(`/tickets/${ticket.Id}/feedback`, {
        rating,
        comment: comment.trim(),
        serviceId: ticket.ServiceId,
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError('Gửi đánh giá thất bại. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-6 duration-700">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-vietin-blue font-semibold mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Đánh giá dịch vụ</h1>
          <p className="text-gray-500 mt-2 font-medium">Chúng tôi trân trọng ý kiến đóng góp của quý khách.</p>
        </div>

        {/* Search Section */}
        {!ticket && !submitted && (
          <div className="glassmorphism p-8 rounded-3xl shadow-xl border border-white/40">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Search className="w-6 h-6 text-vietin-blue" />
              Tìm kiếm vé của bạn
            </h2>
            
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập mã vé (ID) của bạn..."
                  className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-vietin-blue/10 focus:border-vietin-blue outline-none transition-all font-medium text-lg"
                />
              </div>
              
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-semibold animate-pulse">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSearching}
                className="w-full py-4 bg-vietin-blue hover:bg-vietin-darkBlue text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang tìm kiếm...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Tiếp tục</span>
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-400 text-center italic">
                Lưu ý: Bạn chỉ có thể đánh giá sau khi nhân viên đã xác nhận hoàn thành dịch vụ.
              </p>
            </div>
          </div>
        )}

        {/* Feedback Form Section */}
        {ticket && !submitted && (
          <div className="glassmorphism p-8 rounded-3xl shadow-xl border border-white/40 animate-in zoom-in duration-300">
            <div className="bg-vietin-blue/5 rounded-2xl p-6 mb-8 border border-vietin-blue/10 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-vietin-blue uppercase tracking-widest block mb-1">Mã vé của bạn</span>
                <span className="text-3xl font-black text-vietin-blue">{ticket.TicketNumber}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Dịch vụ</span>
                <span className="text-sm font-bold text-gray-700">{ticket.ServiceName}</span>
              </div>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-8">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800 mb-6">Bạn hài lòng với dịch vụ này chứ?</p>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHover(s)}
                      onMouseLeave={() => setHover(0)}
                      className="transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-12 h-12 transition-colors ${
                          s <= (hover || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-yellow-600 font-bold mt-4 animate-in fade-in">
                    {rating === 5 ? 'Tuyệt vời! 😍' : rating >= 4 ? 'Hài lòng! 😊' : 'Cảm ơn bạn!'}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 ml-1">Nhận xét (Tùy chọn)</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Cho chúng tôi biết thêm về trải nghiệm của bạn..."
                    className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-vietin-blue/10 focus:border-vietin-blue outline-none transition-all font-medium resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!rating || isSubmitting}
                className="w-full py-5 bg-vietin-blue hover:bg-vietin-darkBlue text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Đang gửi đánh giá...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Gửi đánh giá ngay</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Success Section */}
        {submitted && (
          <div className="glassmorphism p-12 rounded-3xl shadow-xl border border-white/40 text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-inner">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-4">Cảm ơn bạn!</h2>
            <p className="text-gray-500 font-medium mb-10 leading-relaxed">
              Chúng tôi đã ghi nhận đánh giá của bạn. Ý kiến của quý khách là động lực để chúng tôi cải thiện mỗi ngày.
            </p>
            <button
              onClick={() => navigate('/queue')}
              className="w-full py-4 bg-gray-800 hover:bg-black text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg"
            >
              Quay lại danh sách chờ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitFeedbackPage;
