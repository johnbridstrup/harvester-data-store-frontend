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
