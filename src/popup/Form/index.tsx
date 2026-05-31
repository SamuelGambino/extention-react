import { useState } from "react";
import Hint from "../Hint";
import InputField from "../InputField";
import SelectField from "../SelectField";
import SwitchField from "../SwitchField";
import FieldOptions from "./constants";
import "./index.css";
import MainBlock from "./blocks/MainBlock";

interface FormProps {
  className?: string;
}

const Form = ({ className }: FormProps) => {
  const [preset, setPreset] = useState('custom');

  const hasSettings = preset === 'custom' || preset === 'api';
  
  // const [source, setSource] = useState('');
  const [clicks, setClicks] = useState('none');
  const [pagination, setPagination] = useState(false);
  const [parameters, setParameters] = useState(false);
  const [modifiers, setModifiers] = useState(false);

  const renderPresetSection = () => {
    switch (preset) {
      case 'custom':
        return (
          <fieldset className="form__settings">
            <legend className="form__settings-title">Settings</legend>
            <div className='form__field'>
              <div className='form__field-title'>
                <label className='form__field-label'>Clicks</label>
                <Hint hint='Выберите по какому элементу требуются клики' />
              </div>
              <SelectField value='none' options={FieldOptions.ClicksOptions} onChange={setClicks} />
            </div>

            <div className='form__field'>
              <div className='form__field-title'>
                <label className='form__field-label'>Pagination</label>
                <Hint hint='Требуется ли переключение страниц' hintPosition='left' />
              </div>
              <SwitchField onChange={setPagination} />
            </div>

            <div className='form__field'>
              <div className='form__field-title'>
                <label className='form__field-label'>Parameters</label>
                <Hint hint='Есть ли у товара несколько вариаций' />
              </div>
              <SwitchField onChange={setParameters} />
            </div>

            <div className='form__field'>
              <div className='form__field-title'>
                <label className='form__field-label'>Modifiers</label>
                <Hint hint='Есть ли в номенклатуре модификаторы' hintPosition='left' />
              </div>
              <SwitchField onChange={setModifiers} />
            </div>
          </fieldset>
        );
      case 'api':
        return (
          <div className="form__preset-description">
            <p>Для работы пресета API необходимо указать URL источника данных и выбрать элементы для кликов. Остальные селекторы заполняются автоматически на основе структуры страницы.</p>
          </div>
        );
      case 'vk':
        return (
          <div className="form__preset-description">
            <p>Пресет для парсинга товаров из групп ВКонтакте. Укажите ссылку на группу и выберите, какие клики нужно распознавать (открытие товара, открытие категории). Остальные селекторы будут настроены автоматически.</p>
          </div>
        );
      case 'yandex_eda':
        return (
          <div className="form__preset-description">
            <p>Пресет для Яндекс.Еды. Укажите ссылку на ресторан и выберите, какие клики нужно распознавать (открытие товара, открытие категории). Остальные селекторы будут настроены автоматически.</p>
          </div>
        );
      case 'yandex_map':
        return (
          <div className="form__preset-description">
            <p>Пресет для Яндекс.Карт. Укажите ссылку на организацию и выберите, какие клики нужно распознавать (открытие товара, открытие категории). Остальные селекторы будут настроены автоматически.</p>
          </div>
        );
      case 'chibbis':
        return (
          <div className="form__preset-description">
            <p>Пресет для сети ресторанов Чибби. Укажите ссылку на ресторан и выберите, какие клики нужно распознавать (открытие товара, открытие категории). Остальные селекторы будут настроены автоматически.</p>
          </div>
        );
      default:
        return null;
    }
  }

  const renderClicksSection = () => {
    if (!clicks || clicks === 'none') return null;

    const sectionData = () => {
      if (clicks === 'products') {
        return (
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
        );
      } else if (clicks === 'category') {
        return (
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
        );
      } else if (clicks === 'all') {
        return (
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
        );
      }
    }

    return (
      <div className="form__section">
        <span className="form__section-title">Clicks</span>

        {sectionData()}
      </div>
    );
  }

  const renderPaginationSection = () => {
    if (!pagination) return null;

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

  const renderParametersSection = () => {
    if (!parameters) return null;

    return (
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
    )
  }

  const renderModifiersSection = () => {
    if (!modifiers) return null;

    return (
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
            <SelectField value='none' options={FieldOptions.GroupTypes} onChange={() => { }} />
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
    )
  }

  return (
    <form className={`form ${className ? ` ${className}` : ''}`}>
      <MainBlock preset={preset} onPresetChange={setPreset} />

      {renderPresetSection()}

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

        {renderClicksSection()}

        {renderPaginationSection()}

        {renderParametersSection()}

        {renderModifiersSection()}
      </fieldset>
    </form>
  )
}

export default Form;