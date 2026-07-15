import { useId } from "react";
import "./index.css";

interface Props {
  data: { label: string; value: string }[];
  className?: string;
  value: string;
  onChange: (value: string) => void;
  isAccent?: boolean;
  size?: "sm" | "md";
}

const RadioField: React.FC<Props> = ({
  data,
  className = "",
  value,
  onChange,
  isAccent = false,
  size = "md",
}) => {
  const groupId = useId();

  return (
    <div
      className={[
        "radio-field",
        isAccent ? "radio-field--accent" : "",
        size === "sm" ? "radio-field--sm" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="radiogroup"
    >
      {data.map((option) => {
        const id = `${groupId}-${option.value}`;
        const isActive = option.value === value;

        return (
          <label key={option.value} className="radio-field__label">
            <input
              type="radio"
              id={id}
              name={groupId}
              value={option.value}
              checked={isActive}
              onChange={() => onChange(option.value)}
              className="radio-field__input"
            />
            <span className={`radio-field__pill ${isActive ? "radio-field__pill--active" : ""}`}>
              {option.label}
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default RadioField;