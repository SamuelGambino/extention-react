import "./index.css"

const State = () => {
  return (
    <div className='state'>
      <span className="state__title">State</span>
      <section className="state__section">
        <p className="state__item">Preset: <span className="state__value">None</span></p>
        <p className="state__item">Source: <span className="state__value">example.com</span></p>
        <p className="state__item">Availability: <span className="state__value">Ready</span></p>
      </section>
      <section className="state__section">
        <p className="state__item">Categories: <span className="state__value">5</span></p>
        <p className="state__item">Products: <span className="state__value">46</span></p>
      </section>
      <button className="button state__button" onClick={() => { }}>Parse</button>
    </div>
  )
}

export default State;