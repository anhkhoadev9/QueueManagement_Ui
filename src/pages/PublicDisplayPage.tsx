import { Volume2 } from 'lucide-react';

const mockCurrentTicket = {
  number: '2050',
  counter: '03',
  service: 'Nộp/Rút tiền'
};

const mockWaitingList = [
  '2051', '2052', '2053', '2054'
];

const PublicDisplayPage = () => {
  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[70vh]">
      {/* Current Called Ticket */}
      <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col overflow-hidden">
        <div className="bg-vietin-blue text-white text-center py-4">
          <h2 className="text-2xl font-bold tracking-wide uppercase">Khách hàng đang phục vụ</h2>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-white to-gray-50">
          <div className="animate-pulse mb-6 text-vietin-red">
            <Volume2 className="w-16 h-16 inline-block" />
          </div>
          <p className="text-gray-500 text-xl font-medium mb-2">Xin mời khách hàng có số thứ tự</p>
          <div className="text-8xl md:text-[10rem] font-black text-vietin-red my-4 leading-none">
            {mockCurrentTicket.number}
          </div>
          <div className="mt-8 text-3xl font-bold text-gray-800">
            Xin đến <span className="text-vietin-blue underline decoration-4 underline-offset-8">Quầy số {mockCurrentTicket.counter}</span>
          </div>
        </div>
      </div>

      {/* Waiting List Sidebar */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="bg-gray-800 text-white text-center py-3">
            <h3 className="text-lg font-bold">Danh sách đang chờ</h3>
          </div>
          <div className="p-4 flex flex-wrap gap-3 justify-center">
            {mockWaitingList.map(num => (
              <div key={num} className="w-20 h-16 flex items-center justify-center bg-gray-100 rounded-lg text-2xl font-bold text-gray-700 border border-gray-200">
                {num}
              </div>
            ))}
            <div className="w-20 h-16 flex items-center justify-center bg-gray-50 rounded-lg text-lg font-medium text-gray-400 border border-dashed border-gray-300">
              ...
            </div>
          </div>
        </div>

        {/* Video / Quảng cáo placeholder */}
        <div className="flex-1 bg-vietin-darkBlue rounded-2xl shadow-md flex items-center justify-center text-white/50 border-4 border-white/10">
          <p className="text-center px-6">Video / Hình ảnh quảng cáo của VietinBank</p>
        </div>
      </div>
    </div>
  );
};

export default PublicDisplayPage;
