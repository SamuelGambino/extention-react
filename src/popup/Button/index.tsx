import "./index.css";

interface ButtonProps {
  title: string;
  onClick?: () => void;
  className?: string;
}

const Button = ({ title, onClick, className }: ButtonProps) => {
  return (
    <button type="button" className={`button ${className || ''}`} onClick={onClick}>
      <div className="button__corner button__corner--tl"></div><div className="button__corner button__corner--br"></div>
      {title}
    </button>
  )
}

export default Button;