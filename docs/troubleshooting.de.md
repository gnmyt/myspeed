# Fehlerbehebung

In diesem Guide erfährst du, wie du bekannte Fehler mit diesem Dienst behebst.

??? failure "Could not open the database file. Maybe it is damaged?"
    Bei diesem Fehler kann es mehrere Lösungen geben. Arbeite einfach alle Möglichkeiten durch und dein Problem sollte gelöst sein. :)  
    
    1. Berechtigungen setzen   
    Um die Berechtigungen zu setzen, gib den Befehl `chmod 700 /opt/myspeed` ein. (Ersetze /opt/myspeed mit deinem Installationsort)
    
    2. Build Essentials Installieren   
    Es ist aktuell möglich, dass der Fehler auftritt, weil das Paket `build-essential` nicht installiert ist. Installiere es ganz einfach mit dem Befehl `sudo apt-get install build-essential` nach.
    
    3. Führe eine Neuinstallation der Module aus   
    Gib zuerst den Befehl `rm -R node_modules` im Installationsordner ein, um die Module zu löschen und installiere sie dann mit `npm install` nach.

??? failure "Diese MySpeed-Instanz befindet sich aktuell im Entwicklungsmodus"
    Das ist nicht wirklich ein Fehler, lediglich eine Sicherung um das Tool nur in Produktionsumgebungen verwenden zu können.
    Setze dazu die Umgebungsvariable `NODE_ENV` auf den Wert `production`.  
    Unter Linux erreichst du das mit `export NODE_ENV=production` und unter Windows in der Powershell mit `$env:NODE_ENV="production"`  
    Lies dir auch mal den [Guide zur 24/7 Installation](../setup/linux) durch,
    wenn du planst, MySpeed im Hintergrund laufen zu lassen und beim Systemstart automatisch hochzufahren.