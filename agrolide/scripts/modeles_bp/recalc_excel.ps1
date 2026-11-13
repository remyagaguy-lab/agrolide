# Recalcule un classeur avec Excel (COM), signale toute erreur de formule et enregistre le résultat (valeurs en cache).
# Usage : powershell -File recalc_excel.ps1 -In brut.xlsx -Out final.xlsx [-Dump "FEUILLE!A1,FEUILLE!B2"]
param([string]$In, [string]$Out, [string]$Dump = "")
$xl = New-Object -ComObject Excel.Application
$xl.Visible = $false
$xl.DisplayAlerts = $false
try {
  $wb = $xl.Workbooks.Open($In)
  $xl.CalculateFull()
  $errs = 0; $formulas = 0
  foreach ($ws in $wb.Worksheets) {
    $used = $ws.UsedRange
    $rows = $used.Rows.Count; $cols = $used.Columns.Count
    $r0 = $used.Row; $c0 = $used.Column
    for ($r = 0; $r -lt $rows; $r++) {
      for ($c = 0; $c -lt $cols; $c++) {
        $cell = $ws.Cells.Item($r0 + $r, $c0 + $c)
        if ($cell.HasFormula) { $formulas++ }
        $t = $cell.Text
        if ($t -match '^#(REF|NAME|VALUE|DIV|N/A|NUM|NULL)' -or $t -eq '#####' -and $false) {
          $errs++; Write-Output ("ERREUR " + $ws.Name + "!" + $cell.Address($false, $false) + " : " + $t + "  " + $cell.Formula)
        }
      }
    }
  }
  Write-Output ("Formules : " + $formulas + " ; erreurs : " + $errs)
  if ($Dump -ne "") {
    foreach ($ref in $Dump.Split(",")) {
      $p = $ref.Split("!"); $v = $wb.Worksheets.Item($p[0]).Range($p[1])
      Write-Output ($ref + " = " + $v.Text)
    }
  }
  if ($Out -ne "") { $wb.SaveAs($Out, 51) }
  $wb.Close($false)
} finally { $xl.Quit() }
