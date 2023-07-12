import { Oval } from "react-loader-spinner";

interface LoaderProps {
  size: number;
}

export const Loader = ({ size }: LoaderProps) => {
  return <Oval color="#00BFFF" height={size} width={size} />;
};
