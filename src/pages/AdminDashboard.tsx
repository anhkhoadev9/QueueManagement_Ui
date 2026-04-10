
// import { useState, useEffect } from 'react';
// import { Plus, Edit2, Trash2, RefreshCw, Clock, Hash, Star, ArrowRight, XCircle, UserMinus,X } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { apiClient } from '../contexts/AuthContext';

// interface Ticket {
//   Id: string;
//   TicketNumber: string;
//   CustomerName: string;
//   PhoneNumber: string;
//   ServiceName: string;
//   Status: number;
//   IssuedAt: string;
//   CalledAt?: string | null;
// }

// interface FeedbackDto {
//   id: string;
//   comment?: string;
//   rating?: number;
//   userName?: string;
//   serviceName?: string;
//   createdAt?: string;
// }
// interface Service {
//   Id: string;
//   Name: string;
//   Description?: string;
//   status: number; // 1: Active, 0: Locked/Inactive
//   createdAt?: string;
//   updatedAt?: string;
//   IsActive: boolean;
// }

 
// // Map status
// const STATUS_MAP: Record<number, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
//   1: { 
//     label: 'Đang chờ', 
//     color: 'text-yellow-700', 
//     bgColor: 'bg-yellow-100',
//     icon: <Clock className="w-3.5 h-3.5" /> 
//   },
//   2: { 
//     label: 'Đang phục vụ', 
//     color: 'text-amber-700', 
//     bgColor: 'bg-amber-100',
//     icon: <RefreshCw className="w-3.5 h-3.5 animate-spin" /> 
//   },
//   3: { 
//     label: 'Hoàn thành', 
//     color: 'text-green-700', 
//     bgColor: 'bg-green-100',
//     icon: <Star className="w-3.5 h-3.5" /> 
//   },
//   4: { 
//     label: 'Vắng mặt', 
//     color: 'text-orange-700', 
//     bgColor: 'bg-orange-100',
//     icon: <UserMinus className="w-3.5 h-3.5" /> 
//   },
//   5: { 
//     label: 'Đã hủy', 
//     color: 'text-red-700', 
//     bgColor: 'bg-red-100',
//     icon: <XCircle className="w-3.5 h-3.5" /> 
//   },
// };

// const StarRating = ({ rating }: { rating?: number }) => {
//   const r = rating ?? 0;
//   return (
//     <div className="flex gap-0.5">
//       {[1, 2, 3, 4, 5].map((s) => (
//         <Star key={s} className={`w-3.5 h-3.5 ${s <= r ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
//       ))}
//     </div>
//   );
// };

// // Component cho bảng danh sách
// const TicketTable = ({ tickets, title, icon }: { 
//   tickets: Ticket[]; 
//   title: string; 
//   icon: React.ReactNode;
//   emptyMessage: string;
// }) => {
//   if (tickets.length === 0) return null;
  
