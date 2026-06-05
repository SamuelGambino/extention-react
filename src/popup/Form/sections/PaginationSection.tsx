import InputField from "../../InputField";
import "../index.css";

const PaginationSection = () => {

  return (
    <div className="form__section">
      <span className="form__section-title">Pagination</span>

      <div className="form__section-content">
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Pages container</label>
          </div>
          <InputField placeholder='div.pagination' onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Next page</label>
          </div>
          <InputField placeholder='button.pagination-next' onChange={() => { }} />
        </div>
      </div>
    </div>
  )
}

export default PaginationSection;