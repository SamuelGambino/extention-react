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

const Form = () => {
  return (
    <form className='form'>
      <fieldset className="form__settings">
        <legend className="form__settings-title">Main</legend>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Preset</label>
            <Hint hint='Выберите пресет парсера'/>
          </div>
          <SelectField isAccent={true} value='none' options={PresertOptions} onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Source</label>
            <Hint hint='Введите url источника'/>
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
            <Hint hint='Выберите по какому элементу требуются клики'/>
          </div>
          <SelectField isAccent={true} value='none' options={ClicksOptions} onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Pagination</label>
            <Hint hint='Требуется ли переключение страниц'/>
          </div>
          <SwitchField onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Parameters</label>
            <Hint hint='Есть ли у товара несколько вариаций'/>
          </div>
          <SwitchField onChange={() => { }} />
        </div>

        <div className='form__field'>
          <div className='form__field-title'>
            <label className='form__field-label'>Modifiers</label>
            <Hint hint='Есть ли в номенклатуре модификаторы'/>
          </div>
          <SwitchField onChange={() => { }} />
        </div>
      </fieldset>
    </form>
  )
}

export default Form;