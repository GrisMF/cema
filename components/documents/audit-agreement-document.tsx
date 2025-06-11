"use client"

import { AgreementHeader } from "../audit-agreement-sections/agreement-header"
import { ClauseFirst } from "../audit-agreement-sections/clause-first"
import { ClauseSecond } from "../audit-agreement-sections/clause-second"
import { ClauseThird } from "../audit-agreement-sections/clause-third"
import { ClauseFourth } from "../audit-agreement-sections/clause-fourth"
import { ClauseFifth } from "../audit-agreement-sections/clause-fifth"
import { ClauseSixth } from "../audit-agreement-sections/clause-sixth"
import { ClauseSeventh } from "../audit-agreement-sections/clause-seventh"
import { ClauseEighth } from "../audit-agreement-sections/clause-eighth"
import { ClauseNinth } from "../audit-agreement-sections/clause-ninth"
import { ClauseTenth } from "../audit-agreement-sections/clause-tenth"
import { ClauseEleventh } from "../audit-agreement-sections/clause-eleventh"
import { ClauseTwelfth } from "../audit-agreement-sections/clause-twelfth"
import { ClauseThirteenth } from "../audit-agreement-sections/clause-thirteenth"
import { ClauseFourteenth } from "../audit-agreement-sections/clause-fourteenth"
import { AgreementFooter } from "../audit-agreement-sections/agreement-footer"

interface AuditAgreementDocumentProps {
  datosGenerales?: any
  esquemas?: string[]
  editableFields?: Record<string, string>
  updateEditableField?: (fieldName: string, value: string) => void
}

export function AuditAgreementDocument({
  datosGenerales = {},
  esquemas = [],
  editableFields = {},
  updateEditableField = () => {},
}: AuditAgreementDocumentProps) {
  if (!esquemas?.includes("primusgfs")) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-gray-500">
          El Acuerdo de Auditoría solo está disponible para cotizaciones de PrimusGFS.
        </p>
      </div>
    )
  }

  return (
    <div
      className="audit-agreement-document"
      style={{
        fontFamily: "Times New Roman, serif",
        fontSize: "11pt",
        lineHeight: 1.3,
        width: "100%",
        maxWidth: "210mm",
        margin: "0 auto",
        padding: "0",
        boxSizing: "border-box",
        textAlign: "left",
      }}
    >
      <div style={{ width: "100%", position: "relative" }}>
        {/* Encabezado del acuerdo */}
        <AgreementHeader
          datosGenerales={datosGenerales}
          editableFields={editableFields}
          updateEditableField={updateEditableField}
        />

        {/* Cláusula Primera */}
        <ClauseFirst editableFields={editableFields} updateEditableField={updateEditableField} />

        {/* Cláusula Segunda */}
        <ClauseSecond editableFields={editableFields} updateEditableField={updateEditableField} />

        {/* Cláusula Tercera */}
        <ClauseThird editableFields={editableFields} updateEditableField={updateEditableField} />

        {/* Cláusula Cuarta */}
        <ClauseFourth editableFields={editableFields} updateEditableField={updateEditableField} />

        {/* Cláusula Quinta */}
        <ClauseFifth editableFields={editableFields} updateEditableField={updateEditableField} />

        {/* Cláusula Sexta */}
        <ClauseSixth editableFields={editableFields} updateEditableField={updateEditableField} />

        {/* Cláusula Séptima */}
        <ClauseSeventh editableFields={editableFields} updateEditableField={updateEditableField} />

        {/* Cláusula Octava */}
        <ClauseEighth editableFields={editableFields} updateEditableField={updateEditableField} />

        {/* Cláusula Novena */}
        <ClauseNinth editableFields={editableFields} updateEditableField={updateEditableField} />

        {/* Cláusula Décima */}
        <ClauseTenth editableFields={editableFields} updateEditableField={updateEditableField} />

        {/* Cláusula Undécima */}
        <ClauseEleventh editableFields={editableFields} updateEditableField={updateEditableField} />

        {/* Cláusula Duodécima */}
        <ClauseTwelfth editableFields={editableFields} updateEditableField={updateEditableField} />

        {/* Cláusula Decimotercera */}
        <ClauseThirteenth editableFields={editableFields} updateEditableField={updateEditableField} />

        {/* Cláusula Decimocuarta */}
        <ClauseFourteenth editableFields={editableFields} updateEditableField={updateEditableField} />

        {/* Pie del acuerdo */}
        <AgreementFooter
          datosGenerales={datosGenerales}
          editableFields={editableFields}
          updateEditableField={updateEditableField}
        />
      </div>
    </div>
  )
}
