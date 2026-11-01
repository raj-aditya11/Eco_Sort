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
          <td style="text-align: center; padding: 6px 10px; border: 1px solid #d1d5db;">${m.recyclableInStream ? '✓ Compatible Target' : '✗ Non-Target / Contaminant'}</td>
        </tr>
      `).join('')
    : '<tr><td colspan="5" style="text-align: center; color: #666; padding: 8px; border: 1px solid #d1d5db;">No individual materials categorized.</td></tr>';

  // Generate alerts blocks
  const alertsHtml = alerts.length > 0
    ? alerts.map((a, idx) => `
        <div style="border: 1px solid #d1d5db; border-radius: 6px; padding: 10px 14px; margin-bottom: 10px; page-break-inside: avoid; background-color: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
            <strong style="font-size: 10.5pt; color: #111827;">${idx + 1}. ${escapeHtml(a.item || 'Flagged Contaminant')}</strong>
            <span style="font-size: 8pt; font-weight: 700; text-transform: uppercase; border: 1px solid #111827; padding: 2px 6px; border-radius: 4px; color: #111827;">
              ${escapeHtml(a.severity || 'NOTICE')}
            </span>
          </div>
          <p style="margin: 0 0 6px 0; font-size: 9.5pt; color: #374151;">${escapeHtml(a.description || '')}</p>
          <div style="background-color: #f9fafb; border-left: 3px solid #111827; padding: 6px 10px; font-size: 9pt; margin-top: 4px;">
            <div><strong style="color: #111827;">Visual Evidence:</strong> ${escapeHtml(a.visualEvidence || 'None documented')}</div>
            <div style="margin-top: 3px;"><strong style="color: #111827;">Corrective Action:</strong> ${escapeHtml(a.correctiveAction || 'Standard sorting line divert')}</div>
          </div>
        </div>
      `).join('')
    : '<p style="color: #4b5563; font-style: italic; margin-bottom: 16px;">Zero critical contamination alerts detected. Batch satisfies stream purity threshold.</p>';

  // Generate checklist rows
  const checklistHtml = checklist.length > 0
    ? checklist.map((c) => `
        <li style="margin-bottom: 8px; page-break-inside: avoid;">
          <strong style="color: #111827;">Step ${c.step || '•'}: ${escapeHtml(c.title || '')}</strong>
          ${c.priority ? `<span style="font-size: 8pt; text-transform: uppercase; font-weight: 700; margin-left: 6px; color: #4b5563;">[Priority: ${escapeHtml(c.priority)}]</span>` : ''}
          <div style="font-size: 9.5pt; color: #374151; margin-top: 2px;">${escapeHtml(c.description || '')}</div>
          ${c.estimatedDivertRate ? `<div style="font-size: 8.5pt; color: #111827; font-weight: 600; margin-top: 2px;">Estimated Divert Impact: ${escapeHtml(c.estimatedDivertRate)}</div>` : ''}
        </li>
      `).join('')
    : '<p style="color: #4b5563; font-style: italic; margin-bottom: 16px;">No specific operational sorting steps required for this batch.</p>';

  // Generate recommendations
  const recommendationsHtml = recommendations.length > 0
    ? recommendations.map((r) => `<li style="margin-bottom: 5px; color: #374151;">${escapeHtml(r)}</li>`).join('')
    : '<li style="color: #666;">Standard facility operational conveyor procedures apply.</li>';

  // Construct report markup
  const reportContent = `
    <!-- Header Block -->
    <table style="width: 100%; border-bottom: 2px solid #111827; padding-bottom: 10px; margin-bottom: 16px; border-collapse: collapse;">
      <tr>
        <td style="vertical-align: top; border: none; padding: 0;">
          <div style="font-size: 18pt; font-weight: 800; letter-spacing: -0.5px; color: #111827; line-height: 1.1;">EcoSort AI</div>
          <div style="font-size: 9pt; color: #4b5563; margin-top: 3px; text-transform: uppercase; letter-spacing: 0.5px;">
            AI-Based Intelligent Waste Segregation &amp; Recycling Assessment System
          </div>
        </td>
        <td style="text-align: right; vertical-align: top; font-size: 9pt; color: #4b5563; border: none; padding: 0;">
          <div><strong style="color: #111827;">Document ID:</strong> ${escapeHtml(result.id || 'N/A')}</div>
          <div><strong style="color: #111827;">Inspected:</strong> ${escapeHtml(formattedDate)}</div>
          <div><strong style="color: #111827;">Target Stream:</strong> ${escapeHtml((result.wasteStream || '').replace(/_/g, ' '))}</div>
        </td>
      </tr>
    </table>

    <!-- Batch Metadata Card -->
    <div style="border: 1px solid #d1d5db; border-radius: 6px; padding: 8px 12px; margin-bottom: 14px; background-color: #fafafa;">
      <table style="width: 100%; border-collapse: collapse; font-size: 9pt;">
        <tr>
          <td style="border: none; padding: 2px 8px 2px 0; width: 50%;"><strong style="color: #111827;">Batch Identifier:</strong> ${escapeHtml(result.batchName || 'Unassigned')}</td>
          <td style="border: none; padding: 2px 0 2px 8px; width: 50%;"><strong style="color: #111827;">Recycling Suitability:</strong> ${escapeHtml((result.streamSuitability || '').replace(/_/g, ' '))}</td>
        </tr>
        <tr>
          <td style="border: none; padding: 2px 8px 2px 0;"><strong style="color: #111827;">Inspection Station:</strong> ${escapeHtml(result.facilityLine || 'Standard Inspection Point')}</td>
          <td style="border: none; padding: 2px 0 2px 8px;"><strong style="color: #111827;">Risk Tier:</strong> ${escapeHtml(result.overallRisk || 'N/A')}</td>
        </tr>
        ${result.operatorNotes ? `
        <tr>
          <td colspan="2" style="border: none; padding: 4px 0 0 0;"><strong style="color: #111827;">Field Notes:</strong> ${escapeHtml(result.operatorNotes)}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    <!-- Metric KPI Blocks -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
      <tr>
        <td style="width: 33.3%; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; text-align: center; background-color: #ffffff;">
          <div style="font-size: 8pt; text-transform: uppercase; font-weight: 600; color: #4b5563;">Contamination Score</div>
          <div style="font-size: 18pt; font-weight: 800; font-family: monospace; color: #111827; margin-top: 2px;">${contaminationScore}%</div>
        </td>
        <td style="width: 33.3%; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; text-align: center; background-color: #ffffff;">
          <div style="font-size: 8pt; text-transform: uppercase; font-weight: 600; color: #4b5563;">Purity Index</div>
          <div style="font-size: 18pt; font-weight: 800; font-family: monospace; color: #111827; margin-top: 2px;">${purityIndex}%</div>
        </td>
        <td style="width: 33.3%; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; text-align: center; background-color: #ffffff;">
          <div style="font-size: 8pt; text-transform: uppercase; font-weight: 600; color: #4b5563;">Suitability Verdict</div>
          <div style="font-size: 12pt; font-weight: 800; color: #111827; margin-top: 5px;">${escapeHtml((result.streamSuitability || '').replace(/_/g, ' '))}</div>
        </td>
      </tr>
    </table>

    <!-- 01. Visual Analysis Summary -->
    <h2 style="font-size: 11pt; font-weight: 700; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px; margin: 14px 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px; color: #111827;">
      01. Visual Analysis Summary
    </h2>
    <p style="font-size: 9.5pt; line-height: 1.45; margin: 0 0 6px 0; color: #1f2937;">
      ${escapeHtml(result.summaryProse || 'Assessment generated via automated visual inspection.')}
    </p>
    <p style="font-size: 9pt; color: #374151; margin: 0 0 14px 0;">
      <strong style="color: #111827;">Suitability Rationale:</strong> ${escapeHtml(result.suitabilityReason || 'Standard verification against stream specifications.')}
    </p>

    <!-- 02. Material Composition Breakdown -->
    <h2 style="font-size: 11pt; font-weight: 700; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px; margin: 14px 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px; color: #111827;">
      02. Material Composition Breakdown
    </h2>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 9pt;">
      <thead>
        <tr style="background-color: #f3f4f6;">
          <th style="padding: 5px 8px; border: 1px solid #d1d5db; text-align: left; font-weight: 700;">Material Item</th>
          <th style="padding: 5px 8px; border: 1px solid #d1d5db; text-align: left; font-weight: 700;">Category</th>
          <th style="padding: 5px 8px; border: 1px solid #d1d5db; text-align: right; font-weight: 700;">Est. %</th>
          <th style="padding: 5px 8px; border: 1px solid #d1d5db; text-align: right; font-weight: 700;">Confidence</th>
          <th style="padding: 5px 8px; border: 1px solid #d1d5db; text-align: center; font-weight: 700;">Stream Compatibility</th>
        </tr>
      </thead>
      <tbody>
        ${materialsRows}
      </tbody>
    </table>

    <!-- 03. Contamination Alerts & Evidence -->
    <h2 style="font-size: 11pt; font-weight: 700; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px; margin: 14px 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px; color: #111827;">
      03. Contamination Alerts &amp; Evidence
    </h2>
    ${alertsHtml}

    <!-- 04. Corrective-Action Checklist -->
    <h2 style="font-size: 11pt; font-weight: 700; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px; margin: 14px 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px; color: #111827;">
      04. Corrective Segregation Checklist
    </h2>
    <ul style="margin: 0 0 14px 0; padding-left: 20px;">
      ${checklistHtml}
    </ul>

    <!-- 05. Segregation Directives -->
    <h2 style="font-size: 11pt; font-weight: 700; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px; margin: 14px 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px; color: #111827;">
      05. Segregation Directives &amp; Guidance
    </h2>
    <ul style="margin: 0 0 14px 0; padding-left: 20px; font-size: 9pt;">
      ${recommendationsHtml}
    </ul>

    <!-- Inspector Sign-Off -->
    <div style="margin-top: 20px; padding-top: 8px; page-break-inside: avoid;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="width: 48%; border: none; padding-right: 15px; vertical-align: top;">
            <div style="border-bottom: 1px solid #111827; height: 24px; margin-bottom: 3px;"></div>
            <div style="font-size: 8pt; color: #4b5563;">Quality Inspector (Signature)</div>
          </td>
          <td style="width: 4%; border: none;"></td>
          <td style="width: 48%; border: none; padding-left: 15px; vertical-align: top;">
            <div style="border-bottom: 1px solid #111827; height: 24px; margin-bottom: 3px;"></div>
            <div style="font-size: 8pt; color: #4b5563;">Date of Disposition</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Mandatory Uncertainty Notice -->
    <div style="margin-top: 20px; padding: 8px 10px; border: 1px solid #d1d5db; background-color: #f9fafb; border-radius: 4px; font-size: 8pt; color: #4b5563; line-height: 1.4; page-break-inside: avoid;">
      <strong style="color: #111827;">Uncertainty &amp; Operating Limitations:</strong> Results are image-based estimates. Hidden chemical or microbial contamination cannot be verified from an RGB image. Follow local municipal and recycler guidelines.
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
