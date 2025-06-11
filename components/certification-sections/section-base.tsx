"use client"

import type React from "react"

interface SectionBaseProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function SectionBase({ title, subtitle, children }: SectionBaseProps) {
  return (
    <>
      <div
        style={{
          textAlign: "center",
          margin: "20px 0 10px 0",
          backgroundColor: "#4472C4",
          padding: "8px",
          color: "white",
        }}
      >
        <p style={{ fontWeight: "bold", fontSize: "12pt", margin: "0" }}>{title}</p>
        {subtitle && <p style={{ fontSize: "10pt", margin: "5px 0 0 0", fontStyle: "italic" }}>{subtitle}</p>}
      </div>

      <div style={{ textAlign: "center", margin: "10px 0" }}>
        <p style={{ fontSize: "9pt", margin: "0" }}>Cema International Compliance Services S.A. de C.V.</p>
        <p style={{ fontSize: "9pt", margin: "0" }}>
          Florencia 3127, Lomas de Providencia, Guadalajara, Jalisco, México, C.P. 44647.
        </p>
      </div>

      {children}
    </>
  )
}
