import { Button } from "antd";
import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="text-red-400 text-4xl text-center my-44">
      <p>You are not Authorized</p>
      <p>Please login first!!!</p>
      <Link to={"/auth/login"}>
        <Button className="bg-[#FFD900]">Login Now</Button>
      </Link>
    </div>
  );
}

export default ErrorPage;