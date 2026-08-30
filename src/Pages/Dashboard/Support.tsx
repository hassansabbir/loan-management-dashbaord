import { Input, Form } from "antd";
import { LuHeadphones, LuMail, LuPhone, LuClock } from "react-icons/lu";
import toast from "react-hot-toast";

const Support = () => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    toast.success("Support ticket submitted. Our team will contact you shortly.");
    form.resetFields();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          System Support
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Reach our dedicated technical and customer success team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1B64F2] flex items-center justify-center">
            <LuMail size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">
              Email Support
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">
              support@loan.co.uk
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center">
            <LuPhone size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">
              Phone Line
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">
              +44 20 7946 0912
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center">
            <LuClock size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">
              Response Time
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">
              Under 2 hours
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <LuHeadphones className="text-[#1B64F2]" />
          Submit a Support Request
        </h2>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="subject"
              label={<span className="text-xs font-semibold text-gray-700 uppercase">Subject</span>}
              rules={[{ required: true, message: "Please enter subject" }]}
            >
              <Input placeholder="E.g. Borrower payout inquiry" className="h-11 rounded-lg" />
            </Form.Item>

            <Form.Item
              name="urgency"
              label={<span className="text-xs font-semibold text-gray-700 uppercase">Priority</span>}
              initialValue="Normal"
            >
              <Input placeholder="Normal" className="h-11 rounded-lg" />
            </Form.Item>
          </div>

          <Form.Item
            name="message"
            label={<span className="text-xs font-semibold text-gray-700 uppercase">Details</span>}
            rules={[{ required: true, message: "Please describe your issue" }]}
          >
            <Input.TextArea rows={5} placeholder="Describe the issue or assistance required..." className="rounded-lg" />
          </Form.Item>

          <button
            type="submit"
            className="bg-[#1B64F2] hover:bg-[#1451C9] text-white px-8 h-11 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
          >
            Submit Request
          </button>
        </Form>
      </div>
    </div>
  );
};

export default Support;
