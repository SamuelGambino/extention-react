import InputField from "../../InputField";
import "../index.css";

const CategorySection = () => {
  return (
    <div className="form__section">
      <span className="form__section-title">Category</span>

      <div className="form__section-content">
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Container</label>
          </div>
          <InputField placeholder='nav.categories-item' onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Name</label>
          </div>
          <InputField placeholder='a .categories-title' onChange={() => { }} />
        </div>
      </div>
    </div>
  )
}

export default CategorySection;