import browser from "webextension-polyfill";
import Button from "../Button";
import { useParsingState } from "../hooks/useStorage";
import { t } from "../i18n";
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
      <Button title={t("actions.checkState")} className="actions__button--state" onClick={() => {
        void sendRuntimeMessage("Check_state");
      }} />
      <Button title={t("actions.parse")} className="actions__button--main" onClick={() => {
        void sendRuntimeMessage("Parse");
      }} />
      {isStepMode ? (
        <div className="actions__button-wrapper">
          <Button title={t("actions.next")} onClick={() => {
            void sendRuntimeMessage("Next_step");
          }} />
          <Button title={t("actions.stop")} className="actions__button--stop" onClick={() => {
            void sendRuntimeMessage("Stop");
          }} />
        </div>
      ) : (
        <Button title={t("actions.parseBySteps")} onClick={() => {
          void sendRuntimeMessage("Parse_by_steps");
        }} />
      )}
    </div>
  )
}

export default ActionButtons;