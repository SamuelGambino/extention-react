import { useParserConfig } from '../../hooks/useStorage'
import FormInner from "./FormInner";

interface FormProps {
  className?: string;
}

const Form = ({ className }: FormProps) => {
  const [savedConfig, saveConfig, isConfigLoaded] = useParserConfig();

  if (!isConfigLoaded) return null;

  return <FormInner className={className} savedConfig={savedConfig} saveConfig={saveConfig} />;
}

export default Form;