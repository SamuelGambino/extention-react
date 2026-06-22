import browser from "webextension-polyfill";
import Button from "../Button";
import { useParsingState } from "../hooks/useStorage";
import "./index.css"

const sendRuntimeMessage = async (action: 'Check_state' | 'Parse' | 'Parse_by_steps' | 'Next_step' | 'Stop') => {
  try {
    await browser.runtime.sendMessage({ action });
  } catch (error) {
    console.error(`Failed to send ${action} message to background worker:`, error);
  }
};

const ActionButtons = () => {
  const [parsingState] = useParsingState();

  const isStepMode = parsingState.parsing.isRunning && parsingState.parsing.waitingForStep === true;

  return (
    <div className="actions">
      <Button title="Check state" className="actions__button--state" onClick={() => {
        void sendRuntimeMessage("Check_state");
      }} />
      <Button title="Parse" className="actions__button--main" onClick={() => {
        void sendRuntimeMessage("Parse");
      }} />
      {isStepMode ? (
        <div className="actions__button-wrapper">
          <Button title="Next" onClick={() => {
            void sendRuntimeMessage("Next_step");
          }} />
          <Button title="Stop" className="actions__button--main" onClick={() => {
            void sendRuntimeMessage("Stop");
          }} />
        </div>
      ) : (
        <Button title="Parse by steps" onClick={() => {
          void sendRuntimeMessage("Parse_by_steps");
        }} />
      )}
    </div>
  )
}

export default ActionButtons;