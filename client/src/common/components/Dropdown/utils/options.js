export const timeOptions = {
    1: "24 Stunden (Standard)",
    2: "2 Tage (Insgesamt)",
    3: "7 Tage (Durchschnitt)",
    4: "30 Tage (Durchschnitt)"
};

export const selectOptions = {
    "* * * * *": "Durchgehend (jede Minute)",
    "0,30 * * * *": "Sehr häufig (alle 30 Minuten)",
    "0 * * * *": "Standard (jede Stunde)",
    "0 0,3,6,9,12,15,18,21 * * *": "Selten (alle 3 Stunden)",
    "0 0,6,12,18 * * *": "Sehr selten (alle 6 Stunden)"
}

export const languageOptions = {
    "en": "English",
    "de": "Deutsch"
}

export const exportOptions = {
    json: "JSON-Datei",
    csv: "CSV-Datei"
}