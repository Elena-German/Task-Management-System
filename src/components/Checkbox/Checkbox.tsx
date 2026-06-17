import React from "react";
import { CheckboxProps } from "./Checkbox.types";
import "./Checkbox.css";

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <>
      <label className="form-check-label" htmlFor={label}>
        <input
          className="form-check-input custom-checkbox"
          type="checkbox"
          value=""
          checked={checked}
          onChange={onChange}
          id={label}
        />
        {label}
      </label>
    </>
  );
}
