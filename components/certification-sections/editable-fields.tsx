"use client"
import type React from "react"

interface EditableFieldProps {
  fieldName: string
  placeholder?: string
  value: string
  onChange: (fieldName: string, value: string) => void
  multiline?: boolean
  rows?: number
  style?: React.CSSProperties
}

export function EditableField({
  fieldName,
  placeholder = "",
  value,
  onChange,
  multiline = false,
  rows = 1,
  style = {},
}: EditableFieldProps) {
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(fieldName, e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: "100%",
          border: "1px solid #ddd",
          padding: "2px 4px",
          fontSize: "inherit",
          fontFamily: "inherit",
          resize: "vertical",
          ...style,
        }}
      />
    )
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(fieldName, e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        border: "1px solid #ddd",
        padding: "2px 4px",
        fontSize: "inherit",
        fontFamily: "inherit",
        ...style,
      }}
    />
  )
}

interface EditableCheckboxProps {
  fieldName: string
  checked?: boolean
  defaultChecked?: boolean
  onChange: (fieldName: string, checked: boolean) => void
  style?: React.CSSProperties
}

export function EditableCheckbox({
  fieldName,
  checked,
  defaultChecked = false,
  onChange,
  style = {},
}: EditableCheckboxProps) {
  const isChecked = checked !== undefined ? checked : defaultChecked

  return (
    <div
      onClick={() => onChange(fieldName, !isChecked)}
      style={{
        width: "15px",
        height: "15px",
        border: "1px solid #000",
        display: "inline-block",
        backgroundColor: isChecked ? "#000" : "transparent",
        cursor: "pointer",
        position: "relative",
        ...style,
      }}
    ></div>
  )
}
