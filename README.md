# Sheet Metal Perforation Calculator

Standalone engineering demo based on an existing perforation pricing calculator. Includes original visual reference diagrams and original CSS sources, a responsive calculation UI, one-field-per-line clipboard report, and an A4 print-to-PDF report.

## Run

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`. No build tools, API keys or server-side runtime required.

## PDF export

Click **Сохранить в PDF**, then choose **Save as PDF** in the browser print dialog. The print layout contains a separate line for each input and computed metric. Browser PDF saving works offline.

## Origin assets

`assets/css/style.css`, `assets/css/calculator.css`, and `assets/img/perforation-illustration-*.png` were copied from the user-provided original calculator archive. The self-contained demo overrides legacy global styling through `style.css`.

## Limitations

Estimates are demonstrative. Confirm mesh conventions, machine settings, cut planning, material yield and production tolerance with an engineer before manufacturing. No invoices, customer files or credentials are included.
