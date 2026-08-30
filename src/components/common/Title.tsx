

import { ReactNode } from "react";

interface TitleProps {
  children: ReactNode;
  className?: string;
}

const Title = ({ children, className = "" }: TitleProps) => {
  return <p className={`${className} text-2xl font-medium`}>{children}</p>;
};

export default Title;
