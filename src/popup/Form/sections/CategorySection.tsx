import { Controller, useFormContext } from 'react-hook-form';
import InputField from "../../InputField";
import "../index.css";

const CategorySection = () => {
  const { control } = useFormContext();
  
  return (
    <div className="form__section">
      <span className="form__section-title">Category</span>

      <div className="form__section-content">
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Container</label>
          </div>
          <Controller
            name="data.selectors.category.container"
            control={control}
            render={({ field }) => (
              <InputField placeholder='nav.categories-item' value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Name</label>
          </div>
          <Controller
            name="data.selectors.category.name"
            control={control}
            render={({ field }) => (
              <InputField placeholder='a .categories-title' value={field.value} onChange={field.onChange} />
            )} />
        </div>
      </div>
    </div>
  )
}

export default CategorySection;