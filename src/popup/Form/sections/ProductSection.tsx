import { Controller, useFormContext } from "react-hook-form";
import InputField from "../../InputField";
import "../index.css";

const ProductSection = () => {
  const { control } = useFormContext();

  return (
    <div className="form__section">
      <span className="form__section-title">Product</span>

      <div className="form__section-content">
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Container</label>
          </div>
          <Controller
            name="data.selectors.product.container"
            control={control}
            render={({ field }) => (
              <InputField placeholder='div.product-container' value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Picture</label>
          </div>
          <Controller
            name="data.selectors.product.picture"
            control={control}
            render={({ field }) => (
              <InputField placeholder='div.product-picture' value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Name</label>
          </div>
          <Controller
            name="data.selectors.product.name"
            control={control}
            render={({ field }) => (
              <InputField placeholder='h1.product-name' value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Description</label>
          </div>
          <Controller
            name="data.selectors.product.description"
            control={control}
            render={({ field }) => (
              <InputField placeholder='p.product-description' value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Weight</label>
          </div>
          <Controller
            name="data.selectors.product.weight"
            control={control}
            render={({ field }) => (
              <InputField placeholder='span.product-weight' value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Price</label>
          </div>
          <Controller
            name="data.selectors.product.price"
            control={control}
            render={({ field }) => (
              <InputField placeholder='span.product-price' value={field.value} onChange={field.onChange} />
            )} />
        </div>
      </div>
    </div>
  )
}

export default ProductSection;