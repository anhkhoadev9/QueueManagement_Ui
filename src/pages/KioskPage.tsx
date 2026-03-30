import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Printer, User, Phone, ArrowRight, Activity, Users, Star, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

//const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
interface ServiceItem {
  Id: string;
  Name: string;
  Description: string;
}

const KioskPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [ticketNo, setTicketNo] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // Feedback state
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackHover, setFeedbackHover] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user && !customerName) {
      setCustomerName(user.email.split('@')[0]);
    }
  }, [user]);

  // Fetch Services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const headers: any = { 'accept': '*/*' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // Uses paginated endpoint without strict parameters to get list
        const res = await fetch(`${VITE_API_BASE_URL}/services?PageNumber=1&PageSize=10&IncludeTicketDetails=true&MaxPageSize=50`, { headers });
        if (res.ok) {
          const data = await res.json();
          // Adjust based on your GetPaginatedResultServiceQuery response shape: (e.g. data.items, data.data)
         const items = data.Items || data.items || data.data || data;
        console.log("Fetched services:", items);
          setServices(Array.isArray(items) ? items : []);
        }
      } catch (err) {
        console.error("Failed to fetch services", err);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const handleGenerateTicket = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!selectedService || !customerName || !phoneNumber) {
    setError('Vui lòng nhập đủ thông tin.');
    return;
  }

  try {
    setIsGenerating(true);
    setError('');

    const token = localStorage.getItem('accessToken');

    const res = await fetch(`${VITE_API_BASE_URL}/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify({
        customerName,
        phoneNumber,
        serviceId: selectedService.Id
      })
    });

    // ❗ parse JSON trực tiếp
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(
        data?.message ||
        data?.title ||
        'Không thể tạo vé.'
      );
    }

    // ✅ backend trả ticket
    const ticketNumber =
      data?.ticketNumber ||
      data?.TicketNumber ||
      (data?.id ? data.id.substring(0, 4) : `T${Date.now()}`);

    const generatedTicketId = data?.id || data?.Id || null;
    setTicketId(generatedTicketId);
    setTicketNo(ticketNumber);
    // Reset feedback state for new ticket
    setFeedbackRating(0);
    setFeedbackComment('');
    setFeedbackSubmitted(false);

  } catch (err: any) {
    console.error(err);
    setError(err.message || 'Lỗi hệ thống');
  } finally {
    setIsGenerating(false);
  }
};
  const handleReset = () => {
    setTicketNo(null);
    setTicketId(null);
    setSelectedService(null);
    setCustomerName('');
    setPhoneNumber('');
    setFeedbackRating(0);
    setFeedbackComment('');
    setFeedbackSubmitted(false);
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackRating || !ticketId) return;
    try {
      setFeedbackLoading(true);
      const token = localStorage.getItem('accessToken');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const body: any = { rating: feedbackRating };
      if (feedbackComment.trim()) body.comment = feedbackComment.trim();
      if (selectedService?.Id) body.serviceId = selectedService.Id;
      if (user?.userId) body.userId = user.userId;

      await fetch(`${VITE_API_BASE_URL}/tickets/${ticketId}/feedback`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error('Feedback submit error:', err);
    } finally {
      setFeedbackLoading(false);
    }
  };

  // 1. TICKET GENERATED VIEW
  if (ticketNo) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] w-full animate-in fade-in zoom-in duration-500">
        <div className="glassmorphism p-12 rounded-3xl w-full max-w-md relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-vietin-blue to-vietin-darkBlue"></div>
          
          <div className="w-20 h-20 bg-vietin-lightBlue rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Printer className="w-10 h-10 text-vietin-blue" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Số thứ tự của quý khách</h2>
          <div className="text-lg font-semibold text-vietin-blue mb-2">{selectedService?.Name || services[0]?.Name}</div>
          
          <div className="w-full bg-gray-50/80 rounded-2xl p-8 my-4 border border-gray-100 shadow-inner text-center">
            <div className="text-7xl font-black text-vietin-blue tracking-tight drop-shadow-sm">
              {ticketNo}
            </div>
            <div className="text-sm font-medium text-gray-500 mt-4 uppercase tracking-widest">
              Khách: {customerName}
            </div>
          </div>
          
          <p className="text-gray-600 mb-6 text-center font-medium leading-relaxed">
            Xin vui lòng ngồi chờ đến lượt tại khu vực sảnh giao dịch.
          </p>

          {/* Inline Feedback Form */}
          <div className="w-full border border-gray-100 rounded-2xl p-5 bg-gray-50/60 mb-4">
            {feedbackSubmitted ? (
              <div className="flex flex-col items-center gap-2 py-2 text-green-600">
                <CheckCircle2 className="w-8 h-8" />
                <p className="font-semibold text-sm">Cảm ơn bạn đã đánh giá!</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-vietin-blue" />
                  <p className="text-sm font-bold text-gray-700">Bạn cảm thấy thế nào? (Tùy chọn)</p>
                </div>
                {/* Star Rating */}
                <div className="flex gap-1 justify-center mb-3">
                  {[1,2,3,4,5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFeedbackRating(s)}
                      onMouseEnter={() => setFeedbackHover(s)}
                      onMouseLeave={() => setFeedbackHover(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          s <= (feedbackHover || feedbackRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {/* Comment */}
                <textarea
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Nhận xét của bạn (không bắt buộc)..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-vietin-blue bg-white mb-3"
                />
                <button
                  onClick={handleSubmitFeedback}
                  disabled={!feedbackRating || feedbackLoading}
                  className="w-full py-2 px-4 bg-vietin-blue text-white text-sm font-bold rounded-xl hover:bg-vietin-darkBlue transition-all disabled:opacity-40 active:scale-95"
                >
                  {feedbackLoading ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </>
            )}
          </div>

          <button onClick={handleReset} className="btn-primary w-full flex items-center justify-center space-x-2 group">
            <span>Tiếp tục lấy số khác</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigate('/queue')}
            className="mt-3 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-vietin-blue text-vietin-blue hover:bg-vietin-lightBlue/40 font-semibold transition-all group"
          >
            <Users className="w-5 h-5" />
            <span>Xem danh sách hàng chờ</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. FORM TO ENTER INFO AFTER SERVICE SELECTION
  if (selectedService) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] w-full animate-in fade-in zoom-in duration-300">
        <div className="bg-white p-10 rounded-3xl w-full max-w-md border border-gray-100 shadow-xl relative">
          <button onClick={() => setSelectedService(null)} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700 font-medium text-sm">
            ← Quay lại
          </button>
          
          <div className="text-center mt-6 mb-8">
            <div className="w-16 h-16 bg-vietin-lightBlue text-vietin-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Dịch vụ: {selectedService.Name}</h2>
            <p className="text-gray-500 text-sm mt-2">Vui lòng nhập thông tin để hệ thống đăng ký.</p>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 text-vietin-red rounded-lg text-sm text-center font-medium">{error}</div>}

          <form onSubmit={handleGenerateTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên khách hàng</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><User className="w-5 h-5"/></div>
                <input required type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-vietin-blue outline-none" placeholder="Nguyễn Văn A" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Phone className="w-5 h-5"/></div>
                <input required type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-vietin-blue outline-none" placeholder="0901234567" />
              </div>
            </div>
            <button type="submit" disabled={isGenerating} className="w-full mt-6 py-4 bg-vietin-blue hover:bg-vietin-darkBlue active:scale-95 transition-all text-white font-bold rounded-xl shadow-lg disabled:opacity-70 flex justify-center items-center">
              {isGenerating ? 'Đang tạo số...' : 'Xác nhận lấy số'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. MAIN SERVICE LISTING VIEW
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] w-full animate-in slide-in-from-bottom-4 fade-in duration-700">
      <div className="text-center mb-12 max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-black h-20 text-vietin-bluemb-6 text-gradient tracking-tight">
          Chọn dịch vụ Barber / Salon
        </h2>
        <p className="text-xl text-gray-600 font-medium leading-relaxed">
          Vui lòng chọn loại dịch vụ bạn cần thực hiện tại cửa hàng <br className="hidden md:block"/> bên dưới để lấy số chờ.
        </p>
      </div>

      {loadingServices ? (
        <div className="flex items-center space-x-3 text-vietin-blue font-medium animate-pulse">
            <Activity className="animate-spin" /> <span>Đang tải danh sách dịch vụ...</span>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center text-gray-500 bg-white p-8 rounded-2xl shadow-sm">
           Chưa có dữ liệu dịch vụ. Vui lòng thêm dịch vụ trong trang Quản trị.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          {services.map((service) => (
            <button
              key={service.Id}
              onClick={() => setSelectedService(service)}
              className="group relative flex items-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:border-vietin-blue/50 border border-gray-100 transition-all duration-300 overflow-hidden text-left"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-vietin-lightBlue/40 to-transparent rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-150"></div>
              
              <div className="flex-shrink-0 w-16 h-16 bg-vietin-lightBlue text-vietin-blue rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-vietin-blue group-hover:text-white transition-all duration-300 shadow-sm">
                <Sparkles className="w-8 h-8" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-vietin-blue transition-colors">
                  {service.Name || 'Dịch vụ Salon'}
                </h3>
                <p className="text-sm font-medium text-gray-500 line-clamp-2">
                  {service.Description || 'Chăm sóc và tạo kiểu chuyên nghiệp'}
                </p>
              </div>
              
              <div className="opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-vietin-blue">
                <ArrowRight className="w-6 h-6" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default KioskPage;

