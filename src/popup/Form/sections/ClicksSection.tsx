import InputField from "../../InputField";
import "../index.css";

interface IClicksSection {
  clicks: 'none' | 'products' | 'category' | 'all'
}

const ClicksSection = ({ clicks }: IClicksSection) => {

  return (
    <div className="form__section">
      <span className="form__section-title">Clicks</span>

      {clicks !== 'none' && (clicks === 'products' || clicks === 'all') && (
        <div className="form__section-content">
          <div className='form__field'>
            <div className='form__field-title'>
              <label className='form__field-label'>Open product</label>
            </div>
            <InputField placeholder='a.product-link' onChange={() => { }} />
          </div>

          <div className='form__field'>
            <div className='form__field-title'>
              <label className='form__field-label'>Exit from product</label>
            </div>
            <InputField placeholder='button.product-exit' onChange={() => { }} />
          </div>
        </div>
      )}

      {clicks !== 'none' && (clicks === 'category' || clicks === 'all') && (
        <div className="form__section-content">
          <div className='form__field'>
            <div className='form__field-title'>
              <label className='form__field-label'>Open category</label>
            </div>
            <InputField placeholder='a.category-link' onChange={() => { }} />
          </div>

          <div className='form__field'>
            <div className='form__field-title'>
              <label className='form__field-label'>Exit from category</label>
            </div>
            <InputField placeholder='button.category-exit' onChange={() => { }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ClicksSection;