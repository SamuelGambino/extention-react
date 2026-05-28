import Hint from "../Hint";
import InputField from "../InputField";
import SelectField from "../SelectField";
import SwitchField from "../SwitchField";
import "./index.css";

const PresertOptions = [
  { label: 'None', value: 'none' },
  { label: 'Custom', value: 'custom' },
  { label: 'Api', value: 'api' },
  { label: 'VK', value: 'vk' },
  { label: 'Yandex eda', value: 'yandex_eda' },
  { label: 'Yandex map', value: 'yandex_map' },
  { label: 'Chibbis', value: 'chibbis' },
]

const ClicksOptions = [
  { label: 'None', value: 'none' },
  { label: 'Products', value: 'line' },
  { label: 'Category', value: 'api' },
  { label: 'All', value: 'vk' }
]

const GroupTypes = [
  { label: 'one_one', value: 'one_one' },
  { label: 'one_unlimited', value: 'one_unlimited' },
  { label: 'all_one', value: 'all_one' },
  { label: 'all_unlimited', value: 'all_unlimited' },
]

interface FormProps {
  className?: string;
}

const Form = ({ className }: FormProps) => {
  return (
    <form className={`form ${className ? ` ${className}` : ''}`}>
      <fieldset className="form__settings">
        <legend className="form__settings-title">Main</legend>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Preset</label>
            <Hint hint='Выберите пресет парсера' />
          </div>
          <SelectField isAccent={true} value='none' options={PresertOptions} onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Source</label>
            <Hint hint='Введите url источника' hintPosition='left' />
          </div>
          <InputField isAccent={true} placeholder='https://example.com' onChange={() => { }}>
            <button className="form__settings-btn" onClick={() => { }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.99974 0.5L9.69034 7.69651C9.70486 7.8541 9.77478 8.00147 9.88665 8.11334C9.99853 8.22522 10.1459 8.2946 10.3035 8.3102L17.5 9.00027L10.3035 9.69034C10.1454 9.70486 9.99853 9.77478 9.88665 9.88665C9.77478 9.99853 9.7054 10.1464 9.69034 10.3035L8.99974 17.5005L8.30966 10.3035C8.2946 10.1464 8.22522 9.99853 8.11334 9.88665C8.00147 9.77478 7.8541 9.7054 7.69651 9.69034L0.5 9.00027L7.69651 8.3102C7.85356 8.2946 8.00147 8.22522 8.11334 8.11334C8.22522 8.00147 8.2946 7.8541 8.30966 7.69651L8.99974 0.5Z" stroke="#FFE7E1" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8.99974 0.5C13.6914 0.5 17.5 4.30856 17.5 9.00027C17.5 13.6909 13.6914 17.5005 8.99974 17.5005C4.3091 17.5005 0.5 13.6914 0.5 9.00027C0.500538 4.30856 4.3091 0.5 8.99974 0.5Z" stroke="#FFE7E1" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </InputField>
        </div>
      </fieldset>

      <fieldset className="form__settings">
        <legend className="form__settings-title">Settings</legend>
        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Clicks</label>
            <Hint hint='Выберите по какому элементу требуются клики' />
          </div>
          <SelectField value='none' options={ClicksOptions} onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Pagination</label>
            <Hint hint='Требуется ли переключение страниц' hintPosition='left' />
          </div>
          <SwitchField onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Parameters</label>
            <Hint hint='Есть ли у товара несколько вариаций' />
          </div>
          <SwitchField onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Modifiers</label>
            <Hint hint='Есть ли в номенклатуре модификаторы' hintPosition='left' />
          </div>
          <SwitchField onChange={() => { }} />
        </div>
      </fieldset>

      <fieldset className="form__settings">
        <legend className="form__settings-title">Selectors</legend>

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

        <div className="form__section">
          <span className="form__section-title">Clicks</span>

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
        </div>

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

        <div className="form__section">
          <span className="form__section-title">Modifiers</span>

          <div className="form__section-content">
            <div className='form__field'>
              <div className='form__field-title'>
                <label className='form__field-label'>Modifiers group container</label>
              </div>
              <InputField placeholder='ul.modifiers' onChange={() => { }} />
            </div>

            <div className='form__field'>
              <div className='form__field-title'>
                <label className='form__field-label'>Modifiers group name</label>
              </div>
              <InputField placeholder='p.modifiers-title' onChange={() => { }} />
            </div>

            <div className='form__field'>
              <div className='form__field-title'>
                <label className='form__field-label'>Default group type</label>
              </div>
              <SelectField value='none' options={GroupTypes} onChange={() => { }} />
            </div>

            <div className='form__field'>
              <div className='form__field-title'>
                <label className='form__field-label'>Modifier</label>
              </div>
              <InputField placeholder='li.modifier' onChange={() => { }} />
            </div>

            <div className='form__field'>
              <div className='form__field-title'>
                <label className='form__field-label'>Modifier name</label>
              </div>
              <InputField placeholder='span.modifier-name' onChange={() => { }} />
            </div>

            <div className='form__field'>
              <div className='form__field-title'>
                <label className='form__field-label'>Modifier price</label>
              </div>
              <InputField placeholder='span.modifier-price' onChange={() => { }} />
            </div>
          </div>
        </div>
      </fieldset>
    </form>
  )
}

export default Form;