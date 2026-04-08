import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../contexts/AuthContext";

/* ===================== FEEDBACK FORM ===================== */
const FeedbackForm = ({ ticketId }: { ticketId: string }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);

      await apiClient.post("/feedbacks", {
        queueTicketId: ticketId,
        rating,
        comment
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Gửi đánh giá thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-6 text-green-600 font-semibold">
        ✅ Cảm ơn bạn đã đánh giá!
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white p-4 rounded-xl shadow border">
      <h3 className="font-bold mb-3 text-gray-700">Đánh giá dịch vụ</h3>

      {/* Rating */}
      <div className="mb-3">
        <label className="text-sm text-gray-500">Số sao (1-5)</label>
        <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full border p-2 rounded mt-1"
        />
      </div>

      {/* Comment */}
      <textarea
        className="border p-2 w-full rounded"
        placeholder="Nhận xét của bạn..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        onClick={submit}
        disabled={loading}
        className="mt-3 bg-vietin-blue hover:bg-vietin-darkBlue text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? "Đang gửi..." : "Gửi đánh giá"}
      </button>
    </div>
  );
};

/* ===================== MAIN PAGE ===================== */
const TicketTrackPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchTicket = async () => {
    try {
      const res = await apiClient.get(`/tickets/${id}`);
      setTicket(res.data);
    } catch (err) {
      console.error("Fetch ticket failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();

    const interval = setInterval(fetchTicket, 5000); // polling 5s
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Không tìm thấy thông tin vé
      </div>
    );
  }

  const getStatusText = () => {
    switch (ticket.status) {
      case 1: return "⏳ Đang chờ";
      case 2: return "🔄 Đang phục vụ";
      case 3: return "✅ Đã hoàn thành";
      case 4: return "❌ Đã bỏ qua";
      default: return "Không xác định";
    }
  };

  const getStatusColor = () => {
    switch (ticket.status) {
      case 1: return "text-yellow-500";
      case 2: return "text-blue-500";
      case 3: return "text-green-600";
      case 4: return "text-red-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 text-center bg-white rounded-2xl shadow border">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Theo dõi số thứ tự
      </h2>

      {/* Ticket Number */}
      <h1 className="text-7xl font-black text-vietin-blue mb-4">
        {ticket.ticketNumber}
      </h1>

      {/* Info */}
      <p className="text-lg font-semibold text-gray-700">
        {ticket.customerName}
      </p>

      <p className="text-gray-500 mb-4">
        {ticket.serviceName}
      </p>

      {/* Status */}
      <div className={`text-xl font-bold ${getStatusColor()}`}>
        {getStatusText()}
      </div>

      {/* Feedback */}
      {ticket.status === 3 && (
        <FeedbackForm ticketId={ticket.id} />
      )}
    </div>
  );
};

export default TicketTrackPage;