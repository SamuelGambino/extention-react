import InputField from "../../InputField";
import "../index.css";

const ParametersSection = () => {

  return (
    <div className="form__section">
      <span className="form__section-title">Parameters</span>

      <div className="form__section-content">
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Parameter container</label>
          </div>
          <InputField placeholder='div.parameters' onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Parameter description</label>
          </div>
          <InputField placeholder='p.parameter-description' onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Parameter click</label>
          </div>
          <InputField placeholder='button.parameter-click' onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Parameter price</label>
          </div>
          <InputField placeholder='span.parameter-price' onChange={() => { }} />
        </div>
      </div>
    </div>
  )
}

export default ParametersSection;