//   return (
//     <div className="mb-8">
//       <div className="flex items-center gap-3 mb-4">
//         {icon}
//         <h3 className="text-xl font-bold text-gray-800">{title}</h3>
//        <span className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4-100 text-red-700 font-bold px-2.5 py-0.5 rounded-full text-sm">
//   {tickets.length}
// </span>
//       </div>
      
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
//                 <th className="p-4 font-bold">Thứ tự</th>
//                 <th className="p-4 font-bold">Số vé</th>
//                 <th className="p-4 font-bold">Khách hàng</th>
//                 <th className="p-4 font-bold">Dịch vụ</th>
//                 <th className="p-4 font-bold">Giờ lấy số</th>
//                 <th className="p-4 font-bold text-center">Trạng thái</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {tickets.map((ticket, index) => (
//                 <tr key={ticket.Id} className="hover:bg-gray-50/50 transition-colors group">
//                   <td className="p-4 text-gray-400 font-medium">#{index + 1}</td>
//                   <td className="p-4">
//                     <div className="flex items-center gap-2">
//                       <Hash className="w-4 h-4 text-vietin-blue opacity-50" />
//                       <span className="font-black text-vietin-blue text-lg">{ticket.TicketNumber}</span>
//                     </div>
//                   </td>
//                   <td className="p-4">
//                     <div className="font-bold text-gray-800">{ticket.CustomerName}</div>
//                     <div className="text-xs text-gray-500">{ticket.PhoneNumber}</div>
//                   </td>
//                   <td className="p-4">
//                     <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
//                       {ticket.ServiceName}
//                     </span>
//                   </td>
//                   <td className="p-4">
//                     <div className="flex items-center gap-2 text-gray-500 text-sm">
//                       <Clock className="w-4 h-4" />
//                       {new Date(ticket.IssuedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                     </div>
//                   </td>
//                   <td className="p-4 text-center">
//                     <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${STATUS_MAP[ticket.Status]?.bgColor} ${STATUS_MAP[ticket.Status]?.color}`}>
//                       {STATUS_MAP[ticket.Status]?.icon}
//                       {STATUS_MAP[ticket.Status]?.label}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AdminDashboard = () => {
//   const [allTickets, setAllTickets] = useState<Ticket[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
//   const [recentFeedbacks, setRecentFeedbacks] = useState<FeedbackDto[]>([]);
//   const [feedbackLoading, setFeedbackLoading] = useState(true);


//   const fetchAllTickets = async () => {
//     try {
//       setLoading(true);
//       // Gọi API lấy tất cả tickets (hoặc tickets đang hoạt động)
//       const res = await apiClient.get('/tickets/waitings');
//       setAllTickets(res.data);
//       setLastUpdated(new Date());
//     } catch (err) {
//       console.error("Failed to fetch tickets", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//  const fetchRecentFeedbacks = async () => {
//   try {
//     setFeedbackLoading(true);
//     // Gọi API lấy tất cả feedbacks (không giới hạn PageSize)
//     const res = await apiClient.get('/feedbacks', {
//       params: { PageNumber: 1, PageSize: 100 } // Lấy nhiều hơn để filter
//     });
    
//     const data = res.data;
//     const items = data.items ?? data ?? [];
//     const feedbacks = Array.isArray(items) ? items : [];
    
//     // Lọc ra feedback chưa bị xóa mềm (IsDelete = false)
//     const activeFeedbacks = feedbacks.filter((fb: any) => fb.isDelete === false);
    
//     // Sắp xếp theo thời gian giảm dần (mới nhất lên đầu) và lấy 2 cái mới nhất
//     const sortedFeedbacks = activeFeedbacks
//       .sort((a: any, b: any) => {
//         const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
//         const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
//         return dateB - dateA; // Mới nhất lên trước
//       })
//       .slice(0, 2); // Lấy 2 feedback mới nhất
    
//     setRecentFeedbacks(sortedFeedbacks);
//   } catch (err) {
//     console.error("Failed to fetch feedbacks", err);
//     setRecentFeedbacks([]);
//   } finally {
//     setFeedbackLoading(false);
//   }
// };
// const [services, setServices] = useState<Service[]>([]);
//   const [servicesLoading, setServicesLoading] = useState(true);
//   const [showServiceModal, setShowServiceModal] = useState(false);
//   const [editingService, setEditingService] = useState<Service | null>(null);
//   const [serviceEditForm, setServiceEditForm] = useState({Id:'', Name: '', Description: '', });
//    const [serviceAddForm, setServiceAddForm] = useState({ Name: '', Description: '' });
//   const [submitting, setSubmitting] = useState(false);
  

//   // Fetch services
//   const fetchServices = async () => {
//     try {
//       setServicesLoading(true);
//       const res = await apiClient.get('/services', {
//         params: { PageNumber: 1, PageSize: 15 }
//       });
//       const data = res.data;
//       const items = data.Items ?? data ?? [];
//       setServices(Array.isArray(items) ? items : []);
//       console.log("Fetched services:", items);
//     } catch (err) {
//       console.error("Failed to fetch services", err);
//     } finally {
//       setServicesLoading(false);
//     }
//   };

