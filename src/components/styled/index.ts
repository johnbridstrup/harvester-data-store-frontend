import styled from "styled-components";

export const LoaderDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25vh;
`;

export const RouteLoader = styled(LoaderDiv)`
  height: 100vh;
`;

export const InputFormControl = styled.input<{ theme: string | null }>`
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: ${(props) => (props.theme === "dark" ? "#fff" : "#212529")};
  background-color: ${(props) => (props.theme === "dark" ? "#212529" : "#fff")};
  background-clip: padding-box;
  border: 1px solid #ced4da;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0.375rem;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const SpanLimit = styled.span`
  margin-left: 2rem;
  margin-right: 1rem;
  color: #6c757d;
`;

export const InputLimit = styled.input`
  width: 25%;
  padding: 0.375rem 0.75rem;
  color: #6c757d;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
`;

export const PageItem = styled.li`
  display: flex;
  align-items: center;
`;

export const Container = styled.div`
  margin-top: 3rem;
  margin-bottom: 1rem;
`;

export const ClipboardDiv = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
`;

export const DivTotalReport = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  & span {
    font-size: 1.6rem;
    margin-right: 0.5rem;
  }
`;

export const SpanTarget = styled.span`
  border: none;
  background: inherit;
  padding: 1px;
  margin: -1px;
  font-size: inherit;
  color: inherit;
  cursor: inherit;
  display: flex;
`;

export const Table = styled.table``;

export const Td = styled.td`
  position: relative;
`;

export const NavTabs = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding-left: 0;
  margin-top: 0;
  margin-bottom: 0;
  list-style: none;
  border-bottom: 1px solid #dee2e6;
`;

export const NavTabItem = styled.li`
  margin-bottom: -1px;
`;

export const NavTabSpan = styled.span<{
  theme: string;
  activetab: string;
  navto: string;
  robocolor: string;
}>`
  border: 1px solid transparent;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  display: block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  cursor: pointer;

  color: ${(props) =>
    props.theme === "dark"
      ? "#fff"
      : props.activetab === props.navto
      ? "#495057"
      : "rgba(0,0,0,.5)"};
  background-color: ${(props) =>
    props.activetab === props.navto && props.theme === "dark"
      ? "#343434"
      : props.activetab === props.navto
      ? props.activetab === props.robocolor
        ? "#FF7276"
        : "#fff"
      : ""};
  border-color: ${(props) =>
    props.activetab === props.navto ? "#dee2e6 #dee2e6 #fff" : ""};

  &:hover {
    color: #495057;
    background-color: #fff;
    border-color: #dee2e6 #dee2e6 #fff;
  }
`;

export const NavMainTabSpan = styled(NavTabSpan)<{ errored: string }>`
  color: ${(props) =>
    props.theme === "dark"
      ? "#fff"
      : props.activetab === props.navto
      ? "#495057"
      : "rgba(0,0,0,.5)"};
  background-color: ${(props) =>
    props.errored === "true"
      ? "#FF7276"
      : props.theme === "dark"
      ? "#343434"
      : ""};
  border-color: ${(props) =>
    props.activetab === props.navto ? "#dee2e6 #dee2e6 #fff" : ""};

  &:hover {
    color: #495057;
    background-color: #fff;
    border-color: #dee2e6 #dee2e6 #fff;
  }
`;

export const TabContent = styled.div`
  display: flex;
  flex-direction: column;
`;
