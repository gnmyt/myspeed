# Setup Windows
Here we describe the setup for Windows.

1. Download NodeJS  
   To use MySpeed, you first need **NodeJS**. You can easily download the installer [here](https://nodejs.org/en/download/). Recommended is the LTS version 18 of NodeJS.

2. Download MySpeed  
   Now download the latest version of MySpeed. You can find the latest release [here](https://github.com/gnmyt/myspeed/releases/latest). Download the file "MySpeed-x.x.x-zip" from here.

3. Unpack the file  
   Now unzip the downloaded file to a place of your choice. Preferably to a place that you know afterwards 🌚.

4. Test your installation  
   First navigate to the folder where you unzipped the file. Click with `Shift` + `Right click` into an empty area in this folder and select "Open in Powershell".  
   Now paste this command into the console window and press `Enter`:
   ```sh
   npm install
   ```
   
    ??? warning "Does the NPM installation fail?"
        There is a possibility that there are no precompiled modules for your system. In this case you have to compile the modules yourself.
        Follow these steps:

        1. Download Python  
            To "build" the project, you also need to download Python. You can do this [here](https://www.python.org/downloads/).

        2. Download the Visual Studio BuildTools  
            The "node-gyp" tool also requires Visual Studio's BuildTools to successfully "build" the project. Here's how it works:
            1. click [on this link](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools) and wait a short time until the download starts
            2. open the file and click "continue
            3. now select the optional workload "Desktop development with C++" and confirm your selection by clicking on "Install
        3. run `npm install` again
   If everything runs successfully, you did everything right! Congratulations. :)   
   You can now start MySpeed with this command in your Powershell.

5. Start MySpeed
   ```powershell
   $env:NODE_ENV="production"; node server
   ```

## Automatic startup using the autostart folder in Windows

1. Open the autostart folder in windows  
   Press both keys (`Windows` + `R`) simultaneously on your keyboard until a Run dialog appears. Then type `%USERPROFILE%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup` and press `Enter`.

2. Create the autostart file  
   First make sure you have [filename extensions active](https://support.microsoft.com/en-us/windows/common-file-name-extensions-in-windows-da4a4430-8e76-89c5-59f7-1cdbbc75cb01). Once this is done. Create a new document with `Right click` > `New` > `Text document`.  
   Then press `CTRL` + `A` and write as filename "MySpeed.bat". Then press `Enter` 2 times

3. Create the content  
   Right click and select `Edit`. Then paste the code from below and adjust your installation location.
   ```batch
   @echo off
   cd "C:\Users\Desktop\MySpeed"
   set NODE_ENV=production
   node server
   ```

4. If everything worked, MySpeed should now start automatically when the system is started.