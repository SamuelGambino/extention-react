import { useParserConfig, useParsingState } from "../hooks/useStorage";
import "./index.css"

const State = () => {
  const [configValue, , isLoadedConfig] = useParserConfig();
  const [stateValue, , isLoadedState] = useParsingState();

  const getActualConfig = () => {
    return configValue.tabs.find((tab) => tab.tabId === configValue.actualTab);
  }

  if (!isLoadedConfig && !isLoadedState) return null;

  return (
    <div className="state">
      <div className="state__corner-tl" />
      <div className="state__corner-br" />

      <span className="state__title">
        <span className="state__status-dot" />
        State
      </span>

      <section className="state__section">
        <p className="state__item">
          <span className="state__label">Preset</span>
          <span className="state__value">{stateValue.parsing.isRunning ? stateValue.parsing.type : getActualConfig()?.type}</span>
        </p>
        <p className="state__item">
          <span className="state__label">Source</span>
          <span className="state__value">{stateValue.parsing.isRunning ? stateValue.parsing.source : getActualConfig()?.source}</span>
        </p>
        <p className="state__item">
          <span className="state__label">Availability</span>
          <span className={`state__badge state__badge--${stateValue.parsing.isReady ? 'success' : 'accent'}`}>
            <span className="state__badge-dot" />
            {stateValue.parsing.isReady ? "Ready" : "Wait"}
          </span>
        </p>
      </section>

      <section className="state__section">
        <p className="state__item">
          <span className="state__label">Categories</span>
          <span className="state__value">{stateValue.data.categories} / {stateValue.data.categoriesTotal}</span>
        </p>
        <div className="state__bar-wrap">
          <div className="state__bar">
            <div
              className="state__bar-fill"
              style={{ width: `${(stateValue.data.categories / stateValue.data.categoriesTotal) * 100}%` }}
            />
          </div>
          <span className="state__value">
            {Math.round((stateValue.data.categories / stateValue.data.categoriesTotal) * 100)}%
          </span>
        </div>

        <p className="state__item">
          <span className="state__label">Products</span>
          <span className="state__value">{stateValue.data.products} / {stateValue.data.productsTotal}</span>
        </p>
        <div className="state__bar-wrap">
          <div className="state__bar">
            <div
              className="state__bar-fill"
              style={{ width: `${(stateValue.data.products / stateValue.data.productsTotal) * 100}%` }}
            />
          </div>
          <span className="state__value">
            {Math.round((stateValue.data.products / stateValue.data.productsTotal) * 100)}%
          </span>
        </div>
      </section>

      {stateValue.logs && stateValue.logs.length > 0 && (
        <section className="state__section">
          <span className="state__title state__title--sub">
            Logs
            {stateValue.parsing.isRunning && (
              <span className="state__badge state__badge--accent state__badge--right">
                <span className="state__badge-dot" />
                Running
              </span>
            )}
          </span>
          <div className="state__logs">
            {stateValue.logs.map((log, i) => (
              <p key={i} className={`state__log-item state__log-item--${log.status ?? 'default'}`}>
                <span className="state__log-bracket">&gt;</span>
                <span className="state__log-text">{log.title}</span>
                <span className="state__log-value">{log.value}</span>
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default State;