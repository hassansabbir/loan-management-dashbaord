import { Form, Input, Modal } from "antd";
import { useEffect } from "react";

interface FaqData {
  key: string;
  question: string;
  answer: string;
}

interface FaqModalProps {
  setModalData: (data: FaqData | null) => void;
  modalData: FaqData | null;
  openAddModel: boolean;
  setOpenAddModel: (open: boolean) => void;
}

interface FormValues {
  question: string;
  answer: string;
}

const FaqModal = ({
  setModalData,
  modalData,
  openAddModel,
  setOpenAddModel,
}: FaqModalProps) => {
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (modalData) {
      form.setFieldsValue({
        question: modalData?.question,
        answer: modalData?.answer,
      });
    }
  }, [modalData, form]);

  const onFinish = (values: FormValues) => {
    console.log(values);
  };

  return (
    <Modal
      centered
      open={openAddModel}
      onCancel={() => {
        setOpenAddModel(false);
        setModalData(null);
        form.resetFields();
      }}
      width={500}
      footer={null}
    >
      <div className="p-6">
        <h1 className="font-semibold text-[#555555] text-xl mb-4">
          {modalData ? "Edit FAQ" : "Add FAQ"}
        </h1>
        
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Question"
            name="question"
            rules={[{ required: true, message: "Please enter the question" }]}
          >
            <Input 
              placeholder="Enter FAQ question"
              style={{
                border: "1px solid #d9d9d9",
                padding: "8px 12px",
                borderRadius: "6px",
                outline: "none",
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item
            label="Answer"
            name="answer"
            rules={[{ required: true, message: "Please enter the answer" }]}
          >
            <Input.TextArea
              placeholder="Enter FAQ answer"
              rows={4}
              style={{
                border: "1px solid #d9d9d9",
                padding: "8px 12px",
                borderRadius: "6px",
                outline: "none",
                width: "100%",
                resize: "vertical" as const,
              }}
            />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setOpenAddModel(false);
                setModalData(null);
                form.resetFields();
              }}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {modalData ? "Update" : "Add"} FAQ
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default FaqModal;
