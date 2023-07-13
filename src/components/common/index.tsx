import { Oval } from "react-loader-spinner";

interface LoaderProps {
  size: number;
}

interface HeaderProps {
  className: string;
  title: string;
  id?: string;
}

export const Loader = ({ size }: LoaderProps) => {
  return <Oval color="#00BFFF" height={size} width={size} />;
};

export const Header = (props: HeaderProps) => {
  return (
    <div className={props.className}>
      {props.title} {props.id}
    </div>
  );
};
