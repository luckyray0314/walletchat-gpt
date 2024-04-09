import Main from "./components/Main/Main";
import Sidebar from "./components/Sidebar/Sidebar";
import ContextProvider from "./context/Context";

export default function Home() {
  return (
    <>
      <ContextProvider>
        <Sidebar />
        <Main />
      </ContextProvider>
    </>
  );
}
