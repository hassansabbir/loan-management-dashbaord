import { useState } from "react";
import { Button, Input } from "antd";
import { BiLeftArrowAlt } from "react-icons/bi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Link } from "react-router-dom";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

const PersonalInfo = () => {
  const [phone, setPhone] = useState("");
  const [imgURL, setImgURL] = useState(
    "https://avatars.design/wp-content/uploads/2021/02/corporate-avatars-TN-1.jpg"
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setImgURL(imgUrl);
    }
  };

  return (
    <div>
      <Link to="/" className="flex items-center gap-[2px] text-base rounded-lg">
        <span>
          <BiLeftArrowAlt size={22} />
        </span>
        <span>Back</span>
      </Link>
      <div className="flex gap-10 w-full">
        <div className="w-8/12">
          <div className="mt-4">
            <h1>Name</h1>
            <br />
            <Input
              className="py-4 bg-gray-100 rounded-xl"
              defaultValue={"John Doe"}
            />
          </div>
          <div className="mt-4">
            <h1>Email</h1>
            <br />
            <Input
              className="py-4 bg-gray-100 rounded-xl"
              defaultValue={"support@learnova.com"}
            />
          </div>
          <div className="mt-4">
            <h1>Phone</h1>
            <br />
            <PhoneInput
              country={"us"}
              value={phone}
              onChange={(phone) => setPhone(phone)} // Make sure this is updating the state
              inputStyle={{
                width: "60%",
                background: "#F3F4F6",
                padding: "12px",
                marginLeft: "40px",
              }}
            />
          </div>
          <Button
            htmlType="submit"
            block
            style={{
              width: 178,
              height: 48,
              fontWeight: "400px",
              background: "#FFD900",
              color: "black",
            }}
            className="roboto-medium mt-10 text-sm leading-4"
          >
            Save and Change
          </Button>
        </div>
        <div>
          <div className="flex justify-center">
            <input
              onChange={onChange}
              type="file"
              id="img"
              className="hidden"
            />
            <label
              htmlFor="img"
              className="relative w-48 h-48 cursor-pointer rounded-full border border-primary bg-white bg-cover bg-center"
              style={{ backgroundImage: `url(${imgURL})` }}
            >
              <div className="absolute bottom-1 right-1 w-12 h-12 rounded-full border-2 border-primary bg-gray-100 flex items-center justify-center">
                <MdOutlineAddPhotoAlternate
                  size={22}
                  className="text-primary"
                />
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
