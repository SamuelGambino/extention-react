import { Controller, useFormContext } from "react-hook-form";
import InputField from "../../InputField";
import "../index.css";

const ClicksSection = () => {
  const { control, watch } = useFormContext();

  const clicks = watch('data.settings.clicks');

  return (
    <div className="form__section">
      <span className="form__section-title">Clicks</span>

      {clicks !== 'none' && (clicks === 'products' || clicks === 'all') && (
        <div className="form__section-content">
          <div className='form__field'>
            <div className='form__field-title'>
              <label className='form__field-label'>Open product</label>
            </div>
            <Controller
              name="data.selectors.clicks.product.open"
              control={control}
              render={({ field }) => (
                <InputField placeholder='a.product-link' value={field.value} onChange={field.onChange} />
              )} />
          </div>

          <div className='form__field'>
            <div className='form__field-title'>
              <label className='form__field-label'>Exit from product</label>
            </div>
            <Controller
              name="data.selectors.clicks.product.exit"
              control={control}
              render={({ field }) => (
                <InputField placeholder='button.product-exit' value={field.value} onChange={field.onChange} />
              )} />
          </div>
        </div>
      )}

      {clicks !== 'none' && (clicks === 'category' || clicks === 'all') && (
        <div className="form__section-content">
          <div className='form__field'>
            <div className='form__field-title'>
              <label className='form__field-label'>Open category</label>
            </div>
            <Controller
              name="data.selectors.clicks.category.exit"
              control={control}
              render={({ field }) => (
                <InputField placeholder='a.category-link' value={field.value} onChange={field.onChange} />
              )} />
          </div>

          <div className='form__field'>
            <div className='form__field-title'>
              <label className='form__field-label'>Exit from category</label>
            </div>
            <Controller
              name="data.selectors.clicks.category.exit"
              control={control}
              render={({ field }) => (
                <InputField placeholder='button.category-exit' value={field.value} onChange={field.onChange} />
              )} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ClicksSection;