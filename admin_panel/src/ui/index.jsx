import { Children, isValidElement, useState } from "react";
import { createPortal } from "react-dom";
import style from "./ui.module.css";

function optionNodes(children, options) {
  const rows = [];
  if (options) {
    options.forEach((option) => rows.push({ value: option.value, label: option.label }));
  }
  Children.forEach(children, (node) => {
    if (isValidElement(node) && node.type === Option) {
      rows.push({ value: node.props.value, label: node.props.children });
    }
  });
  return rows;
}

export function Option() {
  return null;
}

export function Select({
  children,
  options,
  value,
  onChange,
  disabled,
  name,
  className,
  placeholder,
  showSearch,
  onSearch,
  id,
}) {
  const [query, setQuery] = useState("");
  const rows = optionNodes(children, options).filter((row) => {
    if (!showSearch || !query) return true;
    return String(row.label ?? "").toLowerCase().includes(query.trim().toLowerCase());
  });
  const current = value === undefined || value === null ? "" : String(value);

  return (
    <span className={`${style.selectWrap} rs-control`}>
      {showSearch ? (
        <input
          className={style.input}
          value={query}
          placeholder={placeholder || "Search"}
          onChange={(event) => {
            setQuery(event.target.value);
            if (onSearch) onSearch(event.target.value);
          }}
        />
      ) : null}
      <select
        id={id}
        name={name}
        className={`${style.select} ${className || ""}`}
        disabled={disabled}
        value={current}
        onChange={(event) => {
          const picked = rows.find((row) => String(row.value) === event.target.value);
          if (onChange) onChange(picked ? picked.value : event.target.value);
        }}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {rows.length === 0 ? <option value="">No records</option> : null}
        {rows.map((row) => (
          <option key={String(row.value)} value={String(row.value)}>
            {row.label}
          </option>
        ))}
      </select>
    </span>
  );
}

Select.Option = Option;

export function Input(props) {
  return <input className={style.input} {...props} />;
}

function SearchBox({
  allowClear,
  enterButton,
  onSearch,
  onChange,
  value,
  placeholder,
  className,
  style: inlineStyle,
}) {
  const [inner, setInner] = useState("");
  const text = value !== undefined ? value : inner;
  const change = (next) => {
    if (value === undefined) setInner(next);
    if (onChange) onChange({ target: { value: next } });
  };
  return (
    <span className={`${style.search} ${className || ""}`} style={inlineStyle}>
      <input
        value={text}
        placeholder={placeholder}
        onChange={(event) => change(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && onSearch) onSearch(text);
        }}
      />
      {allowClear && text ? (
        <button type="button" className={style.clear} onClick={() => { change(""); if (onSearch) onSearch(""); }}>
          Clear
        </button>
      ) : null}
      {enterButton ? (
        <button type="button" className={style.searchBtn} onClick={() => onSearch && onSearch(text)}>
          Search
        </button>
      ) : null}
    </span>
  );
}

Input.Search = SearchBox;

export function Modal({
  open,
  visible,
  onCancel,
  onOk,
  title,
  footer,
  children,
  className,
  okText = "OK",
  cancelText = "Cancel",
  closable = true,
  closeIcon,
  width,
}) {
  const shown = open !== undefined ? open : visible;
  if (!shown) return null;
  const dialog = (
    <div className={style.mask} onMouseDown={() => { if (closable && onCancel) onCancel(); }}>
      <div
        className={`${style.dialog} ${className || ""}`}
        style={width ? { width } : undefined}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {closable ? (
          <button type="button" className={style.close} onClick={onCancel}>
            {closeIcon || "×"}
          </button>
        ) : null}
        {title ? <div className={style.title}>{title}</div> : null}
        <div className={style.body}>{children}</div>
        {footer === null ? null : (
          <div className={style.footer}>
            {footer || (
              <>
                <button type="button" className={style.ghost} onClick={onCancel}>{cancelText}</button>
                <button type="button" className={style.primary} onClick={onOk}>{okText}</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
  return createPortal(dialog, document.body);
}

export function Popconfirm({ title, onConfirm, onCancel, okText = "OK", cancelText = "Cancel", children }) {
  const [open, setOpen] = useState(false);
  return (
    <span className={style.pop}>
      <span onClick={() => setOpen((value) => !value)}>{children}</span>
      {open ? (
        <span className={style.bubble}>
          <span>{title}</span>
          <button
            type="button"
            className={style.ghost}
            onClick={() => {
              setOpen(false);
              if (onCancel) onCancel();
            }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={style.primary}
            onClick={() => {
              setOpen(false);
              if (onConfirm) onConfirm();
            }}
          >
            {okText}
          </button>
        </span>
      ) : null}
    </span>
  );
}

export function Pagination({ current = 1, total = 0, pageSize = 10, onChange }) {
  const pages = Math.max(1, Math.ceil((Number(total) || 0) / (Number(pageSize) || 10)));
  const page = Number(current) || 1;
  return (
    <span className={style.pager}>
      <button type="button" disabled={page <= 1} onClick={() => onChange && onChange(page - 1)}>Prev</button>
      <span>{page} / {pages}</span>
      <button type="button" disabled={page >= pages} onClick={() => onChange && onChange(page + 1)}>Next</button>
    </span>
  );
}

export function Spin({ size = "default" }) {
  return <span className={`${style.spin} ${style[size] || style.default}`} />;
}

export function Space({ children }) {
  return <span className={style.space}>{children}</span>;
}

export function Button({ children, onClick, type = "button", className }) {
  return (
    <button type={type} className={`${style.primary} ${className || ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

export const message = {
  success() {},
  error() {},
  warning() {},
  info() {},
};
