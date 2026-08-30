import { useState, useRef } from "react";
import JoditEditor from "jodit-react";
import toast from "react-hot-toast";
import logo from "../../../assets/logo.png";

interface PrivacyPolicyData {
  content?: string;
}

const AboutUs = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [selectedTab] = useState("about");

  const isLoading = false;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <img src={logo} alt="Loading" />
      </div>
    );
  }

  const privacyPolicy: PrivacyPolicyData[] = [];
  const privacyPolicyData = privacyPolicy?.[0]?.content || "";

  const termsDataSave = async () => {
    const data = {
      content: content,
      userType: selectedTab,
    };

    try {
      // Simulate API call - replace with actual implementation when API is ready
      console.log("Saving data:", data);
      toast.success("About Us updated successfully");
      setContent(data.content);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Update failed. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-semibold">About Us</h1>

      <JoditEditor
        ref={editor}
        value={privacyPolicyData}
        onChange={(newContent) => {
          setContent(newContent);
        }}
      />

      <div className="flex items-center justify-center mt-5">
        <button
          onClick={termsDataSave}
          type="submit"
          className="bg-primary text-white w-[160px] h-[42px] rounded-lg"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AboutUs;
