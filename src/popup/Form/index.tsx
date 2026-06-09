import { useParserConfig } from '../../hooks/useStorage'
import FormInner from "./FormInner";

interface FormProps {
  className?: string;
}

const Form = ({ className }: FormProps) => {
  const {value, setStorageValue, isLoaded} = useParserConfig();

  if (!isLoaded) return null;

  return <FormInner className={className} savedConfig={value} saveConfig={setStorageValue} />;
}

export default Form;