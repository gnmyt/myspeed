# Windows Setup
Hier beschreiben wir die Einrichtung für Windows.

## Installation von MySpeed

1. NodeJS herunterladen  
   Um MySpeed zu verwenden, benötigst du zuerst **NodeJS**. Du kannst den Installer ganz einfach [hier](https://nodejs.org/en/download/) herunterladen. Empfohlen wird die LTS-Version 18 von NodeJS.

2. MySpeed herunterladen  
   Lade jetzt die neueste Version von MySpeed herunter. Die aktuellste Version findest du [hier](https://github.com/gnmyt/myspeed/releases/latest). Lade die Datei "MySpeed-x.x.x-zip" von hier herunter.

3. Datei entpacken  
   Entpacke nun die heruntergeladene Datei an einen Ort deiner Wahl. Am besten an einen Ort, den du später wiederfindest 🌚.

4. Installation testen  
   Navigiere zuerst in den Ordner, wo du die Datei entpackt hast. Klicke in einen leeren Bereich dieses Ordners mit `Shift` + `Rechtsklick` und wähle "Öffnen in Powershell".  
   Füge nun diesen Befehl in das Konsolenfenster ein und drücke `Enter`:
   ```sh
   npm install
   ```

   ::: warning Schlägt die NPM-Installation fehl?
   Möglicherweise gibt es keine vorkompilierten Module für dein System. In diesem Fall musst du die Module selbst kompilieren.
   Folge diesen Schritten:

   1. Python herunterladen  
      Um das Projekt zu "bauen", benötigst du auch Python. Du kannst es [hier](https://www.python.org/downloads/) herunterladen.

   2. Visual Studio BuildTools herunterladen  
      Das Tool "node-gyp" erfordert auch Visual Studio BuildTools, um das Projekt erfolgreich zu "bauen". So funktioniert es:
      1. Klicke [auf diesen Link](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools) und warte einen Moment, bis der Download startet.
      2. Öffne die Datei und klicke auf "Weiter".
      3. Wähle jetzt die optionale Workload "Desktopentwicklung mit C++" aus und bestätige deine Auswahl durch Klicken auf "Installieren".
   3. Führe `npm install` erneut aus.
      :::
      Wenn alles erfolgreich durchläuft, hast du alles richtig gemacht! Herzlichen Glückwunsch. :)  
      Du kannst MySpeed jetzt mit diesem Befehl in Powershell starten.

5. MySpeed starten
   ```powershell
   $env:NODE_ENV="production"; node server
   ```

## Automatischer Start mit dem Autostart-Ordner in Windows

1. Autostart-Ordner in Windows öffnen  
   Drücke gleichzeitig die Tasten (`Windows` + `R`) auf deiner Tastatur, bis ein Ausführen-Dialog erscheint. Gib dann `%USERPROFILE%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup` ein und drücke `Enter`.

2. Autostart-Datei erstellen  
   Stelle sicher, dass du [Dateinamenerweiterungen aktiviert](https://support.microsoft.com/en-us/windows/common-file-name-extensions-in-windows-da4a4430-8e76-89c5-59f7-1cdbbc75cb01) hast. Wenn das erledigt ist, erstelle ein neues Dokument mit `Rechtsklick` > `Neu` > `Textdokument`.  
   Drücke dann `Strg` + `A` und benenne es als "MySpeed.bat". Drücke dann zweimal `Enter`.

3. Inhalt erstellen  
   Klicke mit `Rechtsklick` und wähle `Bearbeiten`. Füge dann den folgenden Code ein und passe den Installationsort an:
   ```batch
   @echo off
   cd "C:\Users\Desktop\MySpeed"
   set NODE_ENV=production
   node server
   ```

4. Wenn alles funktioniert hat, sollte MySpeed jetzt automatisch starten, wenn das System hochfährt.