//   // Create service
//   const handleCreateService = async () => {
//     if (!serviceAddForm.Name.trim()) {
//       alert('Vui lòng nhập tên dịch vụ');
//       return;
//     }

//     try {
//       setSubmitting(true);
//       await apiClient.post('/services', {
//         name: serviceAddForm.Name,
//         description: serviceAddForm.Description
//       });
//       await fetchServices();
//       closeServiceModal();
//       alert('Thêm dịch vụ thành công!');
//     } catch (err: any) {
//       console.error('Create error:', err);
//       alert('Thêm thất bại: ' + (err.response?.data?.message || err.message));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Update service
//   const handleUpdateService = async () => {
//     if (!editingService) return;
//     if (!serviceEditForm.Name.trim()) {
//       alert('Vui lòng nhập tên dịch vụ');
//       return;
//     }

//     try {
//       setSubmitting(true);
//       await apiClient.put(`/services/${editingService.Id}`, {
//         Id: editingService.Id,
//         Name: serviceEditForm.Name,
//         Description: serviceEditForm.Description
//       });
//       console.log("Update response:", editingService.Id);
//       await fetchServices();
//       closeServiceModal();
//       alert('Cập nhật dịch vụ thành công!');
//     } catch (err: any) {
//       console.error('Update error:', err);
//        console.log("Update response:", editingService.Id  );
//       alert('Cập nhật thất bại: ' + (err.response?.data?.message || err.message));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Soft delete service
//   const handleDeleteService = async (id: string, name: string) => {
//     if (!confirm(`Bạn có chắc muốn xóa dịch vụ "${name}"?`)) return;
    
//     try {
//       await apiClient.delete(`/services/${id}`);
//       await fetchServices();
//       alert('Xóa dịch vụ thành công!');
//     } catch (err: any) {
//       console.error('Delete error:', err);
//       if (err.response?.status === 422) {
//         alert('Dịch vụ này đã được xóa trước đó hoặc đang được sử dụng!');
//       } else {
//         alert('Xóa thất bại: ' + (err.response?.data?.message || err.message));
//       }
//     }
//   };

  
//   // Open modal for create/edit
//   const openCreateModal = () => {
//     setEditingService(null);
//     setServiceAddForm({ Name: '', Description: '' });
//     setShowServiceModal(true);
//   };

//   const openEditModal = (service: Service) => {
  
//     setEditingService(service);
//     setServiceEditForm({ 
//       Id: service.Id,
//       Name: service.Name, 
//       Description: service.Description || '' 
//     });
//     setShowServiceModal(true);
//   };

//   const closeServiceModal = () => {
//     setShowServiceModal(false);
//     setEditingService(null);
//     setServiceEditForm({ Id:'', Name: '', Description: '' });
//     setServiceAddForm({   Name: '', Description: '' });
//   };

//   useEffect(() => {
//     fetchAllTickets();
//     fetchRecentFeedbacks();
//     fetchServices(); // Thêm fetch services
//     const interval = setInterval(fetchAllTickets, 30000);
//     return () => clearInterval(interval);
//   }, []);
  
//   // Phân loại tickets theo status
//   const waitingTickets = allTickets.filter(t => t.Status === 1);
//   const skippedTickets = allTickets.filter(t => t.Status === 4);
//   const cancelledTickets = allTickets.filter(t => t.Status === 5);
//   const inProgressTickets = allTickets.filter(t => t.Status === 2);

