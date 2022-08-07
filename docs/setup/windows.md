# Einrichtung Windows
Hier wird die Einrichtung für Windows beschrieben.

1. Lade NodeJS herunter  
   Um MySpeed nutzen zu können, benötigst du zuerst **NodeJS**. Du kannst dir den Installer ganz einfach [hier](https://nodejs.org/de/download/) herunterladen. Empfohlen wird die LTS-Version 16 von NodeJS

2. Lade Python herunter  
   Um das Projekt "bauen" zu können, musst du dir ebenfalls noch Python herunterladen. Dies kannst du [hier](https://www.python.org/downloads/).

3. Lade die Visual Studio BuildTools herunter  
   Das Tool "node-gyp" benötigt ebenfalls die BuildTools von Visual Studio, um das Projekt erfolgreich "bauen" zu können. So funktioniert das:
    1. Klicke [auf diesen Link](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools) und warte kurz, bis der Download startet
    2. Öffne die Datei und klicke "Fortfahren"
    3. Wähle nun noch den optionalen Workload "Desktopentwicklung mit C++" aus und bestätige deine Auswahl mit einem Klick auf "Install"

4. Lade MySpeed herunter  
   Lade nun die neuste Version von MySpeed herunter. Du findest [hier](https://github.com/gnmyt/myspeed/releases/latest) den neusten Release. Lade dir hiervon die Datei "MySpeed-x.x.x-zip" herunter

5. Entpacke die Datei  
   Entpacke nun die gerade heruntergeladene Datei an einen Ort deiner Wahl. Am besten an einen Ort, den du nachher noch kennst 🌚

6. Teste deine Installation  
   Navigiere zuerst in den Ordner, in welchen du die Datei entpackt hast. Klicke mit `Shift` + `Linksklick` in einen leeren Bereich in diesem Ordner und wähle "In Powershell öffnen".  
   Nun fügst du diesen Befehl in das Konsolenfenster ein und drückst `Enter`:
   ```sh
   npm install 
   ```
   Wird alles erfolgreich ausgeführt, dann hast du alles richtig gemacht! Glückwunsch. :)  
   Ist das allerdings nicht der Fall, sieh dir unseren Guide zur Fehlerbehebung an, um deine Probleme zu beheben.  
   Du kannst nun MySpeed mit diesem Befehl in deiner Powershell starten.

7. MySpeed starten
   ```powershell
   $env:NODE_ENV="production"; node server
   ```

## Automatisches hochfahren mithilfe von Autostart-Ordner in Windows

1. Öffne den Autostart-Ordner in Windows  
   Drücke auf deiner Tastatur die beiden Tasten `Windows` + `R` gleichzeitig, bis ein Ausführen-Dialog erscheint. Gib dort dann `%USERPROFILE%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup` ein und drücke `Enter`.

2. Erstellen der Autostart-Datei  
   Stelle zuerst sicher, dass du die [Dateinamenerweiterungen aktiv hast](https://support.microsoft.com/de-de/windows/allgemeine-dateierweiterungen-in-windows-da4a4430-8e76-89c5-59f7-1cdbbc75cb01). Ist das getan. Erstelle mit `Rechtsklick` > `Neu` > `Textdokument` ein neues Dokument.  
   Drücke dann `STRG` + `A` und schreibe als Dateinamen "MySpeed.bat". Drücke dann 2 mal `Enter`

3. Erstellen des Inhalts  
   Mache einen Rechtsklick und wähle `Bearbeiten`. Füge dort dann den Code von unten ein und passe deinen Installationsort an.
   ```batch
   @echo off
   cd "C:\Users\Benutzer\Desktop\MySpeed"
   set NODE_ENV=production
   node server
   ```

4. Hat alles funktioniert, sollte MySpeed nun automatisch beim Start des Systems ebenfalls hochfahren.