import { useParserConfig } from "../../hooks/useStorage";
import Form from "../Form";
import Tabs from "../Tabs";
import "./index.css";

const MainContent = () => {
  const {value, setStorageValue, isLoaded} = useParserConfig();

  if (!isLoaded) return null;

  return (
    <div className="main-content">
      <Tabs data={value} onChange={(tabId) => {setStorageValue(value.actualTab = tabId)}} />
      <Form />
    </div>
  )
}

export default MainContent;