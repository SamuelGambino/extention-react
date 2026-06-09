import { Controller, useFormContext } from "react-hook-form";
import InputField from "../../InputField";
import "../index.css";

const PaginationSection = () => {
  const { control } = useFormContext();

  return (
    <div className="form__section">
      <span className="form__section-title">Pagination</span>

      <div className="form__section-content">
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Pages container</label>
          </div>
          <Controller
            name="data.selectors.pagination.container"
            control={control}
            render={({ field }) => (
              <InputField placeholder='div.pagination' value={field.value} onChange={field.onChange} />
            )} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Next page</label>
          </div>
          <Controller
            name="data.selectors.pagination.click"
            control={control}
            render={({ field }) => (
              <InputField placeholder='button.pagination-next' value={field.value} onChange={field.onChange} />
            )} />
        </div>
      </div>
    </div>
  )
}

export default PaginationSection;