
import { Button, DatePicker, Form, Input, Upload } from "antd";
import { BiUpload } from "react-icons/bi";
import { UploadChangeParam, UploadFile } from "antd/es/upload";

const { RangePicker } = DatePicker;

interface FormValues {
  title: string;
  description: string;
  dateRange: [Date, Date];
  upload: UploadFile[];
}

const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const CreateOffer = () => {
  const [form] = Form.useForm<FormValues>();

  const onFinish = (values: FormValues) => {
    // Simulate the image upload process
    const { upload, ...restValues } = values;
    console.log("Form Data:", restValues);

    if (upload && upload.length > 0) {
      // Simulating successful file upload
      console.log(`${upload[0].name} file uploaded successfully`);
    }
  };

  const props = {
    name: "file",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info: UploadChangeParam<UploadFile>) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        console.log(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        console.log(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div className="bg-white p-5 rounded-2xl">
      <h1 className="font-bold text-xl mb-5">Create Offer</h1>
      <Form
        {...formItemLayout}
        form={form}
        name="create-offer"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        scrollToFirstError
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: "Please input the title!",
            },
          ]}
        >
          <Input placeholder="Enter offer title" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              required: true,
              message: "Please input the description!",
            },
          ]}
        >
          <Input.TextArea
            placeholder="Enter offer description"
            rows={4}
          />
        </Form.Item>

        <Form.Item
          name="dateRange"
          label="Date Range"
          rules={[
            {
              required: true,
              message: "Please select the date range!",
            },
          ]}
        >
          <RangePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="upload"
          label="Upload Image"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
        >
          <Upload {...props} listType="picture">
            <Button icon={<BiUpload />}>Click to upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Create Offer
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateOffer;
