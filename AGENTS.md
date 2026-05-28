# AGENTS.md

## Grundregler

Följ clean architecture och separation of concerns.

Skriv inte all kod i samma fil. Skapa nya filer när ansvar skiljer sig åt eller när en fil blir svår att läsa.

Blanda inte:
- UI
- API-anrop
- affärslogik
- validering
- databasåtkomst
- stylinglogik
- konfiguration

Varje fil ska ha ett tydligt ansvar.

## Rekommenderad ansvarsfördelning

Frontend:
- Components: rendering och användarinteraktion
- Hooks: återanvändbar frontend-logik
- Services: API-anrop
- Types: typer och interfaces
- Utils: små generella hjälpfunktioner
- Styles: CSS och styling

Backend:
- Routes: endpoints
- Controllers: request/response
- Use cases: affärslogik
- Repositories: databasåtkomst
- Models/Schemas: datastrukturer och validering
- Middlewares: gemensam requesthantering
- Services: externa integrationer

## Filstorlek

Dela upp filer när:
- filen får flera ansvar
- komponenten blir svår att läsa
- funktioner blir långa
- logik återanvänds
- route/controller innehåller affärslogik
- komponent innehåller API-logik

## Verifiering

Agenten ska verifiera kodändringar tekniskt när det är möjligt.

Kör i första hand:

```bash
npm run build
npm run lint
npm run test
```

`npm run build` verifierar att projektet kompilerar, men bekräftar inte att UI ser rätt ut.

Vid UI-, CSS-, layout-, animation- eller responsivitetsändringar ska agenten skriva att användaren behöver göra visuell kontroll i webbläsaren.

## Svarskrav

Om ny fil adderas: förklara kort fils ansvar.

## Beslutsregel

Om en ändring gör en fil större, mer blandad eller svårare att felsöka ska koden delas upp i tydligt namngivna filer.