import CustomInput from "./CustomInput";
import CustomLabel from "./CustomLabel";
import CustomSelect from "./CustomSelect";

function CustomListToolbar({
  showSearch = true,
  search,
  onSearchChange,
  searchLabel = "Search",
  searchPlaceholder = "Search",
  filters = [],
  idPrefix = "list",
}) {
  return (
    <div className="custom-list-controls-toolbar" role="search">
      {showSearch ? (
        <div className="custom-list-controls-field custom-list-controls-field--grow">
          <CustomLabel htmlFor={`${idPrefix}_search`} text={searchLabel} className="custom-list-controls-label" />
          <CustomInput
            id={`${idPrefix}_search`}
            name="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="erp-input-compact custom-list-controls-input"
            autoComplete="off"
          />
        </div>
      ) : null}
      {filters.map((filter) => (
        <div key={filter.id} className="custom-list-controls-field custom-list-controls-field--filter">
          <CustomLabel htmlFor={`${idPrefix}_${filter.id}`} text={filter.label || "Filter"} className="custom-list-controls-label" />
          <CustomSelect
            id={`${idPrefix}_${filter.id}`}
            className="erp-input-compact custom-list-controls-input"
            value={filter.value == null ? "" : String(filter.value)}
            onChange={(event) => filter.onChange(event.target.value)}
          >
            {(filter.options || []).map((option) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </CustomSelect>
        </div>
      ))}
    </div>
  );
}

export default CustomListToolbar;