//   if (loading && allTickets.length === 0) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="flex flex-col items-center gap-3 text-vietin-blue">
//           <RefreshCw className="w-8 h-8 animate-spin" />
//           <p className="font-medium">Đang tải dữ liệu...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8 animate-in fade-in duration-500">
//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
//           <div className="text-3xl font-black text-yellow-700">{waitingTickets.length}</div>
//           <div className="text-sm font-medium text-yellow-600 mt-1">Đang chờ</div>
//         </div>
//         <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
//           <div className="text-3xl font-black text-amber-700">{inProgressTickets.length}</div>
//           <div className="text-sm font-medium text-amber-600 mt-1">Đang phục vụ</div>
//         </div>
//         <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
//           <div className="text-3xl font-black text-orange-700">{skippedTickets.length}</div>
//           <div className="text-sm font-medium text-orange-600 mt-1">Vắng mặt</div>
//         </div>
//         <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
//           <div className="text-3xl font-black text-red-700">{cancelledTickets.length}</div>
//           <div className="text-sm font-medium text-red-600 mt-1">Đã hủy</div>
//         </div>
//       </div>

//       {/* Header với nút refresh */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">Quản lý hàng chờ</h2>
//           <p className="text-xs text-gray-400 mt-1">
//             Cập nhật lúc: {lastUpdated.toLocaleTimeString('vi-VN')}
//           </p>
//         </div>
//         <button 
//           onClick={fetchAllTickets}
//           disabled={loading}
//           className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-vietin-blue text-white font-semibold hover:bg-vietin-darkBlue transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//         >
//           <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//           Làm mới
//         </button>
//       </div>

//       {/* Bảng khách hàng đang chờ */}
//       <TicketTable 
//         tickets={waitingTickets}
//         title="Khách hàng đang đợi"
//         icon={<Clock className="w-6 h-6 text-yellow-600" />}
//         emptyMessage="Hiện không có khách hàng nào đang đợi"
//       />

//       {/* Bảng khách hàng đang phục vụ */}
//       {inProgressTickets.length > 0 && (
//         <TicketTable 
//           tickets={inProgressTickets}
//           title="Đang phục vụ"
//           icon={<RefreshCw className="w-6 h-6 text-amber-600 animate-spin" />}
//           emptyMessage=""
//         />
//       )}

//       {/* Bảng khách hàng vắng mặt */}
//       <TicketTable 
//         tickets={skippedTickets}
//         title="Khách hàng vắng mặt"
//         icon={<UserMinus className="w-6 h-6 text-orange-600" />}
//         emptyMessage="Chưa có khách hàng vắng mặt"
//       />

//       {/* Bảng khách hàng đã hủy */}
//       <TicketTable 
//         tickets={cancelledTickets}
//         title="Khách hàng đã hủy"
//         icon={<XCircle className="w-6 h-6 text-red-600" />}
//         emptyMessage="Chưa có khách hàng hủy vé"
//       />

//       <hr className="border-gray-100" />

 
// <section>
//   <div className="flex justify-between items-center mb-6">
//     <h2 className="text-2xl font-bold text-gray-800">Danh sách Dịch vụ</h2>
//     <button 
//       onClick={openCreateModal}
//       className="flex items-center gap-2 bg-vietin-blue hover:bg-vietin-darkBlue text-white px-4 py-2 rounded-lg font-medium transition-all active:scale-95"
//     >
//       <Plus className="w-5 h-5" /> Thêm dịch vụ
//     </button>
//   </div>

