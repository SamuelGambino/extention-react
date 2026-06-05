import InputField from "../../InputField";
import "../index.css";

const ProductSection = () => {
  return (
    <div className="form__section">
      <span className="form__section-title">Product</span>

      <div className="form__section-content">
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Container</label>
          </div>
          <InputField placeholder='div.product-container' onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Picture</label>
          </div>
          <InputField placeholder='img.product-picture' onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Name</label>
          </div>
          <InputField placeholder='h1.product-name' onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Description</label>
          </div>
          <InputField placeholder='p.product-description' onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Weight</label>
          </div>
          <InputField placeholder='span.product-weight' onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Price</label>
          </div>
          <InputField placeholder='span.product-price' onChange={() => { }} />
        </div>
      </div>
    </div>
  )
}

export default ProductSection;