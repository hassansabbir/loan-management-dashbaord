import { useState } from "react";
import {
  LuPlus,
  LuSearch,
  LuPencil,
  LuTrash2,
  LuChevronDown,
  LuHelpCircle,
  LuAlertTriangle,
} from "react-icons/lu";
import { Modal } from "antd";
import toast from "react-hot-toast";
import {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  FaqItem,
} from "@/redux/apiSlices/faqSlice";

const Faqs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // Delete Confirmation State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // RTK Query Hooks
  const { data: apiResponse, isLoading } = useGetFaqsQuery();
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();

  const faqs = apiResponse?.data || [];

  // Filtered FAQs by search term
  const filteredFaqs = faqs.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingFaq(null);
    setQuestion("");
    setAnswer("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq: FaqItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }
    if (!answer.trim()) {
      toast.error("Please enter an answer");
      return;
    }

    try {
      if (editingFaq) {
        // Update FAQ
        const res = await updateFaq({
          id: editingFaq._id,
          question: question.trim(),
          answer: answer.trim(),
        }).unwrap();

        toast.success(res.message || "FAQ updated successfully");
      } else {
        // Create FAQ
        const res = await createFaq({
          question: question.trim(),
          answer: answer.trim(),
        }).unwrap();

        toast.success(res.message || "FAQ created successfully");
      }

      setIsModalOpen(false);
      setEditingFaq(null);
      setQuestion("");
      setAnswer("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      const res = await deleteFaq(deletingId).unwrap();
      toast.success(res.message || "FAQ deleted successfully");
      setIsDeleteModalOpen(false);
      setDeletingId(null);
      if (expandedId === deletingId) {
        setExpandedId(null);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete FAQ");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage platform-wide questions and answers for borrowers and merchants.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B64F2] hover:bg-[#1451C9] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <LuPlus size={16} />
          <span>Add FAQ</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <LuSearch
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          size={17}
        />
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-10 pl-10 pr-4 bg-[#F8FAFC] border border-gray-200/80 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1B64F2] focus:bg-white transition-all shadow-2xs"
        />
      </div>

      {/* FAQs List Accordion / Cards */}
      <div className="space-y-3">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse space-y-2"
            >
              <div className="h-5 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-100 rounded w-full" />
            </div>
          ))
        ) : filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1B64F2] flex items-center justify-center mx-auto">
              <LuHelpCircle size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              No FAQs Found
            </h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {searchTerm
                ? "No questions matched your search query. Try typing something else."
                : "No FAQs have been added yet. Click 'Add FAQ' above to publish the first answer."}
            </p>
            {!searchTerm && (
              <button
                type="button"
                onClick={handleOpenCreate}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B64F2] text-white text-xs font-semibold hover:bg-[#1451C9] transition-colors cursor-pointer"
              >
                <LuPlus size={15} /> Add First FAQ
              </button>
            )}
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq._id;

            return (
              <div
                key={faq._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden transition-all hover:border-gray-200"
              >
                {/* FAQ Header Row */}
                <div
                  onClick={() => toggleExpand(faq._id)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1B64F2] flex items-center justify-center font-bold text-xs flex-shrink-0">
                      Q
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  {/* Actions & Expand Chevron */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenEdit(faq, e)}
                      className="w-8 h-8 rounded-lg text-gray-500 hover:text-[#1B64F2] hover:bg-blue-50 flex items-center justify-center transition-colors cursor-pointer"
                      title="Edit FAQ"
                    >
                      <LuPencil size={15} />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenDelete(faq._id, e)}
                      className="w-8 h-8 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete FAQ"
                    >
                      <LuTrash2 size={15} />
                    </button>

                    {/* Expand Toggle */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-gray-700" : ""
                      }`}
                    >
                      <LuChevronDown size={18} />
                    </div>
                  </div>
                </div>

                {/* FAQ Expanded Answer */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-gray-50 text-gray-600 text-xs sm:text-sm leading-relaxed bg-[#FAFBFD]">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        A
                      </div>
                      <p className="whitespace-pre-line flex-1 pt-1">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* ADD / EDIT FAQ MODAL                                                      */}
      {/* ========================================================================= */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={560}
        centered
        title={
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1B64F2] flex items-center justify-center">
              {editingFaq ? <LuPencil size={16} /> : <LuPlus size={16} />}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 leading-tight">
                {editingFaq ? "Edit FAQ" : "Add New FAQ"}
              </h3>
              <p className="text-xs text-gray-400 font-normal mt-0.5">
                {editingFaq
                  ? "Update the question and answer text below."
                  : "Fill in the details to publish a new FAQ."}
              </p>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSave} className="space-y-4 pt-3 text-sm">
          {/* Question Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Question
            </label>
            <input
              type="text"
              placeholder="e.g. How does Revenue-Based Financing work?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full h-11 px-4 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1B64F2] focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {/* Answer Textarea */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Answer
            </label>
            <textarea
              rows={4}
              placeholder="e.g. Revenue-Based Financing provides capital in exchange for..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-4 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1B64F2] focus:bg-white transition-all shadow-2xs resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-6 py-2 rounded-xl bg-[#1B64F2] hover:bg-[#1451C9] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isCreating || isUpdating
                ? "Saving..."
                : editingFaq
                ? "Update FAQ"
                : "Create FAQ"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL                                                 */}
      {/* ========================================================================= */}
      <Modal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={null}
        width={420}
        centered
      >
        <div className="text-center p-2 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <LuAlertTriangle size={24} />
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900">
              Delete this FAQ?
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Are you sure you want to permanently delete this FAQ item? This action cannot be undone.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Faqs;
