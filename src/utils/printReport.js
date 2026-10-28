/**
 * Dedicated Browser-Native Print Utility for EcoSort AI Analysis Reports
 * Populates an isolated #ecosort-printable-report DOM container and invokes window.print().
 * Completely suppresses the application shell via @media print CSS while rendering
 * a clean, professional black-on-white audit report with all batch details.
 */

export function printAnalysisReport(result) {
  if (!result) {
    console.error('[EcoSort Print] No analysis result provided for printing.');
    window.print();
    return;
  }

  // Format date and time
  const formattedDate = result.createdAt
    ? new Date(result.createdAt).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'medium'
      })
    : new Date().toLocaleString();

  const contaminationScore = typeof result.contaminationScore === 'number'
    ? result.contaminationScore.toFixed(1)
    : '0.0';

  const purityIndex = typeof result.purityIndex === 'number'
    ? result.purityIndex.toFixed(1)
    : (100 - parseFloat(contaminationScore)).toFixed(1);

  const materials = Array.isArray(result.materialsDetected) ? result.materialsDetected : [];
  const alerts = Array.isArray(result.contaminationAlerts) ? result.contaminationAlerts : [];
  const checklist = Array.isArray(result.actionChecklist) ? result.actionChecklist : [];
  const recommendations = Array.isArray(result.batchRecommendations) ? result.batchRecommendations : [];

  // Generate materials rows
  const materialsRows = materials.length > 0
    ? materials.map((m) => `
        <tr>
          <td style="font-weight: 600; padding: 6px 10px; border: 1px solid #d1d5db;">${escapeHtml(m.name || 'Unspecified')}</td>
          <td style="padding: 6px 10px; border: 1px solid #d1d5db;">${escapeHtml(m.category || 'General')}</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700; padding: 6px 10px; border: 1px solid #d1d5db;">${Number(m.estimatedPercentage || 0)}%</td>
          <td style="text-align: right; font-family: monospace; padding: 6px 10px; border: 1px solid #d1d5db;">${Number(m.confidence || 0)}%</td>
          <td style="text-align: center; padding: 6px 10px; border: 1px solid #d1d5db;">${m.recyclableInStream ? '✓ Target Recyclable' : '✗ Non-Target / Contaminant'}</td>
        </tr>
      `).join('')
    : '<tr><td colspan="5" style="text-align: center; color: #666; padding: 8px; border: 1px solid #d1d5db;">No individual materials categorized.</td></tr>';

  // Generate alerts blocks
  const alertsHtml = alerts.length > 0
    ? alerts.map((a, idx) => `
        <div style="border: 1px solid #d1d5db; border-radius: 6px; padding: 10px 14px; margin-bottom: 10px; page-break-inside: avoid; background-color: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
            <strong style="font-size: 11pt; color: #111827;">${idx + 1}. ${escapeHtml(a.item || 'Flagged Contaminant')}</strong>
            <span style="font-size: 8.5pt; font-weight: 700; text-transform: uppercase; border: 1px solid #111827; padding: 2px 6px; border-radius: 4px; color: #111827;">
              ${escapeHtml(a.severity || 'NOTICE')}
            </span>
          </div>
          <p style="margin: 0 0 6px 0; font-size: 10pt; color: #374151;">${escapeHtml(a.description || '')}</p>
          <div style="background-color: #f9fafb; border-left: 3px solid #111827; padding: 6px 10px; font-size: 9.5pt; margin-top: 4px;">
            <div><strong style="color: #111827;">Visual Signature:</strong> ${escapeHtml(a.visualEvidence || 'None documented')}</div>
            <div style="margin-top: 3px;"><strong style="color: #111827;">Corrective Protocol:</strong> ${escapeHtml(a.correctiveAction || 'Standard sorting line divert')}</div>
          </div>
        </div>
      `).join('')
    : '<p style="color: #4b5563; font-style: italic; margin-bottom: 16px;">Zero critical contamination alerts detected. Batch satisfies pure commodity threshold.</p>';

  // Generate checklist rows
  const checklistHtml = checklist.length > 0
    ? checklist.map((c) => `
        <li style="margin-bottom: 8px; page-break-inside: avoid;">
          <strong style="color: #111827;">Step ${c.step || '•'}: ${escapeHtml(c.title || '')}</strong>
          ${c.priority ? `<span style="font-size: 8.5pt; text-transform: uppercase; font-weight: 700; margin-left: 6px; color: #4b5563;">[Priority: ${escapeHtml(c.priority)}]</span>` : ''}
          <div style="font-size: 9.5pt; color: #374151; margin-top: 2px;">${escapeHtml(c.description || '')}</div>
          ${c.estimatedDivertRate ? `<div style="font-size: 9pt; color: #111827; font-weight: 600; margin-top: 2px;">Estimated Divert Impact: ${escapeHtml(c.estimatedDivertRate)}</div>` : ''}
        </li>
      `).join('')
    : '<p style="color: #4b5563; font-style: italic; margin-bottom: 16px;">No specific operational sorting steps required for this batch.</p>';

  // Generate supervisor recommendations
  const recommendationsHtml = recommendations.length > 0
    ? recommendations.map((r) => `<li style="margin-bottom: 6px; color: #374151;">${escapeHtml(r)}</li>`).join('')
    : '<li style="color: #666;">Standard facility operational conveyor procedures apply.</li>';

  // Construct report inner markup
  const reportContent = `
    <!-- Header Block -->
    <table style="width: 100%; border-bottom: 2px solid #111827; padding-bottom: 12px; margin-bottom: 18px; border-collapse: collapse;">
      <tr>
        <td style="vertical-align: top; border: none; padding: 0;">
          <div style="font-size: 20pt; font-weight: 800; letter-spacing: -0.5px; color: #111827; line-height: 1.1;">EcoSort AI</div>
          <div style="font-size: 9.5pt; color: #4b5563; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Optical Waste Stream & Contamination Intelligence Report</div>
        </td>
        <td style="text-align: right; vertical-align: top; font-size: 9.5pt; color: #4b5563; border: none; padding: 0;">
          <div><strong style="color: #111827;">Document ID:</strong> ${escapeHtml(result.id || 'N/A')}</div>
          <div><strong style="color: #111827;">Generated:</strong> ${escapeHtml(formattedDate)}</div>
          <div><strong style="color: #111827;">Target Stream:</strong> ${escapeHtml((result.wasteStream || '').replace(/_/g, ' '))}</div>
        </td>
      </tr>
    </table>

    <!-- Batch Metadata Card -->
    <div style="border: 1px solid #d1d5db; border-radius: 6px; padding: 10px 14px; margin-bottom: 16px; background-color: #fafafa;">
      <table style="width: 100%; border-collapse: collapse; font-size: 9.5pt;">
        <tr>
          <td style="border: none; padding: 3px 8px 3px 0; width: 50%;"><strong style="color: #111827;">Batch Identifier:</strong> ${escapeHtml(result.batchName || 'Unassigned')}</td>
          <td style="border: none; padding: 3px 0 3px 8px; width: 50%;"><strong style="color: #111827;">Quality Outcome:</strong> ${escapeHtml((result.streamSuitability || '').replace(/_/g, ' '))}</td>
        </tr>
        <tr>
          <td style="border: none; padding: 3px 8px 3px 0;"><strong style="color: #111827;">Inspection Station:</strong> ${escapeHtml(result.facilityLine || 'Standard Optical Infeed')}</td>
          <td style="border: none; padding: 3px 0 3px 8px;"><strong style="color: #111827;">Risk Classification:</strong> ${escapeHtml(result.overallRisk || 'N/A')} Risk Tier</td>
        </tr>
        ${result.operatorNotes ? `
        <tr>
          <td colspan="2" style="border: none; padding: 5px 0 0 0;"><strong style="color: #111827;">Operator Notes:</strong> ${escapeHtml(result.operatorNotes)}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    <!-- KPI Metric Blocks -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="width: 33.3%; border: 1px solid #d1d5db; border-radius: 6px; padding: 10px; text-align: center; background-color: #ffffff;">
          <div style="font-size: 8.5pt; text-transform: uppercase; font-weight: 600; color: #4b5563;">Contamination Score</div>
          <div style="font-size: 20pt; font-weight: 800; font-family: monospace; color: #111827; margin-top: 2px;">${contaminationScore}%</div>
        </td>
        <td style="width: 33.3%; border: 1px solid #d1d5db; border-radius: 6px; padding: 10px; text-align: center; background-color: #ffffff;">
          <div style="font-size: 8.5pt; text-transform: uppercase; font-weight: 600; color: #4b5563;">Commodity Purity Index</div>
          <div style="font-size: 20pt; font-weight: 800; font-family: monospace; color: #111827; margin-top: 2px;">${purityIndex}%</div>
        </td>
        <td style="width: 33.3%; border: 1px solid #d1d5db; border-radius: 6px; padding: 10px; text-align: center; background-color: #ffffff;">
          <div style="font-size: 8.5pt; text-transform: uppercase; font-weight: 600; color: #4b5563;">Stream Suitability</div>
          <div style="font-size: 13pt; font-weight: 800; color: #111827; margin-top: 6px;">${escapeHtml(result.streamSuitability || 'N/A')}</div>
        </td>
      </tr>
    </table>

    <!-- 01. Executive AI Assessment -->
    <h2 style="font-size: 12pt; font-weight: 700; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin: 16px 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px; color: #111827;">
      01. Executive AI Assessment
    </h2>
    <p style="font-size: 10pt; line-height: 1.5; margin: 0 0 8px 0; color: #1f2937;">
      ${escapeHtml(result.summaryProse || 'Assessment generated via automated optical computer vision inspection.')}
    </p>
    <p style="font-size: 9.5pt; color: #374151; margin: 0 0 16px 0;">
      <strong style="color: #111827;">Suitability Rationale:</strong> ${escapeHtml(result.suitabilityReason || 'Standard verification against scrap specifications.')}
    </p>

    <!-- 02. Material Composition Spectrum -->
    <h2 style="font-size: 12pt; font-weight: 700; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin: 16px 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px; color: #111827;">
      02. Detected Material Composition Spectrum
    </h2>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 9.5pt;">
      <thead>
        <tr style="background-color: #f3f4f6;">
          <th style="padding: 6px 10px; border: 1px solid #d1d5db; text-align: left; font-weight: 700;">Detected Commodity Item</th>
          <th style="padding: 6px 10px; border: 1px solid #d1d5db; text-align: left; font-weight: 700;">Category</th>
          <th style="padding: 6px 10px; border: 1px solid #d1d5db; text-align: right; font-weight: 700;">Composition %</th>
          <th style="padding: 6px 10px; border: 1px solid #d1d5db; text-align: right; font-weight: 700;">AI Confidence</th>
          <th style="padding: 6px 10px; border: 1px solid #d1d5db; text-align: center; font-weight: 700;">Target Status</th>
        </tr>
      </thead>
      <tbody>
        ${materialsRows}
      </tbody>
    </table>

    <!-- 03. Flagged Contaminants & Evidence -->
    <h2 style="font-size: 12pt; font-weight: 700; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin: 16px 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px; color: #111827;">
      03. Flagged Contaminants & Evidence
    </h2>
    ${alertsHtml}

    <!-- 04. Corrective Action Checklist -->
    <h2 style="font-size: 12pt; font-weight: 700; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin: 16px 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px; color: #111827;">
      04. Prioritized Operator Corrective Protocol
    </h2>
    <ul style="margin: 0 0 16px 0; padding-left: 20px;">
      ${checklistHtml}
    </ul>

    <!-- 05. Facility Supervisor Directives -->
    <h2 style="font-size: 12pt; font-weight: 700; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin: 16px 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px; color: #111827;">
      05. Facility Supervisor Directives
    </h2>
    <ul style="margin: 0 0 16px 0; padding-left: 20px; font-size: 9.5pt;">
      ${recommendationsHtml}
    </ul>

    <!-- Quality Inspector Sign-Off -->
    <div style="margin-top: 25px; padding-top: 10px; page-break-inside: avoid;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="width: 48%; border: none; padding-right: 20px; vertical-align: top;">
            <div style="border-bottom: 1px solid #111827; height: 28px; margin-bottom: 4px;"></div>
            <div style="font-size: 8.5pt; color: #4b5563;">MRF Quality Inspector (Signature)</div>
          </td>
          <td style="width: 4%; border: none;"></td>
          <td style="width: 48%; border: none; padding-left: 20px; vertical-align: top;">
            <div style="border-bottom: 1px solid #111827; height: 28px; margin-bottom: 4px;"></div>
            <div style="font-size: 8.5pt; color: #4b5563;">Date of Final Facility Disposition</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Regulatory Notice & Operating Limitations -->
    <div style="margin-top: 25px; padding-top: 10px; border-top: 1px solid #d1d5db; font-size: 8pt; color: #6b7280; line-height: 1.4; page-break-inside: avoid;">
      <strong style="color: #4b5563;">Regulatory Notice & Operating Limitations:</strong> This report is produced by EcoSort AI optical computer-vision models in accordance with ISRI Scrap Specifications Circular, EN 643 recovered paper tolerances, and APR model bale guidelines. All metric figures represent optical surface spectral estimation. Final downstream bale acceptance remains subject to manual grab moisture tests, bale coring, and contract-specific buyer specifications.
    </div>
  `;

  // Ensure dedicated print container exists in DOM and populate it synchronously
  let printContainer = document.getElementById('ecosort-printable-report');
  if (!printContainer) {
    printContainer = document.createElement('div');
    printContainer.id = 'ecosort-printable-report';
    document.body.appendChild(printContainer);
  }

  printContainer.innerHTML = reportContent;

  // Invoke browser native print dialog
  try {
    window.focus();
    window.print();
  } catch (err) {
    console.error('[EcoSort Print] window.print() encountered an error:', err);
  }
}

// Simple HTML escaping helper to prevent script injection in generated documents
function escapeHtml(str) {
  if (typeof str !== 'string') return String(str || '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