//   {servicesLoading ? (
//     <div className="text-center text-gray-400 py-8 animate-pulse">Đang tải dịch vụ...</div>
//   ) : services.length === 0 ? (
//     <div className="text-center text-gray-400 py-8 bg-white rounded-2xl border border-gray-200">
//       Chưa có dịch vụ nào. Hãy thêm dịch vụ đầu tiên!
//     </div>
//   ) : (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//       <table className="w-full text-left border-collapse">
//         <thead>
//           <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
//             <th className="p-4 font-bold">STT</th>
//             <th className="p-4 font-bold">Tên dịch vụ</th>
//             <th className="p-4 font-bold">Mô tả</th>
//             <th className="p-4 font-bold">Trạng thái</th>
//             <th className="p-4 font-bold text-right">Thao tác</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-100">
//           {services.map((service, index) => (
//             <tr key={service.Id} className="hover:bg-gray-50 transition-colors">
//               <td className="p-4 text-gray-400 text-sm">#{index + 1}</td>
//               <td className="p-4 font-bold text-gray-800">{service.Name}</td>
//               <td className="p-4 text-gray-600 text-sm max-w-xs truncate">
//                 {service.Description || '—'}
//               </td>
//               <td className="p-4">
//                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                  service.IsActive == true 
//                     ? 'bg-green-100 text-green-700' 
//                     : 'bg-gray-100 text-gray-500'
//                 }`}>
//                   {service.IsActive == true ? 'Hoạt động' : 'Đã khóa'}
//                 </span>
//               </td>
//               <td className="p-4 text-right flex justify-end gap-2">
               
                
//                 {/* Edit button */}
//                 <button 
//                   onClick={() => openEditModal(service)}
//                   className="text-vietin-blue hover:text-vietin-darkBlue p-2 bg-blue-50 rounded-lg transition-colors"
//                   title="Sửa dịch vụ"
//                 >
//                   <Edit2 className="w-4 h-4" />
//                 </button>
                
//                 {/* Delete button */}
//                 <button 
//                   onClick={() => handleDeleteService(service.Id, service.Name)}
//                   className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded-lg transition-colors"
//                   title="Xóa dịch vụ"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )}
// </section>
// {/* Service Modal - Create/Edit */}

// {showServiceModal && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 px-4">
//     <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
//       <div className="bg-vietin-blue p-5 text-white flex justify-between items-center">
//         <h3 className="text-xl font-bold">
//           {editingService ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}
//         </h3>
//         <button 
//           onClick={closeServiceModal}
//           className="text-white/80 hover:text-white transition-colors"
//         >
//           <X className="w-5 h-5" />
//         </button>
//       </div>
      
//       <div className="p-6">
//         <div className="mb-4">
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Tên dịch vụ <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             value={editingService ? serviceEditForm.Name : serviceAddForm.Name}
//             onChange={(e) => {
//               if (editingService) {
//                 setServiceEditForm({ ...serviceEditForm, Name: e.target.value });
//               } else {
//                 setServiceAddForm({ ...serviceAddForm, Name: e.target.value });
//               }
//             }}
//             className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vietin-blue focus:border-transparent"
//             placeholder="VD: Cắt tóc nam"
//           />
//         </div>
        
//         <div className="mb-6">
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Mô tả
//           </label>
//           <textarea
//             value={editingService ? serviceEditForm.Description : serviceAddForm.Description}
//             onChange={(e) => {
//               if (editingService) {
//                 setServiceEditForm({ ...serviceEditForm, Description: e.target.value });
//               } else {
//                 setServiceAddForm({ ...serviceAddForm, Description: e.target.value });
//               }
//             }}
//             rows={3}
//             className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vietin-blue focus:border-transparent resize-none"
//             placeholder="Mô tả chi tiết về dịch vụ..."
//           />
//         </div>
        
//         <div className="flex gap-3">
//           <button
//             onClick={closeServiceModal}
//             className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
//           >
//             Hủy
//           </button>
//           <button
//             onClick={editingService ? handleUpdateService : handleCreateService}
//             disabled={submitting}
//             className="flex-1 px-4 py-3 bg-vietin-blue hover:bg-vietin-darkBlue text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
//           >
//             {submitting ? (
//               <>
//                 <RefreshCw className="w-4 h-4 animate-spin" />
//                 Đang xử lý...
//               </>
//             ) : (
//               editingService ? 'Cập nhật' : 'Thêm mới'
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// )}
//       {/* Recent Feedbacks — Real API Data */}
//       <section className="mt-8 pt-8 border-t border-gray-100">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">Đánh giá mới nhất</h2>
//           <Link
//             to="/admin/feedbacks"
//             className="flex items-center gap-1.5 text-sm font-semibold text-vietin-blue hover:text-vietin-darkBlue transition-colors"
//           >
//             Xem tất cả <ArrowRight className="w-4 h-4" />
//           </Link>
//         </div>

