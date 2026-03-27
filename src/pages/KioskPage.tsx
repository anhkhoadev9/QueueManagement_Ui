import { useState, useEffect } from 'react';
import { Sparkles, Printer, User, Phone, ArrowRight, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = 'https://queuemanagement-hjaj.onrender.com/api/v1';

interface ServiceItem {
  Id: string;
  Name: string;
  Description: string;
}

const KioskPage = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [ticketNo, setTicketNo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

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
        const res = await fetch(`${API_BASE_URL}/services?PageNumber=1&PageSize=10&IncludeTicketDetails=true&MaxPageSize=50`, { headers });
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

    const res = await fetch(`${API_BASE_URL}/tickets`, {
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

    setTicketNo(ticketNumber);

  } catch (err: any) {
    console.error(err);
    setError(err.message || 'Lỗi hệ thống');
  } finally {
    setIsGenerating(false);
  }
};
  const handleReset = () => {
    setTicketNo(null);
    setSelectedService(null);
    setCustomerName('');
    setPhoneNumber('');
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
          
          <p className="text-gray-600 mb-8 text-center font-medium leading-relaxed">
            Xin vui lòng ngồi chờ đến lượt tại khu vực sảnh giao dịch.
          </p>
          
          <button onClick={handleReset} className="btn-primary w-full flex items-center justify-center space-x-2 group">
            <span>Tiếp tục lấy số khác</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
        <h2 className="text-4xl md:text-5xl font-black mb-6 text-gradient tracking-tight">
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

