import {
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import {
  Button,
  Modal,
  Input,
  Form,
  Card,
  Tag,
  message,
  Empty,
  Upload,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useState } from "react";

const { Dragger } = Upload;

interface Video {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
}

const initialVideos: Video[] = [
  {
    id: "1",
    title: "Welcome Introduction",
    url: "https://www.w3schools.com/html/mov_bbb.mp4", // Demo video
    isActive: true,
  },
];

const AppVideos = () => {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  const handleAddVideo = (values: { title: string }) => {
    if (fileList.length === 0) {
      message.error("Please upload a video file");
      return;
    }

    const file = fileList[0].originFileObj as File;
    const videoUrl = URL.createObjectURL(file);

    const newVideo: Video = {
      id: Date.now().toString(),
      title: values.title,
      url: videoUrl,
      isActive: videos.length === 0,
    };

    setVideos([...videos, newVideo]);
    setIsModalVisible(false);
    form.resetFields();
    setFileList([]);
    message.success("Video added successfully");
  };

  const handleDeleteVideo = (id: string, isActive: boolean) => {
    if (isActive) {
      message.error(
        "Cannot delete the active video. Please set another video as active first."
      );
      return;
    }

    Modal.confirm({
      title: "Delete Video",
      content: "Are you sure you want to delete this video?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        setVideos(videos.filter((video) => video.id !== id));
        message.success("Video deleted successfully");
      },
    });
  };

  const handleSetActive = (id: string) => {
    const updatedVideos = videos.map((video) => ({
      ...video,
      isActive: video.id === id,
    }));
    setVideos(updatedVideos);
    message.success("Active video updated");
  };

  const uploadProps = {
    onRemove: (file: UploadFile) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file: File) => {
      const isVideo = file.type.startsWith("video/");
      if (!isVideo) {
        message.error(`${file.name} is not a video file`);
        return Upload.LIST_IGNORE;
      }
      setFileList([file as unknown as UploadFile]);
      return false; // Prevent auto upload
    },
    fileList,
    maxCount: 1,
  };

  return (
    <div className="p-6 bg-[#2F5E81] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-normal text-white">App Videos</h1>
          <p className="text-gray-300 text-sm mt-1">
            Manage videos shown in the mobile application.
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          className="bg-[#1e405a] border-[#1e405a] hover:!bg-[#173247]"
        >
          Add Video
        </Button>
      </div>

      {videos.length === 0 ? (
        <div className="flex justify-center items-center h-64 bg-white/5 rounded-lg border border-white/10">
          <Empty
            description={<span className="text-gray-300">No videos found</span>}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card
              key={video.id}
              className="bg-white/5 border-white/10 hover:border-white/20 transition-all overflow-hidden"
              bodyStyle={{ padding: 0 }}
            >
              <div className="relative aspect-video bg-black">
                <video
                  src={video.url}
                  controls
                  className="w-full h-full object-contain"
                />
                {video.isActive && (
                  <div className="absolute top-2 right-2">
                    <Tag
                      color="#22c55e"
                      className="flex items-center gap-1 m-0 px-3 py-1 border-0 shadow-lg"
                    >
                      <CheckCircleOutlined /> Active
                    </Tag>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3
                  className="text-lg font-medium text-white mb-4 truncate"
                  title={video.title}
                >
                  {video.title}
                </h3>

                <div className="flex gap-3">
                  {!video.isActive && (
                    <Button
                      type="default"
                      className="flex-1 bg-transparent border-white/30 text-white hover:!border-white hover:!text-white"
                      onClick={() => handleSetActive(video.id)}
                    >
                      Set Active
                    </Button>
                  )}

                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    className={video.isActive ? "hidden" : "ml-auto"}
                    onClick={() => handleDeleteVideo(video.id, video.isActive)}
                  />

                  {video.isActive && (
                    <span className="flex-1 text-center py-1 text-xs text-[#22c55e] font-medium bg-[#22c55e]/10 rounded border border-[#22c55e]/20">
                      Currently Displayed
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title="Upload New Video"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setFileList([]);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddVideo}
          className="mt-4"
        >
          <Form.Item
            name="title"
            label="Video Title"
            rules={[{ required: true, message: "Please enter a video title" }]}
          >
            <Input placeholder="e.g. promotional video 2024" />
          </Form.Item>

          <Form.Item label="Video File" required>
            <Dragger {...uploadProps} className="bg-gray-50">
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for MP4, WebM video files.
              </p>
            </Dragger>
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              onClick={() => {
                setIsModalVisible(false);
                setFileList([]);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-[#1e405a]"
              disabled={fileList.length === 0}
            >
              Upload & Add
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AppVideos;