//         {feedbackLoading ? (
//           <div className="text-center text-gray-400 py-8 animate-pulse">Đang tải đánh giá...</div>
//         ) : recentFeedbacks.length === 0 ? (
//           <div className="text-center text-gray-400 py-8">Chưa có đánh giá nào.</div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {recentFeedbacks.map((fb) => (
//               <div key={fb.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-vietin-blue hover:shadow-md transition-shadow">
//                 <div className="flex justify-between items-start mb-3">
//                   <h4 className="font-bold text-gray-800 truncate">{fb.userName || 'Khách hàng'}</h4>
//                   <StarRating rating={fb.rating} />
//                 </div>
//                 {fb.comment && (
//                   <p className="text-sm text-gray-600 italic line-clamp-2">"{fb.comment}"</p>
//                 )}
//                 <div className="mt-4 flex justify-between items-center">
//                   <span className="text-xs font-bold text-vietin-blue">{fb.serviceName || '—'}</span>
//                   <span className="text-[10px] text-gray-400 uppercase font-medium">
//                     {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString('vi-VN') : '—'}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };

// export default AdminDashboard;
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, RefreshCw, Clock, Hash, Star, ArrowRight, XCircle, UserMinus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '../contexts/AuthContext';

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

interface Service {
  Id: string;
  Name: string;
  Description?: string;
  EstimatedDurationMinus: number;
  IsActive: boolean;
  Status: number;
  CreatedAt?: string;
  UpdatedAt?: string;
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
        <span className="bg-gradient-to-br from-orange-50 to-orange-100 text-red-700 font-bold px-2.5 py-0.5 rounded-full text-sm">
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
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceEditForm, setServiceEditForm] = useState({ 
    Id: '', 
    Name: '', 
    Description: '', 
    EstimatedDurationMinus: 30, 
    IsActive: true 
  });
  const [serviceAddForm, setServiceAddForm] = useState({ 
    Name: '', 
    Description: '',
    EstimatedDurationMinus: 30
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAllTickets = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/tickets/waitings');
      setAllTickets(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentFeedbacks = async () => {
    try {
      setFeedbackLoading(true);
      const res = await apiClient.get('/feedbacks', {
        params: { PageNumber: 1, PageSize: 100 }
      });
      
      const data = res.data;
      const items = data.items ?? data ?? [];
      const feedbacks = Array.isArray(items) ? items : [];
      
      const activeFeedbacks = feedbacks.filter((fb: any) => fb.isDelete === false);
      
      const sortedFeedbacks = activeFeedbacks
        .sort((a: any, b: any) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 2);
      
      setRecentFeedbacks(sortedFeedbacks);
    } catch (err) {
      console.error("Failed to fetch feedbacks", err);
      setRecentFeedbacks([]);
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Fetch services
  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      const res = await apiClient.get('/services', {
        params: { PageNumber: 1, PageSize: 100 }
      });
      const data = res.data;
      const items = data.Items ?? data ?? [];
      
      // Map data từ API về interface Service (PascalCase)
      const mappedServices = Array.isArray(items) ? items.map((item: any) => ({
        Id: item.id || item.Id,
        Name: item.name || item.Name,
        Description: item.description || item.Description,
        EstimatedDurationMinus: item.estimatedDurationMinus || item.EstimatedDurationMinus || 30,
        IsActive: item.isActive !== undefined ? item.isActive : (item.IsActive !== undefined ? item.IsActive : true),
        Status: item.status || (item.isActive || item.IsActive ? 1 : 0)
      })) : [];
      
      setServices(mappedServices);
      console.log("Fetched services:", mappedServices);
    } catch (err) {
      console.error("Failed to fetch services", err);
    } finally {
      setServicesLoading(false);
    }
  };

  // Create service
  const handleCreateService = async () => {
    if (!serviceAddForm.Name.trim()) {
      alert('Vui lòng nhập tên dịch vụ');
      return;
    }

    try {
      setSubmitting(true);
      await apiClient.post('/services', {
        name: serviceAddForm.Name,
        description: serviceAddForm.Description,
        estimatedDurationMinus: serviceAddForm.EstimatedDurationMinus || 30
      });
      await fetchServices();
      closeServiceModal();
      alert('Thêm dịch vụ thành công!');
    } catch (err: any) {
      console.error('Create error:', err);
      alert('Thêm thất bại: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  // Update service
  const handleUpdateService = async () => {
    if (!editingService) return;
    if (!serviceEditForm.Name.trim()) {
      alert('Vui lòng nhập tên dịch vụ');
      return;
    }

    try {
      setSubmitting(true);
      
      const updateData = {
        Id: editingService.Id,
        Name: serviceEditForm.Name,
        Description: serviceEditForm.Description,
        EstimatedDurationMinus: serviceEditForm.EstimatedDurationMinus,
        IsActive: serviceEditForm.IsActive
      };
      
      console.log("Sending update data:", updateData);
      
      await apiClient.put(`/services/${editingService.Id}`, updateData);
      await fetchServices();
      closeServiceModal();
      alert('Cập nhật dịch vụ thành công!');
    } catch (err: any) {
      console.error('Update error:', err);
      console.log("Error details:", err.response?.data);
      alert('Cập nhật thất bại: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  // Soft delete service
  const handleDeleteService = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa dịch vụ "${name}"?`)) return;
    
    try {
      await apiClient.delete(`/services/${id}`);
      await fetchServices();
      alert('Xóa dịch vụ thành công!');
    } catch (err: any) {
      console.error('Delete error:', err);
      if (err.response?.status === 422) {
        alert('Dịch vụ này đã được xóa trước đó hoặc đang được sử dụng!');
      } else {
        alert('Xóa thất bại: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // Open modal for create/edit
  const openCreateModal = () => {
    setEditingService(null);
    setServiceAddForm({ 
      Name: '', 
      Description: '',
      EstimatedDurationMinus: 30 
    });
    setShowServiceModal(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setServiceEditForm({ 
      Id: service.Id,
      Name: service.Name, 
      Description: service.Description || '',
      EstimatedDurationMinus: service.EstimatedDurationMinus || 30,
      IsActive: service.IsActive
    });
    setShowServiceModal(true);
  };

  const closeServiceModal = () => {
    setShowServiceModal(false);
    setEditingService(null);
    setServiceEditForm({ Id: '', Name: '', Description: '', EstimatedDurationMinus: 30, IsActive: true });
    setServiceAddForm({ Name: '', Description: '', EstimatedDurationMinus: 30 });
  };

  useEffect(() => {
    fetchAllTickets();
    fetchRecentFeedbacks();
    fetchServices();
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
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-vietin-blue hover:bg-vietin-darkBlue text-white px-4 py-2 rounded-lg font-medium transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> Thêm dịch vụ
          </button>
        </div>

        {servicesLoading ? (
          <div className="text-center text-gray-400 py-8 animate-pulse">Đang tải dịch vụ...</div>
        ) : services.length === 0 ? (
          <div className="text-center text-gray-400 py-8 bg-white rounded-2xl border border-gray-200">
            Chưa có dịch vụ nào. Hãy thêm dịch vụ đầu tiên!
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                  <th className="p-4 font-bold">STT</th>
                  <th className="p-4 font-bold">Tên dịch vụ</th>
                  <th className="p-4 font-bold">Mô tả</th>
                  <th className="p-4 font-bold">Ước lượng</th>
                  <th className="p-4 font-bold">Trạng thái</th>
                  <th className="p-4 font-bold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {services.map((service, index) => (
                  <tr key={service.Id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-400 text-sm">#{index + 1}</td>
                    <td className="p-4 font-bold text-gray-800">{service.Name}</td>
                    <td className="p-4 text-gray-600 text-sm max-w-xs truncate">
                      {service.Description || '—'}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {service.EstimatedDurationMinus} phút
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        service.IsActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {service.IsActive ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(service)}
                        className="text-vietin-blue hover:text-vietin-darkBlue p-2 bg-blue-50 rounded-lg transition-colors"
                        title="Sửa dịch vụ"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteService(service.Id, service.Name)}
                        className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded-lg transition-colors"
                        title="Xóa dịch vụ"
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
      </section>

      {/* Service Modal - Create/Edit */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-vietin-blue p-5 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {editingService ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}
              </h3>
              <button 
                onClick={closeServiceModal}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Tên dịch vụ */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên dịch vụ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingService ? serviceEditForm.Name : serviceAddForm.Name}
                  onChange={(e) => {
                    if (editingService) {
                      setServiceEditForm({ ...serviceEditForm, Name: e.target.value });
                    } else {
                      setServiceAddForm({ ...serviceAddForm, Name: e.target.value });
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vietin-blue focus:border-transparent"
                  placeholder="VD: Cắt tóc nam"
                />
              </div>
              
              {/* Mô tả */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={editingService ? serviceEditForm.Description : serviceAddForm.Description}
                  onChange={(e) => {
                    if (editingService) {
                      setServiceEditForm({ ...serviceEditForm, Description: e.target.value });
                    } else {
                      setServiceAddForm({ ...serviceAddForm, Description: e.target.value });
                    }
                  }}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vietin-blue focus:border-transparent resize-none"
                  placeholder="Mô tả chi tiết về dịch vụ..."
                />
              </div>

              {/* Thời gian dự kiến */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thời gian dự kiến <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={editingService ? serviceEditForm.EstimatedDurationMinus : serviceAddForm.EstimatedDurationMinus}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      if (editingService) {
                        setServiceEditForm({ ...serviceEditForm, EstimatedDurationMinus: value });
                      } else {
                        setServiceAddForm({ ...serviceAddForm, EstimatedDurationMinus: value });
                      }
                    }}
                    className="w-full px-4 py-2 pr-16 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vietin-blue focus:border-transparent"
                    placeholder="30"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    phút
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => {
                        if (editingService) {
                          setServiceEditForm({ ...serviceEditForm, EstimatedDurationMinus: mins });
                        } else {
                          setServiceAddForm({ ...serviceAddForm, EstimatedDurationMinus: mins });
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        (editingService ? serviceEditForm.EstimatedDurationMinus : serviceAddForm.EstimatedDurationMinus) === mins
                          ? 'bg-vietin-blue text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {mins} phút
                    </button>
                  ))}
                </div>
              </div>

              {/* Trạng thái - Chỉ hiển thị khi edit */}
              {editingService && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={serviceEditForm.IsActive === true}
                        onChange={() => setServiceEditForm({ ...serviceEditForm, IsActive: true })}
                        className="w-4 h-4 text-vietin-blue focus:ring-vietin-blue"
                      />
                      <span className="text-sm text-gray-700">Hoạt động</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={serviceEditForm.IsActive === false}
                        onChange={() => setServiceEditForm({ ...serviceEditForm, IsActive: false })}
                        className="w-4 h-4 text-vietin-blue focus:ring-vietin-blue"
                      />
                      <span className="text-sm text-gray-700">Khóa</span>
                    </label>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={closeServiceModal}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={editingService ? handleUpdateService : handleCreateService}
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-vietin-blue hover:bg-vietin-darkBlue text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    editingService ? 'Cập nhật' : 'Thêm mới'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Feedbacks */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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